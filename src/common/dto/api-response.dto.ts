import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseMetaDto {
  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;

  @ApiProperty({ example: '/api/v1/users' })
  path!: string;

  @ApiPropertyOptional({ example: 'abc-123-def-456' })
  correlationId?: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;

  @ApiProperty({ example: true })
  hasNext!: boolean;

  @ApiProperty({ example: false })
  hasPrev!: boolean;
}

export class ApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Operation successful' })
  message!: string;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty()
  data!: T;
}

export class PaginatedApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message!: string;

  @ApiProperty({ type: PaginationMetaDto })
  pagination!: PaginationMetaDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty({ isArray: true })
  data!: T[];
}

export class CursorPaginationMetaDto {
  @ApiPropertyOptional({ example: '01234567-...', nullable: true })
  nextCursor!: string | null;

  @ApiProperty({ example: true })
  hasNextPage!: boolean;

  @ApiProperty({ example: 10 })
  limit!: number;
}

export class CursorPaginatedApiResponseDto<T> {
  @ApiProperty({ example: true })
  success!: boolean;

  @ApiProperty({ example: 'Data retrieved successfully' })
  message!: string;

  @ApiProperty({ type: CursorPaginationMetaDto })
  pagination!: CursorPaginationMetaDto;

  @ApiProperty({ type: ResponseMetaDto })
  meta!: ResponseMetaDto;

  @ApiProperty({ isArray: true })
  data!: T[];
}
