'use client';

// Session storage keys
export const SESSION_KEYS = {
  USER_PREFERENCES: 'user_preferences',
  LAST_VISITED_PAGE: 'last_visited_page',
  CART_ITEMS: 'cart_items',
  QUOTE_DRAFT: 'quote_draft',
  SEARCH_HISTORY: 'search_history',
  LANGUAGE_PREFERENCE: 'language_preference',
  THEME_PREFERENCE: 'theme_preference',
  REMEMBER_ME: 'remember_me',
  LOGIN_REDIRECT: 'login_redirect',
} as const;

// Local storage keys (for persistent data)
export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'user_settings',
  SAVED_SEARCHES: 'saved_searches',
  FAVORITE_PRODUCTS: 'favorite_products',
  RECENT_QUOTES: 'recent_quotes',
  NOTIFICATION_PREFERENCES: 'notification_preferences',
} as const;

// Type definitions
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  currency: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    marketing: boolean;
  };
  dashboard: {
    layout: 'grid' | 'list';
    itemsPerPage: number;
    defaultView: string;
  };
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  specifications?: Record<string, string | number | boolean>;
  addedAt: string;
}

export interface QuoteDraft {
  id?: string;
  products: Array<{
    productId: string;
    quantity: number;
    specifications?: Record<string, string | number | boolean>;
  }>;
  shippingDetails?: {
    country: string;
    port: string;
    incoterm: string;
  };
  additionalRequirements?: string;
  lastModified: string;
}

export interface SearchHistoryItem {
  query: string;
  filters?: Record<string, string | number | boolean>;
  timestamp: string;
  resultsCount: number;
}

// Session storage utilities
export class SessionStorageManager {
  public static isClient = typeof window !== 'undefined';

  // Generic get method
  static get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isClient) return defaultValue || null;

    try {
      const item = sessionStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      // Silent error handling for session storage
      return defaultValue || null;
    }
  }

  // Generic set method
  static set<T>(key: string, value: T): boolean {
    if (!this.isClient) return false;

    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // Silent error handling for session storage
      return false;
    }
  }

  // Remove item
  static remove(key: string): boolean {
    if (!this.isClient) return false;

    try {
      sessionStorage.removeItem(key);
      return true;
    } catch (error) {
      // Silent error handling for session storage
      return false;
    }
  }

  // Clear all session storage
  static clear(): boolean {
    if (!this.isClient) return false;

    try {
      sessionStorage.clear();
      return true;
    } catch (error) {
      // Silent error handling for session storage
      return false;
    }
  }

  // Check if key exists
  static has(key: string): boolean {
    if (!this.isClient) return false;
    return sessionStorage.getItem(key) !== null;
  }

  // Get all keys
  static getAllKeys(): string[] {
    if (!this.isClient) return [];
    return Object.keys(sessionStorage);
  }

  // Get storage size
  static getSize(): number {
    if (!this.isClient) return 0;

    let total = 0;
    for (let key in sessionStorage) {
      if (sessionStorage.hasOwnProperty(key)) {
        total += sessionStorage[key].length + key.length;
      }
    }
    return total;
  }
}

// Local storage utilities (for persistent data)
export class LocalStorageManager {
  private static isClient = typeof window !== 'undefined';

  // Generic get method
  static get<T>(key: string, defaultValue?: T): T | null {
    if (!this.isClient) return defaultValue || null;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue || null;
      return JSON.parse(item);
    } catch (error) {
      // Silent error handling for local storage
      return defaultValue || null;
    }
  }

  // Generic set method
  static set<T>(key: string, value: T): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      // Silent error handling for local storage
      return false;
    }
  }

  // Remove item
  static remove(key: string): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      // Silent error handling for local storage
      return false;
    }
  }

  // Clear all local storage
  static clear(): boolean {
    if (!this.isClient) return false;

    try {
      localStorage.clear();
      return true;
    } catch (error) {
      // Silent error handling for local storage
      return false;
    }
  }

  // Check if key exists
  static has(key: string): boolean {
    if (!this.isClient) return false;
    return localStorage.getItem(key) !== null;
  }
}

// Specific utility functions for common use cases
export const userPreferencesStorage = {
  get: (): UserPreferences | null =>
    SessionStorageManager.get<UserPreferences>(SESSION_KEYS.USER_PREFERENCES),

  set: (preferences: UserPreferences): boolean =>
    SessionStorageManager.set(SESSION_KEYS.USER_PREFERENCES, preferences),

  update: (updates: Partial<UserPreferences>): boolean => {
    const current = userPreferencesStorage.get();
    if (!current) return false;

    const updated = { ...current, ...updates };
    return userPreferencesStorage.set(updated);
  },

  remove: (): boolean =>
    SessionStorageManager.remove(SESSION_KEYS.USER_PREFERENCES),
};

