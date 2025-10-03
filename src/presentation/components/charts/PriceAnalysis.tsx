'use client';

import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  AlertTriangle,
  Target,
  Activity,
} from 'lucide-react';
import React, { useState, useMemo } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';

interface PriceDataPoint {
  date: string;
  robusta: number;
  arabica: number;
  volume?: number;
  volatility?: number;
}

interface PriceAnalysisProps {
  title?: string;
  data: PriceDataPoint[];
  timeframe?: '1M' | '3M' | '6M' | '1Y' | '2Y';
  showVolatility?: boolean;
  className?: string;
}

const sampleData: PriceDataPoint[] = [
  {
    date: '2024-01',
    robusta: 2.45,
    arabica: 4.12,
    volume: 1250,
    volatility: 12.5,
  },
  {
    date: '2024-02',
    robusta: 2.38,
    arabica: 4.05,
    volume: 1180,
    volatility: 15.2,
  },
  {
    date: '2024-03',
    robusta: 2.52,
    arabica: 4.28,
    volume: 1320,
    volatility: 18.7,
  },
  {
    date: '2024-04',
    robusta: 2.61,
    arabica: 4.35,
    volume: 1290,
    volatility: 14.3,
  },
  {
    date: '2024-05',
    robusta: 2.48,
    arabica: 4.18,
    volume: 1410,
    volatility: 16.8,
  },
  {
    date: '2024-06',
    robusta: 2.55,
    arabica: 4.42,
    volume: 1380,
    volatility: 13.9,
  },
  {
    date: '2024-07',
    robusta: 2.67,
    arabica: 4.58,
    volume: 1450,
    volatility: 19.2,
  },
  {
    date: '2024-08',
    robusta: 2.72,
    arabica: 4.65,
    volume: 1520,
    volatility: 21.5,
  },
  {
    date: '2024-09',
    robusta: 2.58,
    arabica: 4.38,
    volume: 1340,
    volatility: 17.6,
  },
  {
    date: '2024-10',
    robusta: 2.63,
    arabica: 4.48,
    volume: 1480,
    volatility: 15.4,
  },
  {
    date: '2024-11',
    robusta: 2.71,
    arabica: 4.62,
    volume: 1560,
    volatility: 18.9,
  },
  {
    date: '2024-12',
    robusta: 2.78,
    arabica: 4.75,
    volume: 1620,
    volatility: 20.3,
  },
];

