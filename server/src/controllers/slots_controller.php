<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/slots_service.php';
require_once __DIR__ . '/controller-helpers.php';


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
}