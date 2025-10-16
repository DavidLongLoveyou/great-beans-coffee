'use client';

import {  TrendingUp, TrendingDown, DollarSign, Package, Globe, Download, RefreshCw, ArrowUpRight, ArrowDownRight, Coffee, Target  } from '@/components/ui/dynamic-icons';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';
import {
  DynamicArea as Area,
  DynamicAreaChart as AreaChart,
  DynamicBar as Bar,
  DynamicBarChart as BarChart,
  DynamicCell as Cell,
  DynamicPie as Pie,
  DynamicPieChart as PieChart,
  DynamicResponsiveContainer as ResponsiveContainer,
  DynamicTooltip as Tooltip,
  DynamicXAxis as XAxis,
  DynamicYAxis as YAxis,
  DynamicLegend as Legend,
} from '@/components/charts/DynamicCharts';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

interface AnalyticsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

// Mock data for analytics
const salesData = [
  { month: 'Jan', revenue: 45000, orders: 12, volume: 240 },
  { month: 'Feb', revenue: 52000, orders: 15, volume: 280 },
  { month: 'Mar', revenue: 48000, orders: 13, volume: 260 },
  { month: 'Apr', revenue: 61000, orders: 18, volume: 320 },
  { month: 'May', revenue: 55000, orders: 16, volume: 300 },
  { month: 'Jun', revenue: 67000, orders: 20, volume: 380 },
];

const productPerformance = [
  { name: 'Vietnam Robusta Grade 1', sales: 45, revenue: 180000, growth: 12.5 },
  { name: 'Arabica Premium', sales: 32, revenue: 128000, growth: 8.3 },
  { name: 'Organic Robusta', sales: 28, revenue: 98000, growth: -2.1 },
  { name: 'Instant Coffee Blend', sales: 25, revenue: 85000, growth: 15.7 },
  { name: 'Premium Arabica', sales: 18, revenue: 72000, growth: 5.2 },
];

const marketDistribution = [
  { name: 'Europe', value: 35, color: '#8884d8' },
  { name: 'North America', value: 28, color: '#82ca9d' },
  { name: 'Asia Pacific', value: 22, color: '#ffc658' },
  { name: 'Middle East', value: 10, color: '#ff7300' },
  { name: 'Others', value: 5, color: '#00ff00' },
];

const customerSegments = [
  { segment: 'Large Roasters', count: 15, revenue: 320000, avgOrder: 21333 },
  { segment: 'Distributors', count: 28, revenue: 280000, avgOrder: 10000 },
  { segment: 'Specialty Cafes', count: 45, revenue: 180000, avgOrder: 4000 },
  { segment: 'Private Label', count: 12, revenue: 150000, avgOrder: 12500 },
];

const topCountries = [
  { country: 'Germany', orders: 25, revenue: 125000, growth: 15.2 },
  { country: 'United States', orders: 22, revenue: 110000, growth: 8.7 },
  { country: 'Japan', orders: 18, revenue: 95000, growth: 12.1 },
  { country: 'Netherlands', orders: 15, revenue: 78000, growth: 6.3 },
  { country: 'Australia', orders: 12, revenue: 65000, growth: -3.2 },
];

