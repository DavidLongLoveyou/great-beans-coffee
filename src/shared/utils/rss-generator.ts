import { ContentManager } from '@/lib/contentlayer';

import { seoConfig } from './seo-utils';

import { Locale } from '@/i18n';

interface RSSItem {
  title: string;
  link: string;
  description: string;
  author: string;
  date: Date;
  category: string;
  image?: string;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '&':
        return '&amp;';
      case "'":
        return '&apos;';
      case '"':
        return '&quot;';
      default:
        return c;
    }
  });
}

/**
 * Generate RSS 2.0 XML from items
 */
function generateRSSXML(
  title: string,
  description: string,
  link: string,
  language: string,
  items: RSSItem[]
): string {
  const now = new Date().toUTCString();

  const itemsXML = items
    .map(
      item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${escapeXml(item.link)}</link>
      <description><![CDATA[${item.description}]]></description>
      <author>${escapeXml(seoConfig.contactEmail)} (${escapeXml(item.author)})</author>
      <category>${escapeXml(item.category)}</category>
      <pubDate>${item.date.toUTCString()}</pubDate>
      <guid isPermaLink="true">${escapeXml(item.link)}</guid>
      ${item.image ? `<enclosure url="${escapeXml(item.image)}" type="image/jpeg" />` : ''}
    </item>`
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title><![CDATA[${title}]]></title>
    <description><![CDATA[${description}]]></description>
    <link>${escapeXml(link)}</link>
    <language>${escapeXml(language)}</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${escapeXml(seoConfig.siteUrl)}/images/logo.png</url>
      <title><![CDATA[${title}]]></title>
      <link>${escapeXml(link)}</link>
    </image>
    <atom:link href="${escapeXml(link)}/feed.xml" rel="self" type="application/rss+xml" />
    ${itemsXML}
  </channel>
</rss>`;
}

/**
 * Generate RSS feed for blog posts in a specific locale
 */
export async function generateBlogRSSFeed(locale: Locale): Promise<string> {
  const contentManager = new ContentManager();
  const blogPosts = await contentManager.getBlogPosts(locale);

  const items: RSSItem[] = blogPosts.map(post => ({
    title: post.title,
    link: `${seoConfig.siteUrl}/${locale}/blog/${post.slug}`,
    description: post.excerpt,
    author: post.author,
    date: new Date(post.publishedAt),
    category: 'Blog',
    image: post.coverImage
      ? `${seoConfig.siteUrl}${post.coverImage}`
      : undefined,
  }));

  return generateRSSXML(
    `${seoConfig.siteName} - Blog (${locale.toUpperCase()})`,
    `Latest coffee industry insights and news from ${seoConfig.siteName}`,
    `${seoConfig.siteUrl}/${locale}/blog`,
    locale,
    items
  );
}

/**
 * Generate RSS feed for market reports in a specific locale
 */
export async function generateMarketReportsRSSFeed(
  locale: Locale
): Promise<string> {
  const contentManager = new ContentManager();
  const marketReports = await contentManager.getMarketReports(locale);

  const items: RSSItem[] = marketReports.map(report => ({
    title: report.title,
    link: `${seoConfig.siteUrl}/${locale}/market-reports/${report.slug}`,
    description: report.excerpt,
    author: report.author,
    date: new Date(report.publishedAt),
    category: 'Market Report',
    image: report.coverImage
      ? `${seoConfig.siteUrl}${report.coverImage}`
      : undefined,
  }));

  return generateRSSXML(
    `${seoConfig.siteName} - Market Reports (${locale.toUpperCase()})`,
    `Coffee market analysis and reports from ${seoConfig.siteName}`,
    `${seoConfig.siteUrl}/${locale}/market-reports`,
    locale,
    items
  );
}

/**
 * Generate RSS feed for origin stories in a specific locale
 */
export async function generateOriginStoriesRSSFeed(
  locale: Locale
): Promise<string> {
  const contentManager = new ContentManager();
  const originStories = await contentManager.getOriginStories(locale);

  const items: RSSItem[] = originStories.map(story => ({
    title: story.title,
    link: `${seoConfig.siteUrl}/${locale}/origin-stories/${story.slug}`,
    description: story.excerpt,
    author: story.author,
    date: new Date(story.publishedAt),
    category: 'Origin Story',
    image: story.coverImage
      ? `${seoConfig.siteUrl}${story.coverImage}`
      : undefined,
  }));

  return generateRSSXML(
    `${seoConfig.siteName} - Origin Stories (${locale.toUpperCase()})`,
    `Coffee origin stories and farm profiles from ${seoConfig.siteName}`,
    `${seoConfig.siteUrl}/${locale}/origin-stories`,
    locale,
    items
  );
}

/**
 * Generate combined RSS feed for all content types in a specific locale
 */
export async function generateAllContentRSSFeed(
  locale: Locale
): Promise<string> {
  const contentManager = new ContentManager();
  const [blogPosts, marketReports, originStories] = await Promise.all([
    contentManager.getBlogPosts(locale),
    contentManager.getMarketReports(locale),
    contentManager.getOriginStories(locale),
  ]);

  // Combine all content and sort by date
  const allContent: RSSItem[] = [
    ...blogPosts.map(post => ({
      title: post.title,
      link: `${seoConfig.siteUrl}/${locale}/blog/${post.slug}`,
      description: post.excerpt,
      author: post.author,
      date: new Date(post.publishedAt),
      category: 'Blog',
      image: post.coverImage
        ? `${seoConfig.siteUrl}${post.coverImage}`
        : undefined,
    })),
    ...marketReports.map(report => ({
      title: report.title,
      link: `${seoConfig.siteUrl}/${locale}/market-reports/${report.slug}`,
      description: report.excerpt,
      author: report.author,
      date: new Date(report.publishedAt),
      category: 'Market Report',
      image: report.coverImage
        ? `${seoConfig.siteUrl}${report.coverImage}`
        : undefined,
    })),
    ...originStories.map(story => ({
      title: story.title,
      link: `${seoConfig.siteUrl}/${locale}/origin-stories/${story.slug}`,
      description: story.excerpt,
      author: story.author,
      date: new Date(story.publishedAt),
      category: 'Origin Story',
      image: story.coverImage
        ? `${seoConfig.siteUrl}${story.coverImage}`
        : undefined,
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return generateRSSXML(
    `${seoConfig.siteName} - All Content (${locale.toUpperCase()})`,
    `Latest content from ${seoConfig.siteName} - Coffee industry insights, market reports, and origin stories`,
    `${seoConfig.siteUrl}/${locale}`,
    locale,
    allContent
  );
}
