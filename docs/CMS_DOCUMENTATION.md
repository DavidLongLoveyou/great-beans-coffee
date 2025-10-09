# Content Management System (CMS) Documentation

## Overview

The Great Beans Coffee CMS is a comprehensive content management system built for managing multilingual content including blog posts, market reports, origin stories, and service pages. The system provides a modern, intuitive interface for content creation, editing, and management.

## Features

### Core Features
- **Content Creation & Editing**: Rich MDX editor with live preview
- **Multilingual Support**: Content management across 4 locales (EN, ES, FR, PT)
- **Content Types**: Blog posts, market reports, origin stories, service pages
- **Advanced Search**: Full-text search with filtering and sorting
- **Content Validation**: Real-time validation with scoring system
- **Version Control**: Built-in content versioning and history
- **SEO Optimization**: Built-in SEO tools and metadata management

### Content Management
- **CRUD Operations**: Create, read, update, delete content
- **Bulk Operations**: Archive, duplicate, feature content
- **Status Management**: Draft, published, archived states
- **Category & Tagging**: Organize content with categories and tags
- **Author Management**: Multi-author support with attribution

## Architecture

### Component Structure
```
src/presentation/components/cms/
├── ContentEditor.tsx      # Main content editing interface
├── ContentPreview.tsx     # Content preview with device simulation
├── ContentList.tsx        # Content listing with filters and actions
├── ContentValidator.tsx   # Content validation and scoring
├── ContentFilters.tsx     # Advanced filtering interface
├── ContentSearch.tsx      # Comprehensive search interface
└── index.ts              # Component exports
```

### API Endpoints
```
src/app/api/cms/
├── content/
│   ├── route.ts                    # GET, POST content
│   ├── [id]/
│   │   ├── route.ts               # GET, PUT, DELETE specific content
│   │   ├── duplicate/route.ts     # POST duplicate content
│   │   ├── archive/route.ts       # POST/DELETE archive/restore
│   │   └── featured/route.ts      # POST toggle featured status
├── search/route.ts                 # POST search content
└── stats/route.ts                  # GET content statistics
```

### Hooks & Utilities
```
src/shared/hooks/
├── useContentSearch.ts    # Content search functionality
└── useDebounce.ts        # Debouncing utility
```

## API Reference

### Content CRUD Operations

#### Get All Content
```http
GET /api/cms/content
```

Query Parameters:
- `type`: Content type filter (blog, market-report, origin-story, service)
- `locale`: Language filter (en, es, fr, pt)
- `status`: Status filter (draft, published, archived)
- `limit`: Number of items per page (default: 20)
- `offset`: Pagination offset (default: 0)

#### Create Content
```http
POST /api/cms/content
Content-Type: application/json

{
  "type": "blog",
  "locale": "en",
  "metadata": {
    "title": "Content Title",
    "description": "Content description",
    "slug": "content-slug",
    "status": "draft",
    "category": "Category Name",
    "author": "Author Name",
    "featured": false
  },
  "content": "# Content Body\n\nContent goes here..."
}
```

#### Update Content
```http
PUT /api/cms/content/[id]
Content-Type: application/json

{
  "metadata": {
    "title": "Updated Title",
    "status": "published"
  },
  "content": "Updated content..."
}
```

#### Delete Content
```http
DELETE /api/cms/content/[id]
```

### Content Actions

#### Duplicate Content
```http
POST /api/cms/content/[id]/duplicate
```

#### Archive/Restore Content
```http
POST /api/cms/content/[id]/archive    # Archive
DELETE /api/cms/content/[id]/archive  # Restore
```

#### Toggle Featured Status
```http
POST /api/cms/content/[id]/featured
```

### Search & Analytics

#### Search Content
```http
POST /api/cms/search
Content-Type: application/json

{
  "query": "search term",
  "type": "blog",
  "locale": "en",
  "status": "published",
  "sortBy": "relevance",
  "sortOrder": "desc",
  "page": 1,
  "limit": 20
}
```

#### Get Content Statistics
```http
GET /api/cms/stats?type=blog&locale=en&timeframe=30d
```

## Component Usage

### ContentEditor

The main content editing interface with MDX support and live preview.

```tsx
import { ContentEditor } from '@/presentation/components/cms';

function EditPage() {
  return (
    <ContentEditor
      contentId="existing-content-id" // Optional for editing
      contentType="blog"
      locale="en"
      onSave={(content) => console.log('Content saved:', content)}
      onCancel={() => console.log('Edit cancelled')}
    />
  );
}
```

### ContentList

Content listing with filtering, sorting, and bulk actions.

```tsx
import { ContentList } from '@/presentation/components/cms';

function ContentManagement() {
  return (
    <ContentList
      contentType="blog" // Optional filter
      locale="en"        // Optional filter
      onEdit={(id) => console.log('Edit content:', id)}
      onPreview={(id) => console.log('Preview content:', id)}
      onDelete={(id) => console.log('Delete content:', id)}
    />
  );
}
```

### ContentSearch

Comprehensive search interface with advanced filtering.

```tsx
import { ContentSearch } from '@/presentation/components/cms';

function SearchPage() {
  return (
    <ContentSearch
      onSelectContent={(id) => console.log('Selected:', id)}
      compact={false} // Use full interface
    />
  );
}
```

### ContentValidator

Real-time content validation with scoring.

```tsx
import { ContentValidator } from '@/presentation/components/cms';

function ValidationPanel() {
  return (
    <ContentValidator
      content="# Title\n\nContent..."
      metadata={{
        title: "Article Title",
        description: "Article description",
        // ... other metadata
      }}
      contentType="blog"
      onValidationChange={(results) => console.log('Validation:', results)}
    />
  );
}
```

