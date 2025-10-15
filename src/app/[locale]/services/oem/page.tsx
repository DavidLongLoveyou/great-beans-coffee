import { type Metadata } from 'next';
import {
  Factory,
  Settings,
  Shield,
  Truck,
  CheckCircle,
  Star,
  Clock,
  Award,
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

type Props = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({
  params: _params,
}: Props): Promise<Metadata> {
  return {
    title:
      'OEM Coffee Manufacturing Services - Vietnamese Coffee Export - The Great Beans',
    description:
      'Professional OEM coffee manufacturing services. Custom roasting, blending, and packaging solutions for global coffee brands and distributors.',
    openGraph: {
      title:
        'OEM Coffee Manufacturing Services - Vietnamese Coffee Export - The Great Beans',
      description:
        'Complete OEM coffee manufacturing solutions with custom roasting, blending, and packaging for your brand.',
      type: 'website',
    },
  };
}

export default async function OEMManufacturingPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-4">
                <Factory className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              OEM Coffee Manufacturing
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Complete OEM manufacturing solutions for your coffee brand. From
              custom roasting and blending to packaging and logistics - we
              handle it all.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href={`/${locale}/quote`}>Request Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Discuss Requirements
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our OEM Services */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Complete OEM Manufacturing Solutions
              </h2>
              <p className="text-lg text-forest-600">
                End-to-end manufacturing services for your coffee brand
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Settings className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Custom Roasting
                  </h3>
                  <p className="text-forest-600">
                    Professional roasting services with precise control over
                    roast profiles to match your exact specifications and flavor
                    requirements.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Factory className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Blending & Processing
                  </h3>
                  <p className="text-forest-600">
                    Expert blending services combining different origins and
                    processing methods to create unique flavor profiles for your
                    brand.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Quality Assurance
                  </h3>
                  <p className="text-forest-600">
                    Rigorous quality control at every stage, from green bean
                    selection to final packaging, ensuring consistent quality
                    for your brand.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Custom Packaging
                  </h3>
                  <p className="text-forest-600">
                    Complete packaging solutions including bag design, labeling,
                    and various packaging formats to suit your market needs.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Logistics Support
                  </h3>
                  <p className="text-forest-600">
                    End-to-end logistics management including warehousing,
                    distribution, and international shipping coordination.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Flexible Production
                  </h3>
                  <p className="text-forest-600">
                    Scalable production capacity from small batches to large
                    volumes, adapting to your business growth and seasonal
                    demands.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                OEM Manufacturing Process
              </h2>
              <p className="text-lg text-forest-600">
                Our systematic approach to OEM coffee manufacturing
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Requirements Analysis
                  </h3>
                  <p className="text-forest-600">
                    We work closely with you to understand your brand
                    requirements, target market, flavor preferences, packaging
                    needs, and volume expectations.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Product Development
                  </h3>
                  <p className="text-forest-600">
                    Our team develops custom blends and roast profiles, creating
                    samples for your approval and refinement until we achieve
                    the perfect match.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Production Setup
                  </h3>
                  <p className="text-forest-600">
                    Once approved, we set up dedicated production lines,
                    establish quality control protocols, and prepare packaging
                    materials for your brand.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Manufacturing & Quality Control
                  </h3>
                  <p className="text-forest-600">
                    Full-scale production with continuous quality monitoring,
                    batch testing, and documentation to ensure consistent
                    quality for every order.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  5
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Packaging & Delivery
                  </h3>
                  <p className="text-forest-600">
                    Professional packaging with your branding, final quality
                    inspection, and coordinated delivery to your specified
                    locations worldwide.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities & Specifications */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Manufacturing Capabilities
              </h2>
              <p className="text-lg text-forest-600">
                State-of-the-art facilities and equipment for professional
                coffee manufacturing
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-blue-500" />
                    Production Capacity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-forest-600">
                        Roasting Capacity:
                      </span>
                      <span className="font-medium">500 tons/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">
                        Grinding Capacity:
                      </span>
                      <span className="font-medium">300 tons/month</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Packaging Lines:</span>
                      <span className="font-medium">6 automated lines</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Minimum Order:</span>
                      <span className="font-medium">1 ton</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-forest-600">Lead Time:</span>
                      <span className="font-medium">15-30 days</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-emerald-500" />
                    Quality Standards
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        ISO 22000 Food Safety
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">HACCP Certified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        FDA Approved Facility
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        EU Standards Compliant
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Organic Certification
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                Packaging Solutions
              </h2>
              <p className="text-lg text-forest-600">
                Comprehensive packaging options for different market segments
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-forest-900">
                    Retail Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">250g - 1kg bags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Valve bags with degassing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Custom label design
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Resealable options
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-forest-900">
                    Commercial Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">5kg - 25kg bags</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Multi-layer barrier bags
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Bulk packaging options
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Industrial labeling
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-xl font-semibold text-forest-900">
                    Specialty Packaging
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Tin cans & jars</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Gift packaging</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Eco-friendly materials
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Premium finishes</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our OEM Services */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Why Choose Our OEM Services?
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    14+ Years Experience
                  </h3>
                  <p className="text-forest-600">
                    Extensive experience in coffee manufacturing and export
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    State-of-the-Art Facility
                  </h3>
                  <p className="text-forest-600">
                    Modern equipment and technology for consistent quality
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Flexible Production
                  </h3>
                  <p className="text-forest-600">
                    Scalable capacity from small batches to large volumes
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Global Compliance
                  </h3>
                  <p className="text-forest-600">
                    Meets international food safety and quality standards
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
                    Direct manufacturer pricing with no intermediaries
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-emerald-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    End-to-End Service
                  </h3>
                  <p className="text-forest-600">
                    Complete solution from sourcing to delivery
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Start Your OEM Project?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Let us help you bring your coffee brand to life with our
              comprehensive OEM manufacturing services. From concept to
              delivery, we&rsquo;re your trusted partner.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href={`/${locale}/quote`}>Get OEM Quote</Link>
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
