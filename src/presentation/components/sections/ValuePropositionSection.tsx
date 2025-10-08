'use client';

import {
  Shield,
  Award,
  Globe,
  Truck,
  Coffee,
  CheckCircle,
  TrendingUp,
  Users,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

import { Badge } from '@/presentation/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { 
  ScrollReveal, 
  StaggeredChildren, 
  MagneticHover,
  FloatingElement 
} from '@/presentation/components/ui/ScrollAnimations';

interface ValuePropositionSectionProps {
  locale: string;
}

export function ValuePropositionSection({
  locale,
}: ValuePropositionSectionProps) {
  const t = useTranslations('homepage');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Animation variants
  const containerVariants = {
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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
    },
    visible: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
        delay: 0.3,
      },
    },
    hover: {
      scale: 1.1,
      rotate: 5,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const badgeVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: -20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const featureVariants = {
    hidden: {
      opacity: 0,
      x: -20,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1],
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
        'FOB/CIF/DDP Terms',
        'Full Documentation',
        'Customs Clearance',
        'Trade Finance Support',
        'Multi-Currency Billing',
      ],
      color: 'coffee',
    },
    {
      icon: Award,
      title: 'Premium Sourcing',
      description:
        "Direct partnerships with Vietnam's finest coffee farms ensuring traceability and sustainability",
      features: [
        'Direct Farm Partnerships',
        'Full Traceability',
        'Sustainable Sourcing',
        'Single Origin Options',
        'Micro-lot Selections',
        'Harvest Timing Control',
      ],
      color: 'gold',
    },
    {
      icon: TrendingUp,
      title: 'Industry Leadership',
      description:
        'Proven track record in international coffee export with extensive market expertise',
      features: [
        '500+ Active Partners',
        '15+ Years Experience',
        'Market Intelligence',
        'Price Risk Management',
        'Supply Chain Optimization',
        'Technical Support',
      ],
      color: 'coffee',
    },
  ];

  return (
    <motion.section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-white to-emerald-50 py-24"
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <motion.div
          className="absolute right-10 top-10 h-28 w-28 rounded-full bg-gold-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
          }}
        />
        <motion.div
          className="absolute bottom-10 left-10 h-36 w-36 rounded-full bg-coffee-400"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 1,
          }}
        />
        <motion.div
          className="absolute left-1/3 top-1/2 h-20 w-20 rounded-full bg-gold-300"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: [0.4, 0, 0.6, 1],
            delay: 0.5,
          }}
        />
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <ScrollReveal direction="up" delay={0.2} duration={0.8}>
          <div className="mb-20 text-center">
            <MagneticHover strength={0.1}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gradient-to-r from-gold-100 to-coffee-100 px-6 py-3 shadow-sm transition-all duration-300 hover:border-gold-300 hover:shadow-lg">
                <FloatingElement>
                  <Coffee className="h-5 w-5 text-coffee-600" />
                </FloatingElement>
                <span className="font-medium text-coffee-700">
                  Why Choose The Great Beans
                </span>
              </div>
            </MagneticHover>

            <StaggeredChildren staggerDelay={0.1}>
              <h2 className="mb-6 text-4xl font-bold leading-tight text-coffee-900 transition-all duration-300 hover:text-coffee-800 md:text-5xl">
                Your Trusted Partner for
                <span className="block bg-gradient-to-r from-gold-600 to-coffee-600 bg-clip-text text-transparent">
                  Premium Vietnamese Coffee
                </span>
              </h2>

              <p className="mx-auto max-w-4xl text-xl leading-relaxed text-coffee-600 transition-all duration-300 hover:text-coffee-700">
                We combine traditional Vietnamese coffee expertise with modern B2B
                solutions, delivering exceptional quality and service to
                international partners worldwide.
              </p>
            </StaggeredChildren>
          </div>
        </ScrollReveal>

        {/* Value Propositions Grid */}
        <StaggeredChildren staggerDelay={0.2}>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            const isCoffee = prop.color === 'coffee';

            return (
              <ScrollReveal direction="up" delay={index * 0.1} duration={0.6}>
                <MagneticHover strength={0.05}>
                  <div
                    className={`group relative overflow-hidden rounded-lg border-2 backdrop-blur-sm shadow-lg transition-all duration-300 ${
                      isCoffee
                        ? 'border-coffee-200 bg-gradient-to-br from-white/90 to-coffee-50/80 hover:border-coffee-300 hover:shadow-coffee-200/20 hover:-translate-y-2'
                        : 'border-gold-200 bg-gradient-to-br from-white/90 to-gold-50/80 hover:border-gold-300 hover:shadow-gold-200/20 hover:-translate-y-2'
                    }`}
                  >
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-10 ${
                    isCoffee
                      ? 'bg-gradient-to-br from-coffee-400 to-coffee-600'
                      : 'bg-gradient-to-br from-gold-400 to-gold-600'
                  }`}
                />

                <div className="relative px-6 pb-4 pt-6">
                  <FloatingElement>
                    <div
                      className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 ${
                        isCoffee
                          ? 'bg-gradient-to-br from-forest-100 to-forest-200 shadow-forest-soft'
                          : 'bg-gradient-to-br from-gold-100 to-gold-200 shadow-gold-soft'
                      }`}
                    >
                      <Icon
                        className={`h-10 w-10 transition-colors duration-300 ${isCoffee ? 'text-forest-600' : 'text-emerald-600'}`}
                      />
                    </div>
                  </FloatingElement>

                  <h3 className="text-center text-xl font-bold text-forest-800 transition-colors duration-300 group-hover:text-forest-900">
                    {prop.title}
                  </h3>
                </div>

                <div className="relative px-6 pb-6 text-center">
                  <p className="mb-6 leading-relaxed text-forest-600 transition-colors duration-300 group-hover:text-forest-700">
                    {prop.description}
                  </p>

                  {/* Features List */}
                  <div className="space-y-2">
                    {prop.features.map((feature, featureIndex) => (
                      <div
                        key={feature}
                        className="flex items-center justify-center gap-2 text-sm transition-all duration-300 hover:scale-105 hover:translate-x-1"
                      >
                        <CheckCircle
                          className={`h-4 w-4 flex-shrink-0 transition-colors duration-300 ${isCoffee ? 'text-coffee-500' : 'text-gold-500'}`}
                        />
                        <span className={`font-medium transition-colors duration-300 ${isCoffee ? 'text-coffee-700' : 'text-gold-700'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                  </div>
                </MagneticHover>
              </ScrollReveal>
            );
          })}
          </div>
        </StaggeredChildren>

        {/* Industry Certifications & Credentials */}
        <motion.div className="mt-20" variants={itemVariants}>
          <motion.div className="mb-12 text-center" variants={itemVariants}>
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-coffee-200 bg-coffee-100 px-6 py-3"
              variants={badgeVariants}
              whileHover="hover"
            >
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                }}
              >
                <Shield className="h-5 w-5 text-coffee-600" />
              </motion.div>
              <span className="font-medium text-coffee-700">
                Industry Certifications & Memberships
              </span>
            </motion.div>

            <motion.h3
              className="mb-6 text-3xl font-bold text-coffee-900"
              variants={itemVariants}
            >
              Certified Excellence in Coffee Export
            </motion.h3>
          </motion.div>

          {/* Certifications Grid */}
          <motion.div
            className="mb-16 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-6"
            variants={itemVariants}
          >
            {[
              { name: 'ISO 22000', desc: 'Food Safety Management' },
              { name: 'HACCP', desc: 'Hazard Analysis' },
              { name: 'Rainforest Alliance', desc: 'Sustainability' },
              { name: 'Fair Trade', desc: 'Ethical Sourcing' },
              { name: 'USDA Organic', desc: 'Organic Certification' },
              { name: 'UTZ Certified', desc: 'Sustainable Farming' },
              { name: 'SCA Member', desc: 'Specialty Coffee Assoc.' },
              { name: 'ICO Member', desc: 'International Coffee Org.' },
              { name: 'VICOFA', desc: 'Vietnam Coffee Assoc.' },
              { name: 'EU Organic', desc: 'European Organic' },
              { name: 'JAS Organic', desc: 'Japan Agricultural Standards' },
              { name: 'KOSHER', desc: 'Kosher Certification' },
            ].map((cert, index) => (
              <motion.div
                key={cert.name}
                className="group relative overflow-hidden rounded-lg border border-coffee-200 bg-white p-4 text-center shadow-sm transition-all duration-300 hover:border-coffee-300 hover:shadow-md"
                whileHover={{
                  y: -4,
                  scale: 1.02,
                  transition: { duration: 0.2 },
                }}
                animate={{
                  y: [0, -1, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: index * 0.1,
                }}
              >
                <motion.div
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-coffee-100 to-gold-100"
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                    delay: index * 0.2,
                  }}
                >
                  <Award className="h-6 w-6 text-coffee-600" />
                </motion.div>
                <h4 className="mb-1 text-sm font-bold text-coffee-800">
                  {cert.name}
                </h4>
                <p className="text-xs text-coffee-600">{cert.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div className="mt-20 text-center" variants={itemVariants}>
          <motion.div
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-gold-200 bg-gold-100 px-6 py-3"
            variants={badgeVariants}
            whileHover="hover"
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: [0.4, 0, 0.6, 1],
              }}
            >
              <Users className="h-5 w-5 text-gold-600" />
            </motion.div>
            <span className="font-medium text-gold-700">
              Trusted by Global Partners
            </span>
          </motion.div>

          {/* Industry Statistics */}
          <motion.div
            className="mb-12 grid grid-cols-2 gap-6 md:grid-cols-4"
            variants={itemVariants}
          >
            {[
              { number: '25+', label: 'Countries Served', icon: Globe },
              { number: '500+', label: 'B2B Partners', icon: Users },
              { number: '15+', label: 'Years Experience', icon: TrendingUp },
              { number: '99.8%', label: 'On-Time Delivery', icon: Truck },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                whileHover={{
                  scale: 1.05,
                  transition: { duration: 0.2 },
                }}
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: index * 0.2,
                }}
              >
                <motion.div
                  className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-coffee-100 to-gold-100"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                    delay: index * 0.3,
                  }}
                >
                  <stat.icon className="h-8 w-8 text-coffee-600" />
                </motion.div>
                <motion.div
                  className="mb-1 text-3xl font-bold text-coffee-900"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                    delay: index * 0.4,
                  }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-sm font-medium text-coffee-600">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Partner Types */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 opacity-70"
            variants={itemVariants}
          >
            {[
              { type: 'Roasters', desc: 'Specialty Coffee Roasters' },
              { type: 'Distributors', desc: 'Global Coffee Distributors' },
              { type: 'Importers', desc: 'International Importers' },
              { type: 'Retailers', desc: 'Premium Coffee Retailers' },
              { type: 'Brands', desc: 'Private Label Brands' },
            ].map((partner, i) => (
              <motion.div
                key={partner.type}
                className="flex h-20 w-36 flex-col items-center justify-center rounded-lg border border-coffee-200/50 bg-gradient-to-r from-coffee-100/30 to-gold-100/30 p-3 shadow-sm"
                whileHover={{
                  opacity: 0.9,
                  scale: 1.05,
                  y: -2,
                  transition: { duration: 0.2 },
                }}
                animate={{
                  y: [0, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: [0.4, 0, 0.6, 1],
                  delay: i * 0.2,
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: [0.4, 0, 0.6, 1],
                    delay: i * 0.3,
                  }}
                >
                  <Coffee className="mb-1 h-6 w-6 text-coffee-500" />
                </motion.div>
                <div className="text-center">
                  <div className="text-xs font-bold text-coffee-700">
                    {partner.type}
                  </div>
                  <div className="text-xs text-coffee-500">{partner.desc}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-coffee-500"
            variants={itemVariants}
          >
            Serving 500+ B2B partners across 25+ countries since 2018
          </motion.p>
        </motion.div>
      </div>
    </motion.section>
  );
}
