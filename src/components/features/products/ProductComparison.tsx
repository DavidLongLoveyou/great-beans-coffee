'use client';

import {
  X,
  Plus,
  Minus,
  Coffee,
  MapPin,
  Mountain,
  Thermometer,
  Scale,
  Award,
  Leaf,
  DollarSign,
  Package,
  Star,
  BarChart3,
  Eye,
  ShoppingCart,
  Heart,
  Share2,
  Download,
  Filter,
  ArrowUpDown,
  CheckCircle,
  AlertCircle,
  Info,
} from 'lucide-react';
import { useState, useEffect } from 'react';

import { EnhancedOptimizedImage } from '@/shared/components/performance/EnhancedOptimizedImage';
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
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Progress } from '@/presentation/components/ui/progress';
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

export interface ComparisonProduct {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription: string;

  // Origin & Processing
  origin: string;
  region: string;
  farm: string;
  altitude: string;
  variety: string;
  processing: string;
  grade: string;
  harvestSeason: string;

  // Characteristics
  flavorNotes: string[];
  aroma: string;
  acidity: number; // 1-10 scale
  body: number; // 1-10 scale
  sweetness: number; // 1-10 scale

  // Pricing & Availability
  price: number;
  currency: string;
  minimumOrder: number;
  stock: number;
  unit: string;

  // Status
  status: 'active' | 'inactive' | 'out-of-stock' | 'discontinued';
  featured: boolean;

  // Certifications
  certifications: string[];

  // Images
  primaryImage?: {
    publicId: string;
    alt: string;
  };

  // Ratings
  rating: number;
  reviewCount: number;
}

interface ProductComparisonProps {
  products: ComparisonProduct[];
  onAddProduct: () => void;
  onRemoveProduct: (productId: string) => void;
  onProductSelect: (productId: string) => void;
  maxProducts?: number;
}

interface ComparisonCategory {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  fields: Array<{
    key: keyof ComparisonProduct;
    label: string;
    type: 'text' | 'number' | 'scale' | 'array' | 'price' | 'status' | 'rating';
    unit?: string;
    max?: number;
  }>;
}

