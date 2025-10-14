import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

// Schema for validating the ID parameter
const IdParamsSchema = z.object({
  id: z.string().min(1, 'Content ID is required'),
});

// Schema for query parameters
const GetContentQuerySchema = z.object({
  includeContent: z
    .string()
    .optional()
    .transform(val => val === 'true'),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;

    // Validate the ID parameter
    const { id } = IdParamsSchema.parse(resolvedParams);

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryData = {
      includeContent: searchParams.get('includeContent') || undefined,
    };

    const { includeContent } = GetContentQuerySchema.parse(queryData);

    // Content directory
    const contentDir = path.join(process.cwd(), 'content');

    // Search for the content file across all type directories
    const contentTypes = ['blog', 'market-report', 'origin-story', 'service'];
    let foundContent = null;
    let _foundFilePath = null;

    for (const type of contentTypes) {
      const typeDir = path.join(contentDir, type);

      try {
        // Check if type directory exists
        await fs.access(typeDir);

        // Check for locale subdirectories
        const typeContents = await fs.readdir(typeDir);

        // Check both direct files and locale subdirectories
        for (const item of typeContents) {
          const itemPath = path.join(typeDir, item);
          const stat = await fs.stat(itemPath);

          if (stat.isDirectory()) {
            // This is a locale directory, check files inside
            const localeFiles = await fs.readdir(itemPath);

            for (const file of localeFiles) {
              if (file.endsWith('.mdx')) {
                const filePath = path.join(itemPath, file);
                const fileContent = await fs.readFile(filePath, 'utf-8');
                const { data: metadata, content } = matter(fileContent);

                // Check if this is the content we're looking for
                const fileId = path.basename(file, '.mdx');
                const slug = metadata.slug || fileId;

                if (slug === id || fileId === id) {
                  foundContent = {
                    id: slug,
                    type,
                    locale: metadata.locale || item, // Use directory name as locale
                    filename: file,
                    metadata,
                    ...(includeContent && { content }),
                  };
                  _foundFilePath = filePath;
                  break;
                }
              }
            }
          } else if (item.endsWith('.mdx')) {
            // Direct file in type directory
            const filePath = path.join(typeDir, item);
            const fileContent = await fs.readFile(filePath, 'utf-8');
            const { data: metadata, content } = matter(fileContent);

            const fileId = path.basename(item, '.mdx');
            const slug = metadata.slug || fileId;

            if (slug === id || fileId === id) {
              foundContent = {
                id: slug,
                type,
                locale: metadata.locale || 'en',
                filename: item,
                metadata,
                ...(includeContent && { content }),
              };
              _foundFilePath = filePath;
              break;
            }
          }
        }

        if (foundContent) break;
      } catch (error) {
        // Type directory doesn't exist or other error, continue to next type
        continue;
      }
    }

    if (!foundContent) {
      return NextResponse.json(
        {
          success: false,
          error: 'Content not found',
          message: `No content found with ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: foundContent,
    });
  } catch (error) {
    // Error logging removed for production

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to retrieve content',
      },
      { status: 500 }
    );
  }
}
