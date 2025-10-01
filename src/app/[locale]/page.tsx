import { Coffee, Globe, Award, Users, ArrowRight, CheckCircle, Package, Truck, Shield } from 'lucide-react';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import { HeroSection } from '@/presentation/components/sections/HeroSection';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

export default async function HomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <HeroSection
        title="Premium Vietnamese Coffee Export Solutions"
        subtitle="Your trusted B2B partner for premium Robusta and Arabica beans. Direct sourcing, sustainable practices, and global logistics for international coffee businesses."
        ctaText="Request Quote"
        ctaSecondaryText="View Products"
      />

      {/* Key Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest-900 mb-4">
              Why Global Partners Choose The Great Beans
            </h2>
            <p className="text-xl text-forest-700 max-w-3xl mx-auto">
              Comprehensive B2B coffee solutions backed by decades of expertise in Vietnamese coffee export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center border-forest-200 hover:shadow-forest-medium transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Coffee className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-forest-800">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600">
                  Grade 1 Robusta and specialty Arabica beans with consistent quality standards
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-sage-200 hover:shadow-sage-medium transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-sage-600" />
                </div>
                <CardTitle className="text-forest-800">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600">
                  Serving 25+ countries with reliable international shipping and logistics
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-emerald-200 hover:shadow-emerald-medium transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center">
                  <Award className="h-8 w-8 text-forest-600" />
                </div>
                <CardTitle className="text-forest-800">Certified Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600">
                  UTZ, Rainforest Alliance, and Organic certifications for sustainable sourcing
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-forest-200 hover:shadow-forest-medium transition-all duration-300">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <CardTitle className="text-forest-800">B2B Expertise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600">
                  Dedicated account management and custom solutions for business partners
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-20 bg-gradient-to-br from-forest-50 to-sage-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest-900 mb-4">
              Premium Coffee Products
            </h2>
            <p className="text-xl text-forest-700 max-w-3xl mx-auto">
              Discover our range of premium Vietnamese coffee beans, sourced directly from the finest growing regions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="border-forest-200 hover:shadow-forest-medium transition-all duration-300">
              <CardHeader>
                <Badge className="bg-emerald-100 text-emerald-800 w-fit">Premium Robusta</Badge>
                <CardTitle className="text-forest-800">Grade 1 Robusta Beans</CardTitle>
                <CardDescription className="text-forest-600">
                  Premium Vietnamese Robusta with rich flavor profile and low defect rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-forest-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Screen size 16+ (90% min)
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Moisture content ≤ 12.5%
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Defect rate ≤ 5%
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-sage-200 hover:shadow-sage-medium transition-all duration-300">
              <CardHeader>
                <Badge className="bg-sage-100 text-sage-800 w-fit">Specialty Arabica</Badge>
                <CardTitle className="text-forest-800">Highland Arabica</CardTitle>
                <CardDescription className="text-forest-600">
                  High-altitude Vietnamese Arabica with exceptional cup quality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-forest-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Cupping score 80+
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Grown at 1,200m+ altitude
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Washed processing
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 hover:shadow-emerald-medium transition-all duration-300">
              <CardHeader>
                <Badge className="bg-emerald-100 text-emerald-800 w-fit">Custom Blends</Badge>
                <CardTitle className="text-forest-800">Private Label Solutions</CardTitle>
                <CardDescription className="text-forest-600">
                  Custom coffee blends and private labeling for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm text-forest-600">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Custom blend development
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Private label packaging
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-emerald-500 mr-2" />
                    Brand consultation
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 shadow-emerald-medium">
              <Link href={`/${locale}/products`}>
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-forest-900 mb-4">
              Comprehensive B2B Services
            </h2>
            <p className="text-xl text-forest-700 max-w-3xl mx-auto">
              End-to-end coffee export solutions designed for international business partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-forest-100 rounded-full flex items-center justify-center">
                <Package className="h-10 w-10 text-forest-600" />
              </div>
              <h3 className="text-xl font-semibold text-forest-800 mb-4">Sourcing & Quality Control</h3>
              <p className="text-forest-600 mb-4">
                Direct sourcing from Vietnamese farms with rigorous quality control and certification management
              </p>
              <Button variant="outline" className="border-forest-600 text-forest-600 hover:bg-forest-50">
                Learn More
              </Button>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center">
                <Truck className="h-10 w-10 text-sage-600" />
              </div>
              <h3 className="text-xl font-semibold text-forest-800 mb-4">Global Logistics</h3>
              <p className="text-forest-600 mb-4">
                Reliable international shipping with full documentation and customs support for seamless delivery
              </p>
              <Button variant="outline" className="border-sage-600 text-sage-600 hover:bg-sage-50">
                Learn More
              </Button>
            </div>

            <div className="text-center">
              <div className="mx-auto mb-6 w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center">
                <Shield className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-forest-800 mb-4">Risk Management</h3>
              <p className="text-forest-600 mb-4">
                Comprehensive insurance coverage and risk mitigation strategies for international trade
              </p>
              <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-forest-600 to-emerald-600">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Partner with Vietnam's Leading Coffee Exporter?
          </h2>
          <p className="text-xl text-forest-100 mb-8 max-w-2xl mx-auto">
            Join 500+ international partners who trust The Great Beans for premium Vietnamese coffee solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-forest-600 hover:bg-forest-50 shadow-lg">
              <Link href={`/${locale}/quote`}>
                Request Quote <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-forest-600">
              <Link href={`/${locale}/contact`}>
                Contact Sales Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
