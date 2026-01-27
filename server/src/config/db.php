<?php
declare(strict_types=1);

require_once __DIR__ . '/load_env.php';


loadEnv("../.env");

function db(): PDO
{
    $host = $_ENV['DB_HOST'] ?: 'localhost';
    $name = $_ENV['DB_NAME'] ?: '';
    $user = $_ENV['DB_USER'] ?: '';
    $pass = $_ENV['DB_PASS'] ?: '';

    $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";

    return new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
}