import { type Metadata } from 'next';
import {
  Tag,
  Palette,
  Rocket,
  Users,
  CheckCircle,
  Star,
  Lightbulb,
  Target,
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
      'Private Label Coffee Services - Custom Coffee Branding - The Great Beans',
    description:
      'Complete private label coffee solutions. Custom branding, packaging design, and manufacturing for your coffee brand. Launch your coffee business with confidence.',
    openGraph: {
      title:
        'Private Label Coffee Services - Custom Coffee Branding - The Great Beans',
      description:
        'Launch your coffee brand with our complete private label solutions. Custom blending, branding, and packaging services.',
      type: 'website',
    },
  };
}

export default async function PrivateLabelPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-purple-100 p-4">
                <Tag className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Private Label Coffee Services
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Launch your coffee brand with confidence. Complete private label
              solutions from product development to market-ready packaging.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href={`/${locale}/quote`}>Start Your Brand</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Brand Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Complete Private Label Solutions
              </h2>
              <p className="text-lg text-forest-600">
                Everything you need to launch and grow your coffee brand
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Lightbulb className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Product Development
                  </h3>
                  <p className="text-forest-600">
                    Custom coffee blends and roast profiles developed
                    specifically for your brand and target market preferences.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Palette className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Brand Design
                  </h3>
                  <p className="text-forest-600">
                    Professional logo design, packaging artwork, and brand
                    identity development to make your coffee stand out in the
                    market.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Market Positioning
                  </h3>
                  <p className="text-forest-600">
                    Strategic guidance on product positioning, pricing, and
                    market entry strategies based on our global market
                    experience.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Tag className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Custom Packaging
                  </h3>
                  <p className="text-forest-600">
                    Tailored packaging solutions with your branding, from
                    retail-ready bags to premium gift packaging options.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Marketing Support
                  </h3>
                  <p className="text-forest-600">
                    Marketing materials, product photography, and promotional
                    content to help launch and promote your coffee brand
                    effectively.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                    <Rocket className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Launch Support
                  </h3>
                  <p className="text-forest-600">
                    Ongoing support for market launch, distribution planning,
                    and scaling your coffee business as it grows.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Private Label Process */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Private Label Development Process
              </h2>
              <p className="text-lg text-forest-600">
                From concept to market launch in 6 simple steps
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Brand Consultation
                  </h3>
                  <p className="text-forest-600">
                    We discuss your vision, target market, budget, and business
                    goals to create a comprehensive brand strategy and product
                    roadmap.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Product Development
                  </h3>
                  <p className="text-forest-600">
                    Our experts develop custom coffee blends and roast profiles,
                    creating samples for testing and refinement until perfect.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Brand Design
                  </h3>
                  <p className="text-forest-600">
                    Professional design team creates your logo, packaging
                    design, and complete brand identity that resonates with your
                    target audience.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Prototype & Testing
                  </h3>
                  <p className="text-forest-600">
                    We produce branded prototypes for your review and testing,
                    making any necessary adjustments before final production.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  5
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Production & Quality Control
                  </h3>
                  <p className="text-forest-600">
                    Full-scale production with rigorous quality control,
                    ensuring every package meets your brand standards and
                    customer expectations.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                  6
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Launch & Support
                  </h3>
                  <p className="text-forest-600">
                    Market launch support with marketing materials, ongoing
                    production support, and guidance for scaling your coffee
                    business.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Private Label Success Stories
              </h2>
              <p className="text-lg text-forest-600">
                Brands we&rsquo;ve helped launch and grow in global markets
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    European Specialty Brand
                  </CardTitle>
                  <p className="text-forest-600">
                    Premium coffee for European markets
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Challenge
                    </h4>
                    <p className="text-forest-600">
                      New coffee company needed premium product line for
                      European specialty market
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Solution
                    </h4>
                    <p className="text-forest-600">
                      Custom Arabica blend, premium packaging design, and EU
                      compliance support
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Result
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">50+ Stores</Badge>
                      <Badge variant="secondary">3 Countries</Badge>
                      <Badge variant="secondary">Growing 200%/year</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-500" />
                    US Retail Chain
                  </CardTitle>
                  <p className="text-forest-600">
                    Private label for major retailer
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Challenge
                    </h4>
                    <p className="text-forest-600">
                      Retail chain needed cost-effective private label coffee
                      line
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Solution
                    </h4>
                    <p className="text-forest-600">
                      Robusta-Arabica blend, scalable production, competitive
                      pricing
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Result
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">500+ Stores</Badge>
                      <Badge variant="secondary">Top Seller</Badge>
                      <Badge variant="secondary">3-year Contract</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    Asian E-commerce Brand
                  </CardTitle>
                  <p className="text-forest-600">
                    Online coffee subscription service
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Challenge
                    </h4>
                    <p className="text-forest-600">
                      Startup needed unique product for online subscription
                      model
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Solution
                    </h4>
                    <p className="text-forest-600">
                      Multiple blend options, subscription-friendly packaging,
                      flexible MOQ
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Result
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">10K+ Subscribers</Badge>
                      <Badge variant="secondary">5 Blends</Badge>
                      <Badge variant="secondary">Monthly Growth</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Investment & Pricing */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Investment & Pricing
              </h2>
              <p className="text-lg text-forest-600">
                Transparent pricing for different business needs and scales
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Startup Package</CardTitle>
                  <p className="text-forest-600">
                    Perfect for new coffee brands
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-forest-900">
                    $2,500
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        1 custom blend development
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Logo & packaging design
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        500kg minimum order
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Basic marketing materials
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-900">
                    Growth Package
                  </CardTitle>
                  <p className="text-purple-700">
                    Most popular for expanding brands
                  </p>
                  <Badge className="w-fit bg-purple-600">Recommended</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-purple-900">
                    $5,000
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        3 custom blend options
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Complete brand identity
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        1 ton minimum order
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Marketing support package
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        6 months launch support
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Package</CardTitle>
                  <p className="text-forest-600">For established businesses</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-forest-900">
                    Custom
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Unlimited blend development
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Full brand ecosystem
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Flexible order quantities
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Dedicated account manager
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Ongoing strategic support
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Why Choose Our Private Label Services?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    End-to-End Solution
                  </h3>
                  <p className="text-forest-600">
                    Complete service from concept to market launch
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Global Market Experience
                  </h3>
                  <p className="text-forest-600">
                    14+ years serving international markets
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Quality Assurance
                  </h3>
                  <p className="text-forest-600">
                    Rigorous quality control and international certifications
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Flexible Minimums
                  </h3>
                  <p className="text-forest-600">
                    Low MOQ options suitable for startups and growing brands
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Creative Design Team
                  </h3>
                  <p className="text-forest-600">
                    Professional designers with coffee industry expertise
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Ongoing Support
                  </h3>
                  <p className="text-forest-600">
                    Continuous support for business growth and scaling
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Launch Your Coffee Brand?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Turn your coffee business vision into reality with our
              comprehensive private label services. From concept to market
              success, we&rsquo;re your partner.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Link href={`/${locale}/quote`}>Start Your Brand</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Schedule Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
