'use client';

import React, { forwardRef } from 'react';

import { cn } from '@/shared/utils/cn';

import { TastingNotesProps, TastingNoteCategory } from '../types';

// Tasting note categories and their notes
const tastingNoteData: Record<
  TastingNoteCategory,
  {
    name: string;
    icon: string;
    color: string;
    bgColor: string;
    notes: string[];
  }
> = {
  fruity: {
    name: 'Fruity',
    icon: '🍓',
    color: 'text-red-700',
    bgColor: 'bg-red-50 border-red-200',
    notes: [
      'Berry',
      'Cherry',
      'Apple',
      'Citrus',
      'Orange',
      'Lemon',
      'Lime',
      'Grape',
      'Peach',
      'Apricot',
      'Pineapple',
      'Mango',
      'Blackberry',
      'Blueberry',
      'Strawberry',
      'Cranberry',
      'Pomegranate',
    ],
  },
  floral: {
    name: 'Floral',
    icon: '🌸',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50 border-pink-200',
    notes: [
      'Jasmine',
      'Rose',
      'Lavender',
      'Hibiscus',
      'Orange Blossom',
      'Elderflower',
      'Honeysuckle',
      'Violet',
      'Chamomile',
    ],
  },
  nutty: {
    name: 'Nutty',
    icon: '🥜',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    notes: [
      'Almond',
      'Hazelnut',
      'Walnut',
      'Pecan',
      'Peanut',
      'Cashew',
      'Pistachio',
      'Macadamia',
      'Brazil Nut',
    ],
  },
  chocolatey: {
    name: 'Chocolatey',
    icon: '🍫',
    color: 'text-brown-700',
    bgColor: 'bg-amber-50 border-amber-300',
    notes: [
      'Dark Chocolate',
      'Milk Chocolate',
      'Cocoa',
      'Cacao',
      'Mocha',
      'Bittersweet',
      'Semi-Sweet',
      'White Chocolate',
    ],
  },
  spicy: {
    name: 'Spicy',
    icon: '🌶️',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    notes: [
      'Cinnamon',
      'Clove',
      'Nutmeg',
      'Cardamom',
      'Ginger',
      'Allspice',
      'Black Pepper',
      'White Pepper',
      'Paprika',
      'Chili',
    ],
  },
  earthy: {
    name: 'Earthy',
    icon: '🌍',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    notes: [
      'Soil',
      'Mushroom',
      'Forest Floor',
      'Moss',
      'Cedar',
      'Pine',
      'Tobacco',
      'Leather',
      'Wet Earth',
      'Mineral',
    ],
  },
  sweet: {
    name: 'Sweet',
    icon: '🍯',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    notes: [
      'Honey',
      'Caramel',
      'Vanilla',
      'Maple Syrup',
      'Brown Sugar',
      'Molasses',
      'Toffee',
      'Butterscotch',
      'Sugar Cane',
    ],
  },
  herbal: {
    name: 'Herbal',
    icon: '🌿',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50 border-emerald-200',
    notes: [
      'Mint',
      'Basil',
      'Thyme',
      'Rosemary',
      'Sage',
      'Tea',
      'Grass',
      'Hay',
      'Fresh Herbs',
      'Dried Herbs',
    ],
  },
  'wine-like': {
    name: 'Wine-like',
    icon: '🍷',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    notes: [
      'Red Wine',
      'White Wine',
      'Port',
      'Sherry',
      'Brandy',
      'Rum',
      'Whiskey',
      'Fermented',
      'Winey',
      'Boozy',
    ],
  },
  citrus: {
    name: 'Citrus',
    icon: '🍋',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50 border-yellow-200',
    notes: [
      'Lemon',
      'Lime',
      'Orange',
      'Grapefruit',
      'Tangerine',
      'Citrus Zest',
    ],
  },
  berry: {
    name: 'Berry',
    icon: '🫐',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50 border-purple-200',
    notes: [
      'Blueberry',
      'Blackberry',
      'Raspberry',
      'Strawberry',
      'Cranberry',
      'Elderberry',
    ],
  },
  tropical: {
    name: 'Tropical',
    icon: '🥭',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50 border-orange-200',
    notes: [
      'Mango',
      'Pineapple',
      'Papaya',
      'Passion Fruit',
      'Coconut',
      'Guava',
    ],
  },
  caramel: {
    name: 'Caramel',
    icon: '🍮',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50 border-amber-200',
    notes: [
      'Caramel',
      'Toffee',
      'Butterscotch',
      'Brown Sugar',
      'Molasses',
      'Maple',
    ],
  },
  vanilla: {
    name: 'Vanilla',
    icon: '🌿',
    color: 'text-green-700',
    bgColor: 'bg-green-50 border-green-200',
    notes: ['Vanilla', 'Custard', 'Cream', 'Sweet Spice', 'Aromatic', 'Smooth'],
  },
  other: {
    name: 'Other',
    icon: '✨',
    color: 'text-slate-700',
    bgColor: 'bg-slate-50 border-slate-200',
    notes: [
      'Butter',
      'Cream',
      'Milk',
      'Cheese',
      'Bread',
      'Toast',
      'Roasted',
      'Smoky',
      'Burnt',
      'Ash',
      'Carbon',
      'Rubber',
      'Plastic',
    ],
  },
};

