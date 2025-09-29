import { ContentManager } from '@/lib/contentlayer';
import type { Locale } from '@/i18n';
import type { BlogPost, MarketReport, OriginStory, ServicePage } from 'contentlayer/generated';

// RSS Configuration
export const rssConfig = {
  title: 'The Great Beans - Premium Coffee Export Platform',
  description: 'Latest insights, market reports, and origin stories from Vietnam\'s leading coffee export platform',
  link: 'https://greatbeans.coffee',
  language: 'en-US',
  copyright: `© ${new Date().getFullYear()} The Great Beans Coffee Export Platform`,
  managingEditor: 'info@greatbeans.coffee (The Great Beans Team)',
  webMaster: 'tech@greatbeans.coffee (The Great Beans Tech Team)',
  category: 'Coffee, Export, Business, Vietnam',
  ttl: 60, // Time to live in minutes
  image: {
    url: 'https://res.cloudinary.com/greatbeans/image/upload/v1/branding/logo-rss.png',
    title: 'The Great Beans',
    link: 'https://greatbeans.coffee',
    width: 144,
    height: 144,
  },
};

// RSS Item interface
export interface RSSItem {
  title: string;
  description: string;
  link: string;
  guid: string;
  pubDate: string;
  category?: string[];
  author?: string;
  enclosure?: {
    url: string;
    type: string;
    length: number;
  };
}

// RSS Channel interface
export interface RSSChannel {
  title: string;
  description: string;
  link: string;
  language: string;
  lastBuildDate: string;
  pubDate: string;
  copyright: string;
  managingEditor: string;
  webMaster: string;
  category: string;
  ttl: number;
  image: {
    url: string;
    title: string;
    link: string;
    width: number;
    height: number;
  };
  items: RSSItem[];
}

/**
 * Convert content to RSS item
 */
function contentToRSSItem(
  content: BlogPost | MarketReport | OriginStory | ServicePage,
  type: 'blog' | 'market-reports' | 'origin-stories' | 'services',
  locale: Locale
): RSSItem {
  const baseUrl = 'https://greatbeans.coffee';
  const link = `${baseUrl}/${locale}/${type}/${content.slug}`;
  
  return {
    title: content.seoTitle || content.title,
    description: content.seoDescription || content.description || content.excerpt || '',
    link,
    guid: link,
    pubDate: new Date(content.publishedAt).toUTCString(),
    category: content.tags || (content.category ? [content.category] : undefined),
    author: 'info@greatbeans.coffee (The Great Beans Team)',
    ...(content.coverImage && {
      enclosure: {
        url: content.coverImage,
        type: 'image/jpeg',
        length: 0, // Will be calculated if needed
      },
    }),
  };
}

/**
 * Generate RSS XML from channel data
 */
export function generateRSSXML(channel: RSSChannel): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  
  const rssXML = `${xmlHeader}
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${channel.title}]]></title>
    <description><![CDATA[${channel.description}]]></description>
    <link>${channel.link}</link>
    <language>${channel.language}</language>
    <lastBuildDate>${channel.lastBuildDate}</lastBuildDate>
    <pubDate>${channel.pubDate}</pubDate>
    <copyright><![CDATA[${channel.copyright}]]></copyright>
    <managingEditor>${channel.managingEditor}</managingEditor>
    <webMaster>${channel.webMaster}</webMaster>
    <category><![CDATA[${channel.category}]]></category>
    <ttl>${channel.ttl}</ttl>
    <image>
      <url>${channel.image.url}</url>
      <title><![CDATA[${channel.image.title}]]></title>
      <link>${channel.image.link}</link>
      <width>${channel.image.width}</width>
      <height>${channel.image.height}</height>
    </image>
    <atom:link href="${channel.link}/rss.xml" rel="self" type="application/rss+xml" />
    ${channel.items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.guid}</guid>
      <pubDate>${item.pubDate}</pubDate>
      ${item.author ? `<author>${item.author}</author>` : ''}
      ${item.category ? item.category.map(cat => `<category><![CDATA[${cat}]]></category>`).join('\n      ') : ''}
      ${item.enclosure ? `<enclosure url="${item.enclosure.url}" type="${item.enclosure.type}" length="${item.enclosure.length}" />` : ''}
    </item>`).join('')}
  </channel>
