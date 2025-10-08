'use client';

import {
  ShoppingCart,
  Scale,
  TrendingUp,
  Package,
  Clock,
  Star,
  ArrowRight,
  Plus,
  Minus,
  Eye,
  Download,
  CheckCircle,
  AlertCircle,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Separator } from '@/presentation/components/ui/separator';
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
import { CardImage } from '@/shared/components/performance/OptimizedImage';
import { cn } from '@/shared/utils/cn';

interface RelatedProduct {
  id: string;
  name: string;
  shortDescription: string;
  images: Array<{ url: string; alt: string; isPrimary: boolean }>;
  pricing: {
    basePrice: number;
    unit: string;
    minimumOrder: number;
    incoterms: string[];
  };
  grade: string;
  origin: {
    region: string;
    country: string;
  };
  processingMethod: string;
  certifications: string[];
  availability: {
    inStock: boolean;
    leadTime: number;
  };
  isFeatured: boolean;
  specifications: {
    moisture: string;
    screenSize: string;
    defectRate: string;
    cuppingScore?: number;
  };
}

interface BulkOption {
  quantity: number;
  unit: string;
  pricePerUnit: number;
  discount: number;
  leadTime: number;
  packaging: string;
}

interface EnhancedRelatedProductsProps {
  products: RelatedProduct[];
  currentProduct: {
    id: string;
    type: string;
    grade: string;
  };
  locale: string;
  className?: string;
}

const bulkOptions: BulkOption[] = [
  {
    quantity: 1,
    unit: 'MT',
    pricePerUnit: 2850,
    discount: 0,
    leadTime: 14,
    packaging: 'Jute Bags',
  },
  {
    quantity: 5,
    unit: 'MT',
    pricePerUnit: 2750,
    discount: 3.5,
    leadTime: 21,
    packaging: 'Jute Bags',
  },
  {
    quantity: 10,
    unit: 'MT',
    pricePerUnit: 2650,
    discount: 7,
    leadTime: 28,
    packaging: 'Bulk Container',
  },
  {
    quantity: 20,
    unit: 'MT',
    pricePerUnit: 2550,
    discount: 10.5,
    leadTime: 35,
    packaging: 'Bulk Container',
  },
];

const recommendationReasons = {
  'same-type': 'Same coffee type - perfect for consistent blending',
  'same-grade': 'Similar quality grade - maintains your standards',
  'same-origin': 'Same origin region - familiar flavor profile',
  complementary: 'Complementary profile - ideal for custom blends',
  seasonal: 'Seasonal availability - secure your supply chain',
  'premium-upgrade': 'Premium upgrade option - enhance your offerings',
};

