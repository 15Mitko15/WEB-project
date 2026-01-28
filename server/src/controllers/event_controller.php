<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/event_service.php';
//require_once __DIR__ . '/../services/user_service.php';

final class EventController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function home(): void
    {
    	$events = return_events($_SESSION['user_id'], $this->conn);

    	$this->json(200, [
            'ok' => true,
            'events' => $events,
        ]);
    }

    public function event_preference(): void
    {
        $data = $this->readInput();

        $event_id = trim((string)($data['event_id'] ?? ''));
        $new_interest_id = (string)($data['new_interest_id'] ?? '');

        $action = edit_attending_preference($_SESSION['user_id'], (int)$event_id, (int)$new_interest_id, $this->conn);

        $this->json(200, [
            'ok' => true,
            'action' => $action,
        ]);
    }

// ---------- helpers ----------

    private function json(int $statusCode, array $payload): void
    {
        http_response_code($statusCode);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($payload);
    }

    private function readInput(): array
    {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';

        if (stripos($contentType, 'application/json') !== false) {
            $raw = file_get_contents('php://input');
            $decoded = json_decode($raw ?: '', true);
            return is_array($decoded) ? $decoded : [];
        }

        if (!empty($_POST)) return $_POST;

        return $_GET ?? [];
    }
}