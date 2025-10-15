import { type Metadata } from 'next';
import {
  Zap,
  Clock,
  Globe,
  Droplets,
  CheckCircle,
  Star,
  Package,
} from 'lucide-react';

import Link from 'next/link';

import { type Locale } from '@/i18n';
import { Button } from '@/presentation/components/ui';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params: _params,
}: Props): Promise<Metadata> {
  return {
    title:
      'Premium Instant Coffee - Vietnamese Robusta & Arabica - The Great Beans',
    description:
      'High-quality instant coffee made from premium Vietnamese Robusta and Highland Arabica. Spray-dried and freeze-dried options for global markets.',
    openGraph: {
      title:
        'Premium Instant Coffee - Vietnamese Robusta & Arabica - The Great Beans',
      description:
        'Premium instant coffee solutions with superior solubility, rich flavor, and consistent quality for global markets.',
      type: 'website',
    },
  };
}

export default async function InstantCoffeePage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-amber-100 p-4">
                <Zap className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Premium Instant Coffee
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Superior instant coffee solutions made from premium Vietnamese
              beans. Perfect solubility, rich flavor, and consistent quality for
              global markets.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Link href={`/${locale}/quote`}>Request Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>Technical Specs</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Instant Coffee */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Advanced Instant Coffee Technology
              </h2>
              <p className="text-lg text-forest-600">
                State-of-the-art processing for superior instant coffee products
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Droplets className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Superior Solubility
                  </h3>
                  <p className="text-forest-600">
                    Advanced spray-drying and freeze-drying technology ensures
                    instant dissolution with no residue or clumping.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Extended Shelf Life
                  </h3>
                  <p className="text-forest-600">
                    Optimized moisture content and packaging ensure 24+ months
                    shelf life while maintaining flavor integrity.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Globe className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Global Standards
                  </h3>
                  <p className="text-forest-600">
                    Meets international food safety standards including FDA, EU,
                    and HACCP certifications for worldwide distribution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Product Specifications
              </h2>
              <p className="text-lg text-forest-600">
                Technical specifications for our instant coffee products
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Spray-Dried Instant Coffee
                  </CardTitle>
                  <p className="text-forest-600">
                    Premium grade for commercial use
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Technical Specifications
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-forest-600">
                          Moisture Content:
                        </span>
                        <span className="font-medium">≤ 5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Bulk Density:</span>
                        <span className="font-medium">0.35-0.45 g/ml</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Particle Size:</span>
                        <span className="font-medium">100-300 mesh</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Solubility:</span>
                        <span className="font-medium">≥ 99%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">pH Level:</span>
                        <span className="font-medium">5.0-5.5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Fast Dissolving</Badge>
                      <Badge variant="secondary">Cost Effective</Badge>
                      <Badge variant="secondary">Rich Aroma</Badge>
                      <Badge variant="secondary">Stable Quality</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Applications
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Retail packaging
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Vending machines
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Food service industry
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          3-in-1 coffee mixes
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    Freeze-Dried Instant Coffee
                  </CardTitle>
                  <p className="text-forest-600">
                    Premium grade for specialty markets
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Technical Specifications
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-forest-600">
                          Moisture Content:
                        </span>
                        <span className="font-medium">≤ 3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Bulk Density:</span>
                        <span className="font-medium">0.25-0.35 g/ml</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Particle Size:</span>
                        <span className="font-medium">Granular</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Solubility:</span>
                        <span className="font-medium">≥ 99.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">pH Level:</span>
                        <span className="font-medium">5.0-5.5</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Premium Quality</Badge>
                      <Badge variant="secondary">Superior Aroma</Badge>
                      <Badge variant="secondary">Original Flavor</Badge>
                      <Badge variant="secondary">Longer Shelf Life</Badge>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 font-semibold text-forest-900">
                      Applications
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Premium retail brands
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Specialty coffee shops
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          High-end hospitality
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">Export markets</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Methods */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Processing Methods
              </h2>
              <p className="text-lg text-forest-600">
                Advanced technology for superior instant coffee production
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Coffee Extraction
                  </h3>
                  <p className="text-forest-600">
                    Premium green coffee beans are roasted to perfection and
                    then extracted using controlled temperature and pressure to
                    preserve maximum flavor and aroma compounds.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Concentration
                  </h3>
                  <p className="text-forest-600">
                    The coffee extract is concentrated using vacuum evaporation
                    at low temperatures to maintain flavor integrity while
                    removing excess water content.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Drying Process
                  </h3>
                  <p className="text-forest-600">
                    The concentrated extract undergoes either spray-drying for
                    cost-effective production or freeze-drying for premium
                    quality, resulting in instant coffee powder or granules.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-lg font-bold text-amber-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Quality Control & Packaging
                  </h3>
                  <p className="text-forest-600">
                    Final products undergo rigorous quality testing for
                    solubility, moisture content, and flavor profile before
                    being packaged in moisture-proof containers for optimal
                    preservation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packaging Options */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Packaging Options
              </h2>
              <p className="text-lg text-forest-600">
                Flexible packaging solutions for different market needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Package className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Bulk Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-forest-600">25kg bags:</span>
                      <span className="font-medium">Industrial use</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">500kg big bags:</span>
                      <span className="font-medium">Large manufacturers</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Drums:</span>
                      <span className="font-medium">Long-term storage</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Package className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Retail Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-forest-600">100g jars:</span>
                      <span className="font-medium">Premium retail</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">200g pouches:</span>
                      <span className="font-medium">Family size</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Sachets:</span>
                      <span className="font-medium">Single serve</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Package className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Custom Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-forest-600">Private label:</span>
                      <span className="font-medium">Your brand</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Custom sizes:</span>
                      <span className="font-medium">Any quantity</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Special formats:</span>
                      <span className="font-medium">On request</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Why Choose Our Instant Coffee?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Premium Raw Materials
                  </h3>
                  <p className="text-forest-600">
                    Made from carefully selected Vietnamese Robusta and Arabica
                    beans
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Advanced Technology
                  </h3>
                  <p className="text-forest-600">
                    State-of-the-art processing equipment for consistent quality
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Global Certifications
                  </h3>
                  <p className="text-forest-600">
                    FDA, EU, HACCP certified for international markets
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Competitive Pricing
                  </h3>
                  <p className="text-forest-600">
                    Direct from source pricing with no intermediaries
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Flexible MOQ
                  </h3>
                  <p className="text-forest-600">
                    Minimum order quantities suitable for all business sizes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Reliable Supply
                  </h3>
                  <p className="text-forest-600">
                    Consistent supply chain with 14+ years of experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Source Premium Instant Coffee?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Get competitive quotes for high-quality instant coffee products.
              From small batches to container loads, we have the solution for
              your needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-amber-600 hover:bg-amber-700"
              >
                <Link href={`/${locale}/quote`}>Get Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Technical Support
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
