const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../Web polinetic');
const file = path.join(root, 'index.html');
let html = fs.readFileSync(file, 'utf8');
function replace(from, to) { if (!html.includes(from)) throw Error('Missing: ' + from.slice(0, 90)); html = html.replace(from, to); }
replace('<title>Polinetic · Energía que conecta contigo</title>', '<title>Instalaciones eléctricas y energía solar en Palma de Mallorca | Polinetic</title>');
replace('content="Polinetic. Instalaciones eléctricas, energía solar, mantenimiento de comunidades, asesoramiento energético y material eléctrico. Soluciones que conectan contigo."', 'content="Polinetic en Palma de Mallorca: instalaciones y reparaciones eléctricas, energía solar y mantenimiento de comunidades. Consulta tu proyecto en el 655 143 119."');
replace('  <link rel="icon"', `  <link rel="canonical" href="https://polinetic.es/">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="es_ES">
  <meta property="og:site_name" content="Polinetic">
  <meta property="og:title" content="Polinetic · Electricidad y energía solar en Palma de Mallorca">
  <meta property="og:description" content="Instalaciones, reparaciones eléctricas y mantenimiento de comunidades. Cuéntanos qué necesitas.">
  <meta property="og:url" content="https://polinetic.es/">
  <meta property="og:image" content="https://polinetic.es/assets/brand/polinetic.png">
  <meta property="og:image:alt" content="Polinetic. Servicios tecnológicos avanzados">
  <script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Electrician','@id':'https://polinetic.es/#empresa',name:'Polinetic',url:'https://polinetic.es/',logo:'https://polinetic.es/assets/brand/polinetic.png',telephone:'+34655143119',email:'servicios@polinetic.es',address:{'@type':'PostalAddress',streetAddress:'Carretera Militar, 219 A - Casa A',postalCode:'07600',addressLocality:'Palma de Mallorca',addressRegion:'Islas Baleares',addressCountry:'ES'},hasOfferCatalog:{'@type':'OfferCatalog',name:'Servicios de Polinetic',itemListElement:['Instalaciones y reparaciones eléctricas','Instalaciones fotovoltaicas','Mantenimiento de comunidades','Asesoramiento energético','Venta de material eléctrico'].map(name=>({'@type':'Offer',itemOffered:{'@type':'Service',name}}))}})}</script>
  <link rel="icon"`);
