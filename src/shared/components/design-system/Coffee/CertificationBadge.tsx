'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { CertificationBadgeProps, CoffeeCertification } from '../types';

// Certification metadata
const certificationData: Record<
  CoffeeCertification,
  {
    label: string;
    color: string;
    bgColor: string;
    description: string;
    icon?: string;
  }
> = {
  organic: {
    label: 'Organic',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'USDA Organic Certified',
    icon: '🌱',
  },
  'fair-trade': {
    label: 'Fair Trade',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-200',
    description: 'Fair Trade Certified',
    icon: '🤝',
  },
  'rainforest-alliance': {
    label: 'Rainforest Alliance',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'Rainforest Alliance Certified',
    icon: '🐸',
  },
  utz: {
    label: 'UTZ',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-200',
    description: 'UTZ Certified',
    icon: '🌍',
  },
  'bird-friendly': {
    label: 'Bird Friendly',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 border-emerald-200',
    description: 'Smithsonian Bird Friendly',
    icon: '🐦',
  },
  'shade-grown': {
    label: 'Shade Grown',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-200',
    description: 'Shade Grown Coffee',
    icon: '🌳',
  },
  'direct-trade': {
    label: 'Direct Trade',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100 border-purple-200',
    description: 'Direct Trade Partnership',
    icon: '🤝',
  },
  'c-cafe': {
    label: 'C.A.F.E.',
    color: 'text-coffee-700',
    bgColor: 'bg-coffee-100 border-coffee-200',
    description: 'C.A.F.E. Practices',
    icon: '☕',
  },
  '4c': {
    label: '4C',
    color: 'text-teal-700',
    bgColor: 'bg-teal-100 border-teal-200',
    description: '4C Association',
    icon: '🌐',
  },
  'iso-22000': {
    label: 'ISO 22000',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'Food Safety Management',
    icon: '🛡️',
  },
  haccp: {
    label: 'HACCP',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'Hazard Analysis Critical Control Points',
    icon: '✅',
  },
  brc: {
    label: 'BRC',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'British Retail Consortium',
    icon: '🏆',
  },
  ifs: {
    label: 'IFS',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-200',
    description: 'International Featured Standards',
    icon: '⭐',
  },
};

// Badge size styles
const badgeSizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
  xl: 'px-4 py-2 text-base',
  '2xl': 'px-5 py-2.5 text-lg',
  '3xl': 'px-6 py-3 text-xl',
};

export const CertificationBadge = forwardRef<
  HTMLSpanElement,
  CertificationBadgeProps
>(({ className, certification, size = 'md', ...props }, ref) => {
  const certData = certificationData[certification];

  if (!certData) {
    return null;
  }

  return (
    <span
      className={cn(
        // Base styles
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        'transition-all duration-200 ease-in-out',

        // Size styles
        badgeSizes[size],

        // Certification-specific colors
        certData.color,
        certData.bgColor,

        className
      )}
      title={certData.description}
      ref={ref}
      {...props}
    >
      {/* Icon */}
      {certData.icon && <span className="flex-shrink-0">{certData.icon}</span>}

      {/* Label */}
      <span>{certData.label}</span>
    </span>
  );
});

CertificationBadge.displayName = 'CertificationBadge';

// Certification List Component
export const CertificationList = forwardRef<
  HTMLDivElement,
  {
    certifications: CoffeeCertification[];
    size?: CertificationBadgeProps['size'];
    limit?: number;
    className?: string;
  }
>(({ certifications, size = 'sm', limit, className, ...props }, ref) => {
  const displayCertifications = limit
    ? certifications.slice(0, limit)
    : certifications;

  const remainingCount =
    limit && certifications.length > limit ? certifications.length - limit : 0;

  return (
    <div className={cn('flex flex-wrap gap-2', className)} ref={ref} {...props}>
      {displayCertifications.map(cert => (
        <CertificationBadge key={cert} certification={cert} size={size} />
      ))}

      {remainingCount > 0 && (
        <span
          className={cn(
            'inline-flex items-center rounded-full border border-muted bg-muted/50 font-medium text-muted-foreground',
            badgeSizes[size]
          )}
        >
          +{remainingCount} more
        </span>
      )}
    </div>
  );
});

CertificationList.displayName = 'CertificationList';

// Premium Certification Showcase
export const PremiumCertificationShowcase = forwardRef<
  HTMLDivElement,
  {
    certifications: CoffeeCertification[];
    className?: string;
  }
>(({ certifications, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-4 p-6 md:grid-cols-3 lg:grid-cols-4',
        'rounded-lg border border-gold-200 bg-gradient-to-br from-gold-50 to-coffee-50',
        className
      )}
      ref={ref}
      {...props}
    >
      {certifications.map(cert => {
        const certData = certificationData[cert];
        return (
          <div
            key={cert}
            className="flex flex-col items-center rounded-lg bg-white p-4 text-center shadow-soft transition-shadow hover:shadow-medium"
          >
            <div className="mb-2 text-3xl">{certData.icon}</div>
            <div className="mb-1 text-sm font-semibold text-coffee-700">
              {certData.label}
            </div>
            <div className="text-xs text-muted-foreground">
              {certData.description}
            </div>
          </div>
        );
      })}
    </div>
  );
});

PremiumCertificationShowcase.displayName = 'PremiumCertificationShowcase';
