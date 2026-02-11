<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/auth_service.php';
require_once __DIR__ . '/controller-helpers.php';
require_once __DIR__ . '/../services/faculty_service.php';

final class FacultyController
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

        $faculties = return_faculties($this->conn);

        json(200, [
            'ok' => true,
            'faculties' => $faculties,
        ]);
    }
}
