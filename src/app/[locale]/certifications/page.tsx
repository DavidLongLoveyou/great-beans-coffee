import { type Metadata } from 'next';
import {
  Award,
  Shield,
  Leaf,
  Users,
  CheckCircle,
  Download,
  ExternalLink,
} from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Image from 'next/image';

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
    title:
      'Coffee Certifications & Quality Standards - Organic, Fair Trade, Rainforest Alliance - The Great Beans',
    description:
      'Comprehensive coffee certifications including Organic, Fair Trade, Rainforest Alliance, UTZ, and ISO standards. Quality assurance and sustainable coffee sourcing.',
    openGraph: {
      title: 'Coffee Certifications & Quality Standards - The Great Beans',
      description:
        'Certified organic, fair trade, and sustainable coffee with international quality standards and certifications.',
      type: 'website',
    },
  };
}

export default async function CertificationsPage({ params }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-green-100 p-4">
                <Award className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <h1 className="mb-6 text-4xl font-bold text-forest-900 md:text-5xl lg:text-6xl">
              Certifications & Quality Standards
            </h1>
            <p className="mb-8 text-xl text-forest-700 md:text-2xl">
              Committed to the highest quality and sustainability standards. Our
              comprehensive certifications ensure ethical sourcing and premium
              coffee quality.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link href={`/${params.locale}/contact`}>
                  Request Certificates
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/products`}>
                  View Certified Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Overview */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900 md:text-4xl">
                Our Certifications
              </h2>
              <p className="text-lg text-forest-600">
                Internationally recognized certifications that guarantee
                quality, sustainability, and ethical practices
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                      <Leaf className="h-8 w-8 text-green-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Organic
                  </h3>
                  <p className="mb-4 text-forest-600">
                    USDA Organic, EU Organic, JAS Organic certified coffee
                  </p>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Fair Trade
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Fair Trade USA and Fairtrade International certified
                  </p>
                  <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                      <Shield className="h-8 w-8 text-emerald-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Rainforest Alliance
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Sustainable agriculture and forest conservation
                  </p>
                  <Badge className="bg-emerald-100 text-emerald-800">
                    Active
                  </Badge>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                      <Award className="h-8 w-8 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    UTZ Certified
                  </h3>
                  <p className="mb-4 text-forest-600">
                    Sustainable farming and better opportunities for farmers
                  </p>
                  <Badge className="bg-orange-100 text-orange-800">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Certifications */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Certification Details
              </h2>
              <p className="text-lg text-forest-600">
                Comprehensive overview of our certification standards and
                requirements
              </p>
            </div>

            <div className="space-y-8">
              {/* Organic Certification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                      <Leaf className="h-6 w-6 text-green-600" />
                    </div>
                    Organic Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Standards Covered
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            USDA Organic (NOP)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            EU Organic (Regulation 834/2007)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            JAS Organic (Japan)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            COR Organic (Canada)
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Key Requirements
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            No synthetic pesticides or fertilizers
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            Soil health and biodiversity protection
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            3-year transition period
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-forest-600">
                            Annual third-party inspections
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify Online
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fair Trade Certification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    Fair Trade Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Certification Bodies
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Fair Trade USA
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Fairtrade International (FLO)
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            FLOCERT Certification
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Social Impact
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Fair prices for farmers
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Community development premiums
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Democratic farmer organizations
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="text-forest-600">
                            Environmental protection
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify Online
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Rainforest Alliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
                      <Shield className="h-6 w-6 text-emerald-600" />
                    </div>
                    Rainforest Alliance Certification
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Environmental Standards
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Forest conservation
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Biodiversity protection
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Water resource management
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Climate change mitigation
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-3 font-semibold text-forest-900">
                        Social Criteria
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Worker rights and safety
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Community engagement
                          </span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">Living wages</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-forest-600">
                            Gender equality
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download Certificate
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Verify Online
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Quality Standards
              </h2>
              <p className="text-lg text-forest-600">
                International quality management and food safety standards
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-blue-600" />
                    ISO 22000
                  </CardTitle>
                  <p className="text-forest-600">Food Safety Management</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    International standard for food safety management systems,
                    ensuring safe food production throughout the supply chain.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">HACCP principles</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">Risk assessment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                      <span className="text-forest-600">
                        Traceability systems
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    ISO 9001
                  </CardTitle>
                  <p className="text-forest-600">Quality Management</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    Quality management system standard ensuring consistent
                    quality and continuous improvement in all processes.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-forest-600">
                        Process optimization
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-forest-600">
                        Customer satisfaction
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-forest-600">
                        Continuous improvement
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    BRC Global Standard
                  </CardTitle>
                  <p className="text-forest-600">Food Safety & Quality</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-forest-600">
                    British Retail Consortium standard for food safety, quality,
                    and operational criteria for food manufacturers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span className="text-forest-600">GFSI benchmarked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span className="text-forest-600">
                        Retailer acceptance
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-purple-500" />
                      <span className="text-forest-600">
                        Global recognition
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Process */}
      <section className="bg-forest-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Our Certification Process
              </h2>
              <p className="text-lg text-forest-600">
                Rigorous process ensuring compliance with international
                standards
              </p>
            </div>

            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  1
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Initial Assessment
                  </h3>
                  <p className="text-forest-600">
                    Comprehensive evaluation of current practices, documentation
                    review, and gap analysis against certification requirements.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  2
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Implementation
                  </h3>
                  <p className="text-forest-600">
                    Development and implementation of required systems,
                    procedures, and training programs to meet certification
                    standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  3
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Third-Party Audit
                  </h3>
                  <p className="text-forest-600">
                    Independent certification body conducts thorough on-site
                    inspection and documentation review to verify compliance.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  4
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Certification Award
                  </h3>
                  <p className="text-forest-600">
                    Upon successful audit, certification is awarded with
                    validity period and requirements for ongoing compliance
                    monitoring.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-600">
                  5
                </div>
                <div>
                  <h3 className="mb-2 text-xl font-semibold text-forest-900">
                    Continuous Monitoring
                  </h3>
                  <p className="text-forest-600">
                    Regular surveillance audits, annual reviews, and continuous
                    improvement to maintain certification status.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-6xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-forest-900">
                Benefits of Our Certifications
              </h2>
              <p className="text-lg text-forest-600">
                Why our certified coffee makes a difference for your business
                and the world
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Quality Assurance
                </h3>
                <p className="text-forest-600">
                  Guaranteed quality standards with rigorous testing and quality
                  control throughout the supply chain.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Social Impact
                </h3>
                <p className="text-forest-600">
                  Supporting farmer communities with fair prices, better working
                  conditions, and sustainable development programs.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
                    <Leaf className="h-8 w-8 text-emerald-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Environmental Protection
                </h3>
                <p className="text-forest-600">
                  Sustainable farming practices that protect biodiversity,
                  conserve water, and reduce environmental impact.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Market Access
                </h3>
                <p className="text-forest-600">
                  Access to premium markets and retailers who require certified
                  products for their sustainability commitments.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                    <CheckCircle className="h-8 w-8 text-orange-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Traceability
                </h3>
                <p className="text-forest-600">
                  Complete supply chain transparency from farm to cup, enabling
                  full product traceability and accountability.
                </p>
              </div>

              <div className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <Shield className="h-8 w-8 text-red-600" />
                  </div>
                </div>
                <h3 className="mb-3 text-xl font-semibold text-forest-900">
                  Risk Mitigation
                </h3>
                <p className="text-forest-600">
                  Reduced supply chain risks through verified sustainable
                  practices and compliance with international standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-20">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-forest-900 md:text-4xl">
              Partner with Certified Excellence
            </h2>
            <p className="mb-8 text-lg text-forest-600">
              Choose certified coffee that meets the highest standards of
              quality, sustainability, and social responsibility. Request our
              certification documents and discover the difference.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700"
              >
                <Link href={`/${params.locale}/contact`}>
                  Request Certificates
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href={`/${params.locale}/products`}>
                  View Certified Products
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
