// Analytics DTOs for application layer communication

export interface AnalyticsEventDto {
  id: string;
  eventName: string;
  eventCategory: 'PAGE_VIEW' | 'USER_INTERACTION' | 'BUSINESS_ACTION' | 'CONVERSION' | 'ERROR' | 'PERFORMANCE';
  
  // Event Data
  properties: Record<string, any>;
  
  // User Context
  userId?: string;
  sessionId: string;
  anonymousId?: string;
  
  // Page Context
  page: {
    url: string;
    path: string;
    title: string;
    referrer?: string;
    locale: string;
  };
  
  // Device Context
  device: {
    userAgent: string;
    ip?: string;
    country?: string;
    city?: string;
    deviceType: 'DESKTOP' | 'MOBILE' | 'TABLET';
    browser: string;
    os: string;
    screenResolution?: string;
  };
  
  // Timing
  timestamp: Date;
  serverTimestamp: Date;
  
  // Metadata
  source: 'WEB' | 'MOBILE_APP' | 'API' | 'SERVER';
  version?: string;
}

export interface CreateAnalyticsEventDto {
  eventName: string;
  eventCategory: AnalyticsEventDto['eventCategory'];
  properties: Record<string, any>;
  userId?: string;
  sessionId: string;
  anonymousId?: string;
  page: AnalyticsEventDto['page'];
  device: AnalyticsEventDto['device'];
  source: AnalyticsEventDto['source'];
  version?: string;
}

export interface AnalyticsMetricDto {
  id: string;
  metricName: string;
  metricType: 'COUNTER' | 'GAUGE' | 'HISTOGRAM' | 'TIMER';
  
  // Metric Value
  value: number;
  unit?: string;
  
  // Dimensions
  dimensions: Record<string, string>;
  
  // Time
  timestamp: Date;
  period: 'REAL_TIME' | 'HOURLY' | 'DAILY' | 'WEEKLY' | 'MONTHLY';
  
  // Metadata
  source: string;
  tags?: string[];
}

export interface AnalyticsDashboardDto {
  id: string;
  name: string;
  description?: string;
  
  // Dashboard Configuration
  widgets: Array<{
    id: string;
    type: 'METRIC' | 'CHART' | 'TABLE' | 'MAP' | 'FUNNEL' | 'COHORT';
    title: string;
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    configuration: {
      metrics: string[];
      dimensions?: string[];
      filters?: Record<string, any>;
      timeRange: {
        type: 'RELATIVE' | 'ABSOLUTE';
        value: string | { start: Date; end: Date };
      };
      visualization?: {
        chartType?: 'LINE' | 'BAR' | 'PIE' | 'AREA' | 'SCATTER';
        aggregation?: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX';
        groupBy?: string[];
      };
    };
  }>;
  
  // Access Control
  visibility: 'PUBLIC' | 'PRIVATE' | 'TEAM';
  allowedUsers?: string[];
  allowedRoles?: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
  isActive: boolean;
}

export interface AnalyticsReportDto {
  id: string;
  name: string;
  description?: string;
  reportType: 'TRAFFIC' | 'CONVERSION' | 'BUSINESS' | 'PERFORMANCE' | 'USER_BEHAVIOR' | 'CUSTOM';
  
  // Report Configuration
  metrics: Array<{
    name: string;
    aggregation: 'SUM' | 'AVG' | 'COUNT' | 'MIN' | 'MAX' | 'UNIQUE';
    format?: 'NUMBER' | 'PERCENTAGE' | 'CURRENCY' | 'DURATION';
  }>;
  
  dimensions: string[];
  
  filters: Array<{
    dimension: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
    value: any;
  }>;
  
  timeRange: {
    type: 'RELATIVE' | 'ABSOLUTE';
    value: string | { start: Date; end: Date };
  };
  
  // Report Data
  data?: {
    headers: string[];
    rows: any[][];
    summary: Record<string, any>;
    metadata: {
      totalRows: number;
      samplingLevel?: number;
      dataFreshness?: Date;
    };
  };
  
  // Scheduling
  schedule?: {
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    time: string; // HH:MM format
    timezone: string;
    recipients: string[];
    format: 'PDF' | 'CSV' | 'EXCEL' | 'EMAIL';
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdBy: string;
  isActive: boolean;
}

export interface AnalyticsSegmentDto {
  id: string;
  name: string;
  description?: string;
  
  // Segment Definition
  conditions: Array<{
    dimension: string;
    operator: 'EQUALS' | 'NOT_EQUALS' | 'CONTAINS' | 'NOT_CONTAINS' | 'GREATER_THAN' | 'LESS_THAN' | 'IN' | 'NOT_IN';
    value: any;
    logicalOperator?: 'AND' | 'OR';
  }>;
  
  // Segment Type
  type: 'USER' | 'SESSION' | 'EVENT';
  
  // Segment Stats
  stats?: {
    totalUsers: number;
    totalSessions: number;
    totalEvents: number;
    lastCalculated: Date;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface AnalyticsFunnelDto {
  id: string;
  name: string;
  description?: string;
  
  // Funnel Steps
  steps: Array<{
    id: string;
    name: string;
    eventName: string;
    conditions?: Array<{
      property: string;
      operator: string;
      value: any;
    }>;
    order: number;
  }>;
  
  // Funnel Configuration
  timeWindow: number; // in minutes
  conversionWindow: number; // in days
  
  // Funnel Data
  data?: {
    totalUsers: number;
    stepData: Array<{
      stepId: string;
      users: number;
      conversionRate: number;
      dropoffRate: number;
      averageTime?: number; // time to reach this step
    }>;
    overallConversionRate: number;
    calculatedAt: Date;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isActive: boolean;
}

export interface AnalyticsGoalDto {
  id: string;
  name: string;
  description?: string;
  goalType: 'CONVERSION' | 'ENGAGEMENT' | 'REVENUE' | 'CUSTOM';
  
  // Goal Definition
  conditions: Array<{
    eventName?: string;
    property?: string;
    operator: string;
    value: any;
  }>;
  
  // Goal Value
  value?: number;
  currency?: string;
  
  // Goal Tracking
  isActive: boolean;
  trackingStartDate: Date;
  trackingEndDate?: Date;
  
  // Goal Performance
  performance?: {
    totalConversions: number;
    conversionRate: number;
    totalValue: number;
    averageValue: number;
    lastConversion: Date;
    calculatedAt: Date;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface AnalyticsQueryDto {
  metrics: string[];
  dimensions?: string[];
  filters?: Array<{
    dimension: string;
    operator: string;
    value: any;
  }>;
  timeRange: {
    start: Date;
    end: Date;
  };
  limit?: number;
  offset?: number;
  sortBy?: Array<{
    field: string;
    direction: 'ASC' | 'DESC';
  }>;
}

export interface AnalyticsResultDto {
  headers: string[];
  rows: any[][];
  summary: Record<string, any>;
  metadata: {
    totalRows: number;
    queryTime: number;
    samplingLevel?: number;
    dataFreshness: Date;
  };
}