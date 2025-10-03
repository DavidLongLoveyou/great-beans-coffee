'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import { CoreWebVitalsMonitor } from '../performance/CoreWebVitalsMonitor';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId: string | Date,
      config?: Record<string, string | number | boolean>
    ) => void;
    dataLayer: any[];
  }
}

// Analytics configuration
interface AnalyticsConfig {
  googleAnalyticsId?: string;
  enableGoogleAnalytics: boolean;
  enableWebVitals: boolean;
  enableEcommerce: boolean;
  enableCustomEvents: boolean;
  enableConsoleLogging: boolean;
  enableVisualIndicator: boolean;
  cookieConsent: boolean;
  debugMode: boolean;
}

// E-commerce event data
interface EcommerceEventData {
  transaction_id?: string;
  value?: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    quantity: number;
    price: number;
    item_brand?: string;
    item_category2?: string;
    item_category3?: string;
    item_variant?: string;
  }>;
  coupon?: string;
  shipping?: number;
  tax?: number;
}

// Custom event data
interface CustomEventData {
  event_category?: string;
  event_label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

// User properties
interface UserProperties {
  user_id?: string;
  customer_type?: 'B2B' | 'B2C';
  subscription_status?: string;
  preferred_language?: string;
  country?: string;
  industry?: string;
  company_size?: string;
}

// Analytics context
interface AnalyticsContextType {
  config: AnalyticsConfig;
  isLoaded: boolean;
  trackPageView: (url: string, title?: string) => void;
  trackEvent: (eventName: string, eventData?: CustomEventData) => void;
  trackEcommerce: (eventName: string, eventData: EcommerceEventData) => void;
  setUserProperties: (properties: UserProperties) => void;
  setConsent: (consent: boolean) => void;
  enableAnalytics: () => void;
  disableAnalytics: () => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | null>(null);

// Default configuration
const defaultConfig: AnalyticsConfig = {
  ...(process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
  }),
  enableGoogleAnalytics: true,
  enableWebVitals: true,
  enableEcommerce: true,
  enableCustomEvents: true,
  enableConsoleLogging: process.env.NODE_ENV === 'development',
  enableVisualIndicator: process.env.NODE_ENV === 'development',
  cookieConsent: false,
  debugMode: process.env.NODE_ENV === 'development',
};

interface AnalyticsProviderProps {
  children: React.ReactNode;
  config?: Partial<AnalyticsConfig>;
}

/**
 * Analytics Provider Component
 *
 * Provides comprehensive analytics functionality including:
 * - Google Analytics 4 integration
 * - Core Web Vitals monitoring
 * - E-commerce tracking
 * - Custom event tracking
 * - User properties and consent management
 * - GDPR compliance features
 */
export function AnalyticsProvider({
  children,
  config: userConfig = {},
}: AnalyticsProviderProps) {
  const config = { ...defaultConfig, ...userConfig };
  const [isLoaded, setIsLoaded] = useState(false);
  const [consentGiven, setConsentGiven] = useState(config.cookieConsent);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initializedRef = useRef(false);

  // Initialize Google Analytics
  const initializeGA = () => {
    if (!config.googleAnalyticsId || !consentGiven) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };

    window.gtag('js', new Date());
    window.gtag('config', config.googleAnalyticsId, {
      page_title: document.title,
      page_location: window.location.href,
      debug_mode: config.debugMode,
      send_page_view: false, // We'll handle page views manually
    });

    // Configure enhanced e-commerce
    if (config.enableEcommerce) {
      window.gtag('config', config.googleAnalyticsId, {
        custom_map: {
          custom_parameter_1: 'customer_type',
          custom_parameter_2: 'industry',
          custom_parameter_3: 'company_size',
        },
      } as any);
    }

    setIsLoaded(true);
    initializedRef.current = true;

    if (config.enableConsoleLogging) {
      console.log('[Analytics] Google Analytics initialized');
    }
  };

  // Track page view
  const trackPageView = (url: string, title?: string) => {
    if (!isLoaded || !consentGiven) return;

    window.gtag('config', config.googleAnalyticsId!, {
      page_title: title || document.title,
      page_location: url,
    });

    if (config.enableConsoleLogging) {
      console.log('[Analytics] Page view tracked:', { url, title });
    }
  };

  // Track custom event
  const trackEvent = (eventName: string, eventData: CustomEventData = {}) => {
    if (!isLoaded || !consentGiven) return;

    const {
      event_category,
      event_label,
      value,
      custom_parameters = {},
    } = eventData;

    const eventParams: any = {
      ...custom_parameters,
    };

    if (event_category !== undefined)
      eventParams.event_category = event_category;
    if (event_label !== undefined) eventParams.event_label = event_label;
    if (value !== undefined) eventParams.value = value;

    window.gtag('event', eventName, eventParams);

    if (config.enableConsoleLogging) {
      console.log('[Analytics] Event tracked:', { eventName, eventData });
    }
  };

