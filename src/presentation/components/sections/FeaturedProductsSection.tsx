'use client';

import { motion, useInView, Variants } from 'framer-motion';
import {
  Coffee,
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
} from '@/components/ui/icons';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import { EnhancedButton } from '@/presentation/components/ui/EnhancedButton';
import {
  ScrollReveal,
  StaggeredChildren,
} from '@/presentation/components/ui/ScrollAnimations';

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

// Animation variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

export function FeaturedProductsSection({
  locale,
}: FeaturedProductsSectionProps) {
  const _t = useTranslations('homepage');
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const featuredProducts: Product[] = [
    {
      id: 'grade-1-robusta',
      name: 'Grade 1 Robusta Beans',
      description:
        'Premium Vietnamese Robusta with rich flavor profile and exceptionally low defect rate',
      grade: 'Grade 1',
      origin: 'Dak Lak Province',
      processingMethod: 'Wet Processing',
      features: [
        'Screen size 16+ (90% minimum)',
        'Moisture content ≤ 12.5%',
        'Defect rate ≤ 5%',
      ],
      specifications: {
        moisture: '≤ 12.5%',
        screenSize: '16+ (90% min)',
        defectRate: '≤ 5%',
      },
      badge: { text: 'Premium Robusta', variant: 'premium' },
      isPopular: true,
    },
    {
      id: 'highland-arabica',
      name: 'Highland Arabica',
      description:
        'High-altitude Vietnamese Arabica with exceptional cup quality and unique flavor notes',
      grade: 'Specialty',
      origin: 'Da Lat Highlands',
      processingMethod: 'Washed',
      features: [
        'Altitude: 1,200-1,500m',
        'Cupping score: 85+',
        'Single origin',
      ],
      specifications: {
        moisture: '≤ 12%',
        screenSize: '15+ (85% min)',
        defectRate: '≤ 3%',
        cuppingScore: 85,
      },
      badge: { text: 'Specialty Grade', variant: 'specialty' },
    },
    {
      id: 'custom-blend',
      name: 'Custom Blend Solutions',
      description:
        'Tailored coffee blends designed to meet your specific requirements and taste preferences',
      grade: 'Custom',
      origin: 'Multi-Origin',
      processingMethod: 'Various',
      features: [
        'Customizable ratios',
        'Consistent quality',
        'Scalable production',
      ],
      specifications: {
        moisture: 'As specified',
        screenSize: 'As specified',
        defectRate: 'As specified',
      },
      badge: { text: 'Custom Solutions', variant: 'custom' },
    },
  ];

  const nextProduct = () => {
    setCurrentIndex(prev => (prev + 1) % featuredProducts.length);
  };

  const prevProduct = () => {
    setCurrentIndex(
      prev => (prev - 1 + featuredProducts.length) % featuredProducts.length
    );
  };

  return (
    <motion.section
      ref={ref}
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-emerald-900 py-24"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(251, 191, 36, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%)
          `,
        }}
      />

      {/* Floating Coffee Bean */}
      <motion.div
        className="absolute right-10 top-20 text-6xl opacity-10"
        animate={{
          y: [-20, 20, -20],
          rotate: [0, 360],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
      />

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="mb-20 text-center">
            <div className="hover:shadow-emerald-medium mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3 shadow-emerald-soft backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/30">
              <Coffee className="h-5 w-5 text-emerald-400" />
              <span className="font-medium text-emerald-100">
                Premium Vietnamese Origins
              </span>
            </div>

            <StaggeredChildren staggerDelay={0.1}>
              <h2 className="mb-6 text-4xl font-bold text-white transition-all duration-300 hover:scale-105 md:text-5xl lg:text-6xl">
                <span className="text-white">Featured Coffee</span>
                <span className="block bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-white transition-all duration-300 hover:text-forest-50">
                Discover our range of premium Vietnamese coffee beans, sourced
                directly from the finest growing regions
              </p>
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        {/* Products Carousel */}
        <motion.div className="relative" variants={itemVariants}>
          {/* Navigation Buttons */}
          <ScrollReveal direction="left" delay={0.8} duration={0.5}>
            <button
              onClick={prevProduct}
              aria-label="Previous product"
              className="shadow-emerald-medium hover:shadow-gold-strong absolute left-0 top-1/2 z-20 -translate-x-4 -translate-y-1/2 rounded-full bg-emerald-800/80 p-3 text-gold-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-emerald-700/90"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.8} duration={0.5}>
            <button
              onClick={nextProduct}
              aria-label="Next product"
              className="shadow-emerald-medium hover:shadow-gold-strong absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 rounded-full bg-emerald-800/80 p-3 text-gold-400 backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-emerald-700/90"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </ScrollReveal>

          {/* Products Grid */}
          <StaggeredChildren staggerDelay={0.2}>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {featuredProducts.map((product, index) => {
                const isActive = index === currentIndex;
                const isVisible =
                  Math.abs(index - currentIndex) <= 1 ||
                  featuredProducts.length <= 3;

                return (
                  <ScrollReveal
                    key={product.id}
                    direction="up"
                    delay={index * 0.1}
                    duration={0.6}
                  >
                    <div
                      className={`group relative overflow-hidden rounded-lg border border-forest-600/30 bg-forest-800/50 shadow-forest-medium backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${
                        isActive
                          ? 'shadow-gold-strong scale-105 border-gold-400/50 bg-forest-700/60'
                          : 'hover:shadow-gold-strong hover:border-gold-400/50 hover:bg-forest-700/60'
                      } ${isVisible ? 'opacity-100' : 'opacity-50'}`}
                      data-testid="product-card"
                    >
                      {/* Popular Badge - positioned at top left */}
                      {product.isPopular && (
                        <motion.div
                          className="absolute left-2 top-2 z-10 rounded-full bg-forest-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Star className="mr-1 inline h-3 w-3 fill-current" />
                          Popular
                        </motion.div>
                      )}

                      {/* Product Badge - positioned at top right */}
                      <Badge
                        variant={
                          product.badge.variant === 'premium'
                            ? 'secondary'
                            : product.badge.variant === 'specialty'
                              ? 'outline'
                              : 'secondary'
                        }
                        className="absolute right-2 top-2 z-10"
                      >
                        {product.badge.text}
                      </Badge>

                      <div className="p-6">
                        {/* Product Header */}
                        <div className="mb-4">
                          <h3 className="mb-2 text-xl font-bold text-forest-50 transition-colors group-hover:text-gold-300">
                            {product.name}
                          </h3>
                          <p className="text-forest-200 group-hover:text-forest-100">
                            {product.description}
                          </p>
                        </div>

                        {/* Product Details */}
                        <div className="mb-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-forest-300">Grade:</span>
                            <span className="font-medium text-forest-100">
                              {product.grade}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-forest-300">Origin:</span>
                            <span className="font-medium text-forest-100">
                              {product.origin}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-forest-300">Processing:</span>
                            <span className="font-medium text-forest-100">
                              {product.processingMethod}
                            </span>
                          </div>
                        </div>

                        {/* Features */}
                        <div className="mb-4">
                          <h4 className="mb-2 text-sm font-semibold text-forest-200">
                            Key Features:
                          </h4>
                          <ul className="space-y-1">
                            {product.features.map((feature, featureIndex) => (
                              <li
                                key={`${feature}-${featureIndex}`}
                                className="flex items-center text-xs text-forest-300"
                              >
                                <div className="mr-2 h-1 w-1 rounded-full bg-emerald-400" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Specifications */}
                        <div className="mb-4 rounded-lg bg-forest-900/50 p-3">
                          <h4 className="mb-2 text-sm font-semibold text-forest-200">
                            Specifications:
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-forest-400">Moisture:</span>
                              <div className="font-medium text-forest-200">
                                {product.specifications.moisture}
                              </div>
                            </div>
                            <div>
                              <span className="text-forest-400">Screen:</span>
                              <div className="font-medium text-forest-200">
                                {product.specifications.screenSize}
                              </div>
                            </div>
                            <div>
                              <span className="text-forest-400">Defects:</span>
                              <div className="font-medium text-forest-200">
                                {product.specifications.defectRate}
                              </div>
                            </div>
                          </div>

                          {/* Cupping Score */}
                          {product.specifications.cuppingScore && (
                            <motion.div
                              className="mt-2 flex items-center gap-1 text-xs"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <Star className="h-4 w-4 fill-current text-gold-400" />
                              <span className="text-gold-300">
                                Cupping Score:
                              </span>
                              <span className="font-bold text-gold-400">
                                {product.specifications.cuppingScore}+
                              </span>
                            </motion.div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <div className="flex-1">
                              <EnhancedButton
                                asChild
                                variant="primary"
                                size="md"
                                className="w-full"
                              >
                                <Link
                                  href={`/${locale}/products/${product.id}`}
                                >
                                  <ArrowRight className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                              </EnhancedButton>
                            </div>
                            <EnhancedButton
                              variant="outline"
                              size="md"
                              className="border-coffee-500 text-coffee-200 hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-200"
                              aria-label="Download product specification"
                            >
                              <Download className="h-4 w-4" />
                            </EnhancedButton>
                          </div>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </StaggeredChildren>

          {/* Carousel Indicators */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-8 flex justify-center gap-2">
              {featuredProducts.map((product, index) => (
                <button
                  key={`indicator-${product.id}`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to product ${index + 1}: ${product.name}`}
                  className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                    index === currentIndex
                      ? 'w-8 bg-forest-600 shadow-forest-medium'
                      : 'w-2 bg-forest-300 hover:bg-forest-400'
                  }`}
                />
              ))}
            </div>
          </ScrollReveal>
        </motion.div>

        {/* CTA Section */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-16 text-center">
            <EnhancedButton
              asChild
              variant="primary"
              size="lg"
              className="px-10 py-4 text-lg font-semibold"
            >
              <Link href={`/${locale}/products`}>
                View All Products
                <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
              </Link>
            </EnhancedButton>
          </div>
        </ScrollReveal>
      </div>
    </motion.section>
  );
}
