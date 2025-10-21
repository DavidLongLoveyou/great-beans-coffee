import { LoggerService } from './logger-service';

const logger = new LoggerService();

export interface AuditEvent {
  id: string;
  timestamp: Date;
  userId?: string;
  userEmail?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  sessionId?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export interface AuditQuery {
  userId?: string;
  action?: string;
  resource?: string;
  startDate?: Date;
  endDate?: Date;
  success?: boolean;
  limit?: number;
  offset?: number;
}

export enum AuditAction {
  // Authentication
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  PASSWORD_RESET_REQUEST = 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_CHANGE = 'PASSWORD_CHANGE',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  ACCOUNT_UNLOCKED = 'ACCOUNT_UNLOCKED',

  // User Management
  USER_CREATE = 'USER_CREATE',
  USER_UPDATE = 'USER_UPDATE',
  USER_DELETE = 'USER_DELETE',
  USER_ACTIVATE = 'USER_ACTIVATE',
  USER_DEACTIVATE = 'USER_DEACTIVATE',
  ROLE_ASSIGN = 'ROLE_ASSIGN',
  ROLE_REMOVE = 'ROLE_REMOVE',

  // Data Operations
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',

  // Business Operations
  QUOTE_REQUEST = 'QUOTE_REQUEST',
  QUOTE_APPROVE = 'QUOTE_APPROVE',
  QUOTE_REJECT = 'QUOTE_REJECT',
  ORDER_CREATE = 'ORDER_CREATE',
  ORDER_UPDATE = 'ORDER_UPDATE',
  ORDER_CANCEL = 'ORDER_CANCEL',
  PAYMENT_PROCESS = 'PAYMENT_PROCESS',

  // System Operations
  SYSTEM_CONFIG_CHANGE = 'SYSTEM_CONFIG_CHANGE',
  BACKUP_CREATE = 'BACKUP_CREATE',
  BACKUP_RESTORE = 'BACKUP_RESTORE',
  MAINTENANCE_START = 'MAINTENANCE_START',
  MAINTENANCE_END = 'MAINTENANCE_END',

  // Security Events
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  DATA_BREACH_ATTEMPT = 'DATA_BREACH_ATTEMPT',
}

export enum AuditResource {
  USER = 'USER',
  ROLE = 'ROLE',
  PERMISSION = 'PERMISSION',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
  QUOTE = 'QUOTE',
  ORDER = 'ORDER',
  PAYMENT = 'PAYMENT',
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
  INVENTORY = 'INVENTORY',
  SYSTEM = 'SYSTEM',
  SECURITY = 'SECURITY',
}

class AuditService {
  private events: AuditEvent[] = [];
  private maxEvents = 10000; // Keep last 10k events in memory

