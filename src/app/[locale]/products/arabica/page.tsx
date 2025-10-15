import { type Metadata } from 'next';
import {
  Coffee,
  Award,
  Mountain,
  Sparkles,
  CheckCircle,
  Star,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
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
  params: { locale: Locale };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: 'Premium Vietnamese Highland Arabica Coffee - The Great Beans',
    description:
      'Discover our exceptional Vietnamese Highland Arabica coffee beans. Grown at high altitudes with complex flavors, bright acidity, and aromatic profiles for specialty coffee markets.',
    openGraph: {
      title: 'Premium Vietnamese Highland Arabica Coffee - The Great Beans',
      description:
        'Discover our exceptional Vietnamese Highland Arabica coffee beans. Grown at high altitudes with complex flavors and bright acidity.',
      type: 'website',
    },
  };
}

export default async function ArabicaPage({ params }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <Mountain className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Vietnamese Highland Arabica
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Exceptional quality from Vietnam's highland regions. Complex
              flavors, bright acidity, and aromatic profiles for the specialty
              coffee market.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${params.locale}/quote`}>Request Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/contact`}>Contact Sales</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Overview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Highland Excellence
              </h2>
              <p className="text-lg text-forest-600">
                Grown at 1,200-1,600 meters above sea level in Vietnam's
                pristine highland regions
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Mountain className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    High Altitude Growing
                  </h3>
                  <p className="text-forest-600">
                    Cultivated at optimal altitudes of 1,200-1,600m in Da Lat
                    and surrounding highland regions, ensuring slow maturation
                    and complex flavor development.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Sparkles className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Complex Flavor Profile
                  </h3>
                  <p className="text-forest-600">
                    Bright acidity, floral notes, and fruity undertones create a
                    sophisticated cup profile perfect for specialty coffee
                    applications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Award className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Specialty Grade
                  </h3>
                  <p className="text-forest-600">
                    Carefully hand-picked and processed to meet Specialty Coffee
                    Association standards, with minimal defects and exceptional
                    cup quality.
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
            <div className="grid gap-12 lg:grid-cols-2">
              <div>
                <h2 className="mb-6 text-3xl font-bold text-forest-900">
                  Product Specifications
                </h2>
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-emerald-500" />
                        Specialty Grade Arabica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Screen Size:</span>
                        <span className="font-medium">15+ (85% min)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Moisture:</span>
                        <span className="font-medium">11-12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Defects:</span>
                        <span className="font-medium">0-5 per 350g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Cup Score:</span>
                        <span className="font-medium">80+ points</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-emerald-500" />
                        Premium Grade Arabica
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Screen Size:</span>
                        <span className="font-medium">14+ (80% min)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Moisture:</span>
                        <span className="font-medium">11-12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Defects:</span>
                        <span className="font-medium">6-15 per 350g</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Cup Score:</span>
                        <span className="font-medium">75-79 points</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-3xl font-bold text-forest-900">
                  Flavor Profile
                </h2>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="mb-2 font-semibold text-forest-900">
                          Tasting Notes
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">Floral</Badge>
                          <Badge variant="secondary">Citrus</Badge>
                          <Badge variant="secondary">Berry</Badge>
                          <Badge variant="secondary">Chocolate</Badge>
                          <Badge variant="secondary">Caramel</Badge>
                          <Badge variant="secondary">Honey</Badge>
                        </div>
                      </div>

                      <div>
                        <h4 className="mb-3 font-semibold text-forest-900">
                          Characteristics
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Bright, clean acidity
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Medium to full body
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Complex aromatic profile
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Long, pleasant finish
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6">
                  <h3 className="mb-4 text-xl font-semibold text-forest-900">
                    Best Uses
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">
                        Single Origin
                      </h4>
                      <p className="text-sm text-forest-600">
                        Showcase unique terroir
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">
                        Specialty Blends
                      </h4>
                      <p className="text-sm text-forest-600">
                        Premium coffee blends
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">Pour Over</h4>
                      <p className="text-sm text-forest-600">
                        Highlight complexity
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">Cold Brew</h4>
                      <p className="text-sm text-forest-600">
                        Smooth, sweet profile
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Growing Regions */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Growing Regions
              </h2>
              <p className="text-lg text-forest-600">
                Our Arabica comes from Vietnam's premier highland coffee regions
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Da Lat Highlands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    The heart of Vietnamese Arabica production, known for its
                    cool climate and volcanic soil.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest-500">Altitude:</span>
                      <span>1,200-1,500m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Climate:</span>
                      <span>Temperate</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Harvest:</span>
                      <span>Oct-Feb</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Lam Dong Province</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    High-altitude region producing beans with exceptional
                    clarity and bright acidity.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest-500">Altitude:</span>
                      <span>1,300-1,600m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Climate:</span>
                      <span>Cool, Dry</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Harvest:</span>
                      <span>Nov-Mar</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Kon Tum Highlands</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    Emerging region producing unique flavor profiles with
                    distinctive terroir characteristics.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-forest-500">Altitude:</span>
                      <span>1,200-1,400m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Climate:</span>
                      <span>Tropical Highland</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-500">Harvest:</span>
                      <span>Dec-Apr</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Processing Methods */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Processing Methods
              </h2>
              <p className="text-lg text-forest-600">
                Multiple processing options to achieve your desired flavor
                profile
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Washed Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    Clean, bright flavors with pronounced acidity and clarity.
                    Perfect for showcasing origin characteristics.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Bright acidity
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">Clean cup</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Floral notes
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Honey Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    Balanced sweetness with enhanced body. Combines the best of
                    washed and natural processing.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Enhanced sweetness
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Medium body
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Fruity undertones
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-emerald-50 to-teal-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Experience Highland Excellence
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Discover the exceptional quality of Vietnamese Highland Arabica.
              Perfect for specialty coffee roasters and discerning coffee
              lovers.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${params.locale}/quote`}>Get Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/contact`}>Request Samples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
