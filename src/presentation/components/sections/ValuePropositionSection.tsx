'use client';

import { motion, useInView, Variants } from 'framer-motion';
import {
  Shield,
  Award,
  Globe,
  Truck,
  Coffee,
  CheckCircle,
  TrendingUp,
  Users,
} from '@/components/ui/icons';
import { useRef } from 'react';

import {
  ScrollReveal,
  StaggeredChildren,
  FadeIn,
} from '@/presentation/components/ui/ScrollAnimations';

interface ValuePropositionSectionProps {
  locale: string;
}

export function ValuePropositionSection({
  locale: _locale,
}: ValuePropositionSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const valueProps = [
    {
      icon: Shield,
      title: 'Quality Certifications',
      description:
        'Multiple international certifications ensuring the highest quality standards for B2B partners',
      features: [
        'ISO 22000 Certified',
        'HACCP Compliant',
        'Rainforest Alliance',
        'UTZ Certified',
        'Fair Trade Verified',
        'USDA Organic',
      ],
      color: 'gold',
    },
    {
      icon: Globe,
      title: 'Global Trade Excellence',
      description:
        'Comprehensive international trade services with full regulatory compliance and documentation',
      features: [
        '25+ Export Markets',
        'Full Documentation',
        'Customs Clearance',
        'Trade Finance',
        'Logistics Support',
        'Risk Management',
      ],
      color: 'coffee',
    },
    {
      icon: Award,
      title: 'Premium Product Range',
      description:
        'Diverse portfolio of premium Vietnamese coffee varieties tailored for different market segments',
      features: [
        'Grade 1 Robusta',
        'Specialty Arabica',
        'Custom Blends',
        'Private Label',
        'Organic Options',
        'Sustainable Sourcing',
      ],
      color: 'gold',
    },
    {
      icon: Truck,
      title: 'Reliable Supply Chain',
      description:
        'End-to-end supply chain management ensuring consistent quality and timely delivery worldwide',
      features: [
        'Direct Farm Sourcing',
        'Quality Control',
        'Inventory Management',
        'Global Shipping',
        'Real-time Tracking',
        'Flexible Terms',
      ],
      color: 'forest',
    },
  ];

  const stats = [
    {
      icon: TrendingUp,
      value: '25+',
      label: 'Export Markets',
      description: 'Countries served worldwide',
    },
    {
      icon: Users,
      value: '500+',
      label: 'B2B Partners',
      description: 'Trusted business relationships',
    },
    {
      icon: Coffee,
      value: '10,000+',
      label: 'Tons Exported',
      description: 'Annual export capacity',
    },
    {
      icon: Award,
      value: '20+',
      label: 'Years Experience',
      description: 'In coffee export industry',
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-white to-forest-50 py-24"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-forest-300 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-gold-300 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="mb-20 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100/50 px-6 py-3 backdrop-blur-sm">
              <Coffee className="h-5 w-5 text-forest-600" />
              <span className="font-medium text-forest-700">
                Why Choose The Great Beans
              </span>
            </div>

            <StaggeredChildren staggerDelay={0.1}>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-forest-900 transition-all duration-300 hover:text-forest-800 md:text-5xl">
                Your Trusted Partner for
                <span className="block bg-gradient-to-r from-gold-600 to-forest-600 bg-clip-text text-transparent">
                  Premium Vietnamese Coffee
                </span>
              </h2>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-forest-600 transition-all duration-300 hover:text-forest-700">
                We combine traditional Vietnamese coffee expertise with modern
                B2B solutions, delivering exceptional quality and service to
                international partners worldwide.
              </p>
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        {/* Value Propositions Grid */}
        <StaggeredChildren staggerDelay={0.2}>
          <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((prop, index) => {
              const Icon = prop.icon;
              const isForest = prop.color === 'forest';

              return (
                <ScrollReveal
                  key={prop.title}
                  direction="up"
                  delay={index * 0.1}
                  duration={0.6}
                >
                  <div
                    className={`group relative overflow-hidden rounded-lg border-2 shadow-lg backdrop-blur-sm transition-all duration-300 ${
                      isForest
                        ? 'border-forest-200 bg-gradient-to-br from-white to-forest-50 hover:-translate-y-2 hover:border-forest-300 hover:shadow-forest-200/20'
                        : 'border-gold-200 bg-gradient-to-br from-white to-gold-50 hover:-translate-y-2 hover:border-gold-300 hover:shadow-gold-200/20'
                    }`}
                  >
                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${
                        isForest
                          ? 'bg-gradient-to-br from-forest-400 to-forest-600'
                          : 'bg-gradient-to-br from-gold-400 to-gold-600'
                      }`}
                    />

                    <div className="relative p-6">
                      <div
                        className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                          isForest
                            ? 'bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-soft'
                            : 'shadow-gold-soft bg-gradient-to-br from-gold-100 to-gold-200'
                        }`}
                      >
                        <Icon
                          className={`h-10 w-10 transition-colors duration-300 ${isForest ? 'text-forest-800' : 'text-emerald-600'}`}
                        />
                      </div>

                      <h3 className="mb-4 text-center text-xl font-bold text-forest-900 transition-colors duration-300 group-hover:text-forest-800">
                        {prop.title}
                      </h3>

                      <p className="mb-6 text-center leading-relaxed text-forest-700 transition-colors duration-300 group-hover:text-forest-800">
                        {prop.description}
                      </p>

                      {/* Features List */}
                      <div className="space-y-2">
                        {prop.features.map(feature => (
                          <div
                            key={feature}
                            className="flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:translate-x-1 hover:scale-105"
                          >
                            <CheckCircle
                              className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${isForest ? 'text-forest-500' : 'text-gold-500'}`}
                            />
                            <span
                              className={`font-medium transition-colors duration-300 ${isForest ? 'text-forest-700' : 'text-gold-700'}`}
                            >
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </StaggeredChildren>

        {/* Statistics Section */}
        <ScrollReveal direction="up" delay={0.4} duration={0.8}>
          <div className="rounded-2xl border border-forest-200 bg-gradient-to-r from-forest-50/80 to-gold-50/80 p-8 backdrop-blur-sm">
            <div className="mb-8 text-center">
              <h3 className="text-3xl font-bold text-forest-900">
                Trusted by Global Partners
              </h3>
              <p className="mt-2 text-forest-600">
                Our commitment to excellence speaks through our achievements
              </p>
            </div>

            <StaggeredChildren staggerDelay={0.1}>
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <FadeIn key={stat.label} delay={index * 0.1}>
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-forest-100 to-gold-100">
                          <Icon className="h-8 w-8 text-forest-600" />
                        </div>
                        <div className="text-3xl font-bold text-forest-900">
                          {stat.value}
                        </div>
                        <div className="text-lg font-semibold text-forest-700">
                          {stat.label}
                        </div>
                        <div className="text-sm text-forest-600">
                          {stat.description}
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
            </StaggeredChildren>
          </div>
        </ScrollReveal>
      </div>
    </motion.section>
  );
}