</rss>`;

  return rssXML;
}

/**
 * Generate RSS feed for blog posts
 */
export function generateBlogRSS(locale: Locale = 'en'): string {
  const blogPosts = ContentManager.getBlogPosts(locale).slice(0, 20); // Latest 20 posts
  const items = blogPosts.map(post => contentToRSSItem(post, 'blog', locale));
  
  const channel: RSSChannel = {
    ...rssConfig,
    title: `${rssConfig.title} - Blog`,
    description: 'Latest blog posts about coffee industry insights, market trends, and export strategies',
    link: `${rssConfig.link}/${locale}/blog`,
    language: locale === 'vi' ? 'vi-VN' : 'en-US',
    lastBuildDate: new Date().toUTCString(),
    pubDate: items.length > 0 ? items[0].pubDate : new Date().toUTCString(),
    items,
  };

  return generateRSSXML(channel);
}

/**
 * Generate RSS feed for market reports
 */
export function generateMarketReportsRSS(locale: Locale = 'en'): string {
  const reports = ContentManager.getMarketReports(locale).slice(0, 20);
  const items = reports.map(report => contentToRSSItem(report, 'market-reports', locale));
  
  const channel: RSSChannel = {
    ...rssConfig,
    title: `${rssConfig.title} - Market Reports`,
    description: 'Latest market analysis and reports on Vietnam coffee export industry',
    link: `${rssConfig.link}/${locale}/market-reports`,
    language: locale === 'vi' ? 'vi-VN' : 'en-US',
    lastBuildDate: new Date().toUTCString(),
    pubDate: items.length > 0 ? items[0].pubDate : new Date().toUTCString(),
    items,
  };

  return generateRSSXML(channel);
}

/**
 * Generate RSS feed for origin stories
 */
export function generateOriginStoriesRSS(locale: Locale = 'en'): string {
  const stories = ContentManager.getOriginStories(locale).slice(0, 20);
  const items = stories.map(story => contentToRSSItem(story, 'origin-stories', locale));
  
  const channel: RSSChannel = {
    ...rssConfig,
    title: `${rssConfig.title} - Origin Stories`,
    description: 'Discover the stories behind Vietnam\'s finest coffee regions and farmers',
    link: `${rssConfig.link}/${locale}/origin-stories`,
    language: locale === 'vi' ? 'vi-VN' : 'en-US',
    lastBuildDate: new Date().toUTCString(),
    pubDate: items.length > 0 ? items[0].pubDate : new Date().toUTCString(),
    items,
  };

  return generateRSSXML(channel);
}

/**
 * Generate combined RSS feed for all content
 */
export function generateAllContentRSS(locale: Locale = 'en'): string {
  const blogPosts = ContentManager.getBlogPosts(locale).slice(0, 10);
  const reports = ContentManager.getMarketReports(locale).slice(0, 10);
  const stories = ContentManager.getOriginStories(locale).slice(0, 10);
  
  const allItems: RSSItem[] = [
    ...blogPosts.map(post => contentToRSSItem(post, 'blog', locale)),
    ...reports.map(report => contentToRSSItem(report, 'market-reports', locale)),
    ...stories.map(story => contentToRSSItem(story, 'origin-stories', locale)),
  ];

  // Sort by publication date (newest first)
  allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  const channel: RSSChannel = {
    ...rssConfig,
    title: `${rssConfig.title} - All Content`,
    description: 'Latest content from The Great Beans: blog posts, market reports, and origin stories',
    link: `${rssConfig.link}/${locale}`,
    language: locale === 'vi' ? 'vi-VN' : 'en-US',
    lastBuildDate: new Date().toUTCString(),
    pubDate: allItems.length > 0 ? allItems[0].pubDate : new Date().toUTCString(),
    items: allItems.slice(0, 20), // Latest 20 items across all content types
  };

  return generateRSSXML(channel);
}

/**
 * Generate RSS feed for specific content cluster
 */
export function generateContentClusterRSS(
  clusterName: string,
  locale: Locale = 'en'
): string {
  let items: RSSItem[] = [];
  let description = '';
  
  switch (clusterName.toLowerCase()) {
    case 'vietnam-robusta-suppliers':
      const robustaStories = ContentManager.getOriginStoriesByVariety(locale, 'Robusta');
      const robustaReports = ContentManager.getMarketReports(locale)
        .filter(report => report.tags?.some(tag => tag.toLowerCase().includes('robusta')));
      
      items = [
        ...robustaStories.map(story => contentToRSSItem(story, 'origin-stories', locale)),
        ...robustaReports.map(report => contentToRSSItem(report, 'market-reports', locale)),
      ];
      description = 'Latest content about Vietnam Robusta coffee suppliers, market trends, and origin stories';
      break;
      
    case 'specialty-arabica-sourcing':
      const arabicaStories = ContentManager.getOriginStoriesByVariety(locale, 'Arabica');
      const arabicaReports = ContentManager.getMarketReports(locale)
        .filter(report => report.tags?.some(tag => tag.toLowerCase().includes('arabica')));
      
      items = [
        ...arabicaStories.map(story => contentToRSSItem(story, 'origin-stories', locale)),
        ...arabicaReports.map(report => contentToRSSItem(report, 'market-reports', locale)),
      ];
      description = 'Latest content about specialty Arabica coffee sourcing, quality standards, and premium origins';
      break;
      
    case 'private-label-coffee-manufacturing':
      const privateServices = ContentManager.getServicePages(locale)
        .filter(service => service.tags?.some(tag => tag.toLowerCase().includes('private') || tag.toLowerCase().includes('oem')));
      const manufacturingReports = ContentManager.getMarketReports(locale)
        .filter(report => report.tags?.some(tag => tag.toLowerCase().includes('manufacturing') || tag.toLowerCase().includes('private')));
      
      items = [
        ...privateServices.map(service => contentToRSSItem(service, 'services', locale)),
        ...manufacturingReports.map(report => contentToRSSItem(report, 'market-reports', locale)),
      ];
      description = 'Latest content about private label coffee manufacturing, OEM services, and custom branding solutions';
      break;
      
    default:
      return generateAllContentRSS(locale);
  }
  
  // Sort by publication date
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
  
  const channel: RSSChannel = {
    ...rssConfig,
    title: `${rssConfig.title} - ${clusterName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    description,
    link: `${rssConfig.link}/${locale}`,
    language: locale === 'vi' ? 'vi-VN' : 'en-US',
    lastBuildDate: new Date().toUTCString(),
    pubDate: items.length > 0 ? items[0].pubDate : new Date().toUTCString(),
    items: items.slice(0, 20),
  };

  return generateRSSXML(channel);
}