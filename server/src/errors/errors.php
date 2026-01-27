<?php
declare(strict_types=1);

require_once __DIR__ . '/http_exception.php';

final class BadRequestException extends HttpException
{
    public function __construct(string $message = 'Bad Request', array $details = [])
    {
        parent::__construct($message, 400, $details);
    }
}

final class UnauthorizedException extends HttpException
{
    public function __construct(string $message = 'Unauthorized', array $details = [])
    {
        parent::__construct($message, 401, $details);
    }
}

final class ForbiddenException extends HttpException
{
    public function __construct(string $message = 'Forbidden', array $details = [])
    {
        parent::__construct($message, 403, $details);
    }
}

final class NotFoundException extends HttpException
{
    public function __construct(string $message = 'Not Found', array $details = [])
    {
        parent::__construct($message, 404, $details);
    }
}
