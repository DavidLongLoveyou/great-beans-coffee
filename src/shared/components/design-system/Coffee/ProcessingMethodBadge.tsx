'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { ProcessingMethodBadgeProps, ProcessingMethod } from '../types';

// Processing method metadata
const processingData: Record<
  ProcessingMethod,
  {
    name: string;
    description: string;
    process: string;
    characteristics: string[];
    icon: string;
    color: string;
    bgColor: string;
    premium: boolean;
  }
> = {
  washed: {
    name: 'Washed',
    description: 'Wet Process',
    process: 'Pulped → Fermented → Washed → Dried',
    characteristics: ['Clean', 'Bright Acidity', 'Clear Flavors', 'Consistent'],
    icon: '💧',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
    premium: false,
  },
  natural: {
    name: 'Natural',
    description: 'Dry Process',
    process: 'Dried with Cherry → Hulled',
    characteristics: ['Fruity', 'Sweet', 'Full Body', 'Complex'],
    icon: '☀️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    premium: false,
  },
  honey: {
    name: 'Honey',
    description: 'Semi-Washed',
    process: 'Pulped → Dried with Mucilage',
    characteristics: ['Sweet', 'Balanced', 'Medium Body', 'Fruity Notes'],
    icon: '🍯',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    premium: true,
  },
  'semi-washed': {
    name: 'Semi-Washed',
    description: 'Pulped Natural',
    process: 'Pulped → Dried → Hulled',
    characteristics: ['Balanced', 'Medium Acidity', 'Good Body', 'Clean'],
    icon: '🌊',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
    premium: false,
  },
  'wet-hulled': {
    name: 'Wet Hulled',
    description: 'Giling Basah',
    process: 'Pulped → Partially Dried → Hulled → Dried',
    characteristics: ['Earthy', 'Herbal', 'Full Body', 'Low Acidity'],
    icon: '🌿',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    premium: false,
  },
  anaerobic: {
    name: 'Anaerobic',
    description: 'Oxygen-Free Fermentation',
    process: 'Sealed Fermentation → Washed/Natural',
    characteristics: ['Unique', 'Intense', 'Experimental', 'Complex'],
    icon: '🧪',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    premium: true,
  },
  'carbonic-maceration': {
    name: 'Carbonic Maceration',
    description: 'CO2 Fermentation',
    process: 'CO2 Environment → Fermented → Processed',
    characteristics: ['Wine-like', 'Fruity', 'Experimental', 'Unique'],
    icon: '🍷',
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
    premium: true,
  },
  'black-honey': {
    name: 'Black Honey',
    description: 'Extended Honey Process',
    process: 'Pulped → Extended Drying with Mucilage',
    characteristics: ['Very Sweet', 'Complex', 'Full Body', 'Fruity'],
    icon: '🖤',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    premium: true,
  },
  'white-honey': {
    name: 'White Honey',
    description: 'Light Honey Process',
    process: 'Pulped → Quick Drying with Little Mucilage',
    characteristics: ['Clean', 'Bright', 'Light Body', 'Subtle Sweetness'],
    icon: '🤍',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50 border-gray-200',
    premium: true,
  },
  'red-honey': {
    name: 'Red Honey',
    description: 'Medium Honey Process',
    process: 'Pulped → Medium Drying with Mucilage',
    characteristics: ['Sweet', 'Balanced', 'Medium Body', 'Fruity'],
    icon: '❤️',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    premium: true,
  },
};

// Size styles
const badgeSizes = {
  xs: 'px-1.5 py-0.5 text-xs gap-1',
  sm: 'px-2 py-1 text-xs gap-1.5',
  md: 'px-3 py-1.5 text-sm gap-2',
  lg: 'px-4 py-2 text-base gap-2',
  xl: 'px-5 py-2.5 text-lg gap-3',
  '2xl': 'px-6 py-3 text-xl gap-3',
  '3xl': 'px-8 py-4 text-2xl gap-4',
};

export const ProcessingMethodBadge = forwardRef<
  HTMLDivElement,
  ProcessingMethodBadgeProps
