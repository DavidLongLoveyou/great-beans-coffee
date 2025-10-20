'use client';

import {
  Package,
  Calendar,
  Truck,
  CreditCard,
  Building,
  User,
  Phone,
  Mail,
  FileText,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Paperclip,
} from '@/components/ui/icons';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import {
  formatDateTimeLong,
  formatDeadline as _formatDeadline,
} from '@/lib/date-utils';
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
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Separator as _Separator } from '@/presentation/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { useMarket } from '@/shared/hooks/useMarket';

interface RFQDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  rfq: {
    id: string;
    rfqNumber: string;
    status: string;
    priority: string;
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
    // Additional detailed fields
    productRequirements?: {
      variety: string;
      grade: string;
      processing: string;
      origin: string;
      certifications: string[];
      moistureContent: string;
      screenSize: string;
      defectRate: string;
    };
    delivery?: {
      incoterms: string;
      destination: string;
      preferredDeliveryDate: string;
      packagingRequirements: string;
    };
    payment?: {
      terms: string;
      method: string;
      currency: string;
    };
    company?: {
      name: string;
      address: string;
      country: string;
      businessType: string;
      annualVolume: string;
    };
    contact?: {
      name: string;
      title: string;
      email: string;
      phone: string;
    };
    additionalNotes?: string;
    attachments?: Array<{
      name: string;
      type: string;
      size: string;
      url: string;
    }>;
    timeline?: Array<{
      date: string;
      status: string;
      description: string;
      user: string;
    }>;
    quotes?: Array<{
      id: string;
      quotedPrice: number;
      currency: string;
      validUntil: string;
      terms: string;
      notes: string;
      attachments: Array<{
        name: string;
        url: string;
      }>;
    }>;
  };
}

