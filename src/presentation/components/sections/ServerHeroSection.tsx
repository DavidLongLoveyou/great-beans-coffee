'use client';

import { motion, Variants } from 'framer-motion';
import { Coffee, Globe, Award, ArrowRight, Play, Pause } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

import { ServerButton } from '@/presentation/components/ui/server-button';

interface ServerHeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaSecondaryText?: string;
  ctaHref?: string;
  ctaSecondaryHref?: string;
  videoSrc?: string;
  videoPoster?: string;
  showVideoControls?: boolean;
}

// Animation variants for staggered entrance
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

const floatingVariants: Variants = {
  animate: {
    y: [-10, 10, -10],
    rotate: [0, 5, -5, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

const coffeeBeamVariants: Variants = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export function ServerHeroSection({
  title,
  subtitle,
  ctaText = 'Request a Quote',
  ctaSecondaryText = 'Explore Products',
  ctaHref = '/quote',
  ctaSecondaryHref = '/products',
  videoSrc,
  videoPoster = '/images/hero-poster.jpg',
  showVideoControls = true,
}: ServerHeroSectionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle client-side mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (isMounted && video && videoSrc) {
      video.addEventListener('loadeddata', () => setIsVideoLoaded(true));
      video.addEventListener('ended', () => setIsPlaying(false));

      // Auto-play with error handling (client-side only)
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            // Auto-play was prevented, show play button
            setIsPlaying(false);
          });
      }
    }
  }, [videoSrc, isMounted]);

  const toggleVideo = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
        setIsPlaying(false);
      } else {
        video
          .play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(() => {
            setIsPlaying(false);
          });
      }
    }
  };

  return (
    <motion.section
      data-testid="hero-section"
      className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-forest-900 via-forest-800 to-forest-900"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Video Background */}
      {isMounted && videoSrc && (
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVideoLoaded ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            poster={videoPoster}
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {/* Video Controls */}
          {isMounted && videoSrc && showVideoControls && (
            <motion.button
              onClick={toggleVideo}
              className="absolute bottom-6 right-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/70"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.3 }}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="ml-0.5 h-5 w-5" />
              )}
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Background Overlay - Enhanced for video */}
      <motion.div
        className={`absolute inset-0 z-10 ${
          videoSrc
            ? 'bg-gradient-to-r from-forest-900/85 via-forest-800/75 to-forest-900/85'
            : 'bg-gradient-to-r from-forest-900/90 via-forest-800/80 to-forest-900/90'
        }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Coffee Bean Pattern Background */}
      <div className="z-15 absolute inset-0 opacity-5">
        <motion.div
          className="absolute left-10 top-10 h-8 w-8 rounded-full bg-emerald-400"
          variants={coffeeBeamVariants}
          animate="animate"
        />
        <motion.div
          className="absolute right-20 top-32 h-6 w-6 rounded-full bg-emerald-300"
          variants={coffeeBeamVariants}
          animate="animate"
          transition={{ delay: 1 }}
        />
        <motion.div
          className="absolute bottom-40 left-1/4 h-4 w-4 rounded-full bg-emerald-500"
          variants={coffeeBeamVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute bottom-20 right-1/3 h-10 w-10 rounded-full bg-emerald-400"
          variants={coffeeBeamVariants}
          animate="animate"
          transition={{ delay: 0.5 }}
        />
        <motion.div
          className="absolute left-1/2 top-1/2 h-5 w-5 rounded-full bg-emerald-300"
          variants={coffeeBeamVariants}
          animate="animate"
          transition={{ delay: 1.5 }}
        />
      </div>

      {/* Main Content */}
      <div className="container relative z-20 mx-auto max-w-7xl px-4 py-20">
        <div className="flex min-h-[70vh] flex-col items-center justify-between lg:flex-row">
          {/* Left Content */}
          <motion.div
            className="mb-12 text-center lg:mb-0 lg:w-1/2 lg:text-left"
            variants={containerVariants}
          >
            {/* Premium Badge */}
            <motion.div
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gradient-to-r from-gold-500/20 to-coffee-500/20 px-4 py-2 backdrop-blur-sm"
              variants={itemVariants}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
              }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Award className="h-4 w-4 text-gold-400" />
              <span className="text-sm font-medium text-gold-200">
                Premium Vietnamese Coffee Export
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.h1
              className="mb-6 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl xl:text-7xl"
              variants={itemVariants}
            >
              <span className="text-gradient-premium bg-gradient-to-r from-gold-300 via-white to-coffee-200 bg-clip-text text-transparent">
                {title}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-forest-100 md:text-xl lg:mx-0"
              variants={itemVariants}
            >
              {subtitle}
            </motion.p>

            {/* Key Features */}
            <motion.div
              className="mb-8 flex flex-wrap justify-center gap-4 lg:justify-start"
              variants={itemVariants}
            >
              <motion.div
                className="flex items-center gap-2 rounded-lg border border-gold-400/20 bg-gradient-to-r from-gold-500/10 to-coffee-500/10 px-3 py-2 text-forest-100 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  x: 5,
                  backgroundColor: 'rgba(255, 215, 0, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Coffee className="h-5 w-5 text-gold-400" />
                <span className="text-sm font-medium">
                  Premium Robusta & Arabica
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 rounded-lg border border-coffee-400/20 bg-gradient-to-r from-coffee-500/10 to-gold-500/10 px-3 py-2 text-forest-100 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  x: 5,
                  backgroundColor: 'rgba(139, 69, 19, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Globe className="h-5 w-5 text-coffee-400" />
                <span className="text-sm font-medium">
                  25+ Countries Served
                </span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-gradient-to-r from-emerald-500/10 to-forest-500/10 px-3 py-2 text-forest-100 backdrop-blur-sm"
                whileHover={{
                  scale: 1.05,
                  x: 5,
                  backgroundColor: 'rgba(34, 139, 34, 0.1)',
                }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <Award className="h-5 w-5 text-emerald-400" />
                <span className="text-sm font-medium">ISO Certified</span>
              </motion.div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row lg:justify-start"
              variants={itemVariants}
            >
              <Link href={ctaHref}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ServerButton
                    size="lg"
                    className="group transform bg-gradient-to-r from-gold-500 to-gold-600 px-8 py-4 text-lg font-semibold text-forest-900 shadow-lg shadow-gold-500/25 transition-all duration-300 hover:from-gold-400 hover:to-gold-500 hover:shadow-xl hover:shadow-gold-500/40"
                  >
                    {ctaText}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </ServerButton>
                </motion.div>
              </Link>
              <Link href={ctaSecondaryHref}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <ServerButton
                    variant="outline"
                    size="lg"
                    className="border-2 border-coffee-300 bg-gradient-to-r from-coffee-900/20 to-coffee-800/20 px-8 py-4 text-lg font-semibold text-coffee-100 backdrop-blur-sm transition-all duration-300 hover:border-coffee-200 hover:bg-gradient-to-r hover:from-coffee-200 hover:to-coffee-100 hover:text-coffee-900 hover:shadow-lg hover:shadow-coffee-500/25"
                  >
                    {ctaSecondaryText}
                  </ServerButton>
                </motion.div>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              className="text-center lg:text-left"
              variants={itemVariants}
            >
              <motion.p
                className="mb-4 text-sm font-medium text-forest-300"
                variants={itemVariants}
              >
                Trusted by 500+ B2B partners across 25+ countries since 2018
              </motion.p>
              <motion.div
                className="flex items-center justify-center space-x-6 opacity-70 lg:justify-start"
                variants={containerVariants}
              >
                {/* Professional partner logos placeholders with forest theme */}
                <motion.div
                  className="flex h-10 w-24 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Coffee className="h-5 w-5 text-forest-300" />
                </motion.div>
                <motion.div
                  className="flex h-10 w-24 items-center justify-center rounded border border-emerald-200/30 bg-gradient-to-r from-emerald-200/20 to-forest-200/20 shadow-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Globe className="h-5 w-5 text-emerald-300" />
                </motion.div>
                <motion.div
                  className="flex h-10 w-24 items-center justify-center rounded border border-forest-200/30 bg-gradient-to-r from-forest-200/20 to-emerald-200/20 shadow-sm"
                  variants={itemVariants}
                  whileHover={{ scale: 1.1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Award className="h-5 w-5 text-forest-300" />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right Content - Visual Elements */}
          <motion.div
            className="relative lg:w-1/2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Coffee Farm Illustration Placeholder */}
            <div className="relative mx-auto w-full max-w-lg">
              {/* Main Coffee Cup/Bean Visual */}
              <motion.div
                className="relative mx-auto h-80 w-80"
                variants={floatingVariants}
                animate="animate"
              >
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-400/30 to-coffee-600/30 blur-3xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
                <motion.div
                  className="relative flex h-full w-full items-center justify-center rounded-full border border-gold-400/30 bg-gradient-to-br from-gold-500/20 to-coffee-700/20 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Coffee className="h-32 w-32 text-gold-400 drop-shadow-lg" />
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Floating Elements */}
              <motion.div
                className="absolute -right-8 -top-8 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gold-400/40 to-gold-600/40 backdrop-blur-sm"
                animate={{
                  y: [-5, 5, -5],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.2,
                  boxShadow: '0 0 20px rgba(255, 215, 0, 0.4)',
                }}
              >
                <Award className="h-8 w-8 text-gold-200 drop-shadow-sm" />
              </motion.div>
              <motion.div
                className="absolute -bottom-8 -left-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-coffee-400/40 to-coffee-600/40 backdrop-blur-sm"
                animate={{
                  y: [10, -10, 10],
                  rotate: [0, -10, 10, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 1,
                }}
                whileHover={{
                  scale: 1.2,
                  boxShadow: '0 0 20px rgba(139, 69, 19, 0.4)',
                }}
              >
                <Globe className="h-10 w-10 text-coffee-200 drop-shadow-sm" />
              </motion.div>

              {/* Quality Indicators */}
              <motion.div
                className="absolute -left-12 top-1/4 rounded-lg border border-gold-400/40 bg-gradient-to-br from-gold-900/80 to-coffee-900/80 px-4 py-2 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  x: -5,
                  boxShadow: '0 0 15px rgba(255, 215, 0, 0.3)',
                }}
              >
                <div className="text-sm font-semibold text-gold-300">
                  Premium Grade
                </div>
                <div className="text-xs text-gold-200">ISO Certified</div>
              </motion.div>
              <motion.div
                className="absolute -right-12 bottom-1/4 rounded-lg border border-coffee-400/40 bg-gradient-to-br from-coffee-900/80 to-gold-900/80 px-4 py-2 shadow-lg backdrop-blur-sm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{
                  scale: 1.05,
                  x: 5,
                  boxShadow: '0 0 15px rgba(139, 69, 19, 0.3)',
                }}
              >
                <div className="text-sm font-semibold text-coffee-300">
                  Global Export
                </div>
                <div className="text-xs text-coffee-200">25+ Countries</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
      />
    </motion.section>
  );
}