>(
  (
    {
      className,
      method,
      size = 'md',
      showIcon = true,
      showDescription = false,
      variant = 'default',
      ...domProps
    },
    ref
  ) => {
    const methodInfo = processingData[method];

    if (!methodInfo) {
      return null;
    }

    const baseClasses = cn(
      'inline-flex items-center rounded-lg border font-medium transition-all duration-200 ease-in-out',
      badgeSizes[size],
      variant === 'default' && `${methodInfo.color} ${methodInfo.bgColor}`,
      variant === 'subtle' && 'text-muted-foreground bg-muted border-border',
      variant === 'outline' &&
        `${methodInfo.color} border-current bg-transparent`,
      methodInfo.premium && variant === 'default' && 'ring-1 ring-gold-200',
      className
    );

    return (
      <div
        className={baseClasses}
        title={`${methodInfo.name} - ${methodInfo.description}`}
        ref={ref}
        {...domProps}
      >
        {/* Icon */}
        {showIcon && <span className="leading-none">{methodInfo.icon}</span>}

        {/* Name */}
        <span className="font-semibold">{methodInfo.name}</span>

        {/* Description */}
        {showDescription && (
          <span className="text-xs opacity-75">({methodInfo.description})</span>
        )}

        {/* Premium indicator */}
        {methodInfo.premium && variant === 'default' && (
          <span className="text-xs font-bold text-gold-600">★</span>
        )}
      </div>
    );
  }
);

ProcessingMethodBadge.displayName = 'ProcessingMethodBadge';

// Processing method details
export const ProcessingMethodDetails = forwardRef<
  HTMLDivElement,
  {
    method: ProcessingMethod;
    className?: string;
  }
>(({ method, className, ...props }, ref) => {
  const methodInfo = processingData[method];

  if (!methodInfo) {
    return null;
  }

  return (
    <div
      className={cn('space-y-4 rounded-xl border bg-card p-6', className)}
      ref={ref}
      {...props}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-3xl">{methodInfo.icon}</span>
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold">
            {methodInfo.name}
            {methodInfo.premium && (
              <span className="rounded-full bg-gold-100 px-2 py-1 text-xs font-semibold text-gold-700">
                Premium
              </span>
            )}
          </h3>
          <p className="text-sm text-muted-foreground">
            {methodInfo.description}
          </p>
        </div>
      </div>

      {/* Process */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
          Process:
        </h4>
        <p className="rounded-lg bg-muted p-3 text-sm">{methodInfo.process}</p>
      </div>

      {/* Characteristics */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
          Characteristics:
        </h4>
        <div className="flex flex-wrap gap-1">
          {methodInfo.characteristics.map(char => (
            <span
              key={char}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium',
                methodInfo.color,
                methodInfo.bgColor
              )}
            >
              {char}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

ProcessingMethodDetails.displayName = 'ProcessingMethodDetails';

// Processing method comparison
export const ProcessingMethodComparison = forwardRef<
  HTMLDivElement,
  {
    methods: ProcessingMethod[];
    className?: string;
  }
>(({ methods, className, ...props }, ref) => {
  return (
    <div className={cn('space-y-3', className)} ref={ref} {...props}>
      {methods.map(method => {
        const methodInfo = processingData[method];
        return (
          <div
            key={method}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{methodInfo.icon}</span>
              <div>
                <div className="font-semibold">{methodInfo.name}</div>
                <div className="text-sm text-muted-foreground">
                  {methodInfo.description}
                </div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {methodInfo.characteristics.slice(0, 3).map(char => (
                    <span
                      key={char}
                      className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
                    >
                      {char}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {methodInfo.premium && (
              <span className="rounded-full bg-gold-100 px-2 py-1 text-xs font-semibold text-gold-700">
                Premium
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
});

ProcessingMethodComparison.displayName = 'ProcessingMethodComparison';

// Processing method filter
export const ProcessingMethodFilter = forwardRef<
  HTMLDivElement,
  {
    selectedMethods: ProcessingMethod[];
    onMethodToggle: (method: ProcessingMethod) => void;
    className?: string;
  }
>(({ selectedMethods, onMethodToggle, className, ...props }, ref) => {
  const availableMethods: ProcessingMethod[] = [
    'washed',
    'natural',
    'honey',
    'semi-washed',
    'wet-hulled',
    'anaerobic',
    'carbonic-maceration',
    'black-honey',
    'white-honey',
    'red-honey',
  ];

  return (
    <div className={cn('flex flex-wrap gap-2', className)} ref={ref} {...props}>
      {availableMethods.map(method => {
        const isSelected = selectedMethods.includes(method);
        const methodInfo = processingData[method];

        return (
          <button
            key={method}
            onClick={() => onMethodToggle(method)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium',
              'transition-all duration-200 ease-in-out hover:scale-105',
              isSelected
                ? `${methodInfo.color} ${methodInfo.bgColor} ring-2 ring-current ring-opacity-20`
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            <span>{methodInfo.icon}</span>
            {methodInfo.name}
            {methodInfo.premium && (
              <span className="text-xs text-gold-600">★</span>
            )}
          </button>
        );
      })}
    </div>
  );
});

ProcessingMethodFilter.displayName = 'ProcessingMethodFilter';
