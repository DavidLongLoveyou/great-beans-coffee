import { useTranslations } from 'next-intl';
import { type Locale } from '@/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs';
import Link from 'next/link';
import { 
  Coffee, 
  MapPin, 
  Package, 
  Truck,
  Download,
  ShoppingCart,
  Star,
  Award,
  Thermometer,
  Droplets,
  Scale,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Share2,
  Heart,
  FileText,
  Globe
} from 'lucide-react';

interface ProductDetailPageProps {
  params: {
    locale: Locale;
    id: string;
  };
}

// Mock product data - will be replaced with real data from repository
const mockProduct = {
  id: '1',
  sku: 'ROB-G1-NAT-001',
  name: 'Premium Robusta Grade 1',
  shortDescription: 'High-quality natural processed Robusta from Dak Lak province',
  longDescription: `Our Premium Robusta Grade 1 represents the finest quality Robusta coffee beans sourced directly from the fertile highlands of Dak Lak province, Vietnam. These beans are carefully selected from farms that practice sustainable agriculture and are processed using traditional natural methods that enhance the coffee's inherent characteristics.

This exceptional coffee offers a full-bodied flavor profile with notes of dark chocolate, nuts, and a hint of earthiness. The natural processing method allows the beans to develop their unique flavor complexity while maintaining the robust characteristics that make Vietnamese Robusta world-renowned.

Perfect for espresso blends, instant coffee production, and commercial roasting applications. Our strict quality control ensures consistent moisture content, minimal defects, and optimal bean size distribution.`,
  type: 'ROBUSTA',
  grade: 'GRADE_1',
  processingMethod: 'NATURAL',
  origin: {
    country: 'Vietnam',
    region: 'Dak Lak',
    province: 'Dak Lak',
    altitude: 500,
    coordinates: {
      latitude: 12.7100,
      longitude: 108.2378
    },
    harvestSeason: 'October - February',
    farmingMethod: 'Sustainable Agriculture'
  },
  pricing: {
    basePrice: 2850,
    currency: 'USD',
    unit: 'MT',
    minimumOrder: 20,
    priceValidUntil: '2024-12-31',
    paymentTerms: 'T/T, L/C at sight',
    incoterms: ['FOB', 'CIF', 'CFR']
  },
  availability: {
    inStock: true,
    stockQuantity: 150,
    leadTime: 14,
    productionCapacity: '500 MT/month',
    nextHarvest: '2024-10-01'
  },
  certifications: [
    {
      name: 'ORGANIC',
      issuer: 'USDA Organic',
      validUntil: '2025-06-30',
      certificateNumber: 'ORG-2024-001'
    },
    {
      name: 'RAINFOREST_ALLIANCE',
      issuer: 'Rainforest Alliance',
      validUntil: '2025-12-31',
      certificateNumber: 'RA-2024-VN-001'
    }
  ],
  images: [
    {
      url: '/images/products/robusta-grade1-1.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Main View',
      isPrimary: true
    },
    {
      url: '/images/products/robusta-grade1-2.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Close Up',
      isPrimary: false
    },
    {
      url: '/images/products/robusta-grade1-3.jpg',
      alt: 'Premium Robusta Grade 1 Coffee Beans - Packaging',
      isPrimary: false
    }
  ],
  isFeatured: true,
  specifications: {
    moisture: 12.5,
    screenSize: '18+',
    defectRate: 0.5,
    density: '0.65-0.70 g/ml',
    caffeine: '2.2-2.7%',
    ash: '3.5-4.5%',
    lipids: '10-12%',
    proteins: '11-13%',
    chlorogenicAcid: '7-10%'
  },
  packaging: {
    options: [
      {
        type: 'Jute Bags',
        weight: '60kg',
        description: 'Traditional jute bags with inner plastic lining'
      },
      {
        type: 'PP Bags',
        weight: '60kg',
        description: 'Polypropylene bags with moisture barrier'
      },
      {
        type: 'Bulk Container',
        weight: '20MT',
        description: 'Food-grade bulk containers for large shipments'
      }
    ],
    customPackaging: true
  },
  qualityTests: [
    {
      parameter: 'Moisture Content',
      value: '12.5%',
      standard: '≤ 12.5%',
      status: 'PASS'
    },
    {
      parameter: 'Defect Rate',
      value: '0.5%',
      standard: '≤ 1%',
      status: 'PASS'
    },
    {
      parameter: 'Screen Size',
      value: '18+',
      standard: '≥ 18',
      status: 'PASS'
    },
    {
      parameter: 'Foreign Matter',
      value: '0.1%',
      standard: '≤ 0.5%',
      status: 'PASS'
    }
  ],
  documents: [
    {
      name: 'Product Specification Sheet',
      type: 'PDF',
      size: '2.3 MB',
      downloadUrl: '/documents/robusta-g1-specs.pdf'
    },
    {
      name: 'Quality Certificate',
      type: 'PDF',
      size: '1.8 MB',
      downloadUrl: '/documents/robusta-g1-quality.pdf'
    },
    {
      name: 'Organic Certificate',
      type: 'PDF',
      size: '1.2 MB',
      downloadUrl: '/documents/robusta-g1-organic.pdf'
    }
  ]
};

