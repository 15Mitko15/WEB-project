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






// function get_events_id_by_user_id(int $user_id): array{

// 	$sql = "SELECT event_id FROM ATTENDINGS WHERE user_id = '$user_id'";//this might be wrong

// 	$ids = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

// 	$events_id = array();

// 	while($row = $ids->fetch()){

// 		$events_id[] = $row[0];

// 	}

// 	return $events_id;
// }

// function return_events(int $user_id): void{

// 	$events_id_for_user = get_events_id_by_user_id($user_id);

// 	$sql = "SELECT 	events.id, 					/*0*/
// 					events.event_datetime, 		/*1*/
// 					events.title, 				/*2*/
// 					events.event_description, 	/*3*/
// 					users.fn, users.first_name, /*4*/
// 					users.last_name, 			/*5*/
// 					halls.hall_number, 			/*6*/
// 					faculties.name 				/*7*/
// 			FROM events 
// 			INNER JOIN users on users.id = events.presenter_id 
// 			INNER JOIN halls on halls.id = events.hall_id 
// 			INNER JOIN faculties on faculties.id = halls.faculty_id";

// 	$query = $conn->query($sql) or die("failed!"); //CHANGE WITH THE MORE APROPRIATE METHODES OF APROACH

// 	while($row = $query->fetch()){

// 		$interest_id = -1;

// 		if(in_array($row[0], $events_id_for_user)){

// 			$interest_id = 0;//SAMPLE INTEREST ID WHERE ANYTHING GREATER THAN -1 IS INTEREST. CHANGE LATER!

// 		}

// 		$event_daytime = $row[1];

// 		$hall_id = $row[2];//CHANGE LATER!

// 		$presenter_id = $row[3];//CHANGE LATER!(probably with an array)

// 		$title = $row[4];

// 		$event = {	"interest": $interest_id,
// 					"event_daytime": $event_daytime,
// 					"hall": $hall_id,
// 					"presenter": $presenter_id,
// 					"title": $title
// 					}

// 		echo json_encode($event);//This might not be correct and is subject to change. The frontend is supposed to receive a structure similar to $event.

// 	}

// }

// function loadEnv(string $path): void //REFACTOR LATER
// {
//     if (!file_exists($path)) {
//         return;
//     }

//     $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
//     if ($lines === false) return;

//     foreach ($lines as $line) {
//         $line = trim($line);

//         // skip comments
//         if ($line === '' || str_starts_with($line, '#')) {
//             continue;
//         }

//         // KEY=VALUE
//         $pos = strpos($line, '=');
//         if ($pos === false) continue;

//         $key = trim(substr($line, 0, $pos));
//         $value = trim(substr($line, $pos + 1));

//         // remove optional surrounding quotes
//         if (
//             (str_starts_with($value, '"') && str_ends_with($value, '"')) ||
//             (str_starts_with($value, "'") && str_ends_with($value, "'"))
//         ) {
//             $value = substr($value, 1, -1);
//         }

//         // don't overwrite existing real env vars
//         if (getenv($key) !== false) {
//             continue;
//         }

//         putenv("$key=$value");
//         $_ENV[$key] = $value;
//     }
// }

/* SELECT events.id, events.event_datetime, events.title, events.event_description, users.fn, users.first_name, users.last_name, halls.hall_number, faculties.name FROM events INNER JOIN users on users.id = events.presenter_id INNER JOIN halls on halls.id = events.hall_id INNER JOIN faculties on faculties.id = halls.faculty_id */



?>