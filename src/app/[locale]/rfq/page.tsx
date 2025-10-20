'use client';

import {
  Package,
  Clock,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
} from '@/components/ui/icons';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { formatDateTime } from '@/lib/date-utils';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { RFQDetailModal } from '@/presentation/components/rfq/RFQDetailModal';
import { RFQListFilters } from '@/presentation/components/rfq/RFQListFilters';
import { RFQListTable } from '@/presentation/components/rfq/RFQListTable';
import { Button } from '@/presentation/components/ui/button';
import { Card, CardContent } from '@/presentation/components/ui/card';
import { useRFQList } from '@/presentation/hooks/useRFQList';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';
import { useMarket } from '@/shared/hooks/useMarket';

interface RFQItem {
  id: string;
  rfqNumber: string;
  status:
    | 'SUBMITTED'
    | 'UNDER_REVIEW'
    | 'QUOTED'
    | 'NEGOTIATING'
    | 'ACCEPTED'
    | 'REJECTED'
    | 'EXPIRED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  productType: string;
  quantity: number;
  unit: string;
  estimatedValue: number;
  currency: string;
  submittedAt: string;
  lastUpdate: string;
  responseDeadline: string;
  assignedTo?: string;
  companyName: string;
  contactPerson: string;
}

// Mock data - will be replaced with real API calls
const mockRFQs: RFQItem[] = [
  {
    id: '1',
    rfqNumber: 'RFQ-2024-001',
    status: 'QUOTED',
    priority: 'HIGH',
    productType: 'Premium Robusta Grade 1',
    quantity: 50,
    unit: 'MT',
    estimatedValue: 142500,
    currency: 'USD',
    submittedAt: '2024-01-15T10:30:00Z',
    lastUpdate: '2024-01-16T14:20:00Z',
    responseDeadline: '2024-01-20T23:59:59Z',
    assignedTo: 'Sarah Chen',
    companyName: 'Global Coffee Imports Ltd',
    contactPerson: 'John Smith',
  },
  {
    id: '2',
    rfqNumber: 'RFQ-2024-002',
    status: 'UNDER_REVIEW',
    priority: 'MEDIUM',
    productType: 'Specialty Arabica Washed',
    quantity: 20,
    unit: 'MT',
    estimatedValue: 84000,
    currency: 'USD',
    submittedAt: '2024-01-16T09:15:00Z',
    lastUpdate: '2024-01-16T09:15:00Z',
    responseDeadline: '2024-01-21T23:59:59Z',
    companyName: 'European Roasters Co',
    contactPerson: 'Maria Garcia',
  },
  {
    id: '3',
    rfqNumber: 'RFQ-2024-003',
    status: 'NEGOTIATING',
    priority: 'URGENT',
    productType: 'Robusta Grade 2 Honey',
    quantity: 100,
    unit: 'MT',
    estimatedValue: 265000,
    currency: 'USD',
    submittedAt: '2024-01-14T16:45:00Z',
    lastUpdate: '2024-01-17T11:30:00Z',
    responseDeadline: '2024-01-19T23:59:59Z',
    assignedTo: 'David Kim',
    companyName: 'Asia Pacific Trading',
    contactPerson: 'Hiroshi Tanaka',
  },
];

