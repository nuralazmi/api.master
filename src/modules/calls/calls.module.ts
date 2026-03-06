import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@modules/user/user.module';
import { Call } from './entities/call.entity';
import { CallsRepository } from './calls.repository';
import { CallsService } from './calls.service';
import { CallsScheduler } from './calls.scheduler';
import { CallsController } from './calls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Call]), UserModule],
  controllers: [CallsController],
  providers: [CallsService, CallsRepository, CallsScheduler],
})
export class CallsModule {}
