// Analytics data types
export interface BusinessMetrics {
  // Revenue metrics
  totalRevenue: number;
  revenueGrowth: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  quarterlyRevenue: Array<{ quarter: string; revenue: number }>;
  yearlyRevenue: Array<{ year: string; revenue: number }>;

  // Order metrics
  totalOrders: number;
  orderGrowth: number;
  averageOrderValue: number;
  orderConversionRate: number;

  // Client metrics
  totalClients: number;
  activeClients: number;
  newClients: number;
  clientRetentionRate: number;
  clientLifetimeValue: number;

  // Product metrics
  totalProducts: number;
  topSellingProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  productPerformance: Array<{
    productId: string;
    name: string;
    conversionRate: number;
    profitMargin: number;
  }>;

  // Geographic metrics
  salesByCountry: Array<{
    country: string;
    revenue: number;
    orderCount: number;
  }>;
  salesByRegion: Array<{ region: string; revenue: number; orderCount: number }>;

  // Performance metrics
  averageDeliveryTime: number;
  onTimeDeliveryRate: number;
  qualityScore: number;
  customerSatisfactionScore: number;
}

export interface SalesMetrics {
  // Sales performance
  totalSales: number;
  salesGrowth: number;
  salesByPeriod: Array<{ period: string; sales: number; target?: number }>;

  // Sales team performance
  salesByRep: Array<{
    repId: string;
    name: string;
    sales: number;
    orders: number;
    conversionRate: number;
  }>;
  topPerformers: Array<{ repId: string; name: string; performance: number }>;

  // Pipeline metrics
  pipelineValue: number;
  pipelineCount: number;
  conversionRate: number;
  averageDealSize: number;
  salesCycleLength: number;

  // Lead metrics
  totalLeads: number;
  qualifiedLeads: number;
  leadConversionRate: number;
  leadsBySource: Array<{
    source: string;
    count: number;
    conversionRate: number;
  }>;

  // RFQ metrics
  totalRFQs: number;
  rfqConversionRate: number;
  averageRFQValue: number;
  rfqResponseTime: number;

  // Forecast
  salesForecast: Array<{
    period: string;
    forecast: number;
    confidence: number;
  }>;
  targetAchievement: number;
}

// Extract individual types for better type safety
export type SalesRepPerformance = {
  repId: string;
  name: string;
  sales: number;
  orders: number;
  conversionRate: number;
};

export interface MarketingMetrics {
  // Website analytics
  websiteVisitors: number;
  pageViews: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;

  // Traffic sources
  trafficBySource: Array<{
    source: string;
    visitors: number;
    conversionRate: number;
  }>;
  organicTraffic: number;
  paidTraffic: number;
  referralTraffic: number;
  directTraffic: number;

  // Content performance
  topPages: Array<{ page: string; views: number; engagementRate: number }>;
  contentEngagement: Array<{
    contentId: string;
    title: string;
    views: number;
    shares: number;
    leads: number;
  }>;

  // SEO metrics
  organicKeywords: number;
  averagePosition: number;
  organicClicks: number;
  organicImpressions: number;
  organicCTR: number;

  // Lead generation
  totalLeads: number;
  leadsByChannel: Array<{
    channel: string;
    leads: number;
    cost: number;
    conversionRate: number;
  }>;
  costPerLead: number;
  leadQualityScore: number;

  // Campaign performance
  campaignMetrics: Array<{
    campaignId: string;
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    cost: number;
    roi: number;
  }>;
  emailMetrics: {
    sent: number;
    opened: number;
    clicked: number;
    unsubscribed: number;
    bounced: number;
  };
}

export interface OperationalMetrics {
  // Production metrics
  productionCapacity: number;
  productionUtilization: number;
  productionEfficiency: number;
  qualityControlMetrics: {
    passRate: number;
    defectRate: number;
    reworkRate: number;
  };

  // Inventory metrics
  inventoryTurnover: number;
  stockLevels: Array<{
    productId: string;
    currentStock: number;
    optimalStock: number;
    status: string;
  }>;
  stockoutRate: number;
  inventoryValue: number;

  // Logistics metrics
  shippingCosts: number;
  averageShippingTime: number;
  shippingAccuracy: number;
  carrierPerformance: Array<{
    carrier: string;
    onTimeRate: number;
    damageRate: number;
    cost: number;
  }>;

  // Financial metrics
  grossMargin: number;
  netMargin: number;
  operatingExpenses: number;
  cashFlow: number;
  accountsReceivable: number;
  accountsPayable: number;

  // Efficiency metrics
  orderProcessingTime: number;
  documentProcessingTime: number;
  customerResponseTime: number;
  issueResolutionTime: number;
}

export interface CustomerMetrics {
  // Customer satisfaction
  customerSatisfactionScore: number;
  netPromoterScore: number;
  customerEffortScore: number;

  // Customer behavior
  customerSegments: Array<{
    segment: string;
    count: number;
    value: number;
    characteristics: string[];
  }>;
  customerJourney: Array<{
    stage: string;
    count: number;
    conversionRate: number;
    averageTime: number;
  }>;

