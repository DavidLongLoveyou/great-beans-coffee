'use client';

import { X, Download, ShoppingCart } from '@/components/ui/icons';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

import { downloadCSV } from '@/shared/utils/download';

import type { CatalogProduct } from '@/data/product-catalog';
import {
  CoffeeGrade as CatalogCoffeeGrade,
  ProcessingMethod as CatalogProcessingMethod,
  CertificationType,
} from '@/data/product-catalog';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import { CertificationBadge } from '@/shared/components/design-system/Coffee/CertificationBadge';
import { CoffeeGradeIndicator } from '@/shared/components/design-system/Coffee/CoffeeGradeIndicator';
import { OriginFlag } from '@/shared/components/design-system/Coffee/OriginFlag';
import { ProcessingMethodBadge } from '@/shared/components/design-system/Coffee/ProcessingMethodBadge';
import type {
  CoffeeOrigin,
  CoffeeGrade,
  ProcessingMethod,
  CoffeeCertification,
} from '@/shared/components/design-system/types';
import { CardImage } from '@/shared/components/performance/OptimizedImage';

// Helper function to map CertificationType to CoffeeCertification
const mapCertificationToDesignSystem = (
  cert: CertificationType
): CoffeeCertification => {
  const certMap: Record<CertificationType, CoffeeCertification> = {
    [CertificationType.ORGANIC]: 'organic',
    [CertificationType.FAIR_TRADE]: 'fair-trade',
    [CertificationType.RAINFOREST_ALLIANCE]: 'rainforest-alliance',
    [CertificationType.UTZ]: 'utz',
    [CertificationType.UTZ_CERTIFIED]: 'utz',
    [CertificationType.C_CAFE_PRACTICES]: 'c-cafe',
    [CertificationType.BIRD_FRIENDLY]: 'bird-friendly',
    [CertificationType.SHADE_GROWN]: 'shade-grown',
    [CertificationType.DIRECT_TRADE]: 'direct-trade',
    [CertificationType.ISO_22000]: 'iso-22000',
    [CertificationType.HACCP]: 'haccp',
    [CertificationType.BRC]: 'brc',
    [CertificationType.KOSHER]: 'organic', // Fallback to organic for unsupported types
    [CertificationType.HALAL]: 'organic', // Fallback to organic for unsupported types
  };
  return certMap[cert] || 'organic';
};

// Helper function to map region string to CoffeeOrigin type
const mapRegionToOrigin = (region: string): CoffeeOrigin => {
  const regionLower = region.toLowerCase();

  // Map common region names to CoffeeOrigin values
  const regionMap: Record<string, CoffeeOrigin> = {
    vietnam: 'vietnam',
    'viet nam': 'vietnam',
    brazil: 'brazil',
    colombia: 'colombia',
    ethiopia: 'ethiopia',
    guatemala: 'guatemala',
    honduras: 'honduras',
    peru: 'peru',
    indonesia: 'indonesia',
    india: 'india',
    'costa rica': 'costa-rica',
    nicaragua: 'nicaragua',
    ecuador: 'ecuador',
    mexico: 'mexico',
    panama: 'panama',
    jamaica: 'jamaica',
    kenya: 'kenya',
  };

  return regionMap[regionLower] || 'vietnam'; // Default to vietnam if not found
};

// Helper function to map catalog grade to design system grade
const mapCatalogGradeToDesignGrade = (
  grade: CatalogCoffeeGrade
): CoffeeGrade => {
  const gradeMap: Record<CatalogCoffeeGrade, CoffeeGrade> = {
    [CatalogCoffeeGrade.GRADE_1]: 'grade-1',
    [CatalogCoffeeGrade.GRADE_2]: 'grade-2',
    [CatalogCoffeeGrade.GRADE_3]: 'grade-3',
    [CatalogCoffeeGrade.SPECIALTY]: 'specialty',
    [CatalogCoffeeGrade.PREMIUM]: 'premium',
    [CatalogCoffeeGrade.COMMERCIAL]: 'standard',
  };

  return gradeMap[grade] || 'standard';
};

// Helper function to map catalog processing method to design system processing method
const mapCatalogProcessingToDesignProcessing = (
  method: CatalogProcessingMethod
): ProcessingMethod => {
  const methodMap: Record<CatalogProcessingMethod, ProcessingMethod> = {
    [CatalogProcessingMethod.WASHED]: 'washed',
    [CatalogProcessingMethod.NATURAL]: 'natural',
    [CatalogProcessingMethod.HONEY]: 'honey',
    [CatalogProcessingMethod.WET_HULLED]: 'wet-hulled',
    [CatalogProcessingMethod.SEMI_WASHED]: 'semi-washed',
    [CatalogProcessingMethod.PULPED_NATURAL]: 'natural', // Map to natural as closest equivalent
  };

  return methodMap[method] || 'washed';
};

