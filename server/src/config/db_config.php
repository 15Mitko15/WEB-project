<?php

function create_db_connnection(){

	$servername = $_ENV["DB_HOST"];

	$database = $_ENV["DB_NAME"];

	$username = $_ENV["DB_USER"];

	$password = $_ENV["DB_PASS"];

	try {

		$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);

		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // set the PDO error mode to exception

		$_SERVER["DB_CONN"] = $conn;

	}

	catch (PDOException $e) {

		echo "Database connection failed: " . $e->getMessage();

	}

}

create_db_connnection();