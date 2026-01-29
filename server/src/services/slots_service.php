<?php

require_once __DIR__ . '/event_service.php';

function get_available_slots($conn): array{

	$sql = "SELECT slots.hall_id, slots.slot_date, slots.start_time, slots.end_time, slots.duration_minutes
			FROM slots 
			WHERE slot_date BETWEEN current_date() AND adddate(current_date(), interval 3 year)";

	$stmt = $conn->prepare($sql);
    $stmt->execute();

    if($stmt->rowCount() > 0){

    	$slots = array();

    	while($row = $stmt->fetch(PDO::FETCH_ASSOC)){

    		$datestamp_start = $row['slot_date'] . " " . $row['start_time'];
    		$datestamp_end = $row['slot_date'] . " " . $row['end_time'];
    		$events_time = return_events_time_in_timeframe_and_hall($datestamp_start, $datestamp_end, $row['hall_id'], $conn);

    		$hours_start = (int)($row['start_time'][0] . $row['start_time'][1]);
    		$minutes_start = (int)($row['start_time'][3] . $row['start_time'][4]);

    		$hours_end = (int)($row['end_time'][0] . $row['end_time'][1]);
    		$minutes_end = (int)($row['end_time'][3] . $row['end_time'][4]);

    		$duration = (int)$row['duration_minutes'];

    		$current_slots = array('hall_id' => $row['hall_id']);

    		$current_slots['date'] = $row['slot_date'];

    		$hall_slots = array();

    		$unavailable_slot_pos = 0;

    		$events_time[] = $events_time[0];

    		$unavailable_slot = explode(' ', $events_time[$unavailable_slot_pos])[1];

    		$slots_count = 0;

    		while($hours_end > $hours_start || $minutes_end > $minutes_start){
    			$extra_null = '';

    			if($minutes_start < 10){
    				$extra_null = '0';
    			}
    			$current_slot = (string)$hours_start . ':' . $extra_null . (string)$minutes_start . ':00';

    			if($current_slot == $unavailable_slot){
    				$unavailable_slot_pos += 1;

    				$unavailable_slot = explode(' ', $events_time[$unavailable_slot_pos])[1];

    			}
    			else{
    				//$slot_name = 'slot' . (string)$slots_count;

    				$hall_slots[] = $current_slot;

    				$slots_count +=1;
    				
    			}

    			$minutes_start += $duration;
    				if($minutes_start + $duration > 60){
    					$minutes_start -= 60;
    					$hours_start += 1;
    				}

    			
    		}
    		$current_slots['slots'] = $hall_slots;
    		$current_slots['slots_count'] = $slots_count;
    		$slots[] = $current_slots;

    	}

    	return $slots;
    }
    else{

    	$slots = array();
    	return $slots;

    }

}

function event_in_slot(string $date, string $time,int $hall_id, $conn):int{

	$sql = "SELECT slots.start_time, slots.duration_minutes
			FROM slots 
			WHERE slot_date = '$date' AND hall_id = '$hall_id' AND '$time' BETWEEN start_time AND end_time";

	$stmt = $conn->prepare($sql);
    $stmt->execute();

    if($stmt->rowCount() > 0){
    	$row = $stmt->fetch(PDO::FETCH_ASSOC);
    	$duration = $row['duration_minutes'];

    	return $duration;
    }
    else{
    	return 0;
    }

}

?>