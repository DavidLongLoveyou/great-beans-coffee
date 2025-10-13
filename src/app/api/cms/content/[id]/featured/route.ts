import fs from 'fs/promises';
import path from 'path';

import matter from 'gray-matter';

import { NextRequest, NextResponse } from 'next/server';

function getContentDirectory(type: string, locale: string): string {
  const baseDir = path.join(process.cwd(), 'content');

  switch (type) {
    case 'blog':
      return path.join(baseDir, 'blog', locale);
    case 'market-report':
      return path.join(baseDir, 'market-reports', locale);
    case 'origin-story':
      return path.join(baseDir, 'origin-stories', locale);
    case 'service':
      return path.join(baseDir, 'services', locale);
    default:
      throw new Error(`Invalid content type: ${type}`);
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const [type, locale, slug] = id.split('-', 3);

    if (!type || !locale || !slug) {
      return NextResponse.json(
        { success: false, error: 'Invalid content ID format' },
        { status: 400 }
      );
    }

    const contentDir = getContentDirectory(type, locale);
    const filePath = path.join(contentDir, `${slug}.mdx`);

    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    // Read existing content
    const existingContent = await fs.readFile(filePath, 'utf-8');
    const { data: metadata, content } = matter(existingContent);

    // Toggle featured status
    const updatedMetadata: Record<string, unknown> = {
      ...metadata,
      featured: !metadata.featured,
      updatedAt: new Date().toISOString(),
    };

    // If setting as featured, add featuredAt timestamp
    if (updatedMetadata.featured) {
      updatedMetadata.featuredAt = new Date().toISOString();
    } else {
      updatedMetadata.featuredAt = undefined;
    }

    // Write updated content
    const updatedFileContent = matter.stringify(content, updatedMetadata);
    await fs.writeFile(filePath, updatedFileContent, 'utf-8');

    return NextResponse.json({
      success: true,
      data: {
        id,
        type,
        locale,
        filename: `${slug}.mdx`,
        metadata: updatedMetadata,
        content,
        message: `Content ${updatedMetadata.featured ? 'featured' : 'unfeatured'} successfully`,
      },
    });
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to toggle featured status' },
      { status: 500 }
    );
  }
}
