'use client';

import { useState, useCallback } from 'react';

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element: string;
  recommendation: string;
}

export interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: string[];
  technicalSEO: {
    hasRobotsTxt: boolean;
    hasSitemap: boolean;
    hasSSL: boolean;
    mobileOptimized: boolean;
  };
}

export interface UseSEOAnalysisReturn {
  analysis: SEOAnalysis | null;
  loading: boolean;
  error: string | null;
  refreshAnalysis: () => void;
}

export function useSEOAnalysis(): UseSEOAnalysisReturn {
  const [analysis, setAnalysis] = useState<SEOAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshAnalysis = useCallback(() => {
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      setAnalysis({
        score: 85,
        issues: [
          {
            type: 'warning',
            message: 'Meta description is too short',
            element: 'meta[name="description"]',
            recommendation:
              'Increase meta description length to 150-160 characters',
          },
          {
            type: 'error',
            message: 'Missing alt text on image',
            element: 'img[src="/hero-image.jpg"]',
            recommendation: 'Add descriptive alt text to improve accessibility',
          },
        ],
        recommendations: [
          'Add structured data for better search visibility',
          'Optimize images for faster loading',
          'Improve internal linking structure',
        ],
        technicalSEO: {
          hasRobotsTxt: true,
          hasSitemap: true,
          hasSSL: true,
          mobileOptimized: true,
        },
      });
      setLoading(false);
    }, 1000);
  }, []);

  return {
    analysis,
    loading,
    error,
    refreshAnalysis,
  };
}
