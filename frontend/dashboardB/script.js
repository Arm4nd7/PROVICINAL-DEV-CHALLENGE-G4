let mapa;
let chat = [];

function inicializarMapa() {
  mapa = new google.maps.Map(document.getElementById("mapa"), {
    center: { lat: -0.22985, lng: -78.52495 }, // Quito por defecto
    zoom: 14,
  });
}

document.getElementById("form-ubicacion").addEventListener("submit", function (e) {
  e.preventDefault();
  const partida = document.getElementById("partida").value;
  const destino = document.getElementById("destino").value;

  const mensaje = `Compartió ruta: ${partida} → ${destino}`;
  chat.push(mensaje);
  actualizarChat();
});

function enviarMensaje() {
  const input = document.getElementById("mensaje");
  const texto = input.value.trim();
  if (texto !== "") {
    chat.push(`${texto}`);
    input.value = "";
    actualizarChat();
  }
}

function actualizarChat() {
  const chatDiv = document.getElementById("chat");
  chatDiv.innerHTML = chat.map(msg => `<div>${msg}</div>`).join("");
  chatDiv.scrollTop = chatDiv.scrollHeight;
}
