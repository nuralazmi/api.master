import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponseDto, PaginatedApiResponseDto, ResponseMetaDto } from '@common/dto';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponseDto<T> | PaginatedApiResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseDto<T> | PaginatedApiResponseDto<T>> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();

    const meta: ResponseMetaDto = {
      timestamp: new Date().toISOString(),
      path: request.url,
      correlationId: (request as any).correlationId,
    };

    return next.handle().pipe(
      map((data) => {
        // Cursor pagination detection — response contains nextCursor key
        const isCursorResult =
          data !== null && typeof data === 'object' && 'nextCursor' in data;

        return {
          success: true,
          message: data?.message || 'Operation successful',
          ...(isCursorResult
            ? {
                pagination: {
                  nextCursor: data.nextCursor,
                  hasNextPage: data.hasNextPage,
                  limit: data.limit,
                },
              }
            : data?.pagination !== undefined
              ? { pagination: data.pagination }
              : {}),
          meta,
          data: data?.data !== undefined ? data.data : data,
        };
      }),
    );
  }
}
