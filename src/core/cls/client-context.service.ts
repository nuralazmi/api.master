import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

const CLIENT_ID_KEY = 'clientId';

@Injectable()
export class ClientContextService {
  constructor(private readonly cls: ClsService) {}

  setClientId(clientId: string): void {
    this.cls.set(CLIENT_ID_KEY, clientId);
  }

  getClientId(): string {
    const clientId = this.cls.get<string>(CLIENT_ID_KEY);
    if (!clientId) {
      throw new Error('clientId not set in CLS context');
    }
    return clientId;
  }

  getClientIdOrNull(): string | null {
    return this.cls.get<string>(CLIENT_ID_KEY) ?? null;
  }
}
