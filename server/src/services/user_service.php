<?php

declare(strict_types=1);

final class User {
    public function __construct(
        private int $id,
        private string $email,
        private string $fn,
        private string $first_name,
        private string $last_name,
        private string $password_hash,
        private int $role_id
    ) {}

    public function get_id(): int { return $this->id; }
    public function get_email(): string { return $this->email; }
    public function get_password_hash(): string { return $this->password_hash; }

    public function toPublicArray(): array {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'fn' => $this->fn,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'role_id' => $this->role_id,
        ];
    }
}

function find_user_by_email(PDO $conn, string $email): ?User {
    $sql = "SELECT id, email, fn, first_name, last_name, password_hash, role_id
            FROM users
            WHERE email = :email
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['email' => $email]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;

    return new User(
        (int)$row['id'],
        $row['email'],
        $row['fn'],
        $row['first_name'],
        $row['last_name'],
        $row['password_hash'],
        (int)$row['role_id']
    );
}


function find_user_by_fn(PDO $conn, string $fn): ?User
{
    $sql = "SELECT id, email, fn, first_name, last_name, password_hash, role_id
            FROM users
            WHERE fn = :fn
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['fn' => $fn]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;

    return new User(
        (int)$row['id'],
        $row['email'],
        $row['fn'],
        $row['first_name'],
        $row['last_name'],
        $row['password_hash'],
        (int)$row['role_id']
    );;
}

function find_user_by_id(PDO $conn, int $id): ?User
{
    $sql = "SELECT id, email, fn, first_name, last_name, password_hash, role_id
            FROM users
            WHERE id = :id
            LIMIT 1";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['id' => $id]);

    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) return null;

    return new User(
        (int)$row['id'],
        $row['email'],
        $row['fn'],
        $row['first_name'],
        $row['last_name'],
        $row['password_hash'],
        (int)$row['role_id']
    );;
}

?>