const comparisonCategories: ComparisonCategory[] = [
  {
    id: 'basic',
    label: 'Basic Information',
    icon: Coffee,
    fields: [
      { key: 'name', label: 'Product Name', type: 'text' },
      { key: 'sku', label: 'SKU', type: 'text' },
      { key: 'shortDescription', label: 'Description', type: 'text' },
      { key: 'status', label: 'Availability', type: 'status' },
      { key: 'rating', label: 'Rating', type: 'rating' },
    ],
  },
  {
    id: 'origin',
    label: 'Origin & Processing',
    icon: MapPin,
    fields: [
      { key: 'origin', label: 'Origin Country', type: 'text' },
      { key: 'region', label: 'Region', type: 'text' },
      { key: 'farm', label: 'Farm/Cooperative', type: 'text' },
      { key: 'altitude', label: 'Altitude', type: 'text' },
      { key: 'variety', label: 'Variety', type: 'text' },
      { key: 'processing', label: 'Processing Method', type: 'text' },
      { key: 'grade', label: 'Grade', type: 'text' },
      { key: 'harvestSeason', label: 'Harvest Season', type: 'text' },
    ],
  },
  {
    id: 'characteristics',
    label: 'Flavor Profile',
    icon: Thermometer,
    fields: [
      { key: 'flavorNotes', label: 'Flavor Notes', type: 'array' },
      { key: 'aroma', label: 'Aroma', type: 'text' },
      { key: 'acidity', label: 'Acidity', type: 'scale', max: 10 },
      { key: 'body', label: 'Body', type: 'scale', max: 10 },
      { key: 'sweetness', label: 'Sweetness', type: 'scale', max: 10 },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Orders',
    icon: DollarSign,
    fields: [
      { key: 'price', label: 'Price', type: 'price' },
      {
        key: 'minimumOrder',
        label: 'Minimum Order',
        type: 'number',
        unit: 'kg',
      },
      { key: 'stock', label: 'Stock Available', type: 'number', unit: 'kg' },
    ],
  },
  {
    id: 'certifications',
    label: 'Certifications',
    icon: Award,
    fields: [{ key: 'certifications', label: 'Certifications', type: 'array' }],
  },
];

export function ProductComparison({
  products,
  onAddProduct,
  onRemoveProduct,
  onProductSelect,
  maxProducts = 4,
}: ProductComparisonProps) {
  const [activeCategory, setActiveCategory] = useState('basic');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [highlightDifferences, setHighlightDifferences] = useState(false);

  const renderFieldValue = (
    product: ComparisonProduct,
    field: ComparisonCategory['fields'][0],
    isHighlighted: boolean = false
  ) => {
    const value = product[field.key];
    const className = isHighlighted
      ? 'bg-yellow-100 dark:bg-yellow-900/20 px-1 rounded'
      : '';

    switch (field.type) {
      case 'text':
        return (
          <span className={className}>
            {typeof value === 'string' ? value : 'N/A'}
          </span>
        );

      case 'number':
        return (
          <span className={className}>
            {typeof value === 'number'
              ? `${value}${field.unit ? ` ${field.unit}` : ''}`
              : 'N/A'}
          </span>
        );

      case 'scale':
        const numValue = value as number;
        return (
          <div className={`space-y-1 ${className}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{numValue}/10</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < numValue / 2
                        ? 'fill-coffee-500 text-coffee-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <Progress
              value={(numValue / (field.max || 10)) * 100}
              className="h-1"
            />
          </div>
        );

      case 'array':
        const arrayValue = value as string[];
        return (
          <div className={`space-y-1 ${className}`}>
            {arrayValue && arrayValue.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {arrayValue.slice(0, 3).map((item, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {item}
                  </Badge>
                ))}
                {arrayValue.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{arrayValue.length - 3} more
                  </Badge>
                )}
              </div>
            ) : (
              <span className="text-muted-foreground">None</span>
            )}
          </div>
        );

      case 'price':
        return (
          <div className={`space-y-1 ${className}`}>
            <div className="text-lg font-semibold">
              ${(value as number).toFixed(2)}
            </div>
            <div className="text-xs text-muted-foreground">
              per {product.unit}
            </div>
          </div>
        );

      case 'status':
        const statusValue = value as string;
        const statusConfig = {
          active: {
            label: 'Available',
            color: 'bg-green-500',
            icon: CheckCircle,
          },
          'out-of-stock': {
            label: 'Out of Stock',
            color: 'bg-red-500',
            icon: AlertCircle,
          },
          inactive: {
            label: 'Inactive',
            color: 'bg-gray-500',
            icon: AlertCircle,
          },
          discontinued: {
            label: 'Discontinued',
            color: 'bg-orange-500',
            icon: AlertCircle,
          },
        };
        const config = statusConfig[statusValue as keyof typeof statusConfig];
        const StatusIcon = config?.icon || AlertCircle;

        return (
          <div className={`flex items-center gap-2 ${className}`}>
            <div
              className={`h-2 w-2 rounded-full ${config?.color || 'bg-gray-500'}`}
            />
            <span className="text-sm">{config?.label || statusValue}</span>
          </div>
        );

      case 'rating':
        const ratingValue = value as number;
        return (
          <div className={`space-y-1 ${className}`}>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(ratingValue)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">
                {ratingValue.toFixed(1)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {product.reviewCount} reviews
            </div>
          </div>
        );

      default:
        return <span className={className}>{String(value) || 'N/A'}</span>;
    }
  };

  const getFieldDifferences = (field: ComparisonCategory['fields'][0]) => {
    const values = products.map(product => product[field.key]);
    const uniqueValues = [...new Set(values.map(v => JSON.stringify(v)))];
    return uniqueValues.length > 1;
  };

  const exportComparison = () => {
    const data = products.map(product => {
      const exportData: any = {};
      comparisonCategories.forEach(category => {
        category.fields.forEach(field => {
          exportData[field.label] = product[field.key];
        });
      });
      return exportData;
    });

    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row =>
        Object.values(row)
          .map(value =>
            typeof value === 'object' ? JSON.stringify(value) : value
          )
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coffee-comparison.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (products.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Coffee className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-semibold">No Products to Compare</h3>
        <p className="mb-4 text-muted-foreground">
          Add products to start comparing their characteristics and
          specifications.
        </p>
        <Button onClick={onAddProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Add Products
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Comparison</h2>
          <p className="text-muted-foreground">
            Compare {products.length} coffee{' '}
            {products.length === 1 ? 'product' : 'products'} side by side
          </p>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHighlightDifferences(!highlightDifferences)}
                  className={
                    highlightDifferences
                      ? 'bg-yellow-100 dark:bg-yellow-900/20'
                      : ''
                  }
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {highlightDifferences ? 'Hide' : 'Highlight'} differences
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setViewMode('grid')}>
                Grid View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode('table')}>
                Table View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportComparison}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {products.length < maxProducts && (
            <Button onClick={onAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
        </div>
      </div>

      {/* Product Cards Overview */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map(product => (
          <Card key={product.id} className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 z-10"
              onClick={() => onRemoveProduct(product.id)}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardHeader className="pb-2">
              <div className="relative mb-2 aspect-square overflow-hidden rounded-lg bg-gray-100">
                {product.primaryImage ? (
                  <EnhancedOptimizedImage
                    publicId={product.primaryImage.publicId}
                    alt={product.primaryImage.alt}
                    cloudinaryOptions={{
                      transformations: {
                        width: 200,
                        height: 200,
                        crop: 'fill',
                        gravity: 'center',
                      },
                    }}
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Coffee className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              <CardTitle className="line-clamp-2 text-sm">
                {product.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {product.origin}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs">{product.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="font-semibold">
                  ${product.price.toFixed(2)}/{product.unit}
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => onProductSelect(product.id)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button size="sm" variant="outline">
                    <ShoppingCart className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Comparison</CardTitle>
          <CardDescription>
            Compare detailed specifications and characteristics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-5">
              {comparisonCategories.map(category => {
                const Icon = category.icon;
                return (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {comparisonCategories.map(category => (
              <TabsContent
                key={category.id}
                value={category.id}
                className="mt-6"
              >
                {viewMode === 'grid' ? (
                  <div className="space-y-4">
                    {category.fields.map(field => {
                      const hasDifferences =
                        highlightDifferences && getFieldDifferences(field);
                      return (
                        <div key={field.key} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Label className="font-medium">{field.label}</Label>
                            {hasDifferences && (
                              <Badge variant="outline" className="text-xs">
                                Different
                              </Badge>
                            )}
                          </div>
                          <div
                            className="grid gap-4"
                            style={{
                              gridTemplateColumns: `repeat(${products.length}, 1fr)`,
                            }}
                          >
                            {products.map(product => (
                              <div
                                key={product.id}
                                className="rounded-lg border p-3"
                              >
                                {renderFieldValue(
                                  product,
                                  field,
                                  hasDifferences
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Specification</TableHead>
                        {products.map(product => (
                          <TableHead key={product.id} className="text-center">
                            {product.name}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.fields.map(field => {
                        const hasDifferences =
                          highlightDifferences && getFieldDifferences(field);
                        return (
                          <TableRow key={field.key}>
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                {field.label}
                                {hasDifferences && (
                                  <Badge variant="outline" className="text-xs">
                                    Different
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            {products.map(product => (
                              <TableCell
                                key={product.id}
                                className="text-center"
                              >
                                {renderFieldValue(
                                  product,
                                  field,
                                  hasDifferences
                                )}
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
