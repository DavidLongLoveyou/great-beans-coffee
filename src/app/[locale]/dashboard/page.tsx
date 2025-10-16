'use client';

import {  AlertCircle, ArrowUpRight, BarChart3, Bell, DollarSign, Download, FileText, Package, Plus, TrendingUp  } from '@/components/ui/dynamic-icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

interface DashboardPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

// Mock data for dashboard
const mockDashboardData = {
  overview: {
    totalQuotes: 24,
    activeOrders: 8,
    totalSpent: 125000,
    avgOrderValue: 15625,
  },
  recentQuotes: [
    {
      id: 'RFQ-2024-001',
      product: 'Vietnam Robusta Grade 1',
      quantity: '20 MT',
      status: 'pending',
      requestedAt: '2024-01-15',
      expiresAt: '2024-01-22',
    },
    {
      id: 'RFQ-2024-002',
      product: 'Arabica Specialty Blend',
      quantity: '5 MT',
      status: 'quoted',
      requestedAt: '2024-01-14',
      expiresAt: '2024-01-21',
    },
    {
      id: 'RFQ-2024-003',
      product: 'Organic Robusta',
      quantity: '15 MT',
      status: 'approved',
      requestedAt: '2024-01-13',
      expiresAt: '2024-01-20',
    },
  ],
  recentOrders: [
    {
      id: 'ORD-2024-001',
      product: 'Vietnam Robusta Grade 1',
      quantity: '20 MT',
      status: 'shipped',
      orderDate: '2024-01-10',
      deliveryDate: '2024-02-15',
      value: 45000,
    },
    {
      id: 'ORD-2024-002',
      product: 'Arabica Premium',
      quantity: '10 MT',
      status: 'processing',
      orderDate: '2024-01-08',
      deliveryDate: '2024-02-10',
      value: 32000,
    },
  ],
  notifications: [
    {
      id: 1,
      type: 'quote',
      message: 'New quote available for RFQ-2024-002',
      timestamp: '2 hours ago',
      unread: true,
    },
    {
      id: 2,
      type: 'order',
      message: 'Order ORD-2024-001 has been shipped',
      timestamp: '1 day ago',
      unread: false,
    },
    {
      id: 3,
      type: 'alert',
      message: 'Quote RFQ-2024-001 expires in 2 days',
      timestamp: '2 days ago',
      unread: true,
    },
  ],
};

