import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-yet';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cacheManager.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    await this.cacheManager.set(key, value, ttl ? ttl * 1000 : undefined);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async reset(): Promise<void> {
    await (this.cacheManager as any).reset();
  }

  /**
   * Cache-aside pattern: get from cache or execute callback and store result
   * Usage: const data = await cacheService.remember('key', 300, () => db.find());
   */
  async remember<T>(key: string, ttl: number, callback: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
    const fresh = await callback();
    await this.set(key, fresh, ttl);
    return fresh;
  }

  private get redisClient() {
    return ((this.cacheManager as any).store as RedisStore).client;
  }

  // Example: track seen items per user (Redis Set, 7-day TTL)
  async addSeenItems(userId: string, itemIds: string[]): Promise<void> {
    const key = `user:seen:${userId}`;
    await this.redisClient.sAdd(key, itemIds);
    await this.redisClient.expire(key, 7 * 24 * 60 * 60);
  }

  async getSeenItemIds(userId: string): Promise<string[]> {
    return this.redisClient.sMembers(`user:seen:${userId}`);
  }
}
