// public/dashboard-unified-script.js

// Variables globales (si es necesario que sean accesibles desde fuera de las funciones)
let mapa;
let chat = [];

// Función de inicialización principal que será llamada por la API de Google Maps
async function initDashboard() {
  // Hacemos esta función async para poder usar await dentro
  // --- Lógica de Mapa y Chat (originalmente de script.js) ---
  mapa = new google.maps.Map(document.getElementById("mapa"), {
    center: { lat: -0.22985, lng: -78.52495 }, // Quito por defecto
    zoom: 14,
  });

  document
    .getElementById("form-ubicacion")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const partida = document.getElementById("partida").value;
      const destino = document.getElementById("destino").value;

      const mensaje = `Compartió ruta: ${partida} → ${destino}`;
      chat.push(mensaje);
      actualizarChat();
      // Opcional: Limpiar los campos después de enviar
      document.getElementById("partida").value = "";
      document.getElementById("destino").value = "";
    });

  // Event listener para el input del chat (enviar con Enter)
  const mensajeInput = document.getElementById("mensaje");
  if (mensajeInput) {
    mensajeInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        enviarMensaje();
      }
    });
  }

  // --- Lógica de Gestión de Viajes (originalmente de script2.js) ---
  const viajesContainer = document.getElementById("viajes-container");
  const btnCrearViaje = document.getElementById("btn-crear-viaje");
  const crearViajeModalElement = document.getElementById("crearViajeModal");
  const crearViajeModal = crearViajeModalElement
    ? new bootstrap.Modal(crearViajeModalElement)
    : null;
  const formCrearViaje = document.getElementById("form-crear-viaje");
  const puntoEncuentroSelect = document.getElementById("punto_encuentro_id"); // Asegúrate de que este ID exista en tu HTML

  // Cargar viajes al iniciar el dashboard
  cargarViajes();

  // Cargar puntos de encuentro al iniciar el dashboard
  if (puntoEncuentroSelect) {
    await cargarPuntosEncuentro(puntoEncuentroSelect); // Llama a la nueva función
  }

  // Event listener para el botón de "Crear Viaje"
  if (btnCrearViaje) {
    btnCrearViaje.addEventListener("click", () => {
      if (crearViajeModal) crearViajeModal.show();
    });
  }

  // Event listener para el formulario de creación de viaje
  if (formCrearViaje) {
    formCrearViaje.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        conductor_id: document.getElementById("conductor_id").value,
        punto_encuentro_id: document.getElementById("punto_encuentro_id").value, // Ya debería tener un valor seleccionado
        hora_salida: document.getElementById("hora_salida").value,
        cupos_disponibles: document.getElementById("cupos_disponibles").value,
      };

      try {
        const token = getToken();
        if (!token) {
          alert("No autenticado. Por favor, inicia sesión.");
          window.location.href = "/login";
          return;
        }

        // Aquí se verifica el rol del usuario que intenta crear el viaje
        // Si la ruta /viaje en tu backend tiene authorizeRoles(['conductor']),
        // el token debe ser de un conductor.
        const response = await fetch("/viaje", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        if (response.status === 401 || response.status === 403) {
          alert(
            "No autorizado para crear viajes. Sesión expirada o rol incorrecto. Solo conductores pueden crear viajes."
          );
          localStorage.removeItem("jwtToken");
          window.location.href = "/login";
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status} - ${errorData.message || response.statusText
            }`
          );
        }

        alert("Viaje creado con éxito");
        if (crearViajeModal) crearViajeModal.hide(); // Cerrar el modal
        formCrearViaje.reset(); // Limpiar el formulario
        cargarViajes(); // Recargar la lista de viajes
      } catch (error) {
        console.error("Error al crear viaje:", error);
        alert(`No se pudo crear el viaje: ${error.message}.`);
      }
    });
  }
}

// Funciones auxiliares (originalmente de script.js)
function enviarMensaje() {
  const input = document.getElementById("mensaje");
  const texto = input.value.trim();
  if (texto !== "") {
    chat.push(`Tú: ${texto}`); // Simula un mensaje del usuario
    input.value = "";
    actualizarChat();
    // Aquí podrías añadir una llamada a tu backend para enviar el mensaje real
  }
}

function actualizarChat() {
  const chatDiv = document.getElementById("chat");
  if (chatDiv) {
    chatDiv.innerHTML = chat.map((msg) => `<div>${msg}</div>`).join("");
    chatDiv.scrollTop = chatDiv.scrollHeight;
  }
}

// Funciones auxiliares (originalmente de script2.js)
function getToken() {
  return localStorage.getItem("jwtToken"); // Asegúrate de que este sea el nombre correcto
}

async function cargarViajes() {
  const viajesContainer = document.getElementById("viajes-container");
  if (!viajesContainer) {
    console.warn(
      "Contenedor de viajes no encontrado. La funcionalidad de viajes no se cargará."
    );
    return;
  }

  viajesContainer.innerHTML = ""; // Limpiar contenido existente
  try {
    const token = getToken();
    if (!token) {
      console.warn("No autenticado para cargar viajes. Redirigiendo a login.");
      window.location.href = "/login"; // Redirige si no hay token
      return;
    }

    const response = await fetch("/viaje", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      alert(
        "Sesión expirada o no autorizado para ver viajes. Por favor, inicia sesión de nuevo."
      );
      localStorage.removeItem("jwtToken");
      window.location.href = "/login";
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const viajes = await response.json();
    if (viajes.length === 0) {
      viajesContainer.innerHTML = "<p>No hay viajes disponibles.</p>";
      return;
    }

    viajes.forEach((viaje) => {
      const viajeCard = `
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="card-title">Viaje ${viaje.id}</h5>
                        <p><b>Conductor:</b> ${viaje.conductor_nombre || "N/A"
        }</p>
                        <p><b>Punto de Encuentro:</b> ${viaje.punto_encuentro_nombre || "N/A"
        } (${viaje.punto_encuentro_direccion || "N/A"})</p>
                        <p><b>Hora de Salida:</b> ${new Date(
          viaje.hora_salida
        ).toLocaleString()}</p>
                        <p><b>Cupos Disponibles:</b> ${viaje.cupos_disponibles
        }</p>
                    </div>
                </div>
            `;
      viajesContainer.innerHTML += viajeCard;
    });
  } catch (error) {
    console.error("Error al cargar los viajes:", error);
    alert("No se pudieron cargar los viajes. Intenta de nuevo más tarde.");
  }
}

// NUEVA FUNCIÓN: Cargar y popular los puntos de encuentro
async function cargarPuntosEncuentro(selectElement) {
  selectElement.innerHTML =
    '<option value="">Cargando puntos de encuentro...</option>';
  try {
    const token = getToken(); // Necesitas un token para acceder a esta ruta si está protegida
    if (!token) {
      console.warn(
        "No autenticado para cargar puntos de encuentro. Asegúrate de iniciar sesión."
      );
      // No redirigimos aquí, solo advertimos, ya que el dashboard puede cargar sin puntos al inicio
      selectElement.innerHTML =
        '<option value="">Error al cargar (no autenticado)</option>';
      return;
    }

    const response = await fetch("/punto-encuentro", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 401 || response.status === 403) {
      console.warn(
        "Sesión expirada o no autorizado para ver puntos de encuentro."
      );
      selectElement.innerHTML =
        '<option value="">Error al cargar (permiso denegado)</option>';
      return;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const puntosEncuentro = await response.json();

    selectElement.innerHTML =
      '<option value="">Selecciona un punto de encuentro</option>'; // Opción por defecto
    puntosEncuentro.forEach((punto) => {
      const option = document.createElement("option");
      option.value = punto.id;
      option.textContent = `${punto.nombre} (${punto.direccion})`;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error("Error al cargar los puntos de encuentro:", error);
    selectElement.innerHTML =
      '<option value="">Error al cargar puntos de encuentro</option>';
  }
}

// Nota: La función initDashboard se llama como callback de la API de Google Maps.
// No es necesario document.addEventListener('DOMContentLoaded', ...) si usas el callback.
