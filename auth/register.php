<?php

//echo "this is register.php";

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$register = json_decode($data, true); // true -> as php array

	$name = $register["name"];

	$email = $register["email"];

	$password_input = $register["password"];


	$servername = "localhost";

	$database = "schedule_db";

	$username = "root";

	$password = "";

	//MOVE THOSE^ 4 INTO .env

	try {
		
		//$conn = new PDO("mysql:host=$servername", $username, $password);

		$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password); //we are for some reason failing here

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

		$current_user = find_user_by_email($email);

		if($current_user == null){

			register($name, $email, $password_input);

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