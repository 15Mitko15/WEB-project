<?php
declare(strict_types=1);

function return_faculties(PDO $conn): array
{
    $stmt = $conn->prepare("
        SELECT id, name
        FROM faculties
        ORDER BY name ASC
    ");
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}
