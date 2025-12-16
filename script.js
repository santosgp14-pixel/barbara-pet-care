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
    loadQuoteInContactForm();
});

// Función para manejar el formulario de contacto
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Obtener los datos del formulario incluyendo la cotización
        const cotizacion = document.getElementById('cotizacion') ? document.getElementById('cotizacion').value : '';
        
        const formData = {
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            pais: document.getElementById('pais').value,
            destino: document.getElementById('destino').value,
            tipoMascota: document.getElementById('tipoMascota').value,
            fechaViaje: document.getElementById('fechaViaje').value,
            mensaje: document.getElementById('mensaje').value,
            cotizacion: cotizacion,
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

// ============================================
// FUNCIONES DEL COTIZADOR
// ============================================

let currentStep = 1;
let quoteData = {
    origen: '',
    destinoRegion: '',
    tipoAnimal: '',
    peso: '',
    servicios: [],
    precioBase: 0,
    precioTotal: 0
};

// Navegar entre pasos
function nextStep(step) {
    // Validar el paso actual antes de avanzar
    if (!validateStep(currentStep)) {
        return;
    }

    // Ocultar paso actual
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Mostrar nuevo paso
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');

    // Marcar pasos completados
    for (let i = 1; i < currentStep; i++) {
        document.querySelector(`.step[data-step="${i}"]`).classList.add('completed');
    }
}

function prevStep(step) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove('active');
    
    currentStep = step;
    document.getElementById(`step${currentStep}`).classList.add('active');
    document.querySelector(`.step[data-step="${currentStep}"]`).classList.add('active');
}

// Validar cada paso
function validateStep(step) {
    if (step === 1) {
        const origen = document.getElementById('origen').value;
        const destino = document.getElementById('destinoRegion').value;
        
        if (!origen || !destino) {
            alert('Por favor completa todos los campos');
            return false;
        }
        
        quoteData.origen = origen;
        quoteData.destinoRegion = destino;
        quoteData.precioBase = parseInt(document.querySelector('#destinoRegion option:checked').dataset.precio) || 0;
    }
    
    if (step === 2) {
        const tipo = document.getElementById('tipoAnimal').value;
        const peso = document.getElementById('peso').value;
        
        if (!tipo || !peso) {
            alert('Por favor completa todos los campos');
            return false;
        }
        
        quoteData.tipoAnimal = tipo;
        quoteData.peso = peso;
    }
    
    return true;
}

// Calcular cotización
function calculateQuote() {
    // Recopilar servicios seleccionados
    const serviciosCheckboxes = document.querySelectorAll('input[name="servicio"]:checked');
    quoteData.servicios = [];
    let precioServicios = 0;
    
    serviciosCheckboxes.forEach(checkbox => {
        const precio = parseInt(checkbox.dataset.precio) || 0;
        quoteData.servicios.push({
            nombre: checkbox.value,
            precio: precio
        });
        precioServicios += precio;
    });
    
    // Calcular precio del tipo de animal
    const precioAnimal = parseInt(document.querySelector('#tipoAnimal option:checked').dataset.precio) || 0;
    
    // Calcular precio del peso
    const precioPeso = parseInt(document.querySelector('#peso option:checked').dataset.precio) || 0;
    
    // Calcular total
    quoteData.precioTotal = quoteData.precioBase + precioAnimal + precioPeso + precioServicios;
    
    // Mostrar resumen
    displayQuoteSummary();
    
    // Avanzar al paso 4
    nextStep(4);
}

// Mostrar resumen de cotización
function displayQuoteSummary() {
    const detailsDiv = document.getElementById('quoteDetails');
    const totalDiv = document.getElementById('totalPrice');
    
    let html = '<div class="quote-items">';
    
    // Detalles del viaje
    html += `
        <div class="quote-item">
            <div class="quote-item-icon">🌍</div>
            <div class="quote-item-content">
                <strong>Ruta:</strong> ${quoteData.origen} → ${quoteData.destinoRegion}
            </div>
            <div class="quote-item-price">€${quoteData.precioBase}</div>
        </div>
    `;
    
    // Detalles de la mascota
    const precioAnimal = parseInt(document.querySelector('#tipoAnimal option:checked').dataset.precio) || 0;
    const precioPeso = parseInt(document.querySelector('#peso option:checked').dataset.precio) || 0;
    const totalMascota = precioAnimal + precioPeso;
    
    html += `
        <div class="quote-item">
            <div class="quote-item-icon">🐾</div>
            <div class="quote-item-content">
                <strong>Mascota:</strong> ${quoteData.tipoAnimal} - ${quoteData.peso}
            </div>
            <div class="quote-item-price">${totalMascota > 0 ? '+€' + totalMascota : 'Incluido'}</div>
        </div>
    `;
    
    // Servicios
    quoteData.servicios.forEach(servicio => {
        html += `
            <div class="quote-item">
                <div class="quote-item-icon">✓</div>
                <div class="quote-item-content">${servicio.nombre}</div>
                <div class="quote-item-price">${servicio.precio > 0 ? '+€' + servicio.precio : 'Incluido'}</div>
            </div>
        `;
    });
    
    html += '</div>';
    
    detailsDiv.innerHTML = html;
    totalDiv.innerHTML = `Desde <strong>€${quoteData.precioTotal}</strong>`;
}

