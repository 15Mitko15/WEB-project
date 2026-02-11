<?php
declare(strict_types=1);

require_once __DIR__ . '/event_service.php';
require_once __DIR__ . '/../controllers/controller-helpers.php';

/**
 * ===== Helpers (procedural, consistent with your project)
 */

function slots_require_date(string $date): string
{
    $date = trim($date);
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }
    return $date;
}

/**
 * Accept "HH:MM" or "HH:MM:SS", return "HH:MM:SS".
 */
function slots_normalize_time(string $t): string
{
    $t = trim($t);
    if ($t === '') {
        throw new BadRequestException('Time is required.');
    }

    if (preg_match('/^\d{2}:\d{2}$/', $t)) {
        return $t . ':00';
    }
    if (preg_match('/^\d{2}:\d{2}:\d{2}$/', $t)) {
        return $t;
    }

    throw new BadRequestException('Invalid time format. Use HH:MM or HH:MM:SS.');
}

function slots_time_to_minutes(string $hhmmss): int
{
    $hh = (int)substr($hhmmss, 0, 2);
    $mm = (int)substr($hhmmss, 3, 2);
    return $hh * 60 + $mm;
}

function slots_diff_minutes(string $start, string $end): int
{
    return slots_time_to_minutes($end) - slots_time_to_minutes($start);
}

