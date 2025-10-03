'use client';

import { TrendingUp, TrendingDown, BarChart3, LineChart } from 'lucide-react';
import React, { useState } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

interface MarketDataPoint {
  period: string;
  value: number;
  change?: number;
  label?: string;
}

interface MarketChartProps {
  title: string;
  data: MarketDataPoint[];
  type?: 'line' | 'bar' | 'pie';
  currency?: string;
  unit?: string;
  showTrend?: boolean;
  className?: string;
}

export function MarketChart({
  title,
  data,
  type = 'line',
  currency = 'USD',
  unit = '',
  showTrend = true,
  className = '',
}: MarketChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null);
  const [chartType, setChartType] = useState(type);

  // Calculate chart dimensions and scaling
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;
  const chartHeight = 200;
  const chartWidth = 400;

  // Generate SVG path for line chart
  const generateLinePath = () => {
    if (data.length === 0) return '';

    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y = chartHeight - ((point.value - minValue) / range) * chartHeight;
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  // Generate bars for bar chart
  const generateBars = () => {
    return data.map((point, index) => {
      const barWidth = (chartWidth / data.length) * 0.8;
      const x =
        (index / data.length) * chartWidth +
        (chartWidth / data.length - barWidth) / 2;
      const height = ((point.value - minValue) / range) * chartHeight;
      const y = chartHeight - height;

      return (
        <rect
          key={`bar-${point.period}`}
          x={x}
          y={y}
          width={barWidth}
          height={height}
          fill={
            point.change && point.change > 0
              ? '#10b981'
              : point.change && point.change < 0
                ? '#ef4444'
                : '#3b82f6'
          }
          className="cursor-pointer transition-opacity hover:opacity-80"
          onClick={() => setSelectedPeriod(point.period)}
        />
      );
    });
  };

  // Calculate overall trend
  const lastItem = data[data.length - 1];
  const firstItem = data[0];
  const overallTrend =
    data.length > 1 && lastItem && firstItem && 
    typeof lastItem.value === 'number' && typeof firstItem.value === 'number'
      ? lastItem.value - firstItem.value 
      : 0;
  const trendPercentage =
    data.length > 1 && firstItem && typeof firstItem.value === 'number' && firstItem.value !== 0
      ? (overallTrend / firstItem.value) * 100 
      : 0;

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
            <CardDescription>
              Interactive market data visualization
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={chartType === 'line' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('line')}
            >
              <LineChart className="h-4 w-4" />
            </Button>
            <Button
              variant={chartType === 'bar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setChartType('bar')}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showTrend && (
          <div className="mt-2 flex items-center gap-2">
            <Badge
              variant={overallTrend > 0 ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {overallTrend > 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {trendPercentage.toFixed(1)}%
            </Badge>
            <span className="text-sm text-muted-foreground">
              Overall trend: {overallTrend > 0 ? 'Increasing' : 'Decreasing'}
            </span>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Chart Area */}
          <div className="relative rounded-lg bg-gray-50 p-4">
            <svg
              width="100%"
              height={chartHeight + 40}
              viewBox={`0 0 ${chartWidth} ${chartHeight + 40}`}
              className="overflow-visible"
            >
              {/* Grid lines */}
              <defs>
                <pattern
                  id="grid"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 40 0 L 0 0 0 40"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Chart content */}
              {chartType === 'line' && (
                <>
                  <path
                    d={generateLinePath()}
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    className="drop-shadow-sm"
                  />
                  {/* Data points */}
                  {data.map((point, index) => {
                    const x = (index / (data.length - 1)) * chartWidth;
                    const y =
                      chartHeight -
                      ((point.value - minValue) / range) * chartHeight;
                    return (
                      <circle
                        key={`circle-${point.period}`}
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#3b82f6"
                        className="hover:r-6 cursor-pointer transition-all"
                        onClick={() => setSelectedPeriod(point.period)}
                      />
                    );
                  })}
                </>
              )}

              {chartType === 'bar' && generateBars()}

              {/* X-axis labels */}
              {data.map((point, index) => {
                const x =
                  chartType === 'line'
                    ? (index / (data.length - 1)) * chartWidth
                    : (index / data.length) * chartWidth +
                      chartWidth / data.length / 2;
                return (
                  <text
                    key={`text-${point.period}`}
                    x={x}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    className="fill-gray-600 text-xs"
                  >
                    {point.period}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Data Summary */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currency} {maxValue.toLocaleString()}
                {unit}
              </div>
              <div className="text-sm text-muted-foreground">Peak Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {currency} {minValue.toLocaleString()}
                {unit}
              </div>
              <div className="text-sm text-muted-foreground">Lowest Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currency}{' '}
                {(
                  data.reduce((sum, d) => sum + d.value, 0) / data.length
                ).toFixed(0)}
                {unit}
              </div>
              <div className="text-sm text-muted-foreground">Average</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {data.length}
              </div>
              <div className="text-sm text-muted-foreground">Data Points</div>
            </div>
          </div>

          {/* Selected Period Details */}
          {selectedPeriod && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 font-semibold text-blue-900">
                Period: {selectedPeriod}
              </h4>
              {(() => {
                const selectedData = data.find(
                  d => d.period === selectedPeriod
                );
                if (!selectedData) return null;

                return (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Value: </span>
                      <span className="font-medium">
                        {currency} {selectedData.value.toLocaleString()}
                        {unit}
                      </span>
                    </div>
                    {selectedData.change !== undefined && (
                      <div>
                        <span className="text-blue-700">Change: </span>
                        <span
                          className={`font-medium ${selectedData.change > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {selectedData.change > 0 ? '+' : ''}
                          {selectedData.change.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setSelectedPeriod(null)}
              >
                Close Details
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
