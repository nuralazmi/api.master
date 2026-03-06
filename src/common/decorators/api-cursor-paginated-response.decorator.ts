import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildCursorPaginatedSchema } from './swagger-response.utils';

/**
 * Swagger decorator for cursor-paginated endpoints.
 *
 * @example @ApiCursorPaginatedResponse(UserResponseDto)
 */
export const ApiCursorPaginatedResponse = (
  model: any,
  options: { status?: number; description?: string; message?: string } = {},
) => {
  const { status = HttpStatus.OK, description = 'Data retrieved successfully', message } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildCursorPaginatedSchema(model, { message: message || description })],
      },
    }),
  );
};
