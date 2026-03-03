import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@common/decorators';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Overall health check' })
  check() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('db')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Database health check' })
  checkDb() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('ready')
  @Public()
  @HealthCheck()
  @ApiOperation({ summary: 'Readiness probe' })
  checkReady() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('live')
  @Public()
  @ApiOperation({ summary: 'Liveness probe' })
  checkLive() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
