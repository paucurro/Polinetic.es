# Polinetic

Web en español para Polinetic, S.L. (B57287922), con servicio en toda Mallorca. Cabecera y pie blancos, logo original, llamada visible, cinco servicios y contacto inmediatamente después de los servicios.

Abre `index.html` para revisar el diseño sin instalar nada. En esa modalidad el formulario prepara un email. Para recibir consultas directamente, publica los archivos en un alojamiento con PHP 8.3 y envío de correo configurado. No requiere compilación ni dependencias externas.

## Incluye

- Los cinco servicios solicitados, con fotografía y ficha ampliada.
- Logo original facilitado por el cliente, en la cabecera, el pie de página y el favicon.
- Menú móvil, animaciones al entrar en pantalla, efectos de imagen, preguntas desplegables y ventanas de detalle accesibles con teclado.
- Respeto por la preferencia de movimiento reducido del dispositivo.
- Imágenes locales y funcionamiento sin dependencias externas, cookies ni analítica.

## Datos de contacto

Los datos de contacto están configurados en `config.js`: email `servicios@polinetic.es`, teléfono `+34 655 143 119` y dirección en Carretera Militar, 219 A - Casa A, 07600 - Palma de Mallorca, Islas Baleares. Puedes modificarlos en `email`, `phone` y `address`. El campo opcional `serviceArea` permite indicar una zona de servicio si se desea.

Mientras `email` esté vacío, el formulario genera y descarga una consulta en formato `.txt`. No envía ni almacena datos y lo indica expresamente. Al configurar el email, prepara un mensaje mediante `mailto:`; el visitante debe enviarlo desde su propia aplicación de correo. El teléfono y la zona se muestran automáticamente si están configurados.

Cuando `contact.php` responde y está activado, el botón cambia a «Enviar consulta» y se utiliza el servidor PHP. Las consultas se envían a `servicios@polinetic.es`, configurado junto al remitente en `contact-config.php`. El correo del visitante se usa solo como `Reply-To`. No hay contraseñas en el proyecto.

El servidor valida formato, campos, tamaño, origen y un campo trampa. Limita a cinco intentos por IP en 15 minutos; guarda solamente un contador con huella de IP fuera de la raíz pública y elimina contadores caducados al recibir nuevas consultas. No guarda el contenido en una base de datos. Los mensajes quedan en el correo de la empresa.

Si falla el envío se conserva el texto; si el navegador no puede confirmar la respuesta, no se afirma que se haya enviado. Para desactivar el envío directo, cambia `enabled` a `false` en `contact-config.php` o establece `POLINETIC_CONTACT_ENABLED=0` en el servidor.

Para una vista previa con PHP, ejecuta desde la carpeta superior: `php -S 127.0.0.1:8080 -t "Web polinetic"`. La entrega de correo depende de la configuración de ese servidor. La aceptación por `mail()` no acredita recepción en el buzón: al publicar, comprobar la llegada real a `servicios@polinetic.es`, la respuesta al visitante y la configuración del remitente con el proveedor. Las pruebas locales capturan el correo sin enviarlo a Internet.

## Contenido pendiente y publicación

Titular, NIF, destino del correo, cobertura de toda Mallorca y PHP 8.3 confirmados por el cliente. La dirección de contacto procede del proyecto. Quedan por confirmar la dirección fiscal, los datos del Registro Mercantil, el proveedor de alojamiento/correo y, si corresponde, sus transferencias internacionales y plazos de registros. Incorporarlos antes de considerar definitivos los textos legales.

`aviso-legal.html` y `privacidad.html` son borradores adaptados a los datos disponibles y al funcionamiento implementado. Referencias consultadas: [artículo 10 LSSI](https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758#a10), [derecho de información, AEPD](https://www.aepd.es/derechos-y-deberes/conoce-tus-derechos/derecho-de-informacion) y [RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/spa).

Las fotos siguen siendo imágenes de archivo identificadas en los créditos. Faltan fotografías autorizadas de trabajos propios, información real del equipo y un enlace a reseñas verificables. No se han inventado testimonios, personas, experiencia, certificaciones ni resultados.

La web incorpora título y descripción locales, canonical, Open Graph, datos estructurados `Electrician`, `robots.txt` y `sitemap.xml`. No se han inventado valoraciones ni horarios. La preparación para buscadores no garantiza posicionamiento. Si se cambia de dominio, actualizar estas referencias y los orígenes permitidos del formulario.

Al sustituir la web actual, redirigir `/legal-notice` y `/privacy` a las páginas nuevas, evitando que siga accesible la información incorrecta anterior. No se ha modificado producción.

No hay cookies, analítica ni servicios externos incrustados. Medir conversiones reales requiere definir e instalar una solución de medición y adaptar la privacidad si procede.

## Archivos

- `index.html`: contenido y estructura.
- `styles.css`: diseño, adaptación a pantallas y movimiento.
- `app.js`: menú, fichas, preguntas y preparación de consultas.
- `config.js`: contacto editable.
- `contact.php` y `contact-config.php`: formulario y correo en PHP.
- `aviso-legal.html` y `privacidad.html`: información legal.
- `robots.txt` y `sitemap.xml`: rastreo e indexación.
- `assets/images/`: fotografías descargadas y optimizadas.
- `assets/brand/polinetic.png`: logo y favicon actuales. Los SVG anteriores se conservan como archivos de la propuesta inicial.
- `CREDITOS.md`: procedencia y licencia de las imágenes.

El logo es una copia sin modificar de `polinetic_final_72.png`, facilitado por el cliente. Se mantiene su proporción original y se presenta sobre fondo blanco para conservar la legibilidad de sus colores.

No es necesario publicar este README ni `CREDITOS.md`; los créditos ya aparecen en la web. Las herramientas y capturas de `../.qa/` son locales y no forman parte del sitio.

## Validación

Desde la carpeta superior, `node .qa/check-improvements.cjs`: servidor PHP real y SMTP local de captura, validación de campos, origen, antispam, fallo y éxito del correo, recuperación del formulario, límite de frecuencia, seis anchos, menú móvil, fichas, páginas legales, metadatos y vista previa sin servidor. Requiere PHP en PATH y el Playwright instalado en `.qa`. Usa una copia aislada en `.qa/runtime-*`; no envía correo a Internet.
