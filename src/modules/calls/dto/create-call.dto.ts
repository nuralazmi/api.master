import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength, Matches, IsTimeZone } from 'class-validator';

export class CreateCallDto {
  @ApiProperty({
    example: '2025-06-15T14:30:00',
    description: 'Local datetime without timezone offset (no Z or +xx:xx)',
  })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/, {
    message:
      'scheduledAt must be a local datetime without timezone offset (e.g. 2025-06-15T14:30:00)',
  })
  scheduledAt!: string;

  @ApiProperty({ example: 'America/New_York', description: 'IANA timezone string' })
  @IsString()
  @IsTimeZone()
  timezone!: string;

  @ApiPropertyOptional({ example: 'İş görüşmesi hatırlatması', maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
