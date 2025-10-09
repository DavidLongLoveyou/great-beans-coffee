'use client';

import {
  AlertTriangle,
  Archive,
  Award,
  Building,
  CheckCircle,
  Clock,
  Download,
  Edit,
  Eye,
  FileCheck,
  FileText,
  Search,
  Share,
  Shield,
  Star,
  StarOff,
  Trash2,
  Truck,
  Upload,
  XCircle,
} from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
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
import { Textarea } from '@/presentation/components/ui/textarea';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

interface DocumentsPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface Document {
  id: string;
  name: string;
  type:
    | 'contract'
    | 'certificate'
    | 'shipping'
    | 'invoice'
    | 'quality'
    | 'insurance';
  category: string;
  size: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending' | 'archived';
  uploadedBy: string;
  relatedOrder?: string;
  tags: string[];
  isFavorite: boolean;
  description?: string;
}

// Mock data
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Coffee Supply Agreement 2024.pdf',
    type: 'contract',
    category: 'Supply Agreement',
    size: '2.4 MB',
    uploadDate: '2024-01-15',
    expiryDate: '2024-12-31',
    status: 'active',
    uploadedBy: 'John Smith',
    relatedOrder: 'ORD-2024-001',
    tags: ['annual', 'robusta', 'premium'],
    isFavorite: true,
    description: 'Annual coffee supply agreement for premium robusta beans',
  },
  {
    id: '2',
    name: 'Organic Certification.pdf',
    type: 'certificate',
    category: 'Organic Certificate',
    size: '1.8 MB',
    uploadDate: '2024-01-10',
    expiryDate: '2025-01-10',
    status: 'active',
    uploadedBy: 'Sarah Johnson',
    tags: ['organic', 'certification', 'arabica'],
    isFavorite: false,
    description: 'USDA Organic certification for arabica coffee beans',
  },
  {
    id: '3',
    name: 'Bill of Lading - Container MSKU123.pdf',
    type: 'shipping',
    category: 'Bill of Lading',
    size: '956 KB',
    uploadDate: '2024-01-12',
    status: 'active',
    uploadedBy: 'Mike Chen',
    relatedOrder: 'ORD-2024-002',
    tags: ['shipping', 'container', 'export'],
    isFavorite: false,
    description: 'Shipping documentation for container MSKU123',
  },
  {
    id: '4',
    name: 'Fair Trade Certificate.pdf',
    type: 'certificate',
    category: 'Fair Trade Certificate',
    size: '1.2 MB',
    uploadDate: '2024-01-08',
    expiryDate: '2024-06-30',
    status: 'expired',
    uploadedBy: 'Emma Wilson',
    tags: ['fairtrade', 'certification', 'social'],
    isFavorite: false,
    description: 'Fair Trade certification - needs renewal',
  },
  {
    id: '5',
    name: 'Quality Analysis Report Q1-2024.pdf',
    type: 'quality',
    category: 'Quality Report',
    size: '3.1 MB',
    uploadDate: '2024-01-20',
    status: 'active',
    uploadedBy: 'John Smith',
    relatedOrder: 'ORD-2024-003',
    tags: ['quality', 'analysis', 'q1'],
    isFavorite: true,
    description: 'Comprehensive quality analysis for Q1 2024 shipments',
  },
  {
    id: '6',
    name: 'Insurance Policy - Marine Cargo.pdf',
    type: 'insurance',
    category: 'Marine Insurance',
    size: '1.5 MB',
    uploadDate: '2024-01-05',
    expiryDate: '2024-12-31',
    status: 'active',
    uploadedBy: 'Sarah Johnson',
    tags: ['insurance', 'marine', 'cargo'],
    isFavorite: false,
    description: 'Marine cargo insurance policy for international shipments',
  },
];

