import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';

/**
 * Business logic error (400)
 * Usage: throw new BusinessException('User already exists', ErrorCode.USER_ALREADY_EXISTS);
 */
export class BusinessException extends BaseException {
  constructor(message: string, errorCode: string, details?: any) {
    super(message, HttpStatus.BAD_REQUEST, errorCode, details);
  }
}

/**
 * Conflict error (409)
 */
export class ConflictException extends BaseException {
  constructor(message: string, errorCode: string = 'CONFLICT_ERROR', details?: any) {
    super(message, HttpStatus.CONFLICT, errorCode, details);
  }
}
