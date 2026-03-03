import { Logger as TypeOrmLogger } from 'typeorm';
import { Logger } from 'nestjs-pino';

export class TypeOrmPinoLogger implements TypeOrmLogger {
  constructor(private readonly pinoLogger: Logger) {}

  logQuery(query: string, parameters?: any[]) {
    this.pinoLogger.log({ type: 'query', query, parameters }, 'Database Query');
  }

  logQueryError(error: string, query: string, parameters?: any[]) {
    this.pinoLogger.error(
      { type: 'query-error', error, query, parameters },
      'Database Query Failed',
    );
  }

  logQuerySlow(time: number, query: string, parameters?: any[]) {
    this.pinoLogger.warn(
      { type: 'slow-query', duration: time, query },
      'Slow Query Detected',
    );
  }

  logSchemaBuild(message: string) {
    this.pinoLogger.log(message, 'Database Schema Build');
  }

  logMigration(message: string) {
    this.pinoLogger.log(message, 'Database Migration');
  }

  log(level: 'log' | 'info' | 'warn', message: any) {
    if (level === 'log') this.pinoLogger.log(message);
    if (level === 'info') this.pinoLogger.log(message);
    if (level === 'warn') this.pinoLogger.warn(message);
  }
}
