// Función para alternar el menú móvil
function toggleMenu() {
    const nav = document.getElementById('mainNav');
    nav.classList.toggle('active');
}

// Función para cerrar el menú al hacer clic en un enlace
function initMenuLinks() {
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const nav = document.getElementById('mainNav');
            if (nav.classList.contains('active')) {
                nav.classList.remove('active');
            }
        });
    });
}

// Función para scroll suave
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Inicializar funciones cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initMenuLinks();
    initSmoothScroll();
    initContactForm();
});

// Función para manejar el formulario de contacto
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener los datos del formulario
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            pais: document.getElementById('pais').value,
            destino: document.getElementById('destino').value,
            tipoMascota: document.getElementById('tipoMascota').value,
            fechaViaje: document.getElementById('fechaViaje').value,
            mensaje: document.getElementById('mensaje').value,
            fecha: new Date().toLocaleString('es-ES')
        };

        // Deshabilitar el botón durante el envío
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            // IMPORTANTE: Reemplaza esta URL con la URL de tu Google Apps Script
            // Instrucciones abajo sobre cómo crear el script de Google Sheets
            const SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
            
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Mostrar mensaje de éxito
            showFormMessage('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
            form.reset();

        } catch (error) {
            console.error('Error:', error);
            showFormMessage('Hubo un error al enviar el formulario. Por favor, intenta contactarnos por WhatsApp.', 'error');
        } finally {
            // Reactivar el botón
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Función para mostrar mensajes del formulario
function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    messageDiv.textContent = message;
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.display = 'block';

    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}
