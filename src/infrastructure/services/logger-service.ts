export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  context?: Record<string, any>;
  error?: Error;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  filePath?: string;
  maxFileSize?: number;
  maxFiles?: number;
}

class LoggerService {
  private config: LoggerConfig;
  private logs: LogEntry[] = [];

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      maxFileSize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      ...config,
    };
  }

  /**
   * Log an error message
   */
  error(message: string, error?: Error | any, context?: Record<string, any>): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  /**
   * Log a warning message
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.WARN, message, context);
  }

  /**
   * Log an info message
   */
  info(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.INFO, message, context);
  }

  /**
   * Log a debug message
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Core logging method
   */
  private log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error | any
  ): void {
    // Check if the log level is enabled
    if (level > this.config.level) {
      return;
    }

    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
    };
    
    if (error instanceof Error) {
      logEntry.error = error;
    }
    
    if (context) {
      logEntry.context = context;
    }

    // Store the log entry
    this.logs.push(logEntry);

    // Keep only the last 1000 logs in memory
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }

    // Output to console if enabled
    if (this.config.enableConsole) {
      this.logToConsole(logEntry);
    }

    // Output to file if enabled (in a real implementation)
    if (this.config.enableFile) {
      this.logToFile(logEntry);
    }
  }

  /**
   * Log to console with appropriate formatting
   */
  private logToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    const prefix = `[${timestamp}] [${levelName}]`;

    let output = `${prefix} ${entry.message}`;

    if (entry.context) {
      output += ` ${JSON.stringify(entry.context)}`;
    }

    switch (entry.level) {
      case LogLevel.ERROR:
        console.error(output);
        if (entry.error) {
          console.error(entry.error);
        }
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.DEBUG:
        console.debug(output);
        break;
    }
  }

  /**
   * Log to file (placeholder implementation)
   */
  private logToFile(entry: LogEntry): void {
    // In a real implementation, this would write to a file
    // For now, we'll just store it in memory
    const logLine = this.formatLogEntry(entry);
    
    // This would typically use fs.appendFile or a logging library
    // console.log('Would write to file:', logLine);
  }

  /**
   * Format a log entry for file output
   */
  private formatLogEntry(entry: LogEntry): string {
    const timestamp = entry.timestamp.toISOString();
    const levelName = LogLevel[entry.level];
    
    let formatted = `${timestamp} [${levelName}] ${entry.message}`;
    
    if (entry.context) {
      formatted += ` ${JSON.stringify(entry.context)}`;
    }
    
    if (entry.error) {
      formatted += `\nError: ${entry.error.message}`;
      if (entry.error.stack) {
        formatted += `\nStack: ${entry.error.stack}`;
      }
    }
    
    return formatted;
  }

  /**
   * Get recent logs
   */
  getRecentLogs(count: number = 100): LogEntry[] {
    return this.logs.slice(-count);
  }

  /**
   * Get logs by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs within a time range
   */
  getLogsByTimeRange(start: Date, end: Date): LogEntry[] {
    return this.logs.filter(
      log => log.timestamp >= start && log.timestamp <= end
    );
  }

  /**
   * Clear all logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current configuration
   */
  getConfig(): LoggerConfig {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Create a child logger with additional context
   */
  child(context: Record<string, any>): LoggerService {
    const childLogger = new LoggerService(this.config);
    
    // Override the log method to include the context
    const originalLog = childLogger.log.bind(childLogger);
    childLogger.log = (level: LogLevel, message: string, additionalContext?: Record<string, any>, error?: Error) => {
      const mergedContext = { ...context, ...additionalContext };
      originalLog(level, message, mergedContext, error);
    };
    
    return childLogger;
  }

  /**
   * Log performance metrics
   */
  performance(operation: string, duration: number, context?: Record<string, any>): void {
    this.info(`Performance: ${operation} completed in ${duration}ms`, {
      operation,
      duration,
      ...context,
    });
  }

  /**
   * Log security events
   */
  security(event: string, context?: Record<string, any>): void {
    this.warn(`Security: ${event}`, {
      event,
      security: true,
      ...context,
    });
  }

  /**
   * Log audit events
   */
  audit(action: string, userId?: string, context?: Record<string, any>): void {
    this.info(`Audit: ${action}`, {
      action,
      userId,
      audit: true,
      ...context,
    });
  }
}

// Create a default logger instance
export const logger = new LoggerService({
  level: process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO,
  enableConsole: true,
  enableFile: process.env.NODE_ENV === 'production',
});

// Export the LoggerService class for creating custom loggers
export { LoggerService };