  /**
   * Log an audit event
   */
  async logEvent(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<void> {
    const auditEvent: AuditEvent = {
      id: this.generateEventId(),
      timestamp: new Date(),
      ...event,
    };

    try {
      // Store in memory (in production, this would go to a database)
      this.events.push(auditEvent);

      // Keep only the most recent events
      if (this.events.length > this.maxEvents) {
        this.events = this.events.slice(-this.maxEvents);
      }

      // Log to system logger
      const logLevel = auditEvent.success ? 'info' : 'warn';
      logger[logLevel]('Audit Event:', {
        action: auditEvent.action,
        resource: auditEvent.resource,
        userId: auditEvent.userId,
        success: auditEvent.success,
        details: auditEvent.details,
      });

      // In production, you would also:
      // 1. Store in audit database
      // 2. Send to SIEM system
      // 3. Trigger alerts for critical events
    } catch (error) {
      logger.error('Failed to log audit event:', error);
    }
  }

  /**
   * Log authentication event
   */
  async logAuthEvent(
    action: AuditAction,
    userId?: string,
    userEmail?: string,
    success: boolean = true,
    details?: Record<string, any>,
    request?: { ip?: string; userAgent?: string }
  ): Promise<void> {
    const eventData: Omit<AuditEvent, 'id' | 'timestamp'> = {
      action,
      resource: AuditResource.USER,
      success,
    };

    if (userId) {
      eventData.userId = userId;
    }
    if (userEmail) {
      eventData.userEmail = userEmail;
    }
    if (details) {
      eventData.details = details;
    }
    if (request?.ip) {
      eventData.ipAddress = request.ip;
    }
    if (request?.userAgent) {
      eventData.userAgent = request.userAgent;
    }

    await this.logEvent(eventData);
  }

  /**
   * Log user management event
   */
  async logUserEvent(
    action: AuditAction,
    targetUserId: string,
    performedBy?: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventData: Omit<AuditEvent, 'id' | 'timestamp'> = {
      action,
      resource: AuditResource.USER,
      resourceId: targetUserId,
      success: true,
    };

    if (performedBy) {
      eventData.userId = performedBy;
    }
    if (details) {
      eventData.details = details;
    }

    await this.logEvent(eventData);
  }

  /**
   * Log data operation event
   */
  async logDataEvent(
    action: AuditAction,
    resource: AuditResource,
    resourceId?: string,
    userId?: string,
    success: boolean = true,
    details?: Record<string, any>,
    errorMessage?: string
  ): Promise<void> {
    const eventData: Omit<AuditEvent, 'id' | 'timestamp'> = {
      action,
      resource,
      success,
    };

    if (userId) {
      eventData.userId = userId;
    }
    if (resourceId) {
      eventData.resourceId = resourceId;
    }
    if (details) {
      eventData.details = details;
    }
    if (errorMessage) {
      eventData.errorMessage = errorMessage;
    }

    await this.logEvent(eventData);
  }

  /**
   * Log business operation event
   */
  async logBusinessEvent(
    action: AuditAction,
    resource: AuditResource,
    resourceId: string,
    userId: string,
    details?: Record<string, any>
  ): Promise<void> {
    const eventData: Omit<AuditEvent, 'id' | 'timestamp'> = {
      userId,
      action,
      resource,
      resourceId,
      success: true,
    };

    if (details) {
      eventData.details = details;
    }

    await this.logEvent(eventData);
  }

  /**
   * Log security event
   */
  async logSecurityEvent(
    action: AuditAction,
    details: Record<string, any>,
    request?: { ip?: string; userAgent?: string; userId?: string }
  ): Promise<void> {
    const eventData: Omit<AuditEvent, 'id' | 'timestamp'> = {
      action,
      resource: AuditResource.SECURITY,
      success: false, // Security events are typically failures
      details,
    };

    if (request?.userId) {
      eventData.userId = request.userId;
    }
    if (request?.ip) {
      eventData.ipAddress = request.ip;
    }
    if (request?.userAgent) {
      eventData.userAgent = request.userAgent;
    }

    await this.logEvent(eventData);
  }

  /**
   * Query audit events
   */
  async queryEvents(query: AuditQuery): Promise<AuditEvent[]> {
    let filteredEvents = [...this.events];

    // Apply filters
    if (query.userId) {
      filteredEvents = filteredEvents.filter(
        event => event.userId === query.userId
      );
    }

    if (query.action) {
      filteredEvents = filteredEvents.filter(
        event => event.action === query.action
      );
    }

    if (query.resource) {
      filteredEvents = filteredEvents.filter(
        event => event.resource === query.resource
      );
    }

    if (query.startDate) {
      filteredEvents = filteredEvents.filter(
        event => event.timestamp >= query.startDate!
      );
    }

    if (query.endDate) {
      filteredEvents = filteredEvents.filter(
        event => event.timestamp <= query.endDate!
      );
    }

    if (query.success !== undefined) {
      filteredEvents = filteredEvents.filter(
        event => event.success === query.success
      );
    }

    // Sort by timestamp (newest first)
    filteredEvents.sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );

    // Apply pagination
    const offset = query.offset || 0;
    const limit = query.limit || 100;

    return filteredEvents.slice(offset, offset + limit);
  }

