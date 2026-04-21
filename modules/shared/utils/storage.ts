/**
 * Storage utilities for the web using localStorage and sessionStorage.
 */

export type StorageType = "local" | "session";

export async function getStorageData<T>(key: string): Promise<T | null> {
  if (typeof window === "undefined") return null;

  // Check localStorage first, then sessionStorage
  const data = localStorage.getItem(key) || sessionStorage.getItem(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch {
    return data as unknown as T;
  }
}

export async function setStorageData(
  key: string,
  value: unknown,
  type: StorageType = "local",
): Promise<void> {
  if (typeof window === "undefined") return;

  const data = typeof value === "string" ? value : JSON.stringify(value);
  const storage = type === "local" ? localStorage : sessionStorage;

  // Ensure we don't have stale data in the other storage
  const otherStorage = type === "local" ? sessionStorage : localStorage;
  otherStorage.removeItem(key);

  storage.setItem(key, data);
}

export async function removeStorageData(key: string): Promise<void> {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}
