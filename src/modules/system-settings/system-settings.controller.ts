import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { SystemSettingsService } from './system-settings.service';
import { SystemSettingResponseDto } from './dto';

@ApiTags('System Settings')
@Controller({ path: 'system-settings', version: '1' })
@Public()
export class SystemSettingsController {
  constructor(private readonly systemSettingsService: SystemSettingsService) {}

  @Get()
  @ApiWrappedResponse(SystemSettingResponseDto)
  async list() {
    const data = await this.systemSettingsService.findAll();
    return { message: 'System settings listed', data };
  }

  @Get(':key')
  @ApiWrappedResponse(SystemSettingResponseDto)
  async findByKey(@Param('key') key: string) {
    const data = await this.systemSettingsService.findByKey(key);
    return { message: 'System setting retrieved', data };
  }
}