export function PriceAnalysis({
  title = 'Coffee Price Analysis',
  data = sampleData,
  timeframe = '1Y',
  showVolatility = true,
  className = '',
}: PriceAnalysisProps) {
  const [selectedCoffeeType, setSelectedCoffeeType] = useState<
    'robusta' | 'arabica' | 'both'
  >('both');
  const [selectedTimeframe, setSelectedTimeframe] = useState(timeframe);
  const [hoveredPoint, setHoveredPoint] = useState<PriceDataPoint | null>(null);

  // Filter data based on timeframe
  const filteredData = useMemo(() => {
    const months = {
      '1M': 1,
      '3M': 3,
      '6M': 6,
      '1Y': 12,
      '2Y': 24,
    };
    return data.slice(-months[selectedTimeframe]);
  }, [data, selectedTimeframe]);

  // Calculate statistics
  const stats = useMemo(() => {
    const robustaValues = filteredData.map(d => d.robusta);
    const arabicaValues = filteredData.map(d => d.arabica);

    const calculateStats = (values: number[]) => {
      const lastValue = values[values.length - 1];
      const firstValue = values[0];
      return {
        current: lastValue || 0,
        min: values.length > 0 ? Math.min(...values) : 0,
        max: values.length > 0 ? Math.max(...values) : 0,
        avg: values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0,
        change:
          values.length > 1 && firstValue && lastValue && firstValue !== 0
            ? ((lastValue - firstValue) / firstValue) * 100
            : 0,
      };
    };

    return {
      robusta: calculateStats(robustaValues),
      arabica: calculateStats(arabicaValues),
      spread: {
        current:
          arabicaValues.length > 0 && robustaValues.length > 0
            ? (arabicaValues[arabicaValues.length - 1] || 0) -
              (robustaValues[robustaValues.length - 1] || 0)
            : 0,
        avg:
          arabicaValues.length > 0
            ? arabicaValues.reduce(
                (sum, val, i) => sum + (val - (robustaValues[i] || 0)),
                0
              ) / arabicaValues.length
            : 0,
      },
    };
  }, [filteredData]);

  // Chart dimensions
  const chartHeight = 200;
  const chartWidth = 500;

  // Generate chart paths
  const generatePath = (values: number[]) => {
    if (values.length === 0) return null;

    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue || 1;

    const points = values.map((value, index) => {
      const x = (index / (values.length - 1)) * chartWidth;
      const y = chartHeight - ((value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  const robustaPath = generatePath(filteredData.map(d => d.robusta));
  const arabicaPath = generatePath(filteredData.map(d => d.arabica));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Real-time coffee price tracking and analysis
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {(['1M', '3M', '6M', '1Y', '2Y'] as const).map(tf => (
              <Button
                key={tf}
                variant={selectedTimeframe === tf ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTimeframe(tf)}
              >
                {tf}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="prices" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="prices">Price Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            {showVolatility && (
              <TabsTrigger value="volatility">Volatility</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="prices" className="space-y-4">
            {/* Price Chart */}
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Robusta</span>
                    <Badge variant="outline">
                      ${stats.robusta.current.toFixed(2)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Arabica</span>
                    <Badge variant="outline">
                      ${stats.arabica.current.toFixed(2)}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={
                      selectedCoffeeType === 'robusta' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedCoffeeType('robusta')}
                  >
                    Robusta Only
                  </Button>
                  <Button
                    variant={
                      selectedCoffeeType === 'arabica' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedCoffeeType('arabica')}
                  >
                    Arabica Only
                  </Button>
                  <Button
                    variant={
                      selectedCoffeeType === 'both' ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setSelectedCoffeeType('both')}
                  >
                    Both
                  </Button>
                </div>
              </div>

              <svg
                width="100%"
                height={chartHeight + 40}
                viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
                className="overflow-visible"
              >
                {/* Grid */}
                <defs>
                  <pattern
                    id="priceGrid"
                    width="50"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 50 0 L 0 0 0 40"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height={chartHeight}
                  fill="url(#priceGrid)"
                />

                {/* Price lines */}
                {(selectedCoffeeType === 'robusta' ||
                  selectedCoffeeType === 'both') &&
                  robustaPath && (
                    <path
                      d={robustaPath}
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                  )}
                {(selectedCoffeeType === 'arabica' ||
                  selectedCoffeeType === 'both') &&
                  arabicaPath && (
                    <path
                      d={arabicaPath}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      className="drop-shadow-sm"
                    />
                  )}

                {/* Data points */}
                {filteredData.map((point, index) => {
                  const x = (index / (filteredData.length - 1)) * chartWidth;
                  const minValue = Math.min(
                    ...filteredData.map(d => Math.min(d.robusta, d.arabica))
                  );
                  const maxValue = Math.max(
                    ...filteredData.map(d => Math.max(d.robusta, d.arabica))
                  );
                  const range = maxValue - minValue || 1;

                  return (
                    <g key={`chart-point-${point.date}`}>
                      {(selectedCoffeeType === 'robusta' ||
                        selectedCoffeeType === 'both') && (
                        <circle
                          cx={x}
                          cy={
                            chartHeight -
                            ((point.robusta - minValue) / range) * chartHeight
                          }
                          r="3"
                          fill="#ef4444"
                          className="hover:r-5 cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      )}
                      {(selectedCoffeeType === 'arabica' ||
                        selectedCoffeeType === 'both') && (
                        <circle
                          cx={x}
                          cy={
                            chartHeight -
                            ((point.arabica - minValue) / range) * chartHeight
                          }
                          r="3"
                          fill="#10b981"
                          className="hover:r-5 cursor-pointer transition-all"
                          onMouseEnter={() => setHoveredPoint(point)}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      )}
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {filteredData.map((point, index) => {
                  if (index % Math.ceil(filteredData.length / 6) === 0) {
                    const x = (index / (filteredData.length - 1)) * chartWidth;
                    return (
                      <text
                        key={`x-axis-${point.date}`}
                        x={x}
                        y={chartHeight + 20}
                        textAnchor="middle"
                        className="fill-gray-600 text-xs"
                      >
                        {point.date}
                      </text>
                    );
                  }
                  return null;
                })}
              </svg>

              {/* Hovered point details */}
              {hoveredPoint && (
                <div className="mt-4 rounded-lg border bg-white p-3 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{hoveredPoint.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-600">
                        Robusta: ${hoveredPoint.robusta.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-600">
                        Arabica: ${hoveredPoint.arabica.toFixed(2)}
                      </span>
                    </div>
                    {hoveredPoint.volume && (
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <span className="text-blue-600">
                          Volume: {hoveredPoint.volume}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Price Statistics */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-red-600">
                    Robusta Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="font-medium">
                      ${stats.robusta.current.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Range:</span>
                    <span className="font-medium">
                      ${stats.robusta.min.toFixed(2)} - $
                      {stats.robusta.max.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-medium">
                      ${stats.robusta.avg.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Change:</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${stats.robusta.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {stats.robusta.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stats.robusta.change > 0 ? '+' : ''}
                      {stats.robusta.change.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-600">
                    Arabica Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="font-medium">
                      ${stats.arabica.current.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Range:</span>
                    <span className="font-medium">
                      ${stats.arabica.min.toFixed(2)} - $
                      {stats.arabica.max.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-medium">
                      ${stats.arabica.avg.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Change:</span>
                    <span
                      className={`flex items-center gap-1 font-medium ${stats.arabica.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {stats.arabica.change > 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stats.arabica.change > 0 ? '+' : ''}
                      {stats.arabica.change.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-600">
                    Price Spread
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current:</span>
                    <span className="font-medium">
                      ${stats.spread.current.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Average:</span>
                    <span className="font-medium">
                      ${stats.spread.avg.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Premium:</span>
                    <span className="font-medium">
                      {(
                        (stats.spread.current / stats.robusta.current) *
                        100
                      ).toFixed(1)}
                      %
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-xs text-gray-600">
                      Arabica premium over Robusta
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparison" className="space-y-4">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg bg-red-50 p-3">
                      <div>
                        <div className="font-medium text-red-800">Robusta</div>
                        <div className="text-sm text-red-600">
                          Vietnamese Premium Grade
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-red-600">
                          ${stats.robusta.current.toFixed(2)}
                        </div>
                        <div className="text-sm text-red-500">per lb</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between rounded-lg bg-green-50 p-3">
                      <div>
                        <div className="font-medium text-green-800">
                          Arabica
                        </div>
                        <div className="text-sm text-green-600">
                          Colombian Supremo
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-600">
                          ${stats.arabica.current.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-500">per lb</div>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Price Difference</span>
                        <span className="text-lg font-bold text-blue-600">
                          ${stats.spread.current.toFixed(2)}
                        </span>
                      </div>
                      <div className="mt-1 text-sm text-gray-600">
                        Arabica trades at{' '}
                        {(
                          (stats.spread.current / stats.robusta.current) *
                          100
                        ).toFixed(1)}
                        % premium
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Market Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg bg-yellow-50 p-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-yellow-600" />
                      <div>
                        <div className="font-medium text-yellow-800">
                          Price Volatility
                        </div>
                        <div className="text-sm text-yellow-700">
                          Current market showing{' '}
                          {filteredData[
                            filteredData.length - 1
                          ]?.volatility?.toFixed(1)}
                          % volatility
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-3">
                      <BarChart3 className="mt-0.5 h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium text-blue-800">
                          Trading Volume
                        </div>
                        <div className="text-sm text-blue-700">
                          {filteredData[
                            filteredData.length - 1
                          ]?.volume?.toLocaleString()}{' '}
                          contracts traded
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg bg-green-50 p-3">
                      <TrendingUp className="mt-0.5 h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-green-800">
                          Market Trend
                        </div>
                        <div className="text-sm text-green-700">
                          {stats.robusta.change > 0 && stats.arabica.change > 0
                            ? 'Both varieties trending upward'
                            : stats.robusta.change < 0 &&
                                stats.arabica.change < 0
                              ? 'Both varieties declining'
                              : 'Mixed market conditions'}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {showVolatility && (
            <TabsContent value="volatility" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Price Volatility Analysis</CardTitle>
                  <CardDescription>
                    Understanding market risk and price stability
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        {filteredData.slice(-3).map(point => (
                          <div
                            key={`volatility-${point.date}`}
                            className="text-center"
                          >
                            <div className="text-lg font-bold text-gray-900">
                              {point.volatility?.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600">
                              {point.date}
                            </div>
                            <div
                              className={`mt-1 text-xs ${
                                (point.volatility || 0) > 20
                                  ? 'text-red-600'
                                  : (point.volatility || 0) > 15
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                              }`}
                            >
                              {(point.volatility || 0) > 20
                                ? 'High Risk'
                                : (point.volatility || 0) > 15
                                  ? 'Moderate Risk'
                                  : 'Low Risk'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        <strong>Volatility Interpretation:</strong> Higher
                        volatility indicates greater price uncertainty and risk.
                        Values above 20% suggest high market instability, while
                        values below 15% indicate relatively stable market
                        conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
}