export default function DocumentsPage({ params: _params }: DocumentsPageProps) {
  const t = useTranslations('documents');
  const [documents, setDocuments] = useState(mockDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('uploadDate');
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );
      const matchesType = typeFilter === 'all' || doc.type === typeFilter;
      const matchesStatus =
        statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort documents
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'uploadDate':
          return (
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
        case 'size':
          return parseFloat(b.size) - parseFloat(a.size);
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchTerm, typeFilter, statusFilter, sortBy]);

  // Document statistics
  const documentStats = useMemo(() => {
    const total = documents.length;
    const active = documents.filter(doc => doc.status === 'active').length;
    const expired = documents.filter(doc => doc.status === 'expired').length;
    const pending = documents.filter(doc => doc.status === 'pending').length;
    const expiringThisMonth = documents.filter(doc => {
      if (!doc.expiryDate) return false;
      const expiry = new Date(doc.expiryDate);
      const now = new Date();
      const nextMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );
      return expiry <= nextMonth && expiry >= now;
    }).length;

    return { total, active, expired, pending, expiringThisMonth };
  }, [documents]);

  const getDocumentIcon = (type: Document['type']) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'certificate':
        return <Award className="h-5 w-5 text-green-600" />;
      case 'shipping':
        return <Truck className="h-5 w-5 text-orange-600" />;
      case 'invoice':
        return <FileCheck className="h-5 w-5 text-purple-600" />;
      case 'quality':
        return <Shield className="h-5 w-5 text-indigo-600" />;
      case 'insurance':
        return <Building className="h-5 w-5 text-red-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: Document['status']) => {
    const statusConfig = {
      active: {
        variant: 'default' as const,
        label: t('status.active'),
        icon: CheckCircle,
      },
      expired: {
        variant: 'destructive' as const,
        label: t('status.expired'),
        icon: XCircle,
      },
      pending: {
        variant: 'secondary' as const,
        label: t('status.pending'),
        icon: Clock,
      },
      archived: {
        variant: 'outline' as const,
        label: t('status.archived'),
        icon: Archive,
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const toggleFavorite = (id: string) => {
    setDocuments(docs =>
      docs.map(doc =>
        doc.id === id ? { ...doc, isFavorite: !doc.isFavorite } : doc
      )
    );
  };

  const formatFileSize = (size: string) => {
    return size;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const isExpiringThisMonth = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const expiry = new Date(expiryDate);
    const now = new Date();
    const nextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
    return expiry <= nextMonth && expiry >= now;
  };

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
          <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                {t('uploadDocument')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('uploadDocumentTitle')}</DialogTitle>
                <DialogDescription>
                  {t('uploadDocumentDescription')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="documentFile">{t('selectFile')}</Label>
                  <Input
                    id="documentFile"
                    type="file"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
                <div>
                  <Label htmlFor="documentType">{t('documentType')}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectType')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="contract">
                        {t('types.contract')}
                      </SelectItem>
                      <SelectItem value="certificate">
                        {t('types.certificate')}
                      </SelectItem>
                      <SelectItem value="shipping">
                        {t('types.shipping')}
                      </SelectItem>
                      <SelectItem value="invoice">
                        {t('types.invoice')}
                      </SelectItem>
                      <SelectItem value="quality">
                        {t('types.quality')}
                      </SelectItem>
                      <SelectItem value="insurance">
                        {t('types.insurance')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="documentDescription">
                    {t('description')}
                  </Label>
                  <Textarea
                    id="documentDescription"
                    placeholder={t('descriptionPlaceholder')}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">{t('expiryDate')}</Label>
                  <Input id="expiryDate" type="date" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowUploadDialog(false)}
                >
                  {t('cancel')}
                </Button>
                <Button onClick={() => setShowUploadDialog(false)}>
                  {t('upload')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('stats.totalDocuments')}
                  </p>
                  <p className="text-2xl font-bold">{documentStats.total}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('stats.activeDocuments')}
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {documentStats.active}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('stats.expiredDocuments')}
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    {documentStats.expired}
                  </p>
                </div>
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {t('stats.pendingDocuments')}
                  </p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {documentStats.pending}
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
                  <p className="text-sm font-medium text-gray-600">
                    {t('stats.expiringThisMonth')}
                  </p>
                  <p className="text-2xl font-bold text-orange-600">
                    {documentStats.expiringThisMonth}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row">
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

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder={t('filterByType')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allTypes')}</SelectItem>
                  <SelectItem value="contract">
                    {t('types.contract')}
                  </SelectItem>
                  <SelectItem value="certificate">
                    {t('types.certificate')}
                  </SelectItem>
                  <SelectItem value="shipping">
                    {t('types.shipping')}
                  </SelectItem>
                  <SelectItem value="invoice">{t('types.invoice')}</SelectItem>
                  <SelectItem value="quality">{t('types.quality')}</SelectItem>
                  <SelectItem value="insurance">
                    {t('types.insurance')}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder={t('filterByStatus')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="expired">{t('status.expired')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="archived">
                    {t('status.archived')}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="uploadDate">
                    {t('sortOptions.uploadDate')}
                  </SelectItem>
                  <SelectItem value="name">{t('sortOptions.name')}</SelectItem>
                  <SelectItem value="type">{t('sortOptions.type')}</SelectItem>
                  <SelectItem value="size">{t('sortOptions.size')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Documents Table */}
        <Card>
          <CardHeader>
            <CardTitle>{t('documentsTable.title')}</CardTitle>
            <CardDescription>
              {t('documentsTable.description', {
                count: filteredDocuments.length,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredDocuments.length === 0 ? (
              <div className="py-12 text-center">
                <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-gray-600">{t('noDocuments')}</p>
                <p className="text-sm text-gray-500">
                  {t('noDocumentsDescription')}
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('tableHeaders.document')}</TableHead>
                    <TableHead>{t('tableHeaders.type')}</TableHead>
                    <TableHead>{t('tableHeaders.status')}</TableHead>
                    <TableHead>{t('tableHeaders.uploadDate')}</TableHead>
                    <TableHead>{t('tableHeaders.expiryDate')}</TableHead>
                    <TableHead>{t('tableHeaders.size')}</TableHead>
                    <TableHead>{t('tableHeaders.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocuments.map(document => (
                    <TableRow key={document.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getDocumentIcon(document.type)}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className="truncate font-medium">
                                {document.name}
                              </p>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleFavorite(document.id)}
                                className="h-6 w-6 p-0"
                              >
                                {document.isFavorite ? (
                                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                                ) : (
                                  <StarOff className="h-4 w-4 text-gray-400" />
                                )}
                              </Button>
                            </div>
                            {document.description && (
                              <p className="truncate text-sm text-gray-600">
                                {document.description}
                              </p>
                            )}
                            {document.tags.length > 0 && (
                              <div className="mt-1 flex gap-1">
                                {document.tags.slice(0, 2).map(tag => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                  >
                                    {tag}
                                  </Badge>
                                ))}
                                {document.tags.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{document.tags.length - 2}
                                  </Badge>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t(`types.${document.type}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(document.status)}
                          {document.expiryDate &&
                            isExpiringThisMonth(document.expiryDate) && (
                              <AlertTriangle className="h-4 w-4 text-orange-500" />
                            )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatDate(document.uploadDate)}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {document.expiryDate
                          ? formatDate(document.expiryDate)
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {formatFileSize(document.size)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {t('actions')}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              {t('view')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              {t('download')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share className="mr-2 h-4 w-4" />
                              {t('share')}
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              {t('edit')}
                            </DropdownMenuItem>
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
            )}
          </CardContent>
        </Card>
      </ContentSection>
    </ContentContainer>
  );
}
