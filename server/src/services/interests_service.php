<?php
declare(strict_types=1);

function return_interests(PDO $conn): array
{
    $sql = "SELECT id, name
            FROM interests
            ORDER BY id ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function set_event_interest(PDO $conn, int $userId, int $eventId, int $interestId): string
{
    // Check if row exists
    $stmt = $conn->prepare("
        SELECT interest_id
        FROM attendings
        WHERE user_id = :uid AND event_id = :eid
        LIMIT 1
    ");
    $stmt->execute(['uid' => $userId, 'eid' => $eventId]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    // Remove interest (interestId <= 0) => delete row if exists
    if ($interestId <= 0) {
        if (!$existing) return "no edit";

        $del = $conn->prepare("
            DELETE FROM attendings
            WHERE user_id = :uid AND event_id = :eid
        ");
        $del->execute(['uid' => $userId, 'eid' => $eventId]);
        return "deleted entry";
    }

    // No row exists => insert
    if (!$existing) {
        $ins = $conn->prepare("
            INSERT INTO attendings (user_id, event_id, interest_id, created_at, updated_at)
            VALUES (:uid, :eid, :iid, NOW(), NOW())
        ");
        $ins->execute(['uid' => $userId, 'eid' => $eventId, 'iid' => $interestId]);
        return "created entry";
    }

    // Row exists but same interest => no change
    $currentId = (int)$existing['interest_id'];
    if ($currentId === $interestId) {
        return "no edit";
    }

    // Update
    $upd = $conn->prepare("
        UPDATE attendings
        SET interest_id = :iid, updated_at = NOW()
        WHERE user_id = :uid AND event_id = :eid
    ");
    $upd->execute(['iid' => $interestId, 'uid' => $userId, 'eid' => $eventId]);
    return "updated entry";
}

