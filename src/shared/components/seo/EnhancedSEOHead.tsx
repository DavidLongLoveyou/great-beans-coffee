'use client';

import { type Metadata } from 'next';
import Script from 'next/script';
import { type Locale } from '@/i18n';
import { 
  AdvancedSEOMetadata, 
  advancedSEOManager 
} from '@/shared/utils/advanced-seo-manager';
import { 
  schemaGenerators,
  type CoffeeProductData,
  type B2BServiceData,
  type ArticleData,
  type MarketReportData,
  type OriginStoryData,
} from '@/shared/utils/schema-generators';

/**
 * Enhanced SEO Head Component for The Great Beans
 * Provides comprehensive Technical SEO including:
 * - Advanced meta tags and Open Graph optimization
 * - Schema.org structured data for all content types
 * - International SEO with hreflang
 * - Core Web Vitals optimization
 * - AI and voice search optimization
 */

export interface EnhancedSEOProps {
  // Basic SEO metadata
  metadata: AdvancedSEOMetadata;
  
  // Content-specific data for Schema.org generation
  productData?: CoffeeProductData;
  serviceData?: B2BServiceData;
  articleData?: ArticleData;
  reportData?: MarketReportData;
  originStoryData?: OriginStoryData;
  
  // Collection page data
  collectionData?: {
    items: Array<{ name: string; url: string; description?: string }>;
    collectionType: 'products' | 'articles' | 'services' | 'reports';
  };
  
  // Breadcrumb navigation
  breadcrumbs?: Array<{ name: string; url: string }>;
  
  // FAQ data for AI optimization
  faqs?: Array<{ question: string; answer: string }>;
  
  // Custom structured data
  customSchemas?: Record<string, any>[];
  
  // Performance optimization
  preloadResources?: Array<{
    href: string;
    as: 'image' | 'font' | 'script' | 'style';
    type?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
  }>;
  
  // Analytics and tracking
  enableAnalytics?: boolean;
  enableCoreWebVitalsTracking?: boolean;
}

