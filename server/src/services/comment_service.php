<?php
function return_event_comments(PDO $conn, int $eventId): array
{
    $sql = "
      SELECT
        c.id,
        c.event_id,
        c.parent_id,
        c.body,
        c.created_at,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.fn
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.event_id = :eid
      ORDER BY c.created_at ASC
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute(['eid' => $eventId]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function create_comment(PDO $conn, int $eventId, int $userId, string $body, ?int $parentId): array
{
    $sql = "
      INSERT INTO comments (event_id, user_id, parent_id, body, created_at, updated_at)
      VALUES (:eid, :uid, :pid, :body, NOW(), NOW())
    ";
    $stmt = $conn->prepare($sql);
    $stmt->execute([
      'eid' => $eventId,
      'uid' => $userId,
      'pid' => $parentId,
      'body' => $body,
    ]);

    $id = (int)$conn->lastInsertId();

    $stmt2 = $conn->prepare("
      SELECT
        c.id, c.event_id, c.parent_id, c.body, c.created_at,
        u.id AS user_id, u.first_name, u.last_name, u.fn
      FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.id = :id
      LIMIT 1
    ");
    $stmt2->execute(['id' => $id]);
    return $stmt2->fetch(PDO::FETCH_ASSOC) ?: [];
}
