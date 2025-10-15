import { type Metadata } from 'next';
import {
  Coffee,
  Award,
  Leaf,
  TrendingUp,
  CheckCircle,
  Star,
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
    title: 'Premium Vietnamese Robusta Coffee - The Great Beans',
    description:
      'Discover our premium Vietnamese Robusta coffee beans. High caffeine content, bold flavor, and exceptional quality for global markets. Perfect for espresso blends and instant coffee.',
    openGraph: {
      title: 'Premium Vietnamese Robusta Coffee - The Great Beans',
      description:
        'Discover our premium Vietnamese Robusta coffee beans. High caffeine content, bold flavor, and exceptional quality for global markets.',
      type: 'website',
    },
  };
}

export default async function RobustaPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-amber-100 p-4">
                <Coffee className="h-12 w-12 text-amber-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Vietnamese Robusta Coffee
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Bold, robust, and full of character. Our premium Robusta beans
              deliver exceptional strength and flavor for the global coffee
              market.
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
                <Link href={`/${locale}/contact`}>Contact Sales</Link>
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
                Why Choose Our Robusta?
              </h2>
              <p className="text-lg text-forest-600">
                Vietnam produces the world&rsquo;s finest Robusta coffee, and we
                source only the best
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <TrendingUp className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    High Caffeine Content
                  </h3>
                  <p className="text-forest-600">
                    Our Robusta beans contain 2.2-2.7% caffeine, nearly double
                    that of Arabica, perfect for espresso blends and
                    energy-focused products.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Award className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Premium Quality
                  </h3>
                  <p className="text-forest-600">
                    Carefully selected from the best farms in Dak Lak and Gia
                    Lai provinces, our beans meet international quality
                    standards.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                    <Leaf className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Sustainable Sourcing
                  </h3>
                  <p className="text-forest-600">
                    Direct partnerships with local farmers ensure sustainable
                    practices and fair compensation throughout our supply chain.
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
                        <Star className="h-5 w-5 text-amber-500" />
                        Grade 1 Robusta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Screen Size:</span>
                        <span className="font-medium">16+ (90% min)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Moisture:</span>
                        <span className="font-medium">12.5% max</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Defects:</span>
                        <span className="font-medium">5% max</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Black/Broken:</span>
                        <span className="font-medium">2% max</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Star className="h-5 w-5 text-amber-500" />
                        Grade 2 Robusta
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-forest-600">Screen Size:</span>
                        <span className="font-medium">16+ (80% min)</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Moisture:</span>
                        <span className="font-medium">12.5% max</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Defects:</span>
                        <span className="font-medium">8% max</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-forest-600">Black/Broken:</span>
                        <span className="font-medium">3% max</span>
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
                          <Badge variant="secondary">Bold</Badge>
                          <Badge variant="secondary">Earthy</Badge>
                          <Badge variant="secondary">Nutty</Badge>
                          <Badge variant="secondary">Chocolate</Badge>
                          <Badge variant="secondary">Full-bodied</Badge>
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
                              Strong, robust flavor
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">Low acidity</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Excellent crema production
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-forest-600">
                              Perfect for espresso blends
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
                        Espresso Blends
                      </h4>
                      <p className="text-sm text-forest-600">
                        Adds body and crema
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">
                        Instant Coffee
                      </h4>
                      <p className="text-sm text-forest-600">
                        High extraction yield
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">
                        Dark Roasts
                      </h4>
                      <p className="text-sm text-forest-600">
                        Maintains flavor intensity
                      </p>
                    </div>
                    <div className="rounded-lg bg-white p-4 shadow-sm">
                      <h4 className="font-medium text-forest-900">
                        Commercial Blends
                      </h4>
                      <p className="text-sm text-forest-600">
                        Cost-effective quality
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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
                We offer multiple processing methods to meet your specific
                requirements
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Natural (Dry) Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    Traditional sun-drying method that enhances the natural
                    sweetness and body of the beans.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Fuller body
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Enhanced sweetness
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Traditional flavor
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Washed (Wet) Process</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-forest-600">
                    Modern processing method that produces cleaner, more
                    consistent flavor profiles.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Cleaner taste
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Consistent quality
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-forest-600">
                        Bright acidity
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
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Source Premium Robusta?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Join hundreds of satisfied customers worldwide who trust our
              premium Vietnamese Robusta for their coffee needs.
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
                <Link href={`/${locale}/contact`}>Request Samples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
