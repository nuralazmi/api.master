import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CallStatus } from '../entities/call.entity';

export class CallResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  userId!: string;

  @ApiProperty()
  phone!: string;

  @ApiProperty()
  scheduledAt!: Date;

  @ApiProperty()
  timezone!: string;

  @ApiProperty({ enum: CallStatus })
  status!: CallStatus;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  calledAt?: Date;

  @ApiPropertyOptional()
  failureReason?: string;

  @ApiProperty()
  createdAt!: Date;
}
