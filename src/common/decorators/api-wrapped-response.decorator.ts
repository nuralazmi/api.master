import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse } from '@nestjs/swagger';
import { buildWrappedSchema } from './swagger-response.utils';

export interface ApiWrappedResponseOptions {
  status?: number;
  description?: string;
  message?: string;
  isArray?: boolean;
}

/**
 * Swagger decorator for single/array wrapped response.
 * Matches TransformInterceptor output.
 *
 * @example @ApiWrappedResponse(UserResponseDto)
 * @example @ApiWrappedResponse(UserResponseDto, { status: 201, isArray: true })
 */
export const ApiWrappedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: ApiWrappedResponseOptions = {},
) => {
  const {
    status = HttpStatus.OK,
    description = 'Operation successful',
    message,
    isArray = false,
  } = options;

  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        allOf: [buildWrappedSchema(model, { isArray, message: message || description })],
      },
    }),
  );
};

export const ApiWrappedCreatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options: Omit<ApiWrappedResponseOptions, 'status'> = {},
) => ApiWrappedResponse(model, { ...options, status: HttpStatus.CREATED });

export const ApiWrappedArrayResponse = <TModel extends Type<any>>(
  model: TModel,
  options: Omit<ApiWrappedResponseOptions, 'isArray'> = {},
) => ApiWrappedResponse(model, { ...options, isArray: true });
