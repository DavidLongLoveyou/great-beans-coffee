'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  TrendingUp,
  Coffee,
  BarChart3,
  Globe,
  Calendar,
  User,
  ArrowRight,
  Clock,
} from '@/components/ui/icons';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';

interface Article {
  id: string;
  title: string;
  description: string;
  type: 'blog' | 'market-report';
  slug: string;
  author: string;
  publishedAt: string;
  readingTime: string;
  category: string;
  coverImage: string;
  featured: boolean;
}

interface MarketInsight {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Sample articles data - in real app, this would come from CMS
const sampleArticles: Article[] = [
  {
    id: '1',
    title: 'Sustainable Coffee Sourcing in Vietnam',
    description:
      'Exploring sustainable practices in Vietnamese coffee farms and their impact on global supply chains.',
    type: 'blog',
    slug: 'sustainable-coffee-sourcing-vietnam',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-01-15',
    readingTime: '8 min',
    category: 'Sustainability',
    coverImage: '/images/blog/sustainable-coffee-sourcing-vietnam.svg',
    featured: true,
  },
  {
    id: '2',
    title: 'Global Coffee Market Trends 2024',
    description:
      'Comprehensive analysis of global coffee market trends, pricing, and demand patterns for 2024.',
    type: 'market-report',
    slug: 'global-coffee-market-trends-2024',
    author: 'Maria Rodriguez',
    publishedAt: '2024-01-12',
    readingTime: '12 min',
    category: 'Market Analysis',
    coverImage: '/images/market-reports/global-coffee-trends-2024.svg',
    featured: true,
  },
  {
    id: '3',
    title: 'Vietnam Coffee Export Trends 2024',
    description:
      'Latest insights into Vietnam coffee export performance and market opportunities.',
    type: 'blog',
    slug: 'vietnam-coffee-export-trends-2024',
    author: 'Dr. Pham Minh Duc',
    publishedAt: '2024-01-10',
    readingTime: '6 min',
    category: 'Market Analysis',
    coverImage: '/images/blog/vietnam-coffee-export-2024.svg',
    featured: true,
  },
  {
    id: '4',
    title: 'Coffee Processing Methods Guide',
    description:
      'Understanding different coffee processing methods and their impact on flavor profiles.',
    type: 'blog',
    slug: 'coffee-processing-methods-2024',
    author: 'Elena Rodriguez',
    publishedAt: '2024-01-08',
    readingTime: '10 min',
    category: 'Industry Insights',
    coverImage: '/images/blog/coffee-processing-methods-2024.svg',
    featured: false,
  },
];

// Minimized market insights data
const marketInsights: MarketInsight[] = [
  {
    id: '1',
    title: 'Robusta Prices',
    value: '$2,450/MT',
    change: '+12.5%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    id: '2',
    title: 'Export Volume',
    value: '1.2M MT',
    change: '+8.3%',
    trend: 'up',
    icon: Globe,
  },
  {
    id: '3',
    title: 'Arabica Demand',
    value: '85K MT',
    change: '+15.2%',
    trend: 'up',
    icon: Coffee,
  },
];

export function ArticlesCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [marketInsightIndex, setMarketInsightIndex] = useState(0);

