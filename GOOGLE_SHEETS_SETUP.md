# Configuración de Google Sheets para el Formulario de Contacto

## Paso 1: Crear una nueva hoja de cálculo de Google

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala "Barbara Pet Care - Contactos" o el nombre que prefieras
4. En la primera fila, agrega los siguientes encabezados:
   - A1: `Fecha`
   - B1: `Nombre`
   - C1: `Email`
   - D1: `Teléfono`
   - E1: `País Origen`
   - F1: `País Destino`
   - G1: `Tipo Mascota`
   - H1: `Fecha Viaje`
   - I1: `Mensaje`
   - J1: `Cotización`

## Paso 2: Crear el Script de Google Apps

1. En tu hoja de Google Sheets, ve a **Extensiones > Apps Script**
2. Elimina el código que viene por defecto
3. Copia y pega el siguiente código:

```javascript
// ⚙️ CONFIGURACIÓN - Cambia este email por el tuyo
const EMAIL_DESTINATARIO = 'tu-email@ejemplo.com';

function doPost(e) {
  try {
    // Obtener la hoja activa
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parsear los datos recibidos
    var data = JSON.parse(e.postData.contents);
    
    // Agregar una nueva fila con los datos
    sheet.appendRow([
      data.fecha,
      data.nombre,
      data.email,
      data.telefono,
      data.pais,
      data.destino,
      data.tipoMascota,
      data.fechaViaje,
      data.mensaje,
      data.cotizacion || 'Sin cotización previa'
    ]);
    
    // 📧 Enviar email al administrador
    enviarEmailAdmin(data);
    
    // 📧 Enviar email de confirmación al cliente
    enviarEmailCliente(data);
    
    // Retornar éxito
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Retornar error
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Función para enviar email al administrador
function enviarEmailAdmin(data) {
  var asunto = '🐾 Nueva solicitud de ' + data.nombre;
  
  var cuerpo = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .info-box { background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 15px; margin: 15px 0; border-radius: 5px; }
    .info-row { margin: 10px 0; }
    .label { font-weight: bold; color: #333; display: inline-block; min-width: 140px; }
    .value { color: #555; }
    .cotizacion-box { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 5px; }
    .mensaje-box { background-color: #e7f3ff; border-left: 4px solid #2196F3; padding: 15px; margin: 20px 0; border-radius: 5px; white-space: pre-wrap; }
    .footer { background-color: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 Nueva Solicitud - Barbara Pet Care</h1>
    </div>
    <div class="content">
      <p style="color: #333; font-size: 16px;">Has recibido una nueva solicitud de asesoría:</p>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #667eea;">📋 Datos del Cliente</h3>
        <div class="info-row">
          <span class="label">👤 Nombre:</span>
          <span class="value">${data.nombre}</span>
        </div>
        <div class="info-row">
          <span class="label">📧 Email:</span>
          <span class="value">${data.email}</span>
        </div>
        <div class="info-row">
          <span class="label">📱 Teléfono:</span>
          <span class="value">${data.telefono}</span>
        </div>
        <div class="info-row">
          <span class="label">📅 Fecha solicitud:</span>
          <span class="value">${data.fecha}</span>
        </div>
      </div>
      
      <div class="info-box">
        <h3 style="margin-top: 0; color: #667eea;">✈️ Detalles del Viaje</h3>
        <div class="info-row">
          <span class="label">🌍 País origen:</span>
          <span class="value">${data.pais}</span>
        </div>
        <div class="info-row">
          <span class="label">🎯 País destino:</span>
          <span class="value">${data.destino}</span>
        </div>
        <div class="info-row">
          <span class="label">🐕 Tipo de mascota:</span>
          <span class="value">${data.tipoMascota}</span>
        </div>
        <div class="info-row">
          <span class="label">📆 Fecha de viaje:</span>
          <span class="value">${data.fechaViaje}</span>
        </div>
      </div>
      
      ${data.mensaje ? `
      <div class="mensaje-box">
        <h3 style="margin-top: 0; color: #2196F3;">💬 Mensaje</h3>
        <p style="margin: 0;">${data.mensaje}</p>
      </div>
      ` : ''}
      
      ${data.cotizacion && data.cotizacion !== 'Sin cotización previa' ? `
      <div class="cotizacion-box">
        <h3 style="margin-top: 0; color: #f57c00;">💰 Cotización Previa</h3>
        <p style="margin: 0;">${data.cotizacion}</p>
      </div>
      ` : ''}
      
      <p style="margin-top: 30px; padding: 15px; background-color: #e8f5e9; border-radius: 5px; color: #2e7d32;">
        <strong>⏰ Recuerda:</strong> Contactar al cliente en menos de 24 horas para mantener un excelente servicio.
      </p>
    </div>
    <div class="footer">
      <p>Barbara Pet Care - Sistema de Gestión de Solicitudes</p>
      <p>Este correo fue generado automáticamente desde tu página web.</p>
    </div>
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: EMAIL_DESTINATARIO,
    subject: asunto,
    htmlBody: cuerpo
  });
}

// Función para enviar email de confirmación al cliente
function enviarEmailCliente(data) {
  var asunto = '✅ Hemos recibido tu solicitud - Barbara Pet Care';
  
  var cuerpo = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 30px; text-align: center; }
    .header h1 { margin: 0 0 10px 0; font-size: 28px; }
    .header p { margin: 0; font-size: 16px; opacity: 0.9; }
    .content { padding: 40px 30px; }
    .greeting { font-size: 18px; color: #333; margin-bottom: 20px; }
    .message-box { background-color: #f0f7ff; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 5px; }
    .info-summary { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }
    .info-summary h3 { margin-top: 0; color: #667eea; font-size: 18px; }
    .info-item { margin: 10px 0; color: #555; }
    .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
    .footer { background-color: #f8f9fa; padding: 30px; text-align: center; color: #666; }
    .social-links { margin: 20px 0; }
    .social-links a { color: #667eea; text-decoration: none; margin: 0 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🐾 ¡Gracias por contactarnos!</h1>
      <p>Tu solicitud ha sido recibida con éxito</p>
    </div>
    <div class="content">
      <p class="greeting">Hola <strong>${data.nombre}</strong>,</p>
      
      <div class="message-box">
        <p style="margin: 0; font-size: 16px; line-height: 1.6;">
          ¡Muchas gracias por confiar en <strong>Barbara Pet Care</strong>! Hemos recibido tu solicitud de asesoría 
          para el traslado de tu mascota y queremos que sepas que ya estamos trabajando en ella.
        </p>
      </div>
      
      <div class="info-summary">
        <h3>📋 Resumen de tu solicitud</h3>
        <div class="info-item">🌍 <strong>Ruta:</strong> ${data.pais} → ${data.destino}</div>
        <div class="info-item">🐕 <strong>Tipo de mascota:</strong> ${data.tipoMascota}</div>
        <div class="info-item">📆 <strong>Fecha estimada de viaje:</strong> ${data.fechaViaje}</div>
        ${data.cotizacion && data.cotizacion !== 'Sin cotización previa' ? `
        <div class="info-item">💰 <strong>Cotización:</strong> ${data.cotizacion}</div>
        ` : ''}
      </div>
      
      <h3 style="color: #333; margin-top: 30px;">⏰ ¿Qué sigue ahora?</h3>
      <ul style="color: #555; line-height: 1.8;">
        <li>Nuestro equipo revisará tu solicitud en detalle</li>
        <li>Te contactaremos en <strong>menos de 24 horas</strong></li>
        <li>Te proporcionaremos toda la información necesaria para el traslado</li>
        <li>Resolveremos todas tus dudas personalizadamente</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://wa.me/34680917655" class="cta-button">
          📱 ¿Necesitas ayuda inmediata? Escríbenos por WhatsApp
        </a>
      </div>
      
      <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 25px 0;">
        <p style="margin: 0; color: #e65100; font-size: 14px;">
          <strong>💡 Consejo:</strong> Mientras tanto, puedes ir preparando la documentación de tu mascota 
          (cartilla de vacunación, pasaporte si lo tiene, etc.). Te detallaremos todos los requisitos específicos 
          cuando nos contactemos contigo.
        </p>
      </div>
      
      <p style="color: #555; margin-top: 30px;">
        Estamos aquí para hacer que el viaje de tu mascota sea seguro y sin complicaciones. 
        ¡Gracias por elegirnos!
      </p>
      
      <p style="color: #333; margin-top: 20px;">
        Saludos cordiales,<br>
        <strong>El equipo de Barbara Pet Care</strong> 🐾
      </p>
    </div>
    <div class="footer">
      <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;"><strong>Barbara Pet Care</strong></p>
      <p style="margin: 5px 0;">Expertos en traslado internacional de mascotas</p>
      <div class="social-links">
        <a href="https://wa.me/34680917655">📱 WhatsApp</a>
        <a href="mailto:${EMAIL_DESTINATARIO}">📧 Email</a>
      </div>
      <p style="font-size: 12px; margin-top: 20px; color: #999;">
        Este es un correo automático, por favor no respondas a este mensaje.<br>
        Para contactarnos, usa los medios indicados arriba.
      </p>
    </div>
  </div>
</body>
</html>
  `;
  
  MailApp.sendEmail({
    to: data.email,
    subject: asunto,
    htmlBody: cuerpo
  });
}

