'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface MarketDataPoint {
  period: string;
  value: number;
  label?: string;
  category?: string;
}

interface MarketChartProps {
  data: MarketDataPoint[];
  type?: 'line' | 'bar' | 'pie';
  title?: string;
  description?: string;
  xAxisKey?: string;
  yAxisKey?: string;
  height?: number;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  currency?: string;
  unit?: string;
}

const defaultColors = [
  '#8B4513', // Coffee Brown
  '#D2691E', // Chocolate
  '#CD853F', // Peru
  '#DEB887', // Burlywood
  '#F4A460', // Sandy Brown
  '#DAA520', // Goldenrod
];

export const MarketChart: React.FC<MarketChartProps> = ({
  data,
  type = 'line',
  title,
  description,
  xAxisKey = 'period',
  yAxisKey = 'value',
  height = 400,
  colors = defaultColors,
  showLegend = true,
  showGrid = true,
  currency,
  unit,
}) => {
  const formatValue = (value: number) => {
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }

    if (unit) {
      return `${value.toLocaleString()} ${unit}`;
    }

    return value.toLocaleString();
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry: any) => (
            <p
              key={`tooltip-${entry.name}`}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {formatValue(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              )}
              <XAxis dataKey={xAxisKey} stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={formatValue} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Bar dataKey={yAxisKey} fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey={yAxisKey}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
            </PieChart>
          </ResponsiveContainer>
        );

      default: // line
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              {showGrid && (
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              )}
              <XAxis dataKey={xAxisKey} stroke="#666" fontSize={12} />
              <YAxis stroke="#666" fontSize={12} tickFormatter={formatValue} />
              <Tooltip content={<CustomTooltip />} />
              {showLegend && <Legend />}
              <Line
                type="monotone"
                dataKey={yAxisKey}
                stroke={colors[0]}
                strokeWidth={3}
                dot={{ fill: colors[0], strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors[0], strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="my-8 w-full">
      {title && (
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      )}
      {description && <p className="mb-4 text-gray-600">{description}</p>}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {renderChart()}
      </div>
    </div>
  );
};

export default MarketChart;
