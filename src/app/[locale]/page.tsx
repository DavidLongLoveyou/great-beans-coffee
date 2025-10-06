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
import { ServerHeroSection } from '@/presentation/components/sections/ServerHeroSection';
import { ValuePropositionSection } from '@/presentation/components/sections/ValuePropositionSection';
import { FeaturedProductsSection } from '@/presentation/components/sections/FeaturedProductsSection';
import { OurProcessSection } from '@/presentation/components/sections/OurProcessSection';
import { Badge } from '@/presentation/components/ui/badge';
import { ServerButton } from '@/presentation/components/ui/server-button';
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
      <ServerHeroSection locale={locale} />

      {/* Value Proposition Section */}
      <ValuePropositionSection locale={locale} />

      {/* Featured Products Section */}
      <FeaturedProductsSection locale={locale} />

      {/* Our Process Section */}
      <OurProcessSection locale={locale} />



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
            <ServerButton
              asChild
              size="lg"
              className="shadow-emerald-medium hover:shadow-emerald-strong group transform bg-emerald-500 px-10 py-4 text-lg font-semibold text-forest-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
            >
              <Link href={`/${locale}/quote`}>
                Request Quote
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </ServerButton>
            <ServerButton
              asChild
              variant="outline"
              size="lg"
              className="border-2 border-forest-200 px-10 py-4 text-lg font-bold text-forest-100 shadow-forest-soft transition-all duration-300 hover:bg-forest-100 hover:text-forest-900 hover:shadow-forest-medium"
            >
              <Link href={`/${locale}/contact`}>Contact Sales Team</Link>
            </ServerButton>
          </div>
        </div>
      </section>
    </main>
  );
}
