'use client';

import {
  ArrowUpDown,
  CheckCircle,
  Clock,
  DollarSign,
  Download,
  Eye,
  FileText,
  MoreHorizontal,
  Package,
  Plane,
  Plus,
  Search,
  Ship,
  Truck,
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
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import { Progress } from '@/presentation/components/ui/progress';
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

interface OrdersPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface Order {
  id: string;
  product: string;
  quantity: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled';
  orderDate: string;
  deliveryDate: string;
  value: number;
  paymentStatus: 'pending' | 'paid' | 'overdue' | 'refunded';
  shippingMethod: 'sea' | 'air' | 'land';
  origin: string;
  destination: string;
  trackingNumber?: string;
  invoiceNumber?: string;
  supplier: string;
  incoterm: string;
  progress: number;
}

// Mock data for orders
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001',
    product: 'Vietnam Robusta Grade 1',
    quantity: '20 MT',
    status: 'shipped',
    orderDate: '2024-01-10',
    deliveryDate: '2024-02-15',
    value: 45000,
    paymentStatus: 'paid',
    shippingMethod: 'sea',
    origin: 'Ho Chi Minh City, Vietnam',
    destination: 'Hamburg, Germany',
    trackingNumber: 'TRK-2024-001',
    invoiceNumber: 'INV-2024-001',
    supplier: 'The Great Beans',
    incoterm: 'FOB',
    progress: 75,
  },
  {
    id: 'ORD-2024-002',
    product: 'Arabica Premium',
    quantity: '10 MT',
    status: 'processing',
    orderDate: '2024-01-08',
    deliveryDate: '2024-02-10',
    value: 32000,
    paymentStatus: 'paid',
    shippingMethod: 'air',
    origin: 'Da Lat, Vietnam',
    destination: 'Los Angeles, USA',
    invoiceNumber: 'INV-2024-002',
    supplier: 'The Great Beans',
    incoterm: 'CIF',
    progress: 45,
  },
  {
    id: 'ORD-2024-003',
    product: 'Organic Robusta',
    quantity: '15 MT',
    status: 'confirmed',
    orderDate: '2024-01-15',
    deliveryDate: '2024-02-20',
    value: 28500,
    paymentStatus: 'pending',
    shippingMethod: 'sea',
    origin: 'Dak Lak, Vietnam',
    destination: 'Rotterdam, Netherlands',
    invoiceNumber: 'INV-2024-003',
    supplier: 'The Great Beans',
    incoterm: 'CFR',
    progress: 25,
  },
  {
    id: 'ORD-2024-004',
    product: 'Instant Coffee Blend',
    quantity: '12 MT',
    status: 'delivered',
    orderDate: '2024-01-05',
    deliveryDate: '2024-01-25',
    value: 36000,
    paymentStatus: 'paid',
    shippingMethod: 'air',
    origin: 'Ho Chi Minh City, Vietnam',
    destination: 'Tokyo, Japan',
    trackingNumber: 'TRK-2024-002',
    invoiceNumber: 'INV-2024-004',
    supplier: 'The Great Beans',
    incoterm: 'DDP',
    progress: 100,
  },
  {
    id: 'ORD-2024-005',
    product: 'Premium Arabica',
    quantity: '8 MT',
    status: 'cancelled',
    orderDate: '2024-01-12',
    deliveryDate: '2024-02-12',
    value: 24000,
    paymentStatus: 'refunded',
    shippingMethod: 'sea',
    origin: 'Da Lat, Vietnam',
    destination: 'Sydney, Australia',
    supplier: 'The Great Beans',
    incoterm: 'FOB',
    progress: 0,
  },
];

