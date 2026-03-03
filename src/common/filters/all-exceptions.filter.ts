import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || message;
      errorCode = (exceptionResponse as any).errorCode || 'HTTP_EXCEPTION';
    }

    this.logger.error({
      message,
      statusCode: status,
      path: request.url,
      method: request.method,
      stack: exception instanceof Error ? exception.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      errorCode,
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
        correlationId: (request as any).correlationId,
      },
    });
  }
}
