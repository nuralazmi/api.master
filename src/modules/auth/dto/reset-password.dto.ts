import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '+14155551234', description: 'E.164 format phone number' })
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ example: 'newPassword123', minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  code!: string;
}
