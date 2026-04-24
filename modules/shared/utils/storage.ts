/**
 * Storage utilities for the web using Cookies for cross-tab persistence
 * and server-side compatibility.
 */

export type StorageType = "local" | "session";

// Helper to set a cookie
export function setCookie(name: string, value: string, days?: number) {
  if (typeof document === "undefined") return;
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  const encodedValue = encodeURIComponent(value);
  document.cookie = `${name}=${encodedValue}${expires}; path=/; SameSite=Lax`;
}

// Helper to get a cookie
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(";").shift();
    if (cookieValue) {
      try {
        return decodeURIComponent(cookieValue);
      } catch {
        return cookieValue;
      }
    }
  }
  return null;
}

// Helper to remove a cookie
export function removeCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
}

function tryParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export async function getStorageData<T>(key: string): Promise<T | null> {
  if (typeof window === "undefined") return null;

  // 1. Try Cookie (most reliable for cross-tab)
  const cookieData = getCookie(key);
  if (cookieData) {
    const parsed = tryParseJSON<T>(cookieData);
    if (parsed) return parsed;
    return cookieData as unknown as T;
  }

  // 2. Try LocalStorage
  const localData = localStorage.getItem(key);
  if (localData) {
    const parsed = tryParseJSON<T>(localData);
    if (parsed) return parsed;
    return localData as unknown as T;
  }

  // 3. Try SessionStorage
  const sessionData = sessionStorage.getItem(key);
  if (sessionData) {
    const parsed = tryParseJSON<T>(sessionData);
    if (parsed) return parsed;
    return sessionData as unknown as T;
  }

  return null;
}

export async function setStorageData(
  key: string,
  value: unknown,
  type: StorageType = "local",
): Promise<void> {
  if (typeof window === "undefined") return;

  const stringValue = typeof value === "string" ? value : JSON.stringify(value);

  // Set Cookie
  const expiryDays = type === "local" ? 7 : undefined;
  setCookie(key, stringValue, expiryDays);

  // Set Local/Session
  const storage = type === "local" ? localStorage : sessionStorage;
  const otherStorage = type === "local" ? sessionStorage : localStorage;
  
  otherStorage.removeItem(key);
  storage.setItem(key, stringValue);
}

export async function removeStorageData(key: string): Promise<void> {
  if (typeof window === "undefined") return;
  
  removeCookie(key);
  localStorage.removeItem(key);
  sessionStorage.removeItem(key);
}

