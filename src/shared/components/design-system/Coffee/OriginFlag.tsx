'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { OriginFlagProps, CoffeeOrigin } from '../types';

// Coffee origin metadata
const originData: Record<
  CoffeeOrigin,
  {
    name: string;
    region: string;
    flag: string;
    altitude: string;
    harvest: string;
    varieties: string[];
    characteristics: string[];
    color: string;
    bgColor: string;
  }
> = {
  vietnam: {
    name: 'Vietnam',
    region: 'Southeast Asia',
    flag: '🇻🇳',
    altitude: '500-1,500m',
    harvest: 'Oct - Feb',
    varieties: ['Robusta', 'Arabica', 'Catimor'],
    characteristics: ['Bold', 'Earthy', 'Chocolatey', 'Low Acidity'],
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  brazil: {
    name: 'Brazil',
    region: 'South America',
    flag: '🇧🇷',
    altitude: '400-1,600m',
    harvest: 'May - Sep',
    varieties: ['Bourbon', 'Typica', 'Catuai', 'Mundo Novo'],
    characteristics: ['Nutty', 'Chocolatey', 'Sweet', 'Medium Body'],
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
  },
  colombia: {
    name: 'Colombia',
    region: 'South America',
    flag: '🇨🇴',
    altitude: '1,200-2,000m',
    harvest: 'Oct - Dec, Apr - Jun',
    varieties: ['Typica', 'Bourbon', 'Caturra', 'Castillo'],
    characteristics: ['Bright Acidity', 'Fruity', 'Balanced', 'Medium Body'],
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  ethiopia: {
    name: 'Ethiopia',
    region: 'East Africa',
    flag: '🇪🇹',
    altitude: '1,500-2,200m',
    harvest: 'Oct - Dec',
    varieties: ['Heirloom', 'Typica', 'Bourbon'],
    characteristics: ['Floral', 'Wine-like', 'Bright Acidity', 'Complex'],
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
  },
  guatemala: {
    name: 'Guatemala',
    region: 'Central America',
    flag: '🇬🇹',
    altitude: '1,300-2,000m',
    harvest: 'Dec - Mar',
    varieties: ['Bourbon', 'Typica', 'Caturra', 'Catuai'],
    characteristics: ['Full Body', 'Spicy', 'Smoky', 'Chocolatey'],
    color: 'text-blue-700',
    bgColor: 'bg-blue-50 border-blue-200',
  },
  'costa-rica': {
    name: 'Costa Rica',
    region: 'Central America',
    flag: '🇨🇷',
    altitude: '1,200-1,700m',
    harvest: 'Nov - Feb',
    varieties: ['Caturra', 'Catuai', 'Villa Sarchi', 'Geisha'],
    characteristics: ['Bright Acidity', 'Citrusy', 'Clean', 'Medium Body'],
    color: 'text-teal-700',
    bgColor: 'bg-teal-50 border-teal-200',
  },
  jamaica: {
    name: 'Jamaica',
    region: 'Caribbean',
    flag: '🇯🇲',
    altitude: '900-1,700m',
    harvest: 'Sep - Feb',
    varieties: ['Blue Mountain', 'Typica'],
    characteristics: ['Mild', 'Sweet', 'Balanced', 'Low Acidity'],
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
  },
  kenya: {
    name: 'Kenya',
    region: 'East Africa',
    flag: '🇰🇪',
    altitude: '1,400-2,000m',
    harvest: 'Oct - Dec, Jun - Aug',
    varieties: ['SL28', 'SL34', 'Ruiru 11', 'Batian'],
    characteristics: [
      'Wine-like',
      'Black Currant',
      'Bright Acidity',
      'Full Body',
    ],
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
  },
  indonesia: {
    name: 'Indonesia',
    region: 'Southeast Asia',
    flag: '🇮🇩',
    altitude: '1,000-1,800m',
    harvest: 'May - Sep',
    varieties: ['Typica', 'Catimor', 'Linie S'],
    characteristics: ['Earthy', 'Herbal', 'Full Body', 'Low Acidity'],
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  peru: {
    name: 'Peru',
    region: 'South America',
    flag: '🇵🇪',
    altitude: '1,200-2,000m',
    harvest: 'Mar - Sep',
    varieties: ['Typica', 'Bourbon', 'Caturra', 'Pache'],
    characteristics: ['Mild', 'Nutty', 'Chocolatey', 'Medium Body'],
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
  },
  honduras: {
    name: 'Honduras',
    region: 'Central America',
    flag: '🇭🇳',
    altitude: '1,000-1,700m',
    harvest: 'Nov - Mar',
    varieties: ['Bourbon', 'Typica', 'Caturra', 'Catuai'],
    characteristics: ['Sweet', 'Fruity', 'Balanced', 'Medium Body'],
    color: 'text-indigo-700',
    bgColor: 'bg-indigo-50 border-indigo-200',
  },
  india: {
    name: 'India',
    region: 'South Asia',
    flag: '🇮🇳',
    altitude: '1,000-1,600m',
    harvest: 'Nov - Feb',
    varieties: ['Arabica', 'Robusta', 'Monsooned Malabar'],
    characteristics: ['Spicy', 'Full Body', 'Low Acidity', 'Earthy'],
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
  },
  nicaragua: {
    name: 'Nicaragua',
    region: 'Central America',
    flag: '🇳🇮',
    altitude: '1,000-1,500m',
    harvest: 'Dec - Mar',
    varieties: ['Bourbon', 'Typica', 'Caturra', 'Maracaturra'],
    characteristics: ['Chocolatey', 'Nutty', 'Medium Body', 'Balanced'],
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50 border-cyan-200',
  },
  ecuador: {
    name: 'Ecuador',
    region: 'South America',
    flag: '🇪🇨',
    altitude: '1,200-2,000m',
    harvest: 'Jun - Sep',
    varieties: ['Typica', 'Bourbon', 'Caturra'],
    characteristics: ['Floral', 'Bright Acidity', 'Medium Body', 'Citrusy'],
    color: 'text-lime-700',
    bgColor: 'bg-lime-50 border-lime-200',
  },
  mexico: {
    name: 'Mexico',
    region: 'North America',
    flag: '🇲🇽',
    altitude: '900-1,700m',
    harvest: 'Dec - Mar',
    varieties: ['Bourbon', 'Typica', 'Mundo Novo', 'Caturra'],
    characteristics: ['Nutty', 'Chocolatey', 'Medium Body', 'Mild'],
    color: 'text-rose-700',
    bgColor: 'bg-rose-50 border-rose-200',
  },
  panama: {
    name: 'Panama',
    region: 'Central America',
    flag: '🇵🇦',
    altitude: '1,400-1,900m',
    harvest: 'Dec - Mar',
    varieties: ['Geisha', 'Typica', 'Bourbon', 'Caturra'],
    characteristics: ['Floral', 'Tea-like', 'Bright Acidity', 'Complex'],
    color: 'text-violet-700',
    bgColor: 'bg-violet-50 border-violet-200',
  },
};

// Size styles
const flagSizes = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

const containerSizes = {
  xs: 'px-1.5 py-0.5 text-xs gap-1',
  sm: 'px-2 py-1 text-xs gap-1.5',
  md: 'px-3 py-1.5 text-sm gap-2',
  lg: 'px-4 py-2 text-base gap-2',
  xl: 'px-5 py-2.5 text-lg gap-3',
  '2xl': 'px-6 py-3 text-xl gap-3',
  '3xl': 'px-8 py-4 text-2xl gap-4',
};

export const OriginFlag = forwardRef<HTMLDivElement, OriginFlagProps>(
  (
    {
      className,
      origin,
      size = 'md',
      showName = true,
      showRegion = false,
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const originInfo = originData[origin];

    if (!originInfo) {
      return null;
    }

    const baseClasses = cn(
      'inline-flex items-center rounded-lg border transition-all duration-200 ease-in-out',
      containerSizes[size],
      variant === 'default' && `${originInfo.color} ${originInfo.bgColor}`,
      variant === 'subtle' && 'text-muted-foreground bg-muted border-border',
      variant === 'outline' &&
        `${originInfo.color} border-current bg-transparent`,
      className
    );

    return (
      <div
        className={baseClasses}
        title={`${originInfo.name} - ${originInfo.region}`}
        ref={ref}
        {...props}
      >
        {/* Flag */}
        <span className={cn('leading-none', flagSizes[size])}>
          {originInfo.flag}
        </span>

        {/* Name */}
        {showName && <span className="font-semibold">{originInfo.name}</span>}

        {/* Region */}
        {showRegion && (
          <span className="text-xs opacity-75">{originInfo.region}</span>
        )}
      </div>
    );
  }
);

OriginFlag.displayName = 'OriginFlag';

// Origin details card
export const OriginDetails = forwardRef<
  HTMLDivElement,
  {
    origin: CoffeeOrigin;
    className?: string;
  }
>(({ origin, className, ...props }, ref) => {
  const originInfo = originData[origin];

  if (!originInfo) {
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
        <span className="text-3xl">{originInfo.flag}</span>
        <div>
          <h3 className="text-xl font-bold">{originInfo.name}</h3>
          <p className="text-sm text-muted-foreground">{originInfo.region}</p>
        </div>
      </div>

      {/* Growing Info */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-muted-foreground">Altitude:</span>
          <p>{originInfo.altitude}</p>
        </div>
        <div>
          <span className="font-semibold text-muted-foreground">Harvest:</span>
          <p>{originInfo.harvest}</p>
        </div>
      </div>

      {/* Varieties */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
          Varieties:
        </h4>
        <div className="flex flex-wrap gap-1">
          {originInfo.varieties.map(variety => (
            <span
              key={variety}
              className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
            >
              {variety}
            </span>
          ))}
        </div>
      </div>

      {/* Characteristics */}
      <div>
        <h4 className="mb-2 text-sm font-semibold text-muted-foreground">
          Characteristics:
        </h4>
        <div className="flex flex-wrap gap-1">
          {originInfo.characteristics.map(char => (
            <span
              key={char}
              className={cn(
                'rounded-md px-2 py-1 text-xs font-medium',
                originInfo.color,
                originInfo.bgColor
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

OriginDetails.displayName = 'OriginDetails';

// Origin selector
export const OriginSelector = forwardRef<
  HTMLDivElement,
  {
    selectedOrigins: CoffeeOrigin[];
    onOriginToggle: (origin: CoffeeOrigin) => void;
    className?: string;
  }
>(({ selectedOrigins, onOriginToggle, className, ...props }, ref) => {
  const availableOrigins: CoffeeOrigin[] = [
    'vietnam',
    'brazil',
    'colombia',
    'ethiopia',
    'guatemala',
    'costa-rica',
    'jamaica',
    'kenya',
    'indonesia',
    'peru',
  ];

  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5',
        className
      )}
      ref={ref}
      {...props}
    >
      {availableOrigins.map(origin => {
        const isSelected = selectedOrigins.includes(origin);
        const originInfo = originData[origin];

        return (
          <button
            key={origin}
            onClick={() => onOriginToggle(origin)}
            className={cn(
              'flex items-center gap-2 rounded-lg border p-3 text-sm font-medium',
              'transition-all duration-200 ease-in-out hover:scale-105',
              isSelected
                ? `${originInfo.color} ${originInfo.bgColor} ring-2 ring-current ring-opacity-20`
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            <span className="text-lg">{originInfo.flag}</span>
            <span className="truncate">{originInfo.name}</span>
          </button>
        );
      })}
    </div>
  );
});

OriginSelector.displayName = 'OriginSelector';

// Origin map (simplified representation)
export const OriginMap = forwardRef<
  HTMLDivElement,
  {
    origins: CoffeeOrigin[];
    className?: string;
  }
>(({ origins, className, ...props }, ref) => {
  return (
    <div
      className={cn(
        'relative rounded-xl border bg-gradient-to-br from-blue-50 to-green-50 p-6',
        className
      )}
      ref={ref}
      {...props}
    >
      <h3 className="mb-4 text-center text-lg font-bold">Coffee Origins</h3>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {origins.map(origin => {
          const originInfo = originData[origin];
          return (
            <div
              key={origin}
              className="flex flex-col items-center rounded-lg bg-white p-3 shadow-sm"
            >
              <span className="mb-1 text-2xl">{originInfo.flag}</span>
              <span className="text-center text-xs font-semibold">
                {originInfo.name}
              </span>
              <span className="text-center text-xs text-muted-foreground">
                {originInfo.region}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});

OriginMap.displayName = 'OriginMap';
