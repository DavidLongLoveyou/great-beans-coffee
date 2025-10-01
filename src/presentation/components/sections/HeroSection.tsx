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
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-gray-900 md:text-5xl lg:text-6xl">
            {title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-amber-600 px-8 py-3 text-lg font-semibold text-white hover:bg-amber-700"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-amber-600 px-8 py-3 text-lg font-semibold text-amber-600 hover:bg-amber-50"
              onClick={onCtaSecondaryClick}
            >
              {ctaSecondaryText}
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="mt-12">
            <p className="mb-4 text-sm text-gray-500">
              Trusted by 500+ customers across 10+ countries since 2018
            </p>
            <div className="flex items-center justify-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="h-8 w-20 rounded bg-gray-300"></div>
              <div className="h-8 w-20 rounded bg-gray-300"></div>
              <div className="h-8 w-20 rounded bg-gray-300"></div>
              <div className="h-8 w-20 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute right-0 top-0 h-full w-1/3 opacity-10">
        <div className="h-full w-full bg-gradient-to-l from-amber-200 to-transparent"></div>
      </div>
    </section>
  );
}
