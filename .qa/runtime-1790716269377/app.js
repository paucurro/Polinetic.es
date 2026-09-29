(() => {
  'use strict';
  const config = window.POLINETIC_CONFIG || {};
  const services = {
    electricidad: { title: 'Instalaciones eléctricas y reparaciones', kicker: '01 / SEGURIDAD EN CADA CONEXIÓN', image: 'electricidad', description: 'Una instalación pensada para tu día a día. Revisamos lo que necesitas, localizamos las averías y te proponemos una solución adaptada a tu vivienda o negocio.', items: ['Instalaciones nuevas y reformas eléctricas.', 'Diagnóstico y reparación de averías.', 'Cuadros eléctricos, mecanismos y puntos de luz.', 'Mejoras de iluminación y revisión de la instalación.'] },
    fotovoltaica: { title: 'Instalaciones fotovoltaicas', kicker: '02 / EL SOL TRABAJA PARA TI', image: 'solar', description: 'Convierte la energía del sol en una oportunidad para tu hogar o negocio. Estudiamos tu consumo y las características del espacio antes de definir la instalación.', items: ['Estudio de las posibilidades de autoconsumo.', 'Propuesta adaptada a tu cubierta y consumo.', 'Instalación de paneles y equipos fotovoltaicos.', 'Orientación sobre el uso y mantenimiento del sistema.'] },
    comunidades: { title: 'Mantenimiento de comunidades', kicker: '03 / CUIDAMOS LO QUE COMPARTÍS', image: 'comunidades', description: 'Los espacios compartidos también necesitan atención. Ayudamos a mantener las instalaciones eléctricas de tu comunidad y a planificar sus mejoras.', items: ['Revisión de instalaciones eléctricas comunes.', 'Mantenimiento de iluminación en portales y garajes.', 'Localización y reparación de incidencias.', 'Propuestas para mejorar la eficiencia de las zonas comunes.'] },
    asesoramiento: { title: 'Asesoramiento energético', kicker: '04 / ENTENDER PARA DECIDIR', image: 'energia', description: 'Tomar buenas decisiones empieza por entender tu energía. Revisamos tu situación y te ayudamos a identificar oportunidades de mejora, sin promesas de ahorro genéricas.', items: ['Revisión de facturas y hábitos de consumo.', 'Análisis de la potencia y necesidades energéticas.', 'Orientación sobre medidas de eficiencia.', 'Valoración de opciones de autoconsumo e iluminación.'] },
    material: { title: 'Venta de material eléctrico', kicker: '05 / CADA PIEZA CUENTA', image: 'material', description: 'El material adecuado marca la diferencia. Consulta por los componentes que necesitas y te orientamos para elegir según las características de tu proyecto.', items: ['Mecanismos, enchufes e interruptores.', 'Cableado, conexiones y protecciones.', 'Soluciones y accesorios de iluminación.', 'Consulta de referencias, precios y disponibilidad.'] }
  };

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.navigation');
  function closeMenu() { navigation.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.setAttribute('aria-label', 'Abrir menú'); }
  menuButton.addEventListener('click', () => { const open = menuButton.getAttribute('aria-expanded') !== 'true'; navigation.classList.toggle('is-open', open); menuButton.setAttribute('aria-expanded', String(open)); menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('click', event => { if (!event.target.closest('.header')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') { closeMenu(); menuButton.focus(); } });
  window.matchMedia('(min-width: 701px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  const header = document.querySelector('.header');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 15);
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    document.documentElement.classList.add('motion-ready');
  }

  const serviceDialog = document.getElementById('service-dialog');
  const creditsDialog = document.getElementById('credits-dialog');
  let selectedService = '';
  function openDialog(dialog) { dialog.showModal(); document.body.classList.add('modal-open'); }
  [serviceDialog, creditsDialog].forEach(dialog => {
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  });
  document.querySelectorAll('[data-service]').forEach(button => button.addEventListener('click', () => {
    selectedService = button.dataset.service;
    const service = services[selectedService];
    document.getElementById('dialog-title').textContent = service.title;
    document.getElementById('dialog-kicker').textContent = service.kicker;
    document.getElementById('dialog-description').textContent = service.description;
    document.getElementById('dialog-image').src = `assets/images/${service.image}.jpg`;
    document.getElementById('dialog-image').alt = document.querySelector(`[data-service="${selectedService}"]`).closest('article').querySelector('img').alt;
    document.getElementById('dialog-list').replaceChildren(...service.items.map(item => { const li = document.createElement('li'); li.textContent = item; return li; }));
    openDialog(serviceDialog);
  }));
  document.getElementById('dialog-contact').addEventListener('click', () => { document.getElementById('service-select').value = selectedService; serviceDialog.close(); document.querySelector('[name="nombre"]').focus({ preventScroll: true }); });
  document.getElementById('credits-open').addEventListener('click', () => openDialog(creditsDialog));

  const contactDetails = document.getElementById('contact-details');
  const email = typeof config.email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email.trim()) ? config.email.trim() : '';
  if (email) { const link = document.createElement('a'); link.href = `mailto:${email}`; link.textContent = email; contactDetails.append(link); document.getElementById('submit-label').textContent = 'Preparar email'; document.getElementById('form-help').textContent = 'Al continuar se abrirá tu aplicación de correo con la consulta preparada. Revisa el mensaje y envíalo desde allí. La web no almacena tus datos.'; }
  if (config.phone) { const href = `tel:${String(config.phone).replace(/[^+\d]/g, '')}`; const link = document.createElement('a'); link.href = href; link.textContent = config.phone; contactDetails.append(link); document.querySelectorAll('[data-phone-link]').forEach(anchor => { anchor.href = href; if (anchor.classList.contains('header-call')) anchor.setAttribute('aria-label', `Llamar a Polinetic al ${config.phone}`); }); }
  if (config.address) { const address = document.createElement('address'); address.className = 'contact-address'; address.textContent = config.address; contactDetails.append(address); }
  if (config.serviceArea) { const area = document.createElement('span'); area.textContent = config.serviceArea; contactDetails.append(area); }

  const form = document.getElementById('contact-form');
  const submit = form.querySelector('[type="submit"]');
  const submitLabel = document.getElementById('submit-label');
  const formHelp = document.getElementById('form-help');
  let directContact = false;
  let endpoint = null;
  try {
    const candidate = new URL(config.contactEndpoint || 'contact.php', window.location.href);
    if (['http:', 'https:'].includes(candidate.protocol) && candidate.origin === location.origin) endpoint = candidate;
  } catch { /* Direct file previews use the email fallback. */ }
  if (endpoint) {
    fetch(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store', signal: AbortSignal.timeout(5000) })
      .then(response => response.ok ? response.json() : null)
      .then(result => {
        if (result?.enabled === true) {
          directContact = true;
          submitLabel.textContent = 'Enviar consulta';
          formHelp.textContent = 'Tu consulta llegará a Polinetic. No necesitas abrir tu aplicación de correo.';
        }
      }).catch(() => { /* Email and phone remain available when PHP is unavailable. */ });
  }

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const service = services[data.get('servicio')]?.title || 'Necesito orientación';
    const body = `Hola, Polinetic:\n\nMe gustaría consultar sobre ${service.toLowerCase()}.\n\nNombre: ${data.get('nombre').trim()}\nEmail: ${data.get('email').trim()}\nServicio: ${service}\n\n${data.get('mensaje').trim()}\n\nGracias.`;
    const status = document.getElementById('form-status');
    status.classList.remove('is-error', 'is-success');
    if (directContact) {
      if (submit.disabled) return;
      submit.disabled = true;
      form.setAttribute('aria-busy', 'true');
      submitLabel.textContent = 'Enviando…';
      status.textContent = 'Enviando tu consulta…';
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Polinetic-Form': '1' },
          body: JSON.stringify(Object.fromEntries(data)),
          signal: AbortSignal.timeout(20000)
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error(result.message || 'No se pudo enviar la consulta. Inténtalo de nuevo o llámanos.');
        status.textContent = result.message;
        status.classList.add('is-success');
        form.reset();
      } catch (error) {
        status.classList.add('is-error');
        status.textContent = error.name === 'TimeoutError' || error instanceof TypeError || error instanceof SyntaxError
          ? 'No hemos podido confirmar el envío. Tu mensaje sigue aquí. Puedes llamarnos al 655 143 119 o escribir a servicios@polinetic.es.'
          : error.message;
      } finally {
        submit.disabled = false;
        form.removeAttribute('aria-busy');
        submitLabel.textContent = 'Enviar consulta';
      }
      return;
    }
    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Consulta · ${service}`)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Consulta preparada para tu aplicación de correo. El envío se completa desde esa aplicación. Si no se abre, puedes escribir a ' + email + '.';
    } else {
      const url = URL.createObjectURL(new Blob([body], { type: 'text/plain;charset=utf-8' }));
      const link = document.createElement('a'); link.href = url; link.download = 'consulta-polinetic.txt'; document.body.append(link); link.click(); link.remove(); window.setTimeout(() => URL.revokeObjectURL(url), 30000);
      status.textContent = 'Tu consulta se ha preparado como archivo de texto. No se ha enviado. El contacto directo estará disponible cuando se añadan los datos de Polinetic.';
    }
  });
  document.getElementById('year').textContent = new Date().getFullYear();
})();
