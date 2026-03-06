import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { OtpType } from './otp-type.enum';

export class SendOtpDto {
  @ApiProperty({ example: '+14155551234', description: 'E.164 format phone number' })
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ enum: OtpType })
  @IsEnum(OtpType)
  type!: OtpType;
}
