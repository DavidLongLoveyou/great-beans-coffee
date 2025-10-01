'use client';

import { Download, Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import {
  CoffeeButton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  RequestQuoteButton,
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
} from '@/shared/components/design-system';
import type { ProcessingMethod } from '@/shared/components/design-system/types';

export interface ClusterProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: string;
  grade: string;
  origin: {
    country: string;
    region: string;
  };
  processingMethod: string;
  certifications: string[];
  specifications: {
    moisture: string;
    screenSize: string;
    defectRate: string;
    cuppingScore?: number;
  };
  features: string[];
  inStock: boolean;
  leadTime: string;
  isFeatured?: boolean;
}

interface ClusterProductCardProps {
  product: ClusterProduct;
  locale: string;
}

export function ClusterProductCard({
  product,
  locale,
}: ClusterProductCardProps) {
  const t = useTranslations('clusters');

  return (
    <Card variant="product" hover className="h-full">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
        {product.isFeatured && (
          <Badge className="absolute left-3 top-3 bg-gold-500 text-white">
            Featured
          </Badge>
        )}
        <Badge
          variant={product.inStock ? 'default' : 'destructive'}
          className="absolute right-3 top-3"
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>

      <CardHeader className="pb-4">
        <CardTitle className="line-clamp-2 text-lg font-semibold text-coffee-800">
          {product.name}
        </CardTitle>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="text-sm font-medium text-coffee-600">
          {product.price}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quality Indicators */}
        <div className="flex flex-wrap gap-2">
          <CoffeeGradeIndicator grade={product.grade as any} size="sm" />
          <OriginFlag
            country={product.origin.country}
            region={product.origin.region}
            size="sm"
          />
          <ProcessingMethodBadge
            method={product.processingMethod as ProcessingMethod}
            size="sm"
          />
        </div>

        {/* Certifications */}
        {product.certifications.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.certifications.slice(0, 3).map(cert => (
              <CertificationBadge
                key={cert}
                certification={cert as any}
                size="sm"
              />
            ))}
            {product.certifications.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{product.certifications.length - 3} more
              </Badge>
            )}
          </div>
        )}

        {/* Key Specifications */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-coffee-50 p-2">
            <span className="font-medium">Moisture:</span>{' '}
            {product.specifications.moisture}
          </div>
          <div className="rounded bg-coffee-50 p-2">
            <span className="font-medium">Screen:</span>{' '}
            {product.specifications.screenSize}
          </div>
          <div className="rounded bg-coffee-50 p-2">
            <span className="font-medium">Defects:</span>{' '}
            {product.specifications.defectRate}
          </div>
          {product.specifications.cuppingScore && (
            <div className="rounded bg-coffee-50 p-2">
              <span className="font-medium">Cupping:</span>{' '}
              {product.specifications.cuppingScore}
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-1">
          {product.features.slice(0, 3).map(feature => (
            <div key={feature} className="flex items-center text-sm">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-coffee-500" />
              {feature}
            </div>
          ))}
        </div>

        {/* Lead Time */}
        <div className="text-xs text-muted-foreground">
          <Coffee className="mr-1 inline h-3 w-3" />
          Lead time: {product.leadTime}
        </div>
      </CardContent>

      <CardFooter className="space-y-2 pt-4">
        <div className="flex w-full gap-2">
          <RequestQuoteButton
            size="sm"
            className="flex-1"
            productId={product.id}
          >
            {t('requestQuote')}
          </RequestQuoteButton>
          <CoffeeButton variant="outline" size="sm">
            <Download className="h-4 w-4" />
          </CoffeeButton>
        </div>
        <Link
          href={`/${locale}/products/${product.id}`}
          className="block w-full"
        >
          <CoffeeButton variant="ghost" size="sm" className="w-full">
            {t('viewDetails')}
          </CoffeeButton>
        </Link>
      </CardFooter>
    </Card>
  );
}
