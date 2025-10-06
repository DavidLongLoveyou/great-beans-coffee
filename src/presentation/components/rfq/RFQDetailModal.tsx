'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Package,
  Calendar,
  MapPin,
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
} from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState('overview');

  const statusConfig = {
    SUBMITTED: { label: 'Submitted', color: 'bg-blue-100 text-blue-800', icon: Clock },
    UNDER_REVIEW: { label: 'Under Review', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle },
    QUOTED: { label: 'Quoted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
    NEGOTIATING: { label: 'Negotiating', color: 'bg-orange-100 text-orange-800', icon: MessageSquare },
    ACCEPTED: { label: 'Accepted', color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
    REJECTED: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: AlertTriangle },
    EXPIRED: { label: 'Expired', color: 'bg-gray-100 text-gray-800', icon: Clock },
  };

  const priorityConfig = {
    LOW: { label: 'Low', color: 'bg-gray-100 text-gray-800' },
    MEDIUM: { label: 'Medium', color: 'bg-blue-100 text-blue-800' },
    HIGH: { label: 'High', color: 'bg-orange-100 text-orange-800' },
    URGENT: { label: 'Urgent', color: 'bg-red-100 text-red-800' },
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {rfq.rfqNumber}
              </DialogTitle>
              <DialogDescription className="mt-2">
                {rfq.productType} • {rfq.quantity} {rfq.unit}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={statusConfig[rfq.status as keyof typeof statusConfig]?.color}>
                {statusConfig[rfq.status as keyof typeof statusConfig]?.label}
              </Badge>
              <Badge className={priorityConfig[rfq.priority as keyof typeof priorityConfig]?.color}>
                {priorityConfig[rfq.priority as keyof typeof priorityConfig]?.label}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="company">Company</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Product Type</label>
                    <p className="text-lg font-semibold">{rfq.productType}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Quantity</label>
                      <p className="font-semibold">{rfq.quantity} {rfq.unit}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Est. Value</label>
                      <p className="font-semibold">{formatCurrency(rfq.estimatedValue, rfq.currency)}</p>
                    </div>
                  </div>
                  {rfq.productRequirements && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Certifications</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {rfq.productRequirements.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Submitted</label>
                    <p className="font-semibold">{formatDate(rfq.submittedAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Last Update</label>
                    <p className="font-semibold">{formatDate(rfq.lastUpdate)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Response Deadline</label>
                    <p className="font-semibold text-orange-600">{formatDate(rfq.responseDeadline)}</p>
                  </div>
                  {rfq.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">Assigned To</label>
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
                    Additional Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{rfq.additionalNotes}</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rfq.productRequirements && (
                <Card>
                  <CardHeader>
                    <CardTitle>Product Specifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Variety</label>
                        <p className="font-semibold">{rfq.productRequirements.variety}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Grade</label>
                        <p className="font-semibold">{rfq.productRequirements.grade}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Processing</label>
                        <p className="font-semibold">{rfq.productRequirements.processing}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Origin</label>
                        <p className="font-semibold">{rfq.productRequirements.origin}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Moisture Content</label>
                        <p className="font-semibold">{rfq.productRequirements.moistureContent}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Screen Size</label>
                        <p className="font-semibold">{rfq.productRequirements.screenSize}</p>
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
                      Delivery Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Incoterms</label>
                      <p className="font-semibold">{rfq.delivery.incoterms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Destination</label>
                      <p className="font-semibold">{rfq.delivery.destination}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Preferred Delivery</label>
                      <p className="font-semibold">{rfq.delivery.preferredDeliveryDate}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Packaging</label>
                      <p className="font-semibold">{rfq.delivery.packagingRequirements}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rfq.payment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Payment Terms</label>
                      <p className="font-semibold">{rfq.payment.terms}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Payment Method</label>
                      <p className="font-semibold">{rfq.payment.method}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Currency</label>
                      <p className="font-semibold">{rfq.payment.currency}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="company" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rfq.company && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      Company Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Company Name</label>
                      <p className="font-semibold">{rfq.company.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Address</label>
                      <p className="font-semibold">{rfq.company.address}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Country</label>
                      <p className="font-semibold">{rfq.company.country}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Business Type</label>
                      <p className="font-semibold">{rfq.company.businessType}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Annual Volume</label>
                      <p className="font-semibold">{rfq.company.annualVolume}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {rfq.contact && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Contact Person
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Name</label>
                      <p className="font-semibold">{rfq.contact.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Title</label>
                      <p className="font-semibold">{rfq.contact.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${rfq.contact.email}`} className="text-blue-600 hover:underline">
                        {rfq.contact.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${rfq.contact.phone}`} className="text-blue-600 hover:underline">
                        {rfq.contact.phone}
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {rfq.attachments && rfq.attachments.length > 0 && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Attachments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {rfq.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium">{attachment.name}</p>
                            <p className="text-sm text-gray-500">{attachment.type} • {attachment.size}</p>
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
                <CardTitle>RFQ Timeline</CardTitle>
                <CardDescription>
                  Track the progress and updates of your quote request
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rfq.timeline ? (
                  <div className="space-y-4">
                    {rfq.timeline.map((event, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 bg-forest-600 rounded-full"></div>
                          {index < rfq.timeline!.length - 1 && (
                            <div className="w-px h-8 bg-gray-200 mt-2"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{event.status}</h4>
                            <span className="text-sm text-gray-500">{formatDate(event.date)}</span>
                          </div>
                          <p className="text-gray-600 mt-1">{event.description}</p>
                          <p className="text-sm text-gray-500 mt-1">by {event.user}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No timeline events available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Received Quotes</CardTitle>
                <CardDescription>
                  Review and compare quotes from our team
                </CardDescription>
              </CardHeader>
              <CardContent>
                {rfq.quotes && rfq.quotes.length > 0 ? (
                  <div className="space-y-4">
                    {rfq.quotes.map((quote, index) => (
                      <div key={quote.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-semibold">Quote #{index + 1}</h4>
                          <Badge variant="outline">Valid until {formatDate(quote.validUntil)}</Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-gray-600">Quoted Price</label>
                            <p className="text-2xl font-bold text-green-600">
                              {formatCurrency(quote.quotedPrice, quote.currency)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-600">Terms</label>
                            <p className="font-semibold">{quote.terms}</p>
                          </div>
                        </div>
                        {quote.notes && (
                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600">Notes</label>
                            <p className="text-gray-700 mt-1">{quote.notes}</p>
                          </div>
                        )}
                        {quote.attachments && quote.attachments.length > 0 && (
                          <div className="mt-4">
                            <label className="text-sm font-medium text-gray-600">Attachments</label>
                            <div className="flex gap-2 mt-2">
                              {quote.attachments.map((attachment, attachIndex) => (
                                <Button key={attachIndex} variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  {attachment.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex gap-2 mt-4">
                          <Button className="flex-1">Accept Quote</Button>
                          <Button variant="outline" className="flex-1">Negotiate</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500">No quotes received yet</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Our team is working on your request and will provide a quote soon.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 mt-6 pt-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Sales
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}