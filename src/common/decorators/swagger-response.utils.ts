import { Type } from '@nestjs/common';
import { getSchemaPath } from '@nestjs/swagger';

export const getMetaSchema = () => ({
  type: 'object',
  properties: {
    timestamp: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
    path: { type: 'string', example: '/api/v1/users' },
    correlationId: { type: 'string', example: 'abc-123-def-456' },
  },
  required: ['timestamp', 'path'],
});

export const getPaginationSchema = () => ({
  type: 'object',
  properties: {
    page: { type: 'number', example: 1 },
    limit: { type: 'number', example: 10 },
    total: { type: 'number', example: 100 },
    totalPages: { type: 'number', example: 10 },
    hasNext: { type: 'boolean', example: true },
    hasPrev: { type: 'boolean', example: false },
  },
  required: ['page', 'limit', 'total', 'totalPages', 'hasNext', 'hasPrev'],
});

export const getCursorPaginationSchema = () => ({
  type: 'object',
  properties: {
    nextCursor: { type: 'string', nullable: true, example: '01234567-...' },
    hasNextPage: { type: 'boolean', example: true },
    limit: { type: 'number', example: 10 },
  },
  required: ['nextCursor', 'hasNextPage', 'limit'],
});

export const buildWrappedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { isArray?: boolean; message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Operation successful' },
    meta: getMetaSchema(),
    data: options?.isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) },
  },
  required: ['success', 'message', 'meta', 'data'],
});

export const buildPaginatedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Data retrieved successfully' },
    pagination: getPaginationSchema(),
    meta: getMetaSchema(),
    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
  },
  required: ['success', 'message', 'pagination', 'meta', 'data'],
});

export const buildCursorPaginatedSchema = <TModel extends Type<any>>(
  model: TModel,
  options?: { message?: string },
) => ({
  type: 'object',
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string', example: options?.message || 'Data retrieved successfully' },
    pagination: getCursorPaginationSchema(),
    meta: getMetaSchema(),
    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
  },
  required: ['success', 'message', 'pagination', 'meta', 'data'],
});
