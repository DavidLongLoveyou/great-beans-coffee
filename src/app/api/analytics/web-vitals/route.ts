import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Web Vitals metric interface
interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
  navigationType: string;
}

// Analytics payload interface
interface AnalyticsPayload {
  metric: WebVitalMetric;
  timestamp: number;
  url: string;
  userAgent: string;
  connection?: string;
  sessionId?: string;
  userId?: string;
}

// Performance thresholds for validation
const THRESHOLDS = {
  LCP: { good: 2500, needsImprovement: 4000 },
  FID: { good: 100, needsImprovement: 300 },
  CLS: { good: 0.1, needsImprovement: 0.25 },
  FCP: { good: 1800, needsImprovement: 3000 },
  TTFB: { good: 800, needsImprovement: 1800 },
};

// Validate metric data
function validateMetric(metric: WebVitalMetric): boolean {
  const { name, value, rating } = metric;
  
  // Check if metric name is valid
  if (!Object.keys(THRESHOLDS).includes(name)) {
    return false;
  }
  
  // Check if value is a positive number
  if (typeof value !== 'number' || value < 0) {
    return false;
  }
  
  // Check if rating is valid
  if (!['good', 'needs-improvement', 'poor'].includes(rating)) {
    return false;
  }
  
  // Validate value ranges (basic sanity checks)
  if (name === 'CLS' && value > 5) return false; // CLS should not exceed 5
  if (['LCP', 'FCP', 'FID', 'TTFB'].includes(name) && value > 60000) return false; // Should not exceed 60 seconds
  
  return true;
}

// Get client IP address
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const clientIP = request.headers.get('x-client-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }
  
  return realIP || clientIP || 'unknown';
}

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // Max 100 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = ip;
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  current.count++;
  return true;
}

// Store metrics (in production, use a proper database)
const metricsStore: AnalyticsPayload[] = [];

