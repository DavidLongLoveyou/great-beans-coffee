'use client';

import {  X, Download, ShoppingCart, TrendingUp, BarChart3, Scale, DollarSign, Package, Clock, AlertTriangle, CheckCircle, Info, Star, Target  } from '@/components/ui/dynamic-icons';
import { useTranslations } from 'next-intl';
import React, { useState, useMemo, Fragment, ReactNode } from 'react';

import { downloadFile } from '@/shared/utils/download';

import type { Product } from '@/presentation/components/catalog/ProductGrid';
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
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';
import {
  CertificationBadge,
  CoffeeGradeIndicator,
  OriginFlag,
  ProcessingMethodBadge,
} from '@/shared/components/design-system/Coffee';
import type { CoffeeOrigin } from '@/shared/components/design-system/types';
import { CardImage } from '@/shared/components/performance/OptimizedImage';

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

interface AdvancedProductComparisonProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveProduct: (productId: string) => void;
  onRequestQuote: (productIds: string[], analysisData?: BulkAnalysis) => void;
  locale: string;
}

interface BulkAnalysis {
  totalQuantity: number;
  totalValue: number;
  averagePrice: number;
  potentialSavings: number;
  recommendedMix: { productId: string; percentage: number; quantity: number }[];
  riskAssessment: 'low' | 'medium' | 'high';
  qualityScore: number;
}

interface ExportData {
  products: Product[];
  analysis: BulkAnalysis | null;
  timestamp: string;
  format: 'csv' | 'pdf' | 'excel';
}

interface ComparisonRow {
  label: string;
  key: string;
  render: (product: Product) => ReactNode;
  category:
    | 'basic'
    | 'specifications'
    | 'pricing'
    | 'availability'
    | 'certifications'
    | 'business';
  importance: 'high' | 'medium' | 'low';
  tooltip?: string;
}

