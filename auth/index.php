<?php

declare(strict_types = 1);

$index_home_dir = "/auth/"; //maybe delete later and replace with __DIR__

//$path = $_SERVER["REQUEST_URI"];							//with query string
$path = parse_url($_SERVER["REQUEST_URI"], PHP_URL_PATH);	//without query string

require "router.php";

$router = new Router;

$router->add($index_home_dir . "", function() {
	echo "Home page.";
});

$router->add($index_home_dir . "login", function() {

	require "login.php";

	//require "services/user_service.php";

	//echo "we logged in";
	//header("Location: " . $index_home_dir . "test_login.php");
});

$router->add($index_home_dir . "register", function() {

	require "register.php";

	//require "services/user_service.php";

});

$router->dispatch($path);








/*
switch ($path) {
	case $index_home_dir . "":
		echo "Home page.";
		break;

	//DELETE THOSE LATER

	case $index_home_dir . "about":
		echo "About page.";
		break;

	case $index_home_dir . "contact":
		echo "Contact page.";
		break;

	//
	
	default:
		echo "Page not found: ";
		echo $path;
		break;
}
*/


?>