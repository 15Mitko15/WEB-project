<?php //if this page remains this short it might be removed entirely

$conn = $_SERVER["DB_CONN"];//maybe this is a bad idea

return_events($_SESSION['user_id'], $conn);

?>