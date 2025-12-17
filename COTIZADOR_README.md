# Sistema de Cotización - Barbara Pet Care

## 🎯 Descripción

El sistema de cotización permite a los usuarios estimar el costo de trasladar su mascota de manera interactiva, en 4 pasos simples.

## 📁 Archivos del Sistema

- **cotizador.html** - Página del cotizador interactivo
- **contacto.html** - Formulario de contacto (modificado para recibir cotizaciones)
- **script.js** - Lógica del cotizador y transferencia de datos
- **styles.css** - Estilos del cotizador

## 🔄 Flujo de Funcionamiento

### 1. Usuario realiza la cotización (cotizador.html)

**Paso 1: Origen y Destino**
- Selecciona país de origen
- Selecciona región de destino
- Precio base según destino:
  - Unión Europea: €400
  - Reino Unido: €600
  - Latinoamérica: €1,200
  - Estados Unidos/Canadá: €1,500
  - Asia/Oceanía: €2,500
  - África/Medio Oriente: €1,800

**Paso 2: Tu Mascota**
- Tipo de animal (Perro/Gato/Otro)
- Peso de la mascota:
  - Hasta 10kg: €0
  - 10-20kg: +€150
  - 20-30kg: +€300
  - Más de 30kg: +€500

**Paso 3: Servicios**
- Asesoría personalizada (Incluida - €0)
- Gestión de documentación completa (+€250)
- Transportín homologado IATA (+€120)
- Coordinación con veterinarios (+€150)
- Reserva y gestión de vuelo (+€180)
- Seguimiento 24/7 durante el viaje (+€200)
- Recogida/Entrega a domicilio (+€100)

**Paso 4: Resumen**
- Muestra desglose completo
- Precio total estimado
- Botón para continuar al formulario

### 2. Usuario acepta y procede al formulario

Al hacer clic en "Solicitar asesoría con esta cotización":
1. Los datos de la cotización se guardan en `localStorage`
2. Usuario es redirigido a `contacto.html`
3. Se muestra una tarjeta con el resumen de la cotización
4. Los campos del formulario se prellenan automáticamente
5. La cotización completa se incluye en un campo oculto

### 3. Envío del formulario

El formulario incluye:
- Todos los datos del cliente
- Información de la cotización realizada
- Total estimado

Estos datos se envían a Google Sheets donde puedes ver:
- ¿De dónde vino el lead?
- ¿Qué cotización realizó?
- ¿Qué servicios le interesan?
- Presupuesto estimado

## 💾 Almacenamiento de Datos

### localStorage
Se utiliza temporalmente para transferir la cotización entre páginas:
```javascript
localStorage.setItem('barbaraPetCareQuote', JSON.stringify(quoteData));
```

Los datos se eliminan automáticamente después de cargarlos en el formulario.

### Google Sheets
La cotización se envía como un campo adicional:
```
Columna J: Cotización
Ejemplo: "Ruta: España → Latinoamérica | Mascota: Perro (10-20kg) | 
Servicios: Gestión de documentación, Seguimiento 24/7 | Total: €1650"
```

## 🎨 Personalización de Precios

Para modificar los precios, edita en **cotizador.html**:

```html
<!-- Destinos -->
<option value="Union Europea" data-precio="400">Unión Europea</option>

<!-- Pesos -->
<option value="10-20kg" data-precio="150">10 - 20kg</option>

<!-- Servicios -->
<input type="checkbox" value="Gestión de documentación" data-precio="250">
```

## 🔗 Integración con el Sitio

El cotizador está accesible desde:
- Menú de navegación principal
- Hero section (botón destacado)
- Puede agregarse en más CTAs según necesites

## 📱 Responsive

El cotizador es completamente responsive:
- En desktop: vista de 2 columnas con sidebar
- En móvil: vista de 1 columna apilada
- Steps indicadores se adaptan
- Formularios de una sola columna en móvil

## 🚀 Próximos Pasos

1. Personaliza los precios según tu negocio
2. Ajusta los servicios disponibles
3. Configura Google Sheets (ver GOOGLE_SHEETS_SETUP.md)
4. Prueba el flujo completo
5. Monitorea las cotizaciones que generan más conversiones

## ⚠️ Notas Importantes

- Los precios son **estimados** ("Desde €XXX")
- Incluye disclaimer sobre variación de precios
- La cotización NO es un compromiso de compra
- Es una herramienta de calificación de leads
- Ayuda a entender las necesidades del cliente antes de contactar
