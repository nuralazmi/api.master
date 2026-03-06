import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BusinessException, ConflictException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { CacheService } from '@core/cache/cache.service';
import { ClientContextService } from '@core/cls/client-context.service';
import { generateVerificationCode } from '@common/utils/string.util';
import { hashPassword, comparePassword } from '@common/utils/password.util';
import { UserService } from '@modules/user/user.service';
import { toUserResponseDto } from '@modules/user/dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { OtpType } from './dto/otp-type.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

interface OtpCache {
  code: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
    private readonly jwtService: JwtService,
    private readonly clientContext: ClientContextService,
  ) {}

  private otpKey(type: OtpType, phone: string): string {
    return `otp:${type}:${this.clientContext.getClientId()}:${phone}`;
  }

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

    const code = generateVerificationCode();
    await this.cacheService.set<OtpCache>(this.otpKey(dto.type, dto.phone), { code }, 300);
    await this.cacheService.set(this.cooldownKey(dto.type, dto.phone), '1', 60);

    this.logger.log(`OTP [${dto.type}] for ${dto.phone}: ${code}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const stored = await this.cacheService.get<OtpCache>(
      this.otpKey(OtpType.RESET_PASSWORD, dto.phone),
    );
    if (!stored) {
      throw new BusinessException('OTP expired or not sent', ErrorCode.INVALID_CODE);
    }
    if (stored.code !== dto.code) {
      throw new BusinessException('Invalid OTP', ErrorCode.INVALID_CODE);
    }

    const user = await this.userService.findByPhone(dto.phone);
    if (!user) {
      throw new BusinessException('User not found', ErrorCode.USER_NOT_FOUND);
    }

    const passwordHash = await hashPassword(dto.password);
    await this.userService.updatePassword(user.id, passwordHash);
    await this.cacheService.del(this.otpKey(OtpType.RESET_PASSWORD, dto.phone));
  }

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const stored = await this.cacheService.get<OtpCache>(
      this.otpKey(OtpType.REGISTER, dto.phone),
    );

    if (!stored) {
      throw new BusinessException('OTP expired or not sent', ErrorCode.INVALID_CODE);
    }
    if (stored.code !== dto.code) {
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

    await this.cacheService.del(this.otpKey(OtpType.REGISTER, dto.phone));

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
