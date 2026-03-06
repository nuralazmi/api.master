import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './entities/client.entity';
import { ClientRepository } from './client.repository';
import { ClientService } from './client.service';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  providers: [ClientRepository, ClientService],
  exports: [ClientService],
})
export class ClientModule {}
