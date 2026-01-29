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

	$stmt = $conn->prepare($sql);
    $stmt->execute(['user_id' => $user_id]);

	$all_events = array();

	if($stmt->rowCount() > 0){
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
							"user_interest"=> $event_current_user_interest,
							"description" => $event_description
						);

			$all_events[] = $event;
		}
	}

	return $all_events;

}
function return_events_time_in_timeframe_and_hall(
    string $datestamp_start,
    string $datestamp_end,
    int $hall_id,
    PDO $conn
): array {
    $sql = "SELECT event_datetime
            FROM events
            WHERE hall_id = :hall_id
              AND event_datetime BETWEEN :start AND :end";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'hall_id' => $hall_id,
        'start' => $datestamp_start,
        'end' => $datestamp_end,
    ]);

    $times = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $times[] = $row['event_datetime'];
    }
    return $times;
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

function can_register_event(string $time_start, string $time_end, string $date ,$conn): bool{
	$datetime_start = $date . ' ' . $time_start;
	$datetime_end = $date . ' ' . $time_end;

	$sql = "SELECT *
			FROM events 
			WHERE event_datetime BETWEEN '$datetime_start' AND '$datetime_end'";

	$stmt = $conn->prepare($sql);
    $stmt->execute();

    return(!$stmt->rowCount() > 0);
}

function register_event(
    string $datetime,
    int $hall_id,
    int $user_id,
    string $title,
    string $description,
    PDO $conn
): void {
    $sql = "INSERT INTO events (event_datetime, hall_id, presenter_id, title, event_description, created_at, updated_at)
            VALUES (:dt, :hall, :presenter, :title, :desc, NOW(), NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'dt' => $datetime,
        'hall' => $hall_id,
        'presenter' => $user_id,
        'title' => $title,
        'desc' => $description,
    ]);
}

function return_events_for_slot(PDO $conn, int $slotId, int $currentUserId = 0): array
{
    $sql = "
        SELECT
            e.id,
            e.event_datetime AS datetime,
            e.title,
            e.event_description,
            e.hall_id,
            e.presenter_id
        FROM slots s
        JOIN events e
          ON e.hall_id = s.hall_id
         AND e.event_datetime >= CONCAT(s.slot_date, ' ', s.start_time)
         AND e.event_datetime <  CONCAT(s.slot_date, ' ', s.end_time)
        WHERE s.id = :slot_id
        ORDER BY e.event_datetime ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['slot_id' => $slotId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function return_event_by_id(PDO $conn, int $eventId, int $userId): ?array
{
    $sql = "
        SELECT
            e.id,
            e.event_datetime AS datetime,
            e.title,
            e.event_description,
            u.fn AS presenter_fn,
            u.first_name AS presenter_first_name,
            u.last_name AS presenter_last_name,
            h.hall_number AS hall,
            f.name AS faculty,
            a.interest_id AS user_interest_id,
            i.name AS user_interest
        FROM events e
        JOIN users u ON u.id = e.presenter_id
        JOIN halls h ON h.id = e.hall_id
        JOIN faculties f ON f.id = h.faculty_id
        LEFT JOIN attendings a
          ON a.event_id = e.id
         AND a.user_id = :uid
        LEFT JOIN interests i ON i.id = a.interest_id
        WHERE e.id = :eid
        LIMIT 1
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'eid' => $eventId,
        'uid' => $userId > 0 ? $userId : -1,
    ]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    return $row ?: null;
}

function return_event_attendees_grouped(PDO $conn, int $eventId): array
{
    $sql = "
        SELECT
            i.name AS interest_name,
            u.id,
            u.first_name,
            u.last_name,
            u.fn
        FROM attendings a
        JOIN interests i ON i.id = a.interest_id
        JOIN users u ON u.id = a.user_id
        WHERE a.event_id = :eid
        ORDER BY i.name ASC, u.first_name ASC, u.last_name ASC
    ";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['eid' => $eventId]);

    $groups = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $key = $row['interest_name'];
        if (!isset($groups[$key])) $groups[$key] = [];
        $groups[$key][] = [
            'id' => (int)$row['id'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'fn' => $row['fn'],
        ];
    }
    return $groups;
}
?>