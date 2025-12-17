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
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyBymEWwsxn4DRONfj13xlZofiPPHkNr46UugfW24IIyLhtESBPa8QSwLlhicV4ftAavA/exec';
            
            const response = await fetch(SCRIPT_URL, {
                redirect: 'follow',
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (result.result === 'success') {
                // Mostrar mensaje de éxito
                showFormMessage('¡Solicitud enviada con éxito! Nos pondremos en contacto contigo pronto.', 'success');
                form.reset();
                // Limpiar localStorage de cotización
                localStorage.removeItem('quoteData');
            } else {
                throw new Error(result.error || 'Error desconocido');
            }

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
    cantidadTipo: '', // 'una' o 'varias'
    mascotas: [], // Array de mascotas con {tipo, peso, precioTipo, precioPeso}
    servicios: [],
    precioBase: 0,
    precioTotal: 0
};
let mascotaCounter = 0;

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
    
    // Si estamos volviendo desde el paso 2 al paso 1, resetear la selección de mascotas
    if (currentStep === 2 && step === 1) {
        quoteData.cantidadTipo = '';
        quoteData.mascotas = [];
        mascotaCounter = 0;
        
        // Mostrar nuevamente el selector de cantidad
        document.querySelector('.cantidad-mascotas-selector').style.display = 'grid';
        document.getElementById('unaMascotaForm').style.display = 'none';
        document.getElementById('variasMascotasForm').style.display = 'none';
        
        // Limpiar los formularios
        const nombreInput = document.getElementById('nombreMascota');
        const tipoSelect = document.getElementById('tipoAnimal');
        const pesoSelect = document.getElementById('peso');
        if (nombreInput) nombreInput.value = '';
        if (tipoSelect) tipoSelect.value = '';
        if (pesoSelect) pesoSelect.value = '';
        
        document.getElementById('mascotasList').innerHTML = '';
        
        // Remover selección visual de las opciones
        document.querySelectorAll('.cantidad-option').forEach(opt => {
            opt.classList.remove('selected');
        });
    }
    
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
        // La validación se hará en la función específica según el tipo seleccionado
        return true;
    }
    
    return true;
}

// Funciones para manejo de múltiples mascotas
function selectCantidad(tipo) {
    quoteData.cantidadTipo = tipo;
    
    // Marcar visualmente la opción seleccionada
    document.querySelectorAll('.cantidad-option').forEach(opt => {
        opt.classList.remove('selected');
    });
    event.target.closest('.cantidad-option').classList.add('selected');
    
    // Ocultar el selector
    document.querySelector('.cantidad-mascotas-selector').style.display = 'none';
    
    if (tipo === 'una') {
        document.getElementById('unaMascotaForm').style.display = 'block';
        quoteData.mascotas = [];
    } else {
        document.getElementById('variasMascotasForm').style.display = 'block';
        document.getElementById('mascotasList').innerHTML = '';
        quoteData.mascotas = [];
        mascotaCounter = 0;
        // Agregar la primera mascota automáticamente
        agregarMascota();
    }
}

function agregarMascota() {
    mascotaCounter++;
    const mascotasList = document.getElementById('mascotasList');
    
    const mascotaCard = document.createElement('div');
    mascotaCard.className = 'mascota-card';
    mascotaCard.id = `mascota-${mascotaCounter}`;
    
    mascotaCard.innerHTML = `
        <div class="mascota-card-header">
            <div class="mascota-card-title">🐾 Mascota ${mascotaCounter}</div>
            ${mascotaCounter > 1 ? `<button type="button" class="btn-remove-mascota" onclick="eliminarMascota(${mascotaCounter})">Eliminar</button>` : ''}
        </div>
        
        <div class="form-group">
            <label>Nombre de la mascota</label>
            <input type="text" class="mascota-nombre" data-id="${mascotaCounter}" placeholder="Ej: Luna">
        </div>
        
        <div class="form-group">
            <label>Tipo de animal</label>
            <select class="mascota-tipo" data-id="${mascotaCounter}" onchange="actualizarOpcionesPeso('mascota-peso-${mascotaCounter}', this.value)">
                <option value="">Selecciona...</option>
                <option value="Perro" data-precio="0">Perro</option>
                <option value="Gato" data-precio="0">Gato</option>
                <option value="Otro" data-precio="200">Otro animal</option>
            </select>
        </div>
        
        <div class="form-group">
            <label>Peso aproximado</label>
            <select class="mascota-peso" id="mascota-peso-${mascotaCounter}" data-id="${mascotaCounter}">
                <option value="">Selecciona...</option>
                <option value="Hasta 10kg" data-precio="0">Hasta 10kg</option>
                <option value="10-20kg" data-precio="150">10 - 20kg</option>
                <option value="20-30kg" data-precio="300">20 - 30kg</option>
                <option value="Más de 30kg" data-precio="500">Más de 30kg</option>
            </select>
        </div>
    `;
    
    mascotasList.appendChild(mascotaCard);
}

