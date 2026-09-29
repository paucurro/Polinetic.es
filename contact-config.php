<?php
declare(strict_types=1);

// Configuración exclusiva del servidor. No contiene contraseñas.
return [
    'enabled' => getenv('POLINETIC_CONTACT_ENABLED') !== '0',
    'recipient' => 'servicios@polinetic.es',
    'sender' => 'servicios@polinetic.es',
    'origins' => ['https://polinetic.es', 'https://www.polinetic.es'],
    'rate_directory' => sys_get_temp_dir() . '/polinetic-contact-' . substr(hash('sha256', __DIR__), 0, 16),
];
