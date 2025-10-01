'use client';

import { Globe, Coffee, TrendingUp, Users, MapPin } from 'lucide-react';
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

interface CountryData {
  code: string;
  name: string;
  consumption: number; // kg per capita per year
  totalConsumption: number; // million bags
  growth: number; // percentage
  population: number; // millions
  marketValue: number; // billion USD
}

interface ConsumptionMapProps {
  title?: string;
  data: CountryData[];
  metric?: 'perCapita' | 'total' | 'growth' | 'marketValue';
  className?: string;
}

const defaultData: CountryData[] = [
  {
    code: 'US',
    name: 'United States',
    consumption: 4.2,
    totalConsumption: 27.5,
    growth: 2.1,
    population: 331,
    marketValue: 45.2,
  },
  {
    code: 'BR',
    name: 'Brazil',
    consumption: 6.1,
    totalConsumption: 22.7,
    growth: 1.8,
    population: 215,
    marketValue: 8.9,
  },
  {
    code: 'DE',
    name: 'Germany',
    consumption: 8.4,
    totalConsumption: 9.2,
    growth: 0.5,
    population: 83,
    marketValue: 12.1,
  },
  {
    code: 'JP',
    name: 'Japan',
    consumption: 3.6,
    totalConsumption: 7.1,
    growth: -0.3,
    population: 125,
    marketValue: 15.8,
  },
  {
    code: 'IT',
    name: 'Italy',
    consumption: 5.9,
    totalConsumption: 5.8,
    growth: 0.8,
    population: 60,
    marketValue: 8.7,
  },
  {
    code: 'FR',
    name: 'France',
    consumption: 5.4,
    totalConsumption: 5.5,
    growth: 1.2,
    population: 68,
    marketValue: 7.9,
  },
  {
    code: 'CA',
    name: 'Canada',
    consumption: 6.5,
    totalConsumption: 4.8,
    growth: 2.8,
    population: 38,
    marketValue: 6.2,
  },
  {
    code: 'NL',
    name: 'Netherlands',
    consumption: 8.3,
    totalConsumption: 2.4,
    growth: 1.5,
    population: 17,
    marketValue: 3.1,
  },
  {
    code: 'FI',
    name: 'Finland',
    consumption: 12.0,
    totalConsumption: 1.1,
    growth: 0.2,
    population: 5.5,
    marketValue: 1.2,
  },
  {
    code: 'NO',
    name: 'Norway',
    consumption: 9.9,
    totalConsumption: 0.9,
    growth: 1.1,
    population: 5.4,
    marketValue: 1.8,
  },
];

