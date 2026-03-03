import { Injectable } from '@nestjs/common';
import { TestResponseDto } from './dto';

@Injectable()
export class TestService {
  getHello(): TestResponseDto {
    return {
      message: 'Hello World',
      timestamp: new Date().toISOString(),
    };
  }

  getProtectedMessage(userId: string): TestResponseDto {
    return {
      message: `Hello, authenticated user ${userId}!`,
      timestamp: new Date().toISOString(),
    };
  }
}
