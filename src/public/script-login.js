// src/public/script-login.js (enlazado a login.html)
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita el envío tradicional del formulario

        const email = document.getElementById('email').value;
        const contrasena = document.getElementById('contrasena').value;

        try {
            const response = await fetch('/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, contrasena }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('jwtToken', data.token); // Guarda el token
                alert(data.message);
                window.location.href = '/dashboard';
            } else {
                alert(`Error al iniciar sesión: ${data.message}`);
            }
        } catch (error) {
            console.error('Error de red o servidor:', error);
            alert('Error al conectar con el servidor.');
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get('status');
    const message = urlParams.get('message');
    const alertContainer = document.getElementById('alertContainer');

    if (alertContainer && status && message) { // Asegurarse de que alertContainer existe
        let alertClass = '';
        if (status === 'success') {
            alertClass = 'alert-success';
        } else if (status === 'error') {
            alertClass = 'alert-danger';
        }

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert ${alertClass} alert-dismissible fade show`;
        alertDiv.setAttribute('role', 'alert');
        alertDiv.innerHTML = `
            ${decodeURIComponent(message)}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        alertContainer.appendChild(alertDiv);

        // Importante: Limpia los parámetros de la URL después de mostrarlos
        history.replaceState({}, document.title, window.location.pathname);
    }
});