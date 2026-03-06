import {applyDecorators, HttpStatus, Type} from '@nestjs/common';
import {ApiExtraModels, ApiResponse} from '@nestjs/swagger';
import {buildWrappedSchema} from './swagger-response.utils';

export interface ApiWrappedResponseOptions {
    status?: number;
    description?: string;
    message?: string;
    isArray?: boolean;
}

/**
 * Decorator for Swagger wrapped response documentation.
 * Matches the TransformInterceptor output format.
 *
 * @example
 * // Basic usage (200 OK)
 * @ApiWrappedResponse(CategoryResponseDto)
 *
 * @example
 * // With status code (201 Created)
 * @ApiWrappedResponse(CategoryResponseDto, { status: 201 })
 *
 * @example
 * // Array response
 * @ApiWrappedResponse(CategoryResponseDto, { isArray: true })
 */
export const ApiWrappedResponse = <TModel extends Type<any>>(
    model: any,
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
                allOf: [buildWrappedSchema(model, {isArray, message: message || description})],
            },
        }),
    );
};

/**
 * Shorthand for ApiWrappedResponse with status 201 (Created)
 */
export const ApiWrappedCreatedResponse = <TModel extends Type<any>>(
    model: TModel,
    options: Omit<ApiWrappedResponseOptions, 'status'> = {},
) => ApiWrappedResponse(model, {...options, status: HttpStatus.CREATED});

/**
 * Shorthand for ApiWrappedResponse with isArray: true
 */
export const ApiWrappedArrayResponse = <TModel extends Type<any>>(
    model: TModel,
    options: Omit<ApiWrappedResponseOptions, 'isArray'> = {},
) => ApiWrappedResponse(model, {...options, isArray: true});
