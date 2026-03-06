import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsPhoneNumber, IsString } from 'class-validator';
import { OtpType } from './otp-type.enum';

export class SendOtpDto {
  @ApiProperty({ example: '+905551234567' })
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ enum: OtpType })
  @IsEnum(OtpType)
  type!: OtpType;
}
