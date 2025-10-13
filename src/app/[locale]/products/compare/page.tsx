import { Metadata } from 'next';
import { Plus, Search, ArrowLeft, BarChart3, Scale } from 'lucide-react';
import Link from 'next/link';

import {
  ProductComparison,
  type ComparisonProduct,
} from '@/components/features/products/ProductComparison';
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
import { Input } from '@/presentation/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

export const metadata: Metadata = {
  title: 'Compare Coffee Products | The Great Beans',
  description:
    'Compare different coffee varieties side by side. Analyze origin, flavor profiles, pricing, and characteristics to find the perfect coffee for your business.',
  keywords:
    'coffee comparison, coffee varieties, coffee characteristics, coffee origin, flavor profile, coffee pricing',
  openGraph: {
    title: 'Compare Coffee Products | The Great Beans',
    description:
      'Compare different coffee varieties side by side. Analyze origin, flavor profiles, pricing, and characteristics.',
    type: 'website',
  },
};

// Mock data for demonstration
const mockProducts: ComparisonProduct[] = [
  {
    id: '1',
    name: 'Ethiopian Yirgacheffe Grade 1',
    slug: 'ethiopian-yirgacheffe-grade-1',
    sku: 'ETH-YRG-G1-001',
    shortDescription:
      'Bright, floral coffee with wine-like acidity and complex fruit notes',
    origin: 'Ethiopia',
    region: 'Yirgacheffe',
    farm: 'Kochere Cooperative',
    altitude: '1,700-2,200 masl',
    variety: 'Heirloom',
    processing: 'Washed',
    grade: 'Grade 1',
    harvestSeason: 'October - December',
    flavorNotes: ['Citrus', 'Floral', 'Wine-like', 'Berry'],
    aroma: 'Intense floral with citrus undertones',
    acidity: 9,
    body: 6,
    sweetness: 7,
    price: 8.5,
    currency: 'USD',
    minimumOrder: 60,
    stock: 2500,
    unit: 'kg',
    status: 'active',
    featured: true,
    certifications: ['Organic', 'Fair Trade'],
    primaryImage: {
      publicId: 'coffee/ethiopian-yirgacheffe',
      alt: 'Ethiopian Yirgacheffe coffee beans',
    },
    rating: 4.8,
    reviewCount: 127,
  },
  {
    id: '2',
    name: 'Colombian Huila Supremo',
    slug: 'colombian-huila-supremo',
    sku: 'COL-HUI-SUP-002',
    shortDescription:
      'Full-bodied coffee with chocolate and caramel notes, perfect balance',
    origin: 'Colombia',
    region: 'Huila',
    farm: 'Various smallholder farms',
    altitude: '1,200-1,800 masl',
    variety: 'Caturra, Castillo',
    processing: 'Washed',
    grade: 'Supremo',
    harvestSeason: 'March - June, October - December',
    flavorNotes: ['Chocolate', 'Caramel', 'Nutty', 'Orange'],
    aroma: 'Rich chocolate with subtle fruit notes',
    acidity: 6,
    body: 8,
    sweetness: 8,
    price: 7.25,
    currency: 'USD',
    minimumOrder: 60,
    stock: 3200,
    unit: 'kg',
    status: 'active',
    featured: false,
    certifications: ['Rainforest Alliance', 'UTZ'],
    primaryImage: {
      publicId: 'coffee/colombian-huila',
      alt: 'Colombian Huila coffee beans',
    },
    rating: 4.6,
    reviewCount: 89,
  },
  {
    id: '3',
    name: 'Brazilian Santos NY2 Screen 17/18',
    slug: 'brazilian-santos-ny2',
    sku: 'BRA-SAN-NY2-003',
    shortDescription:
      'Classic Brazilian coffee with low acidity, nutty and chocolatey profile',
    origin: 'Brazil',
    region: 'São Paulo',
    farm: 'Fazenda Santa Ines',
    altitude: '800-1,200 masl',
    variety: 'Bourbon, Mundo Novo',
    processing: 'Natural',
    grade: 'NY2 Screen 17/18',
    harvestSeason: 'May - September',
    flavorNotes: ['Chocolate', 'Nutty', 'Caramel', 'Vanilla'],
    aroma: 'Sweet chocolate with nutty undertones',
    acidity: 4,
    body: 7,
    sweetness: 6,
    price: 6.8,
    currency: 'USD',
    minimumOrder: 60,
    stock: 4500,
    unit: 'kg',
    status: 'active',
    featured: false,
    certifications: ['UTZ'],
    primaryImage: {
      publicId: 'coffee/brazilian-santos',
      alt: 'Brazilian Santos coffee beans',
    },
    rating: 4.3,
    reviewCount: 156,
  },
  {
    id: '4',
    name: 'Guatemalan Antigua SHB',
    slug: 'guatemalan-antigua-shb',
    sku: 'GUA-ANT-SHB-004',
    shortDescription:
      'Full-bodied with smoky, spicy notes and rich chocolate undertones',
    origin: 'Guatemala',
    region: 'Antigua',
    farm: 'Finca El Injerto',
    altitude: '1,500-1,700 masl',
    variety: 'Bourbon, Typica',
    processing: 'Washed',
    grade: 'SHB (Strictly Hard Bean)',
    harvestSeason: 'December - March',
    flavorNotes: ['Chocolate', 'Spicy', 'Smoky', 'Citrus'],
    aroma: 'Complex with spice and chocolate notes',
    acidity: 7,
    body: 8,
    sweetness: 6,
    price: 9.2,
    currency: 'USD',
    minimumOrder: 60,
    stock: 1800,
    unit: 'kg',
    status: 'active',
    featured: true,
    certifications: ['Organic', 'Bird Friendly'],
    primaryImage: {
      publicId: 'coffee/guatemalan-antigua',
      alt: 'Guatemalan Antigua coffee beans',
    },
    rating: 4.7,
    reviewCount: 94,
  },
];