export function EnhancedSEOHead({
  metadata,
  productData,
  serviceData,
  articleData,
  reportData,
  originStoryData,
  collectionData,
  breadcrumbs,
  faqs,
  customSchemas = [],
  preloadResources = [],
  enableAnalytics = true,
  enableCoreWebVitalsTracking = true,
}: EnhancedSEOProps) {
  // Generate all structured data schemas
  const schemas: Record<string, any>[] = [];
  
  // Always include organization and website schemas
  schemas.push(advancedSEOManager.generateOrganizationSchema());
  schemas.push(advancedSEOManager.generateWebsiteSchema(metadata.locale));
  
  // Add breadcrumb schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(advancedSEOManager.generateBreadcrumbSchema(breadcrumbs));
  }
  
  // Add FAQ schema if provided
  if (faqs && faqs.length > 0) {
    schemas.push(advancedSEOManager.generateFAQSchema(faqs));
  }
  
  // Add content-specific schemas
  if (productData) {
    schemas.push(schemaGenerators.generateCoffeeProductSchema(productData, metadata.locale));
  }
  
  if (serviceData) {
    schemas.push(schemaGenerators.generateB2BServiceSchema(serviceData, metadata.locale));
  }
  
  if (articleData) {
    schemas.push(schemaGenerators.generateArticleSchema(articleData, metadata.locale));
  }
  
  if (reportData) {
    schemas.push(schemaGenerators.generateMarketReportSchema(reportData, metadata.locale));
  }
  
  if (originStoryData) {
    schemas.push(schemaGenerators.generateOriginStorySchema(originStoryData, metadata.locale));
  }
  
  if (collectionData) {
    schemas.push(
      schemaGenerators.generateCollectionPageSchema(
        metadata.title,
        metadata.description,
        collectionData.items,
        metadata.locale,
        collectionData.collectionType
      )
    );
  }
  
  // Add custom schemas
  schemas.push(...customSchemas);
  
  // Validate all schemas
  const validSchemas = schemas.filter(schema => 
    advancedSEOManager.validateStructuredData(schema)
  );
  
  // Generate Next.js metadata
  const nextMetadata = advancedSEOManager.generateMetadata(metadata);
  
  return (
    <>
      {/* Preload critical resources */}
      {preloadResources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          type={resource.type}
          crossOrigin={resource.crossOrigin}
        />
      ))}
      
      {/* DNS prefetch for external resources */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//res.cloudinary.com" />
      
      {/* Preconnect to critical third-party origins */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://res.cloudinary.com" />
      
      {/* Structured Data - JSON-LD */}
      {validSchemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`structured-data-${index}`}
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema, null, 0),
          }}
        />
      ))}
      
      {/* Enhanced meta tags for AI and voice search */}
      <meta name="robots" content={nextMetadata.robots || 'index, follow'} />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      
      {/* Content classification for AI */}
      <meta name="content-type" content={metadata.contentType} />
      <meta name="content-language" content={metadata.locale} />
      <meta name="audience" content="business professionals, coffee industry, B2B buyers" />
      <meta name="subject" content="coffee export, Vietnamese coffee, B2B coffee solutions" />
      <meta name="classification" content="business, agriculture, food industry, international trade" />
      
      {/* Enhanced Open Graph for better social sharing */}
      <meta property="og:site_name" content="The Great Beans" />
      <meta property="og:locale" content={metadata.locale} />
      {metadata.alternateLocales?.map(locale => (
        <meta key={locale} property="og:locale:alternate" content={locale} />
      ))}
      
      {/* Twitter Card enhancements */}
      <meta name="twitter:site" content="@thegreatbeans" />
      <meta name="twitter:creator" content="@thegreatbeans" />
      <meta name="twitter:domain" content="thegreatbeans.com" />
      
      {/* Enhanced mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="The Great Beans" />
      <meta name="application-name" content="The Great Beans" />
      
      {/* Security headers */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      <meta name="referrer" content="strict-origin-when-cross-origin" />
      
      {/* Performance hints */}
      <meta httpEquiv="Accept-CH" content="DPR, Viewport-Width, Width" />
      <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      
      {/* Favicon and app icons */}
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
      <link rel="manifest" href="/manifest.json" />
      
      {/* Theme colors */}
      <meta name="theme-color" content="#8B4513" />
      <meta name="msapplication-TileColor" content="#8B4513" />
      <meta name="msapplication-config" content="/browserconfig.xml" />
      
      {/* Analytics and tracking */}
      {enableAnalytics && (
        <>
          {/* Google Analytics 4 */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: '${metadata.title}',
                page_location: window.location.href,
                content_group1: '${metadata.contentType}',
                content_group2: '${metadata.locale}',
                custom_map: {
                  'dimension1': 'content_type',
                  'dimension2': 'locale',
                  'dimension3': 'user_type'
                }
              });
            `}
          </Script>
          
          {/* Enhanced ecommerce tracking for B2B */}
          {(productData || serviceData) && (
            <Script id="enhanced-ecommerce" strategy="afterInteractive">
              {`
                gtag('event', 'view_item', {
                  currency: '${productData?.price?.currency || 'USD'}',
                  value: ${productData?.price?.amount || 0},
                  items: [{
                    item_id: '${productData?.id || serviceData?.id}',
                    item_name: '${productData?.name || serviceData?.name}',
                    item_category: '${productData ? 'Coffee Product' : 'B2B Service'}',
                    item_variant: '${productData?.variety || serviceData?.serviceType}',
                    price: ${productData?.price?.amount || 0},
                    quantity: 1
                  }]
                });
              `}
            </Script>
          )}
        </>
      )}
      
      {/* Core Web Vitals tracking */}
      {enableCoreWebVitalsTracking && (
        <Script id="core-web-vitals" strategy="afterInteractive">
          {`
            import {getCLS, getFID, getFCP, getLCP, getTTFB} from 'web-vitals';
            
            function sendToAnalytics(metric) {
              gtag('event', metric.name, {
                event_category: 'Web Vitals',
                event_label: metric.id,
                value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                non_interaction: true,
                custom_map: {
                  'metric_value': metric.value,
                  'metric_delta': metric.delta,
                  'metric_id': metric.id,
                  'metric_entries': metric.entries.length
                }
              });
            }
            
            getCLS(sendToAnalytics);
            getFID(sendToAnalytics);
            getFCP(sendToAnalytics);
            getLCP(sendToAnalytics);
            getTTFB(sendToAnalytics);
          `}
        </Script>
      )}
      
      {/* Schema.org validation script (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <Script id="schema-validation" strategy="afterInteractive">
          {`
            console.group('🔍 Schema.org Validation');
            const schemas = document.querySelectorAll('script[type="application/ld+json"]');
            schemas.forEach((schema, index) => {
              try {
                const data = JSON.parse(schema.textContent);
                console.log(\`Schema \${index + 1} (\${data['@type']}):\`, data);
                
                // Basic validation
                if (!data['@context'] || !data['@type']) {
                  console.warn(\`⚠️ Schema \${index + 1} missing required @context or @type\`);
                }
                
                // Validate required fields based on type
                if (data['@type'] === 'Organization' && (!data.name || !data.url)) {
                  console.warn(\`⚠️ Organization schema missing required fields\`);
                }
                
                if (data['@type'] === 'Product' && (!data.name || !data.description)) {
                  console.warn(\`⚠️ Product schema missing required fields\`);
                }
                
              } catch (error) {
                console.error(\`❌ Invalid JSON-LD in schema \${index + 1}:\`, error);
              }
            });
            console.groupEnd();
          `}
        </Script>
      )}
    </>
  );
}

export default EnhancedSEOHead;