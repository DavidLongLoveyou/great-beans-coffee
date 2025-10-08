'use client';

import {
  Coffee,
  ArrowRight,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  Download,
} from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { ServerButton } from '@/presentation/components/ui/server-button';
import { 
  ScrollReveal, 
  StaggeredChildren, 
  MagneticHover,
  FloatingElement 
} from '@/presentation/components/ui/ScrollAnimations';
import { EnhancedButton } from '@/presentation/components/ui/EnhancedButton';

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
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, delay: 0.2 },
  },
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 },
  },
};

export function FeaturedProductsSection({
  locale,
}: FeaturedProductsSectionProps) {
  const t = useTranslations('homepage');
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
        'Cupping score 80+',
        'Grown at 1,200m+ altitude',
        'Washed processing method',
      ],
      specifications: {
        moisture: '≤ 11%',
        screenSize: '15+ (85% min)',
        defectRate: '≤ 3%',
        cuppingScore: 82,
      },
      badge: { text: 'Specialty Arabica', variant: 'specialty' },
    },
    {
      id: 'custom-blends',
      name: 'Private Label Solutions',
      description:
        'Custom coffee blends and comprehensive private labeling services for your brand',
      grade: 'Custom',
      origin: 'Multi-Origin',
      processingMethod: 'Various',
      features: [
        'Custom blend development',
        'Private label packaging',
        'Brand consultation services',
      ],
      specifications: {
        moisture: 'As specified',
        screenSize: 'As specified',
        defectRate: 'As specified',
      },
      badge: { text: 'Custom Blends', variant: 'custom' },
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

  const getBadgeStyles = (variant: string) => {
    switch (variant) {
      case 'premium':
        return 'border-gold-500/50 bg-gold-600/80 text-gold-100 shadow-gold-soft';
      case 'specialty':
        return 'border-coffee-500/50 bg-coffee-600/80 text-coffee-100 shadow-coffee-soft';
      case 'custom':
        return 'border-gold-500/50 bg-gold-600/80 text-gold-100 shadow-gold-soft';
      default:
        return 'border-gold-500/50 bg-gold-600/80 text-gold-100 shadow-gold-soft';
    }
  };

  return (
    <motion.section
      ref={ref}
      data-testid="featured-products"
      className="relative overflow-hidden bg-gradient-to-br from-coffee-900 via-coffee-800 to-coffee-900 py-24"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-sage-900/95 via-sage-800/90 to-sage-900/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />
      <motion.div
        className="absolute inset-0 opacity-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        <motion.div
          className="absolute left-1/4 top-1/4 h-40 w-40 rounded-full bg-gold-400 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-32 w-32 rounded-full bg-coffee-400 blur-2xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 1,
          }}
        />
      </motion.div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="mb-20 text-center">
            <MagneticHover strength={0.1}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/20 px-6 py-3 shadow-emerald-soft backdrop-blur-sm transition-all duration-300 hover:border-emerald-400/50 hover:bg-emerald-500/30 hover:shadow-emerald-medium">
                <FloatingElement>
                  <Coffee className="h-5 w-5 text-emerald-400" />
                </FloatingElement>
                <span className="font-medium text-emerald-100">
                  Premium Vietnamese Origins
                </span>
              </div>
            </MagneticHover>

            <StaggeredChildren staggerDelay={0.1}>
              <h2 className="mb-6 bg-gradient-to-r from-forest-900 via-emerald-800 to-forest-900 bg-clip-text text-4xl font-bold text-transparent transition-all duration-300 hover:scale-105 md:text-5xl lg:text-6xl">
                Featured Coffee
                <span className="block bg-gradient-to-r from-gold-400 to-gold-600 bg-clip-text text-transparent">
                  Products
                </span>
              </h2>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-coffee-100 transition-all duration-300 hover:text-coffee-50">
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
            <MagneticHover strength={0.2}>
              <button
                onClick={prevProduct}
                className="absolute left-0 top-1/2 z-20 -translate-x-4 -translate-y-1/2 rounded-full bg-emerald-800/80 p-3 text-gold-400 shadow-emerald-medium backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-emerald-700/90 hover:shadow-gold-strong"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </MagneticHover>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.8} duration={0.5}>
            <MagneticHover strength={0.2}>
              <button
                onClick={nextProduct}
                className="absolute right-0 top-1/2 z-20 -translate-y-1/2 translate-x-4 rounded-full bg-emerald-800/80 p-3 text-gold-400 shadow-emerald-medium backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-emerald-700/90 hover:shadow-gold-strong"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </MagneticHover>
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
                  <ScrollReveal direction="up" delay={index * 0.1} duration={0.6}>
                    <MagneticHover strength={0.05}>
                      <div
                        key={product.id}
                        className={`group relative overflow-hidden rounded-lg border border-forest-600/30 bg-forest-800/50 shadow-forest-medium backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 ${
                          isActive
                            ? 'shadow-gold-strong scale-105 border-gold-400/50 bg-forest-700/60'
                            : 'hover:shadow-gold-strong hover:border-gold-400/50 hover:bg-forest-700/60'
                        } ${isVisible ? 'opacity-100' : 'opacity-50'}`}
                        data-testid="product-card"
                      >
                  {/* Popular Badge */}
                  {product.isPopular && (
                    <motion.div
                      className="absolute left-4 top-4 z-10 rounded-full bg-forest-600/90 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm"
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Badge className="border-gold-400/50 bg-gold-500/80 text-gold-100 shadow-gold-soft">
                        <Star className="mr-1 h-3 w-3 fill-current" />
                        Popular
                      </Badge>
                    </motion.div>
                  )}

                  <div className="p-6 pb-4">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <Badge
                        className={`w-fit border shadow-sm ${getBadgeStyles(product.badge.variant)}`}
                      >
                        {product.badge.text}
                      </Badge>
                    </motion.div>

                    <motion.h3
                      className="mt-4 text-xl font-bold text-white transition-colors group-hover:text-gold-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      {t(`products.${product.key}.name`)}
                    </motion.h3>

                    <motion.p
                      className="mt-2 leading-relaxed text-coffee-200"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      {t(`products.${product.key}.description`)}
                    </motion.p>
                  </div>

                  <div className="space-y-6 px-6">
                    {/* Key Features */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <h4 className="text-sm font-semibold text-gold-300">
                        Key Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {product.features.map((feature, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                              duration: 0.3,
                              delay: 0.5 + index * 0.1,
                            }}
                            whileHover={{ scale: 1.05 }}
                          >
                            <Badge
                              variant="outline"
                              className="border-coffee-500 bg-coffee-700/50 text-coffee-100 hover:border-gold-400/50 hover:bg-gold-500/20"
                            >
                              {feature}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Specifications */}
                    <motion.div
                      className="space-y-3"
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.6 }}
                    >
                      <h4 className="text-sm font-semibold text-gold-300">
                        Specifications
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <motion.div
                          className="text-coffee-200"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                          whileHover={{ x: 5 }}
                        >
                          <span className="text-coffee-300">Grade:</span>
                          <span className="ml-2 font-medium text-gold-400">
                            {product.grade}
                          </span>
                        </motion.div>
                        <motion.div
                          className="text-coffee-200"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                          whileHover={{ x: -5 }}
                        >
                          <span className="text-coffee-300">Origin:</span>
                          <span className="ml-2 font-medium text-gold-400">
                            {product.origin}
                          </span>
                        </motion.div>
                        <motion.div
                          className="text-coffee-200"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.9 }}
                          whileHover={{ x: 5 }}
                        >
                          <span className="text-coffee-300">Processing:</span>
                          <span className="ml-2 font-medium text-gold-400">
                            {product.processingMethod}
                          </span>
                        </motion.div>
                        <motion.div
                          className="text-coffee-200"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.0 }}
                          whileHover={{ x: -5 }}
                        >
                          <span className="text-coffee-300">Moisture:</span>
                          <span className="ml-2 font-medium text-gold-400">
                            {product.specifications.moisture}
                          </span>
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Cupping Score */}
                    {product.specifications.cuppingScore && (
                      <motion.div
                        className="rounded-lg border border-gold-400/30 bg-gold-500/10 p-3"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-2 text-sm">
                          <Star className="h-4 w-4 fill-current text-gold-400" />
                          <span className="text-gold-300">
                            Cupping Score:
                          </span>
                          <span className="font-bold text-gold-400">
                            {product.specifications.cuppingScore}+
                          </span>
                        </div>
                      </motion.div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <div className="flex-1">
                        <EnhancedButton
                          asChild
                          variant="forest"
                          size="md"
                          className="w-full"
                        >
                          <Link href={`/${locale}/products/${product.id}`}>
                            <ArrowRight className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </EnhancedButton>
                      </div>
                      <EnhancedButton
                        variant="outline"
                        size="icon"
                        className="border-coffee-500 text-coffee-200 hover:border-gold-400 hover:bg-gold-500/20 hover:text-gold-200"
                      >
                        <Download className="h-4 w-4" />
                      </EnhancedButton>
                    </div>
                  </div>
                       </div>
                     </MagneticHover>
                   </ScrollReveal>
                 );
               })}
             </div>
           </StaggeredChildren>

          {/* Carousel Indicators */}
          <ScrollReveal direction="up" delay={0.3}>
            <div className="mt-8 flex justify-center gap-2">
              {featuredProducts.map((_, index) => (
                <MagneticHover key={index} strength={0.1}>
                  <button
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 hover:scale-125 ${
                      index === currentIndex
                        ? 'w-8 bg-forest-600 shadow-forest-medium'
                        : 'w-2 bg-forest-300 hover:bg-forest-400'
                    }`}
                  />
                </MagneticHover>
              ))}
            </div>
          </ScrollReveal>
        </motion.div>

        {/* CTA Section */}
        <ScrollReveal direction="up" delay={0.4}>
          <div className="mt-16 text-center">
            <EnhancedButton
              asChild
              variant="forest"
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
