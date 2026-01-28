<?php
declare(strict_types=1);

$oneHour = 3600;

require_once __DIR__ . '/src/global_error_handler.php';
require_once __DIR__ . '/src/router.php';
require_once __DIR__ . '/src/controllers/auth_controller.php';
require_once __DIR__ . '/src/controllers/event_controller.php';

register_global_error_handlers();

// ---- CORS (dev) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigins = [
  'http://localhost:3000',
];

if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
  header("Access-Control-Allow-Origin: $origin");
  header("Vary: Origin");
  header("Access-Control-Allow-Credentials: true");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
}

// Handle preflight
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
  http_response_code(204);
  exit;
}

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// ---- Session (1 hour) ----
ini_set('session.gc_maxlifetime', (string)$oneHour);

session_set_cookie_params([
  'lifetime' => $oneHour,
  'path' => '/',
  'httponly' => true,
  'samesite' => 'Lax',
  'secure' => false, // true on HTTPS
]);

session_start();

$router = new Router();

$router->post('/auth/login', [AuthController::class, 'login']);
$router->post('/auth/register', [AuthController::class, 'register']);
$router->post('/auth/logout', [AuthController::class, 'logout']);
$router->get('/auth/me', [AuthController::class, 'me']); 
$router->get('/auth/check_logged_in', [AuthController::class, 'checkLoggedIn']);
$router->get('/home', [EventController::class, 'home']);
$router->post('/event_preference', [EventController::class, 'event_preference']);

$router->dispatch($method, $path);
