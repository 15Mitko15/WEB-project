<?php

function check_logged_in(): bool
{
    return isset($_SESSION) && !empty($_SESSION['initiated']);
}


function login_user(User $user, string $password_input): bool
{
    if (!password_verify($password_input, $user->get_password_hash())) {
        return false;
    }
    session_regenerate_id(true);

    $_SESSION['initiated'] = true;
    $_SESSION['user_id'] = $user->get_id();
    $_SESSION['user_email'] = $user->get_email();
    $_SESSION['expires_at'] = time() + 3600;

    return true;
}


function logout_user(): void
{
    if (isset($_SESSION)) {
        $_SESSION = [];
    }

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }
}



function register_user(PDO $conn, string $fullName, string $email, string $password, string $fn): void
{
    $parts = preg_split('/\s+/', trim($fullName)) ?: [];
    $first = $parts[0] ?? '';
    $last = count($parts) > 1 ? implode(' ', array_slice($parts, 1)) : '';

    $hash = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (email, fn, first_name, last_name, password_hash, role_id, created_at, updated_at)
            VALUES (:email, :fn, :first, :last, :hash, :role, NOW(), NOW())";

    $stmt = $conn->prepare($sql);
    $stmt->execute([
        'email' => $email,
        'fn' => $fn,
        'first' => $first,
        'last' => $last,
        'hash' => $hash,
        'role' => 1,
    ]);
}
?>