// Función para actualizar las opciones de peso según el tipo de animal
function actualizarOpcionesPeso(pesoSelectId, tipoAnimal) {
    const pesoSelect = document.getElementById(pesoSelectId);
    if (!pesoSelect) return;
    
    if (tipoAnimal === 'Gato') {
        // Opciones de peso para gatos
        pesoSelect.innerHTML = `
            <option value="">Selecciona...</option>
            <option value="2-4kg" data-precio="0">2 - 4kg</option>
            <option value="4-6kg" data-precio="0">4 - 6kg</option>
            <option value="6-8kg" data-precio="50">6 - 8kg</option>
            <option value="Más de 8kg" data-precio="100">Más de 8kg</option>
        `;
    } else {
        // Opciones de peso para perros y otros animales
        pesoSelect.innerHTML = `
            <option value="">Selecciona...</option>
            <option value="Hasta 10kg" data-precio="0">Hasta 10kg</option>
            <option value="10-20kg" data-precio="150">10 - 20kg</option>
            <option value="20-30kg" data-precio="300">20 - 30kg</option>
            <option value="Más de 30kg" data-precio="500">Más de 30kg</option>
        `;
    }
}

function eliminarMascota(id) {
    const card = document.getElementById(`mascota-${id}`);
    if (card) {
        card.remove();
        // Renumerar las mascotas restantes
        renumerarMascotas();
    }
}

function renumerarMascotas() {
    const cards = document.querySelectorAll('.mascota-card');
    cards.forEach((card, index) => {
        const title = card.querySelector('.mascota-card-title');
        if (title) {
            title.textContent = `🐾 Mascota ${index + 1}`;
        }
    });
}

function validarYContinuar() {
    quoteData.mascotas = [];
    
    const mascotaCards = document.querySelectorAll('.mascota-card');
    
    if (mascotaCards.length === 0) {
        alert('Debes agregar al menos una mascota');
        return;
    }
    
    let allValid = true;
    
    mascotaCards.forEach((card, index) => {
        const nombreInput = card.querySelector('.mascota-nombre');
        const tipoSelect = card.querySelector('.mascota-tipo');
        const pesoSelect = card.querySelector('.mascota-peso');
        
        if (!tipoSelect.value || !pesoSelect.value) {
            alert(`Por favor completa todos los datos de la Mascota ${index + 1}`);
            allValid = false;
            return;
        }
        
        const precioTipo = parseInt(tipoSelect.options[tipoSelect.selectedIndex].dataset.precio) || 0;
        const precioPeso = parseInt(pesoSelect.options[pesoSelect.selectedIndex].dataset.precio) || 0;
        
        quoteData.mascotas.push({
            nombre: nombreInput.value || `Mascota ${index + 1}`,
            tipo: tipoSelect.value,
            peso: pesoSelect.value,
            precioTipo: precioTipo,
            precioPeso: precioPeso
        });
    });
    
    if (allValid) {
        nextStep(3);
    }
}