interface ProductComparisonProps {
  products: CatalogProduct[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onRequestQuote: (productIds: string[]) => void;
  locale: string;
}

interface ComparisonRow {
  label: string;
  key: string;
  render: (product: CatalogProduct) => React.ReactNode;
  category:
    | 'basic'
    | 'specifications'
    | 'pricing'
    | 'availability'
    | 'certifications';
}

export function ProductComparison({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onRequestQuote,
  locale,
}: ProductComparisonProps) {
  const t = useTranslations('catalog.comparison');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(products.map(p => p.id))
  );

  const comparisonRows: ComparisonRow[] = [
    // Basic Information
    {
      label: t('fields.name'),
      key: 'name',
      category: 'basic',
      render: product => (
        <div className="space-y-2">
          <div className="relative mx-auto h-20 w-20">
            <CardImage
              src={
                product.images.find(img => img.isPrimary)?.url ||
                product.images[0]?.url ||
                ''
              }
              alt={product.name[locale] || product.name.en || 'Product image'}
              className="rounded-lg object-cover"
              fill
            />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold">
              {product.name[locale] || product.name.en}
            </h4>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
        </div>
      ),
    },
    {
      label: t('fields.type'),
      key: 'type',
      category: 'basic',
      render: product => <Badge variant="secondary">{product.type}</Badge>,
    },
    {
      label: t('fields.grade'),
      key: 'grade',
      category: 'basic',
      render: product => (
        <CoffeeGradeIndicator
          grade={mapCatalogGradeToDesignGrade(product.grade)}
        />
      ),
    },
    {
      label: t('fields.processing'),
      key: 'processing',
      category: 'basic',
      render: product => (
        <ProcessingMethodBadge
          method={mapCatalogProcessingToDesignProcessing(
            product.processingMethod
          )}
        />
      ),
    },
    {
      label: t('fields.origin'),
      key: 'origin',
      category: 'basic',
      render: product => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <OriginFlag
              origin={mapRegionToOrigin(product.origin?.region || 'vietnam')}
              size="sm"
              showLabel
            />
            <span className="text-sm font-medium">
              {product.origin?.region || 'Unknown'}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {product.origin?.province || 'Unknown'}
          </p>
          <p className="text-xs text-muted-foreground">
            {product.origin?.altitude || 0}m
          </p>
        </div>
      ),
    },

    // Specifications
    {
      label: t('fields.moisture'),
      key: 'moisture',
      category: 'specifications',
      render: product => (
        <span className="text-sm">
          {product.specifications?.moisture || 0}%
        </span>
      ),
    },
    {
      label: t('fields.screenSize'),
      key: 'screenSize',
      category: 'specifications',
      render: product => (
        <span className="text-sm">
          {product.specifications?.screenSize || 'N/A'}
        </span>
      ),
    },
    {
      label: t('fields.defectRate'),
      key: 'defectRate',
      category: 'specifications',
      render: product => (
        <span className="text-sm">
          {product.specifications?.defectRate || 0}%
        </span>
      ),
    },
    {
      label: t('fields.cuppingScore'),
      key: 'cuppingScore',
      category: 'specifications',
      render: product => (
        <div className="text-center">
          {product.specifications?.cuppingScore ? (
            <div className="space-y-1">
              <span className="text-lg font-bold text-amber-600">
                {product.specifications.cuppingScore}
              </span>
              <p className="text-xs text-muted-foreground">/ 100</p>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          )}
        </div>
      ),
    },

    // Pricing
    {
      label: t('fields.basePrice'),
      key: 'basePrice',
      category: 'pricing',
      render: product => (
        <div className="text-center">
          <span className="text-lg font-bold text-green-600">
            ${product.pricing?.basePrice?.toFixed(2) || '0.00'}
          </span>
          <p className="text-xs text-muted-foreground">
            per {product.pricing?.unit || 'kg'}
          </p>
        </div>
      ),
    },

    // Availability
    {
      label: t('fields.stockStatus'),
      key: 'stockStatus',
      category: 'availability',
      render: product => (
        <div className="space-y-1">
          <Badge
            variant={product.availability?.inStock ? 'default' : 'destructive'}
          >
            {product.availability?.inStock ? t('inStock') : t('outOfStock')}
          </Badge>
          {product.availability?.inStock && (
            <p className="text-xs text-muted-foreground">
              {product.availability.stockQuantity?.toLocaleString() || 0}{' '}
              {product.pricing?.unit || 'kg'}
            </p>
          )}
        </div>
      ),
    },
    {
      label: t('fields.leadTime'),
      key: 'leadTime',
      category: 'availability',
      render: product => (
        <span className="text-sm">
          {product.availability?.leadTime || 0} {t('days')}
        </span>
      ),
    },
    {
      label: t('fields.harvestSeason'),
      key: 'harvestSeason',
      category: 'availability',
      render: product => (
        <span className="text-sm">
          {product.availability?.harvestSeason || 'N/A'}
        </span>
      ),
    },

