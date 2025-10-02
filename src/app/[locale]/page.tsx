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
      <section className="py-24 bg-gradient-to-br from-forest-50 via-white to-emerald-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-forest-300"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-emerald-300"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-forest-100 border border-forest-200 rounded-full px-6 py-3 mb-6">
              <Award className="w-5 h-5 text-forest-600" />
              <span className="text-forest-700 font-medium">Trusted by 500+ Global Partners</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-forest-900 mb-6 leading-tight">
              Why Global Partners Choose 
              <span className="block text-gradient-forest bg-gradient-to-r from-forest-600 to-emerald-600 bg-clip-text text-transparent">
                The Great Beans
              </span>
            </h2>
            <p className="text-xl text-forest-600 max-w-4xl mx-auto leading-relaxed">
              Comprehensive B2B coffee solutions backed by decades of expertise in Vietnamese coffee export
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="group text-center border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-forest-strong hover:border-forest-300 transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-forest-100 to-forest-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-forest-soft">
                  <Coffee className="h-10 w-10 text-forest-600" />
                </div>
                <CardTitle className="text-forest-800 text-xl font-bold">Premium Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 leading-relaxed">
                  Grade 1 Robusta and specialty Arabica beans with consistent quality standards and rigorous testing
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-emerald-200 bg-white/80 backdrop-blur-sm hover:shadow-emerald-glow hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-emerald-soft">
                  <Globe className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-forest-800 text-xl font-bold">Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 leading-relaxed">
                  Serving 25+ countries with reliable international shipping and comprehensive logistics support
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-forest-200 bg-white/80 backdrop-blur-sm hover:shadow-forest-strong hover:border-forest-300 transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-forest-100 to-forest-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-forest-soft">
                  <Award className="h-10 w-10 text-forest-600" />
                </div>
                <CardTitle className="text-forest-800 text-xl font-bold">Certified Excellence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 leading-relaxed">
                  UTZ, Rainforest Alliance, and Organic certifications for sustainable and ethical sourcing
                </p>
              </CardContent>
            </Card>

            <Card className="group text-center border-emerald-200 bg-white/80 backdrop-blur-sm hover:shadow-emerald-glow hover:border-emerald-300 transition-all duration-500 hover:-translate-y-2">
              <CardHeader className="pb-4">
                <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-emerald-soft">
                  <Truck className="h-10 w-10 text-emerald-600" />
                </div>
                <CardTitle className="text-forest-800 text-xl font-bold">Reliable Logistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-forest-600 leading-relaxed">
                  Professional packaging, timely delivery, and full supply chain transparency from farm to port
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="py-24 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-forest-400 blur-2xl"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-6 py-3 mb-6">
              <Coffee className="w-5 h-5 text-emerald-400" />
              <span className="text-emerald-200 font-medium">Premium Vietnamese Origins</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Premium Coffee 
              <span className="block text-gradient-emerald bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-xl text-forest-100 max-w-4xl mx-auto leading-relaxed">
              Discover our range of premium Vietnamese coffee beans, sourced directly from the finest growing regions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="group border-forest-600/30 bg-forest-800/50 backdrop-blur-sm hover:bg-forest-700/60 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-2 shadow-forest-medium hover:shadow-emerald-strong">
              <CardHeader className="pb-4">
                <Badge className="bg-forest-600/80 text-forest-100 w-fit border border-forest-500/50 shadow-sm">
                  Premium Robusta
                </Badge>
                <CardTitle className="text-white text-xl font-bold group-hover:text-emerald-200 transition-colors">
                  Grade 1 Robusta Beans
                </CardTitle>
                <CardDescription className="text-forest-200 leading-relaxed">
                  Premium Vietnamese Robusta with rich flavor profile and exceptionally low defect rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Screen size 16+ (90% minimum)</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Moisture content ≤ 12.5%</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Defect rate ≤ 5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-emerald-600/30 bg-forest-800/50 backdrop-blur-sm hover:bg-forest-700/60 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-2 shadow-emerald-medium hover:shadow-emerald-strong">
              <CardHeader className="pb-4">
                <Badge className="bg-emerald-600/80 text-emerald-100 w-fit border border-emerald-500/50 shadow-sm">
                  Specialty Arabica
                </Badge>
                <CardTitle className="text-white text-xl font-bold group-hover:text-emerald-200 transition-colors">
                  Highland Arabica
                </CardTitle>
                <CardDescription className="text-forest-200 leading-relaxed">
                  High-altitude Vietnamese Arabica with exceptional cup quality and unique flavor notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Cupping score 80+</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Grown at 1,200m+ altitude</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Washed processing method</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="group border-forest-600/30 bg-forest-800/50 backdrop-blur-sm hover:bg-forest-700/60 hover:border-emerald-400/50 transition-all duration-500 hover:-translate-y-2 shadow-forest-medium hover:shadow-emerald-strong">
              <CardHeader className="pb-4">
                <Badge className="bg-forest-600/80 text-forest-100 w-fit border border-forest-500/50 shadow-sm">
                  Custom Blends
                </Badge>
                <CardTitle className="text-white text-xl font-bold group-hover:text-emerald-200 transition-colors">
                  Private Label Solutions
                </CardTitle>
                <CardDescription className="text-forest-200 leading-relaxed">
                  Custom coffee blends and comprehensive private labeling services for your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Custom blend development</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Private label packaging</span>
                  </div>
                  <div className="flex items-center text-forest-200">
                    <CheckCircle className="h-5 w-5 text-emerald-400 mr-3 flex-shrink-0" />
                    <span>Brand consultation services</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button asChild size="lg" className="group bg-emerald-500 hover:bg-emerald-600 text-forest-900 px-10 py-4 text-lg font-semibold shadow-emerald-medium hover:shadow-emerald-strong transition-all duration-300 transform hover:scale-105">
              <Link href={`/${locale}/products`}>
                View All Products 
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-gradient-to-br from-white via-forest-50 to-emerald-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-10 w-28 h-28 rounded-full bg-forest-400"></div>
          <div className="absolute bottom-10 left-10 w-36 h-36 rounded-full bg-emerald-400"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-forest-100 border border-forest-200 rounded-full px-6 py-3 mb-6">
              <Shield className="w-5 h-5 text-forest-600" />
              <span className="text-forest-700 font-medium">End-to-End Solutions</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-forest-900 mb-6 leading-tight">
              Comprehensive 
              <span className="block text-gradient-forest bg-gradient-to-r from-forest-600 to-emerald-600 bg-clip-text text-transparent">
                B2B Services
              </span>
            </h2>
            <p className="text-xl text-forest-600 max-w-4xl mx-auto leading-relaxed">
              End-to-end coffee export solutions designed for international business partners
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="group text-center hover:-translate-y-2 transition-all duration-500">
              <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-forest-100 to-forest-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-forest-medium group-hover:shadow-forest-strong">
                <Package className="h-12 w-12 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-forest-800 mb-6 group-hover:text-forest-600 transition-colors">
                Sourcing & Quality Control
              </h3>
              <p className="text-forest-600 mb-8 leading-relaxed text-lg">
                Direct sourcing from Vietnamese farms with rigorous quality control and comprehensive certification management
              </p>
              <Button variant="outline" className="border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white px-8 py-3 font-semibold shadow-forest-soft hover:shadow-forest-medium transition-all duration-300">
                Learn More
              </Button>
            </div>

            <div className="group text-center hover:-translate-y-2 transition-all duration-500">
              <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-emerald-medium group-hover:shadow-emerald-strong">
                <Truck className="h-12 w-12 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-forest-800 mb-6 group-hover:text-emerald-600 transition-colors">
                Global Logistics
              </h3>
              <p className="text-forest-600 mb-8 leading-relaxed text-lg">
                Reliable international shipping with full documentation and customs support for seamless global delivery
              </p>
              <Button variant="outline" className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3 font-semibold shadow-emerald-soft hover:shadow-emerald-medium transition-all duration-300">
                Learn More
              </Button>
            </div>

            <div className="group text-center hover:-translate-y-2 transition-all duration-500">
              <div className="mx-auto mb-8 w-24 h-24 bg-gradient-to-br from-forest-100 to-forest-200 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-forest-medium group-hover:shadow-forest-strong">
                <Shield className="h-12 w-12 text-forest-600" />
              </div>
              <h3 className="text-2xl font-bold text-forest-800 mb-6 group-hover:text-forest-600 transition-colors">
                Risk Management
              </h3>
              <p className="text-forest-600 mb-8 leading-relaxed text-lg">
                Comprehensive insurance coverage and risk mitigation strategies for secure international trade
              </p>
              <Button variant="outline" className="border-2 border-forest-600 text-forest-600 hover:bg-forest-600 hover:text-white px-8 py-3 font-semibold shadow-forest-soft hover:shadow-forest-medium transition-all duration-300">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 rounded-full bg-emerald-400 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-36 h-36 rounded-full bg-forest-400 blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-6 py-3 mb-8">
            <Users className="w-5 h-5 text-emerald-400" />
            <span className="text-emerald-200 font-medium">Join Our Global Network</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Partner with Vietnam's 
            <span className="block text-gradient-emerald bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Leading Coffee Exporter?
            </span>
          </h2>
          
          <p className="text-xl text-forest-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join 500+ international partners who trust The Great Beans for premium Vietnamese coffee solutions and exceptional service
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="group bg-emerald-500 hover:bg-emerald-600 text-forest-900 px-10 py-4 text-lg font-semibold shadow-emerald-medium hover:shadow-emerald-strong transition-all duration-300 transform hover:scale-105">
              <Link href={`/${locale}/quote`}>
                Request Quote 
                <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-forest-200 text-forest-100 hover:bg-forest-100 hover:text-forest-900 px-10 py-4 text-lg font-bold shadow-forest-soft hover:shadow-forest-medium transition-all duration-300">
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