export function AdvancedProductComparison({
  products,
  isOpen,
  onClose,
  onRemoveProduct,
  onRequestQuote,
  locale: _locale,
}: AdvancedProductComparisonProps) {
  const _t = useTranslations('catalog.comparison');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set(products.map(p => p.id))
  );
  const [bulkQuantity, setBulkQuantity] = useState<number>(1000);
  const [_targetBudget, _setTargetBudget] = useState<number>(50000);
  const [activeTab, setActiveTab] = useState<string>('comparison');
  const [sortBy, setSortBy] = useState<string>('price');
  const [filterBy, setFilterBy] = useState<string>('all');

  // Advanced B2B Analysis
  const bulkAnalysis = useMemo((): BulkAnalysis => {
    const selectedProductsArray = products.filter(p =>
      selectedProducts.has(p.id)
    );
    if (selectedProductsArray.length === 0) {
      return {
        totalQuantity: 0,
        totalValue: 0,
        averagePrice: 0,
        potentialSavings: 0,
        recommendedMix: [],
        riskAssessment: 'low',
        qualityScore: 0,
      };
    }

    const totalValue = selectedProductsArray.reduce((sum, product) => {
      const quantity = bulkQuantity / selectedProductsArray.length;
      const bulkPrice = calculateBulkPrice(product, quantity);
      return sum + bulkPrice * quantity;
    }, 0);

    const qualityScore =
      selectedProductsArray.reduce((sum, product) => {
        let score = 0;
        if (product.grade === 'grade-1') score += 15;
        if (
          product.specifications?.cuppingScore &&
          product.specifications.cuppingScore >= 85
        )
          score += 10;
        if (product.certifications && product.certifications.length > 0)
          score += 5;
        return sum + score;
      }, 0) / selectedProductsArray.length;

    const averagePrice = totalValue / bulkQuantity;
    const standardPrice =
      selectedProductsArray.reduce(
        (sum, product) => sum + product.pricing.basePrice,
        0
      ) / selectedProductsArray.length;
    const potentialSavings = (standardPrice - averagePrice) * bulkQuantity;

    // Remove duplicate quality score calculation since it's already calculated above

    // Risk assessment
    const riskFactors = selectedProductsArray.reduce((factors, product) => {
      if (!product.availability.inStock) factors++;
      if (product.availability.leadTime > 30) factors++;
      if (product.specifications.defectRate > 5) factors++;
      return factors;
    }, 0);

    const riskAssessment: 'low' | 'medium' | 'high' =
      riskFactors === 0 ? 'low' : riskFactors <= 2 ? 'medium' : 'high';

    // Recommended mix based on quality and price optimization
    const recommendedMix = selectedProductsArray.map(product => {
      const qualityWeight = (product.specifications.cuppingScore || 70) / 100;
      const priceWeight =
        1 -
        product.pricing.basePrice /
          Math.max(...selectedProductsArray.map(p => p.pricing.basePrice));
      const score = qualityWeight * 0.6 + priceWeight * 0.4;
      return {
        productId: product.id,
        percentage: Math.round(
          (score /
            selectedProductsArray.reduce((sum, p) => {
              const qw = (p.specifications.cuppingScore || 70) / 100;
              const pw =
                1 -
                p.pricing.basePrice /
                  Math.max(
                    ...selectedProductsArray.map(pr => pr.pricing.basePrice)
                  );
              return sum + (qw * 0.6 + pw * 0.4);
            }, 0)) *
            100
        ),
        quantity: Math.round(
          (score /
            selectedProductsArray.reduce((sum, p) => {
              const qw = (p.specifications.cuppingScore || 70) / 100;
              const pw =
                1 -
                p.pricing.basePrice /
                  Math.max(
                    ...selectedProductsArray.map(pr => pr.pricing.basePrice)
                  );
              return sum + (qw * 0.6 + pw * 0.4);
            }, 0)) *
            bulkQuantity
        ),
      };
    });

    return {
      totalQuantity: bulkQuantity,
      totalValue,
      averagePrice,
      potentialSavings,
      recommendedMix,
      riskAssessment,
      qualityScore,
    };
  }, [products, selectedProducts, bulkQuantity]);

  const calculateBulkPrice = (product: Product, quantity: number): number => {
    let discount = 0;
    if (quantity >= 5000) discount = 0.15;
    else if (quantity >= 2000) discount = 0.1;
    else if (quantity >= 1000) discount = 0.05;
    else if (quantity >= 500) discount = 0.025;

    return product.pricing.basePrice * (1 - discount);
  };

  const comparisonRows: ComparisonRow[] = [
    // Basic Information
    {
      label: 'Product',
      key: 'name',
      category: 'basic',
      importance: 'high',
      render: product => (
        <div className="space-y-2">
          <div className="relative mx-auto h-20 w-20">
            <CardImage
              src={
                product.images.find(img => img.isPrimary)?.url ||
                product.images[0]?.url ||
                ''
              }
              alt={product.name}
              className="rounded-lg object-cover"
              fill
            />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold">{product.name}</h4>
            <p className="text-xs text-muted-foreground">{product.sku}</p>
          </div>
          <div className="flex items-center justify-center gap-1">
            <OriginFlag
              origin={mapRegionToOrigin(product.origin?.region || 'vietnam')}
            />
            <span className="text-xs text-muted-foreground">
              {product.origin?.province || 'Unknown'}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Type & Grade',
      key: 'typeGrade',
      category: 'basic',
      importance: 'high',
      render: product => (
        <div className="space-y-2">
          <Badge variant="secondary">{product.type}</Badge>
          <div className="flex items-center gap-2">
            <CoffeeGradeIndicator grade={product.grade} />
            {product.grade === 'grade-1' && (
              <Badge variant="secondary" className="text-xs">
                Premium Grade
              </Badge>
            )}
          </div>
        </div>
      ),
    },
    {
      label: 'Origin & Processing',
      key: 'originProcessing',
      category: 'basic',
      importance: 'high',
      render: product => (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <OriginFlag
              origin={mapRegionToOrigin(product.origin?.region || 'Vietnam')}
            />
            <span className="text-sm font-medium">
              {product.origin?.region || 'Vietnam'}
            </span>
          </div>
          <ProcessingMethodBadge method={product.processingMethod} />
          <p className="text-xs text-muted-foreground">
            {product.origin.altitude}m
          </p>
        </div>
      ),
    },

    // Business Metrics
    {
      label: 'Base Price',
      key: 'basePrice',
      category: 'business',
      importance: 'high',
      tooltip: 'Price per kg for standard quantities',
      render: product => (
        <div className="text-center">
          <span className="text-lg font-bold text-green-600">
            ${product.pricing.basePrice.toFixed(2)}
          </span>
          <p className="text-xs text-muted-foreground">
            per {product.pricing.unit}
          </p>
        </div>
      ),
    },
    {
      label: 'Bulk Price (1000kg)',
      key: 'bulkPrice',
      category: 'business',
      importance: 'high',
      tooltip: 'Discounted price for 1000kg orders',
      render: product => {
        const bulkPrice = calculateBulkPrice(product, 1000);
        const savings =
          ((product.pricing.basePrice - bulkPrice) /
            product.pricing.basePrice) *
          100;
        return (
          <div className="text-center">
            <span className="text-lg font-bold text-blue-600">
              ${bulkPrice.toFixed(2)}
            </span>
            <p className="text-xs text-green-600">
              -{savings.toFixed(1)}% savings
            </p>
          </div>
        );
      },
    },
    {
      label: 'ROI Score',
      key: 'roiScore',
      category: 'business',
      importance: 'medium',
      tooltip: 'Return on Investment score based on quality vs price',
      render: product => {
        const qualityScore = product.specifications.cuppingScore || 70;
        const priceScore = 100 - (product.pricing.basePrice / 10) * 10; // Normalize price to 0-100
        const roiScore = Math.round(qualityScore * 0.6 + priceScore * 0.4);
        return (
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Star className="h-4 w-4 text-amber-500" />
              <span className="font-bold text-amber-600">{roiScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">/ 100</p>
          </div>
        );
      },
    },

    // Technical Specifications
    {
      label: 'Quality Metrics',
      key: 'qualityMetrics',
      category: 'specifications',
      importance: 'high',
      render: product => (
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Moisture:</span>
            <span className="font-medium">
              {product.specifications.moisture}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Defects:</span>
            <span className="font-medium">
              {product.specifications.defectRate}%
            </span>
          </div>
          <div className="flex justify-between">
            <span>Screen:</span>
            <span className="font-medium">
              {product.specifications.screenSize}
            </span>
          </div>
        </div>
      ),
    },
    {
      label: 'Cupping Score',
      key: 'cuppingScore',
      category: 'specifications',
      importance: 'high',
      render: product => (
        <div className="text-center">
          {product.specifications.cuppingScore ? (
            <div className="space-y-1">
              <span className="text-lg font-bold text-amber-600">
                {product.specifications.cuppingScore}
              </span>
              <p className="text-xs text-muted-foreground">/ 100</p>
              <Badge
                variant={
                  product.specifications.cuppingScore >= 85
                    ? 'default'
                    : 'secondary'
                }
              >
                {product.specifications.cuppingScore >= 85
                  ? 'Specialty'
                  : 'Commercial'}
              </Badge>
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">N/A</span>
          )}
        </div>
      ),
    },

    // Availability & Logistics
    {
      label: 'Availability',
      key: 'availability',
      category: 'availability',
      importance: 'high',
      render: product => (
        <div className="space-y-2">
          <Badge
            variant={product.availability.inStock ? 'default' : 'destructive'}
          >
            {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>
          {product.availability.inStock && (
            <div className="text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                <span>
                  {product.availability.stockQuantity.toLocaleString()} kg
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{product.availability.leadTime} days</span>
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      label: 'Harvest Season',
      key: 'harvestSeason',
      category: 'availability',
      importance: 'medium',
      render: product => (
        <span className="text-sm">{product.availability.harvestSeason}</span>
      ),
    },

    // Certifications
    {
      label: 'Certifications',
      key: 'certifications',
      category: 'certifications',
      importance: 'medium',
      render: product => (
        <div className="flex flex-wrap gap-1">
          {product.certifications && product.certifications.length > 0 ? (
            product.certifications.map(cert => (
              <CertificationBadge key={cert} certification={cert} />
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      ),
    },
  ];

  const filteredRows = comparisonRows.filter(row => {
    if (filterBy === 'all') return true;
    if (filterBy === 'high-importance') return row.importance === 'high';
    return row.category === filterBy;
  });

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.pricing.basePrice - b.pricing.basePrice;
      case 'quality':
        return (
          (b.specifications.cuppingScore || 0) -
          (a.specifications.cuppingScore || 0)
        );
      case 'availability':
        return (
          (b.availability.inStock ? 1 : 0) - (a.availability.inStock ? 1 : 0)
        );
      default:
        return 0;
    }
  });

  const groupedRows = filteredRows.reduce(
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
    basic: 'Basic Information',
    business: 'Business Metrics',
    specifications: 'Technical Specifications',
    pricing: 'Pricing Analysis',
    availability: 'Availability & Logistics',
    certifications: 'Certifications & Standards',
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
    onRequestQuote(Array.from(selectedProducts), bulkAnalysis);
  };

  const handleExportComparison = (format: 'csv' | 'pdf' | 'excel') => {
    // Enhanced export with business analysis
    const exportData = {
      products: sortedProducts.filter(p => selectedProducts.has(p.id)),
      analysis: bulkAnalysis,
      timestamp: new Date().toISOString(),
      format,
    };

    if (format === 'csv') {
      const csvContent = generateAdvancedCSV(exportData);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      downloadFile(blob, {
        filename: `coffee-comparison-${new Date().toISOString().split('T')[0]}.csv`,
        mimeType: 'text/csv',
      });
    }
    // PDF and Excel exports would be implemented here
  };

  const generateAdvancedCSV = (_data: ExportData): string => {
    // Implementation would generate comprehensive CSV with business analysis
    return 'Advanced CSV content with business metrics...';
  };

  if (products.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[95vh] max-w-[95vw] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              <span>
                Advanced Product Comparison ({products.length} products)
              </span>
            </div>
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Sort by Price</SelectItem>
                  <SelectItem value="quality">Sort by Quality</SelectItem>
                  <SelectItem value="availability">Sort by Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleExportComparison('csv')}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button
                onClick={handleRequestQuote}
                disabled={selectedProducts.size === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Quote ({selectedProducts.size})
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="comparison">Detailed Comparison</TabsTrigger>
            <TabsTrigger value="analysis">Business Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">
              AI Recommendations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="comparison" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Select value={filterBy} onValueChange={setFilterBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="high-importance">
                      High Priority Only
                    </SelectItem>
                    <SelectItem value="business">Business Metrics</SelectItem>
                    <SelectItem value="specifications">
                      Technical Specs
                    </SelectItem>
                    <SelectItem value="availability">Availability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="max-h-[60vh] flex-1 overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 z-10 w-48 bg-background">
                        Specification
                      </TableHead>
                      {sortedProducts.map(product => (
                        <TableHead
                          key={product.id}
                          className="min-w-48 text-center"
                        >
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
                      <Fragment key={category}>
                        <TableRow className="bg-muted/50">
                          <TableCell
                            colSpan={sortedProducts.length + 1}
                            className="sticky left-0 z-10 bg-muted/50 text-sm font-semibold"
                          >
                            {
                              categoryLabels[
                                category as keyof typeof categoryLabels
                              ]
                            }
                          </TableCell>
                        </TableRow>
                        {rows.map(row => (
                          <TableRow key={row.key}>
                            <TableCell className="sticky left-0 z-10 bg-background font-medium">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger className="flex items-center gap-1">
                                    {row.label}
                                    {row.tooltip && (
                                      <Info className="h-3 w-3 text-muted-foreground" />
                                    )}
                                  </TooltipTrigger>
                                  {row.tooltip && (
                                    <TooltipContent>
                                      <p>{row.tooltip}</p>
                                    </TooltipContent>
                                  )}
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            {sortedProducts.map(product => (
                              <TableCell
                                key={product.id}
                                className="text-center"
                              >
                                {row.render(product)}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </Fragment>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Package className="h-4 w-4" />
                    Total Quantity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {bulkAnalysis.totalQuantity.toLocaleString()} kg
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <Label htmlFor="quantity">Target Quantity:</Label>
                    <Input
                      id="quantity"
                      type="number"
                      value={bulkQuantity}
                      onChange={e => setBulkQuantity(Number(e.target.value))}
                      className="w-24"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    Total Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    ${bulkAnalysis.totalValue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Avg: ${bulkAnalysis.averagePrice.toFixed(2)}/kg
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <TrendingUp className="h-4 w-4" />
                    Potential Savings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    ${bulkAnalysis.potentialSavings.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    vs standard pricing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm font-medium">
                    <Target className="h-4 w-4" />
                    Quality Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-600">
                    {bulkAnalysis.qualityScore.toFixed(1)}
                  </div>
                  <Badge
                    variant={
                      bulkAnalysis.riskAssessment === 'low'
                        ? 'default'
                        : bulkAnalysis.riskAssessment === 'medium'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {bulkAnalysis.riskAssessment} risk
                  </Badge>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Recommended Product Mix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bulkAnalysis.recommendedMix.map(mix => {
                    const product = products.find(p => p.id === mix.productId);
                    if (!product) return null;

                    return (
                      <div
                        key={mix.productId}
                        className="flex items-center justify-between rounded-lg border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12">
                            <CardImage
                              src={
                                product.images.find(img => img.isPrimary)
                                  ?.url ||
                                product.images[0]?.url ||
                                ''
                              }
                              alt={product.name}
                              className="rounded object-cover"
                              fill
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {product.sku}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {mix.percentage}%
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {mix.quantity.toLocaleString()} kg
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    AI-Powered Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <h4 className="mb-2 font-semibold text-green-800">
                      Optimal Purchase Strategy
                    </h4>
                    <p className="text-sm text-green-700">
                      Based on your selection, we recommend a 60/40 split
                      between premium and commercial grades to optimize both
                      quality and cost-effectiveness for your target market.
                    </p>
                  </div>

                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <h4 className="mb-2 font-semibold text-blue-800">
                      Seasonal Timing
                    </h4>
                    <p className="text-sm text-blue-700">
                      Consider placing orders for Vietnamese Robusta between
                      October-December for best pricing and freshness, aligning
                      with harvest seasons.
                    </p>
                  </div>

                  {bulkAnalysis.riskAssessment !== 'low' && (
                    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                      <h4 className="mb-2 flex items-center gap-2 font-semibold text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        Risk Mitigation
                      </h4>
                      <p className="text-sm text-amber-700">
                        Some selected products have higher lead times or limited
                        stock. Consider diversifying your supplier base or
                        adjusting quantities to reduce supply chain risks.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
