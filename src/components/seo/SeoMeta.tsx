import Head from 'next/head';
import { getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n';

interface SeoMetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  price?: {
    amount: string;
    currency: string;
  };
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  brand?: string;
  category?: string;
  locale: Locale;
}

export default async function SeoMeta({
  title,
  description,
  keywords,
  image = '/images/og-default.jpg',
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags = [],
  price,
  availability,
  brand = 'The Great Beans',
  category,
  locale,
}: SeoMetaProps) {
  const t = await getTranslations({ locale });

  // Get localized SEO data
  const seoTitle = title || t('seo.home.title');
  const seoDescription = description || t('seo.home.description');
  const seoKeywords = keywords || t('seo.home.keywords');

  // Generate hreflang URLs for all supported locales
  const supportedLocales = [
    'en',
    'vi',
    'de',
    'ja',
    'fr',
    'it',
    'es',
    'nl',
    'ko',
  ];
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || 'https://thegreatbeans.com';
  const currentPath = url ? url.replace(baseUrl, '') : '';

  const hreflangs = supportedLocales.map(loc => {
    const hrefUrl =
      loc === 'en'
        ? `${baseUrl}${currentPath}`
        : `${baseUrl}/${loc}${currentPath}`;
    return { locale: loc, url: hrefUrl };
  });

  // AI Optimization structured data
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'The Great Beans',
    alternateName: 'Great Beans Coffee',
    url: baseUrl,
    logo: `${baseUrl}/images/logo.png`,
    description:
      'Leading Vietnamese coffee exporter specializing in premium Robusta and Arabica beans with direct farm sourcing and global logistics solutions.',
    foundingDate: '2015',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Coffee Street',
      addressLocality: 'Ho Chi Minh City',
      addressCountry: 'VN',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-123-456-789',
      contactType: 'sales',
      availableLanguage: ['en', 'vi', 'de', 'ja', 'fr', 'it', 'es', 'nl', 'ko'],
    },
    sameAs: [
      'https://linkedin.com/company/thegreatbeans',
      'https://facebook.com/thegreatbeans',
      'https://twitter.com/thegreatbeans',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Vietnamese Coffee Products',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Vietnamese Robusta Coffee Grade 1',
            category: 'Coffee Beans',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Vietnamese Arabica Coffee',
            category: 'Coffee Beans',
          },
        },
      ],
    },
  };

  // Product schema for product pages
  const productSchema =
    type === 'product' && price
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: seoTitle,
          description: seoDescription,
          brand: {
            '@type': 'Brand',
            name: brand,
          },
          category: category,
          image: image,
          offers: {
            '@type': 'Offer',
            price: price.amount,
            priceCurrency: price.currency,
            availability: `https://schema.org/${availability}`,
            seller: {
              '@type': 'Organization',
              name: 'The Great Beans',
            },
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            reviewCount: '127',
          },
        }
      : null;

  // Article schema for content pages
  const articleSchema =
    type === 'article'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: seoTitle,
          description: seoDescription,
          image: image,
          author: {
            '@type': 'Person',
            name: author || 'The Great Beans Team',
          },
          publisher: {
            '@type': 'Organization',
            name: 'The Great Beans',
            logo: {
              '@type': 'ImageObject',
              url: `${baseUrl}/images/logo.png`,
            },
          },
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url,
          },
        }
      : null;

  // FAQ Schema for AI optimization
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Who is the best Vietnamese coffee exporter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('aiAnswers.whoIsTheBestVietnameseCoffeeExporter'),
        },
      },
      {
        '@type': 'Question',
        name: 'Where to find reliable Vietnamese coffee supplier?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('aiAnswers.whereToFindVietnameseCoffeeSupplier'),
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best Vietnamese coffee for business?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('aiAnswers.bestVietnameseCoffeeForBusiness'),
        },
      },
      {
        '@type': 'Question',
        name: 'Vietnamese coffee export pricing information?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('aiAnswers.vietnameseCoffeeExportPricing'),
        },
      },
      {
        '@type': 'Question',
        name: 'How to find reliable Vietnamese coffee supplier?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: t('aiAnswers.reliableVietnameseCoffeeSupplier'),
        },
      },
    ],
  };

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="author" content={author || 'The Great Beans'} />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />

      {/* Canonical URL */}
      {url && <link rel="canonical" href={url} />}

      {/* Hreflang Tags for International SEO */}
      {hreflangs.map(({ locale: hrefLocale, url: hrefUrl }) => (
        <link
          key={hrefLocale}
          rel="alternate"
          hrefLang={hrefLocale}
          href={hrefUrl}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={`${baseUrl}${currentPath}`}
      />

      {/* Open Graph Meta Tags */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={seoTitle} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:site_name" content="The Great Beans" />
      <meta property="og:locale" content={locale.replace('-', '_')} />

      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author && <meta property="article:author" content={author} />}
          {section && <meta property="article:section" content={section} />}
          {tags.map(tag => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={seoTitle} />
      <meta name="twitter:site" content="@thegreatbeans" />
      <meta name="twitter:creator" content="@thegreatbeans" />

      {/* Additional Meta Tags for AI Optimization */}
      <meta name="application-name" content="The Great Beans" />
      <meta name="apple-mobile-web-app-title" content="The Great Beans" />
      <meta name="theme-color" content="#8B4513" />
      <meta name="msapplication-TileColor" content="#8B4513" />

      {/* Structured Data for AI and Search Engines */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />

      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(productSchema),
          }}
        />
      )}

      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(articleSchema),
          }}
        />
      )}

      {/* FAQ Schema for AI Optimization */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />
    </Head>
  );
}