// Proceder al formulario de contacto con la cotización
function proceedToContact() {
    // Guardar cotización en localStorage
    const quoteString = JSON.stringify({
        origen: quoteData.origen,
        destino: quoteData.destinoRegion,
        tipoAnimal: quoteData.tipoAnimal,
        peso: quoteData.peso,
        servicios: quoteData.servicios.map(s => s.nombre).join(', '),
        precioTotal: quoteData.precioTotal,
        fecha: new Date().toLocaleString('es-ES')
    });
    
    localStorage.setItem('barbaraPetCareQuote', quoteString);
    
    // Redirigir al formulario de contacto
    window.location.href = 'contacto.html';
}

// Cargar cotización en el formulario de contacto
function loadQuoteInContactForm() {
    const quoteString = localStorage.getItem('barbaraPetCareQuote');
    
    if (!quoteString) return;
    
    try {
        const quote = JSON.parse(quoteString);
        
        // Mostrar tarjeta de resumen
        const summaryCard = document.getElementById('quoteSummaryCard');
        const summaryContent = document.getElementById('quoteSummaryContent');
        
        if (summaryCard && summaryContent) {
            summaryCard.style.display = 'block';
            
            summaryContent.innerHTML = `
                <div class="quote-summary-grid">
                    <div><strong>Ruta:</strong> ${quote.origen} → ${quote.destino}</div>
                    <div><strong>Mascota:</strong> ${quote.tipoAnimal} - ${quote.peso}</div>
                    <div><strong>Servicios:</strong> ${quote.servicios}</div>
                    <div class="quote-summary-total"><strong>Total estimado:</strong> <span class="price-highlight">€${quote.precioTotal}</span></div>
                </div>
            `;
        }
        
        // Prellenar campo de país de destino si existe
        const destinoField = document.getElementById('destino');
        if (destinoField && !destinoField.value) {
            destinoField.value = quote.destino;
        }
        
        // Prellenar tipo de mascota si existe
        const tipoMascotaField = document.getElementById('tipoMascota');
        if (tipoMascotaField && !tipoMascotaField.value) {
            tipoMascotaField.value = quote.tipoAnimal;
        }
        
        // Guardar cotización en campo oculto para enviar con el formulario
        const cotizacionField = document.getElementById('cotizacion');
        if (cotizacionField) {
            cotizacionField.value = `Ruta: ${quote.origen} → ${quote.destino} | Mascota: ${quote.tipoAnimal} (${quote.peso}) | Servicios: ${quote.servicios} | Total: €${quote.precioTotal}`;
        }
        
        // Limpiar localStorage después de cargar
        localStorage.removeItem('barbaraPetCareQuote');
        
    } catch (error) {
        console.error('Error al cargar la cotización:', error);
    }
}

// Reiniciar cotización
function resetQuote() {
    currentStep = 1;
    quoteData = {
        origen: '',
        destinoRegion: '',
        tipoAnimal: '',
        peso: '',
        servicios: [],
        precioBase: 0,
        precioTotal: 0
    };
    
    // Resetear formularios
    document.getElementById('origen').value = '';
    document.getElementById('destinoRegion').value = '';
    document.getElementById('tipoAnimal').value = '';
    document.getElementById('peso').value = '';
    
    // Desmarcar checkboxes (excepto los que están disabled)
    document.querySelectorAll('input[name="servicio"]:not([disabled])').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Volver al paso 1
    document.querySelectorAll('.cotizador-step').forEach(step => step.classList.remove('active'));
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
        step.classList.remove('completed');
    });
    
    document.getElementById('step1').classList.add('active');
    document.querySelector('.step[data-step="1"]').classList.add('active');
}
