'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  BarChart3,
  Globe,
  Coffee,
} from '@/components/ui/icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';

interface MarketInsight {
  id: string;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'stable';
  value: string;
  change: string;
  category:
    | 'price'
    | 'volume'
    | 'market'
    | 'production'
    | 'export'
    | 'demand'
    | 'supply';
  date: string;
  icon: React.ComponentType<any>;
}

const marketInsights: MarketInsight[] = [
  {
    id: '1',
    title: 'Robusta Coffee Prices',
    description: 'Strong demand from European markets driving price increases',
    trend: 'up',
    value: '$2,450/MT',
    change: '+12.5%',
    category: 'price',
    date: '2024-01-15',
    icon: TrendingUp,
  },
  {
    id: '2',
    title: 'Global Export Volume',
    description: 'Vietnam coffee exports reach record high this quarter',
    trend: 'up',
    value: '1.2M MT',
    change: '+8.3%',
    category: 'export',
    date: '2024-01-14',
    icon: Globe,
  },
  {
    id: '3',
    title: 'Arabica Demand',
    description: 'Specialty coffee segment showing sustained growth',
    trend: 'up',
    value: '85,000 MT',
    change: '+15.2%',
    category: 'demand',
    date: '2024-01-13',
    icon: Coffee,
  },
  {
    id: '4',
    title: 'Market Analysis',
    description: 'Q1 outlook remains positive with strong fundamentals',
    trend: 'stable',
    value: '98.5',
    change: '+2.1%',
    category: 'supply',
    date: '2024-01-12',
    icon: BarChart3,
  },
];

export function MarketInsightsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoPlaying && marketInsights && marketInsights.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % marketInsights.length);
      }, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying, marketInsights.length]);

  const nextSlide = () => {
    if (marketInsights && marketInsights.length > 0) {
      setCurrentIndex(prev => (prev + 1) % marketInsights.length);
    }
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    if (marketInsights && marketInsights.length > 0) {
      setCurrentIndex(
        prev => (prev - 1 + marketInsights.length) % marketInsights.length
      );
    }
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600 bg-emerald-50';
      case 'down':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-blue-600 bg-blue-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'price':
        return 'bg-gold-100 text-gold-800';
      case 'demand':
        return 'bg-emerald-100 text-emerald-800';
      case 'supply':
        return 'bg-blue-100 text-blue-800';
      case 'export':
        return 'bg-forest-100 text-forest-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-gradient-to-br from-sage-50 via-white to-forest-50 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100/50 px-6 py-3 backdrop-blur-sm">
            <BarChart3 className="h-5 w-5 text-forest-600" />
            <span className="font-medium text-forest-700">
              Market Intelligence
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-forest-900 md:text-5xl">
            Market Insights
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-forest-600">
            Stay informed with real-time market data and trends in the global
            coffee industry
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="w-full"
              >
                <Card className="border-0 bg-gradient-to-br from-white to-forest-50/30 shadow-xl">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-full bg-gradient-to-br from-forest-100 to-gold-100 p-3">
                          {marketInsights[currentIndex]?.icon &&
                            React.createElement(
                              marketInsights[currentIndex].icon,
                              {
                                className: 'h-8 w-8 text-forest-600',
                              }
                            )}
                        </div>
                        <div>
                          <CardTitle className="text-2xl text-forest-900">
                            {marketInsights[currentIndex]?.title}
                          </CardTitle>
                          <p className="text-forest-600">
                            {marketInsights[currentIndex]?.date}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={getCategoryColor(
                          marketInsights[currentIndex]?.category || 'market'
                        )}
                      >
                        {marketInsights[currentIndex]?.category?.toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-4 text-lg leading-relaxed text-forest-700">
                          {marketInsights[currentIndex]?.description}
                        </p>
                        <div className="flex items-center gap-4">
                          <div className="text-3xl font-bold text-forest-900">
                            {marketInsights[currentIndex]?.value}
                          </div>
                          <div
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${getTrendColor(marketInsights[currentIndex]?.trend || 'stable')}`}
                          >
                            {marketInsights[currentIndex]?.change}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-center">
                        <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-forest-200 to-gold-200">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-forest-900">
                              {marketInsights[currentIndex]?.trend === 'up'
                                ? '↗'
                                : marketInsights[currentIndex]?.trend === 'down'
                                  ? '↘'
                                  : '→'}
                            </div>
                            <div className="text-sm capitalize text-forest-700">
                              {marketInsights[currentIndex]?.trend}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <ChevronLeft className="h-6 w-6 text-forest-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <ChevronRight className="h-6 w-6 text-forest-700" />
          </button>
        </div>

        {/* Slide Indicators */}
        <div className="mt-6 flex justify-center gap-2">
          {marketInsights.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-3 w-3 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? 'scale-125 bg-forest-600'
                  : 'bg-forest-200 hover:bg-forest-400'
              }`}
            />
          ))}
        </div>

        {/* Auto-play indicator */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`rounded-full px-4 py-2 text-sm transition-all duration-200 ${
              isAutoPlaying
                ? 'bg-forest-100 text-forest-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {isAutoPlaying ? 'Auto-playing' : 'Paused'}
          </button>
        </div>
      </div>
    </section>
  );
}
