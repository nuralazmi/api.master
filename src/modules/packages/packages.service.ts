import { Injectable } from '@nestjs/common';
import { PackagesRepository } from './packages.repository';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesService {
  constructor(private readonly packagesRepository: PackagesRepository) {}

  async findAll(): Promise<Package[]> {
    return this.packagesRepository.findAll();
  }
}
