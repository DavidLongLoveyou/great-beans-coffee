import fs from 'fs/promises';
import path from 'path';

import matter from 'gray-matter';

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schemas
const ContentMetadataSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(500),
  excerpt: z.string().min(1).max(300),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  locale: z.enum(['en', 'de', 'ja', 'vi']),
  category: z.string().min(1),
  featured: z.boolean().default(false),
  publishedAt: z.string().optional(),
  author: z.string().min(1),
  coverImage: z.string().url().optional(),
  slug: z.string().min(1),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

const CreateContentSchema = z.object({
  content: z.string().min(1),
  metadata: ContentMetadataSchema,
  type: z.enum(['blog', 'market-report', 'origin-story', 'service']),
});

const UpdateContentSchema = z.object({
  content: z.string().min(1).optional(),
  metadata: ContentMetadataSchema.partial().optional(),
});

// Helper functions
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

async function ensureDirectoryExists(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

async function getContentList(type?: string, locale?: string, status?: string) {
  const contentTypes = type
    ? [type]
    : ['blog', 'market-report', 'origin-story', 'service'];
  const locales = locale ? [locale] : ['en', 'es', 'fr', 'pt'];
  const allContent = [];

  for (const contentType of contentTypes) {
    for (const loc of locales) {
      try {
        const contentDir = getContentDirectory(contentType, loc);
        const files = await fs.readdir(contentDir);

        for (const file of files) {
          if (file.endsWith('.mdx')) {
            const filePath = path.join(contentDir, file);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);

            // Type the metadata with defaults
            const typedMetadata = {
              title: metadata.title || '',
              description: metadata.description || '',
              status: metadata.status || 'draft',
              author: metadata.author || '',
              featured: metadata.featured || false,
              category: metadata.category || '',
              locale: metadata.locale || loc,
              slug: metadata.slug || file.replace('.mdx', ''),
              ...metadata,
            };

            // Filter by status if specified
            if (status && typedMetadata.status !== status) {
              continue;
            }

            allContent.push({
              id: `${contentType}-${loc}-${file.replace('.mdx', '')}`,
              type: contentType,
              locale: loc,
              filename: file,
              metadata: typedMetadata,
              content,
              stats: {
                wordCount: content.split(/\s+/).filter(word => word.length > 0)
                  .length,
                lastModified: (await fs.stat(filePath)).mtime.toISOString(),
                size: (await fs.stat(filePath)).size,
              },
            });
          }
        }
      } catch (error) {
        // Directory might not exist, continue
        // Directory read warning removed for production
      }
    }
  }

  return allContent.sort(
    (a, b) =>
      new Date(b.stats.lastModified).getTime() -
      new Date(a.stats.lastModified).getTime()
  );
}

// GET - List all content or get specific content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const locale = searchParams.get('locale');
    const status = searchParams.get('status');
    const id = searchParams.get('id');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Get specific content by ID
    if (id) {
      const [contentType, contentLocale, slug] = id.split('-', 3);

      if (!contentType || !contentLocale || !slug) {
        return NextResponse.json(
          { success: false, error: 'Invalid content ID format' },
          { status: 400 }
        );
      }

      const contentDir = getContentDirectory(contentType, contentLocale);
      const filePath = path.join(contentDir, `${slug}.mdx`);

      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data: metadata, content } = matter(fileContent);

        // Type the metadata with defaults
        const typedMetadata = {
          title: metadata.title || '',
          description: metadata.description || '',
          status: metadata.status || 'draft',
          author: metadata.author || '',
          featured: metadata.featured || false,
          category: metadata.category || '',
          locale: metadata.locale || contentLocale,
          slug: metadata.slug || slug,
          ...metadata,
        };

        return NextResponse.json({
          success: true,
          data: {
            id,
            type: contentType,
            locale: contentLocale,
            slug,
            metadata: typedMetadata,
            content,
            stats: {
              wordCount: content.split(/\s+/).filter(word => word.length > 0)
                .length,
              lastModified: (await fs.stat(filePath)).mtime.toISOString(),
              size: (await fs.stat(filePath)).size,
            },
          },
        });
      } catch (error) {
        return NextResponse.json(
          { success: false, error: 'Content not found' },
          { status: 404 }
        );
      }
    }

    // Get content list
    let content = await getContentList(
      type || undefined,
      locale || undefined,
      status || undefined
    );

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      content = content.filter(
        item =>
          item.metadata.title?.toLowerCase().includes(searchLower) ||
          item.metadata.description?.toLowerCase().includes(searchLower) ||
          item.metadata.category?.toLowerCase().includes(searchLower) ||
          item.content.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const total = content.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedContent = content.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedContent,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: endIndex < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST - Create new content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreateContentSchema.parse(body);

    const { content, metadata, type } = validatedData;

    // Generate slug if not provided
    if (!metadata.slug) {
      metadata.slug = generateSlug(metadata.title);
    }

    // Set timestamps
    const now = new Date().toISOString();
    metadata.publishedAt = metadata.publishedAt || now;

    // Ensure directory exists
    const contentDir = getContentDirectory(type, metadata.locale);
    await ensureDirectoryExists(contentDir);

    // Create file path
    const filename = `${metadata.slug}.mdx`;
    const filePath = path.join(contentDir, filename);

    // Check if file already exists
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { success: false, error: 'Content with this slug already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, which is what we want
    }

    // Create frontmatter and content
    const fileContent = matter.stringify(content, metadata);

    // Write file
    await fs.writeFile(filePath, fileContent, 'utf-8');

    const id = `${type}-${metadata.locale}-${metadata.slug}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          id,
          type,
          locale: metadata.locale,
          filename,
          metadata,
          content,
          message: 'Content created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

// PUT - Update existing content
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateContentSchema.parse(body);

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
    const { data: existingMetadata, content: existingContentBody } =
      matter(existingContent);

    // Merge updates
    const updatedMetadata = {
      ...existingMetadata,
      ...validatedData.metadata,
      updatedAt: new Date().toISOString(),
    };

    const updatedContent = validatedData.content || existingContentBody;

    // Handle slug changes
    if (validatedData.metadata?.slug && validatedData.metadata.slug !== slug) {
      const newFilename = `${validatedData.metadata.slug}.mdx`;
      const newFilePath = path.join(contentDir, newFilename);

      // Check if new slug already exists
      try {
        await fs.access(newFilePath);
        return NextResponse.json(
          { success: false, error: 'Content with this slug already exists' },
          { status: 409 }
        );
      } catch {
        // New slug is available
      }

      // Create new file and delete old one
      const newFileContent = matter.stringify(updatedContent, updatedMetadata);
      await fs.writeFile(newFilePath, newFileContent, 'utf-8');
      await fs.unlink(filePath);

      const newId = `${type}-${locale}-${validatedData.metadata.slug}`;

      return NextResponse.json({
        success: true,
        data: {
          id: newId,
          type,
          locale,
          filename: newFilename,
          metadata: updatedMetadata,
          content: updatedContent,
          message: 'Content updated successfully',
        },
      });
    } else {
      // Update existing file
      const fileContent = matter.stringify(updatedContent, updatedMetadata);
      await fs.writeFile(filePath, fileContent, 'utf-8');

      return NextResponse.json({
        success: true,
        data: {
          id,
          type,
          locale,
          filename: `${slug}.mdx`,
          metadata: updatedMetadata,
          content: updatedContent,
          message: 'Content updated successfully',
        },
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

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

    // Delete file
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    // Error logging removed for production
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
