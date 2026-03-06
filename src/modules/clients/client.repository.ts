import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/base/base.repository';
import { Client } from './entities/client.entity';

@Injectable()
export class ClientRepository extends BaseRepository<Client> {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepo: Repository<Client>,
  ) {
    super(clientRepo);
  }
}
