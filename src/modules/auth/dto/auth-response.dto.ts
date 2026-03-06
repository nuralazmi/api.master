import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from '@modules/user/dto';

export class AuthResponseDto {
  @ApiProperty()
  accessToken!: string;

  @ApiProperty({ type: UserResponseDto })
  user!: UserResponseDto;
}
