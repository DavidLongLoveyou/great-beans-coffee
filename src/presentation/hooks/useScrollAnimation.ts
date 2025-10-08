'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
}

interface ScrollAnimationReturn {
  ref: React.RefObject<HTMLElement>;
  isInView: boolean;
  hasBeenInView: boolean;
  animationVariants: {
    hidden: {
      opacity: number;
      y: number;
      scale?: number;
    };
    visible: {
      opacity: number;
      y: number;
      scale?: number;
      transition: {
        duration: number;
        delay?: number;
        ease: number[];
      };
    };
  };
}

export function useScrollAnimation({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '-50px',
  delay = 0,
}: UseScrollAnimationOptions = {}): ScrollAnimationReturn {
  const ref = useRef<HTMLElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const isInView = useInView(ref, {
    threshold,
    margin: rootMargin,
  });

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  const shouldAnimate = triggerOnce ? hasBeenInView : isInView;

  const animationVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return {
    ref,
    isInView: shouldAnimate,
    hasBeenInView,
    animationVariants,
  };
}

// Specialized hook for staggered children animations
export function useStaggeredScrollAnimation({
  threshold = 0.1,
  triggerOnce = true,
  rootMargin = '-50px',
  staggerDelay = 0.1,
  childrenCount = 1,
}: UseScrollAnimationOptions & {
  staggerDelay?: number;
  childrenCount?: number;
} = {}) {
  const ref = useRef<HTMLElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const isInView = useInView(ref, {
    threshold,
    margin: rootMargin,
  });

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  const shouldAnimate = triggerOnce ? hasBeenInView : isInView;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
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
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return {
    ref,
    isInView: shouldAnimate,
    hasBeenInView,
    containerVariants,
    itemVariants,
  };
}

// Hook for hover animations
export function useHoverAnimation() {
  const hoverVariants = {
    initial: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -2,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: {
      scale: 0.98,
      transition: {
        duration: 0.1,
      },
    },
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const iconHoverVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: 5,
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return {
    hoverVariants,
    buttonHoverVariants,
    iconHoverVariants,
  };
}
