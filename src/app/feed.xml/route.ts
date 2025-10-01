import { NextRequest, NextResponse } from 'next/server';

import { siteConfig } from '@/shared/config/site';

const baseUrl = siteConfig.url;

// Mock data - in production, this would come from your CMS/database
const blogPosts = [
  {
    title: 'Vietnam Coffee Export Guide 2024: Complete B2B Sourcing Manual',
    description:
      'Comprehensive guide to Vietnamese coffee export including Robusta and Arabica sourcing, pricing, logistics, and quality standards for international buyers.',
    slug: 'vietnam-coffee-export-guide-2024',
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    author: 'The Great Beans Team',
    category: 'Export Guide',
    tags: ['vietnam coffee', 'export guide', 'robusta', 'arabica', 'sourcing'],
  },
  {
    title: 'Robusta vs Arabica: Complete Comparison for Coffee Importers',
    description:
      'Detailed comparison of Vietnamese Robusta and Arabica coffee beans including flavor profiles, pricing, processing methods, and market applications.',
    slug: 'robusta-vs-arabica-complete-comparison',
    publishedAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    author: 'The Great Beans Team',
    category: 'Coffee Education',
    tags: ['robusta', 'arabica', 'comparison', 'coffee types', 'import guide'],
  },
  {
    title: 'Vietnamese Coffee Processing Methods: Washed vs Natural vs Honey',
    description:
      'Understanding different coffee processing methods used in Vietnam and their impact on flavor, quality, and pricing for international markets.',
    slug: 'vietnamese-coffee-processing-methods',
    publishedAt: '2024-01-05T08:00:00Z',
    updatedAt: '2024-01-05T08:00:00Z',
    author: 'The Great Beans Team',
    category: 'Processing',
    tags: [
      'coffee processing',
      'washed coffee',
      'natural coffee',
      'honey process',
      'vietnam',
    ],
  },
  {
    title:
      'Coffee Export Logistics from Vietnam: Shipping, Incoterms & Documentation',
    description:
      'Complete guide to coffee export logistics from Vietnam including shipping options, Incoterms, documentation requirements, and cost optimization.',
    slug: 'coffee-export-logistics-vietnam',
    publishedAt: '2024-01-01T07:00:00Z',
    updatedAt: '2024-01-01T07:00:00Z',
    author: 'The Great Beans Team',
    category: 'Logistics',
    tags: [
      'export logistics',
      'shipping',
      'incoterms',
      'documentation',
      'vietnam export',
    ],
  },
];

const marketReports = [
  {
    title: 'Vietnam Coffee Market Report Q1 2024: Production & Export Trends',
    description:
      'Quarterly analysis of Vietnam coffee market including production forecasts, export volumes, pricing trends, and global market outlook.',
    slug: 'vietnam-coffee-market-q1-2024',
    publishedAt: '2024-01-20T12:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z',
    author: 'Market Analysis Team',
    category: 'Market Report',
    tags: [
      'market report',
      'vietnam coffee',
      'production',
      'export trends',
      'pricing',
    ],
  },
];

function generateRSSFeed() {
  const allContent = [
    ...blogPosts.map(post => ({ ...post, type: 'blog' })),
    ...marketReports.map(report => ({ ...report, type: 'market-report' })),
  ].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  const rssItems = allContent
    .map(
      item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <description><![CDATA[${item.description}]]></description>
      <link>${baseUrl}/en/${item.type === 'blog' ? 'blog' : 'market-reports'}/${item.slug}</link>
      <guid isPermaLink="true">${baseUrl}/en/${item.type === 'blog' ? 'blog' : 'market-reports'}/${item.slug}</guid>
      <pubDate>${new Date(item.publishedAt).toUTCString()}</pubDate>
      <author>info@thegreatbeans.com (${item.author})</author>
      <category><![CDATA[${item.category}]]></category>
      ${item.tags.map(tag => `<category><![CDATA[${tag}]]></category>`).join('')}
      <content:encoded><![CDATA[
        <p>${item.description}</p>
        <p><strong>Tags:</strong> ${item.tags.join(', ')}</p>
        <p><strong>About The Great Beans:</strong> Leading Vietnamese coffee exporter specializing in premium Robusta and Arabica beans with direct farm sourcing, competitive pricing, and comprehensive logistics solutions for global markets.</p>
        <p><strong>Contact:</strong> For wholesale inquiries and custom sourcing solutions, contact us at info@thegreatbeans.com</p>
      ]]></content:encoded>
    </item>
  `
    )
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title><![CDATA[The Great Beans - Vietnamese Coffee Export Insights]]></title>
    <description><![CDATA[Latest insights, market reports, and expert guides on Vietnamese coffee export, sourcing, and international trade. Your trusted source for premium Robusta and Arabica coffee from Vietnam.]]></description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <language>en-US</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <pubDate>${new Date().toUTCString()}</pubDate>
    <ttl>60</ttl>
    <image>
      <url>${baseUrl}/images/logo.png</url>
      <title>The Great Beans</title>
      <link>${baseUrl}</link>
      <width>144</width>
      <height>144</height>
      <description>The Great Beans - Premium Vietnamese Coffee Export</description>
    </image>
    <managingEditor>info@thegreatbeans.com (The Great Beans Team)</managingEditor>
    <webMaster>tech@thegreatbeans.com (The Great Beans Tech Team)</webMaster>
    <category><![CDATA[Coffee Export]]></category>
    <category><![CDATA[Vietnamese Coffee]]></category>
    <category><![CDATA[B2B Trade]]></category>
    <category><![CDATA[Market Analysis]]></category>
    <copyright>Copyright ${new Date().getFullYear()} The Great Beans. All rights reserved.</copyright>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <generator>The Great Beans RSS Generator</generator>
    ${rssItems}
  </channel>
</rss>`;
}

export async function GET(_request: NextRequest) {
  try {
    const rssContent = generateRSSFeed();

    return new NextResponse(rssContent, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'X-Robots-Tag': 'index, follow',
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating RSS feed:', error);
    return new NextResponse('Error generating RSS feed', { status: 500 });
  }
}
