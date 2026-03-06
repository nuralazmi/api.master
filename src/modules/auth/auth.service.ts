import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessException, ConflictException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { CacheService } from '@core/cache/cache.service';
import { ClientContextService } from '@core/cls/client-context.service';
import { TwilioService } from '@core/twilio/twilio.service';
import { hashPassword, comparePassword } from '@common/utils/password.util';
import { UserService } from '@modules/user/user.service';
import { toUserResponseDto } from '@modules/user/dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpType } from './dto/otp-type.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly clientContext: ClientContextService,
    private readonly twilioService: TwilioService,
  ) {}

  private cooldownKey(type: OtpType, phone: string): string {
    return `otp:cooldown:${type}:${this.clientContext.getClientId()}:${phone}`;
  }

  async sendOtp(dto: SendOtpDto): Promise<void> {
    const cooldown = await this.cacheService.get(this.cooldownKey(dto.type, dto.phone));
    if (cooldown) {
      throw new BusinessException(
        'Please wait before requesting another OTP',
        ErrorCode.TOO_MANY_ATTEMPTS,
      );
    }

    const existing = await this.userService.findByPhone(dto.phone);
    if (dto.type === OtpType.REGISTER && existing) {
      throw new ConflictException('Phone already registered', ErrorCode.USER_ALREADY_EXISTS);
    }
    if (dto.type === OtpType.RESET_PASSWORD && !existing) {
      throw new BusinessException('No account found', ErrorCode.USER_NOT_FOUND);
    }

    await this.cacheService.set(this.cooldownKey(dto.type, dto.phone), '1', 60);
    await this.twilioService.sendOtp(dto.phone);
    this.logger.debug(`OTP [${dto.type}] sent to ${dto.phone}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const { valid } = await this.twilioService.checkOtp(dto.phone, dto.code);
    if (!valid) {
      throw new BusinessException('Invalid OTP', ErrorCode.INVALID_CODE);
    }

    const user = await this.userService.findByPhone(dto.phone);
    if (!user) {
      throw new BusinessException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const passwordHash = await hashPassword(dto.password);
    await this.userService.updatePassword(user.id, passwordHash);
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const { valid } = await this.twilioService.checkOtp(dto.phone, dto.code);
    if (!valid) {
      throw new BusinessException('Invalid OTP', ErrorCode.INVALID_CODE);
    }

    const existing = await this.userService.findByPhone(dto.phone);
    if (existing) {
      throw new ConflictException('Phone already registered', ErrorCode.USER_ALREADY_EXISTS);
    }

    const passwordHash = await hashPassword(dto.password);
    const user = await this.userService.create({
      phone: dto.phone,
      passwordHash,
      isVerified: true,
    });

    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      clientId: user.clientId,
    });

    return { accessToken, user: toUserResponseDto(user) };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userService.findByPhone(dto.phone);
    if (!user) {
      throw new BusinessException('Invalid credentials', ErrorCode.INVALID_CREDENTIALS);
    }

    const valid = await comparePassword(dto.password, user.passwordHash);
    if (!valid) {
      throw new BusinessException('Invalid credentials', ErrorCode.INVALID_CREDENTIALS);
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      phone: user.phone,
      role: user.role,
      clientId: user.clientId,
    });

    return { accessToken, user: toUserResponseDto(user) };
  }
}
