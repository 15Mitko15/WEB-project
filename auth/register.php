<?php

//echo "this is register.php";

require "services/user_service.php";

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$register = json_decode($data, true); // true -> as php array

	$name = $register["name"];

	$email = $register["email"];

	$password_input = $register["password"];


	$servername = "localhost";

	$database = "schedule_db";

	$username = "root";

	$password = "1111";

	//MOVE THOSE^ 4 INTO .env

	try {
		
		//$conn = new PDO("mysql:host=$servername", $username, $password);

		$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password); //we are for some reason failing here

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

		$current_user = find_user_by_email($email, $conn);

		if($current_user->get_id() == -1){

			register($name, $email, $password_input, $conn);

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