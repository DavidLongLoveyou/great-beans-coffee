'use client';

import { useMemo, useState } from 'react';

// Global counter to ensure unique but predictable IDs
let idCounter = 0;

/**
 * Hook to generate stable IDs that are consistent between server and client
 * This prevents hydration mismatches with Radix UI components
 */
export function useStableId(): string {
  const [id] = useState(() => {
    // Use a simple counter that increments predictably
    // This ensures the same sequence of IDs on both server and client
    return `stable-${++idCounter}`;
  });

  return id;
}

/**
 * Hook to generate stable IDs for Radix UI components
 * Ensures consistent IDs between server and client rendering
 */
export function useRadixStableId(prefix: string = 'radix'): string {
  const baseId = useStableId();
  return `${prefix}-${baseId}`;
}

/**
 * Hook for generating multiple stable IDs
 */
export function useStableIds(count: number, prefix?: string): string[] {
  const baseId = useStableId();

  return useMemo(() => {
    return Array.from({ length: count }, (_, index) => {
      const id = `${baseId}-${index}`;
      return prefix ? `${prefix}-${id}` : id;
    });
  }, [baseId, count, prefix]);
}