// POST endpoint for receiving Web Vitals data
export async function POST(request: NextRequest) {
  try {
    // Check rate limiting
    const clientIP = getClientIP(request);
    if (!checkRateLimit(clientIP)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }

    // Parse request body
    const payload: AnalyticsPayload = await request.json();
    
    // Validate required fields
    if (!payload.metric || !payload.timestamp || !payload.url) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Validate metric data
    if (!validateMetric(payload.metric)) {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }
    
    // Validate timestamp (should be within last 24 hours)
    const now = Date.now();
    const dayAgo = now - (24 * 60 * 60 * 1000);
    if (payload.timestamp < dayAgo || payload.timestamp > now + 60000) {
      return NextResponse.json(
        { error: 'Invalid timestamp' },
        { status: 400 }
      );
    }
    
    // Validate URL (should be from same origin in production)
    try {
      const url = new URL(payload.url);
      // In production, validate that URL is from your domain
      // if (url.hostname !== 'thegreatbeans.com') {
      //   return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
      // }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    // Enrich payload with server-side data
    const sessionId = request.headers.get('x-session-id');
    const userId = request.headers.get('x-user-id');
    
    const enrichedPayload: AnalyticsPayload = {
      ...payload,
      ...(sessionId && { sessionId }),
      ...(userId && { userId }),
    };
    
    // Store the metric (in production, save to database)
    metricsStore.push(enrichedPayload);
    
    // Keep only last 10000 metrics in memory
    if (metricsStore.length > 10000) {
      metricsStore.splice(0, metricsStore.length - 10000);
    }
    
    // Log for debugging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('[Web Vitals]', {
        metric: payload.metric.name,
        value: payload.metric.value,
        rating: payload.metric.rating,
        url: payload.url,
        timestamp: new Date(payload.timestamp).toISOString(),
      });
    }
    
    // Send to external analytics services if configured
    await Promise.allSettled([
      // Send to Google Analytics 4 (server-side)
      sendToGA4(enrichedPayload),
      
      // Send to other analytics services
      // sendToDatadog(enrichedPayload),
      // sendToNewRelic(enrichedPayload),
    ]);
    
    return NextResponse.json({ success: true }, { status: 200 });
    
  } catch (error) {
    console.error('[Web Vitals API] Error processing request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving aggregated metrics (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    // Check authorization (implement proper auth in production)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '24h';
    const metric = searchParams.get('metric');
    const url = searchParams.get('url');
    
    // Calculate time range
    const now = Date.now();
    let startTime: number;
    
    switch (timeframe) {
      case '1h':
        startTime = now - (60 * 60 * 1000);
        break;
      case '24h':
        startTime = now - (24 * 60 * 60 * 1000);
        break;
      case '7d':
        startTime = now - (7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startTime = now - (30 * 24 * 60 * 60 * 1000);
        break;
      default:
        startTime = now - (24 * 60 * 60 * 1000);
    }
    
    // Filter metrics
    let filteredMetrics = metricsStore.filter(m => m.timestamp >= startTime);
    
    if (metric) {
      filteredMetrics = filteredMetrics.filter(m => m.metric.name === metric);
    }
    
    if (url) {
      filteredMetrics = filteredMetrics.filter(m => m.url.includes(url));
    }
    
    // Aggregate data
    const aggregated = {
      totalSamples: filteredMetrics.length,
      timeframe,
      metrics: {} as Record<string, {
        count: number;
        average: number;
        median: number;
        p75: number;
        p95: number;
        good: number;
        needsImprovement: number;
        poor: number;
      }>,
    };
    
    // Group by metric name
    const groupedMetrics = filteredMetrics.reduce((acc, item) => {
      const name = item.metric.name;
      if (!acc[name]) acc[name] = [];
      acc[name].push(item);
      return acc;
    }, {} as Record<string, AnalyticsPayload[]>);
    
    // Calculate statistics for each metric
    Object.entries(groupedMetrics).forEach(([name, items]) => {
      const values = items.map(item => item.metric.value).sort((a, b) => a - b);
      const ratings = items.map(item => item.metric.rating);
      
      aggregated.metrics[name] = {
        count: values.length,
        average: values.reduce((sum, val) => sum + val, 0) / values.length,
        median: values[Math.floor(values.length / 2)] ?? 0,
        p75: values[Math.floor(values.length * 0.75)] ?? 0,
        p95: values[Math.floor(values.length * 0.95)] ?? 0,
        good: ratings.filter(r => r === 'good').length,
        needsImprovement: ratings.filter(r => r === 'needs-improvement').length,
        poor: ratings.filter(r => r === 'poor').length,
      };
    });
    
    return NextResponse.json(aggregated, { status: 200 });
    
  } catch (error) {
    console.error('[Web Vitals API] Error retrieving metrics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Send to Google Analytics 4 (server-side)
async function sendToGA4(payload: AnalyticsPayload) {
  if (!process.env.GA4_MEASUREMENT_ID || !process.env.GA4_API_SECRET) {
    return;
  }
  
  try {
    const response = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${process.env.GA4_MEASUREMENT_ID}&api_secret=${process.env.GA4_API_SECRET}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: payload.sessionId || 'anonymous',
          events: [
            {
              name: 'web_vitals',
              params: {
                metric_name: payload.metric.name,
                metric_value: Math.round(
                  payload.metric.name === 'CLS' 
                    ? payload.metric.value * 1000 
                    : payload.metric.value
                ),
                metric_rating: payload.metric.rating,
                metric_delta: payload.metric.delta,
                navigation_type: payload.metric.navigationType,
                page_location: payload.url,
                user_agent: payload.userAgent,
                connection_type: payload.connection,
              },
            },
          ],
        }),
      }
    );
    
    if (!response.ok) {
      console.error('[GA4] Failed to send Web Vitals data:', response.statusText);
    }
  } catch (error) {
    console.error('[GA4] Error sending Web Vitals data:', error);
  }
}