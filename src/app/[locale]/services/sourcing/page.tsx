import { type Metadata } from 'next';
import {
  MapPin,
  Shield,
  Truck,
  Users,
  CheckCircle,
  Globe,
  Coffee,
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
      'Coffee Sourcing Services - Direct Trade & Premium Origins - The Great Beans',
    description:
      'Professional coffee sourcing services. Direct trade relationships, premium origins, quality assurance, and sustainable sourcing for your coffee business.',
    openGraph: {
      title:
        'Coffee Sourcing Services - Direct Trade & Premium Origins - The Great Beans',
      description:
        'Source premium coffee directly from origin with our expert sourcing services. Quality, sustainability, and transparency guaranteed.',
      type: 'website',
    },
  };
}

export default async function SourcingPage({ params }: Props) {
  const { locale } = await params;
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-green-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-emerald-100 p-4">
                <Globe className="h-12 w-12 text-emerald-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Coffee Sourcing Services
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Direct trade relationships with premium coffee origins. Quality,
              sustainability, and transparency in every bean we source.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${locale}/quote`}>
                  Source Premium Coffee
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Sourcing Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Expertise */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Professional Coffee Sourcing
              </h2>
              <p className="text-lg text-forest-600">
                14+ years of expertise in sourcing premium coffee from the
                world&rsquo;s best origins
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <MapPin className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Direct Trade
                  </h3>
                  <p className="text-forest-600">
                    Direct relationships with farmers and cooperatives, ensuring
                    fair prices and premium quality coffee beans.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Quality Assurance
                  </h3>
                  <p className="text-forest-600">
                    Rigorous quality control at origin, including cupping,
                    grading, and certification verification.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Sustainable Sourcing
                  </h3>
                  <p className="text-forest-600">
                    Commitment to sustainable farming practices and supporting
                    farming communities for long-term partnerships.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Truck className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Global Logistics
                  </h3>
                  <p className="text-forest-600">
                    Comprehensive logistics management from farm to your
                    facility, ensuring freshness and quality preservation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Origin Regions */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Premium Coffee Origins
              </h2>
              <p className="text-lg text-forest-600">
                Sourcing from the world&rsquo;s finest coffee-growing regions
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Vietnam
                  </CardTitle>
                  <p className="text-forest-600">
                    World&rsquo;s largest Robusta producer
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Premium Robusta</Badge>
                      <Badge variant="secondary">Arabica</Badge>
                      <Badge variant="secondary">Specialty Grades</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Dak Lak, Gia Lai, Lam Dong, Son La
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">October - February</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Brazil
                  </CardTitle>
                  <p className="text-forest-600">
                    World&rsquo;s largest coffee producer
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Santos</Badge>
                      <Badge variant="secondary">Cerrado</Badge>
                      <Badge variant="secondary">Pulped Natural</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Minas Gerais, São Paulo, Espírito Santo
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">May - September</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Colombia
                  </CardTitle>
                  <p className="text-forest-600">Premium Arabica excellence</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Supremo</Badge>
                      <Badge variant="secondary">Excelso</Badge>
                      <Badge variant="secondary">Specialty</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Huila, Nariño, Cauca, Tolima
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">
                      March - June, October - December
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Ethiopia
                  </CardTitle>
                  <p className="text-forest-600">Birthplace of coffee</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Sidamo</Badge>
                      <Badge variant="secondary">Yirgacheffe</Badge>
                      <Badge variant="secondary">Harrar</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Sidama, Gedeo, Oromia, SNNPR
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">October - February</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Guatemala
                  </CardTitle>
                  <p className="text-forest-600">
                    High-altitude specialty coffee
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Antigua</Badge>
                      <Badge variant="secondary">Huehuetenango</Badge>
                      <Badge variant="secondary">SHB</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Antigua, Huehuetenango, Atitlán
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">December - March</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coffee className="h-5 w-5 text-emerald-600" />
                    Indonesia
                  </CardTitle>
                  <p className="text-forest-600">Unique processing methods</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">Sumatra</Badge>
                      <Badge variant="secondary">Java</Badge>
                      <Badge variant="secondary">Sulawesi</Badge>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Regions
                    </h4>
                    <p className="text-forest-600">
                      Sumatra, Java, Sulawesi, Bali
                    </p>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold text-forest-900">
                      Harvest Season
                    </h4>
                    <p className="text-forest-600">May - September</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Process */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Our Sourcing Process
              </h2>
              <p className="text-lg text-forest-600">
                Systematic approach to ensure quality, sustainability, and
                transparency
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Origin Assessment
                  </h3>
                  <p className="text-forest-600">
                    Comprehensive evaluation of coffee origins, including
                    climate, soil, farming practices, and processing
                    capabilities to identify premium sources.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Farmer Partnerships
                  </h3>
                  <p className="text-forest-600">
                    Building direct relationships with farmers and cooperatives,
                    establishing fair trade agreements and long-term
                    partnerships.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Quality Control
                  </h3>
                  <p className="text-forest-600">
                    Rigorous quality testing including cupping, moisture
                    analysis, defect assessment, and certification verification
                    at origin.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Sustainable Practices
                  </h3>
                  <p className="text-forest-600">
                    Ensuring environmental sustainability, fair labor practices,
                    and supporting community development initiatives.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  5
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Logistics Management
                  </h3>
                  <p className="text-forest-600">
                    Coordinating transportation, storage, and shipping to
                    maintain coffee quality from farm to destination.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-bold text-emerald-600">
                  6
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Continuous Monitoring
                  </h3>
                  <p className="text-forest-600">
                    Ongoing quality monitoring, relationship management, and
                    continuous improvement of sourcing processes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Quality Standards & Certifications
              </h2>
              <p className="text-lg text-forest-600">
                Rigorous standards ensuring premium quality and ethical sourcing
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Quality Grading
                  </h3>
                  <ul className="space-y-2 text-forest-600">
                    <li>• SCA cupping scores 80+</li>
                    <li>• Moisture content 10-12%</li>
                    <li>• Defect count per 350g sample</li>
                    <li>• Screen size uniformity</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Certifications
                  </h3>
                  <ul className="space-y-2 text-forest-600">
                    <li>• Organic certification</li>
                    <li>• Fair Trade verified</li>
                    <li>• Rainforest Alliance</li>
                    <li>• UTZ certified</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-forest-900">
                    Social Standards
                  </h3>
                  <ul className="space-y-2 text-forest-600">
                    <li>• Fair labor practices</li>
                    <li>• Community development</li>
                    <li>• Gender equality support</li>
                    <li>• Education initiatives</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sourcing Services */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Sourcing Service Options
              </h2>
              <p className="text-lg text-forest-600">
                Flexible sourcing solutions for different business needs
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle>Spot Purchasing</CardTitle>
                  <p className="text-forest-600">
                    Immediate availability coffee
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Current crop availability
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Quick delivery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Market pricing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Flexible quantities
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-emerald-50">
                <CardHeader>
                  <CardTitle className="text-emerald-900">
                    Contract Sourcing
                  </CardTitle>
                  <p className="text-emerald-700">
                    Long-term supply agreements
                  </p>
                  <Badge className="w-fit bg-emerald-600">Recommended</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Price stability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Quality consistency
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Supply security</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Custom specifications
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Specialty Sourcing</CardTitle>
                  <p className="text-forest-600">
                    Premium and micro-lot coffee
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">
                        Micro-lot sourcing
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Unique varietals</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Traceability</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                      <span className="text-forest-600">Premium quality</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-emerald-50 to-green-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Ready to Source Premium Coffee?
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Partner with us for reliable, sustainable, and premium coffee
              sourcing. From direct trade to specialty lots, we deliver quality
              you can trust.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href={`/${locale}/quote`}>
                  Request Sourcing Quote
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${locale}/contact`}>
                  Discuss Your Needs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
