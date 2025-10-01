'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { CoffeeButton } from '@/shared/components/design-system/Button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/design-system/Card';

export interface ClusterService {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  features: string[];
  capabilities: {
    minimum: string;
    maximum: string;
    leadTime: string;
  };
  certifications: string[];
  pricing: {
    model: string;
    startingPrice?: string;
  };
  isPopular?: boolean;
}

interface ClusterServiceCardProps {
  service: ClusterService;
  locale: string;
}

export function ClusterServiceCard({
  service,
  locale,
}: ClusterServiceCardProps) {
  const t = useTranslations('clusters');

  return (
    <Card variant="elevated" hover className="h-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-coffee-100">
              {service.icon}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-coffee-800">
                {service.name}
              </CardTitle>
              <Badge variant="outline" className="mt-1">
                {service.category}
              </Badge>
            </div>
          </div>
          {service.isPopular && (
            <Badge className="bg-gold-500 text-white">Popular</Badge>
          )}
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {service.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Service Capabilities */}
        <div className="rounded-lg bg-coffee-50 p-3">
          <h4 className="mb-2 text-sm font-medium text-coffee-800">
            Capacity & Timeline
          </h4>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Minimum:</span>
              <span className="font-medium">
                {service.capabilities.minimum}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Maximum:</span>
              <span className="font-medium">
                {service.capabilities.maximum}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lead Time:</span>
              <span className="font-medium">
                {service.capabilities.leadTime}
              </span>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="mb-2 text-sm font-medium text-coffee-800">
            Key Features
          </h4>
          <ul className="space-y-1">
            {service.features.slice(0, 4).map(feature => (
              <li key={feature} className="flex items-center text-sm">
                <CheckCircle className="mr-2 h-3 w-3 flex-shrink-0 text-green-500" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
            {service.features.length > 4 && (
              <li className="ml-5 text-xs text-muted-foreground">
                +{service.features.length - 4} more features
              </li>
            )}
          </ul>
        </div>

        {/* Certifications */}
        {service.certifications.length > 0 && (
          <div>
            <h4 className="mb-2 text-sm font-medium text-coffee-800">
              Certifications
            </h4>
            <div className="flex flex-wrap gap-1">
              {service.certifications.map(cert => (
                <Badge key={cert} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Pricing Information */}
        <div className="rounded-lg border border-gold-200 bg-gold-50 p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-coffee-800">
                {service.pricing.model}
              </span>
              {service.pricing.startingPrice && (
                <div className="text-xs text-muted-foreground">
                  Starting from {service.pricing.startingPrice}
                </div>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              Custom Quote
            </Badge>
          </div>
        </div>
      </CardContent>

      <CardContent className="pt-0">
        <div className="flex gap-2">
          <Link href={`/${locale}/services/${service.id}`} className="flex-1">
            <CoffeeButton variant="outline" size="sm" className="w-full">
              {t('learnMore')}
            </CoffeeButton>
          </Link>
          <Link
            href={`/${locale}/quote?service=${service.id}`}
            className="flex-1"
          >
            <CoffeeButton size="sm" className="w-full">
              Get Quote
              <ArrowRight className="ml-1 h-3 w-3" />
            </CoffeeButton>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
