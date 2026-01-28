<?php

function return_events(int $user_id, $conn): array
{
	$sql = "SELECT 	events.id, 						/*0*/
					events.event_datetime, 			/*1*/
					events.title, 					/*2*/
					events.event_description, 		/*3*/
					users.fn, 						/*4*/
					users.first_name, 				/*5*/
					users.last_name, 				/*6*/
					halls.hall_number, 				/*7*/
					faculties.name AS faculty_name, /*8*/
					interests.name AS interest		/*9*/
			FROM events 
			INNER JOIN users on users.id = events.presenter_id 
			INNER JOIN halls on halls.id = events.hall_id 
			INNER JOIN faculties on faculties.id = halls.faculty_id 
			LEFT JOIN attendings on events.id = attendings.event_id 
				AND attendings.user_id = :user_id 
			LEFT JOIN interests on attendings.interest_id = interests.id ";

	//$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	$stmt = $conn->prepare($sql);
    $stmt->execute(['user_id' => $user_id]);

	if($stmt->rowCount() > 0){

		$all_events = array();

		while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

			$event_id = $row['id'];

			$event_datetime = $row['event_datetime'];

			$event_title = $row['title'];

			$event_description = $row['event_description'];

			$event_presenter_fn = $row['fn'];

			$event_presenter_first_name = $row['first_name'];

			$event_presenter_last_name = $row['last_name'];

			$event_hall_number = $row['hall_number'];

			$event_faculty = $row['faculty_name'];

			$event_current_user_interest = $row['interest'];

			$event = array(
							"id"=> $event_id,
							"datetime"=> $event_datetime,
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

		return $all_events;

	}

	else{

		$all_events = array();

		return $all_events;

	}
}

function edit_attending_preference(int $user_id, int $event_id, int $new_interest_id, $conn): string{

	$sql = "SELECT interest_id FROM attendings WHERE user_id = $user_id AND event_id = $event_id";

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	if($query->rowCount() == 0 && $new_interest_id > 0){//presumes that anything greater than 0 is a given interest

		$sql = "INSERT INTO attendings (id, user_id, event_id, interest_id, created_at, updated_at)
				VALUES (null, '$user_id', '$event_id', '$new_interest_id', current_timestamp(), current_timestamp())";

		$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

		return "created entry";

	}

	elseif ($query->rowCount() > 0){

		if($new_interest_id <= 0){//it's supposed to be == 0 for no given interest but I do this to make it less prune to errors from wrong inputs

			$sql = "DELETE FROM attendings 
					WHERE user_id = $user_id AND event_id = $event_id";

			$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

			return "deleted entry";

		}

		else{

			$row = $query->fetch();

			$current_interest_id = $row['interest_id'];

			if($current_interest_id != $new_interest_id){

				$sql = "UPDATE attendings 
						SET interest_id = $new_interest_id
						WHERE user_id = $user_id AND event_id = $event_id";

				$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

				return "updated entry";

			}

		}

	}

	return "no edit";

}

?>