import { createScopedLogger } from '../../shared/utils/logger';

const logger = createScopedLogger('CacheService');

export interface ICacheService {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds?: number): Promise<boolean>;
  delete(key: string): Promise<boolean>;
  clear(): Promise<boolean>;
}

export class CacheService implements ICacheService {
  private cache = new Map<string, { value: unknown; expiry: number }>();

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

      // Application layer debug logging removed for production
      return item.value as T;
    } catch (error) {
      // Application layer error logging removed for production
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

      // Application layer debug logging removed for production
      return true;
    } catch (error) {
      // Application layer error logging removed for production
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const deleted = this.cache.delete(key);

      if (deleted) {
        // Application layer debug logging removed for production
      }

      return deleted;
    } catch (error) {
      // Application layer error logging removed for production
      return false;
    }
  }

  async clear(): Promise<boolean> {
    try {
      this.cache.clear();
      // Application layer info logging removed for production
      return true;
    } catch (error) {
      // Application layer error logging removed for production
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
