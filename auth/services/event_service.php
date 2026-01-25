<?php

function get_events_id_by_user_id(int $user_id): array{

	$sql = "SELECT event_id FROM ATTENDINGS WHERE user_id = '$user_id'";//this might be wrong

	$ids = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	$events_id = array();

	while($row = $ids->fetch()){

		$events_id[] = $row[0];

	}

	return $events_id;
}

function return_events(int $user_id): void{

	$events_id_for_user = get_events_id_by_user_id($user_id);

	$sql = "SELECT 	events.id, 					/*0*/
					events.event_datetime, 		/*1*/
					events.title, 				/*2*/
					events.event_description, 	/*3*/
					users.fn, users.first_name, /*4*/
					users.last_name, 			/*5*/
					halls.hall_number, 			/*6*/
					faculties.name 				/*7*/
			FROM events 
			INNER JOIN users on users.id = events.presenter_id 
			INNER JOIN halls on halls.id = events.hall_id 
			INNER JOIN faculties on faculties.id = halls.faculty_id";

	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

	while($row = $query->fetch()){

		$interest_id = -1;

		if(in_array($row[0], $events_id_for_user)){

			$interest_id = 0;//SAMPLE INTEREST ID WHERE ANYTHING GREATER THAN -1 IS INTEREST. CHANGE LATER!

		}

		$event_daytime = $row[1];

		$hall_id = $row[2];//CHANGE LATER!

		$presenter_id = $row[3];//CHANGE LATER!(probably with an array)

		$title = $row[4];

		$event = {	"interest": $interest_id,
					"event_daytime": $event_daytime,
					"hall": $hall_id,
					"presenter": $presenter_id,
					"title": $title
					}

		echo json_encode($event);//This might not be correct and is subject to change. The frontend is supposed to receive a structure similar to $event.

	}

}

/* SELECT events.id, events.event_datetime, events.title, events.event_description, users.fn, users.first_name, users.last_name, halls.hall_number, faculties.name FROM events INNER JOIN users on users.id = events.presenter_id INNER JOIN halls on halls.id = events.hall_id INNER JOIN faculties on faculties.id = halls.faculty_id */

?>