// Size styles
const noteSizes = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-1 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-sm',
  xl: 'px-4 py-2 text-base',
};

export const TastingNotes = forwardRef<HTMLDivElement, TastingNotesProps>(
  (
    {
      className,
      notes,
      size = 'md',
      variant = 'default',
      maxDisplay,
      showCategories = false,
      interactive = false,
      onNoteClick,
      ...props
    },
    ref
  ) => {
    const displayNotes = maxDisplay ? notes.slice(0, maxDisplay) : notes;
    const remainingCount =
      maxDisplay && notes.length > maxDisplay ? notes.length - maxDisplay : 0;

    // Group notes by category if showCategories is true
    const groupedNotes = showCategories
      ? notes.reduce(
          (acc, note) => {
            const category = findNoteCategory(note);
            if (!acc[category]) acc[category] = [];
            acc[category].push(note);
            return acc;
          },
          {} as Record<TastingNoteCategory, string[]>
        )
      : null;

    if (showCategories && groupedNotes) {
      return (
        <div className={cn('space-y-3', className)} ref={ref} {...props}>
          {Object.entries(groupedNotes).map(([category, categoryNotes]) => {
            const categoryInfo =
              tastingNoteData[category as TastingNoteCategory];
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryInfo.icon}</span>
                  <span className="text-sm font-semibold text-muted-foreground">
                    {categoryInfo.name}
                  </span>
                </div>
                <div className="ml-6 flex flex-wrap gap-1">
                  {categoryNotes.map(note => (
                    <TastingNote
                      key={note}
                      note={note}
                      size={size}
                      variant={variant}
                      interactive={interactive}
                      onClick={
                        onNoteClick
                          ? noteValue => onNoteClick(noteValue, category)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    return (
      <div
        className={cn('flex flex-wrap gap-1', className)}
        ref={ref}
        {...props}
      >
        {displayNotes.map(note => {
          const category = findNoteCategory(note);
          return (
            <TastingNote
              key={note}
              note={note}
              size={size}
              variant={variant}
              interactive={interactive}
              onClick={
                onNoteClick
                  ? noteValue => onNoteClick(noteValue, category)
                  : undefined
              }
            />
          );
        })}
        {remainingCount > 0 && (
          <span
            className={cn(
              'inline-flex items-center rounded-md border font-medium',
              'border-border bg-muted text-muted-foreground',
              noteSizes[size]
            )}
          >
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  }
);

TastingNotes.displayName = 'TastingNotes';

// Individual tasting note component
export const TastingNote = forwardRef<
  HTMLSpanElement,
  {
    note: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'subtle' | 'outline';
    interactive?: boolean;
    onClick?: (note: string) => void;
    className?: string;
  }
>(
  (
    {
      note,
      size = 'md',
      variant = 'default',
      interactive = false,
      onClick,
      className,
      ...props
    },
    ref
  ) => {
    const category = findNoteCategory(note);
    const categoryInfo = tastingNoteData[category];

    const baseClasses = cn(
      'inline-flex items-center rounded-md border font-medium transition-all duration-200',
      noteSizes[size],
      variant === 'default' && `${categoryInfo.color} ${categoryInfo.bgColor}`,
      variant === 'subtle' && 'text-muted-foreground bg-muted border-border',
      variant === 'outline' &&
        `${categoryInfo.color} border-current bg-transparent`,
      interactive && 'cursor-pointer hover:scale-105 hover:shadow-sm',
      className
    );

    return (
      <span
        className={baseClasses}
        onClick={interactive && onClick ? () => onClick(note) : undefined}
        title={`${note} (${categoryInfo.name})`}
        ref={ref}
        {...props}
      >
        {note}
      </span>
    );
  }
);

TastingNote.displayName = 'TastingNote';

// Tasting notes selector
export const TastingNotesSelector = forwardRef<
  HTMLDivElement,
  {
    selectedNotes: string[];
    onNoteToggle: (note: string) => void;
    categories?: TastingNoteCategory[];
    className?: string;
  }
>(({ selectedNotes, onNoteToggle, categories, className, ...props }, ref) => {
  const categoriesToShow =
    categories || (Object.keys(tastingNoteData) as TastingNoteCategory[]);

  return (
    <div className={cn('space-y-4', className)} ref={ref} {...props}>
      {categoriesToShow.map(category => {
        const categoryInfo = tastingNoteData[category];
        return (
          <div key={category} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{categoryInfo.icon}</span>
              <span className="text-sm font-semibold">{categoryInfo.name}</span>
            </div>
            <div className="ml-6 flex flex-wrap gap-1">
              {categoryInfo.notes.map(note => {
                const isSelected = selectedNotes.includes(note);
                return (
                  <button
                    key={note}
                    onClick={() => onNoteToggle(note)}
                    className={cn(
                      'rounded-md border px-2.5 py-1 text-sm font-medium transition-all duration-200',
                      'hover:scale-105',
                      isSelected
                        ? `${categoryInfo.color} ${categoryInfo.bgColor} ring-2 ring-current ring-opacity-20`
                        : 'border-border bg-background text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {note}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
});

TastingNotesSelector.displayName = 'TastingNotesSelector';

// Flavor wheel component
export const FlavorWheel = forwardRef<
  HTMLDivElement,
  {
    notes: string[];
    className?: string;
  }
>(({ notes, className, ...props }, ref) => {
  const categoryCounts = notes.reduce(
    (acc, note) => {
      const category = findNoteCategory(note);
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<TastingNoteCategory, number>
  );

  const totalNotes = notes.length;

  return (
    <div
      className={cn('rounded-xl border bg-card p-6', className)}
      ref={ref}
      {...props}
    >
      <h3 className="mb-4 text-center text-lg font-bold">Flavor Profile</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Object.entries(categoryCounts).map(([category, count]) => {
          const categoryInfo = tastingNoteData[category as TastingNoteCategory];
          const percentage = Math.round((count / totalNotes) * 100);

          return (
            <div
              key={category}
              className={cn(
                'rounded-lg border p-3 text-center',
                categoryInfo.bgColor,
                categoryInfo.color
              )}
            >
              <div className="mb-1 text-2xl">{categoryInfo.icon}</div>
              <div className="text-sm font-semibold">{categoryInfo.name}</div>
              <div className="text-xs opacity-75">{percentage}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

FlavorWheel.displayName = 'FlavorWheel';

// Helper function to find note category
function findNoteCategory(note: string): TastingNoteCategory {
  for (const [category, data] of Object.entries(tastingNoteData)) {
    if (data.notes.some(n => n.toLowerCase() === note.toLowerCase())) {
      return category as TastingNoteCategory;
    }
  }
  return 'other';
}
