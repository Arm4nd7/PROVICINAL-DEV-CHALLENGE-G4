// document.addEventListener('DOMContentLoaded', async () => {
//     const viajesContainer = document.getElementById('viajes-container');
//     const btnCrearViaje = document.getElementById('btn-crear-viaje');
//     const crearViajeModal = new bootstrap.Modal(document.getElementById('crearViajeModal'));
//     const formCrearViaje = document.getElementById('form-crear-viaje');
//     const puntoEncuentroSelect = document.getElementById('punto_encuentro_id');

//     // Función para obtener el token JWT (asume que lo guardaste en localStorage después del login)
//     function getToken() {
//         return localStorage.getItem('jwtToken'); // Asegúrate de que este sea el nombre correcto
//     }

//     // Función para cargar y mostrar los viajes
//     async function cargarViajes() {
//         viajesContainer.innerHTML = ''; // Limpiar contenido existente
//         try {
//             const token = getToken();
//             if (!token) {
//                 alert('No autenticado. Por favor, inicia sesión.');
//                 // Redirige al login si no hay token
//                 window.location.href = '/login';
//                 return;
//             }

//             const response = await fetch('/viaje', {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json'
//                 }
//             });

//             if (response.status === 401 || response.status === 403) {
//                 alert('Sesión expirada o no autorizado. Por favor, inicia sesión de nuevo.');
//                 localStorage.removeItem('jwtToken');
//                 window.location.href = '/login';
//                 return;
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
//             }

//             const viajes = await response.json();

//             if (viajes.length === 0) {
//                 viajesContainer.innerHTML = '<p class="text-center mt-5">No hay viajes disponibles.</p>';
//                 return;
//             }

//             viajes.forEach(viaje => {
//                 const cardHtml = `
//                     <div class="card" style="width: 25rem;">
//                         <div class="card-body">
//                             <img src="https://via.placeholder.com/150" class="card-img-top" alt="carro">
//                             <h5 class="card-title">Conductor: ${viaje.conductor_nombre}</h5>
//                             <p class="card-text">Teléfono: ${viaje.conductor_telefono || 'N/A'}</p>
//                         </div>
//                         <div class="card-body">
//                             <p class="btn btn-primary">${new Date(viaje.hora_salida).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
//                             <p class="card-text">Punto de Partida: ${viaje.punto_encuentro_nombre} (${viaje.punto_encuentro_direccion})</p>
//                             <p class="card-text">Cupos: ${viaje.cupos_disponibles}</p>
//                             <button class="btn btn-danger btn-eliminar" data-id="${viaje.id}">Eliminar</button>
//                         </div>
//                     </div>
//                 `;
//                 viajesContainer.insertAdjacentHTML('beforeend', cardHtml);
//             });

//             // Añadir listeners a los botones de eliminar
//             document.querySelectorAll('.btn-eliminar').forEach(button => {
//                 button.addEventListener('click', eliminarViaje);
//             });

//         } catch (error) {
//             console.error('Error al cargar viajes:', error);
//             alert(`Error al cargar viajes: ${error.message}.`);
//         }
//     }

//     async function cargarPuntosEncuentro() {
//         try {
//             const response = await fetch('/punto-encuentro', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json'
//                     // No necesitas 'Authorization' aquí si GET /punto-encuentro es público
//                     // Si GET /punto-encuentro requiere autenticación, añade:
//                     // 'Authorization': `Bearer ${getToken()}`
//                 }
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`Error al cargar puntos de encuentro: ${errorData.message || response.statusText}`);
//             }

//             const puntos = await response.json();

//             puntoEncuentroSelect.innerHTML = '<option value="">Selecciona un punto de encuentro...</option>';
//             puntos.forEach(punto => {
//                 const option = document.createElement('option');
//                 option.value = punto.id;
//                 option.textContent = `${punto.nombre} (${punto.direccion})`;
//                 puntoEncuentroSelect.appendChild(option);
//             });

//         } catch (error) {
//             console.error('Error al cargar los puntos de encuentro:', error);
//             puntoEncuentroSelect.innerHTML = '<option value="">Error al cargar puntos de encuentro</option>';
//             // alert('Error al cargar los puntos de encuentro. Intenta de nuevo más tarde.');
//         }
//     }

//     crearViajeModal._element.addEventListener('show.bs.modal', () => {
//         cargarPuntosEncuentro();
//     });

//     // Función para eliminar un viaje
//     async function eliminarViaje(event) {
//         const id = event.target.dataset.id;
//         if (!confirm(`¿Estás seguro de que quieres eliminar el viaje con ID ${id}?`)) {
//             return;
//         }

//         try {
//             const token = getToken();
//             if (!token) {
//                 alert('No autenticado. Por favor, inicia sesión.');
//                 window.location.href = '/login';
//                 return;
//             }

//             const response = await fetch(`/viaje/${id}`, {
//                 method: 'DELETE',
//                 headers: {
//                     'Authorization': `Bearer ${token}`
//                 }
//             });

//             if (response.status === 401 || response.status === 403) {
//                 alert('No autorizado para eliminar este viaje. Sesión expirada o rol incorrecto.');
//                 localStorage.removeItem('jwtToken');
//                 window.location.href = '/login';
//                 return;
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
//             }

//             alert('Viaje eliminado con éxito');
//             cargarViajes(); // Recargar la lista de viajes
//         } catch (error) {
//             console.error('Error al eliminar viaje:', error);
//             alert(`No se pudo eliminar el viaje: ${error.message}.`);
//         }
//     }

//     // Event listener para el botón "Crear Viaje" (abre el modal)
//     btnCrearViaje.addEventListener('click', () => {
//         formCrearViaje.reset(); // Limpiar el formulario
//         crearViajeModal.show();
//     });

//     // Event listener para el envío del formulario de "Crear Viaje"
//     formCrearViaje.addEventListener('submit', async (event) => {
//         event.preventDefault();

//         const punto_encuentro_id = document.getElementById('punto_encuentro_id').value;
//         const hora_salida = document.getElementById('hora_salida').value;
//         const cupos_disponibles = document.getElementById('cupos_disponibles').value;

//         if (!punto_encuentro_id) {
//             alert('Por favor, selecciona un punto de encuentro.');
//             return;
//         }

//         const data = {
//             // conductor_id: parseInt(conductor_id),
//             punto_encuentro_id: parseInt(punto_encuentro_id),
//             hora_salida: hora_salida, 
//             cupos_disponibles: parseInt(cupos_disponibles)
//         };

//         try {
//             const token = getToken();
//             if (!token) {
//                 alert('No autenticado. Por favor, inicia sesión.');
//                 window.location.href = '/login';
//                 return;
//             }

//             const response = await fetch('/viaje', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${token}`
//                 },
//                 body: JSON.stringify(data)
//             });

//             if (response.status === 401 || response.status === 403) {
//                 alert('No autorizado para crear viajes. Sesión expirada o rol incorrecto.');
//                 localStorage.removeItem('jwtToken');
//                 window.location.href = '/login';
//                 return;
//             }

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(`HTTP error! status: ${response.status} - ${errorData.message || response.statusText}`);
//             }

//             alert('Viaje creado con éxito');
//             crearViajeModal.hide(); // Cerrar el modal
//             cargarViajes(); // Recargar la lista de viajes
//         } catch (error) {
//             console.error('Error al crear viaje:', error);
//             alert(`No se pudo crear el viaje: ${error.message}.`);
//         }
//     });


//     // Cargar los viajes al inicio
//     cargarViajes();
// });