'use client';

import React from 'react';

interface CountryData {
  country: string;
  countryCode: string;
  consumption: number;
  unit: string;
  rank?: number;
  growth?: number;
}

interface ConsumptionMapProps {
  data: CountryData[];
  title?: string;
  description?: string;
  showRankings?: boolean;
  showGrowth?: boolean;
  unit?: string;
  height?: number;
}

export const ConsumptionMap: React.FC<ConsumptionMapProps> = ({
  data,
  title,
  description,
  showRankings = true,
  showGrowth = false,
  unit = 'kg per capita',
  height = 400,
}) => {
  // Sort data by consumption for rankings
  const sortedData = [...data].sort((a, b) => b.consumption - a.consumption);

  const maxConsumption = Math.max(...data.map(d => d.consumption));

  const getIntensityColor = (consumption: number) => {
    const intensity = consumption / maxConsumption;
    if (intensity > 0.8) return '#8B4513'; // Dark coffee brown
    if (intensity > 0.6) return '#A0522D'; // Sienna
    if (intensity > 0.4) return '#CD853F'; // Peru
    if (intensity > 0.2) return '#DEB887'; // Burlywood
    return '#F5DEB3'; // Wheat
  };

  const formatConsumption = (value: number) => {
    return `${value.toLocaleString()} ${unit}`;
  };

  const formatGrowth = (growth: number) => {
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  return (
    <div className="my-8 w-full">
      {title && (
        <h3 className="mb-2 text-xl font-semibold text-gray-900">{title}</h3>
      )}
      {description && <p className="mb-4 text-gray-600">{description}</p>}

      <div className="rounded-lg border border-gray-200 bg-white p-6">
        {/* Map Placeholder - In a real implementation, you would use a proper map library like react-simple-maps */}
        <div
          className="mb-6 flex w-full items-center justify-center rounded-lg bg-gray-100"
          style={{ height: height }}
        >
          <div className="text-center">
            <div className="mb-2 text-4xl">🗺️</div>
            <p className="text-gray-600">Interactive World Map</p>
            <p className="text-sm text-gray-500">
              Coffee Consumption by Country
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-6">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Consumption Intensity
          </h4>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: '#F5DEB3' }}
              ></div>
              <span className="text-xs text-gray-600">Low</span>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: '#DEB887' }}
              ></div>
              <span className="text-xs text-gray-600">Medium</span>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: '#CD853F' }}
              ></div>
              <span className="text-xs text-gray-600">High</span>
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="h-4 w-4 rounded"
                style={{ backgroundColor: '#8B4513' }}
              ></div>
              <span className="text-xs text-gray-600">Very High</span>
            </div>
          </div>
        </div>

        {/* Data Table */}
        {showRankings && (
          <div>
            <h4 className="mb-4 text-lg font-medium text-gray-900">
              Top Coffee Consuming Countries
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Rank
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Consumption
                    </th>
                    {showGrowth && (
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Growth
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Intensity
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {sortedData.slice(0, 10).map((country, index) => (
                    <tr key={country.countryCode} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <span className="mr-2 text-2xl">
                            {country.countryCode}
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            {country.country}
                          </span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {formatConsumption(country.consumption)}
                      </td>
                      {showGrowth && country.growth !== undefined && (
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              country.growth >= 0
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {formatGrowth(country.growth)}
                          </span>
                        </td>
                      )}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center">
                          <div
                            className="h-4 w-8 rounded"
                            style={{
                              backgroundColor: getIntensityColor(
                                country.consumption
                              ),
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsumptionMap;
