'use client';

import { useEffect, useState } from 'react';

/**
 * Hook for managing state that might cause hydration mismatches
 * Ensures the initial state is consistent between server and client
 */
export function useHydrationSafeState<T>(
  initialValue: T,
  clientInitialValue?: T
): [T, React.Dispatch<React.SetStateAction<T>>, boolean] {
  const [state, setState] = useState<T>(initialValue);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (
      clientInitialValue !== undefined &&
      clientInitialValue !== initialValue
    ) {
      setState(clientInitialValue);
    }
  }, [clientInitialValue, initialValue]);

  return [state, setState, isMounted];
}

/**
 * Hook specifically for boolean states that should be false during SSR
 * Common use case: modal open states, mobile menu states, etc.
 */
export function useHydrationSafeBooleanState(
  initialValue: boolean = false
): [boolean, React.Dispatch<React.SetStateAction<boolean>>, boolean] {
  return useHydrationSafeState(initialValue, false);
}