export const cartStorage = {
  get: (): CartItem[] =>
    SessionStorageManager.get<CartItem[]>(SESSION_KEYS.CART_ITEMS, []) || [],

  set: (items: CartItem[]): boolean =>
    SessionStorageManager.set(SESSION_KEYS.CART_ITEMS, items),

  add: (item: CartItem): boolean => {
    const items = cartStorage.get();
    const existingIndex = items.findIndex(i => i.id === item.id);

    if (existingIndex >= 0) {
      items[existingIndex] = { ...items[existingIndex], ...item };
    } else {
      items.push(item);
    }

    return cartStorage.set(items);
  },

  remove: (itemId: string): boolean => {
    const items = cartStorage.get().filter(item => item.id !== itemId);
    return cartStorage.set(items);
  },

  clear: (): boolean => SessionStorageManager.remove(SESSION_KEYS.CART_ITEMS),

  getCount: (): number => cartStorage.get().length,

  getTotalValue: (): number =>
    cartStorage
      .get()
      .reduce((total, item) => total + item.price * item.quantity, 0),
};

export const quoteDraftStorage = {
  get: (): QuoteDraft | null =>
    SessionStorageManager.get<QuoteDraft>(SESSION_KEYS.QUOTE_DRAFT),

  set: (draft: QuoteDraft): boolean =>
    SessionStorageManager.set(SESSION_KEYS.QUOTE_DRAFT, {
      ...draft,
      lastModified: new Date().toISOString(),
    }),

  update: (updates: Partial<QuoteDraft>): boolean => {
    const current = quoteDraftStorage.get();
    if (!current) return false;

    const updated = {
      ...current,
      ...updates,
      lastModified: new Date().toISOString(),
    };
    return quoteDraftStorage.set(updated);
  },

  remove: (): boolean => SessionStorageManager.remove(SESSION_KEYS.QUOTE_DRAFT),
};

export const searchHistoryStorage = {
  get: (): SearchHistoryItem[] =>
    SessionStorageManager.get<SearchHistoryItem[]>(
      SESSION_KEYS.SEARCH_HISTORY,
      []
    ) || [],

  add: (item: Omit<SearchHistoryItem, 'timestamp'>): boolean => {
    const history = searchHistoryStorage.get();
    const newItem: SearchHistoryItem = {
      ...item,
      timestamp: new Date().toISOString(),
    };

    // Remove duplicate queries
    const filtered = history.filter(h => h.query !== item.query);

    // Add new item at the beginning and limit to 50 items
    const updated = [newItem, ...filtered].slice(0, 50);

    return SessionStorageManager.set(SESSION_KEYS.SEARCH_HISTORY, updated);
  },

  remove: (query: string): boolean => {
    const history = searchHistoryStorage
      .get()
      .filter(item => item.query !== query);
    return SessionStorageManager.set(SESSION_KEYS.SEARCH_HISTORY, history);
  },

  clear: (): boolean =>
    SessionStorageManager.remove(SESSION_KEYS.SEARCH_HISTORY),
};

export const navigationStorage = {
  setLastVisitedPage: (path: string): boolean =>
    SessionStorageManager.set(SESSION_KEYS.LAST_VISITED_PAGE, path),

  getLastVisitedPage: (): string | null =>
    SessionStorageManager.get<string>(SESSION_KEYS.LAST_VISITED_PAGE),

  setLoginRedirect: (path: string): boolean =>
    SessionStorageManager.set(SESSION_KEYS.LOGIN_REDIRECT, path),

  getLoginRedirect: (): string | null =>
    SessionStorageManager.get<string>(SESSION_KEYS.LOGIN_REDIRECT),

  clearLoginRedirect: (): boolean =>
    SessionStorageManager.remove(SESSION_KEYS.LOGIN_REDIRECT),
};

// Cleanup utilities
export const storageCleanup = {
  // Clean up expired session data
  cleanupExpiredData: (): void => {
    if (!SessionStorageManager.isClient) return;

    // Clean up old search history (older than 30 days)
    const history = searchHistoryStorage.get();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filteredHistory = history.filter(
      item => new Date(item.timestamp) > thirtyDaysAgo
    );

    if (filteredHistory.length !== history.length) {
      SessionStorageManager.set(SESSION_KEYS.SEARCH_HISTORY, filteredHistory);
    }

    // Clean up old quote drafts (older than 7 days)
    const quoteDraft = quoteDraftStorage.get();
    if (quoteDraft) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      if (new Date(quoteDraft.lastModified) < sevenDaysAgo) {
        quoteDraftStorage.remove();
      }
    }
  },

  // Clear all user-specific data (on logout)
  clearUserData: (): void => {
    SessionStorageManager.remove(SESSION_KEYS.USER_PREFERENCES);
    SessionStorageManager.remove(SESSION_KEYS.CART_ITEMS);
    SessionStorageManager.remove(SESSION_KEYS.QUOTE_DRAFT);
    SessionStorageManager.remove(SESSION_KEYS.SEARCH_HISTORY);
    SessionStorageManager.remove(SESSION_KEYS.LOGIN_REDIRECT);
  },

  // Clear all session data
  clearAllSessionData: (): void => {
    SessionStorageManager.clear();
  },
};
