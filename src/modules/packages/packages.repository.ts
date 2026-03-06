import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TenantBaseRepository } from '@common/base';
import { ClientContextService } from '@core/cls/client-context.service';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesRepository extends TenantBaseRepository<Package> {
  constructor(
    @InjectRepository(Package)
    private readonly packageRepo: Repository<Package>,
    clientContext: ClientContextService,
  ) {
    super(packageRepo, clientContext);
  }
}