function slots_hall_exists(PDO $conn, int $hallId): bool
{
    $stmt = $conn->prepare('SELECT id FROM halls WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $hallId]);
    return (bool)$stmt->fetchColumn();
}

/**
 * Prevent exact duplicates.
 */
function slots_exact_exists(PDO $conn, string $slotDate, int $hallId, string $start, string $end): bool
{
    $stmt = $conn->prepare("
        SELECT id
        FROM slots
        WHERE slot_date = :d
          AND hall_id = :h
          AND start_time = :s
          AND end_time = :e
        LIMIT 1
    ");
    $stmt->execute([
        'd' => $slotDate,
        'h' => $hallId,
        's' => $start,
        'e' => $end,
    ]);
    return (bool)$stmt->fetchColumn();
}

/**
 * Prevent overlaps in the same hall on the same date.
 * Overlap rule: new.start < existing.end AND new.end > existing.start
 */
function slots_overlaps_existing(PDO $conn, string $slotDate, int $hallId, string $start, string $end): bool
{
    $stmt = $conn->prepare("
        SELECT id
        FROM slots
        WHERE slot_date = :d
          AND hall_id = :h
          AND :start < end_time
          AND :end > start_time
        LIMIT 1
    ");
    $stmt->execute([
        'd' => $slotDate,
        'h' => $hallId,
        'start' => $start,
        'end' => $end,
    ]);
    return (bool)$stmt->fetchColumn();
}

/**
 * ===== Existing read endpoints (kept, lightly tightened)
 */

/**
 * Returns distinct slot dates.
 * Default: excludes past slots (including today slots that already ended).
 */
function return_slot_dates(PDO $conn, bool $includePast = false): array
{
    $sql = "SELECT DISTINCT slot_date FROM slots";

    if (!$includePast) {
        $sql .= "
            WHERE slot_date > CURDATE()
               OR (slot_date = CURDATE() AND end_time > CURTIME())
        ";
    }

    $sql .= " ORDER BY slot_date ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute();

    $dates = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $dates[] = $row['slot_date'];
    }

    return $dates;
}

/**
 * Returns halls (with faculty name) that have at least one slot for the given date.
 * Default: excludes slots that already ended if date is today.
 */
function return_halls_with_slots_for_date(PDO $conn, string $date, bool $includePast = false): array
{
    $date = slots_require_date($date);

    $sql = "
        SELECT DISTINCT
            h.id AS hall_id,
            h.hall_number,
            f.name AS faculty_name
        FROM slots s
        JOIN halls h ON h.id = s.hall_id
        JOIN faculties f ON f.id = h.faculty_id
        WHERE s.slot_date = :d
    ";

    if (!$includePast) {
        $sql .= "
            AND (
                s.slot_date > CURDATE()
             OR (s.slot_date = CURDATE() AND s.end_time > CURTIME())
            )
        ";
    }

    $sql .= " ORDER BY f.name ASC, h.hall_number ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute(['d' => $date]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

function return_slots(PDO $conn, ?int $hallId = null, ?string $date = null, bool $includePast = false): array
{
    $sql = "
        SELECT id, hall_id, slot_date, start_time, end_time, duration_minutes
        FROM slots
        WHERE 1=1
    ";
    $params = [];

    if ($hallId !== null && $hallId > 0) {
        $sql .= " AND hall_id = :hall_id";
        $params['hall_id'] = $hallId;
    }

    if ($date !== null && trim($date) !== '') {
        $date = slots_require_date($date);
        $sql .= " AND slot_date = :slot_date";
        $params['slot_date'] = $date;
    }

    if (!$includePast) {
        $sql .= "
            AND (
                slot_date > CURDATE()
             OR (slot_date = CURDATE() AND end_time > CURTIME())
            )
        ";
    }

    $sql .= " ORDER BY slot_date ASC, start_time ASC";

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
}

/**
 * ===== FIXED: event_in_slot (no SQL injection)
 * Returns duration_minutes if the given time is inside a slot; otherwise 0.
 *
 * Note: using [start_time, end_time) (end is exclusive) is usually safer.
 */
function event_in_slot(string $date, string $time, int $hall_id, PDO $conn): int
{
    $date = slots_require_date($date);
    $time = slots_normalize_time($time);

    $stmt = $conn->prepare("
        SELECT duration_minutes
        FROM slots
        WHERE slot_date = :d
          AND hall_id = :h
          AND :t >= start_time
          AND :t < end_time
        LIMIT 1
    ");
    $stmt->execute([
        'd' => $date,
        'h' => $hall_id,
        't' => $time,
    ]);

    $dur = $stmt->fetchColumn();
    return $dur ? (int)$dur : 0;
}

/**
 * ===== NEW: create_slot (procedural version of your broken $this-> method)
 */
function create_slot(PDO $conn, array $payload): array
{
    $slotDate = slots_require_date((string)($payload['slot_date'] ?? ''));
    $hallId = (int)($payload['hall_id'] ?? 0);
    $start = slots_normalize_time((string)($payload['start_time'] ?? ''));
    $end   = slots_normalize_time((string)($payload['end_time'] ?? ''));
    $duration = (int)($payload['duration_minutes'] ?? 0);

    if ($hallId <= 0) {
        throw new BadRequestException('Invalid hall_id.');
    }
    if ($duration <= 0) {
        throw new BadRequestException('Duration must be a positive number.');
    }

    $available = slots_diff_minutes($start, $end);
    if ($available <= 0) {
        throw new BadRequestException('End time must be after start time.');
    }
    if ($duration > $available) {
        throw new BadRequestException("Duration cannot be greater than the available window ({$available} minutes).");
    }

    if (!slots_hall_exists($conn, $hallId)) {
        throw new BadRequestException('Hall not found.');
    }

    // Duplicate and overlap protection
    if (slots_exact_exists($conn, $slotDate, $hallId, $start, $end)) {
        throw new BadRequestException('A slot with the same date/time/hall already exists.');
    }
    if (slots_overlaps_existing($conn, $slotDate, $hallId, $start, $end)) {
        throw new BadRequestException('Slot overlaps an existing slot for this hall and date.');
    }

    $stmt = $conn->prepare("
        INSERT INTO slots (hall_id, slot_date, start_time, end_time, duration_minutes)
        VALUES (:hall_id, :slot_date, :start_time, :end_time, :duration_minutes)
    ");
    $stmt->execute([
        'hall_id' => $hallId,
        'slot_date' => $slotDate,
        'start_time' => $start,
        'end_time' => $end,
        'duration_minutes' => $duration,
    ]);

    $id = (int)$conn->lastInsertId();

    return [
        'id' => $id,
        'hall_id' => $hallId,
        'slot_date' => $slotDate,
        'start_time' => $start,
        'end_time' => $end,
        'duration_minutes' => $duration,
    ];
}
