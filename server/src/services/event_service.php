<?php

function return_events(int $user_id, $conn): void{

	//$events_id_for_user = get_events_id_by_user_id($user_id);

	$sql = "SELECT 	events.id, 					/*0*/
					events.event_datetime, 		/*1*/
					events.title, 				/*2*/
					events.event_description, 	/*3*/
					users.fn, 					/*4*/
					users.first_name, 			/*5*/
					users.last_name, 			/*6*/
					halls.hall_number, 			/*7*/
					faculties.name, 			/*8*/
					interests.name 				/*9*/
			FROM events 
			INNER JOIN users on users.id = events.presenter_id 
			INNER JOIN halls on halls.id = events.hall_id 
			INNER JOIN faculties on faculties.id = halls.faculty_id 
			LEFT JOIN attendings on events.id = attendings.event_id 
				AND attendings.user_id = $user_id 
			LEFT JOIN interests on attendings.interest_id = interests.id ";

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	if($query->rowCount() > 0){

		$all_events = array();

		while($row = $query->fetch()){

			$event_id = $row[0];

			$event_daytime = $row[1];

			$event_title = $row[2];

			$event_description = $row[3];

			$event_presenter_fn = $row[4];

			$event_presenter_first_name = $row[5];

			$event_presenter_last_name = $row[6];

			$event_hall_number = $row[7];

			$event_faculty = $row[8];

			$event_current_user_interest = $row[9];

			$event = array(
						"id"=> $event_id,
						"daytime"=> $event_daytime,
						"title"=> $event_title,
						"presenter_fn"=> $event_presenter_fn,
						"presenter_first_name"=> $event_presenter_first_name,
						"presenter_last_name"=> $event_presenter_last_name,
						"hall"=> $event_hall_number,
						"faculty"=> $event_faculty,
						"user_interest"=> $event_current_user_interest
						);

			$all_events[] = $event;

		}

		echo json_encode($all_events);

	}

	else{

		echo "No events found.";

		return;

	}

}

function edit_attending_preference(int $user_id, int $event_id, int $new_interest_id, $conn): void{

	$sql = "SELECT interest_id FROM attendings WHERE user_id = $user_id AND event_id = $event_id";

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	if($query->rowCount() == 0 && $new_interest_id > 0){//presumes that anything greater than 0 is a given interest

		$sql = "INSERT INTO attendings (id, user_id, event_id, interest_id, created_at, updated_at)
				VALUES (null, '$user_id', '$event_id', '$new_interest_id', current_timestamp(), current_timestamp())";

		$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	}

	elseif ($query->rowCount() > 0){

		if($new_interest_id <= 0){//it's supposed to be == 0 for no given interest but I do this to make it less prune to errors from wrong inputs

			$sql = "DELETE FROM attendings 
					WHERE user_id = $user_id AND event_id = $event_id";

			$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

		}

		else{

			$row = $query->fetch();

			$current_interest_id = $row[0];

			if($current_interest_id != $new_interest_id){

				$sql = "UPDATE attendings 
						SET interest_id = $new_interest_id
						WHERE user_id = $user_id AND event_id = $event_id";

				$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

			}

		}

	}

}

/* CONTAINS SAMPLE VARIABLES AND UNNECESSARY COLUMNS! DO NOT USE UNLESS YOU KNOW WHAT YOU ARE DOING!!! */ /* SELECT events.id, events.event_datetime, events.title, events.event_description, users.fn, users.first_name, users.last_name, attendings.user_id, halls.hall_number, faculties.name, interests.name FROM events INNER JOIN users on users.id = events.presenter_id INNER JOIN halls on halls.id = events.hall_id INNER JOIN faculties on faculties.id = halls.faculty_id LEFT JOIN attendings on events.id = attendings.event_id AND attendings.user_id = 5 LEFT JOIN interests on attendings.interest_id = interests.id */

?>