export function ConsumptionMap({
  title = 'Global Coffee Consumption Map',
  data = defaultData,
  metric = 'perCapita',
  className = '',
}: ConsumptionMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(
    null
  );
  const [currentMetric, setCurrentMetric] = useState(metric);

  // Get value based on current metric
  const getValue = (country: CountryData) => {
    switch (currentMetric) {
      case 'perCapita':
        return country.consumption;
      case 'total':
        return country.totalConsumption;
      case 'growth':
        return country.growth;
      case 'marketValue':
        return country.marketValue;
      default:
        return country.consumption;
    }
  };

  // Get color intensity based on value
  const getColorIntensity = (country: CountryData) => {
    const value = getValue(country);
    const maxValue = Math.max(...data.map(getValue));
    const intensity = value / maxValue;

    if (currentMetric === 'growth') {
      return value > 0
        ? `rgba(34, 197, 94, ${intensity})`
        : `rgba(239, 68, 68, ${Math.abs(intensity)})`;
    }

    return `rgba(59, 130, 246, ${intensity * 0.8 + 0.2})`;
  };

  // Get unit for current metric
  const getUnit = () => {
    switch (currentMetric) {
      case 'perCapita':
        return 'kg/capita/year';
      case 'total':
        return 'million bags';
      case 'growth':
        return '% growth';
      case 'marketValue':
        return 'billion USD';
      default:
        return '';
    }
  };

  // Sort data by current metric
  const sortedData = [...data].sort((a, b) => getValue(b) - getValue(a));

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {title}
            </CardTitle>
            <CardDescription>
              Interactive visualization of global coffee consumption patterns
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={currentMetric === 'perCapita' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMetric('perCapita')}
            >
              Per Capita
            </Button>
            <Button
              variant={currentMetric === 'total' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMetric('total')}
            >
              Total Volume
            </Button>
            <Button
              variant={currentMetric === 'growth' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMetric('growth')}
            >
              Growth Rate
            </Button>
            <Button
              variant={currentMetric === 'marketValue' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrentMetric('marketValue')}
            >
              Market Value
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* World Map Visualization (Simplified) */}
          <div className="rounded-lg bg-gray-50 p-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {data.map(country => (
                <div
                  key={country.code}
                  className="relative cursor-pointer transition-all hover:scale-105"
                  onClick={() => setSelectedCountry(country)}
                >
                  <div
                    className="flex h-16 items-center justify-center rounded-lg border-2 border-gray-200 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
                    style={{ backgroundColor: getColorIntensity(country) }}
                  >
                    <div className="text-center">
                      <div className="text-xs font-bold">{country.code}</div>
                      <div className="text-xs">
                        {getValue(country).toFixed(1)}
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="rounded bg-white px-1 text-xs text-gray-600">
                      {country.name.split(' ')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className="text-sm text-gray-600">Low</span>
              <div className="flex gap-1">
                {[0.2, 0.4, 0.6, 0.8, 1.0].map(intensity => (
                  <div
                    key={intensity}
                    className="h-4 w-6 rounded"
                    style={{
                      backgroundColor:
                        currentMetric === 'growth'
                          ? `rgba(59, 130, 246, ${intensity})`
                          : `rgba(59, 130, 246, ${intensity})`,
                    }}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">High</span>
              <Badge variant="outline" className="ml-4">
                {getUnit()}
              </Badge>
            </div>
          </div>

          {/* Top Countries Ranking */}
          <div>
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
              <TrendingUp className="h-5 w-5" />
              Top Countries by{' '}
              {currentMetric.replace(/([A-Z])/g, ' $1').toLowerCase()}
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {sortedData.slice(0, 6).map((country, index) => (
                <div
                  key={country.code}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                  onClick={() => setSelectedCountry(country)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{country.name}</div>
                      <div className="text-sm text-gray-600">
                        {getValue(country).toFixed(1)} {getUnit()}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={getValue(country) > 0 ? 'default' : 'destructive'}
                  >
                    {country.growth > 0 ? '+' : ''}
                    {country.growth}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Country Details */}
          {selectedCountry && (
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-xl font-bold text-blue-900">
                  <MapPin className="h-5 w-5" />
                  {selectedCountry.name}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCountry(null)}
                >
                  Close
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-2xl font-bold text-blue-600">
                    <Coffee className="h-5 w-5" />
                    {selectedCountry.consumption}
                  </div>
                  <div className="text-sm text-blue-700">
                    kg per capita/year
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedCountry.totalConsumption}M
                  </div>
                  <div className="text-sm text-green-700">
                    Million bags total
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className={`text-2xl font-bold ${selectedCountry.growth > 0 ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {selectedCountry.growth > 0 ? '+' : ''}
                    {selectedCountry.growth}%
                  </div>
                  <div className="text-sm text-gray-600">Annual growth</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ${selectedCountry.marketValue}B
                  </div>
                  <div className="text-sm text-purple-700">Market value</div>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-white p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-600" />
                  <span className="text-sm font-medium">Market Insights</span>
                </div>
                <p className="text-sm text-gray-700">
                  With a population of {selectedCountry.population} million,{' '}
                  {selectedCountry.name} represents a{' '}
                  {selectedCountry.growth > 2
                    ? 'rapidly growing'
                    : selectedCountry.growth > 0
                      ? 'stable growing'
                      : 'mature'}
                  coffee market. The per capita consumption of{' '}
                  {selectedCountry.consumption} kg/year
                  {selectedCountry.consumption > 8
                    ? ' indicates a strong coffee culture'
                    : selectedCountry.consumption > 5
                      ? ' shows moderate coffee adoption'
                      : ' suggests potential for market growth'}
                  .
                </p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
