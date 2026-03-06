import { ApiProperty } from '@nestjs/swagger';

export class UserCreditResponseDto {
  @ApiProperty({ description: 'Remaining credit balance', example: 1 })
  credit!: number;
}
