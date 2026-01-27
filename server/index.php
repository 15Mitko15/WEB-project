<?php

declare(strict_types=1); 

$oneHour = 3600;

require __DIR__ . '/src/router.php';
require __DIR__ . '/src/controllers/auth_controller.php';
require_once __DIR__ . '/src/global_error_handler.php';

register_global_error_handlers();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

session_set_cookie_params([
	'lifetime' => $oneHour,  
	'path' => '/',
	'httponly' => true,
	'samesite' => 'Lax',
	'secure' => false, 
]);

// Starting session once
session_start();

$router = new Router();

$router->post('/login', [AuthController::class, 'login']);
$router->post('/register', [AuthController::class, 'register']);
$router->post('/logout', [AuthController::class, 'logout']);
$router->get('/check_logged_in', [AuthController::class, 'checkLoggedIn']);

$router->dispatch($method, $path);
?>
