'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CoffeeCupLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showText?: boolean;
  text?: string;
}

export function CoffeeCupLoader({
  size = 'md',
  className,
  showText = false,
  text = 'Brewing excellence...',
}: CoffeeCupLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const steamVariants = {
    animate: {
      y: [-10, -20, -10],
      opacity: [0.3, 0.8, 0.3],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const cupVariants = {
    animate: {
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const coffeeVariants = {
    animate: {
      y: [0, -2, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className={cn('relative', sizeClasses[size])}>
        {/* Coffee Cup */}
        <motion.svg
          variants={cupVariants}
          animate="animate"
          viewBox="0 0 100 100"
          className="h-full w-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cup Body */}
          <motion.path
            d="M20 30 L20 70 Q20 80 30 80 L60 80 Q70 80 70 70 L70 30 Z"
            fill="#8B4513"
            stroke="#654321"
            strokeWidth="2"
          />

          {/* Coffee Surface */}
          <motion.ellipse
            variants={coffeeVariants}
            animate="animate"
            cx="45"
            cy="32"
            rx="22"
            ry="3"
            fill="#3E2723"
          />

          {/* Cup Handle */}
          <motion.path
            d="M70 40 Q80 40 80 50 Q80 60 70 60"
            fill="none"
            stroke="#8B4513"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Cup Rim */}
          <motion.ellipse
            cx="45"
            cy="30"
            rx="25"
            ry="4"
            fill="#A0522D"
            stroke="#654321"
            strokeWidth="1"
          />
        </motion.svg>

        {/* Steam */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 transform">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              variants={steamVariants}
              animate="animate"
              className="absolute h-4 w-1 rounded-full bg-gradient-to-t from-gray-300 to-transparent opacity-60"
              style={{
                left: `${(i - 1) * 4}px`,
                animationDelay: `${i * 0.3}s`,
              }}
            />
          ))}
        </div>

        {/* Coffee Beans (decorative) */}
        <motion.div
          className="absolute -bottom-1 -right-1 h-2 w-2 rounded-full bg-amber-800"
          animate={{
            rotate: 360,
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
        <motion.div
          className="absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-amber-700"
          animate={{
            rotate: -360,
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        />
      </div>

      {/* Loading Text */}
      {showText && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-coffee-600 mt-4 text-sm font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// Simplified version for inline use
export function CoffeeCupSpinner({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('inline-block h-5 w-5', className)}
      animate={{ rotate: 360 }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
        <path
          d="M5 7v8a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M19 11h2a2 2 0 0 1 0 4h-2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  );
}
