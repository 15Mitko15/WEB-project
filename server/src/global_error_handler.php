<?php
declare(strict_types=1);

require_once __DIR__ . '/errors/errors.php';

function json_response(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload);
}

function register_global_error_handlers(): void
{
    // Convert PHP warnings/notices into ErrorException
    set_error_handler(function (int $severity, string $message, string $file, int $line) {
        // Respect error_reporting level
        if (!(error_reporting() & $severity)) {
            return false;
        }
        throw new ErrorException($message, 0, $severity, $file, $line);
    });

    set_exception_handler(function (Throwable $e) {
        if ($e instanceof HttpException) {
            json_response($e->statusCode(), [
                'ok' => false,
                'error' => $e->getMessage(),
                'details' => $e->details(),
            ]);
            return;
        }

        error_log((string)$e);

        json_response(500, [
            'ok' => false,
            'error' => 'Internal server error',
        ]);
    });

    // Catch fatal errors (parse errors, etc.) on shutdown
    register_shutdown_function(function () {
        $err = error_get_last();
        if (!$err) return;

        $fatalTypes = [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR];
        if (!in_array($err['type'], $fatalTypes, true)) return;

        if (headers_sent()) return;

        json_response(500, [
            'ok' => false,
            'error' => 'Internal server error',
        ]);
    });
}
