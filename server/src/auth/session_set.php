<?php

function set_session(User $current_user): void{

	$_SESSION['initiated'] = true;

	$_SESSION['user_id'] = $current_user->get_id();

}

?>