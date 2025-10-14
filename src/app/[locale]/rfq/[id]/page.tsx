'use client';

import { ArrowLeft, Download, MessageSquare, Edit, Share2 } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  RFQStatusManager,
  RFQStatusHistory,
  type RFQStatus,
} from '@/components/ui/rfq-status-manager';
import { RFQDetailModal } from '@/presentation/components/rfq/RFQDetailModal';
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

import { usePDFGeneration } from '@/shared/hooks/use-pdf-generation';
import { RFQEntity } from '@/domain/entities/rfq.entity';

// Mock data - in real app, this would come from API
const mockRFQ = {
  id: '1',
  rfqNumber: 'RFQ-2024-001',
  status: 'UNDER_REVIEW' as RFQStatus,
  priority: 'HIGH',
  productType: 'Robusta Coffee Beans',
  quantity: 20000,
  unit: 'kg',
  estimatedValue: 45000,
  currency: 'USD',
  submittedAt: '2024-01-15T10:30:00Z',
  lastUpdate: '2024-01-16T14:20:00Z',
  responseDeadline: '2024-01-25T23:59:59Z',
  assignedTo: 'John Smith',
  companyName: 'Global Coffee Importers Ltd.',
  contactPerson: 'Sarah Johnson',
  productRequirements: {
    variety: 'Robusta',
    grade: 'Grade 1',
    processing: 'Wet Process',
    origin: 'Dak Lak Province',
    certifications: ['Organic', 'Fair Trade', 'Rainforest Alliance'],
    moistureContent: '12.5%',
    screenSize: 'Screen 18+',
    defectRate: '<3%',
  },
  delivery: {
    incoterms: 'FOB Ho Chi Minh Port',
    destination: 'Hamburg, Germany',
    preferredDeliveryDate: '2024-03-15',
    packagingRequirements: '60kg jute bags',
  },
  payment: {
    terms: '30 days after B/L date',
    method: 'Letter of Credit',
    currency: 'USD',
  },
  company: {
    name: 'Global Coffee Importers Ltd.',
    address: '123 Coffee Street, Hamburg, Germany',
    country: 'Germany',
    businessType: 'Coffee Importer',
    annualVolume: '500,000 kg',
  },
  contact: {
    name: 'Sarah Johnson',
    title: 'Procurement Manager',
    email: 'sarah.johnson@globalcoffee.com',
    phone: '+49 40 123456789',
  },
  additionalNotes:
    'Looking for long-term partnership. Quality consistency is crucial for our brand.',
  attachments: [
    {
      name: 'Product Specifications.pdf',
      type: 'application/pdf',
      size: '2.3 MB',
      url: '/attachments/product-specs.pdf',
    },
    {
      name: 'Quality Requirements.docx',
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      size: '1.8 MB',
      url: '/attachments/quality-requirements.docx',
    },
  ],
  timeline: [
    {
      date: '2024-01-15T10:30:00Z',
      status: 'SUBMITTED',
      description: 'RFQ submitted by client',
      user: 'Sarah Johnson',
    },
    {
      date: '2024-01-15T11:45:00Z',
      status: 'UNDER_REVIEW',
      description: 'RFQ assigned to sales team for review',
      user: 'System',
    },
    {
      date: '2024-01-16T14:20:00Z',
      status: 'UNDER_REVIEW',
      description: 'Initial review completed, preparing quote',
      user: 'John Smith',
    },
  ],
  quotes: [
    {
      id: 'Q-001',
      quotedPrice: 2.25,
      currency: 'USD',
      validUntil: '2024-02-15',
      terms: 'FOB Ho Chi Minh Port, 30 days payment',
      notes: 'Price includes quality certification and inspection',
      attachments: [
        {
          name: 'Quote-RFQ-2024-001.pdf',
          url: '/quotes/quote-001.pdf',
        },
      ],
    },
  ],
  statusHistory: [
    {
      id: '1',
      status: 'pending' as RFQStatus,
      timestamp: new Date('2024-01-15T10:00:00Z'),
      updatedBy: 'System',
      note: 'RFQ submitted by client',
    },
    {
      id: '2',
      status: 'processing' as RFQStatus,
      timestamp: new Date('2024-01-15T11:45:00Z'),
      updatedBy: 'John Smith',
      note: 'Assigned to sales team for review',
    },
  ],
};

