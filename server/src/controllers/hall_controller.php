<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/auth_service.php';
require_once __DIR__ . '/controller-helpers.php';
require_once __DIR__ . '/../services/hall_service.php';

final class HallController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function index(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $facultyId = (int)($_GET['faculty_id'] ?? 0);
        if ($facultyId <= 0) {
            throw new BadRequestException('faculty_id query param is required.');
        }

        $halls = return_halls_by_faculty($this->conn, $facultyId);

        json(200, [
            'ok' => true,
            'halls' => $halls,
        ]);
    }
}
