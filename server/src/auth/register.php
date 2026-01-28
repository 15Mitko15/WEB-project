<?php

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$register = json_decode($data, true); // true -> as php array

	$name = $register["name"];

	$email = $register["email"];

	$password_input = $register["password"];

	$fn = $register["fn"];

	$conn = $_SERVER["DB_CONN"];//maybe this is a bad idea

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

function register(string $name, string $email, string $password_input, string $fn, $conn): void{

	$name_arr = explode(" ", $name);

	$new_first_name = $name_arr[0];

	$new_last_name = $name_arr[1];

	$new_password_hash = password_hash($password_input, PASSWORD_DEFAULT);

	$sql = "INSERT INTO USERS (id, email, fn, first_name, last_name, password_hash, role_id, created_at, updated_at)
			VALUES (null, '$email', '$fn', '$new_first_name', '$new_last_name', '$new_password_hash', '1', current_timestamp(), current_timestamp())";

	$conn->query($sql) or die("failed!");

}

?>