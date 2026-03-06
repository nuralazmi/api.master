import { Global, Module } from '@nestjs/common';
import { ClsModule as NestClsModule } from 'nestjs-cls';
import { ClientContextService } from './client-context.service';

@Global()
@Module({
  imports: [
    NestClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
  ],
  providers: [ClientContextService],
  exports: [ClientContextService],
})
export class ClsModule {}
