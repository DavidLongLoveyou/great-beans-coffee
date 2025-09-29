import { type Locale } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import Link from 'next/link';
import { 
  Coffee, 
  Filter, 
  Search, 
  Star, 
  MapPin, 
  Package, 
  Truck,
  Download,
  Eye,
  ShoppingCart
} from 'lucide-react';

interface ProductsPageProps {
  params: {
    locale: Locale;
  };
}

// Mock data - will be replaced with real data from repository
const mockProducts = [
  {
    id: '1',
    sku: 'ROB-G1-NAT-001',
    name: 'Premium Robusta Grade 1',
    shortDescription: 'High-quality natural processed Robusta from Dak Lak province',
    type: 'ROBUSTA',
    grade: 'GRADE_1',
    processingMethod: 'NATURAL',
    origin: {
      region: 'Dak Lak',
      province: 'Dak Lak',
      altitude: 500
    },
    pricing: {
      basePrice: 2850,
      currency: 'USD',
      unit: 'MT'
    },
    availability: {
      inStock: true,
      stockQuantity: 150,
      leadTime: 14
    },
    certifications: ['ORGANIC', 'RAINFOREST_ALLIANCE'],
    images: [
      {
        url: '/images/products/robusta-grade1.jpg',
        alt: 'Premium Robusta Grade 1 Coffee Beans',
        isPrimary: true
      }
    ],
    isFeatured: true,
    specifications: {
      moisture: 12.5,
      screenSize: '18+',
      defectRate: 0.5
    }
  },
  {
    id: '2',
    sku: 'ARA-SP-WAS-002',
    name: 'Specialty Arabica Washed',
    shortDescription: 'Premium washed Arabica from Lam Dong highlands',
    type: 'ARABICA',
    grade: 'SPECIALTY',
    processingMethod: 'WASHED',
    origin: {
      region: 'Lam Dong',
      province: 'Lam Dong',
      altitude: 1200
    },
    pricing: {
      basePrice: 4200,
      currency: 'USD',
      unit: 'MT'
    },
    availability: {
      inStock: true,
      stockQuantity: 80,
      leadTime: 21
    },
    certifications: ['ORGANIC', 'FAIR_TRADE'],
    images: [
      {
        url: '/images/products/arabica-specialty.jpg',
        alt: 'Specialty Arabica Washed Coffee Beans',
        isPrimary: true
      }
    ],
    isFeatured: true,
    specifications: {
      moisture: 11.0,
      screenSize: '16+',
      defectRate: 0.2,
      cuppingScore: 85
    }
  },
  {
    id: '3',
    sku: 'ROB-G2-HON-003',
    name: 'Robusta Grade 2 Honey',
    shortDescription: 'Honey processed Robusta with unique flavor profile',
    type: 'ROBUSTA',
    grade: 'GRADE_2',
    processingMethod: 'HONEY',
    origin: {
      region: 'Gia Lai',
      province: 'Gia Lai',
      altitude: 600
    },
    pricing: {
      basePrice: 2650,
      currency: 'USD',
      unit: 'MT'
    },
    availability: {
      inStock: true,
      stockQuantity: 200,
      leadTime: 10
    },
    certifications: ['RAINFOREST_ALLIANCE'],
    images: [
      {
        url: '/images/products/robusta-honey.jpg',
        alt: 'Robusta Grade 2 Honey Processed Coffee Beans',
        isPrimary: true
      }
    ],
    isFeatured: false,
    specifications: {
      moisture: 12.0,
      screenSize: '16+',
      defectRate: 1.0
    }
  }
];

const coffeeTypes = ['ALL', 'ROBUSTA', 'ARABICA', 'SPECIALTY', 'BLEND'];
const grades = ['ALL', 'GRADE_1', 'GRADE_2', 'SPECIALTY', 'SCREEN_18', 'SCREEN_16'];
const processingMethods = ['ALL', 'NATURAL', 'WASHED', 'HONEY', 'WET_HULLED'];

export default function ProductsPage({ params: { locale } }: ProductsPageProps) {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Premium Vietnamese Coffee Products
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our exceptional range of Robusta and Arabica beans, sourced directly from Vietnam's finest coffee regions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">500+</div>
                <div className="text-gray-600">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">50+</div>
                <div className="text-gray-600">Countries Served</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600">25+</div>
                <div className="text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Filter className="mr-2 h-5 w-5" />
              Filter Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Search */}
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Coffee Type Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Coffee Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {coffeeTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grade Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Grade</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {grades.map((grade) => (
                    <option key={grade} value={grade}>
                      {grade.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Processing Method Filter */}
              <div>
                <label className="block text-sm font-medium mb-2">Processing</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {processingMethods.map((method) => (
                    <option key={method} value={method}>
                      {method.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">
                Showing {mockProducts.length} products
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Reset Filters
                </Button>
                <Button size="sm">
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="group hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="pb-4">
                <div className="relative">
                  {/* Product Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4">
                    <Coffee className="h-16 w-16 text-amber-600" />
                  </div>
                  
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <Badge className="absolute top-2 right-2 bg-amber-500">
                      <Star className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                  
                  {/* Stock Status */}
                  <Badge 
                    variant={product.availability.inStock ? "default" : "destructive"}
                    className="absolute top-2 left-2"
                  >
                    {product.availability.inStock ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>

                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm">
                  {product.shortDescription}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Product Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Type:</span>
                    <p className="text-gray-600">{product.type}</p>
                  </div>
                  <div>
                    <span className="font-medium">Grade:</span>
                    <p className="text-gray-600">{product.grade}</p>
                  </div>
                  <div>
                    <span className="font-medium">Processing:</span>
                    <p className="text-gray-600">{product.processingMethod}</p>
                  </div>
                  <div>
                    <span className="font-medium">Origin:</span>
                    <p className="text-gray-600">{product.origin.region}</p>
                  </div>
                </div>

                {/* Specifications */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <h4 className="font-medium text-sm mb-2">Key Specifications</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>Moisture: {product.specifications.moisture}%</div>
                    <div>Screen: {product.specifications.screenSize}</div>
                    <div>Defects: {product.specifications.defectRate}%</div>
                    {product.specifications.cuppingScore && (
                      <div>Cupping: {product.specifications.cuppingScore}</div>
                    )}
                  </div>
                </div>

                {/* Certifications */}
                <div className="flex flex-wrap gap-1">
                  {product.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Price:</span>
                    <span className="text-lg font-bold text-green-600">
                      ${product.pricing.basePrice.toLocaleString()}/{product.pricing.unit}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Lead time: {product.availability.leadTime} days
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Link href={`/${locale}/products/${product.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </Button>
                  </Link>
                  <Link href={`/${locale}/quote?product=${product.id}`} className="flex-1">
                    <Button size="sm" className="w-full">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Request Quote
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More / Pagination */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Products
          </Button>
        </div>

        {/* CTA Section */}
        <Card className="mt-16 bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              Our team can source specific coffee varieties and grades according to your requirements. 
              Contact us for custom sourcing solutions.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/quote`}>
                <Button variant="secondary" size="lg">
                  <Package className="mr-2 h-5 w-5" />
                  Request Custom Quote
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-green-600">
                  <Truck className="mr-2 h-5 w-5" />
                  Contact Sales Team
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}