export default function ProductDetailPage({ params: { locale, id } }: ProductDetailPageProps) {
  const t = useTranslations('products');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/products`} className="text-gray-500 hover:text-gray-700">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900">{mockProduct.name}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href={`/${locale}/products`}>
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Product Images */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* Main Product Image */}
                <div className="w-full h-80 bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg flex items-center justify-center mb-4">
                  <Coffee className="h-24 w-24 text-amber-600" />
                </div>
                
                {/* Thumbnail Images */}
                <div className="grid grid-cols-3 gap-2">
                  {mockProduct.images.map((image, index) => (
                    <div key={index} className="w-full h-20 bg-gradient-to-br from-amber-50 to-amber-100 rounded border-2 border-transparent hover:border-green-500 cursor-pointer flex items-center justify-center">
                      <Coffee className="h-8 w-8 text-amber-500" />
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="mt-6 space-y-3">
                  <Button className="w-full" size="lg">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Request Quote
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="mr-2 h-4 w-4" />
                      Save
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Product Information */}
          <div className="lg:col-span-2">
            {/* Product Header */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{mockProduct.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {mockProduct.shortDescription}
                    </CardDescription>
                    <p className="text-sm text-gray-500 mt-2">SKU: {mockProduct.sku}</p>
                  </div>
                  <div className="text-right">
                    {mockProduct.isFeatured && (
                      <Badge className="mb-2 bg-amber-500">
                        <Star className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    )}
                    <Badge 
                      variant={mockProduct.availability.inStock ? "default" : "destructive"}
                      className="block"
                    >
                      {mockProduct.availability.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Key Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Coffee className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">{mockProduct.type}</p>
                    <p className="text-xs text-gray-600">Type</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">{mockProduct.grade}</p>
                    <p className="text-xs text-gray-600">Grade</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Droplets className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">{mockProduct.processingMethod}</p>
                    <p className="text-xs text-gray-600">Processing</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm font-medium">{mockProduct.origin.region}</p>
                    <p className="text-xs text-gray-600">Origin</p>
                  </div>
                </div>

                {/* Pricing */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-medium">Price:</span>
                    <span className="text-2xl font-bold text-green-600">
                      ${mockProduct.pricing.basePrice.toLocaleString()}/{mockProduct.pricing.unit}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    <div>Minimum Order: {mockProduct.pricing.minimumOrder} MT</div>
                    <div>Lead Time: {mockProduct.availability.leadTime} days</div>
                    <div>Payment: {mockProduct.pricing.paymentTerms}</div>
                    <div>Valid Until: {mockProduct.pricing.priceValidUntil}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Information Tabs */}
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="origin">Origin</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                    <TabsTrigger value="documents">Documents</TabsTrigger>
                  </TabsList>

                  <TabsContent value="description" className="mt-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                      <div className="whitespace-pre-line text-gray-700">
                        {mockProduct.longDescription}
                      </div>
                      
                      <h4 className="text-md font-semibold mt-6 mb-3">Certifications</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {mockProduct.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">{cert.name.replace('_', ' ')}</p>
                              <p className="text-sm text-gray-600">
                                {cert.issuer} • Valid until {cert.validUntil}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="specifications" className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Physical Properties</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Moisture Content:</span>
                            <span className="font-medium">{mockProduct.specifications.moisture}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Screen Size:</span>
                            <span className="font-medium">{mockProduct.specifications.screenSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Defect Rate:</span>
                            <span className="font-medium">{mockProduct.specifications.defectRate}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Density:</span>
                            <span className="font-medium">{mockProduct.specifications.density}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Chemical Composition</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Caffeine:</span>
                            <span className="font-medium">{mockProduct.specifications.caffeine}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Ash:</span>
                            <span className="font-medium">{mockProduct.specifications.ash}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Lipids:</span>
                            <span className="font-medium">{mockProduct.specifications.lipids}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Proteins:</span>
                            <span className="font-medium">{mockProduct.specifications.proteins}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h4 className="font-medium mt-6 mb-3">Packaging Options</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mockProduct.packaging.options.map((option, index) => (
                        <div key={index} className="p-4 border rounded-lg">
                          <div className="flex items-center mb-2">
                            <Package className="h-5 w-5 text-green-600 mr-2" />
                            <span className="font-medium">{option.type}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">{option.weight}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="origin" className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Origin Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Location Details</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Globe className="h-4 w-4 text-green-600 mr-2" />
                            <span>Country: {mockProduct.origin.country}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-green-600 mr-2" />
                            <span>Region: {mockProduct.origin.region}, {mockProduct.origin.province}</span>
                          </div>
                          <div className="flex items-center">
                            <Thermometer className="h-4 w-4 text-green-600 mr-2" />
                            <span>Altitude: {mockProduct.origin.altitude}m above sea level</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Farming Information</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-green-600 mr-2" />
                            <span>Harvest Season: {mockProduct.origin.harvestSeason}</span>
                          </div>
                          <div className="flex items-center">
                            <Award className="h-4 w-4 text-green-600 mr-2" />
                            <span>Farming Method: {mockProduct.origin.farmingMethod}</span>
                          </div>
                          <div className="flex items-center">
                            <Scale className="h-4 w-4 text-green-600 mr-2" />
                            <span>Production Capacity: {mockProduct.availability.productionCapacity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="quality" className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Quality Test Results</h3>
                    <div className="space-y-4">
                      {mockProduct.qualityTests.map((test, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{test.parameter}</p>
                            <p className="text-sm text-gray-600">Standard: {test.standard}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{test.value}</p>
                            <div className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                              <span className="text-sm text-green-600">{test.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="documents" className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Available Documents</h3>
                    <div className="space-y-3">
                      {mockProduct.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <p className="text-sm text-gray-600">{doc.type} • {doc.size}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle>Related Products</CardTitle>
            <CardDescription>
              Other products you might be interested in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-gray-500">
              Related products will be displayed here
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}