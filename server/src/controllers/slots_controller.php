<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/slots_service.php';

final class SlotController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function available_slots(): void{

        $slots = get_available_slots($this->conn);

        $this->json(200, [
            'ok' => true,
            'available_slots' => $slots,
        ]);

    }

// ---------- helpers ---------- //add to seperate file later

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