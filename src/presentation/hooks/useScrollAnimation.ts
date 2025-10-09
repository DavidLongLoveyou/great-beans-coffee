'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

interface UseScrollAnimationOptions {
  amount?: number | 'some' | 'all';
  once?: boolean;
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
    };
  };
}

export function useScrollAnimation({
  amount = 0.3,
  once = true,
  delay: _delay = 0,
}: UseScrollAnimationOptions = {}): ScrollAnimationReturn {
  const ref = useRef<HTMLElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const isInView = useInView(ref, {
    amount,
    once,
  });

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  const shouldAnimate = once ? hasBeenInView : isInView;

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
  amount = 0.1,
  once = true,
  staggerDelay = 0.1,
  childrenCount: _childrenCount = 1,
}: UseScrollAnimationOptions & {
  staggerDelay?: number;
  childrenCount?: number;
} = {}) {
  const ref = useRef<HTMLElement>(null);
  const [hasBeenInView, setHasBeenInView] = useState(false);

  const isInView = useInView(ref, {
    amount,
    once,
  });

  useEffect(() => {
    if (isInView && !hasBeenInView) {
      setHasBeenInView(true);
    }
  }, [isInView, hasBeenInView]);

  const shouldAnimate = once ? hasBeenInView : isInView;

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
    },
    tap: {
      scale: 0.98,
    },
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
    },
    tap: {
      scale: 0.95,
    },
  };

  const iconHoverVariants = {
    initial: { rotate: 0, scale: 1 },
    hover: {
      rotate: 5,
      scale: 1.1,
    },
  };

  return {
    hoverVariants,
    buttonHoverVariants,
    iconHoverVariants,
  };
}