  // Retention metrics
  customerRetentionRate: number;
  customerChurnRate: number;
  repeatPurchaseRate: number;
  customerLifetimeValue: number;

  // Support metrics
  supportTickets: number;
  averageResolutionTime: number;
  firstContactResolution: number;
  supportSatisfactionScore: number;

  // Engagement metrics
  engagementScore: number;
  communicationFrequency: number;
  responseRate: number;
  feedbackScore: number;
}

export interface CompetitiveMetrics {
  // Market position
  marketShare: number;
  competitivePosition: string;
  priceCompetitiveness: number;

  // Competitive analysis
  competitorComparison: Array<{
    competitor: string;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  pricingAnalysis: Array<{
    competitor: string;
    averagePrice: number;
    priceRange: { min: number; max: number };
  }>;

  // Market trends
  marketTrends: Array<{ trend: string; impact: string; opportunity: number }>;
  industryGrowth: number;
  marketSize: number;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface AnalyticsFilter {
  dateRange?: DateRange;
  clientIds?: string[];
  productIds?: string[];
  salesRepIds?: string[];
  countries?: string[];
  regions?: string[];
  categories?: string[];
  segments?: string[];
}

// Repository interface
export interface IAnalyticsRepository {
  // Business metrics
  getBusinessMetrics(filter?: AnalyticsFilter): Promise<BusinessMetrics>;
  getRevenueAnalytics(
    filter?: AnalyticsFilter
  ): Promise<BusinessMetrics['monthlyRevenue']>;
  getGrowthMetrics(
    filter?: AnalyticsFilter
  ): Promise<{ revenue: number; orders: number; clients: number }>;

  // Sales analytics
  getSalesMetrics(filter?: AnalyticsFilter): Promise<SalesMetrics>;
  getSalesPerformance(
    salesRepId?: string,
    filter?: AnalyticsFilter
  ): Promise<SalesRepPerformance>;
  getPipelineAnalytics(
    filter?: AnalyticsFilter
  ): Promise<Partial<SalesMetrics>>;
  getSalesForecast(
    months: number,
    filter?: AnalyticsFilter
  ): Promise<SalesMetrics['salesForecast']>;

  // Marketing analytics
  getMarketingMetrics(filter?: AnalyticsFilter): Promise<MarketingMetrics>;
  getWebsiteAnalytics(
    filter?: AnalyticsFilter
  ): Promise<Partial<MarketingMetrics>>;
  getContentPerformance(
    filter?: AnalyticsFilter
  ): Promise<MarketingMetrics['contentEngagement']>;
  getSEOMetrics(filter?: AnalyticsFilter): Promise<Partial<MarketingMetrics>>;
  getLeadGenerationMetrics(
    filter?: AnalyticsFilter
  ): Promise<Partial<MarketingMetrics>>;

  // Operational analytics
  getOperationalMetrics(filter?: AnalyticsFilter): Promise<OperationalMetrics>;
  getProductionMetrics(
    filter?: AnalyticsFilter
  ): Promise<Partial<OperationalMetrics>>;
  getInventoryMetrics(
    filter?: AnalyticsFilter
  ): Promise<Partial<OperationalMetrics>>;
  getLogisticsMetrics(
    filter?: AnalyticsFilter
  ): Promise<Partial<OperationalMetrics>>;
  getFinancialMetrics(
    filter?: AnalyticsFilter
  ): Promise<Partial<OperationalMetrics>>;

  // Customer analytics
  getCustomerMetrics(filter?: AnalyticsFilter): Promise<CustomerMetrics>;
  getCustomerSegmentation(
    filter?: AnalyticsFilter
  ): Promise<CustomerMetrics['customerSegments']>;
  getCustomerJourney(
    filter?: AnalyticsFilter
  ): Promise<CustomerMetrics['customerJourney']>;
  getRetentionAnalytics(
    filter?: AnalyticsFilter
  ): Promise<Partial<CustomerMetrics>>;

  // Competitive analytics
  getCompetitiveMetrics(filter?: AnalyticsFilter): Promise<CompetitiveMetrics>;
  getMarketAnalysis(
    filter?: AnalyticsFilter
  ): Promise<Partial<CompetitiveMetrics>>;
  getPricingAnalysis(
    filter?: AnalyticsFilter
  ): Promise<CompetitiveMetrics['pricingAnalysis']>;

  // Product analytics
  getProductPerformance(
    filter?: AnalyticsFilter
  ): Promise<Array<{ productId: string; metrics: any }>>;
  getProductTrends(
    productId: string,
    filter?: AnalyticsFilter
  ): Promise<Array<{ period: string; sales: number; trend: string }>>;
  getCategoryAnalytics(
    filter?: AnalyticsFilter
  ): Promise<Array<{ category: string; performance: any }>>;

  // Geographic analytics
  getGeographicMetrics(
    filter?: AnalyticsFilter
  ): Promise<{ countries: any[]; regions: any[] }>;
  getMarketPenetration(
    filter?: AnalyticsFilter
  ): Promise<
    Array<{ market: string; penetration: number; opportunity: number }>
  >;
  getRegionalPerformance(
    filter?: AnalyticsFilter
  ): Promise<Array<{ region: string; performance: any }>>;

  // Time-series analytics
  getTrendAnalysis(
    metric: string,
    period: 'daily' | 'weekly' | 'monthly' | 'quarterly',
    filter?: AnalyticsFilter
  ): Promise<Array<{ period: string; value: number; change: number }>>;
  getSeasonalAnalysis(
    metric: string,
    filter?: AnalyticsFilter
  ): Promise<Array<{ season: string; pattern: any }>>;
  getYearOverYearComparison(
    metric: string,
    filter?: AnalyticsFilter
  ): Promise<
    Array<{
      period: string;
      currentYear: number;
      previousYear: number;
      change: number;
    }>
  >;

  // Cohort analysis
  getCohortAnalysis(
    type: 'revenue' | 'retention' | 'orders',
    filter?: AnalyticsFilter
  ): Promise<Array<{ cohort: string; periods: number[]; metrics: any }>>;
  getCustomerCohorts(filter?: AnalyticsFilter): Promise<
    Array<{
      cohort: string;
      size: number;
      retention: number[];
      revenue: number[];
    }>
  >;

  // Funnel analysis
  getSalesFunnel(filter?: AnalyticsFilter): Promise<
    Array<{
      stage: string;
      count: number;
      conversionRate: number;
      dropoffRate: number;
    }>
  >;
  getConversionFunnel(
    funnelType: string,
    filter?: AnalyticsFilter
  ): Promise<
    Array<{ step: string; visitors: number; conversions: number; rate: number }>
  >;

  // Predictive analytics
  getPredictiveMetrics(
    metric: string,
    horizon: number,
    filter?: AnalyticsFilter
  ): Promise<Array<{ period: string; prediction: number; confidence: number }>>;
  getAnomalyDetection(
    metric: string,
    filter?: AnalyticsFilter
  ): Promise<
    Array<{ date: Date; value: number; isAnomaly: boolean; severity: number }>
  >;
  getChurnPrediction(
    filter?: AnalyticsFilter
  ): Promise<
    Array<{ clientId: string; churnProbability: number; riskFactors: string[] }>
  >;

  // Real-time analytics
  getRealTimeMetrics(): Promise<{
    activeUsers: number;
    currentOrders: number;
    recentActivity: any[];
  }>;
  getLiveTraffic(): Promise<{
    visitors: number;
    pageViews: number;
    sources: any[];
  }>;
  getCurrentPerformance(): Promise<{
    sales: number;
    orders: number;
    conversion: number;
  }>;

  // Custom analytics
  createCustomReport(definition: any): Promise<string>; // Returns report ID
  getCustomReport(reportId: string, filter?: AnalyticsFilter): Promise<any>;
  updateCustomReport(reportId: string, definition: any): Promise<void>;
  deleteCustomReport(reportId: string): Promise<void>;
  listCustomReports(): Promise<
    Array<{ id: string; name: string; description: string; createdAt: Date }>
  >;

  // Data export
  exportMetrics(
    metrics: string[],
    format: 'csv' | 'excel' | 'json',
    filter?: AnalyticsFilter
  ): Promise<Buffer | string>;
  scheduleReport(reportConfig: any): Promise<string>; // Returns schedule ID
  getScheduledReports(): Promise<
    Array<{ id: string; config: any; nextRun: Date }>
  >;

  // Data quality and validation
  validateData(
    dataType: string,
    dateRange: DateRange
  ): Promise<{ isValid: boolean; issues: string[] }>;
  getDataQualityScore(): Promise<{
    score: number;
    issues: Array<{ type: string; severity: string; description: string }>;
  }>;
  refreshAnalyticsData(): Promise<void>;

  // Performance optimization
  precomputeMetrics(metrics: string[], dateRange: DateRange): Promise<void>;
  getCacheStatus(): Promise<{
    cached: string[];
    pending: string[];
    expired: string[];
  }>;
  clearAnalyticsCache(metrics?: string[]): Promise<void>;

  // Alerts and notifications
  setAlert(metric: string, condition: any, notification: any): Promise<string>; // Returns alert ID
  getAlerts(): Promise<
    Array<{ id: string; metric: string; condition: any; isActive: boolean }>
  >;
  checkAlerts(): Promise<
    Array<{
      alertId: string;
      triggered: boolean;
      value: number;
      threshold: number;
    }>
  >;

  // Benchmarking
  getBenchmarks(industry?: string): Promise<{
    metrics: Record<string, { value: number; percentile: number }>;
  }>;
  compareToIndustry(metrics: string[]): Promise<
    Array<{
      metric: string;
      ourValue: number;
      industryAverage: number;
      percentile: number;
    }>
  >;

  // Integration and sync
  syncExternalData(source: string): Promise<void>;
  getDataSources(): Promise<
    Array<{ source: string; lastSync: Date; status: string }>
  >;
  validateDataIntegrity(): Promise<{ isValid: boolean; discrepancies: any[] }>;
}
