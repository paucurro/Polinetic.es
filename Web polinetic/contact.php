<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
ini_set('display_errors', '0');

function respond(int $status, array $body): never {
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function fail(int $status, string $message): never {
    respond($status, ['ok' => false, 'message' => $message]);
}

$config = require __DIR__ . '/contact-config.php';
$enabled = $config['enabled'] && function_exists('mail');
$method = $_SERVER['REQUEST_METHOD'] ?? '';
if ($method === 'GET') {
    respond(200, ['enabled' => $enabled]);
}
if ($method !== 'POST') {
    header('Allow: GET, POST');
    fail(405, 'Método no permitido.');
}
if (!$enabled) fail(503, 'El envío no está disponible. Llámanos al 655 143 119.');

// JSON plus a custom header prevent cross-site HTML form submissions.
// No CORS headers are emitted and no session cookies are needed.
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && !in_array($origin, $config['origins'], true)) {
    // A local PHP preview may submit from localhost, never from a remote client.
    $local = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true)
        && preg_match('~^http://(127\.0\.0\.1|localhost)(:\d+)?$~D', $origin);
    if (!$local) fail(403, 'Origen no permitido.');
}
if (($_SERVER['HTTP_X_POLINETIC_FORM'] ?? '') !== '1') fail(403, 'Solicitud no permitida.');
if (!preg_match('~^application/json(?:\s*;|$)~i', $_SERVER['CONTENT_TYPE'] ?? '')) {
    fail(415, 'Formato no permitido.');
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 24576) fail(413, 'La consulta es demasiado larga.');
$raw = file_get_contents('php://input', false, null, 0, 24577);
if ($raw === false || strlen($raw) > 24576) fail(413, 'La consulta es demasiado larga.');
try { $data = json_decode($raw, true, 16, JSON_THROW_ON_ERROR); }
catch (JsonException $e) { fail(400, 'No se pudo leer la consulta.'); }
if (!is_array($data)) fail(400, 'No se pudo leer la consulta.');

$limits = ['nombre' => 100, 'email' => 150, 'servicio' => 30, 'mensaje' => 4000, 'website' => 200];
foreach ($limits as $field => $limit) {
    if (!isset($data[$field]) || !is_string($data[$field])) fail(422, 'Revisa los campos de la consulta.');
    $data[$field] = trim($data[$field]);
    if (!preg_match('//u', $data[$field]) || preg_match_all('/./us', $data[$field]) > $limit || str_contains($data[$field], "\0")) {
        fail(422, 'Revisa la longitud de los campos.');
    }
}
if ($data['website'] !== '') fail(422, 'No se pudo validar la consulta. Llámanos al 655 143 119.');
if ($data['nombre'] === '' || $data['mensaje'] === '' || preg_match('/[\r\n]/', $data['nombre'] . $data['email'])
    || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) fail(422, 'Indica tu nombre, un email válido y el mensaje.');
$services = [
    'electricidad' => 'Instalaciones eléctricas y reparaciones',
    'fotovoltaica' => 'Instalaciones fotovoltaicas',
    'comunidades' => 'Mantenimiento de comunidades',
    'asesoramiento' => 'Asesoramiento energético',
    'material' => 'Venta de material eléctrico',
    'otro' => 'Necesito orientación',
];
if (!isset($services[$data['servicio']])) fail(422, 'Selecciona un servicio.');

// Keep only a hashed IP counter, outside the public web directory. No enquiry
// contents are saved here. Expired counters are removed on subsequent requests.
$directory = $config['rate_directory'];
if (!is_dir($directory) && !@mkdir($directory, 0700, true) && !is_dir($directory)) fail(503, 'No se pudo enviar. Inténtalo más tarde o llámanos.');
foreach (glob($directory . '/*.json') ?: [] as $old) {
    if ((@filemtime($old) ?: time()) < time() - 900) @unlink($old);
}
$key = hash('sha256', __DIR__ . '|' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
$handle = @fopen($directory . '/' . $key . '.json', 'c+');
if (!$handle || !flock($handle, LOCK_EX)) fail(503, 'No se pudo enviar. Inténtalo más tarde o llámanos.');
$counter = json_decode(stream_get_contents($handle) ?: '{}', true);
$now = time();
if (!is_array($counter) || ($counter['expires'] ?? 0) <= $now) $counter = ['expires' => $now + 900, 'count' => 0];
if ($counter['count'] >= 5) {
    flock($handle, LOCK_UN); fclose($handle);
    header('Retry-After: ' . max(1, $counter['expires'] - $now));
    fail(429, 'Has enviado varias consultas. Espera unos minutos o llámanos al 655 143 119.');
}
$counter['count']++;
rewind($handle); ftruncate($handle, 0);
$written = fwrite($handle, json_encode($counter));
fflush($handle); flock($handle, LOCK_UN); fclose($handle);
if ($written === false) fail(503, 'No se pudo enviar. Inténtalo más tarde o llámanos.');

$service = $services[$data['servicio']];
$subject = 'Consulta web Polinetic';
$body = "Nueva consulta desde polinetic.es\r\n\r\nNombre: {$data['nombre']}\r\nEmail: {$data['email']}\r\nServicio: {$service}\r\n\r\n{$data['mensaje']}\r\n";
$headers = [
    'From' => 'Polinetic <' . $config['sender'] . '>',
    'Reply-To' => $data['email'],
    'MIME-Version' => '1.0',
    'Content-Type' => 'text/plain; charset=UTF-8',
    'Content-Transfer-Encoding' => 'base64',
];
$sent = @mail($config['recipient'], $subject, chunk_split(base64_encode($body)), $headers);
if (!$sent) fail(503, 'No se ha podido enviar tu consulta. Conservamos el texto en pantalla: inténtalo de nuevo o llama al 655 143 119.');
respond(200, ['ok' => true, 'message' => 'Consulta enviada. Gracias por contactar con Polinetic.']);
