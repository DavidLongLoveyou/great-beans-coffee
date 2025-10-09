'use client';

import {
  Eye,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Package,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

import { formatDateTime } from '@/lib/date-utils';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { useMarket } from '@/shared/hooks/useMarket';

export interface RFQItem {
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

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

interface RFQListTableProps {
  rfqs: RFQItem[];
  onViewRFQ: (rfq: RFQItem) => void;
  sortConfig: {
    field: string;
    direction: 'asc' | 'desc';
  };
  onSortChange: (config: { field: string; direction: 'asc' | 'desc' }) => void;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  loading?: boolean;
  totalCount: number;
  filteredCount: number;
}

const getStatusConfig = (t: any) => ({
  SUBMITTED: {
    label: t('status.submitted'),
    color: 'bg-blue-100 text-blue-800',
    icon: Clock,
  },
  UNDER_REVIEW: {
    label: t('status.underReview'),
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle,
  },
  QUOTED: {
    label: t('status.quoted'),
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  NEGOTIATING: {
    label: t('status.negotiating'),
    color: 'bg-orange-100 text-orange-800',
    icon: MessageSquare,
  },
  ACCEPTED: {
    label: t('status.accepted'),
    color: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle,
  },
  REJECTED: {
    label: t('status.rejected'),
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
  EXPIRED: {
    label: t('status.expired'),
    color: 'bg-gray-100 text-gray-800',
    icon: Clock,
  },
});

const getPriorityConfig = (t: any) => ({
  LOW: { label: t('priority.low'), color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: t('priority.medium'), color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: t('priority.high'), color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: t('priority.urgent'), color: 'bg-red-100 text-red-800' },
});

export function RFQListTable({
  rfqs,
  onViewRFQ,
  sortConfig,
  onSortChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  loading = false,
  totalCount,
  filteredCount,
}: RFQListTableProps) {
  const t = useTranslations('rfq');
  const { locale, formatCurrency: marketFormatCurrency } = useMarket();

  const statusConfig = getStatusConfig(t);
  const priorityConfig = getPriorityConfig(t);

  // Handle sort
  const handleSort = (field: string) => {
    const direction =
      sortConfig.field === field && sortConfig.direction === 'asc'
        ? 'desc'
        : 'asc';
    onSortChange({ field, direction });
  };

  // Sortable header component
  const SortableHeader = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <TableHead
      className="cursor-pointer select-none hover:bg-gray-50"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortConfig.field === field &&
          (sortConfig.direction === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          ))}
      </div>
    </TableHead>
  );

  const formatDateLocal = (dateString: string) => {
    return formatDateTime(new Date(dateString), locale);
  };

  const formatCurrencyLocal = (amount: number, currency: string) => {
    return marketFormatCurrency(amount);
  };

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon;
    return <Icon className="h-4 w-4" />;
  };

  const isDeadlineUrgent = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffHours =
      (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  const isDeadlineExpired = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    return deadlineDate < now;
  };

  const totalPages = Math.ceil(filteredCount / pagination.pageSize);
  const startItem = (pagination.page - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.page * pagination.pageSize,
    filteredCount
  );

  return (
    <Card>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">{t('table.title')}</CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {t('table.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Desktop Table View */}
        <div className="hidden overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableHeader field="rfqNumber">
                  {t('table.headers.rfqNumber')}
                </SortableHeader>
                <SortableHeader field="productType">
                  {t('table.headers.productCompany')}
                </SortableHeader>
                <SortableHeader field="quantity">
                  {t('table.headers.quantity')}
                </SortableHeader>
                <SortableHeader field="estimatedValue">
                  {t('table.headers.estimatedValue')}
                </SortableHeader>
                <SortableHeader field="status">
                  {t('table.headers.status')}
                </SortableHeader>
                <SortableHeader field="priority">
                  {t('table.headers.priority')}
                </SortableHeader>
                <SortableHeader field="submittedAt">
                  {t('table.headers.submitted')}
                </SortableHeader>
                <SortableHeader field="responseDeadline">
                  {t('table.headers.deadline')}
                </SortableHeader>
                <SortableHeader field="assignedTo">
                  {t('table.headers.assignedTo')}
                </SortableHeader>
                <TableHead className="w-[100px]">
                  {t('table.headers.actions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Loading skeleton
                Array.from({ length: pagination.pageSize }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 10 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : rfqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="mb-4 h-12 w-12 text-gray-400" />
                      <h3 className="mb-2 text-lg font-medium text-gray-900">
                        {t('table.emptyState.title')}
                      </h3>
                      <p className="text-gray-500">
                        {t('table.emptyState.description')}
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() => (window.location.href = '/en/quote')}
                      >
                        {t('table.emptyState.createButton')}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                rfqs.map(rfq => (
                  <TableRow key={rfq.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-mono text-sm">
                          {rfq.rfqNumber}
                        </span>
                        <span className="text-xs text-gray-500">
                          {t('table.labels.updated')}:{' '}
                          {formatDateLocal(rfq.lastUpdate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px]">
                        <p className="truncate font-medium">
                          {rfq.productType}
                        </p>
                        <p className="truncate text-sm text-gray-500">
                          {rfq.companyName}
                        </p>
                        <p className="text-xs text-gray-400">
                          {t('table.labels.contact')}: {rfq.contactPerson}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <span className="font-medium">
                          {rfq.quantity.toLocaleString()}
                        </span>
                        <span className="ml-1 text-sm text-gray-500">
                          {rfq.unit}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {formatCurrencyLocal(rfq.estimatedValue, rfq.currency)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${statusConfig[rfq.status].color} flex w-fit items-center gap-1`}
                      >
                        {getStatusIcon(rfq.status)}
                        {statusConfig[rfq.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityConfig[rfq.priority].color}>
                        {priorityConfig[rfq.priority].label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDateLocal(rfq.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            isDeadlineExpired(rfq.responseDeadline)
                              ? 'font-medium text-red-600'
                              : isDeadlineUrgent(rfq.responseDeadline)
                                ? 'font-medium text-orange-600'
                                : 'text-gray-600'
                          }`}
                        >
                          {formatDateLocal(rfq.responseDeadline)}
                        </span>
                        {isDeadlineExpired(rfq.responseDeadline) && (
                          <span className="text-xs text-red-500">
                            {t('table.labels.expired')}
                          </span>
                        )}
                        {isDeadlineUrgent(rfq.responseDeadline) &&
                          !isDeadlineExpired(rfq.responseDeadline) && (
                            <span className="text-xs text-orange-500">
                              {t('table.labels.urgent')}
                            </span>
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {rfq.assignedTo ? (
                        <div className="flex items-center">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-forest-100 text-xs font-medium text-forest-700">
                            {rfq.assignedTo.charAt(0).toUpperCase()}
                          </div>
                          <span className="ml-2 text-sm">{rfq.assignedTo}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">
                          {t('table.labels.unassigned')}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onViewRFQ(rfq)}
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile Card View */}
        <div className="space-y-4 lg:hidden">
          {loading ? (
            // Loading skeleton for mobile
            Array.from({ length: pagination.pageSize }).map((_, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                    <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>
              </Card>
            ))
          ) : rfqs.length === 0 ? (
            <Card className="p-8">
              <div className="flex flex-col items-center justify-center text-center">
                <Package className="mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  {t('table.emptyState.title')}
                </h3>
                <p className="mb-4 text-gray-500">
                  {t('table.emptyState.description')}
                </p>
                <Button onClick={() => (window.location.href = '/en/quote')}>
                  {t('table.emptyState.createButton')}
                </Button>
              </div>
            </Card>
          ) : (
            rfqs.map(rfq => (
              <Card
                key={rfq.id}
                className="p-4 transition-shadow hover:shadow-md"
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-mono text-sm font-medium">
                        {rfq.rfqNumber}
                      </h3>
                      <p className="truncate text-sm font-medium text-gray-900">
                        {rfq.productType}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {rfq.companyName}
                      </p>
                    </div>
                    <div className="ml-2 flex flex-col items-end gap-1">
                      <Badge
                        className={`${statusConfig[rfq.status].color} text-xs`}
                      >
                        {getStatusIcon(rfq.status)}
                        {statusConfig[rfq.status].label}
                      </Badge>
                      <Badge
                        className={`${priorityConfig[rfq.priority].color} text-xs`}
                      >
                        {priorityConfig[rfq.priority].label}
                      </Badge>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">
                        {t('table.labels.quantity')}:
                      </span>
                      <p className="font-medium">
                        {rfq.quantity.toLocaleString()} {rfq.unit}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {t('table.labels.estimatedValue')}:
                      </span>
                      <p className="font-medium">
                        {formatCurrencyLocal(rfq.estimatedValue, rfq.currency)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {t('table.labels.submitted')}:
                      </span>
                      <p className="text-xs">
                        {formatDateLocal(rfq.submittedAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">
                        {t('table.labels.deadline')}:
                      </span>
                      <p
                        className={`text-xs ${
                          isDeadlineExpired(rfq.responseDeadline)
                            ? 'font-medium text-red-600'
                            : isDeadlineUrgent(rfq.responseDeadline)
                              ? 'font-medium text-orange-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {formatDateLocal(rfq.responseDeadline)}
                        {isDeadlineExpired(rfq.responseDeadline) && (
                          <span className="ml-1 text-red-500">
                            ({t('table.labels.expired')})
                          </span>
                        )}
                        {isDeadlineUrgent(rfq.responseDeadline) &&
                          !isDeadlineExpired(rfq.responseDeadline) && (
                            <span className="ml-1 text-orange-500">
                              ({t('table.labels.urgent')})
                            </span>
                          )}
                      </p>
                    </div>
                  </div>

                  {/* Contact & Assigned */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {t('table.labels.contact')}: {rfq.contactPerson}
                    </span>
                    {rfq.assignedTo ? (
                      <div className="flex items-center">
                        <div className="mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-forest-100 text-xs font-medium text-forest-700">
                          {rfq.assignedTo.charAt(0).toUpperCase()}
                        </div>
                        <span>{rfq.assignedTo}</span>
                      </div>
                    ) : (
                      <span>{t('table.labels.unassigned')}</span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="text-xs text-gray-500">
                      {t('table.labels.updated')}:{' '}
                      {formatDateLocal(rfq.lastUpdate)}
                    </span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewRFQ(rfq)}
                        className="h-8 px-3 text-xs"
                      >
                        <Eye className="mr-1 h-3 w-3" />
                        {t('table.actions.view')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {!loading && rfqs.length > 0 && (
          <div className="flex flex-col items-start justify-between gap-4 border-t pt-4 sm:flex-row sm:items-center">
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">
                  {t('table.pagination.itemsPerPage')}:
                </span>
                <Select
                  value={pagination.pageSize.toString()}
                  onValueChange={value => onPageSizeChange(parseInt(value))}
                >
                  <SelectTrigger className="h-8 w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-xs text-gray-600 sm:text-sm">
                {t('table.pagination.showing', {
                  start: startItem,
                  end: endItem,
                  total: filteredCount,
                })}
                {filteredCount !== totalCount && (
                  <span className="ml-1 text-xs">
                    {t('table.pagination.filtered', { total: totalCount })}
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-1 sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(1)}
                disabled={pagination.page === 1}
                className="h-8 w-8 p-0"
                title={t('table.pagination.firstPage')}
              >
                <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="h-8 w-8 p-0"
                title={t('table.pagination.previousPage')}
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from(
                  {
                    length: Math.min(
                      window.innerWidth < 640 ? 3 : 5,
                      totalPages
                    ),
                  },
                  (_, i) => {
                    let pageNum;
                    const maxPages = window.innerWidth < 640 ? 3 : 5;
                    if (totalPages <= maxPages) {
                      pageNum = i + 1;
                    } else if (
                      pagination.page <=
                      Math.floor(maxPages / 2) + 1
                    ) {
                      pageNum = i + 1;
                    } else if (
                      pagination.page >=
                      totalPages - Math.floor(maxPages / 2)
                    ) {
                      pageNum = totalPages - maxPages + 1 + i;
                    } else {
                      pageNum = pagination.page - Math.floor(maxPages / 2) + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          pagination.page === pageNum ? 'default' : 'outline'
                        }
                        size="sm"
                        onClick={() => onPageChange(pageNum)}
                        className="h-8 w-8 p-0 text-xs sm:text-sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === totalPages}
                className="h-8 w-8 p-0"
                title={t('table.pagination.nextPage')}
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(totalPages)}
                disabled={pagination.page === totalPages}
                className="h-8 w-8 p-0"
                title={t('table.pagination.lastPage')}
              >
                <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
