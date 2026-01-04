<?php

	if(isset($_POST)){

		$data = file_get_contents("php://input");

		$register = json_decode($data, true) // true -> as php array

		include "attempt_register.php";
	}

?>