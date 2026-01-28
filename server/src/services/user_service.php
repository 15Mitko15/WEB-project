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

function find_user_by_email($email, $conn): User{

	$sql = "SELECT * FROM USERS WHERE email LIKE '$email'";

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

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

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

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

		return true;

	}

	return false;

}

?>