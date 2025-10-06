/**
 * Utility to normalize and standardize CSS className ordering
 * This helps prevent hydration mismatches caused by inconsistent class ordering
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Enhanced className function that ensures consistent className ordering
 * This prevents hydration mismatches by normalizing class order
 */
export function normalizedCn(...inputs: ClassValue[]) {
  const merged = twMerge(clsx(inputs));

  // Split classes and sort them for consistent ordering
  const classes = merged.split(' ').filter(Boolean);

  // Define priority order for common Tailwind classes
  const classPriority = {
    // Layout
    block: 1,
    inline: 1,
    'inline-block': 1,
    flex: 1,
    'inline-flex': 1,
    grid: 1,
    'inline-grid': 1,
    hidden: 1,
    // Position
    static: 2,
    fixed: 2,
    absolute: 2,
    relative: 2,
    sticky: 2,
    // Display & Visibility
    visible: 3,
    invisible: 3,
    'opacity-': 3,
    // Flexbox & Grid
    'flex-': 4,
    'grid-': 4,
    'items-': 4,
    'justify-': 4,
    'content-': 4,
    'self-': 4,
    'place-': 4,
    // Spacing
    'p-': 5,
    'px-': 5,
    'py-': 5,
    'pt-': 5,
    'pr-': 5,
    'pb-': 5,
    'pl-': 5,
    'm-': 5,
    'mx-': 5,
    'my-': 5,
    'mt-': 5,
    'mr-': 5,
    'mb-': 5,
    'ml-': 5,
    'space-': 5,
    'gap-': 5,
    // Sizing
    'w-': 6,
    'h-': 6,
    'min-w-': 6,
    'min-h-': 6,
    'max-w-': 6,
    'max-h-': 6,
    // Typography
    'text-': 7,
    'font-': 7,
    'leading-': 7,
    'tracking-': 7,
    'line-clamp-': 7,
    // Colors
    'bg-': 8,
    'border-': 8,
    // Borders
    border: 9,
    'border-t': 9,
    'border-r': 9,
    'border-b': 9,
    'border-l': 9,
    rounded: 9,
    'rounded-': 9,
    // Effects
    shadow: 10,
    'shadow-': 10,
    ring: 10,
    'ring-': 10,
    // Transitions
    transition: 11,
    'duration-': 11,
    'ease-': 11,
    'delay-': 11,
    // Transforms
    transform: 12,
    'scale-': 12,
    'rotate-': 12,
    'translate-': 12,
    'skew-': 12,
    // Interactivity
    'cursor-': 13,
    'select-': 13,
    'pointer-events-': 13,
    // States
    'hover:': 14,
    'focus:': 14,
    'active:': 14,
    'disabled:': 14,
    'group-hover:': 14,
    'data-': 14,
    'aria-': 14,
    // Responsive
    'sm:': 15,
    'md:': 15,
    'lg:': 15,
    'xl:': 15,
    '2xl:': 15,
  };

  // Sort classes based on priority
  const sortedClasses = classes.sort((a, b) => {
    const getPriority = (className: string): number => {
      for (const [prefix, priority] of Object.entries(classPriority)) {
        if (className.startsWith(prefix)) {
          return priority;
        }
      }
      return 999; // Unknown classes go to the end
    };

    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    // If same priority, sort alphabetically
    return a.localeCompare(b);
  });

  return sortedClasses.join(' ');
}

/**
 * Normalize className for consistent ordering during SSR/hydration
 */
export function normalizeClassName(className: string): string {
  return normalizedCn(className);
}

/**
 * Utility to merge and normalize multiple className values
 */
export function mergeClassNames(
  ...classNames: (string | undefined | null)[]
): string {
  const validClassNames = classNames.filter(Boolean) as string[];
  return normalizedCn(...validClassNames);
}
