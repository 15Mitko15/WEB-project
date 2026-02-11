<?php
declare(strict_types=1);

function return_halls_by_faculty(PDO $conn, int $facultyId): array
{
    $stmt = $conn->prepare("
        SELECT id, hall_number, faculty_id, capacity
        FROM halls
        WHERE faculty_id = :fid
        ORDER BY hall_number ASC
    ");
    $stmt->execute(['fid' => $facultyId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}
