import { LoggerService } from './logger-service';

const logger = new LoggerService();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

class RateLimitService {
  private store = new Map<string, RateLimitEntry>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  /**
   * Check if a request is allowed based on rate limiting rules
   */
  checkRateLimit(
    identifier: string,
    config: RateLimitConfig
  ): RateLimitResult {
    const now = Date.now();
    const key = this.generateKey(identifier, config);
    const entry = this.store.get(key);

    // If no entry exists or the window has expired, create a new one
    if (!entry || now >= entry.resetTime) {
      const newEntry: RateLimitEntry = {
        count: 1,
        resetTime: now + config.windowMs,
        firstRequest: now,
      };
      this.store.set(key, newEntry);

      return {
        allowed: true,
        remaining: config.maxRequests - 1,
        resetTime: newEntry.resetTime,
      };
    }

    // Check if the request exceeds the limit
    if (entry.count >= config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      logger.warn(`Rate limit exceeded for ${identifier}`, {
        count: entry.count,
        maxRequests: config.maxRequests,
        retryAfter,
      });

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        retryAfter,
      };
    }

    // Increment the count and allow the request
    entry.count++;
    this.store.set(key, entry);

    return {
      allowed: true,
      remaining: config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Rate limit for password reset requests
   */
  checkPasswordResetLimit(email: string): RateLimitResult {
    return this.checkRateLimit(`password-reset:${email}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 3, // 3 attempts per 15 minutes
    });
  }

  /**
   * Rate limit for login attempts
   */
  checkLoginLimit(identifier: string): RateLimitResult {
    return this.checkRateLimit(`login:${identifier}`, {
      windowMs: 15 * 60 * 1000, // 15 minutes
      maxRequests: 5, // 5 attempts per 15 minutes
    });
  }

  /**
   * Rate limit for registration attempts
   */
  checkRegistrationLimit(ip: string): RateLimitResult {
    return this.checkRateLimit(`registration:${ip}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 3, // 3 registrations per hour per IP
    });
  }

  /**
   * Rate limit for API requests
   */
  checkApiLimit(identifier: string): RateLimitResult {
    return this.checkRateLimit(`api:${identifier}`, {
      windowMs: 60 * 1000, // 1 minute
      maxRequests: 100, // 100 requests per minute
    });
  }

  /**
   * Rate limit for contact form submissions
   */
  checkContactFormLimit(identifier: string): RateLimitResult {
    return this.checkRateLimit(`contact:${identifier}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5, // 5 submissions per hour
    });
  }

  /**
   * Rate limit for quote requests
   */
  checkQuoteRequestLimit(identifier: string): RateLimitResult {
    return this.checkRateLimit(`quote:${identifier}`, {
      windowMs: 24 * 60 * 60 * 1000, // 24 hours
      maxRequests: 10, // 10 quote requests per day
    });
  }

  /**
   * Reset rate limit for a specific identifier
   */
  resetRateLimit(identifier: string, config: RateLimitConfig): void {
    const key = this.generateKey(identifier, config);
    this.store.delete(key);
    logger.info(`Rate limit reset for ${identifier}`);
  }

  /**
   * Get current rate limit status
   */
  getRateLimitStatus(
    identifier: string,
    config: RateLimitConfig
  ): RateLimitResult {
    const now = Date.now();
    const key = this.generateKey(identifier, config);
    const entry = this.store.get(key);

    if (!entry || now >= entry.resetTime) {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: now + config.windowMs,
      };
    }

    const remaining = Math.max(0, config.maxRequests - entry.count);
    const allowed = remaining > 0;

    const result: RateLimitResult = {
      allowed,
      remaining,
      resetTime: entry.resetTime,
    };
    
    if (!allowed) {
      result.retryAfter = Math.ceil((entry.resetTime - now) / 1000);
    }
    
    return result;
  }

  /**
   * Generate a unique key for rate limiting
   */
  private generateKey(identifier: string, config: RateLimitConfig): string {
    return `${identifier}:${config.windowMs}:${config.maxRequests}`;
  }

  /**
   * Clean up expired entries from the store
   */
  private cleanup(): void {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [key, entry] of this.store.entries()) {
      if (now >= entry.resetTime) {
        this.store.delete(key);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      logger.debug(`Cleaned up ${cleanedCount} expired rate limit entries`);
    }
  }

  /**
   * Get statistics about the rate limiter
   */
  getStats(): {
    totalEntries: number;
    activeEntries: number;
    expiredEntries: number;
  } {
    const now = Date.now();
    let activeEntries = 0;
    let expiredEntries = 0;

    for (const entry of this.store.values()) {
      if (now >= entry.resetTime) {
        expiredEntries++;
      } else {
        activeEntries++;
      }
    }

    return {
      totalEntries: this.store.size,
      activeEntries,
      expiredEntries,
    };
  }

  /**
   * Destroy the rate limiter and clean up resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

export const rateLimitService = new RateLimitService();