  // Track e-commerce event
  const trackEcommerce = (eventName: string, eventData: EcommerceEventData) => {
    if (!isLoaded || !consentGiven || !config.enableEcommerce) return;

    window.gtag('event', eventName, eventData as any);

    if (config.enableConsoleLogging) {
      console.log('[Analytics] E-commerce event tracked:', {
        eventName,
        eventData,
      });
    }
  };

  // Set user properties
  const setUserProperties = (properties: UserProperties) => {
    if (!isLoaded || !consentGiven) return;

    window.gtag('config', config.googleAnalyticsId!, {
      user_properties: properties,
    } as any);

    if (config.enableConsoleLogging) {
      console.log('[Analytics] User properties set:', properties);
    }
  };

  // Set consent
  const setConsent = (consent: boolean) => {
    setConsentGiven(consent);

    if (consent && !initializedRef.current) {
      initializeGA();
    }

    if (window.gtag) {
      (window.gtag as any)('consent', 'update', {
        analytics_storage: consent ? 'granted' : 'denied',
        ad_storage: consent ? 'granted' : 'denied',
      });
    }

    if (config.enableConsoleLogging) {
      console.log('[Analytics] Consent updated:', consent);
    }
  };

  // Enable analytics
  const enableAnalytics = () => {
    setConsent(true);
  };

  // Disable analytics
  const disableAnalytics = () => {
    setConsent(false);
  };

  // Track page changes
  useEffect(() => {
    if (!isLoaded || !consentGiven) return;

    const url =
      pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    trackPageView(url);
  }, [pathname, searchParams, isLoaded, consentGiven]);

  // Initialize on mount
  useEffect(() => {
    if (consentGiven && !initializedRef.current) {
      initializeGA();
    }
  }, [consentGiven]);

  // Track user engagement
  useEffect(() => {
    if (!isLoaded || !consentGiven) return;

    let engagementTimer: NodeJS.Timeout;
    let scrollDepth = 0;
    let maxScrollDepth = 0;

    // Track scroll depth
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      scrollDepth = Math.round((scrollTop / documentHeight) * 100);

      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;

        // Track scroll milestones
        if (maxScrollDepth >= 25 && maxScrollDepth < 50) {
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            value: 25,
          });
        } else if (maxScrollDepth >= 50 && maxScrollDepth < 75) {
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            value: 50,
          });
        } else if (maxScrollDepth >= 75 && maxScrollDepth < 90) {
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            value: 75,
          });
        } else if (maxScrollDepth >= 90) {
          trackEvent('scroll_depth', {
            event_category: 'engagement',
            value: 90,
          });
        }
      }
    };

    // Track time on page
    const startTime = Date.now();
    engagementTimer = setInterval(() => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);

      // Track engagement milestones
      if (timeOnPage === 30) {
        trackEvent('time_on_page', { event_category: 'engagement', value: 30 });
      } else if (timeOnPage === 60) {
        trackEvent('time_on_page', { event_category: 'engagement', value: 60 });
      } else if (timeOnPage === 180) {
        trackEvent('time_on_page', {
          event_category: 'engagement',
          value: 180,
        });
      }
    }, 1000);

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearInterval(engagementTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoaded, consentGiven]);

  const contextValue: AnalyticsContextType = {
    config,
    isLoaded,
    trackPageView,
    trackEvent,
    trackEcommerce,
    setUserProperties,
    setConsent,
    enableAnalytics,
    disableAnalytics,
  };

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {/* Google Analytics Script */}
      {config.enableGoogleAnalytics &&
        config.googleAnalyticsId &&
        consentGiven && (
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${config.googleAnalyticsId}`}
            strategy="afterInteractive"
            onLoad={() => {
              if (!initializedRef.current) {
                initializeGA();
              }
            }}
          />
        )}

      {/* Core Web Vitals Monitor */}
      {config.enableWebVitals && (
        <CoreWebVitalsMonitor
          enableAnalytics={isLoaded && consentGiven}
          enableConsoleLogging={config.enableConsoleLogging}
          enableVisualIndicator={config.enableVisualIndicator}
          onMetricCapture={metric => {
            if (config.enableCustomEvents) {
              trackEvent('web_vitals', {
                event_category: 'performance',
                event_label: metric.name,
                value: Math.round(
                  metric.name === 'CLS' ? metric.value * 1000 : metric.value
                ),
                custom_parameters: {
                  metric_rating: metric.rating,
                  metric_delta: metric.delta,
                  navigation_type: metric.navigationType,
                },
              });
            }
          }}
        />
      )}

      {children}
    </AnalyticsContext.Provider>
  );
}

// Hook to use analytics
export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
}

// Higher-order component for tracking page views
export function withAnalytics<P extends object>(
  Component: React.ComponentType<P>,
  eventName?: string
) {
  return function AnalyticsWrappedComponent(props: P) {
    const { trackEvent } = useAnalytics();

    useEffect(() => {
      if (eventName) {
        trackEvent(eventName, {
          event_category: 'page_interaction',
          event_label: Component.displayName || Component.name,
        });
      }
    }, []);

    return <Component {...props} />;
  };
}

export default AnalyticsProvider;
