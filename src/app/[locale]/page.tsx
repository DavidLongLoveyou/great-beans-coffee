import {
  Coffee,
  Globe,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  Shield,
} from 'lucide-react';
import Link from 'next/link';

import { type Locale } from '@/i18n';
import { HeroSection } from '@/presentation/components/sections/HeroSection';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

export default async function HomePage({
  params,
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
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-white to-emerald-50 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute left-10 top-20 h-32 w-32 rounded-full bg-forest-300"></div>
          <div className="absolute bottom-20 right-10 h-24 w-24 rounded-full bg-emerald-300"></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100 px-6 py-3">
              <Award className="h-5 w-5 text-forest-600" />
              <span className="font-medium text-forest-700">
                Trusted by 500+ Global Partners
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl">
              Why Global Partners Choose
              <span className="text-gradient-forest block bg-gradient-to-r from-forest-600 to-emerald-600 bg-clip-text text-transparent">
                The Great Beans
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-600">
              Comprehensive B2B coffee solutions backed by decades of expertise
              in Vietnamese coffee export
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="group border-forest-200 bg-white/80 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-forest-300 hover:shadow-forest-strong">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-soft transition-transform duration-300 group-hover:scale-110">
                  <Coffee className="h-10 w-10 text-forest-600" />
                </div>
                <CardTitle className="text-xl font-bold text-forest-800">
                  Premium Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-forest-600">
                  Grade 1 Robusta and specialty Arabica beans with consistent
                  quality standards and rigorous testing
                </p>
              </CardContent>
            </Card>

            <Card className="group border-emerald-200 bg-white/80 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-emerald-glow">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-soft transition-transform duration-300 group-hover:scale-110">
                  <Globe className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-forest-800">
                  Global Reach
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-forest-600">
                  Serving 25+ countries with reliable international shipping and
                  comprehensive logistics support
                </p>
              </CardContent>
            </Card>

            <Card className="group border-forest-200 bg-white/80 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-forest-300 hover:shadow-forest-strong">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-soft transition-transform duration-300 group-hover:scale-110">
                  <Award className="h-10 w-10 text-forest-600" />
                </div>
                <CardTitle className="text-xl font-bold text-forest-800">
                  Certified Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-forest-600">
                  UTZ, Rainforest Alliance, and Organic certifications for
                  sustainable and ethical sourcing
                </p>
              </CardContent>
            </Card>

            <Card className="group border-emerald-200 bg-white/80 text-center backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-emerald-glow">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 shadow-emerald-soft transition-transform duration-300 group-hover:scale-110">
                  <Truck className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-xl font-bold text-forest-800">
                  Reliable Logistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-forest-600">
                  Professional packaging, timely delivery, and full supply chain
                  transparency from farm to port
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-forest-400 blur-2xl"></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3">
              <Coffee className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-emerald-200">
                Premium Vietnamese Origins
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
              Premium Coffee
              <span className="text-gradient-emerald block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-100">
              Discover our range of premium Vietnamese coffee beans, sourced
              directly from the finest growing regions
            </p>
          </div>

          <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            <Card className="hover:shadow-emerald-strong group border-forest-600/30 bg-forest-800/50 shadow-forest-medium backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-forest-700/60">
              <CardHeader className="pb-4">
                <Badge className="w-fit border border-forest-500/50 bg-forest-600/80 text-forest-100 shadow-sm">
                  Premium Robusta
                </Badge>
                <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-emerald-200">
                  Grade 1 Robusta Beans
                </CardTitle>
                <CardDescription className="leading-relaxed text-forest-200">
                  Premium Vietnamese Robusta with rich flavor profile and
                  exceptionally low defect rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Screen size 16+ (90% minimum)</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Moisture content ≤ 12.5%</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Defect rate ≤ 5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-emerald-medium hover:shadow-emerald-strong group border-emerald-600/30 bg-forest-800/50 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-forest-700/60">
              <CardHeader className="pb-4">
                <Badge className="w-fit border border-emerald-500/50 bg-emerald-600/80 text-emerald-100 shadow-sm">
                  Specialty Arabica
                </Badge>
                <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-emerald-200">
                  Highland Arabica
                </CardTitle>
                <CardDescription className="leading-relaxed text-forest-200">
                  High-altitude Vietnamese Arabica with exceptional cup quality
                  and unique flavor notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Cupping score 80+</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Grown at 1,200m+ altitude</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Washed processing method</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-emerald-strong group border-forest-600/30 bg-forest-800/50 shadow-forest-medium backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-forest-700/60">
              <CardHeader className="pb-4">
                <Badge className="w-fit border border-forest-500/50 bg-forest-600/80 text-forest-100 shadow-sm">
                  Custom Blends
                </Badge>
                <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-emerald-200">
                  Private Label Solutions
                </CardTitle>
                <CardDescription className="leading-relaxed text-forest-200">
                  Custom coffee blends and comprehensive private labeling
                  services for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Custom blend development</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Private label packaging</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="mr-3 h-5 w-5 flex-shrink-0 text-emerald-400" />
                    <span>Brand consultation services</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              asChild
              size="lg"
              className="shadow-emerald-medium hover:shadow-emerald-strong group transform bg-emerald-500 px-10 py-4 text-lg font-semibold text-forest-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
            >
              <Link href={`/${locale}/products`}>
                View All Products
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-forest-50 to-emerald-50 py-24">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute right-10 top-10 h-28 w-28 rounded-full bg-forest-400"></div>
          <div className="absolute bottom-10 left-10 h-36 w-36 rounded-full bg-emerald-400"></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl px-4">
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100 px-6 py-3">
              <Shield className="h-5 w-5 text-forest-600" />
              <span className="font-medium text-forest-700">
                End-to-End Solutions
              </span>
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl">
              Comprehensive
              <span className="text-gradient-forest block bg-gradient-to-r from-forest-600 to-emerald-600 bg-clip-text text-transparent">
                B2B Services
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-600">
              End-to-end coffee export solutions designed for international
              business partners
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            <div className="group text-center transition-all duration-500 hover:-translate-y-2">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-medium transition-transform duration-300 group-hover:scale-110 group-hover:shadow-forest-strong">
                <Package className="h-12 w-12 text-forest-600" />
              </div>
              <h3 className="mb-6 text-2xl font-bold text-forest-800 transition-colors group-hover:text-forest-600">
                Sourcing & Quality Control
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-forest-600">
                Direct sourcing from Vietnamese farms with rigorous quality
                control and comprehensive certification management
              </p>
              <Button
                variant="outline"
                className="border-2 border-forest-600 px-8 py-3 font-semibold text-forest-600 shadow-forest-soft transition-all duration-300 hover:bg-forest-600 hover:text-white hover:shadow-forest-medium"
              >
                Learn More
              </Button>
            </div>

            <div className="group text-center transition-all duration-500 hover:-translate-y-2">
              <div className="shadow-emerald-medium group-hover:shadow-emerald-strong mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-100 to-emerald-200 transition-transform duration-300 group-hover:scale-110">
                <Truck className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="mb-6 text-2xl font-bold text-forest-800 transition-colors group-hover:text-emerald-600">
                Global Logistics
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-forest-600">
                Reliable international shipping with full documentation and
                customs support for seamless global delivery
              </p>
              <Button
                variant="outline"
                className="hover:shadow-emerald-medium border-2 border-emerald-600 px-8 py-3 font-semibold text-emerald-600 shadow-emerald-soft transition-all duration-300 hover:bg-emerald-600 hover:text-white"
              >
                Learn More
              </Button>
            </div>

            <div className="group text-center transition-all duration-500 hover:-translate-y-2">
              <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-medium transition-transform duration-300 group-hover:scale-110 group-hover:shadow-forest-strong">
                <Shield className="h-12 w-12 text-forest-600" />
              </div>
              <h3 className="mb-6 text-2xl font-bold text-forest-800 transition-colors group-hover:text-forest-600">
                Risk Management
              </h3>
              <p className="mb-8 text-lg leading-relaxed text-forest-600">
                Comprehensive insurance coverage and risk mitigation strategies
                for secure international trade
              </p>
              <Button
                variant="outline"
                className="border-2 border-forest-600 px-8 py-3 font-semibold text-forest-600 shadow-forest-soft transition-all duration-300 hover:bg-forest-600 hover:text-white hover:shadow-forest-medium"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 py-24">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/3 top-1/3 h-48 w-48 animate-pulse rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/3 h-36 w-36 animate-pulse rounded-full bg-forest-400 blur-2xl delay-1000"></div>
        </div>

        <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3">
            <Users className="h-5 w-5 text-emerald-400" />
            <span className="font-medium text-emerald-200">
              Join Our Global Network
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            Ready to Partner with Vietnam's
            <span className="text-gradient-emerald block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Leading Coffee Exporter?
            </span>
          </h2>

          <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-forest-100">
            Join 500+ international partners who trust The Great Beans for
            premium Vietnamese coffee solutions and exceptional service
          </p>

          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="shadow-emerald-medium hover:shadow-emerald-strong group transform bg-emerald-500 px-10 py-4 text-lg font-semibold text-forest-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
            >
              <Link href={`/${locale}/quote`}>
                Request Quote
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-forest-200 px-10 py-4 text-lg font-bold text-forest-100 shadow-forest-soft transition-all duration-300 hover:bg-forest-100 hover:text-forest-900 hover:shadow-forest-medium"
            >
              <Link href={`/${locale}/contact`}>Contact Sales Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