export default function DashboardPage({ params: _params }: DashboardPageProps) {
  const t = useTranslations('dashboard');
  const [activeTab, setActiveTab] = useState('overview');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: t('status.pending') },
      quoted: { variant: 'default' as const, label: t('status.quoted') },
      approved: { variant: 'default' as const, label: t('status.approved') },
      shipped: { variant: 'default' as const, label: t('status.shipped') },
      processing: {
        variant: 'secondary' as const,
        label: t('status.processing'),
      },
      delivered: { variant: 'default' as const, label: t('status.delivered') },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <ContentContainer>
      <ContentSection>
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div>
            <CoffeeHeading
              as="h1"
              className="mb-2 text-xl sm:text-2xl lg:text-3xl"
            >
              {t('title')}
            </CoffeeHeading>
            <p className="text-sm text-gray-600 sm:text-base">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="outline"
              size="sm"
              className="h-9 px-3 sm:h-8 sm:px-4"
            >
              <Bell className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('notifications')}</span>
            </Button>
            <Button size="sm" className="h-9 px-3 sm:h-8 sm:px-4">
              <Plus className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('newQuote')}</span>
              <span className="sm:hidden">Quote</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-4 md:gap-5 lg:grid-cols-4 lg:gap-6">
          <Card data-testid="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-4 sm:pb-2 md:p-6 md:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm md:text-sm">
                {t('stats.totalQuotes')}
              </CardTitle>
              <FileText className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4 md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {mockDashboardData.overview.totalQuotes}
              </div>
              <p className="text-xs text-muted-foreground md:text-xs">
                +2 {t('stats.fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-4 sm:pb-2 md:p-6 md:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm md:text-sm">
                {t('stats.activeOrders')}
              </CardTitle>
              <Package className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4 md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                {mockDashboardData.overview.activeOrders}
              </div>
              <p className="text-xs text-muted-foreground md:text-xs">
                +2 {t('stats.thisWeek')}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-4 sm:pb-2 md:p-6 md:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm md:text-sm">
                {t('stats.totalSpent')}
              </CardTitle>
              <DollarSign className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4 md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                ${mockDashboardData.overview.totalSpent.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground md:text-xs">
                +12% {t('stats.fromLastMonth')}
              </p>
            </CardContent>
          </Card>

          <Card data-testid="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-3 pb-1 sm:p-4 sm:pb-2 md:p-6 md:pb-2">
              <CardTitle className="text-xs font-medium sm:text-sm md:text-sm">
                {t('stats.avgOrderValue')}
              </CardTitle>
              <TrendingUp className="h-3 w-3 text-muted-foreground sm:h-4 sm:w-4 md:h-4 md:w-4" />
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6">
              <div className="text-lg font-bold sm:text-xl md:text-2xl">
                ${mockDashboardData.overview.avgOrderValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground md:text-xs">
                +5% {t('stats.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4 sm:space-y-6"
        >
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4 sm:gap-2 sm:p-1 md:grid-cols-4 md:gap-3 md:p-1.5">
            <TabsTrigger
              value="overview"
              className="px-2 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-sm"
            >
              {t('tabs.overview')}
            </TabsTrigger>
            <TabsTrigger
              value="quotes"
              className="px-2 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-sm"
            >
              {t('tabs.quotes')}
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="px-2 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-sm"
            >
              {t('tabs.orders')}
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="px-2 py-2 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:px-4 sm:py-2.5 sm:text-sm md:px-6 md:py-3 md:text-sm"
            >
              {t('tabs.analytics')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Recent Quotes */}
              <Card className="md:col-span-2 lg:col-span-2">
                <CardHeader>
                  <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                    <CardTitle className="text-base sm:text-lg md:text-xl">
                      {t('recentQuotes.title')}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:text-sm"
                      asChild
                    >
                      <Link href="/dashboard/quotes">
                        {t('viewAll')}
                        <ArrowUpRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {mockDashboardData.recentQuotes.map(quote => (
                      <div
                        key={quote.id}
                        className="flex min-h-[80px] flex-col justify-between space-y-2 rounded-lg border p-3 sm:min-h-[60px] sm:flex-row sm:items-center sm:space-y-0 sm:p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 sm:mb-1">
                            <span className="text-sm font-medium sm:text-sm">
                              {quote.id}
                            </span>
                            {getStatusBadge(quote.status)}
                          </div>
                          <p className="mb-1 text-sm text-gray-600 sm:text-sm">
                            {quote.product}
                          </p>
                          <p className="text-xs text-gray-500 sm:text-xs">
                            {quote.quantity}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-gray-500">
                            {t('expires')}
                          </p>
                          <p className="text-sm font-medium">
                            {quote.expiresAt}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="md:col-span-2 lg:col-span-1">
                <CardHeader>
                  <div className="flex flex-col items-start justify-between space-y-2 sm:flex-row sm:items-center sm:space-y-0">
                    <CardTitle className="text-base sm:text-lg md:text-xl">
                      {t('recentOrders.title')}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-auto px-2 py-1 text-xs sm:px-3 sm:py-2 sm:text-sm md:px-4 md:text-sm"
                      asChild
                    >
                      <Link href="/dashboard/orders">
                        {t('viewAll')}
                        <ArrowUpRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {mockDashboardData.recentOrders.map(order => (
                      <div
                        key={order.id}
                        className="flex min-h-[80px] flex-col justify-between space-y-2 rounded-lg border p-3 sm:min-h-[60px] sm:flex-row sm:items-center sm:space-y-0 sm:p-4"
                      >
                        <div className="flex-1">
                          <div className="mb-1 flex items-center gap-2 sm:mb-1">
                            <span className="text-sm font-medium sm:text-sm">
                              {order.id}
                            </span>
                            {getStatusBadge(order.status)}
                          </div>
                          <p className="mb-1 text-sm text-gray-600 sm:text-sm">
                            {order.product}
                          </p>
                          <p className="text-xs text-gray-500 sm:text-xs">
                            {order.quantity}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="text-sm font-medium">
                            ${order.value.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            {order.deliveryDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {t('notifications')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-3">
                  {mockDashboardData.notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`flex min-h-[60px] items-start gap-3 rounded-lg p-3 sm:p-4 ${notification.unread ? 'bg-blue-50' : 'bg-gray-50'}`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        {notification.type === 'quote' && (
                          <FileText className="h-4 w-4 text-blue-600 sm:h-4 sm:w-4" />
                        )}
                        {notification.type === 'order' && (
                          <Package className="h-4 w-4 text-green-600 sm:h-4 sm:w-4" />
                        )}
                        {notification.type === 'alert' && (
                          <AlertCircle className="h-4 w-4 text-orange-600 sm:h-4 sm:w-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed sm:text-sm">
                          {notification.message}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {notification.timestamp}
                        </p>
                      </div>
                      {notification.unread && (
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600"></div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {t('quotes.title')}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {t('quotes.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center sm:py-8 md:py-10">
                  <FileText className="mx-auto mb-3 h-10 w-10 text-gray-400 sm:mb-4 sm:h-12 sm:w-12 md:mb-5 md:h-14 md:w-14" />
                  <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base md:mb-5 md:text-lg">
                    {t('quotes.comingSoon')}
                  </p>
                  <Button asChild className="w-full sm:w-auto md:px-6 md:py-3">
                    <Link href="/quote">{t('createNewQuote')}</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {t('orders.title')}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {t('orders.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center sm:py-8 md:py-10">
                  <Package className="mx-auto mb-3 h-10 w-10 text-gray-400 sm:mb-4 sm:h-12 sm:w-12 md:mb-5 md:h-14 md:w-14" />
                  <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base md:mb-5 md:text-lg">
                    {t('orders.comingSoon')}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto md:px-6 md:py-3"
                  >
                    {t('viewOrderHistory')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg md:text-xl">
                  {t('analytics.title')}
                </CardTitle>
                <CardDescription className="text-sm md:text-base">
                  {t('analytics.description')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-6 text-center sm:py-8 md:py-10">
                  <BarChart3 className="mx-auto mb-3 h-10 w-10 text-gray-400 sm:mb-4 sm:h-12 sm:w-12 md:mb-5 md:h-14 md:w-14" />
                  <p className="mb-3 text-sm text-gray-600 sm:mb-4 sm:text-base md:mb-5 md:text-lg">
                    {t('analytics.comingSoon')}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto md:px-6 md:py-3"
                  >
                    <Download className="mr-2 h-3 w-3 sm:h-4 sm:w-4 md:h-4 md:w-4" />
                    {t('downloadReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ContentSection>
    </ContentContainer>
  );
}
