'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
  Search,
  Filter,
  Calendar,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  MessageSquare,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
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
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';
import { SectionHeading } from '@/shared/components/typography/SectionHeading';
import { RFQDetailModal } from '@/presentation/components/rfq/RFQDetailModal';

interface RFQItem {
  id: string;
  rfqNumber: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'QUOTED' | 'NEGOTIATING' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';
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

const priorityConfig = {
  LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
  MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
  URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
};

export default function RFQTrackingPage() {
  const t = useTranslations('rfq');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [rfqs, setRfqs] = useState(mockRFQs);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter RFQs based on search and filters
  const filteredRFQs = rfqs.filter(rfq => {
    const matchesSearch = 
      rfq.rfqNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rfq.companyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || rfq.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || rfq.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusIcon = (status: keyof typeof statusConfig) => {
    const Icon = statusConfig[status].icon;
    return <Icon className="h-4 w-4" />;
  };

  const handleViewRFQ = (rfq: RFQItem) => {
    setSelectedRFQ(rfq);
    setIsDetailModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDetailModalOpen(false);
    setSelectedRFQ(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-50 to-white">
      {/* Hero Section */}
      <ContentSection className="bg-gradient-to-r from-forest-600 to-forest-700 py-16 text-white">
        <ContentContainer>
          <div className="text-center">
            <CoffeeHeading size="3xl" className="mb-6 text-white">
              RFQ Tracking Dashboard
            </CoffeeHeading>
            <p className="mx-auto mb-8 max-w-3xl text-xl text-forest-50">
              Monitor the status of your quote requests and manage your coffee procurement pipeline
            </p>
          </div>
        </ContentContainer>
      </ContentSection>

      {/* Dashboard Content */}
      <ContentSection className="py-12">
        <ContentContainer>
          {/* Summary Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total RFQs</p>
                    <p className="text-2xl font-bold text-gray-900">{rfqs.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-forest-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Quotes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rfqs.filter(rfq => ['QUOTED', 'NEGOTIATING'].includes(rfq.status)).length}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rfqs.filter(rfq => ['SUBMITTED', 'UNDER_REVIEW'].includes(rfq.status)).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(
                        rfqs.reduce((sum, rfq) => sum + rfq.estimatedValue, 0),
                        'USD'
                      )}
                    </p>
                  </div>
                  <ArrowUpRight className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-end">
                <div className="flex-1">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search RFQs
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by RFQ number, product, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="min-w-[150px]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="SUBMITTED">Submitted</SelectItem>
                      <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                      <SelectItem value="QUOTED">Quoted</SelectItem>
                      <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                      <SelectItem value="ACCEPTED">Accepted</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                      <SelectItem value="EXPIRED">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="min-w-[150px]">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Priority</SelectItem>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="URGENT">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button variant="outline" className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* RFQ Table */}
          <Card>
            <CardHeader>
              <CardTitle>Your Quote Requests</CardTitle>
              <CardDescription>
                Track the status and progress of all your quote requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>RFQ Number</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Est. Value</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRFQs.map((rfq) => (
                      <TableRow key={rfq.id}>
                        <TableCell className="font-medium">
                          {rfq.rfqNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{rfq.productType}</p>
                            <p className="text-sm text-gray-500">{rfq.companyName}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {rfq.quantity} {rfq.unit}
                        </TableCell>
                        <TableCell>
                          {formatCurrency(rfq.estimatedValue, rfq.currency)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${statusConfig[rfq.status].color} flex items-center gap-1`}>
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
                          {formatDate(rfq.submittedAt)}
                        </TableCell>
                        <TableCell className="text-sm">
                          {formatDate(rfq.responseDeadline)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleViewRFQ(rfq)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <MessageSquare className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {filteredRFQs.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                  <h3 className="mb-2 text-lg font-medium text-gray-900">No RFQs found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'ALL' || priorityFilter !== 'ALL'
                      ? 'Try adjusting your search criteria or filters.'
                      : 'You haven\'t submitted any quote requests yet.'}
                  </p>
                  <Button className="mt-4" onClick={() => window.location.href = '/en/quote'}>
                    Create New RFQ
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
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