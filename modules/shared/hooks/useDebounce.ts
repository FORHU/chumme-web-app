import { useEffect, useState } from "react";

/**
 * Delays updating the returned value until `delay` milliseconds have elapsed
 * since the last change to `value`. Implemented without any third-party package.
 *
 * @param value  - The value to debounce.
 * @param delay  - Debounce delay in milliseconds (default: 300).
 * @returns The debounced value.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clear the timer if value or delay changes before it fires.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
