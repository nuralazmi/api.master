import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TriggerTestCallDto {
  @ApiProperty({ example: '+905369992129', description: 'E.164 formatted phone number' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{6,14}$/, { message: 'phone must be a valid E.164 number (e.g. +905369992129)' })
  phone!: string;
}
