# Polinetic

Web estática responsive en español. Abre `index.html` con cualquier navegador; no requiere instalación, compilación ni servidor. Para publicarla, sube el contenido de esta carpeta a un alojamiento web estático.

## Incluye

- Los cinco servicios solicitados, con fotografía y ficha ampliada.
- Logo original facilitado por el cliente, en la cabecera, el pie de página y el favicon.
- Menú móvil, animaciones al entrar en pantalla, efectos de imagen, preguntas desplegables y ventanas de detalle accesibles con teclado.
- Respeto por la preferencia de movimiento reducido del dispositivo.
- Imágenes locales y funcionamiento sin dependencias externas, cookies ni analítica.

## Datos de contacto

Los datos de contacto están configurados en `config.js`: email `servicios@polinetic.es`, teléfono `+34 655 143 119` y dirección en Carretera Militar, 219 A - Casa A, 07600 - Palma de Mallorca, Islas Baleares. Puedes modificarlos en `email`, `phone` y `address`. El campo opcional `serviceArea` permite indicar una zona de servicio si se desea.

Mientras `email` esté vacío, el formulario genera y descarga una consulta en formato `.txt`. No envía ni almacena datos y lo indica expresamente. Al configurar el email, prepara un mensaje mediante `mailto:`; el visitante debe enviarlo desde su propia aplicación de correo. El teléfono y la zona se muestran automáticamente si están configurados.

Para recibir solicitudes directamente desde la web sin una aplicación de correo, será necesario conectar un servicio de formularios o un backend. Antes de publicar como web comercial, completar los datos del titular y los textos legales que correspondan al negocio y al tratamiento real de datos. No se han inventado datos de empresa, certificados, testimonios, estadísticas ni plazos de respuesta.

## Archivos

- `index.html`: contenido y estructura.
- `styles.css`: diseño, adaptación a pantallas y movimiento.
- `app.js`: menú, fichas, preguntas y preparación de consultas.
- `config.js`: contacto editable.
- `assets/images/`: fotografías descargadas y optimizadas.
- `assets/brand/polinetic.png`: logo y favicon actuales. Los SVG anteriores se conservan como archivos de la propuesta inicial.
- `CREDITOS.md`: procedencia y licencia de las imágenes.

El logo es una copia sin modificar de `polinetic_final_72.png`, facilitado por el cliente. Se mantiene su proporción original y se presenta sobre fondo blanco para conservar la legibilidad de sus colores.
