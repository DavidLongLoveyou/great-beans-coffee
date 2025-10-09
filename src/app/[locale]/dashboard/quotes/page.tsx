'use client';

import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useMemo } from 'react';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
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
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

interface QuotesPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface Quote {
  id: string;
  product: string;
  quantity: string;
  status: 'pending' | 'quoted' | 'approved' | 'rejected' | 'expired';
  requestedAt: string;
  expiresAt: string;
  quotedPrice?: number;
  estimatedDelivery?: string;
  supplier: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
}

// Mock data for quotes
const mockQuotes: Quote[] = [
  {
    id: 'RFQ-2024-001',
    product: 'Vietnam Robusta Grade 1',
    quantity: '20 MT',
    status: 'pending',
    requestedAt: '2024-01-15',
    expiresAt: '2024-01-22',
    supplier: 'The Great Beans',
    priority: 'high',
    notes: 'Urgent order for Q1 production',
  },
  {
    id: 'RFQ-2024-002',
    product: 'Arabica Specialty Blend',
    quantity: '5 MT',
    status: 'quoted',
    requestedAt: '2024-01-14',
    expiresAt: '2024-01-21',
    quotedPrice: 4500,
    estimatedDelivery: '2024-02-15',
    supplier: 'The Great Beans',
    priority: 'medium',
  },
  {
    id: 'RFQ-2024-003',
    product: 'Organic Robusta',
    quantity: '15 MT',
    status: 'approved',
    requestedAt: '2024-01-13',
    expiresAt: '2024-01-20',
    quotedPrice: 3200,
    estimatedDelivery: '2024-02-10',
    supplier: 'The Great Beans',
    priority: 'medium',
  },
  {
    id: 'RFQ-2024-004',
    product: 'Premium Arabica',
    quantity: '8 MT',
    status: 'rejected',
    requestedAt: '2024-01-12',
    expiresAt: '2024-01-19',
    quotedPrice: 5800,
    supplier: 'The Great Beans',
    priority: 'low',
    notes: 'Price too high for current budget',
  },
  {
    id: 'RFQ-2024-005',
    product: 'Instant Coffee Blend',
    quantity: '12 MT',
    status: 'expired',
    requestedAt: '2024-01-10',
    expiresAt: '2024-01-17',
    supplier: 'The Great Beans',
    priority: 'low',
  },
];

export default function QuotesPage({ params: _params }: QuotesPageProps) {
  const t = useTranslations('quotes');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('requestedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedQuotes = useMemo(() => {
    let filtered = mockQuotes.filter(quote => {
      const matchesSearch =
        quote.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || quote.status === statusFilter;
      const matchesPriority =
        priorityFilter === 'all' || quote.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date = a[sortBy as keyof Quote];
      let bValue: string | number | Date = b[sortBy as keyof Quote];

      if (sortBy === 'requestedAt' || sortBy === 'expiresAt') {
        aValue = new Date(aValue as string);
        bValue = new Date(bValue as string);
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, priorityFilter, sortBy, sortOrder]);

  const getStatusIcon = (status: Quote['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'quoted':
        return <FileText className="h-4 w-4" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      case 'expired':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Quote['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: t('status.pending') },
      quoted: { variant: 'default' as const, label: t('status.quoted') },
      approved: { variant: 'default' as const, label: t('status.approved') },
      rejected: {
        variant: 'destructive' as const,
        label: t('status.rejected'),
      },
      expired: { variant: 'outline' as const, label: t('status.expired') },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPriorityBadge = (priority: Quote['priority']) => {
    const priorityConfig = {
      low: { variant: 'outline' as const, label: t('priority.low') },
      medium: { variant: 'secondary' as const, label: t('priority.medium') },
      high: { variant: 'destructive' as const, label: t('priority.high') },
    };

    const config = priorityConfig[priority];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const statusCounts = useMemo(() => {
    return mockQuotes.reduce(
      (acc, quote) => {
        acc[quote.status] = (acc[quote.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, []);

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
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('exportQuotes')}
            </Button>
            <Button size="sm" asChild>
              <Link href="/rfq">
                <Plus className="mr-2 h-4 w-4" />
                {t('newQuote')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <div>
                  <p className="text-sm font-medium">{t('status.pending')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.pending || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">{t('status.quoted')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.quoted || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">{t('status.approved')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.approved || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <div>
                  <p className="text-sm font-medium">{t('status.rejected')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.rejected || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-gray-600" />
                <div>
                  <p className="text-sm font-medium">{t('status.expired')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.expired || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                  <Input
                    placeholder={t('searchPlaceholder')}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="quoted">{t('status.quoted')}</SelectItem>
                  <SelectItem value="approved">
                    {t('status.approved')}
                  </SelectItem>
                  <SelectItem value="rejected">
                    {t('status.rejected')}
                  </SelectItem>
                  <SelectItem value="expired">{t('status.expired')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('filterByPriority')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allPriorities')}</SelectItem>
                  <SelectItem value="high">{t('priority.high')}</SelectItem>
                  <SelectItem value="medium">{t('priority.medium')}</SelectItem>
                  <SelectItem value="low">{t('priority.low')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Quotes Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('quotesList')}</CardTitle>
            <CardDescription>
              {t('quotesListDescription', {
                count: filteredAndSortedQuotes.length,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-2">
                        {t('quoteId')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('product')}
                    >
                      <div className="flex items-center gap-2">
                        {t('product')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>{t('quantity')}</TableHead>
                    <TableHead>{t('status')}</TableHead>
                    <TableHead>{t('priority')}</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('requestedAt')}
                    >
                      <div className="flex items-center gap-2">
                        {t('requested')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('expiresAt')}
                    >
                      <div className="flex items-center gap-2">
                        {t('expires')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>{t('quotedPrice')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedQuotes.map(quote => (
                    <TableRow key={quote.id}>
                      <TableCell className="font-medium">{quote.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{quote.product}</p>
                          <p className="text-sm text-gray-500">
                            {quote.supplier}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{quote.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(quote.status)}
                          {getStatusBadge(quote.status)}
                        </div>
                      </TableCell>
                      <TableCell>{getPriorityBadge(quote.priority)}</TableCell>
                      <TableCell>{quote.requestedAt}</TableCell>
                      <TableCell>
                        <span
                          className={
                            quote.status === 'expired' ? 'text-red-600' : ''
                          }
                        >
                          {quote.expiresAt}
                        </span>
                      </TableCell>
                      <TableCell>
                        {quote.quotedPrice ? (
                          <span className="font-medium">
                            ${quote.quotedPrice.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>
                              {t('actions')}
                            </DropdownMenuLabel>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('viewDetails')}
                            </DropdownMenuItem>
                            {quote.status === 'quoted' && (
                              <>
                                <DropdownMenuItem>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  {t('approve')}
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  {t('reject')}
                                </DropdownMenuItem>
                              </>
                            )}
                            {quote.status === 'pending' && (
                              <DropdownMenuItem>
                                <Edit className="mr-2 h-4 w-4" />
                                {t('edit')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              {t('delete')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAndSortedQuotes.length === 0 && (
              <div className="py-8 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-gray-600">{t('noQuotesFound')}</p>
                <p className="text-sm text-gray-500">
                  {t('noQuotesFoundDescription')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </ContentSection>
    </ContentContainer>
  );
}