// Calcular cotización
function calculateQuote() {
    // Si es una sola mascota, recopilar sus datos
    if (quoteData.cantidadTipo === 'una') {
        const nombre = document.getElementById('nombreMascota').value;
        const tipo = document.getElementById('tipoAnimal').value;
        const peso = document.getElementById('peso').value;
        
        if (!tipo || !peso) {
            alert('Por favor completa todos los campos de tu mascota');
            return;
        }
        
        const tipoSelect = document.getElementById('tipoAnimal');
        const pesoSelect = document.getElementById('peso');
        const precioTipo = parseInt(tipoSelect.options[tipoSelect.selectedIndex].dataset.precio) || 0;
        const precioPeso = parseInt(pesoSelect.options[pesoSelect.selectedIndex].dataset.precio) || 0;
        
        quoteData.mascotas = [{
            nombre: nombre || 'Mi mascota',
            tipo: tipo,
            peso: peso,
            precioTipo: precioTipo,
            precioPeso: precioPeso
        }];
    }
    
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
    
    // Calcular precio de mascotas
    let precioMascotas = 0;
    quoteData.mascotas.forEach(mascota => {
        precioMascotas += mascota.precioTipo + mascota.precioPeso;
    });
    
    // Agregar cargo adicional por múltiples mascotas (después de la primera)
    if (quoteData.mascotas.length > 1) {
        precioMascotas += (quoteData.mascotas.length - 1) * 150; // €150 por cada mascota adicional
    }
    
    // Calcular total
    quoteData.precioTotal = quoteData.precioBase + precioMascotas + precioServicios;
    
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
    
    // Detalles de cada mascota
    quoteData.mascotas.forEach((mascota, index) => {
        const precioMascota = mascota.precioTipo + mascota.precioPeso;
        const nombreDisplay = mascota.nombre ? `${mascota.nombre}` : `Mascota ${index + 1}`;
        html += `
            <div class="quote-item">
                <div class="quote-item-icon">${index === 0 ? '🐾' : '🐕'}</div>
                <div class="quote-item-content">
                    <strong>${nombreDisplay}:</strong> ${mascota.tipo} - ${mascota.peso}
                </div>
                <div class="quote-item-price">${precioMascota > 0 ? '+€' + precioMascota : 'Base'}</div>
            </div>
        `;
    });
    
    // Cargo adicional por múltiples mascotas
    if (quoteData.mascotas.length > 1) {
        const cargoAdicional = (quoteData.mascotas.length - 1) * 150;
        html += `
            <div class="quote-item">
                <div class="quote-item-icon">➕</div>
                <div class="quote-item-content">
                    <strong>Cargo por ${quoteData.mascotas.length} mascotas</strong>
                </div>
                <div class="quote-item-price">+€${cargoAdicional}</div>
            </div>
        `;
    }
    
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
    // Crear descripción de mascotas
    let mascotasDesc = '';
    if (quoteData.mascotas.length === 1) {
        const m = quoteData.mascotas[0];
        mascotasDesc = `${m.nombre ? m.nombre + ' - ' : ''}${m.tipo} (${m.peso})`;
    } else {
        mascotasDesc = quoteData.mascotas.map((m, i) => {
            const nombre = m.nombre || `Mascota ${i+1}`;
            return `${nombre}: ${m.tipo} (${m.peso})`;
        }).join(', ');
    }
    
    // Guardar cotización en localStorage
    const quoteString = JSON.stringify({
        origen: quoteData.origen,
        destino: quoteData.destinoRegion,
        cantidadMascotas: quoteData.mascotas.length,
        mascotas: mascotasDesc,
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
                    <div><strong>Cantidad:</strong> ${quote.cantidadMascotas} mascota${quote.cantidadMascotas > 1 ? 's' : ''}</div>
                    <div><strong>Mascotas:</strong> ${quote.mascotas}</div>
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
        
        // Prellenar tipo de mascota si existe y es una sola
        const tipoMascotaField = document.getElementById('tipoMascota');
        if (tipoMascotaField && !tipoMascotaField.value && quote.cantidadMascotas === 1) {
            // Extraer el tipo de la descripción de mascotas
            const tipoMatch = quote.mascotas.match(/^(\w+)/);
            if (tipoMatch) {
                tipoMascotaField.value = tipoMatch[1];
            }
        }
        
        // Guardar cotización en campo oculto para enviar con el formulario
        const cotizacionField = document.getElementById('cotizacion');
        if (cotizacionField) {
            cotizacionField.value = `Ruta: ${quote.origen} → ${quote.destino} | ${quote.cantidadMascotas} mascota${quote.cantidadMascotas > 1 ? 's' : ''}: ${quote.mascotas} | Servicios: ${quote.servicios} | Total: €${quote.precioTotal}`;
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
        cantidadTipo: '',
        mascotas: [],
        servicios: [],
        precioBase: 0,
        precioTotal: 0
    };
    mascotaCounter = 0;
    
    // Resetear formularios
    document.getElementById('origen').value = '';
    document.getElementById('destinoRegion').value = '';
    
    // Resetear selector de cantidad
    document.querySelector('.cantidad-mascotas-selector').style.display = 'grid';
    document.getElementById('unaMascotaForm').style.display = 'none';
    document.getElementById('variasMascotasForm').style.display = 'none';
    
    // Limpiar formulario de una mascota
    const tipoSelect = document.getElementById('tipoAnimal');
    const pesoSelect = document.getElementById('peso');
    if (tipoSelect) tipoSelect.value = '';
    if (pesoSelect) pesoSelect.value = '';
    
    // Limpiar lista de mascotas
    document.getElementById('mascotasList').innerHTML = '';
    
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
