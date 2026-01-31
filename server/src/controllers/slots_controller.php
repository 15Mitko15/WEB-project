<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/slots_service.php';
require_once __DIR__ . '/controller-helpers.php';
require_once __DIR__ . '/../services/event_service.php';



final class SlotController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function available_slots(): void{

        $slots = get_available_slots($this->conn);

        json(200, [
            'ok' => true,
            'available_slots' => $slots,
        ]);

    }

    public function slots(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }
    
        $hallId = isset($_GET['hall_id']) ? (int)$_GET['hall_id'] : null;
        $date = isset($_GET['date']) ? trim((string)$_GET['date']) : null;
        $includePast = (int)($_GET['include_past'] ?? 0) === 1;
    
        $items = return_slots($this->conn, $hallId, $date, $includePast);
    
        json(200, [
            'ok' => true,
            'slots' => $items,
        ]);
    }
    

    public function slot_events(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $slotId = (int)($_GET['slot_id'] ?? 0);
        if ($slotId <= 0) {
            throw new BadRequestException('slot_id query param is required.');
        }

        $userId = (int)($_SESSION['user_id'] ?? 0);

        $items = return_events_for_slot($this->conn, $slotId, $userId);

        json(200, [
            'ok' => true,
            'events' => $items,
        ]);
    }

    public function slot_dates(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $includePast = (int)($_GET['include_past'] ?? 0) === 1;

        $dates = return_slot_dates($this->conn, $includePast);

        json(200, [
            'ok' => true,
            'dates' => $dates,
        ]);
    }

    public function slot_halls(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $date = trim((string)($_GET['date'] ?? ''));
        if ($date === '') {
            throw new BadRequestException('date query param is required.');
        }

        $includePast = (int)($_GET['include_past'] ?? 0) === 1;

        $halls = return_halls_with_slots_for_date($this->conn, $date, $includePast);

        json(200, [
            'ok' => true,
            'halls' => $halls,
        ]);
    }

    public function events_by_slot(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $slotId = (int)($_GET['slot_id'] ?? 0);
        if ($slotId <= 0) {
            throw new BadRequestException('slot_id query param is required.');
        }

        // optional: use current user for interest join if you want later
        $userId = (int)($_SESSION['user_id'] ?? 0);

        $events = return_events_for_slot($this->conn, $slotId, $userId);

        json(200, [
            'ok' => true,
            'events' => $events,
        ]);
    }

    public function create(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }
    
        $userId = (int)($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) {
            throw new UnauthorizedException('Session is missing user.');
        }
    
        // Role guard: require teacher (role_id = 2)
        $stmt = $this->conn->prepare("SELECT role_id FROM users WHERE id = :id LIMIT 1");
        $stmt->execute(['id' => $userId]);
        $roleId = (int)($stmt->fetchColumn() ?: 0);
    
        if ($roleId !== 2) {
            throw new UnauthorizedException('Forbidden.'); // If you have ForbiddenException, use that instead.
        }
    
        $data = readInput();
    
        // Accept both "date" or "slot_date" (as you intended)
        $slotDate = trim((string)($data['slot_date'] ?? $data['date'] ?? ''));
        $hallId = (int)($data['hall_id'] ?? 0);
        $start = trim((string)($data['start_time'] ?? ''));
        $end   = trim((string)($data['end_time'] ?? ''));
        $duration = (int)($data['duration_minutes'] ?? 0);
    
        // Delegate full validation to service (keeps controller small)
        $created = create_slot($this->conn, [
            'slot_date' => $slotDate,
            'hall_id' => $hallId,
            'start_time' => $start,
            'end_time' => $end,
            'duration_minutes' => $duration,
        ]);
    
        json(201, [
            'ok' => true,
            'slot' => $created,
        ]);
    }
    
}