const statusConfig = {
  SUBMITTED: {
    label: 'Submitted',
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: 'Under Review',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  QUOTED: {
    label: 'Quoted',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  NEGOTIATING: {
    label: 'Negotiating',
    color: 'bg-orange-100 text-orange-800',
    icon: MessageSquare,
  },
  ACCEPTED: {
    label: 'Accepted',
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle,
  },
  REJECTED: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  EXPIRED: {
    label: 'Expired',
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
  },
};

const _priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
};

export default function RFQTrackingPage() {
  const t = useTranslations('rfq');
  const router = useRouter();
  const params = useParams();
  const { locale, formatCurrency: marketFormatCurrency } = useMarket();

  // Use the RFQ list hook
  const {
    filteredRFQs,
    paginatedRFQs,
    filters,
    setFilters,
    resetFilters,
    sortConfig,
    setSortConfig,
    pagination,
    setPage,
    setPageSize,
    totalCount,
    filteredCount,
    loading,
    setLoading,
  } = useRFQList({
    initialData: mockRFQs,
    initialPageSize: 25,
  });

  const [selectedRFQ, setSelectedRFQ] = useState<RFQItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Handle refresh
  const handleRefresh = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const _formatDateLocal = (dateString: string) => {
    return formatDateTime(new Date(dateString), locale);
  };

  const formatCurrencyLocal = (amount: number, _currency: string) => {
    return marketFormatCurrency(amount);
  };

  const _getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon;
    return <Icon className="h-4 w-4" />;
  };

  const handleViewRFQ = (rfq: RFQItem) => {
    // Navigate to detail page
    router.push(`/${params.locale}/rfq/${rfq.id}`);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRFQ(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      {/* Dashboard Content */}
      <ContentSection className="py-12">
        <ContentContainer>
          {/* Header with Actions */}
          <div className="mb-6 sm:mb-8">
            <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <SectionHeading className="text-xl sm:text-2xl lg:text-3xl">
                  {t('page.title')}
                </SectionHeading>
                <p className="text-sm text-gray-600 sm:text-base">
                  {t('page.description')}
                </p>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
                  />
                  <span>{t('page.refresh')}</span>
                </Button>
                <Button
                  onClick={() => (window.location.href = '/en/quote')}
                  className="flex w-full items-center justify-center gap-2 sm:w-auto"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t('page.newRfq')}</span>
                </Button>
              </div>
            </div>
          </div>
          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {t('page.summaryCards.totalRfqs')}
                    </p>
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {totalCount}
                    </p>
                  </div>
                  <Package className="h-6 w-6 flex-shrink-0 text-forest-600 sm:h-8 sm:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {t('page.summaryCards.activeQuotes')}
                    </p>
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {
                        filteredRFQs.filter(rfq =>
                          ['QUOTED', 'NEGOTIATING'].includes(rfq.status)
                        ).length
                      }
                    </p>
                  </div>
                  <MessageSquare className="h-6 w-6 flex-shrink-0 text-green-600 sm:h-8 sm:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {t('page.summaryCards.pendingReview')}
                    </p>
                    <p className="text-xl font-bold text-gray-900 sm:text-2xl">
                      {
                        filteredRFQs.filter(rfq =>
                          ['SUBMITTED', 'UNDER_REVIEW'].includes(rfq.status)
                        ).length
                      }
                    </p>
                  </div>
                  <Clock className="h-6 w-6 flex-shrink-0 text-yellow-600 sm:h-8 sm:w-8" />
                </div>
              </CardContent>
            </Card>

            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-600 sm:text-sm">
                      {t('page.summaryCards.totalValue')}
                    </p>
                    <p className="truncate text-lg font-bold text-gray-900 sm:text-2xl">
                      {formatCurrencyLocal(
                        filteredRFQs.reduce(
                          (sum, rfq) => sum + rfq.estimatedValue,
                          0
                        ),
                        'USD'
                      )}
                    </p>
                  </div>
                  <ArrowUpRight className="h-6 w-6 flex-shrink-0 text-blue-600 sm:h-8 sm:w-8" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <RFQListFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={resetFilters}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            loading={loading}
            filteredCount={filteredCount}
            totalCount={totalCount}
          />

          {/* RFQ Table */}
          <RFQListTable
            rfqs={paginatedRFQs}
            onViewRFQ={handleViewRFQ}
            sortConfig={sortConfig}
            onSortChange={setSortConfig}
            pagination={pagination}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            loading={loading}
            totalCount={totalCount}
            filteredCount={filteredCount}
          />
        </ContentContainer>
      </ContentSection>

      {/* RFQ Detail Modal */}
      {selectedRFQ && (
        <RFQDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseModal}
          rfq={selectedRFQ}
        />
      )}
    </div>
  );
}
