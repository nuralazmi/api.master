import { SetMetadata } from '@nestjs/common';

export const CLIENT_SLUG_KEY = 'clientSlug';
export const ClientOnly = (slug: string) => SetMetadata(CLIENT_SLUG_KEY, slug);
