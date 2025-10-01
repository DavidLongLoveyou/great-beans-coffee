'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { SectionProps } from '../types';

import { Container } from './Container';

// Section background variants
const sectionBackgrounds = {
  default: 'bg-background',
  muted: 'bg-muted/30',
  card: 'bg-card',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
  coffee: 'bg-coffee-50 text-coffee-900',
  'coffee-dark': 'bg-coffee-900 text-coffee-50',
  gold: 'bg-gold-50 text-gold-900',
  'gold-dark': 'bg-gold-900 text-gold-50',
  gradient: 'bg-gradient-to-br from-coffee-50 via-gold-50 to-bean-50',
  'gradient-dark':
    'bg-gradient-to-br from-coffee-900 via-gold-900 to-bean-900 text-white',
  'coffee-texture': 'bg-coffee-texture bg-cover bg-center text-white',
  transparent: 'bg-transparent',
};

// Section spacing variants
const sectionSpacing = {
  none: '',
  xs: 'py-8',
  sm: 'py-12',
  md: 'py-16',
  lg: 'py-20',
  xl: 'py-24',
  '2xl': 'py-32',
};

export const Section = forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      children,
      background = 'default',
      spacing = 'lg',
      containerSize = '6xl',
      containerPadding = 'lg',
      fullWidth = false,
      as: Component = 'section',
      ...props
    },
    ref
  ) => {
    const sectionClasses = cn(
      // Base section styles
      'relative w-full',

      // Background
      sectionBackgrounds[background],

      // Spacing
      sectionSpacing[spacing],

      // Custom classes
      className
    );

    const content = fullWidth ? (
      children
    ) : (
      <Container size={containerSize} padding={containerPadding}>
        {children}
      </Container>
    );

    return (
      <Component className={sectionClasses} ref={ref} {...props}>
        {content}
      </Component>
    );
  }
);

Section.displayName = 'Section';

// Specialized section variants
export const HeroSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="2xl"
      background="gradient"
      className={cn('flex min-h-[80vh] items-center', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

HeroSection.displayName = 'HeroSection';

export const FeatureSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="xl"
      background="muted"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

FeatureSection.displayName = 'FeatureSection';

export const ContentSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'containerSize'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="lg"
      containerSize="4xl"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

ContentSection.displayName = 'ContentSection';

export const TestimonialSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="xl"
      background="coffee"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

TestimonialSection.displayName = 'TestimonialSection';

export const CTASection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="xl"
      background="coffee-dark"
      className={cn('text-center', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

CTASection.displayName = 'CTASection';

export const ProductSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="xl"
      background="default"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

ProductSection.displayName = 'ProductSection';

export const AboutSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="xl"
      background="gradient"
      className={className}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

AboutSection.displayName = 'AboutSection';

export const NewsletterSection = forwardRef<
  HTMLElement,
  Omit<SectionProps, 'spacing' | 'background' | 'containerSize'>
>(({ className, children, ...props }, ref) => {
  return (
    <Section
      spacing="lg"
      background="gold"
      containerSize="2xl"
      className={cn('text-center', className)}
      ref={ref}
      {...props}
    >
      {children}
    </Section>
  );
});

NewsletterSection.displayName = 'NewsletterSection';
