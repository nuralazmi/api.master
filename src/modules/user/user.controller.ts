import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '@common/decorators';
import { ApiWrappedResponse } from '@common/decorators';
import { JwtPayload } from '@modules/auth/dto/jwt-payload.dto';
import { UserCreditResponseDto } from './dto/user-credit-response.dto';
import { UserService } from './user.service';

@Controller({ path: 'users', version: '1' })
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me/credit')
  @ApiWrappedResponse(UserCreditResponseDto)
  async getMyCredit(@CurrentUser() user: JwtPayload) {
    const data = await this.userService.getCredit(user.sub);
    return { message: 'Credit bilgisi', data };
  }
}