export default function RFQDetailPage() {
  const t = useTranslations('rfq');
  const router = useRouter();
  const params = useParams();
  const [showModal, setShowModal] = useState(false);

  // PDF generation hook
  const { generateRFQDocument, isGenerating: isPDFLoading } =
    usePDFGeneration();

  const handleStatusChange = async (newStatus: RFQStatus, note?: string) => {
    try {
      const response = await fetch(`/api/rfq/${params.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const _result = await response.json();
      // Status update tracking removed for production

      // In real app, you would update the local state or refetch data
      // For now, we'll just reload the page
      window.location.reload();
    } catch (error) {
      // Error logging removed for production
      alert('Failed to update status. Please try again.');
    }
  };

  const handleBack = () => {
    router.push(`/${params.locale}/rfq`);
  };

  const handleEdit = () => {
    // Navigate to edit page or open edit modal
    // Edit action tracking removed for production
  };

  const handleDownload = async () => {
    try {
      await generateRFQDocument(mockRFQ as unknown as RFQEntity, {
        language: Array.isArray(params.locale)
          ? params.locale[0] || 'en'
          : params.locale || 'en',
        format: 'A4',
        orientation: 'portrait',
        includeWatermark: false,
        includeHeader: true,
        includeFooter: true,
      });
    } catch (error) {
      // PDF generation error handling removed for production
    }
  };

  const handleShare = () => {
    // Share RFQ link
    navigator.clipboard.writeText(window.location.href);
  };

  const handleContact = () => {
    // Open contact modal or navigate to contact page
    // Contact action tracking removed for production
  };

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="flex items-center gap-2 self-start"
            >
              <ArrowLeft className="h-4 w-4" />
              {t('rfq.actions.back')}
            </Button>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">
                {mockRFQ.rfqNumber}
              </h1>
              <p className="text-sm text-gray-600 sm:text-base">
                {mockRFQ.productType} • {mockRFQ.quantity} {mockRFQ.unit}
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 sm:flex">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden lg:inline">{t('rfq.actions.share')}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isPDFLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              <span className="hidden lg:inline">
                {isPDFLoading
                  ? t('pdf.generating.rfqDocument')
                  : t('rfq.actions.download')}
              </span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleContact}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span className="hidden lg:inline">
                {t('rfq.actions.contact')}
              </span>
            </Button>
            <Button
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden lg:inline">{t('rfq.actions.edit')}</span>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 sm:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="flex items-center gap-2"
            >
              <Share2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={isPDFLoading}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleContact}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">
              {t('rfq.detail.quickActions')}
            </CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {t('rfq.detail.quickActionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button
                variant="default"
                onClick={() => setShowModal(true)}
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <MessageSquare className="h-4 w-4" />
                {t('rfq.detail.viewFullDetails')}
              </Button>
              <Button
                variant="outline"
                onClick={handleDownload}
                className="flex w-full items-center justify-center gap-2 sm:w-auto"
              >
                <Download className="h-4 w-4" />
                {t('rfq.actions.downloadPDF')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-600 sm:text-sm">
              {t('rfq.detail.status')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {mockRFQ.status}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-600 sm:text-sm">
              {t('rfq.detail.priority')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {mockRFQ.priority}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-600 sm:text-sm">
              {t('rfq.detail.estimatedValue')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              ${mockRFQ.estimatedValue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="transition-shadow hover:shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-gray-600 sm:text-sm">
              {t('rfq.detail.responseDeadline')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold sm:text-2xl">
              {new Date(mockRFQ.responseDeadline).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Management */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('rfq.detail.statusManagement')}</CardTitle>
            <CardDescription>
              {t('rfq.detail.statusManagementDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <RFQStatusManager
                currentStatus={mockRFQ.status}
                rfqId={mockRFQ.id}
                onStatusChange={handleStatusChange}
              />
              <div className="flex-1">
                <RFQStatusHistory history={mockRFQ.statusHistory} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section */}
      <div className="mb-8">
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">
                  {t('detail.tabs.overview')}
                </TabsTrigger>
                <TabsTrigger value="requirements">
                  {t('detail.tabs.requirements')}
                </TabsTrigger>
                <TabsTrigger value="timeline">
                  {t('detail.tabs.timeline')}
                </TabsTrigger>
                <TabsTrigger value="documents">
                  {t('detail.tabs.documents')}
                </TabsTrigger>
                <TabsTrigger value="status">
                  {t('detail.tabs.status')}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('detail.productInformation')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.productType')}
                        </label>
                        <p className="text-sm">{mockRFQ.productType}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.quantity')}
                        </label>
                        <p className="text-sm">{mockRFQ.quantity}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.variety')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.productRequirements.variety}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.grade')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.productRequirements.grade}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.processing')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.productRequirements.processing}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.origin')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.productRequirements.origin}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>{t('detail.deliveryInfo')}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.incoterms')}
                        </label>
                        <p className="text-sm">{mockRFQ.delivery.incoterms}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.destination')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.delivery.destination}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.preferredDeliveryDate')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.delivery.preferredDeliveryDate}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          {t('detail.packagingRequirements')}
                        </label>
                        <p className="text-sm">
                          {mockRFQ.delivery.packagingRequirements}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="requirements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.requirements')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{mockRFQ.additionalNotes}</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.timelineInfo')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('detail.submittedAt')}
                      </label>
                      <p className="text-sm">
                        {new Date(mockRFQ.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">
                        {t('detail.estimatedValue')}
                      </label>
                      <p className="text-sm">{mockRFQ.estimatedValue}</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('detail.tabs.documents')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500">
                      No documents uploaded yet.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="status" className="mt-6">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>{t('statusManager.changeStatus')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RFQStatusManager
                        currentStatus={mockRFQ.status}
                        rfqId={mockRFQ.id}
                        onStatusChange={handleStatusChange}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <RFQStatusHistory history={mockRFQ.statusHistory} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* RFQ Detail Modal */}
      <RFQDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        rfq={mockRFQ}
      />
    </div>
  );
}
