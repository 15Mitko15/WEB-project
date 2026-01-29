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

        $items = return_slots($this->conn, $hallId, $date);

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

}