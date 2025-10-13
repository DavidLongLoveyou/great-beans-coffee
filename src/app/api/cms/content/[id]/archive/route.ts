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

    // Update metadata to archived status
    const updatedMetadata = {
      ...metadata,
      status: 'archived',
      archivedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
        message: 'Content archived successfully',
      },
    });
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to archive content' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Update metadata to restore from archive
    const updatedMetadata = {
      ...metadata,
      status: 'draft',
      archivedAt: undefined,
      restoredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

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
        message: 'Content restored from archive successfully',
      },
    });
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to restore content from archive' },
      { status: 500 }
    );
  }
}
