<?php

function login_handler(){

	require "src/services/user_service.php";

	if(check_logged_in()){

		echo "You are already logged in!";

		return;

	}

	require "src/auth/session_set.php";

	require "src/auth/login.php";

}

function register_handler(){

	require "src/services/user_service.php";

	if(check_logged_in()){

		echo "You are already logged in!";

		return;

	}

	require "src/auth/register.php";

}

function check_logged_in_handler(){//CHANGE LATER

	require "src/services/user_service.php";

	if(check_logged_in()){

		echo "logged in as: " . $_SESSION['user_id'];

	}
	else{

		echo "NOT logged in";

	}

}

function logout_handler(){//MAYBE CHANGE LATER

	session_start();

	session_unset();

	session_destroy();

}

function home_page_handler(){

	require "src/services/event_service.php";

	require "home_page.php";

}

function event_preference_handler(){

	require "src/services/event_service.php";

	require "change_event_preference.php";;

}

?>