import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@common/constants/user-roles.enum';
import { User } from '../entities/user.entity';

export class UserResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty({ required: false })
  phone?: string;

  @ApiProperty({ required: false })
  email?: string;

  @ApiProperty({ enum: UserRole })
  role!: UserRole;

  @ApiProperty()
  isVerified!: boolean;

  @ApiProperty()
  credit!: number;

  @ApiProperty()
  createdAt!: Date;
}

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    phone: user.phone,
    email: user.email,
    role: user.role,
    isVerified: user.isVerified,
    credit: user.credit,
    createdAt: user.createdAt,
  };
}
