import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { ClientContextService } from '@core/cls/client-context.service';

/**
 * TenantMiddleware — extracts clientId and stores it in CLS context.
 *
 * Priority:
 *   1. X-Client-ID header
 *   2. JWT payload (decoded without signature verification — JwtAuthGuard verifies)
 *
 * Routes decorated with @Public() may run without clientId.
 * Tenant repositories will throw if clientId is missing when they need it.
 */
@Injectable()
export class TenantMiddleware implements NestMiddleware {
  constructor(private readonly clientContext: ClientContextService) {}

  use(req: Request, _res: Response, next: NextFunction): void {
    const headerClientId = req.headers['x-client-id'] as string | undefined;

    if (headerClientId) {
      this.clientContext.setClientId(headerClientId);
      return next();
    }

    // Try to extract from JWT payload without verifying signature
    const authHeader = req.headers['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const clientId = this.extractClientIdFromToken(token);
      if (clientId) {
        this.clientContext.setClientId(clientId);
      }
    }

    next();
  }

  private extractClientIdFromToken(token: string): string | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8')) as Record<string, unknown>;
      return typeof payload['clientId'] === 'string' ? payload['clientId'] : null;
    } catch {
      return null;
    }
  }
}
