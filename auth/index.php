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

});

$router->add($index_home_dir . "register", function() {

	require "register.php";

});

$router->add($index_home_dir . "check_logged_in", function() {//CHANGE LATER

	require "services/user_service.php";

	session_start();

	if(check_logged_in()){

		echo "logged in";

	}
	else{

		echo "NOT logged in";

	}

});

$router->add($index_home_dir . "logout", function() {//MAYBE CHANGE LATER

	session_start();

	session_unset();

	session_destroy();

	//echo "loggged out";

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