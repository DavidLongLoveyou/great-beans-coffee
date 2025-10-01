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
    <section className="relative bg-gradient-to-br from-forest-50 via-sage-50 to-emerald-50 px-4 py-20 shadow-forest-soft">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-forest-700 md:text-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-emerald-600 px-8 py-3 text-lg font-semibold text-white hover:bg-emerald-700 shadow-emerald-medium hover:shadow-emerald-strong transition-all duration-300"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-forest-600 px-8 py-3 text-lg font-semibold text-forest-600 hover:bg-forest-50 shadow-forest-soft hover:shadow-forest-medium transition-all duration-300"
              onClick={onCtaSecondaryClick}
            >
              {ctaSecondaryText}
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12">
            <p className="mb-4 text-sm text-forest-600 font-medium">
              Trusted by 500+ B2B partners across 25+ countries since 2018
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-70">
              {/* Professional partner logos placeholders */}
              <div className="h-8 w-20 rounded bg-forest-200 shadow-sm"></div>
              <div className="h-8 w-20 rounded bg-sage-200 shadow-sm"></div>
              <div className="h-8 w-20 rounded bg-emerald-200 shadow-sm"></div>
              <div className="h-8 w-20 rounded bg-forest-200 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="h-full w-full bg-gradient-to-l from-emerald-200 to-transparent"></div>
      </div>
    </section>
  );
}
