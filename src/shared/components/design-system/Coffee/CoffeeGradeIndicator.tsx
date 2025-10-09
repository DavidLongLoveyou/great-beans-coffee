'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { CoffeeGradeIndicatorProps, CoffeeGrade } from '../types';

// Coffee grade metadata
const gradeData: Record<
  CoffeeGrade,
  {
    label: string;
    description: string;
    color: string;
    bgColor: string;
    stars: number;
    premium: boolean;
  }
> = {
  specialty: {
    label: 'Specialty',
    description: '80+ SCA Score',
    color: 'text-gold-700',
    bgColor: 'bg-gold-100 border-gold-300',
    stars: 5,
    premium: true,
  },
  premium: {
    label: 'Premium',
    description: '75-79 SCA Score',
    color: 'text-coffee-700',
    bgColor: 'bg-coffee-100 border-coffee-300',
    stars: 4,
    premium: true,
  },
  exchange: {
    label: 'Exchange',
    description: 'NY/London Exchange Grade',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100 border-blue-300',
    stars: 3,
    premium: false,
  },
  standard: {
    label: 'Standard',
    description: 'Commercial Grade',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100 border-slate-300',
    stars: 2,
    premium: false,
  },
  'grade-1': {
    label: 'Grade 1',
    description: 'Highest Quality',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100 border-emerald-300',
    stars: 5,
    premium: true,
  },
  'grade-2': {
    label: 'Grade 2',
    description: 'High Quality',
    color: 'text-green-700',
    bgColor: 'bg-green-100 border-green-300',
    stars: 4,
    premium: false,
  },
  'grade-3': {
    label: 'Grade 3',
    description: 'Good Quality',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100 border-yellow-300',
    stars: 3,
    premium: false,
  },
  'grade-4': {
    label: 'Grade 4',
    description: 'Standard Quality',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100 border-orange-300',
    stars: 2,
    premium: false,
  },
  'screen-18': {
    label: 'Screen 18',
    description: 'Large Bean Size',
    color: 'text-coffee-700',
    bgColor: 'bg-coffee-100 border-coffee-300',
    stars: 4,
    premium: true,
  },
  'screen-16': {
    label: 'Screen 16',
    description: 'Medium-Large Bean',
    color: 'text-coffee-600',
    bgColor: 'bg-coffee-50 border-coffee-200',
    stars: 3,
    premium: false,
  },
  'screen-14': {
    label: 'Screen 14',
    description: 'Medium Bean Size',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50 border-slate-200',
    stars: 2,
    premium: false,
  },
};

// Size styles
const indicatorSizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
  xl: 'px-5 py-2.5 text-lg',
  '2xl': 'px-6 py-3 text-xl',
  '3xl': 'px-8 py-4 text-2xl',
};

// Star component
const Star = ({
  filled,
  size,
}: {
  filled: boolean;
  size: 'xs' | 'sm' | 'md' | 'lg';
}) => {
  const starSizes = {
    xs: 'w-2 h-2',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <svg
      className={cn(
        starSizes[size],
        filled ? 'text-gold-500' : 'text-gray-300'
      )}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
};

export const CoffeeGradeIndicator = forwardRef<
  HTMLDivElement,
  CoffeeGradeIndicatorProps
>(({ className, grade, size = 'md', showLabel = true, ...props }, ref) => {
  const gradeInfo = gradeData[grade];

  if (!gradeInfo) {
    return null;
  }

  const starSize =
    size === 'xs' || size === 'sm'
      ? 'xs'
      : size === 'md'
        ? 'sm'
        : size === 'lg'
          ? 'md'
          : 'lg';

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border',
        'transition-all duration-200 ease-in-out',
        indicatorSizes[size],
        gradeInfo.color,
        gradeInfo.bgColor,
        gradeInfo.premium && 'ring-1 ring-gold-200',
        className
      )}
      title={gradeInfo.description}
      ref={ref}
      {...props}
    >
      {/* Stars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={`star-${grade}-${index < gradeInfo.stars ? 'filled' : 'empty'}-${index}`}
            filled={index < gradeInfo.stars}
            size={starSize}
          />
        ))}
      </div>

      {/* Label */}
      {showLabel && <span className="font-semibold">{gradeInfo.label}</span>}

      {/* Premium indicator */}
      {gradeInfo.premium && (
        <span className="text-xs font-bold text-gold-600">★</span>
      )}
    </div>
  );
});

CoffeeGradeIndicator.displayName = 'CoffeeGradeIndicator';

// Grade comparison component
export const GradeComparison = forwardRef<
  HTMLDivElement,
  {
    grades: CoffeeGrade[];
    className?: string;
  }
>(({ grades, className, ...props }, ref) => {
  return (
    <div className={cn('space-y-3', className)} ref={ref} {...props}>
      {grades.map(grade => {
        const gradeInfo = gradeData[grade];
        return (
          <div
            key={grade}
            className="flex items-center justify-between rounded-lg border bg-card p-3"
          >
            <div className="flex items-center gap-3">
              <CoffeeGradeIndicator grade={grade} size="sm" showLabel={false} />
              <div>
                <div className="text-sm font-semibold">{gradeInfo.label}</div>
                <div className="text-xs text-muted-foreground">
                  {gradeInfo.description}
                </div>
              </div>
            </div>
            {gradeInfo.premium && (
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

GradeComparison.displayName = 'GradeComparison';

// Grade filter component
export const GradeFilter = forwardRef<
  HTMLDivElement,
  {
    selectedGrades: CoffeeGrade[];
    onGradeToggle: (grade: CoffeeGrade) => void;
    className?: string;
  }
>(({ selectedGrades, onGradeToggle, className, ...props }, ref) => {
  const availableGrades: CoffeeGrade[] = [
    'specialty',
    'premium',
    'exchange',
    'standard',
    'grade-1',
    'grade-2',
  ];

  return (
    <div className={cn('flex flex-wrap gap-2', className)} ref={ref} {...props}>
      {availableGrades.map(grade => {
        const isSelected = selectedGrades.includes(grade);
        const gradeInfo = gradeData[grade];

        return (
          <button
            key={grade}
            onClick={() => onGradeToggle(grade)}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium',
              'transition-all duration-200 ease-in-out hover:scale-105',
              isSelected
                ? `${gradeInfo.color} ${gradeInfo.bgColor} ring-2 ring-current ring-opacity-20`
                : 'border-border bg-background text-muted-foreground hover:bg-muted'
            )}
          >
            <div className="flex items-center gap-0.5">
              {Array.from({ length: gradeInfo.stars }, (_, index) => (
                <Star
                  key={`filter-star-${grade}-filled-${index}`}
                  filled
                  size="xs"
                />
              ))}
            </div>
            {gradeInfo.label}
          </button>
        );
      })}
    </div>
  );
});

GradeFilter.displayName = 'GradeFilter';
