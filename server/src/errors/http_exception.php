<?php
declare(strict_types=1);

abstract class HttpException extends RuntimeException
{
    public function __construct(
        string $message,
        private int $statusCode = 500,
        private array $details = []
    ) {
        parent::__construct($message);
    }

    public function statusCode(): int
    {
        return $this->statusCode;
    }

    public function details(): array
    {
        return $this->details;
    }
}