export default function OrdersPage({ params: _params }: OrdersPageProps) {
  const t = useTranslations('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('orderDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = mockOrders.filter(order => {
      const matchesSearch =
        order.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.destination.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === 'all' || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });

    filtered.sort((a, b) => {
      let aValue: string | number | Date = a[sortBy as keyof Order] ?? '';
      let bValue: string | number | Date = b[sortBy as keyof Order] ?? '';

      if (sortBy === 'orderDate' || sortBy === 'deliveryDate') {
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
  }, [searchTerm, statusFilter, paymentFilter, sortBy, sortOrder]);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'confirmed':
        return <CheckCircle className="h-4 w-4" />;
      case 'processing':
        return <Package className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: t('status.pending') },
      confirmed: { variant: 'default' as const, label: t('status.confirmed') },
      processing: {
        variant: 'default' as const,
        label: t('status.processing'),
      },
      shipped: { variant: 'default' as const, label: t('status.shipped') },
      delivered: { variant: 'default' as const, label: t('status.delivered') },
      cancelled: {
        variant: 'destructive' as const,
        label: t('status.cancelled'),
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentBadge = (paymentStatus: Order['paymentStatus']) => {
    const paymentConfig = {
      pending: { variant: 'secondary' as const, label: t('payment.pending') },
      paid: { variant: 'default' as const, label: t('payment.paid') },
      overdue: { variant: 'destructive' as const, label: t('payment.overdue') },
      refunded: { variant: 'outline' as const, label: t('payment.refunded') },
    };

    const config = paymentConfig[paymentStatus];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getShippingIcon = (method: Order['shippingMethod']) => {
    switch (method) {
      case 'sea':
        return <Ship className="h-4 w-4" />;
      case 'air':
        return <Plane className="h-4 w-4" />;
      case 'land':
        return <Truck className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
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
    return mockOrders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, []);

  const totalValue = useMemo(() => {
    return mockOrders.reduce((sum, order) => sum + order.value, 0);
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
              {t('exportOrders')}
            </Button>
            <Button size="sm" asChild>
              <Link href="/rfq">
                <Plus className="mr-2 h-4 w-4" />
                {t('newOrder')}
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">
                    {t('stats.totalOrders')}
                  </p>
                  <p className="text-2xl font-bold">{mockOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium">
                    {t('stats.activeShipments')}
                  </p>
                  <p className="text-2xl font-bold">
                    {(statusCounts.shipped || 0) +
                      (statusCounts.processing || 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium">{t('stats.totalValue')}</p>
                  <p className="text-2xl font-bold">
                    ${totalValue.toLocaleString()}
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
                  <p className="text-sm font-medium">{t('stats.delivered')}</p>
                  <p className="text-2xl font-bold">
                    {statusCounts.delivered || 0}
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
                  <SelectItem value="confirmed">
                    {t('status.confirmed')}
                  </SelectItem>
                  <SelectItem value="processing">
                    {t('status.processing')}
                  </SelectItem>
                  <SelectItem value="shipped">{t('status.shipped')}</SelectItem>
                  <SelectItem value="delivered">
                    {t('status.delivered')}
                  </SelectItem>
                  <SelectItem value="cancelled">
                    {t('status.cancelled')}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder={t('filterByPayment')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allPayments')}</SelectItem>
                  <SelectItem value="pending">
                    {t('payment.pending')}
                  </SelectItem>
                  <SelectItem value="paid">{t('payment.paid')}</SelectItem>
                  <SelectItem value="overdue">
                    {t('payment.overdue')}
                  </SelectItem>
                  <SelectItem value="refunded">
                    {t('payment.refunded')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('ordersList')}</CardTitle>
            <CardDescription>
              {t('ordersListDescription', {
                count: filteredAndSortedOrders.length,
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
                        {t('orderId')}
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
                    <TableHead>{t('payment')}</TableHead>
                    <TableHead>{t('shipping')}</TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('orderDate')}
                    >
                      <div className="flex items-center gap-2">
                        {t('orderDate')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer"
                      onClick={() => handleSort('value')}
                    >
                      <div className="flex items-center gap-2">
                        {t('value')}
                        <ArrowUpDown className="h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>{t('progress')}</TableHead>
                    <TableHead>{t('actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedOrders.map(order => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{order.product}</p>
                          <p className="text-sm text-gray-500">
                            {order.supplier}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          {getStatusBadge(order.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getShippingIcon(order.shippingMethod)}
                          <span className="text-sm capitalize">
                            {order.shippingMethod}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <span className="font-medium">
                          ${order.value.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={order.progress} className="w-16" />
                          <span className="text-sm text-gray-500">
                            {order.progress}%
                          </span>
                        </div>
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
                            {order.trackingNumber && (
                              <DropdownMenuItem>
                                <Truck className="mr-2 h-4 w-4" />
                                {t('trackShipment')}
                              </DropdownMenuItem>
                            )}
                            {order.invoiceNumber && (
                              <DropdownMenuItem>
                                <FileText className="mr-2 h-4 w-4" />
                                {t('viewInvoice')}
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              {t('downloadDocuments')}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredAndSortedOrders.length === 0 && (
              <div className="py-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-gray-600">{t('noOrdersFound')}</p>
                <p className="text-sm text-gray-500">
                  {t('noOrdersFoundDescription')}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </ContentSection>
    </ContentContainer>
  );
}
