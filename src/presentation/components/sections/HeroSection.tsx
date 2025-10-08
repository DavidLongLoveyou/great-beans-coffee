'use client';

import { Coffee, Globe, Award, ArrowRight } from 'lucide-react';
import { EnhancedButton } from '@/presentation/components/ui/EnhancedButton';
import { ScrollReveal, StaggeredChildren, FloatingElement, MagneticHover } from '@/presentation/components/ui/ScrollAnimations';
import { OptimizedBackgroundImage } from '@/presentation/components/ui/OptimizedImage';

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
      <div className="container relative z-10 mx-auto max-w-7xl px-4 py-12 sm:py-20">
        <div className="flex min-h-[60vh] flex-col items-center justify-between sm:min-h-[70vh] lg:flex-row">
          {/* Left Content */}
          <div className="mb-8 text-center sm:mb-12 lg:mb-0 lg:w-1/2 lg:text-left">
            {/* Premium Badge */}
            <ScrollReveal direction="down" delay={0.2}>
              <MagneticHover strength={0.2}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-3 py-2 sm:mb-6 sm:px-4 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/20">
                  <Award className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-200 sm:text-sm">
                    Premium Vietnamese Coffee Export
                  </span>
                </div>
              </MagneticHover>
            </ScrollReveal>

            {/* Main Title */}
            <StaggeredChildren staggerDelay={0.1} childDelay={0.4}>
              <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block">Premium</span>
                <span className="text-gradient-emerald block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                  Vietnamese Coffee
                </span>
                <span className="block">Export Solutions</span>
              </h1>
            </StaggeredChildren>

            {/* Subtitle */}
            <ScrollReveal direction="up" delay={0.8} duration={0.8}>
              <p className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-forest-100 sm:mb-8 sm:text-lg md:text-xl lg:mx-0">
                {subtitle}
              </p>
            </ScrollReveal>

            {/* Key Features */}
            <StaggeredChildren staggerDelay={0.15} childDelay={1.0}>
              <div className="mb-6 flex flex-wrap justify-center gap-3 sm:mb-8 sm:gap-4 lg:justify-start">
                <div className="flex items-center gap-2 text-forest-200 transition-all duration-300 hover:text-emerald-200">
                  <Coffee className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium sm:text-sm">
                    Premium Robusta & Arabica
                  </span>
                </div>
                <div className="flex items-center gap-2 text-forest-200 transition-all duration-300 hover:text-emerald-200">
                  <Globe className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium sm:text-sm">
                    25+ Countries Served
                  </span>
                </div>
                <div className="flex items-center gap-2 text-forest-200 transition-all duration-300 hover:text-emerald-200">
                  <Award className="h-4 w-4 text-emerald-400 sm:h-5 sm:w-5" />
                  <span className="text-xs font-medium sm:text-sm">
                    ISO Certified
                  </span>
                </div>
              </div>
            </StaggeredChildren>

            {/* CTA Buttons */}
            <ScrollReveal direction="up" delay={1.2} duration={0.6}>
              <div className="mb-6 flex flex-col items-center justify-center gap-3 sm:mb-8 sm:flex-row sm:gap-4 lg:justify-start">
                <EnhancedButton
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
                  {...(onCtaClick && { onClick: onCtaClick })}
                >
                  {ctaText}
                </EnhancedButton>
                <EnhancedButton
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  {...(onCtaSecondaryClick && { onClick: onCtaSecondaryClick })}
                >
                  {ctaSecondaryText}
                </EnhancedButton>
              </div>
            </ScrollReveal>

            {/* Trust Indicators */}
            <ScrollReveal direction="up" delay={1.4} duration={0.6}>
              <div className="text-center lg:text-left">
                <p className="mb-3 text-xs font-medium text-forest-300 sm:mb-4 sm:text-sm">
                  Trusted by 500+ B2B partners across 25+ countries since 2018
                </p>
                <StaggeredChildren staggerDelay={0.1} childDelay={0.2}>
                  <div className="flex items-center justify-center space-x-3 opacity-70 sm:space-x-6 lg:justify-start">
                    {/* Professional partner logos placeholders with forest theme */}
                    <div className="flex h-8 w-16 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-md sm:h-10 sm:w-24">
                      <Coffee className="h-4 w-4 text-forest-300 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex h-8 w-16 items-center justify-center rounded border border-emerald-200/30 bg-gradient-to-r from-emerald-200/20 to-forest-200/20 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-md sm:h-10 sm:w-24">
                      <Globe className="h-4 w-4 text-emerald-300 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex h-8 w-16 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm transition-all duration-300 hover:opacity-100 hover:shadow-md sm:h-10 sm:w-24">
                      <Award className="h-4 w-4 text-forest-300 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </StaggeredChildren>
              </div>
            </ScrollReveal>
          </div>

          {/* Right Content - Visual Elements */}
          <ScrollReveal direction="right" delay={0.6} duration={0.8}>
            <div className="relative px-4 sm:px-8 lg:w-1/2 lg:px-0">
              {/* Coffee Farm Illustration Placeholder */}
              <div className="relative mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg">
                {/* Main Coffee Cup/Bean Visual */}
                <MagneticHover strength={0.1}>
                  <div className="relative mx-auto h-64 w-64 sm:h-72 sm:w-72 lg:h-80 lg:w-80">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald-400/30 to-forest-600/30 blur-3xl"></div>
                    <div className="relative flex h-full w-full items-center justify-center rounded-full border border-emerald-400/30 bg-gradient-to-br from-emerald-500/20 to-forest-700/20 backdrop-blur-sm transition-all duration-500 hover:border-emerald-400/50 hover:shadow-2xl hover:shadow-emerald-500/20">
                      <Coffee className="h-20 w-20 text-emerald-400 transition-all duration-300 hover:scale-110 sm:h-24 sm:w-24 lg:h-32 lg:w-32" />
                    </div>
                  </div>
                </MagneticHover>

                {/* Floating Elements - Hidden on mobile to prevent overflow */}
                <FloatingElement amplitude={8} frequency={3} delay={0}>
                  <div className="absolute -right-4 -top-4 flex hidden h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400/40 to-emerald-600/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg sm:block lg:-right-8 lg:-top-8 lg:h-16 lg:w-16">
                    <Award className="h-6 w-6 text-emerald-200 lg:h-8 lg:w-8" />
                  </div>
                </FloatingElement>
                
                <FloatingElement amplitude={10} frequency={4} delay={1}>
                  <div className="absolute -bottom-4 -left-4 flex hidden h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest-400/40 to-forest-600/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:shadow-lg sm:block lg:-bottom-8 lg:-left-8 lg:h-20 lg:w-20">
                    <Globe className="h-8 w-8 text-forest-200 lg:h-10 lg:w-10" />
                  </div>
                </FloatingElement>

                {/* Quality Indicators - Repositioned for mobile */}
                <ScrollReveal direction="left" delay={1.0} duration={0.6}>
                  <MagneticHover strength={0.15}>
                    <div className="absolute left-2 top-1/4 rounded-lg border border-emerald-400/30 bg-forest-800/80 px-2 py-1 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:bg-forest-800/90 hover:shadow-lg sm:-left-6 sm:px-4 sm:py-2 lg:-left-12">
                      <div className="text-xs font-semibold text-emerald-400 sm:text-sm">
                        Premium Grade
                      </div>
                      <div className="text-xs text-forest-200">ISO Certified</div>
                    </div>
                  </MagneticHover>
                </ScrollReveal>
                
                <ScrollReveal direction="right" delay={1.2} duration={0.6}>
                  <MagneticHover strength={0.15}>
                    <div className="absolute bottom-1/4 right-2 rounded-lg border border-emerald-400/30 bg-forest-800/80 px-2 py-1 backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:bg-forest-800/90 hover:shadow-lg sm:-right-6 sm:px-4 sm:py-2 lg:-right-12">
                      <div className="text-xs font-semibold text-emerald-400 sm:text-sm">
                        Global Export
                      </div>
                      <div className="text-xs text-forest-200">25+ Countries</div>
                    </div>
                  </MagneticHover>
                </ScrollReveal>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
}
