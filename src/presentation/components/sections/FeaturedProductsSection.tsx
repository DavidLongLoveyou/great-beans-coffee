'use client';

import { 
  Coffee, 
  ArrowRight, 
  CheckCircle, 
  Star,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/presentation/components/ui/card';

interface FeaturedProductsSectionProps {
  locale: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  grade: string;
  origin: string;
  processingMethod: string;
  features: string[];
  specifications: {
    moisture: string;
    screenSize: string;
    defectRate: string;
    cuppingScore?: number;
  };
  badge: {
    text: string;
    variant: 'premium' | 'specialty' | 'custom';
  };
  isPopular?: boolean;
}

export function FeaturedProductsSection({ locale }: FeaturedProductsSectionProps) {
  const t = useTranslations('homepage');
  const [currentIndex, setCurrentIndex] = useState(0);

  const featuredProducts: Product[] = [
    {
      id: 'grade-1-robusta',
      name: 'Grade 1 Robusta Beans',
      description: 'Premium Vietnamese Robusta with rich flavor profile and exceptionally low defect rate',
      grade: 'Grade 1',
      origin: 'Dak Lak Province',
      processingMethod: 'Wet Processing',
      features: ['Screen size 16+ (90% minimum)', 'Moisture content ≤ 12.5%', 'Defect rate ≤ 5%'],
      specifications: {
        moisture: '≤ 12.5%',
        screenSize: '16+ (90% min)',
        defectRate: '≤ 5%'
      },
      badge: { text: 'Premium Robusta', variant: 'premium' },
      isPopular: true
    },
    {
      id: 'highland-arabica',
      name: 'Highland Arabica',
      description: 'High-altitude Vietnamese Arabica with exceptional cup quality and unique flavor notes',
      grade: 'Specialty',
      origin: 'Da Lat Highlands',
      processingMethod: 'Washed',
      features: ['Cupping score 80+', 'Grown at 1,200m+ altitude', 'Washed processing method'],
      specifications: {
        moisture: '≤ 11%',
        screenSize: '15+ (85% min)',
        defectRate: '≤ 3%',
        cuppingScore: 82
      },
      badge: { text: 'Specialty Arabica', variant: 'specialty' }
    },
    {
      id: 'custom-blends',
      name: 'Private Label Solutions',
      description: 'Custom coffee blends and comprehensive private labeling services for your brand',
      grade: 'Custom',
      origin: 'Multi-Origin',
      processingMethod: 'Various',
      features: ['Custom blend development', 'Private label packaging', 'Brand consultation services'],
      specifications: {
        moisture: 'As specified',
        screenSize: 'As specified',
        defectRate: 'As specified'
      },
      badge: { text: 'Custom Blends', variant: 'custom' }
    }
  ];

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'premium':
        return 'border-forest-500/50 bg-forest-600/80 text-forest-100';
      case 'specialty':
        return 'border-emerald-500/50 bg-emerald-600/80 text-emerald-100';
      case 'custom':
        return 'border-forest-500/50 bg-forest-600/80 text-forest-100';
      default:
        return 'border-forest-500/50 bg-forest-600/80 text-forest-100';
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900 py-24">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-800/90 to-forest-900/95"></div>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-emerald-400 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-forest-400 blur-2xl animate-pulse delay-1000"></div>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3">
            <Coffee className="h-5 w-5 text-emerald-400" />
            <span className="font-medium text-emerald-200">Premium Vietnamese Origins</span>
          </div>
          
          <h2 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl">
            Featured Coffee
            <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          
          <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-100">
            Discover our range of premium Vietnamese coffee beans, sourced directly from the finest growing regions
          </p>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevProduct}
            className="absolute left-0 top-1/2 z-20 -translate-y-1/2 -translate-x-4 rounded-full bg-forest-800/80 p-3 text-emerald-400 shadow-forest-medium backdrop-blur-sm transition-all duration-300 hover:bg-forest-700/90 hover:shadow-forest-strong hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextProduct}
            className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 rounded-full bg-forest-800/80 p-3 text-emerald-400 shadow-forest-medium backdrop-blur-sm transition-all duration-300 hover:bg-forest-700/90 hover:shadow-forest-strong hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Products Grid */}
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {featuredProducts.map((product, index) => {
              const isActive = index === currentIndex;
              const isVisible = Math.abs(index - currentIndex) <= 1 || featuredProducts.length <= 3;
              
              return (
                <Card 
                  key={product.id}
                  className={`group relative overflow-hidden border-forest-600/30 bg-forest-800/50 shadow-forest-medium backdrop-blur-sm transition-all duration-500 ${
                    isActive 
                      ? 'scale-105 border-emerald-400/50 bg-forest-700/60 shadow-emerald-strong' 
                      : 'hover:-translate-y-2 hover:border-emerald-400/50 hover:bg-forest-700/60 hover:shadow-emerald-strong'
                  } ${isVisible ? 'opacity-100' : 'opacity-50'}`}
                >
                  {/* Popular Badge */}
                  {product.isPopular && (
                    <div className="absolute right-4 top-4 z-10">
                      <Badge className="border-emerald-400/50 bg-emerald-500/80 text-emerald-100 shadow-emerald-soft">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <Badge className={`w-fit border shadow-sm ${getBadgeStyles(product.badge.variant)}`}>
                      {product.badge.text}
                    </Badge>
                    
                    <CardTitle className="text-xl font-bold text-white transition-colors group-hover:text-emerald-200">
                      {product.name}
                    </CardTitle>
                    
                    <CardDescription className="leading-relaxed text-forest-200">
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {/* Product Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-forest-300">Grade:</span>
                        <span className="ml-2 font-medium text-emerald-400">{product.grade}</span>
                      </div>
                      <div>
                        <span className="text-forest-300">Origin:</span>
                        <span className="ml-2 font-medium text-emerald-400">{product.origin}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                      {product.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-forest-200">
                          <CheckCircle className="mr-3 h-4 w-4 flex-shrink-0 text-emerald-400" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Specifications */}
                    {product.specifications.cuppingScore && (
                      <div className="rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 text-emerald-400 fill-current" />
                          <span className="text-emerald-300">Cupping Score:</span>
                          <span className="font-bold text-emerald-400">{product.specifications.cuppingScore}+</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <ServerButton
                        asChild
                        size="sm"
                        className="flex-1 bg-emerald-500 text-forest-900 shadow-emerald-medium transition-all duration-300 hover:bg-emerald-600 hover:shadow-emerald-strong hover:scale-105"
                      >
                        <Link href={`/${locale}/quote?product=${product.id}`}>
                          Request Quote
                        </Link>
                      </ServerButton>
                      
                      <ServerButton
                        variant="outline"
                        size="sm"
                        className="border-forest-200 text-forest-200 shadow-forest-soft hover:bg-forest-200 hover:text-forest-900"
                      >
                        <Download className="h-4 w-4" />
                      </ServerButton>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Carousel Indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {featuredProducts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 w-8 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-emerald-400 shadow-emerald-glow' 
                    : 'bg-forest-600 hover:bg-forest-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <ServerButton
            asChild
            size="lg"
            className="group transform bg-emerald-500 px-10 py-4 text-lg font-semibold text-forest-900 shadow-emerald-medium transition-all duration-300 hover:scale-105 hover:bg-emerald-600 hover:shadow-emerald-strong"
          >
            <Link href={`/${locale}/products`}>
              View All Products
              <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
            </Link>
          </ServerButton>
        </div>
      </div>
    </section>
  );
}