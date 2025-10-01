'use client';

import React from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Area,
  AreaChart,
} from 'recharts';

interface PriceDataPoint {
  date: string;
  robusta: number;
  arabica: number;
  volume?: number;
  volatility?: number;
}

interface PriceAnalysisProps {
  data: PriceDataPoint[];
  title?: string;
  description?: string;
  showVolume?: boolean;
  showVolatility?: boolean;
  currency?: string;
  unit?: string;
  height?: number;
  timeframe?: string;
}

export const PriceAnalysis: React.FC<PriceAnalysisProps> = ({
  data,
  title,
  description,
  showVolume = false,
  showVolatility = false,
  currency = 'USD',
  unit = 'per lb',
  height = 400,
  timeframe = 'Daily',
}) => {
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <p className="mb-2 font-medium text-gray-900">{label}</p>
          {payload.map((entry: any) => (
            <p
              key={`tooltip-${entry.name}`}
              className="flex items-center justify-between text-sm"
              style={{ color: entry.color }}
            >
              <span>{entry.name}:</span>
              <span className="ml-2 font-medium">
                {entry.dataKey === 'volume'
                  ? formatVolume(entry.value)
                  : entry.dataKey === 'volatility'
                    ? `${entry.value.toFixed(2)}%`
                    : formatPrice(entry.value)}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate price statistics
  const latestData = data[data.length - 1];
  const previousData = data[data.length - 2];

  const robustaChange =
    latestData && previousData
      ? ((latestData.robusta - previousData.robusta) / previousData.robusta) *
        100
      : 0;
  const arabicaChange =
    latestData && previousData
      ? ((latestData.arabica - previousData.arabica) / previousData.arabica) *
        100
      : 0;

  const avgRobusta = data.reduce((sum, d) => sum + d.robusta, 0) / data.length;
  const avgArabica = data.reduce((sum, d) => sum + d.arabica, 0) / data.length;

  return (
    <div className="my-8 w-full">
      {title && (
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      )}
      {description && <p className="mb-4 text-gray-600">{description}</p>}

      {/* Price Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Robusta Current
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {latestData ? formatPrice(latestData.robusta) : '--'}
              </p>
            </div>
            <div
              className={`text-sm font-medium ${robustaChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {robustaChange >= 0 ? '↗' : '↘'}{' '}
              {Math.abs(robustaChange).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Arabica Current
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {latestData ? formatPrice(latestData.arabica) : '--'}
              </p>
            </div>
            <div
              className={`text-sm font-medium ${arabicaChange >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {arabicaChange >= 0 ? '↗' : '↘'}{' '}
              {Math.abs(arabicaChange).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Robusta Avg</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(avgRobusta)}
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Arabica Avg</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(avgArabica)}
            </p>
          </div>
        </div>
      </div>

      {/* Price Chart */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4">
          <h4 className="text-lg font-medium text-gray-900">
            Price Trends ({timeframe})
          </h4>
          <p className="text-sm text-gray-600">
            Prices in {currency} {unit}
          </p>
        </div>

        {showVolume || showVolatility ? (
          <ResponsiveContainer width="100%" height={height}>
            <ComposedChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis
                yAxisId="price"
                stroke="#666"
                fontSize={12}
                tickFormatter={formatPrice}
              />
              {showVolume && (
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  stroke="#666"
                  fontSize={12}
                  tickFormatter={formatVolume}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              <Legend />

              {showVolume && (
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="#E5E7EB"
                  name="Volume"
                  opacity={0.6}
                />
              )}

              <Line
                yAxisId="price"
                type="monotone"
                dataKey="robusta"
                stroke="#8B4513"
                strokeWidth={3}
                name="Robusta"
                dot={{ fill: '#8B4513', strokeWidth: 2, r: 3 }}
              />
              <Line
                yAxisId="price"
                type="monotone"
                dataKey="arabica"
                stroke="#D2691E"
                strokeWidth={3}
                name="Arabica"
                dot={{ fill: '#D2691E', strokeWidth: 2, r: 3 }}
              />

              {showVolatility && (
                <Line
                  yAxisId="price"
                  type="monotone"
                  dataKey="volatility"
                  stroke="#DC2626"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Volatility %"
                  dot={false}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <defs>
                <linearGradient
                  id="robustaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#8B4513" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B4513" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient
                  id="arabicaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#D2691E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#D2691E" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={formatPrice} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area
                type="monotone"
                dataKey="robusta"
                stroke="#8B4513"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#robustaGradient)"
                name="Robusta"
              />
              <Area
                type="monotone"
                dataKey="arabica"
                stroke="#D2691E"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#arabicaGradient)"
                name="Arabica"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Price Spread Analysis */}
      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6">
        <h4 className="mb-4 text-lg font-medium text-gray-900">
          Price Spread Analysis
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="text-center">
            <p className="text-sm text-gray-600">Current Spread</p>
            <p className="text-xl font-bold text-gray-900">
              {latestData
                ? formatPrice(latestData.arabica - latestData.robusta)
                : '--'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Average Spread</p>
            <p className="text-xl font-bold text-gray-900">
              {formatPrice(avgArabica - avgRobusta)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Spread Ratio</p>
            <p className="text-xl font-bold text-gray-900">
              {latestData
                ? (latestData.arabica / latestData.robusta).toFixed(2)
                : '--'}
              x
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceAnalysis;
