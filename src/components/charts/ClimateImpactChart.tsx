'use client';

import React, { useState } from 'react';
import {
  DynamicLine as Line,
  DynamicXAxis as XAxis,
  DynamicYAxis as YAxis,
  DynamicCartesianGrid as CartesianGrid,
  DynamicTooltip as Tooltip,
  DynamicLegend as Legend,
  DynamicResponsiveContainer as ResponsiveContainer,
  DynamicAreaChart as AreaChart,
  DynamicArea as Area,
  DynamicBarChart as BarChart,
  DynamicBar as Bar,
  DynamicComposedChart as ComposedChart,
} from '@/components/charts/DynamicCharts';
import {  Thermometer, CloudRain, Wind, AlertTriangle, TrendingUp, TrendingDown  } from '@/components/ui/dynamic-icons';

interface ClimateDataPoint {
  period: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  windSpeed?: number;
  extremeEvents?: number;
  yieldImpact?: number; // percentage impact on yield
  qualityScore?: number; // 0-100
}

interface ClimateImpactChartProps {
  data: ClimateDataPoint[];
  title?: string;
  height?: number;
  showPredictions?: boolean;
  region?: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    unit?: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
        <p className="font-medium text-gray-900">{`Period: ${label}`}</p>
        {payload.map((entry, index) => (
          <p
            key={`tooltip-${entry.name || index}`}
            className="text-sm"
            style={{ color: entry.color }}
          >
            {`${entry.name}: ${entry.value}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export const ClimateImpactChart: React.FC<ClimateImpactChartProps> = ({
  data,
  title = 'Climate Impact Analysis',
  height = 400,
  showPredictions = false,
  region = 'Global',
}) => {
  const [activeView, setActiveView] = useState<
    'overview' | 'temperature' | 'precipitation' | 'impact'
  >('overview');

  // Calculate climate trends
  const temperatureTrend =
    data.length > 1 && data[0] && data[data.length - 1]
      ? ((data[data.length - 1]!.temperature - data[0]!.temperature) /
          data[0]!.temperature) *
        100
      : 0;

  const precipitationTrend =
    data.length > 1 && data[0] && data[data.length - 1]
      ? ((data[data.length - 1]!.precipitation - data[0]!.precipitation) /
          data[0]!.precipitation) *
        100
      : 0;

  const averageYieldImpact =
    data.reduce((sum, d) => sum + (d.yieldImpact || 0), 0) / data.length;
  const averageQualityScore =
    data.reduce((sum, d) => sum + (d.qualityScore || 0), 0) / data.length;

  const renderOverviewChart = () => (
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#666" />
      <YAxis
        yAxisId="temp"
        orientation="left"
        tick={{ fontSize: 12 }}
        stroke="#666"
        label={{
          value: 'Temperature (°C)',
          angle: -90,
          position: 'insideLeft',
        }}
      />
      <YAxis
        yAxisId="precip"
        orientation="right"
        tick={{ fontSize: 12 }}
        stroke="#666"
        label={{
          value: 'Precipitation (mm)',
          angle: 90,
          position: 'insideRight',
        }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Area
        yAxisId="temp"
        type="monotone"
        dataKey="temperature"
        stroke="#ef4444"
        fill="#ef4444"
        fillOpacity={0.3}
        name="Temperature"
      />
      <Bar
        yAxisId="precip"
        dataKey="precipitation"
        fill="#3b82f6"
        name="Precipitation"
        opacity={0.7}
      />
      {data.some(d => d.extremeEvents) && (
        <Line
          yAxisId="temp"
          type="monotone"
          dataKey="extremeEvents"
          stroke="#f59e0b"
          strokeWidth={2}
          dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
          name="Extreme Events"
        />
      )}
    </ComposedChart>
  );

  const renderTemperatureChart = () => (
    <AreaChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#666" />
      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Area
        type="monotone"
        dataKey="temperature"
        stroke="#ef4444"
        fill="#ef4444"
        fillOpacity={0.6}
        name="Temperature (°C)"
      />
      <Area
        type="monotone"
        dataKey="humidity"
        stroke="#06b6d4"
        fill="#06b6d4"
        fillOpacity={0.4}
        name="Humidity (%)"
      />
    </AreaChart>
  );

  const renderPrecipitationChart = () => (
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#666" />
      <YAxis tick={{ fontSize: 12 }} stroke="#666" />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar dataKey="precipitation" fill="#3b82f6" name="Precipitation (mm)" />
    </BarChart>
  );

  const renderImpactChart = () => (
    <ComposedChart data={data}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
      <XAxis dataKey="period" tick={{ fontSize: 12 }} stroke="#666" />
      <YAxis
        yAxisId="yield"
        orientation="left"
        tick={{ fontSize: 12 }}
        stroke="#666"
        label={{
          value: 'Yield Impact (%)',
          angle: -90,
          position: 'insideLeft',
        }}
      />
      <YAxis
        yAxisId="quality"
        orientation="right"
        tick={{ fontSize: 12 }}
        stroke="#666"
        label={{ value: 'Quality Score', angle: 90, position: 'insideRight' }}
      />
      <Tooltip content={<CustomTooltip />} />
      <Legend />
      <Bar
        yAxisId="yield"
        dataKey="yieldImpact"
        fill="#ef4444"
        name="Yield Impact (%)"
      />
      <Line
        yAxisId="quality"
        type="monotone"
        dataKey="qualityScore"
        stroke="#10b981"
        strokeWidth={3}
        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
        name="Quality Score"
      />
    </ComposedChart>
  );

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">Region: {region}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Climate indicators */}
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm text-gray-600">
              {temperatureTrend > 0 ? '+' : ''}
              {temperatureTrend.toFixed(1)}%
            </span>
            {temperatureTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-blue-500" />
            )}
          </div>
          <div className="flex items-center space-x-2">
            <CloudRain className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-gray-600">
              {precipitationTrend > 0 ? '+' : ''}
              {precipitationTrend.toFixed(1)}%
            </span>
            {precipitationTrend > 0 ? (
              <TrendingUp className="h-4 w-4 text-blue-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* View selector */}
      <div className="flex space-x-2 border-b border-gray-200">
        {[
          { key: 'overview', label: 'Overview', icon: Wind },
          { key: 'temperature', label: 'Temperature', icon: Thermometer },
          { key: 'precipitation', label: 'Precipitation', icon: CloudRain },
          { key: 'impact', label: 'Impact', icon: AlertTriangle },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() =>
              setActiveView(
                key as 'overview' | 'temperature' | 'precipitation' | 'impact'
              )
            }
            className={`flex items-center space-x-2 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
              activeView === key
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Chart container */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <ResponsiveContainer width="100%" height={height}>
          {activeView === 'overview'
            ? renderOverviewChart()
            : activeView === 'temperature'
              ? renderTemperatureChart()
              : activeView === 'precipitation'
                ? renderPrecipitationChart()
                : renderImpactChart()}
        </ResponsiveContainer>
      </div>

      {/* Summary metrics */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center space-x-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-gray-700">
              Avg Temperature
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(
              data.reduce((sum, d) => sum + d.temperature, 0) / data.length
            ).toFixed(1)}
            °C
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-3">
          <div className="flex items-center space-x-2">
            <CloudRain className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">
              Avg Precipitation
            </span>
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {(
              data.reduce((sum, d) => sum + d.precipitation, 0) / data.length
            ).toFixed(0)}
            mm
          </p>
        </div>

        {data.some(d => d.yieldImpact !== undefined) && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                Yield Impact
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {averageYieldImpact.toFixed(1)}%
            </p>
          </div>
        )}

        {data.some(d => d.qualityScore !== undefined) && (
          <div className="rounded-lg border border-gray-200 bg-white p-3">
            <div className="flex items-center space-x-2">
              <Wind className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-700">
                Quality Score
              </span>
            </div>
            <p className="text-lg font-semibold text-gray-900">
              {averageQualityScore.toFixed(0)}/100
            </p>
          </div>
        )}
      </div>

      {showPredictions && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="mb-2 flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Climate Predictions
            </span>
          </div>
          <p className="text-sm text-yellow-700">
            Based on current trends, temperature is expected to continue rising
            by {Math.abs(temperatureTrend).toFixed(1)}% annually, while
            precipitation patterns show{' '}
            {precipitationTrend > 0 ? 'increasing' : 'decreasing'} volatility.
            This may impact coffee quality and yield in the coming seasons.
          </p>
        </div>
      )}
    </div>
  );
};
