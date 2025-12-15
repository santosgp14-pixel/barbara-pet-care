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
});
