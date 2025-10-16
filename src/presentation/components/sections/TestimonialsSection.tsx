'use client';

import {  Star, Quote, Building, MapPin, Users, Award, ArrowLeft, ArrowRight  } from '@/components/ui/dynamic-icons';
import { useInView } from 'framer-motion';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState, useRef } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/presentation/components/ui/card';
import { EnhancedButton } from '@/presentation/components/ui/EnhancedButton';
import {
  ScrollReveal,
  StaggeredChildren,
  MagneticHover,
  FloatingElement,
} from '@/presentation/components/ui/ScrollAnimations';

interface TestimonialsSectionProps {
  locale: string;
}

interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  location: string;
  rating: number;
  content: string;
  avatar: string;
  companyLogo: string;
  orderVolume: string;
  partnership: string;
  category: 'roaster' | 'distributor' | 'retailer' | 'manufacturer';
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Weber',
    position: 'Head of Sourcing',
    company: 'Alpine Coffee Roasters',
    location: 'Munich, Germany',
    rating: 5,
    content:
      'The Great Beans has been our trusted partner for premium Vietnamese Robusta for over 3 years. Their consistency in quality and reliability in delivery has helped us expand our European market significantly.',
    avatar: '/images/testimonials/marcus-weber.jpg',
    companyLogo: '/images/companies/alpine-coffee.svg',
    orderVolume: '50+ tons/year',
    partnership: '3+ years',
    category: 'roaster',
  },
  {
    id: '2',
    name: 'Yuki Tanaka',
    position: 'Procurement Director',
    company: 'Tokyo Coffee Trading Co.',
    location: 'Tokyo, Japan',
    rating: 5,
    content:
      'Exceptional quality control and transparent sourcing practices. The Great Beans understands the Japanese market requirements perfectly and delivers consistently high-grade Arabica beans.',
    avatar: '/images/testimonials/yuki-tanaka.jpg',
    companyLogo: '/images/companies/tokyo-coffee.svg',
    orderVolume: '80+ tons/year',
    partnership: '5+ years',
    category: 'distributor',
  },
  {
    id: '3',
    name: 'Sarah Mitchell',
    position: 'Supply Chain Manager',
    company: 'Global Beverage Solutions',
    location: 'New York, USA',
    rating: 5,
    content:
      "Their private label services and OEM capabilities are outstanding. We've successfully launched 3 coffee product lines with their support, and the market response has been phenomenal.",
    avatar: '/images/testimonials/sarah-mitchell.jpg',
    companyLogo: '/images/companies/global-beverage.svg',
    orderVolume: '120+ tons/year',
    partnership: '4+ years',
    category: 'manufacturer',
  },
  {
    id: '4',
    name: 'Pierre Dubois',
    position: 'CEO',
    company: 'Café Premium France',
    location: 'Lyon, France',
    rating: 5,
    content:
      'The Great Beans has revolutionized our coffee sourcing strategy. Their expertise in Vietnamese coffee varieties and commitment to sustainable practices align perfectly with our brand values.',
    avatar: '/images/testimonials/pierre-dubois.jpg',
    companyLogo: '/images/companies/cafe-premium.svg',
    orderVolume: '35+ tons/year',
    partnership: '2+ years',
    category: 'retailer',
  },
  {
    id: '5',
    name: 'Emma Thompson',
    position: 'Head of Coffee',
    company: 'British Coffee House',
    location: 'London, UK',
    rating: 5,
    content:
      'Outstanding customer service and technical support. Their team provides detailed cupping notes and processing recommendations that have elevated our coffee quality significantly.',
    avatar: '/images/testimonials/emma-thompson.jpg',
    companyLogo: '/images/companies/british-coffee.svg',
    orderVolume: '60+ tons/year',
    partnership: '3+ years',
    category: 'roaster',
  },
  {
    id: '6',
    name: 'Alessandro Rossi',
    position: 'Import Manager',
    company: 'Caffè Italia Imports',
    location: 'Milan, Italy',
    rating: 5,
    content:
      'Reliable logistics and competitive pricing. The Great Beans has helped us maintain consistent supply chains even during challenging market conditions. Highly recommended for European importers.',
    avatar: '/images/testimonials/alessandro-rossi.jpg',
    companyLogo: '/images/companies/caffe-italia.svg',
    orderVolume: '45+ tons/year',
    partnership: '4+ years',
    category: 'distributor',
  },
];

const categoryColors = {
  roaster: 'bg-amber-100 text-amber-800 border-amber-200',
  distributor: 'bg-blue-100 text-blue-800 border-blue-200',
  retailer: 'bg-green-100 text-green-800 border-green-200',
  manufacturer: 'bg-purple-100 text-purple-800 border-purple-200',
};