  /**
   * Get audit statistics
   */
  async getStatistics(
    startDate?: Date,
    endDate?: Date
  ): Promise<Record<string, any>> {
    let events = [...this.events];

    if (startDate) {
      events = events.filter(event => event.timestamp >= startDate);
    }

    if (endDate) {
      events = events.filter(event => event.timestamp <= endDate);
    }

    const stats = {
      totalEvents: events.length,
      successfulEvents: events.filter(e => e.success).length,
      failedEvents: events.filter(e => !e.success).length,
      uniqueUsers: new Set(events.map(e => e.userId).filter(Boolean)).size,
      actionBreakdown: {} as Record<string, number>,
      resourceBreakdown: {} as Record<string, number>,
      hourlyBreakdown: {} as Record<string, number>,
    };

    // Calculate breakdowns
    events.forEach(event => {
      // Action breakdown
      stats.actionBreakdown[event.action] =
        (stats.actionBreakdown[event.action] || 0) + 1;

      // Resource breakdown
      stats.resourceBreakdown[event.resource] =
        (stats.resourceBreakdown[event.resource] || 0) + 1;

      // Hourly breakdown
      const hour = event.timestamp.getHours();
      stats.hourlyBreakdown[hour] = (stats.hourlyBreakdown[hour] || 0) + 1;
    });

    return stats;
  }

  /**
   * Get recent failed events
   */
  async getRecentFailures(limit: number = 50): Promise<AuditEvent[]> {
    return this.events
      .filter(event => !event.success)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Get user activity timeline
   */
  async getUserActivity(
    userId: string,
    limit: number = 100
  ): Promise<AuditEvent[]> {
    return this.events
      .filter(event => event.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  /**
   * Detect suspicious patterns
   */
  async detectSuspiciousActivity(): Promise<AuditEvent[]> {
    const suspiciousEvents: AuditEvent[] = [];
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Get recent events
    const recentEvents = this.events.filter(
      event => event.timestamp >= oneHourAgo
    );

    // Group by IP address
    const ipGroups = new Map<string, AuditEvent[]>();
    recentEvents.forEach(event => {
      if (event.ipAddress) {
        if (!ipGroups.has(event.ipAddress)) {
          ipGroups.set(event.ipAddress, []);
        }
        ipGroups.get(event.ipAddress)!.push(event);
      }
    });

    // Check for suspicious patterns
    ipGroups.forEach((events, ip) => {
      // Multiple failed login attempts
      const failedLogins = events.filter(
        e => e.action === AuditAction.LOGIN_FAILED && !e.success
      );

      if (failedLogins.length >= 5) {
        suspiciousEvents.push(...failedLogins);
      }

      // Rapid successive requests
      if (events.length >= 100) {
        suspiciousEvents.push(...events);
      }
    });

    return suspiciousEvents;
  }

  /**
   * Export audit events
   */
  async exportEvents(
    query: AuditQuery,
    format: 'json' | 'csv' = 'json'
  ): Promise<string> {
    const events = await this.queryEvents(query);

    if (format === 'csv') {
      const headers = [
        'ID',
        'Timestamp',
        'User ID',
        'User Email',
        'Action',
        'Resource',
        'Resource ID',
        'Success',
        'IP Address',
        'User Agent',
        'Details',
      ];

      const csvRows = [
        headers.join(','),
        ...events.map(event =>
          [
            event.id,
            event.timestamp.toISOString(),
            event.userId || '',
            event.userEmail || '',
            event.action,
            event.resource,
            event.resourceId || '',
            event.success,
            event.ipAddress || '',
            event.userAgent || '',
            JSON.stringify(event.details || {}),
          ]
            .map(field => `"${field}"`)
            .join(',')
        ),
      ];

      return csvRows.join('\n');
    }

    return JSON.stringify(events, null, 2);
  }

  /**
   * Clear old events
   */
  async clearOldEvents(olderThan: Date): Promise<number> {
    const initialCount = this.events.length;
    this.events = this.events.filter(event => event.timestamp >= olderThan);
    const removedCount = initialCount - this.events.length;

    logger.info(`Cleared ${removedCount} old audit events`);
    return removedCount;
  }

  /**
   * Generate unique event ID
   */
  private generateEventId(): string {
    return `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const auditService = new AuditService();
