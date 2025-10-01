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
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  error: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  warn: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  debug: (message: string, ...args: unknown[]) => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.debug(`[DEBUG] ${message}`, ...args);
    }
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
