import { Button } from '@/presentation/components/ui/button';
import { Coffee, Globe, Award, ArrowRight } from 'lucide-react';

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
        <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-emerald-400 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-6 h-6 rounded-full bg-emerald-300 animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/4 w-4 h-4 rounded-full bg-emerald-500 animate-pulse delay-2000"></div>
        <div className="absolute bottom-20 right-1/3 w-10 h-10 rounded-full bg-emerald-400 animate-pulse delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-5 h-5 rounded-full bg-emerald-300 animate-pulse delay-1500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-[70vh]">
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2 mb-6">
              <Award className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-200 text-sm font-medium">Premium Vietnamese Coffee Export</span>
            </div>

            {/* Main Title */}
            <h1 className="mb-6 text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white">
              <span className="block">Premium</span>
              <span className="block text-gradient-emerald bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Vietnamese Coffee
              </span>
              <span className="block">Export Solutions</span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto lg:mx-0 mb-8 max-w-2xl text-lg md:text-xl leading-relaxed text-forest-100">
              {subtitle}
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              <div className="flex items-center gap-2 text-forest-200">
                <Coffee className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">Premium Robusta & Arabica</span>
              </div>
              <div className="flex items-center gap-2 text-forest-200">
                <Globe className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">25+ Countries Served</span>
              </div>
              <div className="flex items-center gap-2 text-forest-200">
                <Award className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-medium">ISO Certified</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-8">
              <Button
                size="lg"
                className="group bg-emerald-500 hover:bg-emerald-600 text-forest-900 px-8 py-4 text-lg font-semibold shadow-emerald-glow hover:shadow-emerald-strong transition-all duration-300 transform hover:scale-105"
                onClick={onCtaClick}
              >
                {ctaText}
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-forest-200 text-forest-100 hover:bg-forest-100 hover:text-forest-900 px-8 py-4 text-lg font-semibold shadow-forest-soft hover:shadow-forest-medium transition-all duration-300"
                onClick={onCtaSecondaryClick}
              >
                {ctaSecondaryText}
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="text-center lg:text-left">
              <p className="mb-4 text-sm text-forest-300 font-medium">
                Trusted by 500+ B2B partners across 25+ countries since 2018
              </p>
              <div className="flex items-center justify-center lg:justify-start space-x-6 opacity-70">
                {/* Professional partner logos placeholders with forest theme */}
                <div className="h-10 w-24 rounded bg-gradient-to-r from-forest-200/20 to-emerald-200/20 border border-forest-200/30 shadow-sm flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-forest-300" />
                </div>
                <div className="h-10 w-24 rounded bg-gradient-to-r from-emerald-200/20 to-forest-200/20 border border-emerald-200/30 shadow-sm flex items-center justify-center">
                  <Globe className="w-5 h-5 text-emerald-300" />
                </div>
                <div className="h-10 w-24 rounded bg-gradient-to-r from-forest-200/20 to-emerald-200/20 border border-forest-200/30 shadow-sm flex items-center justify-center">
                  <Award className="w-5 h-5 text-forest-300" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Elements */}
          <div className="lg:w-1/2 relative">
            {/* Coffee Farm Illustration Placeholder */}
            <div className="relative w-full max-w-lg mx-auto">
              {/* Main Coffee Cup/Bean Visual */}
              <div className="relative w-80 h-80 mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-forest-600/30 rounded-full blur-3xl"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-500/20 to-forest-700/20 rounded-full border border-emerald-400/30 flex items-center justify-center backdrop-blur-sm">
                  <Coffee className="w-32 h-32 text-emerald-400" />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br from-emerald-400/40 to-emerald-600/40 rounded-full flex items-center justify-center animate-bounce">
                <Award className="w-8 h-8 text-emerald-200" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-forest-400/40 to-forest-600/40 rounded-full flex items-center justify-center animate-pulse">
                <Globe className="w-10 h-10 text-forest-200" />
              </div>

              {/* Quality Indicators */}
              <div className="absolute top-1/4 -left-12 bg-forest-800/80 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-4 py-2">
                <div className="text-emerald-400 text-sm font-semibold">Premium Grade</div>
                <div className="text-forest-200 text-xs">ISO Certified</div>
              </div>
              <div className="absolute bottom-1/4 -right-12 bg-forest-800/80 backdrop-blur-sm border border-emerald-400/30 rounded-lg px-4 py-2">
                <div className="text-emerald-400 text-sm font-semibold">Global Export</div>
                <div className="text-forest-200 text-xs">25+ Countries</div>
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
