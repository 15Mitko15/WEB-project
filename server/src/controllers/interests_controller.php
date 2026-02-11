<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/auth_service.php';
require_once __DIR__ . '/controller-helpers.php';
require_once __DIR__ . '/../services/interests_service.php';
require_once __DIR__ . '/../errors/errors.php';

final class InterestController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function interests(): void
    {
        // Optional but recommended: require login
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $items = return_interests($this->conn);

        json(200, [
            'ok' => true,
            'interests' => $items,
        ]);
    }

    public function set_interest(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }
    
        $userId = (int)($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) {
            throw new UnauthorizedException('Session is missing user.');
        }
    
        $data = readInput();
    
        $eventId = (int)($data['event_id'] ?? 0);
        $interestId = (int)($data['interest_id'] ?? 0); // 0 = remove
    
        if ($eventId <= 0) {
            throw new BadRequestException('event_id is required.');
        }
    
        $message = set_event_interest($this->conn, $userId, $eventId, $interestId);
    
        json(200, [
            'ok' => true,
            'message' => $message,
        ]);
    }    
}
