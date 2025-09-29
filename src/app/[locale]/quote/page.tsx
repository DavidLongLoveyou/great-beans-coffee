'use client';

import React, { useState } from 'react';
import { type Locale } from '@/i18n';
import { useRfqForm, useMultiStepForm } from '@/presentation/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/presentation/components/ui/select';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Badge } from '@/presentation/components/ui/badge';
import { Progress } from '@/presentation/components/ui/progress';
import { 
  Coffee, 
  Building2, 
  Package, 
  Truck, 
  CreditCard, 
  FileText,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface RFQFormData {
  // Product Requirements
  coffeeType: string;
  grade: string;
  processingMethod: string;
  screenSize: string;
  moistureMax: number | null;
  defectRateMax: number | null;
  certifications: string[];
  origin: string;
  
  // Quantity Requirements
  quantity: number | null;
  unit: string;
  tolerance: number | null;
  isRecurringOrder: boolean;
  recurringFrequency: string;
  
  // Delivery Requirements
  incoterms: string;
  destinationPort: string;
  destinationCountry: string;
  preferredDeliveryDate: string;
  packaging: string;
  
  // Payment Terms
  preferredCurrency: string;
  paymentMethod: string;
  paymentTerms: string;
  
  // Company Information
  companyName: string;
  contactPerson: string;
  position: string;
  email: string;
  phone: string;
  website: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  businessType: string;
  companySize: string;
  
  // Additional Information
  additionalRequirements: string;
  sampleRequired: boolean;
  sampleAddress: string;
  urgencyReason: string;
}

const initialFormData: RFQFormData = {
  coffeeType: '',
  grade: '',
  processingMethod: '',
  screenSize: '',
  moistureMax: null,
  defectRateMax: null,
  certifications: [],
  origin: '',
  quantity: null,
  unit: 'MT',
  tolerance: null,
  isRecurringOrder: false,
  recurringFrequency: '',
  incoterms: '',
  destinationPort: '',
  destinationCountry: '',
  preferredDeliveryDate: '',
  packaging: '',
  preferredCurrency: 'USD',
  paymentMethod: '',
  paymentTerms: '',
  companyName: '',
  contactPerson: '',
  position: '',
  email: '',
  phone: '',
  website: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  businessType: '',
  companySize: '',
  additionalRequirements: '',
  sampleRequired: false,
  sampleAddress: '',
  urgencyReason: ''
};

const steps = [
  { id: 1, title: 'Product Requirements', icon: Coffee },
  { id: 2, title: 'Quantity & Delivery', icon: Package },
  { id: 3, title: 'Payment Terms', icon: CreditCard },
  { id: 4, title: 'Company Information', icon: Building2 },
  { id: 5, title: 'Additional Details', icon: FileText }
];

export default function QuotePage({ params }: { params: { locale: Locale } }) {
  // Use the multi-step form hook
  const {
    currentStep,
    formData,
    progress,
    updateFormData,
    nextStep,
    prevStep,
    isLastStep
  } = useMultiStepForm<RFQFormData>(initialFormData, steps.length);

  // Use the RFQ form hook for submission
  const {
    loading: isSubmitting,
    success: isSubmitted,
    error: submitError,
    rfqNumber,
    submitRfq,
    clearError
  } = useRfqForm();

  const handleSubmit = async () => {
    try {
      // Map form data to RFQ request format
      const rfqRequest = {
        // Product Requirements
        productType: [formData.coffeeType],
        grade: [formData.grade],
        origin: [formData.origin],
        processingMethod: [formData.processingMethod],
        certifications: formData.certifications,
        
        // Quantity & Delivery
        quantity: formData.quantity || 0,
        quantityUnit: formData.unit,
        deliveryTerms: formData.incoterms,
        targetPrice: 0, // Will be filled by sales team
        currency: formData.preferredCurrency,
        deliveryDate: new Date(formData.preferredDeliveryDate || Date.now()),
        deliveryLocation: `${formData.destinationPort}, ${formData.destinationCountry}`,
        
        // Payment Terms
        paymentTerms: formData.paymentTerms,
        paymentMethod: [formData.paymentMethod],
        
        // Company Information
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        businessType: formData.businessType,
        
        // Additional Details
        additionalRequirements: formData.additionalRequirements,
        sampleRequired: formData.sampleRequired,
        urgency: formData.urgencyReason ? 'high' : 'medium' as 'low' | 'medium' | 'high',
        
        // Metadata
        locale: params.locale
      };

      await submitRfq(rfqRequest);
    } catch (error) {
      console.error('Failed to submit RFQ:', error);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card className="text-center">
            <CardContent className="pt-16 pb-16">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Quote Request Submitted Successfully!
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Thank you for your interest in our premium Vietnamese coffee. 
                Our team will review your requirements and respond within 24 hours.
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-600">Reference Number</p>
                <p className="text-xl font-mono font-bold text-gray-900">{rfqNumber || `RFQ-${Date.now()}`}</p>
              </div>
              <Button onClick={() => window.location.href = `/${params.locale}/products`}>
                Browse Our Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Request a Quote
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get competitive pricing for your coffee requirements. Our team will provide 
            a detailed quotation based on your specifications.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.id;
              const isCompleted = currentStep > step.id;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-2
                    ${isCompleted ? 'bg-green-500 text-white' : 
                      isActive ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'}
                  `}>
                    {isCompleted ? <CheckCircle className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
                  </div>
                  <span className={`text-sm font-medium ${isActive ? 'text-amber-600' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Form Content */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              {React.createElement(steps[currentStep - 1].icon, { className: "mr-2 h-5 w-5" })}
              {steps[currentStep - 1].title}
            </CardTitle>
            <CardDescription>
              Step {currentStep} of {steps.length}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Product Requirements */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="coffeeType">Coffee Type *</Label>
                    <Select value={formData.coffeeType} onValueChange={(value) => updateFormData('coffeeType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select coffee type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ROBUSTA">Robusta</SelectItem>
                        <SelectItem value="ARABICA">Arabica</SelectItem>
                        <SelectItem value="BLEND">Blend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="grade">Grade</Label>
                    <Select value={formData.grade} onValueChange={(value) => updateFormData('grade', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GRADE_1">Grade 1</SelectItem>
                        <SelectItem value="GRADE_2">Grade 2</SelectItem>
                        <SelectItem value="SCREEN_18">Screen 18</SelectItem>
                        <SelectItem value="SCREEN_16">Screen 16</SelectItem>
                        <SelectItem value="SCREEN_13">Screen 13</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="processingMethod">Processing Method</Label>
                    <Select value={formData.processingMethod} onValueChange={(value) => updateFormData('processingMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select processing method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="WASHED">Washed</SelectItem>
                        <SelectItem value="NATURAL">Natural</SelectItem>
                        <SelectItem value="HONEY">Honey</SelectItem>
                        <SelectItem value="WET_HULLED">Wet Hulled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="origin">Origin Region</Label>
                    <Select value={formData.origin} onValueChange={(value) => updateFormData('origin', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select origin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DAK_LAK">Dak Lak</SelectItem>
                        <SelectItem value="GIA_LAI">Gia Lai</SelectItem>
                        <SelectItem value="DAK_NONG">Dak Nong</SelectItem>
                        <SelectItem value="LAM_DONG">Lam Dong</SelectItem>
                        <SelectItem value="KON_TUM">Kon Tum</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="moistureMax">Maximum Moisture Content (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      max="20"
                      value={formData.moistureMax || ''}
                      onChange={(e) => updateFormData('moistureMax', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="e.g., 12.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="defectRateMax">Maximum Defect Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      max="100"
                      value={formData.defectRateMax || ''}
                      onChange={(e) => updateFormData('defectRateMax', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="e.g., 5.0"
                    />
                  </div>
                </div>

                <div>
                  <Label>Required Certifications</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {['ORGANIC', 'FAIR_TRADE', 'RAINFOREST_ALLIANCE', 'UTZ', '4C', 'KOSHER'].map((cert) => (
                      <div key={cert} className="flex items-center space-x-2">
                        <Checkbox
                          id={cert}
                          checked={formData.certifications.includes(cert)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              updateFormData('certifications', [...formData.certifications, cert]);
                            } else {
                              updateFormData('certifications', formData.certifications.filter(c => c !== cert));
                            }
                          }}
                        />
                        <Label htmlFor={cert} className="text-sm">
                          {cert.replace('_', ' ')}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Quantity & Delivery */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      type="number"
                      value={formData.quantity || ''}
                      onChange={(e) => updateFormData('quantity', e.target.value ? parseFloat(e.target.value) : null)}
                      placeholder="Enter quantity"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select value={formData.unit} onValueChange={(value) => updateFormData('unit', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MT">Metric Tons (MT)</SelectItem>
                        <SelectItem value="KG">Kilograms (KG)</SelectItem>
                        <SelectItem value="LB">Pounds (LB)</SelectItem>
                        <SelectItem value="BAGS">Bags (60kg)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isRecurringOrder"
                    checked={formData.isRecurringOrder}
                    onCheckedChange={(checked) => updateFormData('isRecurringOrder', checked)}
                  />
                  <Label htmlFor="isRecurringOrder">This is a recurring order</Label>
                </div>

                {formData.isRecurringOrder && (
                  <div>
                    <Label htmlFor="recurringFrequency">Recurring Frequency</Label>
                    <Select value={formData.recurringFrequency} onValueChange={(value) => updateFormData('recurringFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                        <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        <SelectItem value="SEMI_ANNUAL">Semi-Annual</SelectItem>
                        <SelectItem value="ANNUAL">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="incoterms">Incoterms *</Label>
                    <Select value={formData.incoterms} onValueChange={(value) => updateFormData('incoterms', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select incoterms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FOB">FOB - Free on Board</SelectItem>
                        <SelectItem value="CIF">CIF - Cost, Insurance and Freight</SelectItem>
                        <SelectItem value="CFR">CFR - Cost and Freight</SelectItem>
                        <SelectItem value="EXW">EXW - Ex Works</SelectItem>
                        <SelectItem value="FCA">FCA - Free Carrier</SelectItem>
                        <SelectItem value="DAP">DAP - Delivered at Place</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="packaging">Packaging *</Label>
                    <Select value={formData.packaging} onValueChange={(value) => updateFormData('packaging', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select packaging" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JUTE_BAGS_60KG">Jute Bags (60kg)</SelectItem>
                        <SelectItem value="JUTE_BAGS_69KG">Jute Bags (69kg)</SelectItem>
                        <SelectItem value="PP_BAGS_60KG">PP Bags (60kg)</SelectItem>
                        <SelectItem value="BULK_CONTAINER">Bulk Container</SelectItem>
                        <SelectItem value="VACUUM_BAGS">Vacuum Bags</SelectItem>
                        <SelectItem value="CUSTOM_PACKAGING">Custom Packaging</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="destinationCountry">Destination Country *</Label>
                    <Input
                      value={formData.destinationCountry}
                      onChange={(e) => updateFormData('destinationCountry', e.target.value)}
                      placeholder="Enter destination country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="destinationPort">Destination Port *</Label>
                    <Input
                      value={formData.destinationPort}
                      onChange={(e) => updateFormData('destinationPort', e.target.value)}
                      placeholder="Enter destination port"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="preferredDeliveryDate">Preferred Delivery Date</Label>
                  <Input
                    type="date"
                    value={formData.preferredDeliveryDate}
                    onChange={(e) => updateFormData('preferredDeliveryDate', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Payment Terms */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                    <Select value={formData.preferredCurrency} onValueChange={(value) => updateFormData('preferredCurrency', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <Select value={formData.paymentMethod} onValueChange={(value) => updateFormData('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LC">Letter of Credit (LC)</SelectItem>
                        <SelectItem value="TT">Telegraphic Transfer (TT)</SelectItem>
                        <SelectItem value="CAD">Cash Against Documents (CAD)</SelectItem>
                        <SelectItem value="DP">Documents against Payment (DP)</SelectItem>
                        <SelectItem value="DA">Documents against Acceptance (DA)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentTerms">Payment Terms</Label>
                  <Textarea
                    value={formData.paymentTerms}
                    onChange={(e) => updateFormData('paymentTerms', e.target.value)}
                    placeholder="e.g., 30% advance payment, 70% against shipping documents"
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Company Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      value={formData.companyName}
                      onChange={(e) => updateFormData('companyName', e.target.value)}
                      placeholder="Enter company name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Select value={formData.businessType} onValueChange={(value) => updateFormData('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IMPORTER">Importer</SelectItem>
                        <SelectItem value="DISTRIBUTOR">Distributor</SelectItem>
                        <SelectItem value="ROASTER">Roaster</SelectItem>
                        <SelectItem value="RETAILER">Retailer</SelectItem>
                        <SelectItem value="MANUFACTURER">Manufacturer</SelectItem>
                        <SelectItem value="TRADER">Trader</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input
                      value={formData.contactPerson}
                      onChange={(e) => updateFormData('contactPerson', e.target.value)}
                      placeholder="Enter contact person name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="position">Position</Label>
                    <Input
                      value={formData.position}
                      onChange={(e) => updateFormData('position', e.target.value)}
                      placeholder="Enter position/title"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => updateFormData('website', e.target.value)}
                    placeholder="https://www.company.com"
                  />
                </div>

                <div className="space-y-4">
                  <Label>Company Address</Label>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      value={formData.street}
                      onChange={(e) => updateFormData('street', e.target.value)}
                      placeholder="Street address"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        value={formData.city}
                        onChange={(e) => updateFormData('city', e.target.value)}
                        placeholder="City"
                      />
                      <Input
                        value={formData.state}
                        onChange={(e) => updateFormData('state', e.target.value)}
                        placeholder="State/Province"
                      />
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => updateFormData('postalCode', e.target.value)}
                        placeholder="Postal code"
                      />
                    </div>
                    <Input
                      value={formData.country}
                      onChange={(e) => updateFormData('country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="companySize">Company Size</Label>
                  <Select value={formData.companySize} onValueChange={(value) => updateFormData('companySize', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select company size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="STARTUP">Startup (1-10 employees)</SelectItem>
                      <SelectItem value="SMALL">Small (11-50 employees)</SelectItem>
                      <SelectItem value="MEDIUM">Medium (51-200 employees)</SelectItem>
                      <SelectItem value="LARGE">Large (201-1000 employees)</SelectItem>
                      <SelectItem value="ENTERPRISE">Enterprise (1000+ employees)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 5: Additional Details */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                  <Textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
                    placeholder="Please specify any additional requirements, quality standards, or special instructions..."
                    rows={4}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sampleRequired"
                    checked={formData.sampleRequired}
                    onCheckedChange={(checked) => updateFormData('sampleRequired', checked)}
                  />
                  <Label htmlFor="sampleRequired">I would like to request a sample</Label>
                </div>

                {formData.sampleRequired && (
                  <div>
                    <Label htmlFor="sampleAddress">Sample Delivery Address</Label>
                    <Textarea
                      value={formData.sampleAddress}
                      onChange={(e) => updateFormData('sampleAddress', e.target.value)}
                      placeholder="Enter complete address for sample delivery..."
                      rows={3}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="urgencyReason">Urgency Reason (if applicable)</Label>
                  <Textarea
                    value={formData.urgencyReason}
                    onChange={(e) => updateFormData('urgencyReason', e.target.value)}
                    placeholder="If this is an urgent request, please explain the reason..."
                    rows={3}
                  />
                </div>

                {/* Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Request Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Coffee Type:</span> {formData.coffeeType || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Quantity:</span> {formData.quantity || 'Not specified'} {formData.unit}
                    </div>
                    <div>
                      <span className="font-medium">Destination:</span> {formData.destinationPort || 'Not specified'}
                    </div>
                    <div>
                      <span className="font-medium">Company:</span> {formData.companyName || 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {submitError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Error submitting request
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{submitError}</p>
                    </div>
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearError}
                        className="text-red-800 border-red-300 hover:bg-red-50"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1 || isSubmitting}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              
              {currentStep < steps.length ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="min-w-[140px]">
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}