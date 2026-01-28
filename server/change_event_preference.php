<?php

if(isset($_POST)){

	$data = file_get_contents("php://input");

	$change_event_preference = json_decode($data, true); // true -> as php array

	$event_id = $change_event_preference["event_id"];

	$new_interest_id = $change_event_preference["new_interest_id"];

	$conn = $_SERVER["DB_CONN"];//maybe this is a bad idea

	edit_attending_preference($_SESSION['user_id'], $event_id, $new_interest_id, $conn);

}

?>