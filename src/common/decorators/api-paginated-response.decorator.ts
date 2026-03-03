import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildPaginatedSchema } from './swagger-response.utils';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: { status?: number; description?: string; message?: string } = {},
) => {
  const { status = HttpStatus.OK, description = 'Data retrieved successfully', message } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildPaginatedSchema(model, { message: message || description })],
      },
    }),
  );
};
