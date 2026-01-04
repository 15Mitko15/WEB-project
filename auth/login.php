<?php

	if(isset($_POST)){

		$data = file_get_contents("php://input");

		$login = json_decode($data, true) // true -> as php array

		include "attempt_login.php";
	}

?>