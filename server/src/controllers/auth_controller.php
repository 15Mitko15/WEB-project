<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../services/auth_service.php';
require_once __DIR__ . '/../services/user_service.php';
require_once __DIR__ . '/controller-helpers.php';

final class AuthController
{
    private PDO $conn;

    public function __construct()
    {
        $this->conn = db();
    }

    public function login(): void
    {
        $data = readInput();

        $email = trim((string)($data['email'] ?? ''));
        $password = (string)($data['password'] ?? '');

        if ($email === '' || $password === '') {
            throw new BadRequestException('Email and password are required.');
        }

        $user = find_user_by_email($this->conn, $email);
        if ($user === null) {
            // Don't reveal whether email exists
            throw new UnauthorizedException('Invalid email or password.');
        }

        if (!login_user($user, $password)) {
            throw new UnauthorizedException('Invalid email or password.');
        }

        json(200, [
            'ok' => true,
            'message' => 'Login successful.',
            'user' => $user->toPublicArray(),
        ]);
    }

    public function register(): void
    {
        $data = readInput();

        $fullName = trim((string)($data['name'] ?? ''));
        $email = trim((string)($data['email'] ?? ''));
        $fn = trim((string)($data['fn'] ?? ''));
        $password = (string)($data['password'] ?? '');

        if ($fullName === '' || $email === '' || $fn === '' || $password === '') {
            throw new BadRequestException('Name, faculty number, email and password are required.');
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new BadRequestException('Invalid email format.');
        }

        // Optional: basic password length check
        if (strlen($password) < 6) {
            throw new BadRequestException('Password must be at least 6 characters.');
        }

        try {
            register_user($this->conn, $fullName, $email, $password, $fn);
        } catch (PDOException $e) {
            // Duplicate key (UNIQUE email/fn) => conflict
            if ($e->getCode() === '23000') {
                throw new BadRequestException('Email or FN already exists.');
            }

            // Unexpected DB error
            throw new RuntimeException('Registration failed.');
        }

        json(201, [
            'ok' => true,
            'message' => 'Registration successful.',
        ]);
    }

    public function logout(): void
    {
        // if you want: require login to logout
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $_SESSION = [];
        if (session_status() === PHP_SESSION_ACTIVE) {
            session_destroy();
        }

        json(200, [
            'ok' => true,
            'message' => 'Logged out.',
        ]);
    }

    public function checkLoggedIn(): void
    {
        $loggedIn = check_logged_in();

        json(200, [
            'ok' => true,
            'logged_in' => $loggedIn,
            'user_email' => $loggedIn ? ($_SESSION['user_email'] ?? null) : null,
        ]);
    }

    public function me(): void
    {
        if (!check_logged_in()) {
            throw new UnauthorizedException('Not logged in.');
        }

        $userId = (int)($_SESSION['user_id'] ?? 0);
        if ($userId <= 0) {
            throw new UnauthorizedException('Session is missing user.');
        }

        $user = find_user_by_id($this->conn, $userId);
        if ($user === null) {
            // Session refers to user that no longer exists
            throw new UnauthorizedException('User not found.');
        }

        json(200, [
            'ok' => true,
            'user' => $user->toPublicArray(),
        ]);
    }
}
