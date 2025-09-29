import { Button } from '@/presentation/components/ui/button'

interface HeroSectionProps {
  title: string
  subtitle: string
  ctaText?: string
  ctaSecondaryText?: string
  onCtaClick?: () => void
  onCtaSecondaryClick?: () => void
}

export function HeroSection({
  title,
  subtitle,
  ctaText = "Request a Quote",
  ctaSecondaryText = "Explore Products",
  onCtaClick,
  onCtaSecondaryClick
}: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center">
          {/* Main Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            {title}
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            {subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 text-lg font-semibold"
              onClick={onCtaClick}
            >
              {ctaText}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-amber-600 text-amber-600 hover:bg-amber-50 px-8 py-3 text-lg font-semibold"
              onClick={onCtaSecondaryClick}
            >
              {ctaSecondaryText}
            </Button>
          </div>
          
          {/* Trust Badge */}
          <div className="mt-12">
            <p className="text-sm text-gray-500 mb-4">
              Trusted by 500+ importers worldwide
            </p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {/* Placeholder for partner logos */}
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <div className="w-full h-full bg-gradient-to-l from-amber-200 to-transparent"></div>
      </div>
    </section>
  )
}