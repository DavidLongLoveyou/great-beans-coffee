'use client';

import { Download, Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
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
          <Badge className="absolute left-3 top-3 bg-emerald-500 text-white shadow-emerald-soft">
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
        <CardTitle className="line-clamp-2 text-lg font-semibold text-forest-800">
          {product.name}
        </CardTitle>
        <p className="line-clamp-3 text-sm text-muted-foreground">
          {product.description}
        </p>
        <div className="text-sm font-medium text-forest-600">
          {product.price}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Quality Indicators */}
        <div className="flex flex-wrap gap-2">
          <CoffeeGradeIndicator grade={product.grade as any} size="sm" />
          <OriginFlag
            origin="vietnam"
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

        {/* Technical Specifications */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded bg-forest-50 p-2 border border-forest-100">
            <span className="font-medium text-forest-700">Moisture:</span>{' '}
            <span className="text-forest-600">{product.specifications.moisture}</span>
          </div>
          <div className="rounded bg-forest-50 p-2 border border-forest-100">
            <span className="font-medium text-forest-700">Screen:</span>{' '}
            <span className="text-forest-600">{product.specifications.screenSize}</span>
          </div>
          <div className="rounded bg-forest-50 p-2 border border-forest-100">
            <span className="font-medium text-forest-700">Defects:</span>{' '}
            <span className="text-forest-600">{product.specifications.defectRate}</span>
          </div>
          {product.specifications.cuppingScore && (
            <div className="rounded bg-sage-50 p-2 border border-sage-100">
              <span className="font-medium text-sage-700">Cupping:</span>{' '}
              <span className="text-sage-600">{product.specifications.cuppingScore}</span>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="space-y-1">
          {product.features.slice(0, 3).map(feature => (
            <div key={feature} className="flex items-center text-sm">
              <div className="mr-2 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-forest-700">{feature}</span>
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
          <Button asChild variant="default" size="sm" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white">
            <Link href={`/${locale}/quote?product=${product.id}`}>
              {t('requestQuote')}
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="shadow-sage-soft">
            <Download className="h-4 w-4" />
          </Button>
        </div>
        <Link
          href={`/${locale}/products/${product.id}`}
          className="block w-full"
        >
          <Button variant="outline" size="sm" className="w-full hover:shadow-forest-medium">
            {t('viewDetails')}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
