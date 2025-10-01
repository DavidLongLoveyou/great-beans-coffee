'use client';

import { useEffect } from 'react';
import { initializePerformanceOptimizations } from '@/shared/utils/performance-optimization';

/**
 * Performance Initializer Component
 * 
 * Initializes performance optimizations on the client side:
 * - Preconnects to external domains
 * - Preloads critical fonts and images
 * - Sets up resource monitoring
 * - Configures performance hints
 */
export function PerformanceInitializer() {
  useEffect(() => {
    // Initialize performance optimizations
    initializePerformanceOptimizations();

    // Add critical resource hints to document head
    const addResourceHint = (href: string, rel: string, as?: string, type?: string) => {
      // Check if hint already exists
      const existing = document.querySelector(`link[href="${href}"][rel="${rel}"]`);
      if (existing) return;

      const link = document.createElement('link');
      link.rel = rel;
      link.href = href;
      if (as) link.as = as;
      if (type) link.type = type;
      if (rel === 'preconnect' || rel === 'dns-prefetch') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    };

    // Preconnect to critical external domains
    const criticalDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://res.cloudinary.com',
      'https://images.unsplash.com',
    ];

    criticalDomains.forEach(domain => {
      addResourceHint(domain, 'preconnect');
      addResourceHint(domain, 'dns-prefetch');
    });

    // Preload critical fonts (using Google Fonts)
    const criticalFonts = [
      'https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
      'https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtXK-F2qO0isEw.woff2',
    ];

    criticalFonts.forEach(font => {
      addResourceHint(font, 'preload', 'font', 'font/woff2');
    });

    // Add viewport meta tag for mobile optimization if not present
    if (!document.querySelector('meta[name="viewport"]')) {
      const viewport = document.createElement('meta');
      viewport.name = 'viewport';
      viewport.content = 'width=device-width, initial-scale=1, viewport-fit=cover';
      document.head.appendChild(viewport);
    }

    // Add theme-color meta tag for PWA
    if (!document.querySelector('meta[name="theme-color"]')) {
      const themeColor = document.createElement('meta');
      themeColor.name = 'theme-color';
      themeColor.content = '#8B4513'; // Coffee brown color
      document.head.appendChild(themeColor);
    }

    // Optimize scroll behavior for better performance
    if ('scrollBehavior' in document.documentElement.style) {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    // Set up intersection observer for lazy loading optimization
    if ('IntersectionObserver' in window) {
      // Enable native lazy loading for images
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (!img.getAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
      });
    }

    // Performance monitoring setup
    if ('PerformanceObserver' in window) {
      // Monitor long tasks
      try {
        const longTaskObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.duration > 50) {
              console.warn(`Long task detected: ${entry.duration}ms`);
            }
          });
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
      } catch (e) {
        // Long task API not supported
      }

      // Monitor layout shifts
      try {
        const clsObserver = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
              console.log(`Layout shift detected: ${(entry as any).value}`);
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        // Layout shift API not supported
      }
    }

    // Service Worker registration for caching (if available)
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
    }

  }, []);

  // This component doesn't render anything
  return null;
}