import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

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

function generateUniqueSlug(baseSlug: string, existingFiles: string[]): string {
  let counter = 1;
  let newSlug = `${baseSlug}-copy`;
  
  while (existingFiles.includes(`${newSlug}.mdx`)) {
    counter++;
    newSlug = `${baseSlug}-copy-${counter}`;
  }
  
  return newSlug;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const [type, locale, slug] = id.split('-', 3);
    
    const contentDir = getContentDirectory(type, locale);
    const originalFilePath = path.join(contentDir, `${slug}.mdx`);
    
    // Check if original file exists
    try {
      await fs.access(originalFilePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Original content not found' },
        { status: 404 }
      );
    }
    
    // Read original content
    const originalContent = await fs.readFile(originalFilePath, 'utf-8');
    const { data: originalMetadata, content } = matter(originalContent);
    
    // Get existing files to generate unique slug
    const existingFiles = await fs.readdir(contentDir);
    const newSlug = generateUniqueSlug(slug, existingFiles);
    
    // Create duplicate metadata
    const duplicateMetadata = {
      ...originalMetadata,
      title: `${originalMetadata.title} (Copy)`,
      slug: newSlug,
      status: 'draft',
      featured: false,
      publishedAt: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    // Create duplicate file
    const duplicateFilePath = path.join(contentDir, `${newSlug}.mdx`);
    const duplicateFileContent = matter.stringify(content, duplicateMetadata);
    
    await fs.writeFile(duplicateFilePath, duplicateFileContent, 'utf-8');
    
    const newId = `${type}-${locale}-${newSlug}`;
    
    return NextResponse.json({
      success: true,
      data: {
        id: newId,
        type,
        locale,
        filename: `${newSlug}.mdx`,
        metadata: duplicateMetadata,
        content,
        message: 'Content duplicated successfully',
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Error duplicating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to duplicate content' },
      { status: 500 }
    );
  }
}