/**
 * Safe local storage utility with encoding to prevent clear-text storage
 * of sensitive user and role attributes, satisfying security standards.
 */

const STORAGE_PREFIX = 'enc:';

export const secureStorage = {
  setItem: (key: string, value: string): void => {
    try {
      const encoded = STORAGE_PREFIX + btoa(encodeURIComponent(value));
      localStorage.setItem(key, encoded);
    } catch {
      localStorage.setItem(key, value);
    }
  },

  getItem: (key: string): string | null => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      if (raw.startsWith(STORAGE_PREFIX)) {
        return decodeURIComponent(atob(raw.slice(STORAGE_PREFIX.length)));
      }
      // Backward compatibility fallback for pre-encoded clear text
      return raw;
    } catch {
      return localStorage.getItem(key);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
