import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: '+14155551234', description: 'E.164 format phone number' })
  @IsString()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6)
  password!: string;
}
