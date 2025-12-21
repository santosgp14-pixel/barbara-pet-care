# 📧 Vista Previa de los Correos Automáticos

## 🎯 Sistema Implementado

Cuando un usuario llena el formulario de contacto, el sistema envía **automáticamente** dos correos:

### 1️⃣ Email al Administrador (TÚ)
**Para**: Tu email configurado en `EMAIL_DESTINATARIO`  
**Asunto**: 🐾 Nueva solicitud de [Nombre del Cliente]

#### Contenido incluido:
- ✅ Header atractivo con gradiente morado
- ✅ Sección "Datos del Cliente" con:
  - Nombre completo
  - Email
  - Teléfono
  - Fecha de la solicitud
- ✅ Sección "Detalles del Viaje" con:
  - País de origen
  - País de destino
  - Tipo de mascota
  - Fecha estimada de viaje
- ✅ Mensaje del cliente (si lo escribió)
- ✅ Cotización previa (si viene del cotizador)
- ✅ Recordatorio para contactar al cliente en menos de 24 horas

#### Diseño:
- Fondo blanco con cajas de información organizadas
- Bordes de colores para cada sección
- Iconos para facilitar la lectura rápida
- Totalmente responsive (se ve bien en móvil y desktop)

---

### 2️⃣ Email al Cliente (Confirmación Automática)
**Para**: El email que el cliente proporcionó en el formulario  
**Asunto**: ✅ Hemos recibido tu solicitud - Barbara Pet Care

#### Contenido incluido:
- ✅ Saludo personalizado con el nombre del cliente
- ✅ Mensaje de agradecimiento
- ✅ Resumen de la solicitud:
  - Ruta del viaje (origen → destino)
  - Tipo de mascota
  - Fecha estimada
  - Cotización (si existe)
- ✅ Sección "¿Qué sigue ahora?" explicando los próximos pasos
- ✅ Botón CTA para contactar por WhatsApp
- ✅ Consejo útil sobre documentación
- ✅ Footer con información de contacto

#### Diseño:
- Profesional y amigable
- Colores corporativos (morado/azul)
- Botones de acción destacados
- Enlaces a WhatsApp y otros medios de contacto
- Footer con advertencia de "no responder"

---

## 🚀 Cómo Activarlo

1. **Abre tu Google Apps Script** (ya configurado en tu Google Sheet)
2. **Localiza la línea 2** del código:
   ```javascript
   const EMAIL_DESTINATARIO = 'tu-email@ejemplo.com';
   ```
3. **Reemplaza** `'tu-email@ejemplo.com'` con tu email real, por ejemplo:
   ```javascript
   const EMAIL_DESTINATARIO = 'barbara@petcare.com';
   ```
4. **Guarda** el archivo (Ctrl + S o el icono de guardar)
5. **Implementa** de nuevo:
   - Click en "Implementar" → "Administrar implementaciones"
   - Click en el ícono de lápiz ✏️
   - Selecciona "Nueva versión"
   - Click en "Implementar"

---

## ✅ Verificación

### Para probar que funciona:
1. Llena el formulario de contacto en tu web
2. Revisa tu bandeja de entrada (el email configurado)
3. Deberías recibir un email con el resumen de la solicitud
4. El cliente debe recibir un email de confirmación

### Si no llegan los emails:
1. Verifica que el email en `EMAIL_DESTINATARIO` sea correcto
2. Revisa tu carpeta de SPAM
3. Verifica que diste los permisos necesarios al script
4. Revisa la carpeta "Enviados" en Gmail para confirmar que se enviaron

---

## 🎨 Personalización

### Para cambiar el diseño:
Edita las funciones `enviarEmailAdmin()` y `enviarEmailCliente()` en el script.

### Para cambiar textos:
- **Email admin**: Busca la función `enviarEmailAdmin()` y modifica el HTML
- **Email cliente**: Busca la función `enviarEmailCliente()` y modifica el HTML

### Para cambiar colores:
En el `<style>` de cada función, modifica:
- `.header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }`
- Cambia `#667eea` y `#764ba2` por los colores que prefieras

---

## 📊 Características Técnicas

- **Formato**: HTML5 responsive
- **Compatibilidad**: Gmail, Outlook, Apple Mail, etc.
- **Codificación**: UTF-8 (soporta tildes y caracteres especiales)
- **Tamaño**: Optimizado para carga rápida
- **Imágenes**: Usa emojis para evitar problemas de carga

---

## ⚠️ Importante

- Los emails se envían desde tu cuenta de Gmail asociada al Google Apps Script
- Límite: 100 emails por día (cuenta gratuita de Gmail)
- Los emails NO se pueden enviar desde un "no-reply", siempre irán desde tu cuenta
- Si necesitas más volumen, considera usar un servicio como SendGrid o Mailgun

---

## 💡 Tips Pro

1. **Respuestas rápidas**: Configura plantillas de respuesta en Gmail para responder más rápido
2. **Etiquetas**: Crea una etiqueta "Solicitudes Web" para organizar estos emails
3. **Filtros**: Configura un filtro en Gmail para que estos emails se marquen automáticamente
4. **Calendario**: Bloquea tiempo diario para revisar y responder solicitudes
