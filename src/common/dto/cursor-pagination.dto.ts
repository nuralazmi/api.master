import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class CursorPaginationDto {
  @ApiPropertyOptional({ example: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'UUID v7 id of the last item from previous page' })
  @IsOptional()
  @IsString()
  after?: string;

  @ApiPropertyOptional({ description: 'UUID v7 id; returns items NEWER than this cursor' })
  @IsOptional()
  @IsString()
  before?: string;
}
