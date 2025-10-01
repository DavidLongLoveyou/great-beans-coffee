import { seoConfig } from './seo-utils';

// Collection Page Schema for listing pages
export interface CollectionPageSchema {
  '@context': 'https://schema.org';
  '@type': 'CollectionPage';
  name: string;
  description: string;
  url: string;
  mainEntity: {
    '@type': 'ItemList';
    numberOfItems: number;
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      url: string;
      name: string;
      description?: string;
      image?: string;
      datePublished?: string;
      author?: {
        '@type': 'Person';
        name: string;
      };
    }>;
  };
  breadcrumb?: {
    '@type': 'BreadcrumbList';
    itemListElement: Array<{
      '@type': 'ListItem';
      position: number;
      name: string;
      item: string;
    }>;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    url: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
}

// Generate Collection Page schema for blog listing
export function generateBlogCollectionSchema(
  posts: Array<{
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    image?: string;
  }>,
  locale: string,
  category?: string
): CollectionPageSchema {
  const baseUrl = seoConfig.siteUrl;
  const pageUrl = category
    ? `${baseUrl}/${locale}/blog?category=${category}`
    : `${baseUrl}/${locale}/blog`;

  const pageName = category
    ? `${category} - Coffee Industry Insights`
    : 'Coffee Industry Insights & News';

  const pageDescription = category
    ? `Explore ${category} articles and insights from The Great Beans coffee industry experts.`
    : 'Stay updated with the latest trends, market analysis, and insights from the Vietnamese coffee industry.';

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageName,
    description: pageDescription,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: posts.length,
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        name: post.title,
        description: post.description,
        image: post.image ? `${baseUrl}${post.image}` : undefined,
        datePublished: post.publishedAt,
        author: {
          '@type': 'Person',
          name: post.author,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: `${baseUrl}/${locale}/blog`,
        },
        ...(category
          ? [
              {
                '@type': 'ListItem' as const,
                position: 3,
                name: category,
                item: pageUrl,
              },
            ]
          : []),
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
  };
}

// Generate Collection Page schema for market reports listing
export function generateMarketReportsCollectionSchema(
  reports: Array<{
    slug: string;
    title: string;
    description: string;
    publishedAt: string;
    author: string;
    coverImage?: string;
  }>,
  locale: string
): CollectionPageSchema {
  const baseUrl = seoConfig.siteUrl;
  const pageUrl = `${baseUrl}/${locale}/market-reports`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Coffee Market Reports & Analysis',
    description:
      'Comprehensive market reports and analysis on Vietnamese coffee exports, global coffee trends, and industry insights.',
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: reports.length,
      itemListElement: reports.map((report, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/${locale}/market-reports/${report.slug}`,
        name: report.title,
        description: report.description,
        image: report.coverImage ? `${baseUrl}${report.coverImage}` : undefined,
        datePublished: report.publishedAt,
        author: {
          '@type': 'Person',
          name: report.author,
        },
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Market Reports',
          item: pageUrl,
        },
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
  };
}

// Generate Collection Page schema for origin stories listing
export function generateOriginStoriesCollectionSchema(
  stories: Array<{
    slug: string;
    title: string;
    description: string;
    region: string;
    province: string;
    coverImage?: string;
  }>,
  locale: string
): CollectionPageSchema {
  const baseUrl = seoConfig.siteUrl;
  const pageUrl = `${baseUrl}/${locale}/origin-stories`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Vietnamese Coffee Origin Stories',
    description:
      'Discover the unique stories behind Vietnamese coffee regions and their distinctive characteristics.',
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: stories.length,
      itemListElement: stories.map((story, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${baseUrl}/${locale}/origin-stories/${story.slug}`,
        name: story.title,
        description: story.description,
        image: story.coverImage ? `${baseUrl}${story.coverImage}` : undefined,
      })),
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: `${baseUrl}/${locale}`,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Origin Stories',
          item: pageUrl,
        },
      ],
    },
    publisher: {
      '@type': 'Organization',
      name: seoConfig.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo.png`,
      },
    },
  };
}

// Generate simple breadcrumb schema
