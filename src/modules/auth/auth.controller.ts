import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Public } from '@common/decorators/public.decorator';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp/send')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  async sendOtp(@Body() dto: SendOtpDto): Promise<{ message: string }> {
    await this.authService.sendOtp(dto);
    return { message: 'OTP sent' };
  }

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiWrappedResponse(AuthResponseDto, { status: 201 })
  async register(@Body() dto: RegisterDto): Promise<{ message: string; data: AuthResponseDto }> {
    const data = await this.authService.register(dto);
    return { message: 'Registration successful', data };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiWrappedResponse(AuthResponseDto)
  async login(@Body() dto: LoginDto): Promise<{ message: string; data: AuthResponseDto }> {
    const data = await this.authService.login(dto);
    return { message: 'Login successful', data };
  }

  @Public()
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<{ message: string }> {
    await this.authService.resetPassword(dto);
    return { message: 'Password reset successful' };
  }
}