interface ProductComparePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductComparePage({
  searchParams,
}: ProductComparePageProps) {
  const resolvedSearchParams = await searchParams;
  // Get product IDs from search params
  const productIds = Array.isArray(resolvedSearchParams.products)
    ? resolvedSearchParams.products
    : resolvedSearchParams.products
      ? [resolvedSearchParams.products]
      : [];

  // Filter products based on IDs
  const selectedProducts = mockProducts.filter(product =>
    productIds.includes(product.id)
  );

  const availableProducts = mockProducts.filter(
    product => !productIds.includes(product.id)
  );

  const handleAddProduct = (productId: string) => {
    const newIds = [...productIds, productId];
    const params = new URLSearchParams();
    newIds.forEach(id => params.append('products', id));
    window.history.pushState(null, '', `?${params.toString()}`);
    window.location.reload();
  };

  const handleRemoveProduct = (productId: string) => {
    const newIds = productIds.filter(id => id !== productId);
    if (newIds.length === 0) {
      window.history.pushState(null, '', window.location.pathname);
    } else {
      const params = new URLSearchParams();
      newIds.forEach(id => params.append('products', id));
      window.history.pushState(null, '', `?${params.toString()}`);
    }
    window.location.reload();
  };

  const handleProductSelect = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId);
    if (product) {
      window.open(`/products/${product.slug}`, '_blank');
    }
  };

  const ProductSelector = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Product to Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Products to Compare</DialogTitle>
          <DialogDescription>
            Choose from our available coffee products to add to your comparison
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search products..." className="pl-10" />
            </div>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Origins</SelectItem>
                <SelectItem value="ethiopia">Ethiopia</SelectItem>
                <SelectItem value="colombia">Colombia</SelectItem>
                <SelectItem value="brazil">Brazil</SelectItem>
                <SelectItem value="guatemala">Guatemala</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid max-h-96 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-2 lg:grid-cols-3">
            {availableProducts.map(product => (
              <Card
                key={product.id}
                className="cursor-pointer transition-shadow hover:shadow-md"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="line-clamp-2 text-sm">
                        {product.name}
                      </CardTitle>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {product.origin}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          ${product.price.toFixed(2)}/{product.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="mb-3 line-clamp-2 text-xs text-muted-foreground">
                    {product.shortDescription}
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleAddProduct(product.id)}
                  >
                    <Plus className="mr-1 h-3 w-3" />
                    Add to Compare
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/products">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Scale className="h-6 w-6 text-coffee-600" />
                <h1 className="text-2xl font-bold">Product Comparison</h1>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {selectedProducts.length} of 4 products
              </Badge>
              {selectedProducts.length < 4 && <ProductSelector />}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {selectedProducts.length === 0 ? (
          <div className="py-16 text-center">
            <Scale className="mx-auto mb-6 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-4 text-2xl font-bold">
              Start Your Coffee Comparison
            </h2>
            <p className="mx-auto mb-8 max-w-md text-muted-foreground">
              Select coffee products to compare their characteristics, origins,
              flavor profiles, and pricing side by side.
            </p>
            <ProductSelector />

            {/* Quick Start Options */}
            <div className="mt-12">
              <h3 className="mb-4 text-lg font-semibold">
                Quick Start Comparisons
              </h3>
              <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm">African Origins</CardTitle>
                    <CardDescription className="text-xs">
                      Compare Ethiopian and Kenyan coffees
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.append('products', '1'); // Ethiopian
                        window.location.href = `?${params.toString()}`;
                      }}
                    >
                      <BarChart3 className="mr-2 h-3 w-3" />
                      Compare
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm">Central America</CardTitle>
                    <CardDescription className="text-xs">
                      Compare Colombian and Guatemalan varieties
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.append('products', '2'); // Colombian
                        params.append('products', '4'); // Guatemalan
                        window.location.href = `?${params.toString()}`;
                      }}
                    >
                      <BarChart3 className="mr-2 h-3 w-3" />
                      Compare
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer transition-shadow hover:shadow-md">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Processing Methods
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Compare washed vs natural processing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const params = new URLSearchParams();
                        params.append('products', '1'); // Washed Ethiopian
                        params.append('products', '3'); // Natural Brazilian
                        window.location.href = `?${params.toString()}`;
                      }}
                    >
                      <BarChart3 className="mr-2 h-3 w-3" />
                      Compare
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <ProductComparison
            products={selectedProducts}
            onAddProduct={() => {
              // This will be handled by the ProductSelector dialog
            }}
            onRemoveProduct={handleRemoveProduct}
            onProductSelect={handleProductSelect}
            maxProducts={4}
          />
        )}
      </div>

      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Coffee Product Comparison',
            description:
              'Compare different coffee varieties side by side. Analyze origin, flavor profiles, pricing, and characteristics.',
            url: 'https://thegreatbeans.com/products/compare',
            mainEntity: {
              '@type': 'ItemList',
              name: 'Coffee Products for Comparison',
              numberOfItems: selectedProducts.length,
              itemListElement: selectedProducts.map((product, index) => ({
                '@type': 'Product',
                position: index + 1,
                name: product.name,
                description: product.shortDescription,
                sku: product.sku,
                offers: {
                  '@type': 'Offer',
                  price: product.price,
                  priceCurrency: product.currency,
                  availability:
                    product.status === 'active'
                      ? 'https://schema.org/InStock'
                      : 'https://schema.org/OutOfStock',
                },
                brand: {
                  '@type': 'Brand',
                  name: 'The Great Beans',
                },
                category: 'Coffee',
                additionalProperty: [
                  {
                    '@type': 'PropertyValue',
                    name: 'Origin',
                    value: product.origin,
                  },
                  {
                    '@type': 'PropertyValue',
                    name: 'Processing Method',
                    value: product.processing,
                  },
                  {
                    '@type': 'PropertyValue',
                    name: 'Altitude',
                    value: product.altitude,
                  },
                ],
              })),
            },
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                {
                  '@type': 'ListItem',
                  position: 1,
                  name: 'Home',
                  item: 'https://thegreatbeans.com',
                },
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: 'Products',
                  item: 'https://thegreatbeans.com/products',
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: 'Compare',
                  item: 'https://thegreatbeans.com/products/compare',
                },
              ],
            },
          }),
        }}
      />
    </div>
  );
}
