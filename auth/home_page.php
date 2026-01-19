<?php

$servername = "localhost";

$database = "schedule_db";

$username = "root";

$password = "";

//MOVE THOSE^ 4 INTO .env

try {

	//$conn = new PDO("mysql:host=$servername", $username, $password);

	$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password); //we are for some reason failing here

	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

	$user_id = "1"//SAMPLE USER ID. SEARCH IN THE users TABLE! CHANGE LATER!

	return_events_for_user($user_id);

}

catch (PDOException $e) {

	echo "Database connection failed: " . $e->getMessage();

}

?>