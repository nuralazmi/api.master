import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertSystemSettingDto {
  @ApiProperty({ description: 'Setting value' })
  @IsString()
  @IsNotEmpty()
  value!: string;
}
