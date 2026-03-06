import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CursorPaginationDto } from '@common/dto/cursor-pagination.dto';
import { CallStatus } from '../entities/call.entity';

export class ListCallsDto extends CursorPaginationDto {
  @ApiPropertyOptional({ enum: CallStatus, description: 'Filter by call status' })
  @IsOptional()
  @IsEnum(CallStatus)
  status?: CallStatus;
}