export function RFQDetailModal({ isOpen, onClose, rfq }: RFQDetailModalProps) {
  const t = useTranslations('rfq');
  const { locale, formatCurrency: marketFormatCurrency } = useMarket();
  const [activeTab, setActiveTab] = useState('overview');

  const statusConfig = {
    SUBMITTED: {
      label: t('status.submitted'),
      color: 'bg-blue-100 text-blue-800',
      icon: Clock,
    },
    UNDER_REVIEW: {
      label: t('status.underReview'),
      color: 'bg-yellow-100 text-yellow-800',
      icon: AlertTriangle,
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
      icon: AlertTriangle,
    },
    EXPIRED: {
      label: t('status.expired'),
      color: 'bg-gray-100 text-gray-800',
      icon: Clock,
    },
  };

  const priorityConfig = {
    LOW: { label: t('priority.low'), color: 'bg-gray-100 text-gray-800' },
    MEDIUM: { label: t('priority.medium'), color: 'bg-blue-100 text-blue-800' },
    HIGH: { label: t('priority.high'), color: 'bg-orange-100 text-orange-800' },
    URGENT: { label: t('priority.urgent'), color: 'bg-red-100 text-red-800' },
  };

  const formatDate = (dateString: string) => {
    return formatDateTimeLong(dateString, locale);
  };

  const formatCurrency = (amount: number, _currency?: string) => {
    // Use the market-specific currency formatting
    return marketFormatCurrency(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl font-bold sm:text-2xl">
                {rfq.rfqNumber}
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm sm:mt-2 sm:text-base">
                {rfq.productType} • {rfq.quantity} {rfq.unit}
              </DialogDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                className={
                  statusConfig[rfq.status as keyof typeof statusConfig]?.color
                }
              >
                {statusConfig[rfq.status as keyof typeof statusConfig]?.label}
              </Badge>
              <Badge
                className={
                  priorityConfig[rfq.priority as keyof typeof priorityConfig]
                    ?.color
                }
              >
                {
                  priorityConfig[rfq.priority as keyof typeof priorityConfig]
                    ?.label
                }
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="mt-4 sm:mt-6"
        >
          <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-5 sm:gap-0">
            <TabsTrigger value="overview" className="text-xs sm:text-sm">
              {t('detail.tabs.overview')}
            </TabsTrigger>
            <TabsTrigger value="requirements" className="text-xs sm:text-sm">
              {t('detail.tabs.requirements')}
            </TabsTrigger>
            <TabsTrigger value="company" className="text-xs sm:text-sm">
              {t('detail.tabs.company')}
            </TabsTrigger>
            <TabsTrigger value="timeline" className="text-xs sm:text-sm">
              {t('detail.tabs.timeline')}
            </TabsTrigger>
            <TabsTrigger value="quotes" className="text-xs sm:text-sm">
              {t('detail.tabs.quotes')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t('detail.productInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-600 sm:text-sm">
                      {t('detail.productType')}
                    </label>
                    <p className="text-base font-semibold sm:text-lg">
                      {rfq.productType}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
                    <div>
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
                        {t('detail.quantity')}
                      </label>
                      <p className="text-sm font-semibold sm:text-base">
                        {rfq.quantity} {rfq.unit}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
                        {t('detail.estimatedValue')}
                      </label>
                      <p className="text-sm font-semibold sm:text-base">
                        {formatCurrency(rfq.estimatedValue, rfq.currency)}
                      </p>
                    </div>
                  </div>
                  {rfq.productRequirements && (
                    <div>
                      <label className="text-xs font-medium text-gray-600 sm:text-sm">
                        {t('detail.certifications')}
                      </label>
                      <div className="mt-1 flex flex-wrap gap-1 sm:gap-2">
                        {rfq.productRequirements.certifications.map(cert => (
                          <Badge
                            key={`cert-${cert}`}
                            variant="outline"
                            className="text-xs"
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5" />
                    {t('detail.timelineInfo')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t('detail.submitted')}
                    </label>
                    <p className="font-semibold">
                      {formatDate(rfq.submittedAt)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t('detail.lastUpdate')}
                    </label>
                    <p className="font-semibold">
                      {formatDate(rfq.lastUpdate)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      {t('detail.responseDeadline')}
                    </label>
                    <p className="font-semibold text-orange-600">
                      {formatDate(rfq.responseDeadline)}
                    </p>
                  </div>
                  {rfq.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.assignedTo')}
                      </label>
                      <p className="font-semibold">{rfq.assignedTo}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {rfq.additionalNotes && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('detail.additionalNotes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{rfq.additionalNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {rfq.productRequirements && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {t('detail.productSpecifications')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.variety')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.variety}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.grade')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.grade}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.processing')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.processing}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.origin')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.origin}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.moistureContent')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.moistureContent}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          {t('detail.screenSize')}
                        </label>
                        <p className="font-semibold">
                          {rfq.productRequirements.screenSize}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rfq.delivery && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      {t('detail.deliveryRequirements')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.incoterms')}
                      </label>
                      <p className="font-semibold">{rfq.delivery.incoterms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.destination')}
                      </label>
                      <p className="font-semibold">
                        {rfq.delivery.destination}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.preferredDelivery')}
                      </label>
                      <p className="font-semibold">
                        {rfq.delivery.preferredDeliveryDate}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.packaging')}
                      </label>
                      <p className="font-semibold">
                        {rfq.delivery.packagingRequirements}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rfq.payment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      {t('detail.paymentTerms')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.paymentTerms')}
                      </label>
                      <p className="font-semibold">{rfq.payment.terms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.paymentMethod')}
                      </label>
                      <p className="font-semibold">{rfq.payment.method}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.currency')}
                      </label>
                      <p className="font-semibold">{rfq.payment.currency}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {rfq.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      {t('detail.companyInformation')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.companyName')}
                      </label>
                      <p className="font-semibold">{rfq.company.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.address')}
                      </label>
                      <p className="font-semibold">{rfq.company.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.country')}
                      </label>
                      <p className="font-semibold">{rfq.company.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.businessType')}
                      </label>
                      <p className="font-semibold">
                        {rfq.company.businessType}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.annualVolume')}
                      </label>
                      <p className="font-semibold">
                        {rfq.company.annualVolume}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rfq.contact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t('detail.contactPerson')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.name')}
                      </label>
                      <p className="font-semibold">{rfq.contact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        {t('detail.title')}
                      </label>
                      <p className="font-semibold">{rfq.contact.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a
                        href={`mailto:${rfq.contact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {rfq.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a
                        href={`tel:${rfq.contact.phone}`}
                        className="text-blue-600 hover:underline"
                      >
                        {rfq.contact.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {rfq.attachments && rfq.attachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paperclip className="h-5 w-5" />
                    {t('detail.attachments')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rfq.attachments.map(attachment => (
                      <div
                        key={`attachment-${attachment.name}-${attachment.size}`}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-gray-500">
                              {attachment.type} • {attachment.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {t('detail.rfqTimeline')}
                </CardTitle>
                <CardDescription>
                  {t('detail.timelineDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rfq.timeline ? (
                  <div className="space-y-4">
                    {rfq.timeline.map((event, index) => (
                      <div
                        key={`timeline-${event.status}-${event.date}-${event.user}`}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="h-3 w-3 rounded-full bg-forest-600"></div>
                          {index < rfq.timeline!.length - 1 && (
                            <div className="mt-2 h-8 w-px bg-gray-200"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{event.status}</h4>
                            <span className="text-sm text-gray-500">
                              {formatDate(event.date)}
                            </span>
                          </div>
                          <p className="mt-1 text-gray-600">
                            {event.description}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            by {event.user}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Clock className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">
                      {t('detail.noTimelineEvents')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('detail.receivedQuotes')}</CardTitle>
                <CardDescription>
                  {t('detail.quotesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rfq.quotes && rfq.quotes.length > 0 ? (
                  <div className="space-y-4">
                    {rfq.quotes.map((quote, index) => (
                      <div key={quote.id} className="rounded-lg border p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <h4 className="font-semibold">
                            {t('detail.quoteNumber', { number: index + 1 })}
                          </h4>
                          <Badge variant="outline">
                            {t('detail.validUntil', {
                              date: formatDate(quote.validUntil),
                            })}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              {t('detail.quotedPrice')}
                            </label>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(
                                quote.quotedPrice,
                                quote.currency
                              )}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">
                              {t('detail.terms')}
                            </label>
                            <p className="font-semibold">{quote.terms}</p>
                          </div>
                        </div>
                        {quote.notes && (
                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600">
                              {t('detail.notes')}
                            </label>
                            <p className="mt-1 text-gray-700">{quote.notes}</p>
                          </div>
                        )}
                        {quote.attachments && quote.attachments.length > 0 && (
                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600">
                              {t('detail.attachments')}
                            </label>
                            <div className="mt-2 flex gap-2">
                              {quote.attachments.map(attachment => (
                                <Button
                                  key={`quote-attachment-${attachment.name}`}
                                  variant="outline"
                                  size="sm"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  {attachment.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-4 flex gap-2">
                          <Button className="flex-1">
                            {t('detail.acceptQuote')}
                          </Button>
                          <Button variant="outline" className="flex-1">
                            {t('detail.negotiate')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                    <p className="text-gray-500">{t('detail.noQuotesYet')}</p>
                    <p className="mt-1 text-sm text-gray-400">
                      {t('detail.quotesWorkingMessage')}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end gap-2 border-t pt-6">
          <Button variant="outline" onClick={onClose}>
            {t('detail.close')}
          </Button>
          <Button>
            <MessageSquare className="mr-2 h-4 w-4" />
            {t('detail.contactSales')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
