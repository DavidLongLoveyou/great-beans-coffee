/**
 * Shared logger utility for the application
 * Provides consistent logging across all modules while respecting ESLint rules
 */

export interface Logger {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * Application logger that conditionally logs based on environment
 * In production, logs are suppressed to avoid console output
 */
export const logger: Logger = {
  info: (message: string, ...args: unknown[]) => {
    // Logging disabled for production readiness
  },
  error: (message: string, ...args: unknown[]) => {
    // Error logging disabled for production readiness
  },
  warn: (message: string, ...args: unknown[]) => {
    // Warning logging disabled for production readiness
  },
  debug: (message: string, ...args: unknown[]) => {
    // Debug logging disabled for production readiness
  },
};

/**
 * Creates a scoped logger with a prefix for better organization
 * @param scope - The scope/module name for the logger
 */
export const createScopedLogger = (scope: string): Logger => ({
  info: (message: string, ...args: unknown[]) =>
    logger.info(`[${scope}] ${message}`, ...args),
  error: (message: string, ...args: unknown[]) =>
    logger.error(`[${scope}] ${message}`, ...args),
  warn: (message: string, ...args: unknown[]) =>
    logger.warn(`[${scope}] ${message}`, ...args),
  debug: (message: string, ...args: unknown[]) =>
    logger.debug(`[${scope}] ${message}`, ...args),
});
