<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/event_service.php';
require_once __DIR__ . '/../services/slots_service.php';
require_once __DIR__ . '/controller-helpers.php';

final class EventController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function events(): void
    {
    	$events = return_events($_SESSION['user_id'], $this->conn);

    	json(200, [
            'ok' => true,
            'events' => $events,
        ]);
    }

    public function event_preference(): void
    {
        $data = readInput();

        $event_id = trim((string)($data['event_id'] ?? ''));
        $new_interest_id = (string)($data['new_interest_id'] ?? '');

        $action = edit_attending_preference($_SESSION['user_id'], (int)$event_id, (int)$new_interest_id, $this->conn);

        json(200, [
            'ok' => true,
            'message' => $action,
        ]);
    }

    public function register_event(): void{

        $data = readInput();

        $date = trim((string)($data['date'] ?? ''));
        $time = (string)($data['time'] ?? '');
        $hall_id = (int)($data['hall_id'] ?? '');
        $title = (string)($data['title'] ?? '');
        $description = (string)($data['description'] ?? '');

        $event_duration = event_in_slot($date, $time, $hall_id, $this->conn);

        $left_hour_limit = (int)($time[0] . $time[1]);
        $left_minute_limit = (int)($time[3] . $time[4]);

        $right_hour_limit = $left_hour_limit;
        $right_minute_limit = $left_minute_limit;

        if($left_minute_limit < $event_duration){
            $left_hour_limit -= 1;
            $left_minute_limit += 60;
        }

        $left_minute_limit -= $event_duration;

        if($right_minute_limit + $event_duration > 60){
            $right_hour_limit += 1;
            $right_minute_limit -= 60;
        }

        $right_minute_limit += $event_duration;

        $left_limit = (string)$left_hour_limit . ':' . (string)$left_minute_limit . ':00';
        $right_limit = (string)$right_hour_limit . ':' . (string)$right_minute_limit . ':00';

        if(can_register_event($left_limit, $right_limit , $date, $this->conn)){

            $datetime = $date . ' ' . $time; 

            register_event($datetime, $hall_id, $_SESSION['user_id'], $title, $description, $this->conn);

            json(200, [
                'ok' => true,
                'message' => 'successfully registered event',
            ]);

        }
        else{
            throw new BadRequestException('You can not create such event');
        }

    }
}