    // Certifications
    {
      label: t('fields.certifications'),
      key: 'certifications',
      category: 'certifications',
      render: product => (
        <div className="flex flex-wrap gap-1">
          {product.certifications && product.certifications.length > 0 ? (
            product.certifications.map((cert: CertificationType) => (
              <CertificationBadge
                key={`cert-${cert}`}
                certification={mapCertificationToDesignSystem(cert)}
              />
            ))
          ) : (
            <span className="text-xs text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
  ];

  const groupedRows = comparisonRows.reduce(
    (acc, row) => {
      if (!acc[row.category]) {
        acc[row.category] = [];
      }
      acc[row.category]!.push(row);
      return acc;
    },
    {} as Record<string, ComparisonRow[]>
  );

  const categoryLabels = {
    basic: t('categories.basic'),
    specifications: t('categories.specifications'),
    pricing: t('categories.pricing'),
    availability: t('categories.availability'),
    certifications: t('categories.certifications'),
  };

  const handleToggleProduct = (productId: string) => {
    const newSelected = new Set(selectedProducts);
    if (newSelected.has(productId)) {
      newSelected.delete(productId);
    } else {
      newSelected.add(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleRequestQuote = () => {
    onRequestQuote(Array.from(selectedProducts));
  };

  const handleExportComparison = () => {
    // Generate CSV export
    const csvContent = generateComparisonCSV(products, comparisonRows, locale);
    downloadCSV(
      csvContent,
      `coffee-comparison-${new Date().toISOString().split('T')[0]}`
    );
  };

  if (products.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-7xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>
              {t('title')} ({products.length} {t('products')})
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportComparison}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                {t('export')}
              </Button>
              <Button
                onClick={handleRequestQuote}
                disabled={selectedProducts.size === 0}
                className="flex items-center gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                {t('requestQuote')} ({selectedProducts.size})
              </Button>
            </div>
          </DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="sticky left-0 z-10 w-48 bg-background">
                  {t('specification')}
                </TableHead>
                {products.map(product => (
                  <TableHead key={product.id} className="min-w-48 text-center">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedProducts.has(product.id)}
                          onChange={() => handleToggleProduct(product.id)}
                          className="rounded"
                        />
                        <span className="text-xs">Select</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveProduct(product.id)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedRows).map(([category, rows]) => (
                <React.Fragment key={category}>
                  <TableRow className="bg-muted/50">
                    <TableCell
                      colSpan={products.length + 1}
                      className="sticky left-0 z-10 bg-muted/50 text-sm font-semibold"
                    >
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </TableCell>
                  </TableRow>
                  {rows.map(row => (
                    <TableRow key={row.key}>
                      <TableCell className="sticky left-0 z-10 bg-background font-medium">
                        {row.label}
                      </TableCell>
                      {products.map(product => (
                        <TableCell key={product.id} className="text-center">
                          {row.render(product)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateComparisonCSV(
  products: CatalogProduct[],
  rows: ComparisonRow[],
  locale: string
): string {
  const headers = [
    'Specification',
    ...products.map(p => p.name[locale] || p.name.en),
  ];
  const csvRows = [headers.join(',')];

  rows.forEach(row => {
    const rowData = [
      row.label,
      ...products.map(product => {
        // Extract text content from rendered component for CSV
        const rendered = row.render(product);
        if (typeof rendered === 'string') return rendered;
        if (typeof rendered === 'number') return rendered.toString();
        // For complex components, extract meaningful text
        switch (row.key) {
          case 'grade':
            return product.grade;
          case 'processing':
            return product.processingMethod;
          case 'origin':
            return product.origin
              ? `${product.origin.region || 'Unknown'}, ${product.origin.province || 'Unknown'} (${product.origin.altitude || 0}m)`
              : 'N/A';
          case 'basePrice':
            return `$${product.pricing?.basePrice?.toFixed(2) || '0.00'} per ${product.pricing?.unit || 'kg'}`;
          case 'stockStatus':
            return product.availability?.inStock ? 'In Stock' : 'Out of Stock';
          case 'certifications':
            return product.certifications?.join(', ') || 'None';
          default:
            return 'N/A';
        }
      }),
    ];
    csvRows.push(rowData.join(','));
  });

  return csvRows.join('\n');
}