// Función de prueba (opcional)
function doGet(e) {
  return ContentService
    .createTextOutput("El script está funcionando correctamente")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. **IMPORTANTE**: En la primera línea del código, cambia el email:
   ```javascript
   const EMAIL_DESTINATARIO = 'tu-email@ejemplo.com';
   ```
   Reemplaza `'tu-email@ejemplo.com'` con tu dirección de email real donde quieres recibir las notificaciones.

5. Guarda el proyecto con un nombre (ej: "Formulario Barbara Pet Care")

## Paso 3: Implementar el script

1. Haz clic en el botón **Implementar** (arriba a la derecha)
2. Selecciona **Nueva implementación**
3. Haz clic en el ícono de engranaje y selecciona **Aplicación web**
4. Configura lo siguiente:
   - **Descripción**: "Formulario de contacto" (o lo que prefieras)
   - **Ejecutar como**: "Yo" (tu cuenta)
   - **Quién tiene acceso**: "Cualquier usuario"
5. Haz clic en **Implementar**
6. Puede que te pida autorizar el acceso. Haz clic en **Autorizar acceso**
7. Selecciona tu cuenta de Google
8. Si aparece "Google no ha verificado esta aplicación", haz clic en **Opciones avanzadas** y luego en **Ir a [nombre del proyecto] (no seguro)**
9. Haz clic en **Permitir**

## Paso 4: Copiar la URL del Web App

1. Después de implementar, verás una **URL de aplicación web**
2. Copia esta URL (se verá algo así: `https://script.google.com/macros/s/AKfy...`)
3. Ve al archivo `script.js` en tu proyecto
4. Busca la línea que dice:
   ```javascript
   const SCRIPT_URL = 'TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI';
   ```
5. Reemplaza `TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI` con la URL que copiaste

## Paso 5: Probar el formulario

1. Abre tu página web
2. Completa el formulario de contacto
3. Haz clic en "Enviar solicitud"
4. Ve a tu hoja de Google Sheets y verifica que se haya agregado una nueva fila con los datos

## 📧 Sistema de Correos Automáticos

El script ahora envía **dos correos electrónicos automáticos** cada vez que alguien llena el formulario:

### 1. Email para ti (administrador)
- **Asunto**: "🐾 Nueva solicitud de [Nombre del cliente]"
- **Contenido**: Todos los datos del formulario organizados y con un diseño profesional
- **Incluye**: Nombre, email, teléfono, detalles del viaje, mensaje y cotización (si existe)

### 2. Email para el cliente
- **Asunto**: "✅ Hemos recibido tu solicitud - Barbara Pet Care"
- **Contenido**: Confirmación profesional con resumen de su solicitud
- **Incluye**: Agradecimiento, resumen de datos, próximos pasos y enlaces de contacto

### Personalización del email
Para cambiar el diseño o texto de los emails, edita las funciones `enviarEmailAdmin()` y `enviarEmailCliente()` en el script.

## Notas importantes

- **Email de destino**: Asegúrate de cambiar `EMAIL_DESTINATARIO` en la primera línea del script con tu email real.
- **Privacidad**: Esta hoja de cálculo contendrá información personal de tus clientes. No la compartas públicamente.
- **Correos automáticos**: Los emails se envían desde tu cuenta de Google asociada al script. Revisa tu carpeta de "Enviados" para verificar.
- **Límites de envío**: Google Apps Script tiene un límite de 100 emails por día para cuentas gratuitas de Gmail.
- **Backup**: Considera hacer copias de seguridad periódicas de tu hoja.
- **Actualizaciones**: Si necesitas hacer cambios en el script, recuerda hacer clic en "Implementar" > "Administrar implementaciones" > clic en el lápiz de edición > "Nueva versión" > "Implementar"

## Alternativa: Guardar en un archivo local (JSON)

Si prefieres no usar Google Sheets, puedes crear un backend simple con Node.js que guarde los datos en un archivo JSON o en una base de datos local. Sin embargo, esto requiere:
- Un servidor (Node.js, PHP, etc.)
- Hosting con soporte para backend
- Configuración de base de datos (MySQL, MongoDB, etc.)

La solución de Google Sheets es la más simple y no requiere servidor propio ni configuración compleja.
