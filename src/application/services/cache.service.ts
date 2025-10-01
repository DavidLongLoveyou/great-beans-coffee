import { createScopedLogger } from '../../shared/utils/logger';

const logger = createScopedLogger('CacheService');

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

export class CacheService implements ICacheService {
  private cache = new Map<string, { value: any; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    try {
      const item = this.cache.get(key);

      if (!item) {
        return null;
      }

      // Check if item has expired
      if (Date.now() > item.expiry) {
        this.cache.delete(key);
        return null;
      }

      logger.debug(`Cache hit for key: ${key}`);
      return item.value as T;
    } catch (error) {
      logger.error('Failed to get from cache:', error);
      return null;
    }
  }

  async set<T>(
    key: string,
    value: T,
    ttlSeconds: number = 3600
  ): Promise<boolean> {
    try {
      const expiry = Date.now() + ttlSeconds * 1000;
      this.cache.set(key, { value, expiry });

      logger.debug(`Cache set for key: ${key}, TTL: ${ttlSeconds}s`);
      return true;
    } catch (error) {
      logger.error('Failed to set cache:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const deleted = this.cache.delete(key);

      if (deleted) {
        logger.debug(`Cache deleted for key: ${key}`);
      }

      return deleted;
    } catch (error) {
      logger.error('Failed to delete from cache:', error);
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      this.cache.clear();
      logger.info('Cache cleared');
      return true;
    } catch (error) {
      logger.error('Failed to clear cache:', error);
      return false;
    }
  }

  // Utility method to clean up expired items
  private cleanupExpired(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Start periodic cleanup
  constructor() {
    // Clean up expired items every 5 minutes
    setInterval(() => this.cleanupExpired(), 5 * 60 * 1000);
  }
}
