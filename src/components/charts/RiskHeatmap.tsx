'use client';

import React from 'react';
import { AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface RiskDataPoint {
  region: string;
  category: string;
  riskLevel: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  description?: string;
}

interface RiskHeatmapProps {
  data: RiskDataPoint[];
  title?: string;
  height?: number;
  showLegend?: boolean;
}

const getRiskColor = (riskLevel: number): string => {
  if (riskLevel >= 80) return 'bg-red-500';
  if (riskLevel >= 60) return 'bg-orange-500';
  if (riskLevel >= 40) return 'bg-yellow-500';
  if (riskLevel >= 20) return 'bg-blue-500';
  return 'bg-green-500';
};

const getRiskLabel = (riskLevel: number): string => {
  if (riskLevel >= 80) return 'Critical';
  if (riskLevel >= 60) return 'High';
  if (riskLevel >= 40) return 'Medium';
  if (riskLevel >= 20) return 'Low';
  return 'Minimal';
};

export const RiskHeatmap: React.FC<RiskHeatmapProps> = ({
  data,
  title = 'Risk Assessment Heatmap',
  height: _height = 400,
  showLegend = true,
}) => {
  // Group data by region and category
  const regions = [...new Set(data.map(d => d.region))];
  const categories = [...new Set(data.map(d => d.category))];

  const getRiskData = (region: string, category: string) => {
    return data.find(d => d.region === region && d.category === category);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <span className="text-sm text-gray-600">Risk Assessment</span>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="overflow-x-auto">
          <div
            className="grid gap-1"
            style={{
              gridTemplateColumns: `120px repeat(${categories.length}, 1fr)`,
            }}
          >
            {/* Header row */}
            <div className="p-2"></div>
            {categories.map(category => (
              <div
                key={category}
                className="border-b p-2 text-center text-xs font-medium text-gray-700"
              >
                {category}
              </div>
            ))}

            {/* Data rows */}
            {regions.map(region => (
              <React.Fragment key={region}>
                <div className="border-r p-2 text-xs font-medium text-gray-700">
                  {region}
                </div>
                {categories.map(category => {
                  const riskData = getRiskData(region, category);
                  if (!riskData) {
                    return (
                      <div
                        key={`${region}-${category}`}
                        className="border border-gray-200 bg-gray-100 p-2"
                      >
                        <div className="text-center text-xs text-gray-400">
                          N/A
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${region}-${category}`}
                      className={`group relative cursor-pointer border border-gray-200 p-2 transition-all hover:scale-105 ${getRiskColor(riskData.riskLevel)}`}
                      title={
                        riskData.description ||
                        `${getRiskLabel(riskData.riskLevel)} Risk: ${riskData.riskLevel}%`
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-white">
                          {riskData.riskLevel}%
                        </span>
                        {riskData.trend === 'up' && (
                          <TrendingUp className="h-3 w-3 text-white" />
                        )}
                        {riskData.trend === 'down' && (
                          <TrendingDown className="h-3 w-3 text-white" />
                        )}
                      </div>

                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {getRiskLabel(riskData.riskLevel)} Risk:{' '}
                        {riskData.riskLevel}%
                        {riskData.description && (
                          <div className="text-gray-300">
                            {riskData.description}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>

        {showLegend && (
          <div className="mt-4 border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Risk Level:
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded bg-green-500"></div>
                  <span className="text-xs text-gray-600">Minimal (0-19%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded bg-blue-500"></div>
                  <span className="text-xs text-gray-600">Low (20-39%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded bg-yellow-500"></div>
                  <span className="text-xs text-gray-600">Medium (40-59%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded bg-orange-500"></div>
                  <span className="text-xs text-gray-600">High (60-79%)</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="h-3 w-3 rounded bg-red-500"></div>
                  <span className="text-xs text-gray-600">
                    Critical (80-100%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
