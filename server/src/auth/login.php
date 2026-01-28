<?php

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$login = json_decode($data, true); // true -> as php array

	$email = $login["email"];

	$password_input = $login["password"];

	$conn = $_SERVER["DB_CONN"];//maybe this is a bad idea

	$current_user = find_user_by_email($email, $conn);

	if($current_user->get_id() == -1){

		echo "Incorrect email or password!";

	}

	else{

		login($current_user, $password_input);

	}

}

function login(User $current_user, string $password_input): void{//DO MORE TWEAKING LATER

	if(password_verify($password_input, $current_user->get_password_hash())){

		set_session($current_user);

		echo json_encode([//WILL CHANGE LATER
				"status" => "success",
				"message" => "Login successful.",
				"user_id" => $_SESSION['user_id']
			]);
		
		http_response_code(200);

	}

	else{

		echo "Incorrect email or password!";

		session_destroy();

	}

}

?>