replace('<a href="#servicios">Servicios</a><a href="#nosotros">Por qué Polinetic</a><a href="#proceso">Cómo trabajamos</a><a href="#contacto" class="button button-small">Hablemos de tu proyecto <span aria-hidden="true">↗</span></a>', '<a href="#servicios">Servicios</a><a href="#nosotros">Polinetic</a><a href="#contacto" class="button button-small">Pedir presupuesto <span aria-hidden="true">↗</span></a>');
replace('      <button class="menu-toggle"', '      <a class="header-call" data-phone-link href="tel:+34655143119" aria-label="Llamar a Polinetic al 655 143 119"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3H4a1 1 0 0 0-1 1c0 9.4 7.6 17 17 17a1 1 0 0 0 1-1v-3l-5-2-2 2a15 15 0 0 1-7-7l2-2-2-5Z"/></svg><span>Llamar</span></a>\n      <button class="menu-toggle"');
replace('ELECTRICIDAD · ENERGÍA · CONFIANZA', 'POLINETIC · PALMA DE MALLORCA');
replace('<h1 id="hero-title">La energía<br>que <span class="highlight">conecta</span><br>contigo<span class="orange">.</span></h1>', '<h1 id="hero-title">Instalaciones eléctricas y <span class="highlight">energía solar</span> en Palma de Mallorca<span class="orange">.</span></h1>');
replace('De una pequeña reparación a un gran cambio energético. Soluciones para tu hogar, tu comunidad y tu negocio.', 'Reparaciones, instalaciones y mantenimiento para viviendas, comunidades y negocios. Cuéntanos qué necesitas.');
replace('Cuéntanos qué necesitas <span aria-hidden="true">↗</span></a><a class="text-link" href="#servicios">Explorar servicios', 'Pedir presupuesto <span aria-hidden="true">↗</span></a><a class="text-link" href="#servicios">Ver servicios');
replace('Trato cercano. Soluciones claras.<br><strong>Todo empieza por escucharte.</strong>', 'La energía que conecta contigo.<br><strong>Electricidad y tecnología, con trato cercano.</strong>');
replace('La electricidad mueve tu día a día.<br>Nosotros nos encargamos de que<br>todo siga funcionando.', 'Desde una avería hasta una instalación solar.<br>Elige el servicio y consulta tu caso.');
replace('<h2 id="about-title">Tecnología que avanza.<br>Un trato que<br><span class="serif-word">permanece.</span></h2><p>Detrás de cada instalación hay personas. Alguien que quiere estar tranquilo en casa, una comunidad que necesita respuestas o un negocio que no puede parar.</p><p>En Polinetic conectamos el conocimiento técnico con algo igual de importante: entender lo que necesitas y explicarte la solución.</p>', '<h2 id="about-title">Polinetic, desde<br><span class="serif-word">Palma de Mallorca.</span></h2><p>Estamos en Carretera Militar, 219 A. Reunimos servicios de electricidad, energía solar y mantenimiento para viviendas, comunidades y negocios.</p><p>Habla con nosotros en el <a data-phone-link href="tel:+34655143119">655 143 119</a>. Indica dónde necesitas el trabajo y valoramos contigo las opciones.</p>');
replace('<span class="contact-signature">polinetic<span>↗</span></span>', '');
replace('<h2 id="contact-title">Tu próximo proyecto<br>empieza con un<br><span class="serif-word">hola.</span><span class="contact-star" aria-hidden="true">✳</span></h2><p>Cuéntanos qué tienes en mente.<br>Vamos a darle forma, juntos.</p>', '<h2 id="contact-title">Hablemos de<br><span class="serif-word">tu proyecto.</span></h2><p>Llámanos o describe lo que necesitas.<br>Indica la localidad para valorar el trabajo.</p>');
replace('<form class="contact-form" id="contact-form">', '<form class="contact-form" id="contact-form" action="contact.php" method="post">\n          <div class="form-trap" aria-hidden="true"><label>Deja este campo vacío<input name="website" tabindex="-1" autocomplete="off"></label></div>');
replace('<p class="form-help" id="form-help">Prepara tu consulta y descárgala para tener todos los detalles a mano. Este formulario no envía datos.</p>', '<p class="form-help" id="form-help">Prepararemos un email con tu consulta para que lo envíes desde tu aplicación de correo.</p>\n          <p class="form-privacy">Usaremos tus datos para atender esta consulta. <a href="privacidad.html">Información sobre privacidad</a>.</p>');
replace('<span id="submit-label">Preparar mi consulta</span>', '<span id="submit-label">Preparar email</span>');
replace('<noscript><p>Activa JavaScript para preparar y descargar tu consulta.</p></noscript>', '<noscript><p>Para contactar, llama al <a href="tel:+34655143119">655 143 119</a> o escribe a <a href="mailto:servicios@polinetic.es">servicios@polinetic.es</a>.</p></noscript>');
replace('<span>Electricidad y energía, con sentido.</span><button class="footer-link"', '<nav class="legal-links" aria-label="Información legal"><a href="aviso-legal.html">Aviso legal</a><a href="privacidad.html">Privacidad</a></nav><button class="footer-link"');
// Put contact just after services: a shorter path to an enquiry on every device.
const start=html.indexOf('    <section class="contact-wrap');
const end=html.indexOf('    </section>',start)+'    </section>'.length;
const contact=html.slice(start,end);
html=html.slice(0,start)+html.slice(end);
html=html.replace('    <section class="about section"',contact.replace('04 / CONECTEMOS','02 / CONTACTO')+'\n\n    <section class="about section"');
html=html.replace('02 / EL LADO HUMANO DE LA ENERGÍA','03 / POLINETIC').replace('03 / ASÍ DE SENCILLO','04 / ASÍ DE SENCILLO');
fs.writeFileSync(file,html);
