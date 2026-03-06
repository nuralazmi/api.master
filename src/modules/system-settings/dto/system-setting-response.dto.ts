import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemSettingResponseDto {
  @ApiProperty()
  id!: string;

  @ApiPropertyOptional({ nullable: true })
  clientId!: string | null;

  @ApiProperty()
  key!: string;

  @ApiProperty()
  value!: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
