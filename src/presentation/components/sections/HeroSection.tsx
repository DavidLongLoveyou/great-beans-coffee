import { Coffee, Globe, Award, ArrowRight } from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  onCtaClick?: () => void;
  onCtaSecondaryClick?: () => void;
}

export function HeroSection({
  title,
  subtitle,
  ctaText = 'Request a Quote',
  ctaSecondaryText = 'Explore Products',
  onCtaClick,
  onCtaSecondaryClick,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-800/80 to-forest-900/90"></div>

      {/* Coffee Bean Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-10 top-10 h-8 w-8 animate-pulse rounded-full bg-emerald-400"></div>
        <div className="absolute right-20 top-32 h-6 w-6 animate-pulse rounded-full bg-emerald-300 delay-1000"></div>
        <div className="delay-2000 absolute bottom-40 left-1/4 h-4 w-4 animate-pulse rounded-full bg-emerald-500"></div>
        <div className="absolute bottom-20 right-1/3 h-10 w-10 animate-pulse rounded-full bg-emerald-400 delay-500"></div>
        <div className="delay-1500 absolute left-1/2 top-1/2 h-5 w-5 animate-pulse rounded-full bg-emerald-300"></div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-20">
        <div className="flex min-h-[70vh] flex-col items-center justify-between lg:flex-row">
          {/* Left Content */}
          <div className="mb-12 text-center lg:mb-0 lg:w-1/2 lg:text-left">
            {/* Premium Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-2">
              <Award className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-200">
                Premium Vietnamese Coffee Export
              </span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">Premium</span>
              <span className="text-gradient-emerald block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Vietnamese Coffee
              </span>
              <span className="block">Export Solutions</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-forest-100 md:text-xl lg:mx-0">
              {subtitle}
            </p>

            {/* Key Features */}
            <div className="mb-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <div className="flex items-center gap-2 text-forest-200">
                <Coffee className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium">
                  Premium Robusta & Arabica
                </span>
              </div>
              <div className="flex items-center gap-2 text-forest-200">
                <Globe className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium">
                  25+ Countries Served
                </span>
              </div>
              <div className="flex items-center gap-2 text-forest-200">
                <Award className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium">ISO Certified</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start">
              <Button
                size="lg"
                className="hover:shadow-emerald-strong group transform bg-emerald-500 px-8 py-4 text-lg font-semibold text-forest-900 shadow-emerald-glow transition-all duration-300 hover:scale-105 hover:bg-emerald-600"
                onClick={onCtaClick}
              >
                {ctaText}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-forest-200 px-8 py-4 text-lg font-semibold text-forest-100 shadow-forest-soft transition-all duration-300 hover:bg-forest-100 hover:text-forest-900 hover:shadow-forest-medium"
                onClick={onCtaSecondaryClick}
              >
                {ctaSecondaryText}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center lg:text-left">
              <p className="mb-4 text-sm font-medium text-forest-300">
                Trusted by 500+ B2B partners across 25+ countries since 2018
              </p>
              <div className="flex items-center justify-center space-x-6 opacity-70 lg:justify-start">
                {/* Professional partner logos placeholders with forest theme */}
                <div className="flex h-10 w-24 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm">
                  <Coffee className="h-5 w-5 text-forest-300" />
                </div>
                <div className="flex h-10 w-24 items-center justify-center rounded border border-emerald-200/30 bg-gradient-to-r from-emerald-200/20 to-forest-200/20 shadow-sm">
                  <Globe className="h-5 w-5 text-emerald-300" />
                </div>
                <div className="flex h-10 w-24 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm">
                  <Award className="h-5 w-5 text-forest-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="relative lg:w-1/2">
            {/* Coffee Farm Illustration Placeholder */}
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main Coffee Cup/Bean Visual */}
              <div className="relative mx-auto h-80 w-80">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-forest-600/30 blur-3xl"></div>
                <div className="relative flex h-full w-full items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-forest-700/20 backdrop-blur-sm">
                  <Coffee className="h-32 w-32 text-emerald-400" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -right-8 -top-8 flex h-16 w-16 animate-bounce items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/40 to-emerald-600/40">
                <Award className="h-8 w-8 text-emerald-200" />
              </div>
              <div className="absolute -bottom-8 -left-8 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-forest-400/40 to-forest-600/40">
                <Globe className="h-10 w-10 text-forest-200" />
              </div>

              {/* Quality Indicators */}
              <div className="absolute -left-12 top-1/4 rounded-lg border border-emerald-400/30 bg-forest-800/80 px-4 py-2 backdrop-blur-sm">
                <div className="text-sm font-semibold text-emerald-400">
                  Premium Grade
                </div>
                <div className="text-xs text-forest-200">ISO Certified</div>
              </div>
              <div className="absolute -right-12 bottom-1/4 rounded-lg border border-emerald-400/30 bg-forest-800/80 px-4 py-2 backdrop-blur-sm">
                <div className="text-sm font-semibold text-emerald-400">
                  Global Export
                </div>
                <div className="text-xs text-forest-200">25+ Countries</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