## Content Types & Validation

### Blog Posts
- **Required**: title, description, slug, content, author, category
- **Optional**: featured, tags, publishedAt, seo metadata
- **Validation**: Min 300 words, SEO optimization, image requirements

### Market Reports
- **Required**: title, description, slug, content, author, reportDate
- **Optional**: featured, tags, charts, data sources
- **Validation**: Min 500 words, data visualization, source citations

### Origin Stories
- **Required**: title, description, slug, content, author, origin
- **Optional**: featured, tags, location, producer info
- **Validation**: Min 400 words, location data, producer details

### Service Pages
- **Required**: title, description, slug, content, serviceType
- **Optional**: featured, pricing, features, testimonials
- **Validation**: Service details, pricing structure, feature lists

## SEO & Metadata

### Required SEO Fields
- `title`: Page title (50-60 characters)
- `description`: Meta description (150-160 characters)
- `slug`: URL slug (kebab-case)
- `canonical`: Canonical URL (optional)

### Open Graph Fields
- `ogTitle`: OG title
- `ogDescription`: OG description
- `ogImage`: OG image URL
- `ogType`: Content type (article, website, etc.)

### Schema.org Structured Data
- Automatic generation based on content type
- Article schema for blog posts and reports
- Organization schema for service pages
- LocalBusiness schema for origin stories

## File Structure & Storage

### Content Directory Structure
```
content/
├── blog/
│   ├── en/
│   ├── es/
│   ├── fr/
│   └── pt/
├── market-reports/
│   ├── en/
│   ├── es/
│   ├── fr/
│   └── pt/
├── origin-stories/
│   ├── en/
│   ├── es/
│   ├── fr/
│   └── pt/
└── services/
    ├── en/
    ├── es/
    ├── fr/
    └── pt/
```

### File Naming Convention
- Format: `YYYY-MM-DD-slug.mdx`
- Example: `2024-01-15-colombian-coffee-harvest.mdx`
- Slug: kebab-case, URL-friendly

### Frontmatter Structure
```yaml
---
title: "Article Title"
description: "Article description"
slug: "article-slug"
status: "published"
category: "Category Name"
author: "Author Name"
featured: false
publishedAt: "2024-01-15"
createdAt: "2024-01-15"
updatedAt: "2024-01-15"
tags: ["tag1", "tag2"]
seo:
  title: "SEO Title"
  description: "SEO Description"
  canonical: "https://example.com/article"
  ogImage: "/images/article-image.jpg"
---
```

## Security & Permissions

### Authentication
- Admin-only access to CMS interface
- JWT-based authentication
- Role-based permissions (admin, editor, viewer)

### Content Validation
- Server-side validation for all content
- XSS protection for user input
- File upload restrictions
- Content sanitization

### API Security
- Rate limiting on API endpoints
- CSRF protection
- Input validation and sanitization
- Secure file handling

## Performance Optimization

### Caching Strategy
- Static generation for published content
- ISR (Incremental Static Regeneration) for updates
- CDN caching for images and assets
- API response caching

### Search Optimization
- Debounced search queries
- Indexed content for fast retrieval
- Pagination for large result sets
- Relevance scoring algorithm

### Bundle Optimization
- Code splitting for CMS components
- Lazy loading for heavy components
- Optimized bundle sizes
- Tree shaking for unused code

## Development Workflow

### Local Development
1. Start development server: `npm run dev`
2. Access CMS at: `http://localhost:3000/en/dashboard/cms`
3. Create/edit content through the interface
4. Preview changes in real-time

### Content Deployment
1. Content is stored as MDX files in the `content/` directory
2. Contentlayer processes files during build
3. Static generation creates optimized pages
4. Deploy to production with `npm run build`

### Testing
- Unit tests for components and utilities
- Integration tests for API endpoints
- E2E tests for content workflows
- Performance testing for search functionality

## Troubleshooting

### Common Issues

#### Content Not Appearing
- Check file naming convention
- Verify frontmatter syntax
- Ensure content is in correct locale directory
- Check content status (draft vs published)

#### Search Not Working
- Verify API endpoints are accessible
- Check search index generation
- Validate search query format
- Review server logs for errors

#### Validation Errors
- Check required fields are present
- Verify content length requirements
- Ensure proper metadata format
- Review validation rules for content type

### Debug Mode
Enable debug mode by setting `DEBUG_CMS=true` in environment variables for detailed logging and error reporting.

## Future Enhancements

### Planned Features
- **Media Library**: Centralized image and file management
- **Workflow Management**: Editorial workflow with approval process
- **Analytics Integration**: Content performance tracking
- **AI Assistance**: Content suggestions and optimization
- **Collaboration Tools**: Multi-user editing and comments
- **Import/Export**: Bulk content operations
- **Template System**: Reusable content templates
- **Scheduling**: Automated content publishing

### API Improvements
- GraphQL endpoint for flexible queries
- Webhook support for external integrations
- Bulk operations API
- Content versioning API
- Advanced analytics endpoints

## Support & Maintenance

### Monitoring
- Content health checks
- API performance monitoring
- Search functionality testing
- User activity tracking

### Backup & Recovery
- Automated content backups
- Version history preservation
- Disaster recovery procedures
- Data migration tools

### Updates & Patches
- Regular security updates
- Feature enhancements
- Bug fixes and improvements
- Performance optimizations

---

For technical support or feature requests, please refer to the project repository or contact the development team.