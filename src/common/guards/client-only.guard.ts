import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CLIENT_SLUG_KEY } from '../decorators/client-only.decorator';
import { ClientService } from '@modules/clients/client.service';

@Injectable()
export class ClientOnlyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly clientService: ClientService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const slug = this.reflector.getAllAndOverride<string>(CLIENT_SLUG_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    if (!slug) return true;

    const { user } = ctx.switchToHttp().getRequest<{ user?: { clientId?: string } }>();
    if (!user) throw new ForbiddenException('Not authenticated');

    const client = await this.clientService.findById(user.clientId ?? '');
    if (!client || client.slug !== slug) {
      throw new ForbiddenException('This endpoint is not available for your client');
    }

    return true;
  }
}
