'use client';

import {
  Activity,
  Clock,
  Zap,
  Eye,
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { cn } from '@/lib/utils';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Progress } from '@/presentation/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  coreWebVitalsOptimizer,
  type WebVitalsMetric,
  getWebVitalsScore,
} from '@/shared/utils/core-web-vitals';
import { createScopedLogger } from '@/shared/utils/logger';

const _logger = createScopedLogger('WebVitalsDashboard');

interface WebVitalsDashboardProps {
  /** Whether to show the dashboard in development mode only */
  developmentOnly?: boolean;
  /** Position of the dashboard */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Whether to start minimized */
  startMinimized?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Web Vitals Dashboard component for real-time performance monitoring
 * Displays Core Web Vitals metrics, performance scores, and optimization recommendations
 */
export function WebVitalsDashboard({
  developmentOnly = true,
  position = 'bottom-right',
  startMinimized = true,
  className,
}: WebVitalsDashboardProps) {
  const [metrics, setMetrics] = useState<Map<string, WebVitalsMetric>>(
    new Map()
  );
  const [performanceScore, setPerformanceScore] = useState(getWebVitalsScore());
  const [isMinimized, setIsMinimized] = useState(startMinimized);
  const isVisible = !developmentOnly || process.env.NODE_ENV === 'development';

  // Update metrics periodically
  useEffect(() => {
    if (!isVisible) return;

    const updateMetrics = () => {
      const currentMetrics = coreWebVitalsOptimizer.getMetrics();
      const currentScore = getWebVitalsScore();

      setMetrics(currentMetrics);
      setPerformanceScore(currentScore);
    };

    // Initial update
    updateMetrics();

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000);

    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'good':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'poor':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRatingIcon = (rating: string) => {
    switch (rating) {
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'needs-improvement':
        return <AlertTriangle className="h-4 w-4" />;
      case 'poor':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getMetricIcon = (metricName: string) => {
    switch (metricName) {
      case 'LCP':
        return <Eye className="h-4 w-4" />;
      case 'FID':
      case 'INP':
        return <Zap className="h-4 w-4" />;
      case 'CLS':
        return <Activity className="h-4 w-4" />;
      case 'FCP':
        return <TrendingUp className="h-4 w-4" />;
      case 'TTFB':
        return <Clock className="h-4 w-4" />;
      default:
        return <Gauge className="h-4 w-4" />;
    }
  };

  const formatMetricValue = (metric: WebVitalsMetric) => {
    switch (metric.name) {
      case 'CLS':
        return metric.value.toFixed(3);
      case 'LCP':
      case 'FID':
      case 'INP':
      case 'FCP':
      case 'TTFB':
        return `${Math.round(metric.value)}ms`;
      default:
        return metric.value.toString();
    }
  };

  const getMetricDescription = (metricName: string) => {
    switch (metricName) {
      case 'LCP':
        return 'Largest Contentful Paint - Time to render the largest content element';
      case 'FID':
        return 'First Input Delay - Time from first user interaction to browser response';
      case 'INP':
        return 'Interaction to Next Paint - Responsiveness to user interactions';
      case 'CLS':
        return 'Cumulative Layout Shift - Visual stability of the page';
      case 'FCP':
        return 'First Contentful Paint - Time to first content render';
      case 'TTFB':
        return 'Time to First Byte - Server response time';
      default:
        return 'Performance metric';
    }
  };

  const coreMetrics = ['LCP', 'FID', 'CLS', 'INP'];
  const additionalMetrics = ['FCP', 'TTFB'];

  if (isMinimized) {
    return (
      <div
        className={cn(
          'fixed z-50 transition-all duration-300',
          positionClasses[position],
          className
        )}
      >
        <Button
          onClick={() => setIsMinimized(false)}
          variant="outline"
          size="sm"
          className={cn(
            'shadow-lg backdrop-blur-sm',
            getRatingColor(performanceScore.rating)
          )}
        >
          <Gauge className="mr-2 h-4 w-4" />
          {Math.round(performanceScore.score)}%
          {getRatingIcon(performanceScore.rating)}
        </Button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed z-50 max-h-[80vh] w-96 overflow-hidden transition-all duration-300',
        positionClasses[position],
        className
      )}
    >
      <Card className="bg-white/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gauge className="h-5 w-5" />
              <CardTitle className="text-lg">Web Vitals</CardTitle>
            </div>
            <div className="flex items-center space-x-2">
              <Badge
                variant="outline"
                className={cn(
                  'text-xs',
                  getRatingColor(performanceScore.rating)
                )}
              >
                {Math.round(performanceScore.score)}%
              </Badge>
              <Button
                onClick={() => setIsMinimized(true)}
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
              >
                ×
              </Button>
            </div>
          </div>
          <CardDescription>
            Real-time Core Web Vitals monitoring
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs defaultValue="core" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="core">Core Metrics</TabsTrigger>
              <TabsTrigger value="additional">Additional</TabsTrigger>
            </TabsList>

            <TabsContent value="core" className="mt-4 space-y-3">
              {coreMetrics.map(metricName => {
                const metric = metrics.get(metricName);
                if (!metric) {
                  return (
                    <div
                      key={metricName}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(metricName)}
                        <span className="text-sm font-medium">
                          {metricName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Measuring...
                      </Badge>
                    </div>
                  );
                }

                return (
                  <div
                    key={metricName}
                    className={cn(
                      'rounded-lg border p-3',
                      getRatingColor(metric.rating)
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(metricName)}
                        <span className="text-sm font-medium">
                          {metricName}
                        </span>
                        {getRatingIcon(metric.rating)}
                      </div>
                      <span className="font-mono text-sm font-semibold">
                        {formatMetricValue(metric)}
                      </span>
                    </div>
                    <p className="text-xs opacity-75">
                      {getMetricDescription(metricName)}
                    </p>
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="additional" className="mt-4 space-y-3">
              {additionalMetrics.map(metricName => {
                const metric = metrics.get(metricName);
                if (!metric) {
                  return (
                    <div
                      key={metricName}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                    >
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(metricName)}
                        <span className="text-sm font-medium">
                          {metricName}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Measuring...
                      </Badge>
                    </div>
                  );
                }

                return (
                  <div
                    key={metricName}
                    className={cn(
                      'rounded-lg border p-3',
                      getRatingColor(metric.rating)
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getMetricIcon(metricName)}
                        <span className="text-sm font-medium">
                          {metricName}
                        </span>
                        {getRatingIcon(metric.rating)}
                      </div>
                      <span className="font-mono text-sm font-semibold">
                        {formatMetricValue(metric)}
                      </span>
                    </div>
                    <p className="text-xs opacity-75">
                      {getMetricDescription(metricName)}
                    </p>
                  </div>
                );
              })}
            </TabsContent>
          </Tabs>

          {/* Performance Score */}
          <div className="border-t pt-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium">Overall Score</span>
              <Badge className={cn(getRatingColor(performanceScore.rating))}>
                {performanceScore.rating}
              </Badge>
            </div>
            <Progress value={performanceScore.score} className="h-2" />
            <p className="mt-1 text-xs text-gray-600">
              Based on Core Web Vitals metrics
            </p>
          </div>

          {/* Quick Actions */}
          <div className="border-t pt-3">
            <div className="flex space-x-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <RefreshCw className="mr-1 h-3 w-3" />
                Refresh
              </Button>
              <Button
                onClick={() => {
                  const _data = {
                    score: performanceScore.score,
                    rating: performanceScore.rating,
                    metrics: Object.fromEntries(metrics),
                    timestamp: new Date().toISOString(),
                  };
                  // Development logging removed for production
                }}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Web Vitals Provider component to initialize monitoring
 */
export function WebVitalsProvider({
  children,
  showDashboard = false,
  dashboardProps = {},
}: {
  children: React.ReactNode;
  showDashboard?: boolean;
  dashboardProps?: Partial<WebVitalsDashboardProps>;
}) {
  useEffect(() => {
    // Initialize Web Vitals tracking
    coreWebVitalsOptimizer.preloadCriticalResources([
      {
        href: 'https://fonts.googleapis.com',
        as: 'style',
      },
      {
        href: 'https://res.cloudinary.com',
        as: 'image',
      },
    ]);
  }, []);

  return (
    <>
      {children}
      {showDashboard && <WebVitalsDashboard {...dashboardProps} />}
    </>
  );
}
