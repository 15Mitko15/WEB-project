<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/event_service.php';
require_once __DIR__ . '/../services/interests_service.php';
require_once __DIR__ . '/../services/slots_service.php';
require_once __DIR__ . '/../services/comment_service.php';
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
    public function event(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $eventId = (int)($_GET['id'] ?? 0);
        if ($eventId <= 0) {
            throw new BadRequestException('id query param is required.');
        }

        $userId = (int)($_SESSION['user_id'] ?? 0);

        $event = return_event_by_id($this->conn, $eventId, $userId);

        if ($event === null) {
            throw new NotFoundException('Event not found.');
        }

        json(200, [
            'ok' => true,
            'event' => $event,
        ]);
    }
    public function attendees(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $eventId = (int)($_GET['event_id'] ?? 0);
        if ($eventId <= 0) {
            throw new BadRequestException('event_id query param is required.');
        }

        $groups = return_event_attendees_grouped($this->conn, $eventId);

        json(200, [
            'ok' => true,
            'groups' => $groups,
        ]);
    }

    public function comments(): void
    {
        if (!check_logged_in()) throw new UnauthorizedException('Not logged in.');

        $eventId = (int)($_GET['event_id'] ?? 0);
        if ($eventId <= 0) throw new BadRequestException('event_id is required.');

        $items = return_event_comments($this->conn, $eventId);

        json(200, ['ok' => true, 'comments' => $items]);
    }

    public function add_comment(): void
    {
        if (!check_logged_in()) throw new UnauthorizedException('Not logged in.');

        $userId = (int)($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) throw new UnauthorizedException('Session is missing user.');

        $data = readInput();

        $eventId = (int)($data['event_id'] ?? 0);
        $parentId = isset($data['parent_id']) ? (int)$data['parent_id'] : null;
        $body = trim((string)($data['body'] ?? ''));

        if ($eventId <= 0) throw new BadRequestException('event_id is required.');
        if ($body === '') throw new BadRequestException('body is required.');

        $created = create_comment($this->conn, $eventId, $userId, $body, $parentId);

        json(201, ['ok' => true, 'comment' => $created]);
    }

    public function update(): void
{
    if (!check_logged_in()) {
        throw new UnauthorizedException('Not logged in.');
    }

    $userId = (int)($_SESSION['user_id'] ?? 0);
    if ($userId <= 0) {
        throw new UnauthorizedException('Session is missing user.');
    }

    // You can pass id via query (?id=) or in body
    $eventId = (int)($_GET['id'] ?? 0);

    $data = readInput();
    if ($eventId <= 0) {
        $eventId = (int)($data['id'] ?? 0);
    }

    if ($eventId <= 0) {
        throw new BadRequestException('Event id is required.');
    }

    $updated = update_event($this->conn, $eventId, $data, $userId);

    json(200, [
        'ok' => true,
        'event' => $updated,
    ]);
}

    public function delete(): void
    {
        if (!check_logged_in()) {
        throw new UnauthorizedException('Not logged in.');
        }

        $userId = (int)($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) {
            throw new UnauthorizedException('Session is missing user.');
        }

        $eventId = (int)($_GET['id'] ?? 0);
        if ($eventId <= 0) {
            throw new BadRequestException('Event id is required.');
        }

        $deleted_permisions = delete_event($this->conn, $eventId, $userId);

        if (!$deleted_permisions){

        }

        $deleted = delete_event_interest($this->conn, $eventId);

        json(200, [
            'ok' => true,
            'event' => $deleted,
        ]);
    }


}