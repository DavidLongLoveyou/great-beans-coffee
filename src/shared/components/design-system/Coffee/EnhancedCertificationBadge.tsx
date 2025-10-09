'use client';

import {
  ExternalLink,
  Info,
  Award,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import React, { forwardRef, useState } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';
import { cn } from '@/shared/utils/cn';

import { CertificationBadgeProps, CoffeeCertification } from '../types';

// Enhanced certification metadata with B2B-focused information
const enhancedCertificationData: Record<
  CoffeeCertification,
  {
    label: string;
    color: string;
    bgColor: string;
    description: string;
    icon: string;
    fullDescription: string;
    benefits: string[];
    verificationUrl?: string;
    certifyingBody: string;
    validityPeriod: string;
    marketPremium: string;
    recognizedMarkets: string[];
    requirements: string[];
    auditFrequency: string;
    businessValue: string;
  }
> = {
  organic: {
    label: 'Organic',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'USDA Organic Certified',
    icon: '🌱',
    fullDescription:
      'Certified organic coffee grown without synthetic pesticides, herbicides, or fertilizers. Meets strict USDA organic standards for soil health, biodiversity, and sustainable farming practices.',
    benefits: [
      'Premium market positioning',
      'Access to organic specialty markets',
      'Higher consumer willingness to pay',
      'Sustainable farming practices',
      'Soil health improvement',
    ],
    verificationUrl: 'https://organic.ams.usda.gov/integrity/',
    certifyingBody: 'USDA National Organic Program',
    validityPeriod: '1 year (renewable)',
    marketPremium: '15-25% above conventional',
    recognizedMarkets: ['USA', 'EU', 'Canada', 'Japan', 'Australia'],
    requirements: [
      'No synthetic chemicals for 3+ years',
      'Organic system plan',
      'Annual inspections',
      'Detailed record keeping',
    ],
    auditFrequency: 'Annual',
    businessValue:
      'Access to premium organic markets with higher profit margins',
  },
  'fair-trade': {
    label: 'Fair Trade',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    description: 'Fair Trade Certified',
    icon: '🤝',
    fullDescription:
      'Fair Trade certification ensures farmers receive fair prices, safe working conditions, and community development support. Promotes sustainable livelihoods and environmental protection.',
    benefits: [
      'Guaranteed minimum price',
      'Social premium for community projects',
      'Long-term trading relationships',
      'Worker welfare standards',
      'Environmental protection',
    ],
    verificationUrl:
      'https://www.fairtradecertified.org/business/verify-products',
    certifyingBody: 'Fairtrade International',
    validityPeriod: '3 years (renewable)',
    marketPremium: '10-20% above market price',
    recognizedMarkets: ['Global - 70+ countries'],
    requirements: [
      'Minimum price guarantee',
      'Social premium payment',
      'Democratic organization',
      'Environmental standards',
    ],
    auditFrequency: 'Every 3 years',
    businessValue: 'Access to ethical consumer markets and stable pricing',
  },
  'rainforest-alliance': {
    label: 'Rainforest Alliance',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'Rainforest Alliance Certified',
    icon: '🐸',
    fullDescription:
      'Rainforest Alliance certification promotes biodiversity conservation, improved livelihoods, and responsible business practices throughout the coffee supply chain.',
    benefits: [
      'Biodiversity conservation',
      'Climate change mitigation',
      'Human rights protection',
      'Improved farm productivity',
      'Market access to sustainability-focused buyers',
    ],
    verificationUrl:
      'https://www.rainforest-alliance.org/business/verification/',
    certifyingBody: 'Rainforest Alliance',
    validityPeriod: '3 years (renewable)',
    marketPremium: '8-15% above conventional',
    recognizedMarkets: ['Global', 'Strong in EU and North America'],
    requirements: [
      'Forest and biodiversity protection',
      'Soil and water conservation',
      'Worker rights and welfare',
      'Integrated pest management',
    ],
    auditFrequency: 'Every 3 years',
    businessValue:
      'Enhanced brand reputation and access to sustainability-conscious markets',
  },
  utz: {
    label: 'UTZ',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-200',
    description: 'UTZ Certified',
    icon: '🌍',
    fullDescription:
      'UTZ certification (now part of Rainforest Alliance) focuses on responsible farming practices, better opportunities for farmers, and a better environment.',
    benefits: [
      'Improved farming practices',
      'Better crop quality and yield',
      'Traceability throughout supply chain',
      'Professional farm management',
      'Market access to major brands',
    ],
    verificationUrl:
      'https://www.rainforest-alliance.org/business/verification/',
    certifyingBody: 'Rainforest Alliance (formerly UTZ)',
    validityPeriod: '3 years (renewable)',
    marketPremium: '5-12% above conventional',
    recognizedMarkets: ['Global', 'Strong in Europe'],
    requirements: [
      'Good agricultural practices',
      'Proper record keeping',
      'Safe working conditions',
      'Environmental protection',
    ],
    auditFrequency: 'Every 3 years',
    businessValue:
      'Improved efficiency and access to mainstream sustainable markets',
  },
  'bird-friendly': {
    label: 'Bird Friendly',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 border-emerald-200',
    description: 'Smithsonian Bird Friendly',
    icon: '🐦',
    fullDescription:
      'Bird Friendly certification by the Smithsonian Migratory Bird Center ensures coffee is grown under a canopy of trees, providing habitat for migratory birds.',
    benefits: [
      'Biodiversity conservation',
      'Migratory bird habitat protection',
      'Premium specialty market access',
      'Carbon sequestration',
      'Soil erosion prevention',
    ],
    verificationUrl:
      'https://nationalzoo.si.edu/migratory-birds/bird-friendly-coffee',
    certifyingBody: 'Smithsonian Migratory Bird Center',
    validityPeriod: '3 years (renewable)',
    marketPremium: '20-30% above conventional',
    recognizedMarkets: ['USA', 'Canada', 'Specialty markets globally'],
    requirements: [
      'Must also be organic certified',
      'Minimum 40% shade cover',
      'Native tree species diversity',
      'Specific canopy height requirements',
    ],
    auditFrequency: 'Every 3 years',
    businessValue:
      'Access to premium specialty and conservation-focused markets',
  },
  'shade-grown': {
    label: 'Shade Grown',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'Shade Grown Coffee',
    icon: '🌳',
    fullDescription:
      'Shade grown coffee is cultivated under a canopy of trees, promoting biodiversity, soil health, and sustainable farming practices.',
    benefits: [
      'Enhanced biodiversity',
      'Natural pest control',
      'Soil conservation',
      'Carbon sequestration',
      'Premium quality beans',
    ],
    certifyingBody: 'Various certification bodies',
    validityPeriod: 'Varies by certifier',
    marketPremium: '10-20% above sun-grown',
    recognizedMarkets: ['Specialty coffee markets globally'],
    requirements: [
      'Minimum tree canopy coverage',
      'Native tree species',
      'Biodiversity conservation',
      'Sustainable farming practices',
    ],
    auditFrequency: 'Varies by certifier',
    businessValue: 'Access to environmentally conscious specialty markets',
  },
  'direct-trade': {
    label: 'Direct Trade',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-200',
    description: 'Direct Trade Partnership',
    icon: '🤝',
    fullDescription:
      'Direct Trade represents long-term partnerships between coffee roasters and farmers, ensuring fair prices, quality focus, and sustainable relationships.',
    benefits: [
      'Higher prices for farmers',
      'Quality-focused production',
      'Long-term relationships',
      'Transparency in supply chain',
      'Sustainable farming support',
    ],
    certifyingBody: 'Individual roaster standards',
    validityPeriod: 'Ongoing partnership',
    marketPremium: '15-40% above commodity',
    recognizedMarkets: ['Specialty coffee markets'],
    requirements: [
      'Direct relationship with farmers',
      'Above fair trade minimum prices',
      'Quality standards',
      'Sustainability practices',
    ],
    auditFrequency: 'Ongoing monitoring',
    businessValue: 'Premium pricing and long-term buyer relationships',
  },
  'c-cafe': {
    label: 'C.A.F.E.',
    color: 'text-coffee-700',
    bgColor: 'bg-coffee-100 border-coffee-200',
    description: 'C.A.F.E. Practices',
    icon: '☕',
    fullDescription:
      'Coffee and Farmer Equity (C.A.F.E.) Practices is a comprehensive set of guidelines that help farmers grow coffee in a way that is better for people and the planet.',
    benefits: [
      'Social responsibility standards',
      'Environmental leadership',
      'Economic accountability',
      'Quality standards',
      'Access to major coffee chains',
    ],
    verificationUrl: 'https://www.starbucks.com/responsibility/sourcing/coffee',
    certifyingBody: 'Starbucks Coffee Company',
    validityPeriod: '1 year (renewable)',
    marketPremium: '5-15% above conventional',
    recognizedMarkets: ['Starbucks and partner networks'],
    requirements: [
      'Product quality standards',
      'Economic accountability',
      'Social responsibility',
      'Environmental leadership',
    ],
    auditFrequency: 'Annual',
    businessValue: 'Access to Starbucks supply chain and similar programs',
  },
  '4c': {
    label: '4C',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100 border-teal-200',
    description: '4C Association',
    icon: '🌐',
    fullDescription:
      '4C Association promotes sustainability in the coffee sector through a global platform that brings together producers, trade, and industry.',
    benefits: [
      'Baseline sustainability standards',
      'Capacity building support',
      'Market access improvement',
      'Risk mitigation',
      'Continuous improvement',
    ],
    verificationUrl: 'https://www.4c-services.org/',
    certifyingBody: '4C Services',
    validityPeriod: '3 years (renewable)',
    marketPremium: '3-8% above conventional',
    recognizedMarkets: ['Global mainstream markets'],
    requirements: [
      'Basic sustainability practices',
      'Social criteria compliance',
      'Environmental protection',
      'Economic viability',
    ],
    auditFrequency: 'Every 3 years',
    businessValue:
      'Entry-level sustainability certification for mainstream markets',
  },
  'iso-22000': {
    label: 'ISO 22000',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'Food Safety Management',
    icon: '🛡️',
    fullDescription:
      'ISO 22000 specifies requirements for a food safety management system that combines HACCP principles with prerequisite programs.',
    benefits: [
      'Food safety assurance',
      'Risk management',
      'Regulatory compliance',
      'Customer confidence',
      'International recognition',
    ],
    verificationUrl:
      'https://www.iso.org/iso-22000-food-safety-management.html',
    certifyingBody: 'ISO Accredited Bodies',
    validityPeriod: '3 years (renewable)',
    marketPremium: 'Quality assurance value',
    recognizedMarkets: ['Global B2B markets'],
    requirements: [
      'HACCP implementation',
      'Prerequisite programs',
      'Management system',
      'Continuous improvement',
    ],
    auditFrequency: 'Annual surveillance, 3-year renewal',
    businessValue: 'Essential for B2B food safety compliance and market access',
  },
  haccp: {
    label: 'HACCP',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'Hazard Analysis Critical Control Points',
    icon: '✅',
    fullDescription:
      'HACCP is a systematic approach to food safety that identifies, evaluates, and controls hazards throughout the food production process.',
    benefits: [
      'Food safety assurance',
      'Hazard prevention',
      'Regulatory compliance',
      'Quality consistency',
      'Risk reduction',
    ],
    certifyingBody: 'Various accredited bodies',
    validityPeriod: 'Ongoing system',
    marketPremium: 'Quality assurance value',
    recognizedMarkets: ['Global food industry'],
    requirements: [
      'Hazard analysis',
      'Critical control points',
      'Monitoring procedures',
      'Corrective actions',
    ],
    auditFrequency: 'Regular internal audits',
    businessValue: 'Fundamental food safety system for B2B markets',
  },
  brc: {
    label: 'BRC',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'British Retail Consortium',
    icon: '🏆',
    fullDescription:
      'BRC Global Standard for Food Safety provides a framework to manage product safety, integrity, legality, and quality.',
    benefits: [
      'Retailer acceptance',
      'Food safety excellence',
      'Brand protection',
      'Operational efficiency',
      'Global recognition',
    ],
    verificationUrl: 'https://www.brcgs.com/',
    certifyingBody: 'BRC Global Standards',
    validityPeriod: '1 year (renewable)',
    marketPremium: 'Market access value',
    recognizedMarkets: ['UK, EU, Global retail'],
    requirements: [
      'HACCP system',
      'Quality management',
      'Factory environment',
      'Product control',
    ],
    auditFrequency: 'Annual',
    businessValue: 'Essential for UK/EU retail market access',
  },
  ifs: {
    label: 'IFS',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'International Featured Standards',
    icon: '⭐',
    fullDescription:
      'IFS Food Standard ensures food safety and quality of processes and products, focusing on companies processing food or packaging loose food products.',
    benefits: [
      'European market access',
      'Food safety assurance',
      'Quality management',
      'Retailer recognition',
      'Operational excellence',
    ],
    verificationUrl: 'https://www.ifs-certification.com/',
    certifyingBody: 'IFS Management',
    validityPeriod: '1 year (renewable)',
    marketPremium: 'Market access value',
    recognizedMarkets: ['Germany, France, EU'],
    requirements: [
      'Quality management system',
      'HACCP implementation',
      'Resource management',
      'Product realization',
    ],
    auditFrequency: 'Annual',
    businessValue: 'Critical for European food retail market access',
  },
};

// Enhanced Certification Badge Component
export const EnhancedCertificationBadge = forwardRef<
  HTMLSpanElement,
  CertificationBadgeProps & {
    showDetails?: boolean;
    expiryDate?: Date;
    certificateNumber?: string;
    issuedBy?: string;
  }
>(
  (
    {
      className,
      certification,
      size = 'md',
      showDetails = false,
      expiryDate,
      certificateNumber,
      issuedBy: _issuedBy,
      ...props
    },
    ref
  ) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const certData = enhancedCertificationData[certification];

    if (!certData) {
      return null;
    }

    const isExpiringSoon =
      expiryDate &&
      new Date(expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const isExpired = expiryDate && new Date(expiryDate) < new Date();

    const badgeSizes = {
      xs: 'px-1.5 py-0.5 text-xs',
      sm: 'px-2 py-1 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-sm',
      xl: 'px-4 py-2 text-base',
      '2xl': 'px-5 py-2.5 text-lg',
      '3xl': 'px-6 py-3 text-xl',
    };

    const BadgeContent = () => (
      <span
        className={cn(
          // Base styles
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full border font-medium',
          'transition-all duration-200 ease-in-out hover:shadow-md',

          // Size styles
          badgeSizes[size],

          // Certification-specific colors
          isExpired
            ? 'border-red-200 bg-red-100 text-red-700'
            : isExpiringSoon
              ? 'border-yellow-200 bg-yellow-100 text-yellow-700'
              : certData.color,
          isExpired
            ? 'border-red-200 bg-red-100'
            : isExpiringSoon
              ? 'border-yellow-200 bg-yellow-100'
              : certData.bgColor,

          className
        )}
        title={certData.description}
        ref={ref}
        {...props}
      >
        {/* Icon */}
        <span className="flex-shrink-0">{certData.icon}</span>

        {/* Label */}
        <span>{certData.label}</span>

        {/* Status indicator */}
        {(isExpired || isExpiringSoon) && <AlertTriangle className="h-3 w-3" />}

        {/* Info icon for details */}
        {showDetails && <Info className="h-3 w-3 opacity-70" />}
      </span>
    );

    if (!showDetails) {
      return <BadgeContent />;
    }

    return (
      <TooltipProvider>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <BadgeContent />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Click for detailed certification information</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </DialogTrigger>

          <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <span className="text-2xl">{certData.icon}</span>
                {certData.label} Certification
                {isExpired && <Badge variant="destructive">Expired</Badge>}
                {isExpiringSoon && !isExpired && (
                  <Badge variant="secondary">Expiring Soon</Badge>
                )}
              </DialogTitle>
              <DialogDescription>{certData.fullDescription}</DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Certification Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Certification Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Certifying Body:</strong>
                    <p className="text-sm text-muted-foreground">
                      {certData.certifyingBody}
                    </p>
                  </div>
                  <div>
                    <strong>Validity Period:</strong>
                    <p className="text-sm text-muted-foreground">
                      {certData.validityPeriod}
                    </p>
                  </div>
                  <div>
                    <strong>Audit Frequency:</strong>
                    <p className="text-sm text-muted-foreground">
                      {certData.auditFrequency}
                    </p>
                  </div>
                  {certificateNumber && (
                    <div>
                      <strong>Certificate Number:</strong>
                      <p className="text-sm text-muted-foreground">
                        {certificateNumber}
                      </p>
                    </div>
                  )}
                  {expiryDate && (
                    <div>
                      <strong>Expiry Date:</strong>
                      <p
                        className={cn(
                          'text-sm',
                          isExpired
                            ? 'text-red-600'
                            : isExpiringSoon
                              ? 'text-yellow-600'
                              : 'text-muted-foreground'
                        )}
                      >
                        {expiryDate.toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {certData.verificationUrl && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        window.open(certData.verificationUrl, '_blank')
                      }
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify Certificate
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Business Value */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Business Value
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <strong>Market Premium:</strong>
                    <p className="text-sm text-muted-foreground">
                      {certData.marketPremium}
                    </p>
                  </div>
                  <div>
                    <strong>Business Value:</strong>
                    <p className="text-sm text-muted-foreground">
                      {certData.businessValue}
                    </p>
                  </div>
                  <div>
                    <strong>Recognized Markets:</strong>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {certData.recognizedMarkets.map(market => (
                        <Badge
                          key={`market-${market}`}
                          variant="outline"
                          className="text-xs"
                        >
                          {market}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Benefits</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {certData.benefits.map(benefit => (
                      <li
                        key={`benefit-${benefit.slice(0, 30)}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Key Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {certData.requirements.map(requirement => (
                      <li
                        key={`requirement-${requirement.slice(0, 30)}`}
                        className="flex items-start gap-2 text-sm"
                      >
                        <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-blue-600" />
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </DialogContent>
        </Dialog>
      </TooltipProvider>
    );
  }
);

EnhancedCertificationBadge.displayName = 'EnhancedCertificationBadge';

// Enhanced Certification List Component
export const EnhancedCertificationList = forwardRef<
  HTMLDivElement,
  {
    certifications: Array<{
      type: CoffeeCertification;
      expiryDate?: Date;
      certificateNumber?: string;
      issuedBy?: string;
    }>;
    size?: CertificationBadgeProps['size'];
    limit?: number;
    showDetails?: boolean;
    className?: string;
  }
>(
  (
    {
      certifications,
      size = 'sm',
      limit,
      showDetails = false,
      className,
      ...props
    },
    ref
  ) => {
    const displayCertifications = limit
      ? certifications.slice(0, limit)
      : certifications;

    const remainingCount =
      limit && certifications.length > limit
        ? certifications.length - limit
        : 0;

    return (
      <div
        className={cn('flex flex-wrap gap-2', className)}
        ref={ref}
        {...props}
      >
        {displayCertifications.map((cert, index) => (
          <EnhancedCertificationBadge
            key={`${cert.type}-${cert.certificateNumber || cert.issuedBy || index}`}
            certification={cert.type}
            size={size}
            showDetails={showDetails}
            {...(cert.expiryDate && { expiryDate: cert.expiryDate })}
            {...(cert.certificateNumber && {
              certificateNumber: cert.certificateNumber,
            })}
            {...(cert.issuedBy && { issuedBy: cert.issuedBy })}
          />
        ))}

        {remainingCount > 0 && (
          <span
            className={cn(
              'inline-flex items-center rounded-full border border-muted bg-muted/50 font-medium text-muted-foreground',
              size === 'xs' && 'px-1.5 py-0.5 text-xs',
              size === 'sm' && 'px-2 py-1 text-xs',
              size === 'md' && 'px-2.5 py-1 text-sm',
              size === 'lg' && 'px-3 py-1.5 text-sm'
            )}
          >
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  }
);

EnhancedCertificationList.displayName = 'EnhancedCertificationList';
