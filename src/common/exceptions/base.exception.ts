import { HttpException, HttpStatus } from '@nestjs/common';

export interface ExceptionResponse {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path?: string;
  details?: any;
}

/**
 * Base Exception — all custom exceptions should extend this.
 * Provides consistent { statusCode, message, errorCode, timestamp, details } format.
 */
export class BaseException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus,
    public readonly errorCode: string,
    public readonly details?: any,
  ) {
    super(
      {
        statusCode,
        message,
        errorCode,
        timestamp: new Date().toISOString(),
        details,
      },
      statusCode,
    );
  }
}
