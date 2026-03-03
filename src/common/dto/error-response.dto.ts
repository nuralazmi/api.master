import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorMetaDto {
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/auth/register' })
  path!: string;

  @ApiProperty({ example: 'POST' })
  method!: string;

  @ApiPropertyOptional({ example: 'abc-123-def-456' })
  correlationId?: string;
}

export class ValidationErrorDto {
  @ApiProperty({ example: 'email' })
  field!: string;

  @ApiProperty({ example: 'must be a valid email' })
  message!: string;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success!: boolean;

  @ApiProperty({ example: 400 })
  statusCode!: number;

  @ApiProperty({ example: 'Validation failed' })
  message!: string | string[];

  @ApiProperty({ example: 'VALIDATION_ERROR' })
  errorCode!: string;

  @ApiPropertyOptional({ type: [ValidationErrorDto] })
  errors?: ValidationErrorDto[];

  @ApiPropertyOptional()
  details?: any;

  @ApiProperty({ type: ErrorMetaDto })
  meta!: ErrorMetaDto;
}
