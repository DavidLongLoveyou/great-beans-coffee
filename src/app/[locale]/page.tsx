import type { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Users, ArrowRight } from '@/components/ui/icons';

import { type Locale } from '@/i18n';
import { ServerHeroSection } from '@/presentation/components/sections/ServerHeroSection';
import { ValuePropositionSection } from '@/presentation/components/sections/ValuePropositionSection';
import { ArticlesCarousel } from '@/presentation/components/sections/ArticlesCarousel';
import {
  FadeInScroll,
  AnimatedIcon,
  FloatingElement,
} from '@/presentation/components/ui/MicroInteractions';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { generateMetadata as generateSEOMetadata } from '@/shared/utils/seo-utils';

// Dynamic imports for sections below the fold to reduce initial bundle size
const FeaturedProductsSection = dynamic(
  () =>
    import('@/presentation/components/sections/FeaturedProductsSection').then(
      mod => ({ default: mod.FeaturedProductsSection })
    ),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  }
);

const OurProcessSection = dynamic(
  () =>
    import('@/presentation/components/sections/OurProcessSection').then(
      mod => ({ default: mod.OurProcessSection })
    ),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  }
);

const TestimonialsSection = dynamic(
  () =>
    import('@/presentation/components/sections/TestimonialsSection').then(
      mod => ({ default: mod.TestimonialsSection })
    ),
  {
    loading: () => <div className="h-96 animate-pulse bg-gray-100" />,
  }
);

// Generate SEO metadata for the homepage
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return generateSEOMetadata({
    title: 'Premium Vietnamese Coffee Exports - B2B Coffee Solutions',
    description:
      'Leading B2B platform for Vietnamese coffee exports. Premium Robusta, Arabica, and specialty blends for global importers, roasters, and distributors worldwide.',
    keywords: [
      'vietnamese coffee export',
      'robusta coffee supplier',
      'arabica coffee vietnam',
      'b2b coffee solutions',
      'coffee wholesale',
      'premium coffee beans',
      'coffee manufacturing',
      'private label coffee',
      'specialty coffee sourcing',
      'vietnam coffee beans',
    ],
    url: `/${locale}`,
    type: 'website',
    locale,
    image: '/images/hero/vietnam-coffee-plantation.jpg',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <ServerHeroSection
        title="Premium Vietnamese Coffee Export Solutions"
        subtitle="Connect with Vietnam's leading coffee exporter. We provide premium Robusta and Arabica beans, OEM services, and private label solutions to B2B partners worldwide."
        ctaHref={`/${locale}/quote`}
        ctaSecondaryHref={`/${locale}/products`}
        videoPoster="/videos/coffee-farm-processing-poster.svg"
        showVideoControls={false}
      />

      {/* Value Proposition Section */}
      <ValuePropositionSection locale={locale} />

      {/* Featured Products Section */}
      <FeaturedProductsSection locale={locale} />

      {/* Our Process Section */}
      <OurProcessSection locale={locale} />

      {/* Testimonials Section */}
      <TestimonialsSection locale={locale} />

      {/* Articles Carousel */}
      <ArticlesCarousel />

      {/* CTA Section */}
      <FadeInScroll threshold={0.2}>
        <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 py-24">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
          <div className="absolute inset-0 opacity-10">
            <FloatingElement duration={4} yOffset={8}>
              <div className="absolute left-1/3 top-1/3 h-48 w-48 animate-pulse rounded-full bg-emerald-400 blur-3xl"></div>
            </FloatingElement>
            <FloatingElement duration={6} yOffset={12}>
              <div className="absolute bottom-1/3 right-1/3 h-36 w-36 animate-pulse rounded-full bg-forest-400 blur-2xl delay-1000"></div>
            </FloatingElement>
          </div>

          <div className="container relative z-10 mx-auto max-w-5xl px-4 text-center">
            <FadeInScroll delay={0.2}>
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3">
                <AnimatedIcon hoverScale={1.2}>
                  <Users className="h-5 w-5 text-emerald-400" />
                </AnimatedIcon>
                <span className="font-medium text-emerald-200">
                  Join Our Global Network
                </span>
              </div>
            </FadeInScroll>

            <FadeInScroll delay={0.4}>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                Ready to Partner with Vietnam&apos;s
                <span className="text-gradient-emerald block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Leading Coffee Exporter?
                </span>
              </h2>
            </FadeInScroll>

            <FadeInScroll delay={0.6}>
              <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-forest-100">
                Join 500+ international partners who trust The Great Beans for
                premium Vietnamese coffee solutions and exceptional service
              </p>
            </FadeInScroll>

            <FadeInScroll delay={0.8}>
              <div className="flex flex-col justify-center gap-6 sm:flex-row">
                <ServerButton
                  asChild
                  size="lg"
                  className="shadow-emerald-medium hover:shadow-emerald-strong group transform bg-emerald-500 px-10 py-4 text-lg font-semibold text-forest-900 transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
                >
                  <Link href={`/${locale}/quote`}>
                    Request Quote
                    <AnimatedIcon hoverRotate={0} hoverScale={1.2}>
                      <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                    </AnimatedIcon>
                  </Link>
                </ServerButton>
                <ServerButton
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-forest-200 bg-white/90 px-10 py-4 text-lg font-bold text-forest-900 opacity-100 shadow-forest-soft transition-all duration-300 hover:bg-forest-100 hover:text-forest-900 hover:shadow-forest-medium"
                >
                  <Link href={`/${locale}/contact`}>Contact Sales Team</Link>
                </ServerButton>
              </div>
            </FadeInScroll>
          </div>
        </section>
      </FadeInScroll>
    </div>
  );
}
