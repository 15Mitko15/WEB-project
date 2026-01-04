<?php

	$servername = "localhost";
	$database = "schedule_db";
	$username = "root";
	$password = "";

	try {
	  	$conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
	  		
	  	// set the PDO error mode to exception
	  	$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			
	    $sql = "SELECT * FROM USERS";
		
	    $query = $conn->query($sql) or die("failed!");
			
	    $email = $login["email"];
		
	    $passwordInput = $login["password"];
			
	    $foundUser = false;
			
	    while($row = $query->fetch()){
	      	if($row[1] == $email){
	        	$foundUser = true;
	        	if (password_verify($passwordInput, $row[5])) {
	        		$returnJsonObj->token = "idkWhatIHaveToReturnHere";
	    			$returnJsonObj->email = $email;

	    			$returnJson = json_encode($returnJsonObj);
	        		//SEND THE JSON HERE! Idk what to send ------------------------------------------------------------------------------------------
	        		echo $returnJson;
	        	}

	        	else {
	        	    echo 'Invalid password.';
	        	  }
	      	}
	    }
	
	    if(!$foundUser){
	    	echo "user doesnt exist (but this message is also supposed to dont exist)";
	    }
	    
	}
	
	catch(PDOException $e) {
		echo "Database connection failed: " . $e->getMessage();
	}

?>