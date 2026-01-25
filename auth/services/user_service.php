<?php

//echo "this is user_service.php";

class User{

	private $id;

	private $email;

	private $fn;

	private $first_name;

	private $last_name;

	private $password_hash;

	private $role_id;

	public function __construct(int $id, string $email, string $fn, string $first_name, string $last_name, string $password_hash, int $role_id){

		$this->id = $id;

		$this->email = $email;

		$this->fn = $fn;

		$this->first_name = $first_name;

		$this->last_name = $last_name;

		$this->password_hash = $password_hash;

		$this->role_id = $role_id;
	}

	public function get_id(): int{

		return $this->id;

	}

	public function get_email(): string{

		return $this->email;

	}

	public function get_password_hash(): string{

		return $this->password_hash;
	
	}

}

//TO DO for User: make function to give only the needed values as ?array? for the frontend

function find_user_by_email($email, $conn): User{

	$sql = "SELECT * FROM USERS WHERE email LIKE '$email'";

	// $query = $conn->prepare($sql);

	// $query->execute();

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	//$passwordInput = $login["password"];

	//$foundUser = false;

	//$is_empty = true;

	if($query->rowCount() > 0){

		$row = $query->fetch();

		$id = $row[0];

		//$email = $email;

		$fn = $row[2];

		$first_name = $row[3];

		$last_name = $row[4];

		$password_hash = $row[5];

		$role_id = $row[6];

		$current_user = new User($id, $email, $fn, $first_name, $last_name, $password_hash, $role_id);

		return $current_user;

	}

	else{

		$invalid_user = new User(-1, "no_email", "-1", "no_name", "no_name", "no_password", "-1");

		return $invalid_user;

	}

}

function find_user_by_fn($fn, $conn): User{

	$sql = "SELECT * FROM USERS WHERE fn LIKE '$fn'";

	// $query = $conn->prepare($sql);

	// $query->execute();

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	//$passwordInput = $login["password"];

	//$foundUser = false;

	//$is_empty = true;

	if($query->rowCount() > 0){

		$row = $query->fetch();

		$id = $row[0];

		$email = $row[1];

		//$fn = $row[2];

		$first_name = $row[3];

		$last_name = $row[4];

		$password_hash = $row[5];

		$role_id = $row[6];

		$current_user = new User($id, $email, $fn, $first_name, $last_name, $password_hash, $role_id);

		return $current_user;

	}

	else{

		$invalid_user = new User(-1, "no_email", "-1", "no_name", "no_name", "no_password", "-1");

		return $invalid_user;

	}

}

function check_logged_in(): bool{

	if(isset($_SESSION['initiated'])){

		//echo "You are already logged in!";

		return true;

	}

	return false;

}

function login(User $current_user, string $password_input): void{//DO MORE TWEAKING LATER

	session_start();

	if(check_logged_in()){

		echo "You are already logged in!";

		return;

	}

	$password_input_hash = password_hash($password_input, PASSWORD_DEFAULT);

	if(password_verify($password_input, $current_user->get_password_hash())){

		$_SESSION['initiated'] = true;

		echo json_encode([
				"status" => "success",
				"message" => "Login successful.",
				"user" => $current_user->get_email()
			]);
		
		http_response_code(200);

	}

	else{

		echo "Incorrect email or password!";

		session_destroy();

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