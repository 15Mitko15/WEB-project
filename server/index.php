<?php

declare(strict_types = 1);

require "src/config/env_config.php";

require "src/config/db_config.php";

require "src/router.php";

require "src/handlers/router_handlers.php";

session_start();

//$path = $_SERVER["REQUEST_URI"];							//with query string
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);	//without query string

$router = new Router;

$router->add("/login", function() { login_handler(); });

$router->add("/register", function() { register_handler(); });

$router->add("/check_logged_in", function() { check_logged_in_handler(); });

$router->add("/logout", function() { logout_handler(); });

$router->add("/home", function() { home_page_handler(); });

$router->add("/event_preference", function() { event_preference_handler(); });

$router->dispatch($path);

?>