  // Auto-play for main articles
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isAutoPlaying && sampleArticles.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % sampleArticles.length);
      }, 6000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoPlaying]);

  // Auto-play for market insights
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketInsightIndex(prev => (prev + 1) % marketInsights.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % sampleArticles.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentIndex(
      prev => (prev - 1 + sampleArticles.length) % sampleArticles.length
    );
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const getTypeColor = (type: string) => {
    return type === 'blog'
      ? 'bg-emerald-100 text-emerald-800'
      : 'bg-gold-100 text-gold-800';
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up':
        return 'text-emerald-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const currentArticle = sampleArticles[currentIndex];
  const currentInsight = marketInsights[marketInsightIndex];

  return (
    <section className="bg-gradient-to-br from-sage-50 via-white to-forest-50 py-16">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-100/50 px-6 py-3 backdrop-blur-sm">
            <BookOpen className="h-5 w-5 text-forest-600" />
            <span className="font-medium text-forest-700">
              Latest Articles & Insights
            </span>
          </div>
          <h2 className="mb-4 text-4xl font-bold text-forest-900 md:text-5xl">
            Industry Knowledge Hub
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-forest-600">
            Stay informed with our latest blog posts, market reports, and
            real-time industry insights
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Main Articles Carousel */}
          <div className="lg:col-span-3">
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
                      <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Article Image */}
                        <div className="relative h-64 md:h-full">
                          <Image
                            src={
                              currentArticle?.coverImage ||
                              '/images/placeholder.jpg'
                            }
                            alt={currentArticle?.title || 'Article cover'}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          <Badge
                            className={`absolute left-4 top-4 ${getTypeColor(currentArticle?.type || 'blog')}`}
                          >
                            {currentArticle?.type === 'blog'
                              ? 'Blog'
                              : 'Market Report'}
                          </Badge>
                        </div>

                        {/* Article Content */}
                        <div className="p-8">
                          <CardHeader className="p-0">
                            <div className="mb-4 flex items-center gap-4 text-sm text-forest-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(
                                  currentArticle?.publishedAt || ''
                                ).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {currentArticle?.readingTime}
                              </div>
                            </div>
                            <CardTitle className="mb-4 text-2xl text-forest-900 lg:text-3xl">
                              {currentArticle?.title}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <p className="mb-6 text-lg leading-relaxed text-forest-700">
                              {currentArticle?.description}
                            </p>
                            <div className="mb-6 flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-forest-500" />
                                <span className="text-sm font-medium text-forest-600">
                                  {currentArticle?.author}
                                </span>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {currentArticle?.category}
                              </Badge>
                            </div>
                            <Link
                              href={`/${currentArticle?.type}/${currentArticle?.slug}`}
                              className="group inline-flex items-center gap-2 rounded-lg bg-forest-600 px-6 py-3 text-white transition-all duration-300 hover:bg-forest-700 hover:shadow-lg"
                            >
                              Read More
                              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                          </CardContent>
                        </div>
                      </div>
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

              {/* Slide Indicators */}
              <div className="mt-6 flex justify-center gap-2">
                {sampleArticles.map((article, index) => (
                  <button
                    key={article.id}
                    onClick={() => goToSlide(index)}
                    className={`h-3 w-3 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'scale-125 bg-forest-600'
                        : 'bg-forest-200 hover:bg-forest-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Market Insights Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="border-0 bg-gradient-to-br from-white to-gold-50/30 shadow-lg">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-gold-600" />
                    <CardTitle className="text-lg text-forest-900">
                      Market Pulse
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={marketInsightIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="text-center"
                    >
                      <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-gradient-to-br from-gold-100 to-forest-100 p-3">
                          {currentInsight?.icon &&
                            React.createElement(currentInsight.icon, {
                              className: 'h-6 w-6 text-forest-600',
                            })}
                        </div>
                      </div>
                      <h3 className="mb-2 font-semibold text-forest-900">
                        {currentInsight?.title}
                      </h3>
                      <div className="mb-2 text-2xl font-bold text-forest-900">
                        {currentInsight?.value}
                      </div>
                      <div
                        className={`text-sm font-semibold ${getTrendColor(currentInsight?.trend || 'stable')}`}
                      >
                        {currentInsight?.change}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Market Insights Indicators */}
                  <div className="mt-4 flex justify-center gap-1">
                    {marketInsights.map((insight, index) => (
                      <div
                        key={insight.id}
                        className={`h-1.5 w-1.5 rounded-full transition-all duration-200 ${
                          index === marketInsightIndex
                            ? 'bg-gold-600'
                            : 'bg-gold-200'
                        }`}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* View All Articles Button */}
              <div className="mt-6">
                <Link href="/blog" className="block">
                  <Button
                    variant="outline"
                    className="w-full border-forest-200 text-forest-700 hover:bg-forest-50"
                  >
                    View All Articles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Auto-play indicator */}
        <div className="mt-8 flex justify-center">
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
