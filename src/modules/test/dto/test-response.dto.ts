import { ApiProperty } from '@nestjs/swagger';

export class TestResponseDto {
  @ApiProperty({ example: 'Hello World' })
  message!: string;

  @ApiProperty({ example: '2024-01-15T10:30:00.000Z' })
  timestamp!: string;
}
