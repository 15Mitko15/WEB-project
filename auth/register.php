<?php

require "services/user_service.php";

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$register = json_decode($data, true); // true -> as php array

	$name = $register["name"];

	$email = $register["email"];

	$password_input = $register["password"];

	$fn = $register["fn"];

	$servername = "localhost";

	$database = "schedule_db";

	$username = "root";

	$password = "1111";

	//MOVE THOSE^ 4 INTO .env

	try {

		$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

		$current_user = find_user_by_email($email, $conn);

		if($current_user->get_id() == -1){

			$current_user = find_user_by_fn($fn, $conn);

			if($current_user->get_id() == -1){

				register($name, $email, $password_input, $fn, $conn);

			}

			else{

				echo "User with such fn already exists!";

			}

		}

		else{

			echo "User with such email already exists!";

		}

	}

	catch (PDOException $e) {

		echo "Database connection failed: " . $e->getMessage();

	}

}

?>