export function EnhancedRelatedProducts({
  products,
  currentProduct,
  locale,
  className,
}: EnhancedRelatedProductsProps) {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(
    new Set()
  );
  const [bulkQuantities, setBulkQuantities] = useState<Record<string, number>>(
    {}
  );
  const [activeTab, setActiveTab] = useState<
    'recommendations' | 'bulk' | 'comparison'
  >('recommendations');

  const handleProductSelect = (productId: string, selected: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (selected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setBulkQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, quantity),
    }));
  };

  const getRecommendationReason = (
    product: RelatedProduct
  ): keyof typeof recommendationReasons => {
    if (
      product.grade === currentProduct.grade &&
      product.id !== currentProduct.id
    ) {
      return 'same-grade';
    }
    if (product.origin.region === currentProduct.type) {
      return 'same-origin';
    }
    if (product.isFeatured) {
      return 'premium-upgrade';
    }
    return 'complementary';
  };

  const calculateBulkPrice = (
    basePrice: number,
    quantity: number
  ): BulkOption => {
    const option =
      bulkOptions.find(opt => quantity >= opt.quantity) || bulkOptions[0];
    return {
      ...option,
      pricePerUnit: basePrice * (1 - option.discount / 100),
    };
  };

  const ProductCard = ({ product }: { product: RelatedProduct }) => {
    const primaryImage =
      product.images.find(img => img.isPrimary) || product.images[0];
    const quantity = bulkQuantities[product.id] || 1;
    const bulkPrice = calculateBulkPrice(product.pricing.basePrice, quantity);
    const reason = getRecommendationReason(product);

    return (
      <Card className="border-coffee-200/50 hover:shadow-coffee-glow group relative overflow-hidden transition-all duration-300 hover:shadow-xl">
        {/* Recommendation Badge */}
        <div className="absolute left-3 top-3 z-10">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Badge
                  variant="secondary"
                  className="border-amber-200 bg-amber-100 text-amber-800"
                >
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Recommended
                </Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">{recommendationReasons[reason]}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute right-3 top-3 z-10">
          <Button
            variant={selectedProducts.has(product.id) ? 'default' : 'outline'}
            size="sm"
            onClick={() =>
              handleProductSelect(product.id, !selectedProducts.has(product.id))
            }
            className="h-8 w-8 p-0"
          >
            {selectedProducts.has(product.id) ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Product Image */}
        <div className="bg-coffee-50 relative aspect-video">
          <CardImage
            src={primaryImage?.url || '/images/coffee-beans-placeholder.jpg'}
            alt={primaryImage?.alt || product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Availability Badge */}
          <Badge
            variant={product.availability.inStock ? 'default' : 'destructive'}
            className="absolute bottom-3 left-3"
          >
            {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
          </Badge>

          {/* Featured Badge */}
          {product.isFeatured && (
            <Badge className="bg-gold-500 absolute bottom-3 right-3 text-white">
              <Star className="mr-1 h-3 w-3" />
              Featured
            </Badge>
          )}
        </div>

        <CardHeader className="pb-4">
          <CardTitle className="text-coffee-800 group-hover:text-coffee-600 text-lg font-semibold transition-colors">
            {product.name}
          </CardTitle>
          <CardDescription className="text-coffee-600 text-sm">
            {product.shortDescription}
          </CardDescription>

          {/* Key Specifications */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs">
              {product.grade.replace('_', ' ')}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.origin.region}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {product.processingMethod}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pricing Information */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-coffee-700 text-sm font-medium">
                Base Price:
              </span>
              <span className="text-coffee-800 text-lg font-bold">
                ${product.pricing.basePrice.toLocaleString()}/
                {product.pricing.unit}
              </span>
            </div>

            {quantity > 1 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-coffee-600">
                  Bulk Price ({quantity} MT):
                </span>
                <span className="font-semibold text-emerald-600">
                  ${bulkPrice.pricePerUnit.toLocaleString()}/
                  {product.pricing.unit}
                  {bulkPrice.discount > 0 && (
                    <span className="ml-1 text-xs text-emerald-500">
                      (-{bulkPrice.discount}%)
                    </span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="space-y-2">
            <label className="text-coffee-700 text-sm font-medium">
              Quantity (MT):
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(product.id, quantity - 1)}
                disabled={quantity <= 1}
                className="h-8 w-8 p-0"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Select
                value={quantity.toString()}
                onValueChange={value =>
                  handleQuantityChange(product.id, parseInt(value))
                }
              >
                <SelectTrigger className="h-8 w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 5, 10, 20, 50].map(qty => (
                    <SelectItem key={qty} value={qty.toString()}>
                      {qty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(product.id, quantity + 1)}
                className="h-8 w-8 p-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Lead Time & MOQ */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="text-coffee-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{product.availability.leadTime} days</span>
            </div>
            <div className="text-coffee-600 flex items-center gap-1">
              <Package className="h-3 w-3" />
              <span>MOQ: {product.pricing.minimumOrder} MT</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" asChild className="flex-1">
              <Link href={`/${locale}/products/${product.id}`}>
                <Eye className="mr-1 h-4 w-4" />
                View Details
              </Link>
            </Button>
            <Button
              size="sm"
              asChild
              className="bg-coffee-600 hover:bg-coffee-700 flex-1"
            >
              <Link
                href={`/${locale}/quote?product=${product.id}&quantity=${quantity}`}
              >
                <ShoppingCart className="mr-1 h-4 w-4" />
                Quote
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  const BulkOptionsPanel = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-coffee-800 mb-2 text-xl font-semibold">
          Bulk Purchase Options
        </h3>
        <p className="text-coffee-600">
          Save more with larger quantities. Perfect for roasters and
          distributors.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {bulkOptions.map((option, index) => (
          <Card
            key={index}
            className="border-coffee-200 hover:border-coffee-300 transition-colors"
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-coffee-800 text-lg">
                {option.quantity} {option.unit}
              </CardTitle>
              {option.discount > 0 && (
                <Badge
                  variant="secondary"
                  className="w-fit bg-emerald-100 text-emerald-800"
                >
                  Save {option.discount}%
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-coffee-800 text-2xl font-bold">
                ${option.pricePerUnit.toLocaleString()}
                <span className="text-coffee-600 text-sm font-normal">/MT</span>
              </div>
              <div className="text-coffee-600 space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{option.leadTime} days delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>{option.packaging}</span>
                </div>
              </div>
              <Button className="w-full" size="sm">
                Select This Option
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="bg-coffee-50 rounded-lg p-6">
        <h4 className="text-coffee-800 mb-3 font-semibold">
          Bulk Purchase Benefits
        </h4>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
            <div>
              <h5 className="text-coffee-700 font-medium">Volume Discounts</h5>
              <p className="text-coffee-600 text-sm">
                Save up to 10.5% on large orders
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
            <div>
              <h5 className="text-coffee-700 font-medium">
                Priority Processing
              </h5>
              <p className="text-coffee-600 text-sm">
                Faster handling for bulk orders
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
            <div>
              <h5 className="text-coffee-700 font-medium">Flexible Payment</h5>
              <p className="text-coffee-600 text-sm">
                Extended payment terms available
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="mt-0.5 h-5 w-5 text-emerald-500" />
            <div>
              <h5 className="text-coffee-700 font-medium">Quality Assurance</h5>
              <p className="text-coffee-600 text-sm">
                Consistent quality across batches
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const ComparisonPanel = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-coffee-800 mb-2 text-xl font-semibold">
          Product Comparison
        </h3>
        <p className="text-coffee-600">
          Compare selected products side by side to make informed decisions.
        </p>
      </div>

      {selectedProducts.size === 0 ? (
        <div className="py-12 text-center">
          <Scale className="text-coffee-300 mx-auto mb-4 h-16 w-16" />
          <h4 className="text-coffee-700 mb-2 text-lg font-medium">
            No Products Selected
          </h4>
          <p className="text-coffee-600">
            Select products from the recommendations tab to compare them here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-coffee-700 text-sm font-medium">
              {selectedProducts.size} product(s) selected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedProducts(new Set())}
            >
              Clear All
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
            {Array.from(selectedProducts).map(productId => {
              const product = products.find(p => p.id === productId);
              if (!product) return null;

              return (
                <Card key={productId} className="border-coffee-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">
                        {product.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleProductSelect(productId, false)}
                        className="h-6 w-6 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Grade:</span>
                        <span className="font-medium">{product.grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Origin:</span>
                        <span className="font-medium">
                          {product.origin.region}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Process:</span>
                        <span className="font-medium">
                          {product.processingMethod}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Price:</span>
                        <span className="font-medium">
                          ${product.pricing.basePrice}/MT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coffee-600">MOQ:</span>
                        <span className="font-medium">
                          {product.pricing.minimumOrder} MT
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-coffee-600">Lead Time:</span>
                        <span className="font-medium">
                          {product.availability.leadTime} days
                        </span>
                      </div>
                    </div>
                    <Button size="sm" className="w-full" asChild>
                      <Link
                        href={`/${locale}/quote?products=${Array.from(selectedProducts).join(',')}`}
                      >
                        Request Quote
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={cn('space-y-8', className)}>
      <div className="text-center">
        <h2 className="text-coffee-800 mb-4 text-3xl font-bold">
          Recommended for Your Business
        </h2>
        <p className="text-coffee-600 mx-auto max-w-3xl text-lg">
          Discover complementary products, explore bulk options, and compare
          specifications to optimize your coffee sourcing strategy.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={value => setActiveTab(value as any)}
        className="w-full"
      >
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-3">
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Recommendations
          </TabsTrigger>
          <TabsTrigger value="bulk" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Bulk Options
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-2">
            <Scale className="h-4 w-4" />
            Compare ({selectedProducts.size})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {selectedProducts.size > 0 && (
            <div className="bg-coffee-50 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-coffee-800 font-semibold">
                    {selectedProducts.size} product(s) selected
                  </h4>
                  <p className="text-coffee-600 text-sm">
                    Switch to comparison tab to analyze side by side
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab('comparison')}
                  >
                    <Scale className="mr-2 h-4 w-4" />
                    Compare
                  </Button>
                  <Button asChild>
                    <Link
                      href={`/${locale}/quote?products=${Array.from(selectedProducts).join(',')}`}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Request Quote
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="bulk">
          <BulkOptionsPanel />
        </TabsContent>

        <TabsContent value="comparison">
          <ComparisonPanel />
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <div className="from-coffee-800 to-coffee-600 rounded-xl bg-gradient-to-r p-8 text-center text-white">
        <h3 className="mb-4 text-2xl font-bold">
          Need Help Choosing the Right Products?
        </h3>
        <p className="text-coffee-100 mx-auto mb-6 max-w-2xl">
          Our coffee experts are here to help you select the perfect products
          for your business needs. Get personalized recommendations and custom
          quotes.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button variant="secondary" size="lg" asChild>
            <Link href={`/${locale}/contact`}>
              <Users className="mr-2 h-5 w-5" />
              Speak with Expert
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="hover:text-coffee-800 border-white text-white hover:bg-white"
            asChild
          >
            <Link href={`/${locale}/catalog`}>
              <Download className="mr-2 h-5 w-5" />
              Download Catalog
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
