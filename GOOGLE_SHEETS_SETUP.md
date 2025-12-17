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

// Función de prueba (opcional)
function doGet(e) {
  return ContentService
    .createTextOutput("El script está funcionando correctamente")
    .setMimeType(ContentService.MimeType.TEXT);
}
```

4. Guarda el proyecto con un nombre (ej: "Formulario Barbara Pet Care")

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

## Notas importantes

- **Privacidad**: Esta hoja de cálculo contendrá información personal de tus clientes. No la compartas públicamente.
- **Notificaciones**: Puedes configurar notificaciones por email en Google Sheets (Herramientas > Reglas de notificación) para recibir un email cada vez que se agregue una nueva fila.
- **Backup**: Considera hacer copias de seguridad periódicas de tu hoja.
- **Actualizaciones**: Si necesitas hacer cambios en el script, recuerda hacer clic en "Implementar" > "Administrar implementaciones" > clic en el lápiz de edición > "Nueva versión" > "Implementar"

## Alternativa: Guardar en un archivo local (JSON)

Si prefieres no usar Google Sheets, puedes crear un backend simple con Node.js que guarde los datos en un archivo JSON o en una base de datos local. Sin embargo, esto requiere:
- Un servidor (Node.js, PHP, etc.)
- Hosting con soporte para backend
- Configuración de base de datos (MySQL, MongoDB, etc.)

La solución de Google Sheets es la más simple y no requiere servidor propio ni configuración compleja.
