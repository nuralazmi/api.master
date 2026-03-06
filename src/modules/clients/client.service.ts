import { Injectable } from '@nestjs/common';
import { BusinessException } from '@common/exceptions';
import { ErrorCode } from '@common/constants';
import { Client } from './entities/client.entity';
import { ClientRepository } from './client.repository';

@Injectable()
export class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async findById(id: string): Promise<Client | null> {
    return this.clientRepository.findById(id);
  }

  async findBySlug(slug: string): Promise<Client | null> {
    return this.clientRepository.findOne({ slug });
  }

  async validateClientId(clientId: string): Promise<Client> {
    const client = await this.clientRepository.findById(clientId);
    if (!client) {
      throw new BusinessException('Client not found', ErrorCode.CLIENT_NOT_FOUND);
    }
    if (!client.isActive) {
      throw new BusinessException('Client is inactive', ErrorCode.CLIENT_INACTIVE);
    }
    return client;
  }
}
