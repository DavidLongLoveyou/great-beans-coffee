'use client';

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useInView,
} from 'framer-motion';
import React, { useRef, useEffect, useState, useMemo } from 'react';

import { cn } from '@/lib/utils';

// Enhanced Scroll Reveal Component
interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
  once?: boolean;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className,
  direction = 'up',
  delay = 0,
  duration = 0.6,
  distance = 50,
  once = true,
  threshold = 0.1,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: `${-threshold * 100}%` });

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const variants = {
    hidden: getInitialPosition(),
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

// Parallax Scroll Component
interface ParallaxScrollProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
}

export function ParallaxScroll({
  children,
  className,
  speed = 0.5,
  direction = 'vertical',
}: ParallaxScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const verticalTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100]
  );
  const horizontalTransform = useTransform(
    scrollYProgress,
    [0, 1],
    [0, speed * 100]
  );

  const transform =
    direction === 'vertical' ? verticalTransform : horizontalTransform;

  const smoothTransform = useSpring(transform, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className={cn('relative', className)}>
      <motion.div
        style={
          direction === 'vertical'
            ? { y: smoothTransform }
            : { x: smoothTransform }
        }
      >
        {children}
      </motion.div>
    </div>
  );
}

// Staggered Children Animation
interface StaggeredChildrenProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  childDelay?: number;
  once?: boolean;
}

export function StaggeredChildren({
  children,
  className,
  staggerDelay = 0.1,
  childDelay = 0,
  once = true,
}: StaggeredChildrenProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: childDelay,
      },
    },
  };

  const childVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {Array.isArray(children) ? (
        React.Children.toArray(children).map((child, index) => {
          const childElement = child as React.ReactElement;
          return (
            <motion.div
              key={childElement.key || `stagger-child-${index}`}
              variants={childVariants}
            >
              {child}
            </motion.div>
          );
        })
      ) : (
        <motion.div variants={childVariants}>{children}</motion.div>
      )}
    </motion.div>
  );
}

// Scroll Progress Indicator
interface ScrollProgressProps {
  className?: string;
  color?: 'forest' | 'emerald' | 'sage';
  height?: number;
  position?: 'top' | 'bottom';
}

export function ScrollProgress({
  className,
  color = 'forest',
  height = 3,
  position = 'top',
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const colorClasses = {
    forest: 'bg-forest-600',
    emerald: 'bg-emerald-600',
    sage: 'bg-sage-600',
  };

  return (
    <motion.div
      className={cn(
        'fixed left-0 right-0 z-50 origin-left',
        position === 'top' ? 'top-0' : 'bottom-0',
        colorClasses[color],
        className
      )}
      style={{
        scaleX,
        height: `${height}px`,
      }}
    />
  );
}

// Magnetic Hover Effect
interface MagneticHoverProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
}

export function MagneticHover({
  children,
  className,
  strength = 0.3,
  disabled = false,
}: MagneticHoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (disabled) return;

    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  return (
    <motion.div
      ref={ref}
      className={className}
      animate={position}
      transition={{
        type: 'spring',
        stiffness: 150,
        damping: 15,
        mass: 0.1,
      }}
    >
      {children}
    </motion.div>
  );
}

// Text Reveal Animation
interface TextRevealProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export function TextReveal({
  text,
  className,
  delay = 0,
  duration = 0.05,
  once = true,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once });

  const words = text.split(' ');

  // Create words with unique IDs to avoid array index keys
  const wordsWithIds = useMemo(
    () =>
      words.map((word, index) => ({
        id: `word-${word}-${index}-${word.length}`,
        text: word,
      })),
    [words]
  );

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      ref={ref}
      className={cn('overflow-hidden', className)}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
    >
      {wordsWithIds.map(wordObj => (
        <motion.span
          key={wordObj.id}
          className="mr-1 inline-block"
          variants={wordVariants}
        >
          {wordObj.text}
        </motion.span>
      ))}
    </motion.div>
  );
}

// Floating Elements
interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  amplitude?: number;
  frequency?: number;
  delay?: number;
}

export function FloatingElement({
  children,
  className,
  amplitude = 10,
  frequency = 2,
  delay = 0,
}: FloatingElementProps) {
  return (
    <motion.div
      className={className}
      animate={{
        y: [-amplitude, amplitude, -amplitude],
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
