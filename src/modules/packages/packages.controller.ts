import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@common/decorators/public.decorator';
import { ApiWrappedResponse } from '@common/decorators/api-wrapped-response.decorator';
import { PackagesService } from './packages.service';
import { PackageResponseDto } from './dto';

@ApiTags('Packages')
@Controller({ path: 'packages', version: '1' })
@Public()
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Get()
  @ApiWrappedResponse(PackageResponseDto)
  async list() {
    const data = await this.packagesService.findAll();
    return { message: 'Packages listed', data };
  }
}
