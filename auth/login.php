<?php

require "services/user_service.php";

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$login = json_decode($data, true); // true -> as php array

	$email = $login["email"];

	$password_input = $login["password"];


	$servername = "localhost";

	$database = "schedule_db";

	$username = "root";

	$password = "1111";

	//MOVE THOSE^ 4 INTO .env

	try {

		$conn = new PDO("mysql:host=$servername;dbname=schedule_db", $username, $password);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

		$current_user = find_user_by_email($email, $conn);

		if($current_user->get_id() == -1){

			echo "Incorrect email or password!";

		}

		else{

			login($current_user, $password_input);

		}

	}

	catch (PDOException $e) {

		echo "Database connection failed: " . $e->getMessage();

	}

}

?>