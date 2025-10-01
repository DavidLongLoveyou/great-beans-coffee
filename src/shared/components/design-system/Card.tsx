'use client';

import Image from 'next/image';
import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { CardProps } from './types';

// Card variant styles
const cardVariants = {
  default: 'bg-card text-card-foreground border border-border shadow-sm',
  elevated: 'bg-card text-card-foreground border border-border shadow-medium',
  outlined: 'bg-card text-card-foreground border-2 border-border',
  coffee: 'bg-card text-card-foreground border border-coffee-200 shadow-coffee',
  premium:
    'bg-gradient-to-br from-gold-50 to-coffee-50 border border-gold-200 shadow-gold',
  product:
    'bg-card text-card-foreground border border-coffee-200 shadow-soft hover:shadow-coffee transition-shadow duration-300',
};

// Card padding styles
const cardPadding = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
  '2xl': 'p-12',
  '3xl': 'p-16',
  '4xl': 'p-20',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      shadow = false,
      hover = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          // Base styles
          'rounded-lg transition-all duration-200 ease-in-out',

          // Variant styles
          cardVariants[variant],

          // Padding styles
          cardPadding[padding],

          // Shadow enhancement
          shadow && 'shadow-strong',

          // Hover effects
          hover && 'cursor-pointer hover:-translate-y-1 hover:shadow-medium',

          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// Card Header Component
export const CardHeader = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

// Card Title Component
export const CardTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'font-display text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

// Card Description Component
export const CardDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

// Card Content Component
export const CardContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// Card Footer Component
export const CardFooter = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// Specialized Coffee Industry Cards

// Specialized Card Components

export const ProductCard = forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'> & {
    title: string;
    description: string;
    image?: string;
    price?: string;
    features?: string[];
    badges?: React.ReactNode;
    footer?: React.ReactNode;
  }
>(
  (
    {
      title,
      description,
      image,
      price,
      features,
      badges,
      footer,
      hover = true,
      ...props
    },
    ref
  ) => (
    <Card variant="product" hover={hover} ref={ref} {...props}>
      {image && (
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          {badges && <div className="ml-2">{badges}</div>}
        </div>
        <CardDescription>{description}</CardDescription>
        {price && (
          <div className="mt-2 text-lg font-semibold text-coffee-600">
            {price}
          </div>
        )}
      </CardHeader>
      {features && (
        <CardContent>
          <ul className="space-y-2">
            {features.map(feature => (
              <li
                key={`feature-${title}-${feature.slice(0, 20)}`}
                className="flex items-center text-sm"
              >
                <div className="mr-3 h-1.5 w-1.5 rounded-full bg-coffee-500" />
                {feature}
              </li>
            ))}
          </ul>
        </CardContent>
      )}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
);

ProductCard.displayName = 'ProductCard';

// Premium Card - For premium services/products
export const PremiumCard = forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'>
>((props, ref) => <Card variant="premium" ref={ref} {...props} />);

PremiumCard.displayName = 'PremiumCard';

// Coffee Card - For coffee-themed content
export const CoffeeCard = forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'variant'>
>((props, ref) => <Card variant="coffee" ref={ref} {...props} />);

CoffeeCard.displayName = 'CoffeeCard';

// Service Card - For business services
export const ServiceCard = forwardRef<
  HTMLDivElement,
  CardProps & {
    icon?: React.ReactNode;
    title: string;
    description: string;
    features?: string[];
  }
>(({ icon, title, description, features, children, ...props }, ref) => (
  <Card variant="elevated" hover ref={ref} {...props}>
    <CardHeader>
      {icon && (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-coffee-100">
          {icon}
        </div>
      )}
      <CardTitle className="text-xl">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    {features && (
      <CardContent>
        <ul className="space-y-2">
          {features.map(feature => (
            <li
              key={`feature-${title}-${feature.slice(0, 20)}`}
              className="flex items-center text-sm"
            >
              <div className="mr-3 h-1.5 w-1.5 rounded-full bg-coffee-500" />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    )}
    {children && <CardContent>{children}</CardContent>}
  </Card>
));

ServiceCard.displayName = 'ServiceCard';

// Testimonial Card - For client testimonials
export const TestimonialCard = forwardRef<
  HTMLDivElement,
  CardProps & {
    quote: string;
    author: string;
    company: string;
    avatar?: string;
  }
>(({ quote, author, company, avatar, ...props }, ref) => (
  <Card variant="elevated" ref={ref} {...props}>
    <CardContent className="pt-6">
      <blockquote className="mb-4 text-lg italic text-muted-foreground">
        &ldquo;{quote}&rdquo;
      </blockquote>
      <div className="flex items-center">
        {avatar && (
          <Image
            src={avatar}
            alt={author}
            width={40}
            height={40}
            className="mr-3 h-10 w-10 rounded-full object-cover"
          />
        )}
        <div>
          <div className="text-sm font-semibold">{author}</div>
          <div className="text-xs text-muted-foreground">{company}</div>
        </div>
      </div>
    </CardContent>
  </Card>
));

TestimonialCard.displayName = 'TestimonialCard';