export default function AnalyticsPage({ params: _params }: AnalyticsPageProps) {
  const t = useTranslations('analytics');
  const [timeRange, setTimeRange] = useState('6months');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const totalRevenue = useMemo(() => {
    return salesData.reduce((sum, item) => sum + item.revenue, 0);
  }, []);

  const totalOrders = useMemo(() => {
    return salesData.reduce((sum, item) => sum + item.orders, 0);
  }, []);

  const totalVolume = useMemo(() => {
    return salesData.reduce((sum, item) => sum + item.volume, 0);
  }, []);

  const avgOrderValue = useMemo(() => {
    return totalRevenue / totalOrders;
  }, [totalRevenue, totalOrders]);

  return (
    <ContentContainer>
      <ContentSection>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <CoffeeHeading as="h1" className="mb-2">
              {t('title')}
            </CoffeeHeading>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">{t('timeRange.1month')}</SelectItem>
                <SelectItem value="3months">
                  {t('timeRange.3months')}
                </SelectItem>
                <SelectItem value="6months">
                  {t('timeRange.6months')}
                </SelectItem>
                <SelectItem value="1year">{t('timeRange.1year')}</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`}
              />
              {t('refresh')}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('exportReport')}
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('metrics.totalRevenue')}
                  </p>
                  <p className="text-3xl font-bold">
                    ${totalRevenue.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+12.5%</span>
                  </div>
                </div>
                <div className="rounded-full bg-blue-100 p-3">
                  <DollarSign className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('metrics.totalOrders')}
                  </p>
                  <p className="text-3xl font-bold">{totalOrders}</p>
                  <div className="mt-2 flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+8.3%</span>
                  </div>
                </div>
                <div className="rounded-full bg-green-100 p-3">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('metrics.avgOrderValue')}
                  </p>
                  <p className="text-3xl font-bold">
                    ${Math.round(avgOrderValue).toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+3.7%</span>
                  </div>
                </div>
                <div className="rounded-full bg-yellow-100 p-3">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('metrics.totalVolume')}
                  </p>
                  <p className="text-3xl font-bold">{totalVolume} MT</p>
                  <div className="mt-2 flex items-center">
                    <TrendingUp className="mr-1 h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">+15.2%</span>
                  </div>
                </div>
                <div className="rounded-full bg-purple-100 p-3">
                  <Coffee className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="sales" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sales">{t('tabs.sales')}</TabsTrigger>
            <TabsTrigger value="products">{t('tabs.products')}</TabsTrigger>
            <TabsTrigger value="markets">{t('tabs.markets')}</TabsTrigger>
            <TabsTrigger value="customers">{t('tabs.customers')}</TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('charts.revenueOverTime')}</CardTitle>
                  <CardDescription>
                    {t('charts.revenueOverTimeDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={salesData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip
                        formatter={(value: any) => [
                          `$${Number(value).toLocaleString()}`,
                          'Revenue',
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('charts.ordersAndVolume')}</CardTitle>
                  <CardDescription>
                    {t('charts.ordersAndVolumeDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesData}>
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="orders"
                        fill="#82ca9d"
                        name="Orders"
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="volume"
                        fill="#ffc658"
                        name="Volume (MT)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('charts.productPerformance')}</CardTitle>
                <CardDescription>
                  {t('charts.productPerformanceDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productPerformance.map(product => (
                    <div
                      key={product.name}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-gray-600">
                          {product.sales} orders • $
                          {product.revenue.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.growth > 0 ? (
                          <ArrowUpRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4 text-red-600" />
                        )}
                        <span
                          className={`text-sm font-medium ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}
                        >
                          {product.growth > 0 ? '+' : ''}
                          {product.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="markets" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>{t('charts.marketDistribution')}</CardTitle>
                  <CardDescription>
                    {t('charts.marketDistributionDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={marketDistribution}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }: any) => `${name}: ${value}%`}
                      >
                        {marketDistribution.map(entry => (
                          <Cell key={`cell-${entry.name}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('charts.topCountries')}</CardTitle>
                  <CardDescription>
                    {t('charts.topCountriesDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topCountries.map(country => (
                      <div
                        key={country.country}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <Globe className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="font-medium">{country.country}</p>
                            <p className="text-sm text-gray-600">
                              {country.orders} orders
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            ${country.revenue.toLocaleString()}
                          </p>
                          <div className="flex items-center gap-1">
                            {country.growth > 0 ? (
                              <TrendingUp className="h-3 w-3 text-green-600" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-600" />
                            )}
                            <span
                              className={`text-xs ${country.growth > 0 ? 'text-green-600' : 'text-red-600'}`}
                            >
                              {country.growth > 0 ? '+' : ''}
                              {country.growth}%
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('charts.customerSegments')}</CardTitle>
                <CardDescription>
                  {t('charts.customerSegmentsDesc')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {customerSegments.map(segment => (
                    <div
                      key={segment.segment}
                      className="rounded-lg border p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="font-medium">{segment.segment}</h4>
                        <Badge variant="outline">
                          {segment.count} customers
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {t('revenue')}
                          </span>
                          <span className="font-medium">
                            ${segment.revenue.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            {t('avgOrderValue')}
                          </span>
                          <span className="font-medium">
                            ${segment.avgOrder.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ContentSection>
    </ContentContainer>
  );
}
