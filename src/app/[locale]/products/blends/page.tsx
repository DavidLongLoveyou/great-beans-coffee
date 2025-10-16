import { type Metadata } from 'next';
import {  Coffee, Palette, Target, Zap, CheckCircle, Star  } from '@/components/ui/dynamic-icons';

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
      'Premium Coffee Blends - Vietnamese Robusta & Arabica - The Great Beans',
    description:
      'Expertly crafted coffee blends combining Vietnamese Robusta and Highland Arabica. Custom blending services for roasters, distributors, and coffee brands worldwide.',
    openGraph: {
      title:
        'Premium Coffee Blends - Vietnamese Robusta & Arabica - The Great Beans',
      description:
        'Expertly crafted coffee blends combining Vietnamese Robusta and Highland Arabica for perfect balance and flavor.',
      type: 'website',
    },
  };
}

export default async function BlendsPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4">
                <Palette className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Premium Coffee Blends
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Expertly crafted blends combining the best of Vietnamese Robusta
              and Highland Arabica. Perfect balance, exceptional flavor, and
              consistent quality.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href={`/${locale}/quote`}>Request Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>Custom Blending</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Blends */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Master Blending Expertise
              </h2>
              <p className="text-lg text-forest-600">
                14+ years of experience creating perfect coffee blends for
                global markets
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Precision Blending
                  </h3>
                  <p className="text-forest-600">
                    Our master blenders use precise ratios and careful selection
                    to create consistent, balanced profiles that meet your exact
                    specifications.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Zap className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Best of Both Worlds
                  </h3>
                  <p className="text-forest-600">
                    Combine Robusta&rsquo;s strength and crema with
                    Arabica&rsquo;s complexity and aroma for blends that excel
                    in both flavor and performance.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Coffee className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Custom Solutions
                  </h3>
                  <p className="text-forest-600">
                    From espresso blends to filter coffee, we create custom
                    blends tailored to your brand, market preferences, and
                    brewing methods.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Blend Profiles */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Popular Blend Profiles
              </h2>
              <p className="text-lg text-forest-600">
                Proven formulations that deliver exceptional results
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Espresso Supreme Blend
                  </CardTitle>
                  <p className="text-forest-600">70% Robusta + 30% Arabica</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Rich Crema</Badge>
                      <Badge variant="secondary">Full Body</Badge>
                      <Badge variant="secondary">Chocolate Notes</Badge>
                      <Badge variant="secondary">Low Acidity</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Perfect For
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Espresso machines
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Café and restaurant use
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Milk-based beverages
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-500" />
                    Specialty Filter Blend
                  </CardTitle>
                  <p className="text-forest-600">40% Robusta + 60% Arabica</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Balanced</Badge>
                      <Badge variant="secondary">Bright Acidity</Badge>
                      <Badge variant="secondary">Floral Notes</Badge>
                      <Badge variant="secondary">Medium Body</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Perfect For
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Pour-over brewing
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Drip coffee makers
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Specialty coffee shops
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-orange-500" />
                    Commercial House Blend
                  </CardTitle>
                  <p className="text-forest-600">80% Robusta + 20% Arabica</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Strong</Badge>
                      <Badge variant="secondary">Cost-Effective</Badge>
                      <Badge variant="secondary">Consistent</Badge>
                      <Badge variant="secondary">Bold Flavor</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Perfect For
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Instant coffee production
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Large-scale operations
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Budget-conscious markets
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
                    Premium Breakfast Blend
                  </CardTitle>
                  <p className="text-forest-600">50% Robusta + 50% Arabica</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Characteristics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Smooth</Badge>
                      <Badge variant="secondary">Well-Balanced</Badge>
                      <Badge variant="secondary">Caramel Notes</Badge>
                      <Badge variant="secondary">Medium Roast</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Perfect For
                    </h4>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">Morning coffee</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Retail packaging
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span className="text-forest-600">
                          Hotel and hospitality
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Custom Blending Process */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Custom Blending Process
              </h2>
              <p className="text-lg text-forest-600">
                How we create your perfect blend
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Consultation & Requirements
                  </h3>
                  <p className="text-forest-600">
                    We discuss your target market, brewing methods, flavor
                    preferences, and budget requirements to understand your
                    needs.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Sample Development
                  </h3>
                  <p className="text-forest-600">
                    Our master blenders create initial samples using different
                    ratios and processing methods based on your specifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Testing & Refinement
                  </h3>
                  <p className="text-forest-600">
                    You test the samples and provide feedback. We refine the
                    blend until it perfectly matches your requirements.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Production & Quality Control
                  </h3>
                  <p className="text-forest-600">
                    Once approved, we produce your custom blend with strict
                    quality control to ensure consistency in every batch.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Why Choose Our Blends?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Consistent Quality
                  </h3>
                  <p className="text-forest-600">
                    Rigorous quality control ensures every batch meets your
                    standards
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Cost Optimization
                  </h3>
                  <p className="text-forest-600">
                    Strategic blending reduces costs while maintaining quality
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Scalable Production
                  </h3>
                  <p className="text-forest-600">
                    From small batches to container loads, we scale with your
                    needs
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Expert Guidance
                  </h3>
                  <p className="text-forest-600">
                    14+ years of blending expertise at your service
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Create Your Perfect Blend?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Let our master blenders create a custom coffee blend that
              perfectly matches your brand and market requirements.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href={`/${locale}/quote`}>Start Custom Blend</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Speak with Expert
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