export function TestimonialsSection({}: TestimonialsSectionProps) {
  const t = useTranslations('testimonials');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const ref = useRef<HTMLElement>(null);
  useInView(ref, { once: true, margin: '-100px' });

  const filteredTestimonials =
    selectedCategory === 'all'
      ? testimonials
      : testimonials.filter(
          testimonial => testimonial.category === selectedCategory
        );

  const currentTestimonial =
    filteredTestimonials[currentIndex] || filteredTestimonials[0];

  const nextTestimonial = () => {
    setCurrentIndex(prev => (prev + 1) % filteredTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      prev =>
        (prev - 1 + filteredTestimonials.length) % filteredTestimonials.length
    );
  };

  const categories = [
    { key: 'all', label: t('categories.all'), count: testimonials.length },
    {
      key: 'roaster',
      label: t('categories.roaster'),
      count: testimonials.filter(t => t.category === 'roaster').length,
    },
    {
      key: 'distributor',
      label: t('categories.distributor'),
      count: testimonials.filter(t => t.category === 'distributor').length,
    },
    {
      key: 'manufacturer',
      label: t('categories.manufacturer'),
      count: testimonials.filter(t => t.category === 'manufacturer').length,
    },
    {
      key: 'retailer',
      label: t('categories.retailer'),
      count: testimonials.filter(t => t.category === 'retailer').length,
    },
  ];

  return (
    <section
      ref={ref}
      data-testid="testimonials"
      className="relative overflow-hidden bg-gradient-to-br from-forest-50 via-white to-emerald-50 py-24"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <FloatingElement frequency={8} amplitude={15}>
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-forest-300 blur-3xl"></div>
        </FloatingElement>
        <FloatingElement frequency={12} amplitude={20}>
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-emerald-300 blur-2xl"></div>
        </FloatingElement>
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <ScrollReveal direction="up" duration={0.8}>
          <div className="mb-16 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100/50 px-6 py-3">
              <Award className="h-5 w-5 text-forest-600" />
              <span className="font-medium text-forest-700">
                {t('trustBadge')}
              </span>
            </div>

            <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 md:text-5xl lg:text-6xl">
              {t('title')}
            </h2>

            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-forest-600">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Category Filter */}
        <ScrollReveal direction="up" delay={0.2} duration={0.6}>
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <StaggeredChildren staggerDelay={0.1} childDelay={0.1}>
              {categories.map(category => (
                <MagneticHover key={category.key} strength={0.3}>
                  <button
                    onClick={() => {
                      setSelectedCategory(category.key);
                      setCurrentIndex(0);
                    }}
                    className={`group relative overflow-hidden rounded-full border-2 px-6 py-3 font-medium transition-all duration-300 ${
                      selectedCategory === category.key
                        ? 'border-forest-500 bg-forest-500 text-white shadow-lg'
                        : 'border-forest-200 bg-white text-forest-700 hover:border-forest-300 hover:bg-forest-50'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {category.label}
                      <Badge
                        variant="secondary"
                        className={`text-xs ${
                          selectedCategory === category.key
                            ? 'bg-white/20 text-white'
                            : 'bg-forest-100 text-forest-600'
                        }`}
                      >
                        {category.count}
                      </Badge>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-forest-500 to-emerald-500 opacity-0 transition-opacity duration-300 group-hover:opacity-10"></div>
                  </button>
                </MagneticHover>
              ))}
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        {/* Main Testimonial Display */}
        <ScrollReveal direction="up" delay={0.4} duration={0.8}>
          <div className="mx-auto max-w-5xl">
            <Card className="relative overflow-hidden border-0 bg-white/80 shadow-2xl backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-forest-50/50 to-emerald-50/50"></div>

              <CardHeader className="relative z-10 pb-8">
                <div className="flex flex-col items-center gap-6 lg:flex-row lg:gap-12">
                  {/* Avatar and Company Info */}
                  <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
                    <MagneticHover strength={0.2}>
                      <div className="relative mb-4">
                        <div className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                          <Image
                            src={
                              currentTestimonial?.avatar ||
                              '/images/testimonials/placeholder.jpg'
                            }
                            alt={
                              currentTestimonial?.name || 'Testimonial avatar'
                            }
                            fill
                            className="object-cover transition-transform duration-300 hover:scale-110"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-500 p-2">
                          <Building className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    </MagneticHover>

                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-forest-900">
                        {currentTestimonial?.name}
                      </h3>
                      <p className="text-forest-600">
                        {currentTestimonial?.position}
                      </p>
                      <div className="flex items-center gap-2 text-forest-500">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">
                          {currentTestimonial?.company}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-forest-500">
                        <MapPin className="h-4 w-4" />
                        <span>{currentTestimonial?.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Stats */}
                  <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:gap-8">
                    <div className="flex-1 rounded-lg bg-gradient-to-br from-forest-100 to-emerald-100 p-6">
                      <div className="text-center">
                        <div className="mb-2 text-2xl font-bold text-forest-800">
                          {currentTestimonial?.orderVolume}
                        </div>
                        <div className="text-sm text-forest-600">
                          {t('stats.annualVolume')}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 rounded-lg bg-gradient-to-br from-emerald-100 to-forest-100 p-6">
                      <div className="text-center">
                        <div className="mb-2 text-2xl font-bold text-forest-800">
                          {currentTestimonial?.partnership}
                        </div>
                        <div className="text-sm text-forest-600">
                          {t('stats.partnership')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="relative z-10 pt-0">
                {/* Rating */}
                <div className="mb-6 flex justify-center">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => {
                      const starKey = `star-${currentTestimonial?.id || 'default'}-${i < (currentTestimonial?.rating || 0) ? 'filled' : 'empty'}-${i}`;
                      return (
                        <Star
                          key={starKey}
                          className={`h-6 w-6 ${
                            i < (currentTestimonial?.rating || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <Quote className="absolute -left-4 -top-4 h-12 w-12 text-forest-200" />
                  <blockquote className="relative text-center text-lg leading-relaxed text-forest-700 lg:text-xl">
                    &ldquo;{currentTestimonial?.content}&rdquo;
                  </blockquote>
                  <Quote className="absolute -bottom-4 -right-4 h-12 w-12 rotate-180 text-forest-200" />
                </div>

                {/* Category Badge */}
                <div className="mt-8 flex justify-center">
                  <Badge
                    className={`${categoryColors[currentTestimonial?.category || 'roaster']} border px-4 py-2 text-sm font-medium`}
                  >
                    {currentTestimonial?.category
                      ? t(`categories.${currentTestimonial?.category}`)
                      : t('categories.roaster')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollReveal>

        {/* Navigation Controls */}
        <ScrollReveal direction="up" delay={0.6} duration={0.6}>
          <div className="mt-12 flex items-center justify-center gap-6">
            <MagneticHover strength={0.4}>
              <EnhancedButton
                variant="outline"
                size="lg"
                onClick={prevTestimonial}
                disabled={filteredTestimonials.length <= 1}
                leftIcon={<ArrowLeft className="h-5 w-5" />}
                className="group border-forest-300 text-forest-700 hover:border-forest-500 hover:bg-forest-50"
              >
                {t('navigation.previous')}
              </EnhancedButton>
            </MagneticHover>

            {/* Pagination Dots */}
            <div className="flex gap-2">
              {filteredTestimonials.map((testimonial, index) => (
                <MagneticHover key={testimonial.id} strength={0.2}>
                  <button
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Go to testimonial ${index + 1}: ${testimonial.name} from ${testimonial.company}`}
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'scale-125 bg-forest-500'
                        : 'bg-forest-200 hover:bg-forest-300'
                    }`}
                  />
                </MagneticHover>
              ))}
            </div>

            <MagneticHover strength={0.4}>
              <EnhancedButton
                variant="outline"
                size="lg"
                onClick={nextTestimonial}
                disabled={filteredTestimonials.length <= 1}
                rightIcon={<ArrowRight className="h-5 w-5" />}
                className="group border-forest-300 text-forest-700 hover:border-forest-500 hover:bg-forest-50"
              >
                {t('navigation.next')}
              </EnhancedButton>
            </MagneticHover>
          </div>
        </ScrollReveal>

        {/* Trust Indicators */}
        <ScrollReveal direction="up" delay={0.8} duration={0.6}>
          <div className="mt-20 text-center">
            <div className="mb-8">
              <h3 className="mb-4 text-2xl font-bold text-forest-900">
                {t('trustIndicators.title')}
              </h3>
              <p className="text-forest-600">{t('trustIndicators.subtitle')}</p>
            </div>

            <StaggeredChildren staggerDelay={0.1} childDelay={0.2}>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
                {testimonials.slice(0, 6).map(testimonial => (
                  <MagneticHover key={testimonial.id} strength={0.2}>
                    <div className="group flex flex-col items-center gap-3 rounded-lg bg-white/50 p-6 transition-all duration-300 hover:bg-white hover:shadow-lg">
                      <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={testimonial.companyLogo}
                          alt={testimonial.company}
                          fill
                          className="object-contain opacity-60 transition-opacity duration-300 group-hover:opacity-100"
                        />
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-forest-800">
                          {testimonial.company}
                        </div>
                        <div className="text-xs text-forest-500">
                          {testimonial.location}
                        </div>
                      </div>
                    </div>
                  </MagneticHover>
                ))}
              </div>
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        {/* CTA Section */}
        <ScrollReveal direction="up" delay={1.0} duration={0.6}>
          <div className="mt-20 text-center">
            <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-forest-600 to-emerald-600 p-12 text-white">
              <h3 className="mb-4 text-3xl font-bold">{t('cta.title')}</h3>
              <p className="mb-8 text-xl text-forest-100">
                {t('cta.subtitle')}
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <MagneticHover strength={0.3}>
                  <EnhancedButton
                    variant="secondary"
                    size="lg"
                    className="bg-white text-forest-800 hover:bg-forest-50"
                    rightIcon={<Users className="h-5 w-5" />}
                  >
                    {t('cta.becomePartner')}
                  </EnhancedButton>
                </MagneticHover>

                <MagneticHover strength={0.3}>
                  <EnhancedButton
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-forest-800"
                  >
                    {t('cta.requestQuote')}
                  </EnhancedButton>
                </MagneticHover>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
