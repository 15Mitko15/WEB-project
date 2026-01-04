<?php

	$servername = "localhost";
	$database = "schedule_db";
	$username = "root";
	$password = "";

	try {
	  	$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
	  		
	  	// set the PDO error mode to exception
	  	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
	    $sqlCheckEmails = "SELECT * FROM USERS";
		
	    $query = $conn->query($sqlCheckEmails) or die("failed!");

	    $username = $register["username"];
	
	    $email = $register["email"];

	    $passwordInput = $register["password"];


	    //$username = "whoami";
		//	
	    //$email = "idkMyEmail";
		//
	    //$passwordInput = "123";
		// a sample that i used
	    $foundUser = false;
			
	    while($row = $query->fetch()){
	      	if($row[1] == $email){
	        	$foundUser = true;

	        	echo "Email already registered!";

	        	break;
	      	}
	    }
	
	    if(!$foundUser){
	    	$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

	    	

	    	//$dateAndTimeOfCreation = date("Y-m-d H:i:s");//this is not correct

	    	//THINGS TO CHANGE LATER: ID generation, fn generation?, setting first and last name (Mitko pls seperate the 2 names), registered role?, check for valid email and password format

	    	//by default register as "user" role id 1 for me

	    	$id = 3;

	    	$someDefaultFn = "12345";

	    	$roleId = 1;

	    	$sqlRegisterUser = "INSERT INTO USERS (id, email, fn, first_name, last_name, password_hash, role_id, created_at, updated_at)
	    						VALUES ('$id', '$email', '$someDefaultFn', '$username', '$username', '$hashedPassword', '$roleId', current_timestamp(), current_timestamp())";

	    	$query = $conn->query($sqlRegisterUser) or die("failed!");

	    	$returnJsonObj->token = "idkWhatIHaveToReturnHere";
	    	$returnJsonObj->id = $id;
	    	$returnJsonObj->email = $email;
	    	$returnJsonObj->fn = $someDefaultFn;
	    	$returnJsonObj->username1 = $username;
	    	$returnJsonObj->username2 = $username;
	    	$returnJsonObj->password_hash = $hashedPassword;
	    	$returnJsonObj->role_id = $roleId;

	    	$returnJson = json_encode($returnJsonObj);

	    	//SEND THE JSON HERE or no? Idk what to send --------------------------------------------------------------------------------------------
	    	echo $returnJson;
	    }
	    
	}
	
	catch(PDOException $e) {
		echo "Database connection failed: " . $e->getMessage();
	}

?>