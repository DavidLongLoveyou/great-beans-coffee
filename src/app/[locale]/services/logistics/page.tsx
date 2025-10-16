import { type Metadata } from 'next';
import {  Truck, Ship, Plane, Package, CheckCircle, Globe  } from '@/components/ui/dynamic-icons';

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
      'Coffee Logistics & Shipping Services - Global Coffee Export - The Great Beans',
    description:
      'Professional coffee logistics and shipping services. Global export, customs clearance, warehousing, and door-to-door delivery for coffee businesses worldwide.',
    openGraph: {
      title:
        'Coffee Logistics & Shipping Services - Global Coffee Export - The Great Beans',
      description:
        'Comprehensive logistics solutions for coffee export. From warehousing to global delivery, we handle your coffee logistics needs.',
      type: 'website',
    },
  };
}

export default async function LogisticsPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-blue-100 p-4">
                <Ship className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Logistics & Shipping Services
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Comprehensive logistics solutions for global coffee export. From
              warehousing to door-to-door delivery, we handle your coffee
              logistics needs.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href={`/${locale}/quote`}>Get Shipping Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Logistics Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Services */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Complete Logistics Solutions
              </h2>
              <p className="text-lg text-forest-600">
                End-to-end logistics management for global coffee export
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Warehousing
                  </h3>
                  <p className="text-forest-600">
                    Climate-controlled storage facilities with inventory
                    management and quality preservation systems.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Ship className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Ocean Freight
                  </h3>
                  <p className="text-forest-600">
                    Cost-effective sea freight solutions with container
                    optimization and global port coverage.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Plane className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Air Freight
                  </h3>
                  <p className="text-forest-600">
                    Fast air cargo services for urgent shipments and premium
                    coffee deliveries worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Truck className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Ground Transport
                  </h3>
                  <p className="text-forest-600">
                    Reliable trucking services for domestic delivery and
                    port-to-door transportation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Shipping Options */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Shipping Options
              </h2>
              <p className="text-lg text-forest-600">
                Flexible shipping solutions to meet your timeline and budget
                requirements
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ship className="h-5 w-5 text-blue-600" />
                    Ocean Freight
                  </CardTitle>
                  <p className="text-forest-600">
                    Cost-effective for large volumes
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Transit Time
                    </h4>
                    <p className="text-forest-600">
                      15-45 days depending on destination
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Container Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">20ft FCL</Badge>
                      <Badge variant="secondary">40ft FCL</Badge>
                      <Badge variant="secondary">LCL</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Best For
                    </h4>
                    <ul className="space-y-1 text-forest-600">
                      <li>• Large volume shipments</li>
                      <li>• Cost-sensitive cargo</li>
                      <li>• Regular supply chains</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Plane className="h-5 w-5 text-blue-600" />
                    Air Freight
                  </CardTitle>
                  <p className="text-blue-700">
                    Fast delivery for urgent needs
                  </p>
                  <Badge className="w-fit bg-blue-600">Express</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Transit Time
                    </h4>
                    <p className="text-forest-600">
                      2-7 days to major destinations
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Service Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Express</Badge>
                      <Badge variant="secondary">Standard</Badge>
                      <Badge variant="secondary">Economy</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Best For
                    </h4>
                    <ul className="space-y-1 text-forest-600">
                      <li>• Urgent shipments</li>
                      <li>• Premium coffee</li>
                      <li>• Sample deliveries</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-blue-600" />
                    Ground Transport
                  </CardTitle>
                  <p className="text-forest-600">
                    Domestic and regional delivery
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Transit Time
                    </h4>
                    <p className="text-forest-600">
                      1-5 days for regional delivery
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Vehicle Options
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Full Truck</Badge>
                      <Badge variant="secondary">LTL</Badge>
                      <Badge variant="secondary">Express Van</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Best For
                    </h4>
                    <ul className="space-y-1 text-forest-600">
                      <li>• Domestic delivery</li>
                      <li>• Port to warehouse</li>
                      <li>• Last-mile delivery</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Logistics Process */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Logistics Process
              </h2>
              <p className="text-lg text-forest-600">
                Streamlined process from pickup to delivery
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Pickup & Collection
                  </h3>
                  <p className="text-forest-600">
                    Coffee collection from origin or your facility with proper
                    handling and documentation to ensure quality preservation.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Warehousing & Storage
                  </h3>
                  <p className="text-forest-600">
                    Climate-controlled storage with inventory management,
                    quality monitoring, and preparation for international
                    shipping.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Documentation & Customs
                  </h3>
                  <p className="text-forest-600">
                    Complete export documentation, customs clearance, and
                    compliance with international trade regulations and
                    certifications.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    International Shipping
                  </h3>
                  <p className="text-forest-600">
                    Ocean or air freight transportation with tracking,
                    insurance, and coordination with destination port
                    authorities.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  5
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Destination Clearance
                  </h3>
                  <p className="text-forest-600">
                    Import customs clearance, duty payment assistance, and
                    coordination with local authorities at destination country.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  6
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Final Delivery
                  </h3>
                  <p className="text-forest-600">
                    Last-mile delivery to your warehouse or facility with proof
                    of delivery and quality confirmation upon arrival.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Coverage */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Global Coverage
              </h2>
              <p className="text-lg text-forest-600">
                Worldwide shipping network with established routes and
                partnerships
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Asia Pacific
                  </h3>
                  <ul className="space-y-1 text-forest-600">
                    <li>• Japan, South Korea</li>
                    <li>• China, Hong Kong</li>
                    <li>• Singapore, Malaysia</li>
                    <li>• Australia, New Zealand</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Europe
                  </h3>
                  <ul className="space-y-1 text-forest-600">
                    <li>• Germany, Netherlands</li>
                    <li>• United Kingdom, France</li>
                    <li>• Italy, Spain</li>
                    <li>• Nordic countries</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    North America
                  </h3>
                  <ul className="space-y-1 text-forest-600">
                    <li>• United States</li>
                    <li>• Canada</li>
                    <li>• Mexico</li>
                    <li>• Central America</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                    <Globe className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Middle East & Africa
                  </h3>
                  <ul className="space-y-1 text-forest-600">
                    <li>• UAE, Saudi Arabia</li>
                    <li>• South Africa</li>
                    <li>• Egypt, Morocco</li>
                    <li>• Other emerging markets</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Value-Added Services */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Value-Added Services
              </h2>
              <p className="text-lg text-forest-600">
                Additional services to enhance your logistics experience
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Real-Time Tracking
                  </h3>
                  <p className="text-forest-600">
                    24/7 shipment tracking with regular updates
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Insurance Coverage
                  </h3>
                  <p className="text-forest-600">
                    Comprehensive cargo insurance options
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Quality Monitoring
                  </h3>
                  <p className="text-forest-600">
                    Temperature and humidity monitoring during transit
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Customs Brokerage
                  </h3>
                  <p className="text-forest-600">
                    Expert customs clearance and documentation
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Flexible Delivery
                  </h3>
                  <p className="text-forest-600">
                    Appointment scheduling and special delivery requirements
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <CheckCircle className="h-6 w-6 flex-shrink-0 text-blue-500" />
                <div>
                  <h3 className="mb-1 font-semibold text-forest-900">
                    Emergency Support
                  </h3>
                  <p className="text-forest-600">
                    24/7 customer support for urgent logistics needs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Structure */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Transparent Pricing
              </h2>
              <p className="text-lg text-forest-600">
                Competitive rates with no hidden fees
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Ocean Freight</CardTitle>
                  <p className="text-forest-600">
                    Cost-effective for large volumes
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Competitive container rates
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Volume discounts available
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        All-inclusive pricing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Flexible payment terms
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-900">Air Freight</CardTitle>
                  <p className="text-blue-700">
                    Premium service for urgent needs
                  </p>
                  <Badge className="w-fit bg-blue-600">Express</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">Per kg pricing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Express delivery options
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">Priority handling</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Real-time tracking
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ground Transport</CardTitle>
                  <p className="text-forest-600">
                    Domestic and regional delivery
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Distance-based pricing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Scheduled deliveries
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Fuel surcharge included
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">Proof of delivery</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Ship Your Coffee Globally?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Trust our logistics expertise to deliver your coffee safely and
              efficiently to customers worldwide. Get started with a custom
              shipping quote today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href={`/${locale}/quote`}>Get Shipping Quote</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Discuss Logistics Needs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
