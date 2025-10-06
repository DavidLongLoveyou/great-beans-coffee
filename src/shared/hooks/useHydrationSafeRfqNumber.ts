'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to generate hydration-safe RFQ numbers
 * Prevents hydration mismatches by using a stable fallback during SSR
 */
export function useHydrationSafeRfqNumber(): string {
  const [rfqNumber, setRfqNumber] = useState<string>('RFQ-PENDING');

  useEffect(() => {
    // Only generate the actual RFQ number on the client side
    setRfqNumber(`RFQ-${Date.now()}`);
  }, []);

  return rfqNumber;
}
