import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TestService } from './test.service';
import { TestResponseDto } from './dto';
import { Public, CurrentUser, ApiWrappedResponse } from '@common/decorators';
import { CurrentUserData } from '@common/decorators/current-user.decorator';

@ApiTags('test')
@Controller({ path: 'test', version: '1' })
export class TestController {
  constructor(private readonly testService: TestService) {}

  /**
   * Public endpoint — no auth required
   * Response: { success: true, message: '...', meta: {...}, data: TestResponseDto }
   */
  @Get()
  @Public()
  @ApiOperation({ summary: 'Public hello world' })
  @ApiWrappedResponse(TestResponseDto)
  getHello() {
    const result = this.testService.getHello();
    return { message: 'Hello World', data: result };
  }

  /**
   * Protected endpoint — requires Bearer token
   */
  @Get('protected')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Protected endpoint (requires JWT)' })
  @ApiWrappedResponse(TestResponseDto)
  getProtected(@CurrentUser() user: CurrentUserData) {
    const result = this.testService.getProtectedMessage(user.id);
    return { message: 'Authenticated successfully', data: result };
  }
}
