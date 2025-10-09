# CMS API Reference

## Base URL
```
http://localhost:3000/api/cms
```

## Authentication
All CMS API endpoints require authentication. Include the authorization header in your requests:

```http
Authorization: Bearer <your-jwt-token>
```

## Content Management Endpoints

### 1. Get All Content

Retrieve a list of content items with optional filtering.

**Endpoint:** `GET /content`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `type` | string | Content type filter (`blog`, `market-report`, `origin-story`, `service`) | - |
| `locale` | string | Language filter (`en`, `es`, `fr`, `pt`) | - |
| `status` | string | Status filter (`draft`, `published`, `archived`) | - |
| `category` | string | Category filter | - |
| `author` | string | Author filter | - |
| `featured` | boolean | Featured content only | - |
| `limit` | number | Items per page | 20 |
| `offset` | number | Pagination offset | 0 |
| `sortBy` | string | Sort field (`date`, `title`, `author`) | `date` |
| `sortOrder` | string | Sort order (`asc`, `desc`) | `desc` |

**Example Request:**
```http
GET /api/cms/content?type=blog&locale=en&status=published&limit=10
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "2024-01-15-colombian-coffee-harvest",
        "type": "blog",
        "locale": "en",
        "filename": "2024-01-15-colombian-coffee-harvest.mdx",
        "metadata": {
          "title": "Colombian Coffee Harvest 2024",
          "description": "Insights into the 2024 Colombian coffee harvest season",
          "slug": "colombian-coffee-harvest-2024",
          "status": "published",
          "category": "Market Analysis",
          "author": "Maria Rodriguez",
          "featured": true,
          "publishedAt": "2024-01-15T00:00:00.000Z",
          "createdAt": "2024-01-10T00:00:00.000Z",
          "updatedAt": "2024-01-15T00:00:00.000Z",
          "tags": ["colombia", "harvest", "market-analysis"]
        },
        "stats": {
          "wordCount": 1250,
          "lastModified": "2024-01-15T10:30:00.000Z",
          "size": 8432
        }
      }
    ],
    "pagination": {
      "total": 45,
      "limit": 10,
      "offset": 0,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### 2. Get Single Content

Retrieve a specific content item by ID.

**Endpoint:** `GET /content/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID (filename without extension) |

**Example Request:**
```http
GET /api/cms/content/2024-01-15-colombian-coffee-harvest
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "type": "blog",
    "locale": "en",
    "filename": "2024-01-15-colombian-coffee-harvest.mdx",
    "metadata": {
      "title": "Colombian Coffee Harvest 2024",
      "description": "Insights into the 2024 Colombian coffee harvest season",
      "slug": "colombian-coffee-harvest-2024",
      "status": "published",
      "category": "Market Analysis",
      "author": "Maria Rodriguez",
      "featured": true,
      "publishedAt": "2024-01-15T00:00:00.000Z",
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-15T00:00:00.000Z",
      "tags": ["colombia", "harvest", "market-analysis"],
      "seo": {
        "title": "Colombian Coffee Harvest 2024 - Market Analysis",
        "description": "Comprehensive analysis of the 2024 Colombian coffee harvest season",
        "canonical": "https://greatbeans.com/blog/colombian-coffee-harvest-2024",
        "ogImage": "/images/blog/colombian-harvest-2024.jpg"
      }
    },
    "content": "# Colombian Coffee Harvest 2024\n\nThe 2024 Colombian coffee harvest...",
    "stats": {
      "wordCount": 1250,
      "lastModified": "2024-01-15T10:30:00.000Z",
      "size": 8432
    }
  }
}
```

### 3. Create Content

Create a new content item.

**Endpoint:** `POST /content`

**Request Body:**
```json
{
  "type": "blog",
  "locale": "en",
  "metadata": {
    "title": "New Blog Post",
    "description": "Description of the new blog post",
    "slug": "new-blog-post",
    "status": "draft",
    "category": "Category Name",
    "author": "Author Name",
    "featured": false,
    "tags": ["tag1", "tag2"],
    "seo": {
      "title": "SEO Title",
      "description": "SEO Description",
      "canonical": "https://example.com/new-blog-post",
      "ogImage": "/images/new-blog-post.jpg"
    }
  },
  "content": "# New Blog Post\n\nContent goes here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-20-new-blog-post",
    "filename": "2024-01-20-new-blog-post.mdx",
    "message": "Content created successfully"
  }
}
```

### 4. Update Content

Update an existing content item.

**Endpoint:** `PUT /content/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID (filename without extension) |

**Request Body:**
```json
{
  "metadata": {
    "title": "Updated Title",
    "status": "published",
    "updatedAt": "2024-01-20T00:00:00.000Z"
  },
  "content": "# Updated Content\n\nUpdated content goes here..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "message": "Content updated successfully"
  }
}
```

### 5. Delete Content

Delete a content item.

**Endpoint:** `DELETE /content/{id}`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID (filename without extension) |

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Content deleted successfully"
  }
}
```

## Content Actions

### 6. Duplicate Content

Create a copy of existing content.

**Endpoint:** `POST /content/{id}/duplicate`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID to duplicate |

**Response:**
```json
{
  "success": true,
  "data": {
    "originalId": "2024-01-15-colombian-coffee-harvest",
    "duplicateId": "2024-01-20-colombian-coffee-harvest-copy",
    "filename": "2024-01-20-colombian-coffee-harvest-copy.mdx",
    "message": "Content duplicated successfully"
  }
}
```

### 7. Archive Content

Archive a content item (sets status to 'archived').

**Endpoint:** `POST /content/{id}/archive`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID to archive |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "message": "Content archived successfully"
  }
}
```

### 8. Restore Content

Restore an archived content item (sets status to 'draft').

**Endpoint:** `DELETE /content/{id}/archive`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID to restore |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "message": "Content restored successfully"
  }
}
```

### 9. Toggle Featured Status

Toggle the featured status of a content item.

**Endpoint:** `POST /content/{id}/featured`

**Path Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Content ID to toggle featured status |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "featured": true,
    "featuredAt": "2024-01-20T10:30:00.000Z",
    "message": "Content featured status updated"
  }
}
```

## Search & Analytics

### 10. Search Content

Perform advanced content search with filtering and sorting.

**Endpoint:** `POST /search`

**Request Body:**
```json
{
  "query": "coffee harvest",
  "type": "blog",
  "locale": "en",
  "status": "published",
  "category": "Market Analysis",
  "author": "Maria Rodriguez",
  "featured": true,
  "dateFrom": "2024-01-01",
  "dateTo": "2024-12-31",
  "sortBy": "relevance",
  "sortOrder": "desc",
  "page": 1,
  "limit": 20
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "2024-01-15-colombian-coffee-harvest",
        "type": "blog",
        "locale": "en",
        "filename": "2024-01-15-colombian-coffee-harvest.mdx",
        "metadata": {
          "title": "Colombian Coffee Harvest 2024",
          "description": "Insights into the 2024 Colombian coffee harvest season",
          "slug": "colombian-coffee-harvest-2024",
          "status": "published",
          "category": "Market Analysis",
          "author": "Maria Rodriguez",
          "featured": true,
          "publishedAt": "2024-01-15T00:00:00.000Z",
          "createdAt": "2024-01-10T00:00:00.000Z",
          "updatedAt": "2024-01-15T00:00:00.000Z"
        },
        "content": "# Colombian Coffee Harvest 2024\n\nThe 2024 Colombian coffee harvest...",
        "stats": {
          "wordCount": 1250,
          "lastModified": "2024-01-15T10:30:00.000Z",
          "size": 8432
        },
        "relevanceScore": 0.95,
        "excerpt": "The 2024 Colombian <mark>coffee harvest</mark> shows promising yields...",
        "titleHighlight": "Colombian <mark>Coffee Harvest</mark> 2024",
        "descriptionHighlight": "Insights into the 2024 Colombian <mark>coffee harvest</mark> season"
      }
    ],
    "query": "coffee harvest",
    "filters": {
      "type": "blog",
      "locale": "en",
      "status": "published"
    },
    "sorting": {
      "sortBy": "relevance",
      "sortOrder": "desc"
    },
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "suggestions": [
      "coffee harvest 2024",
      "colombian coffee",
      "harvest season"
    ],
    "stats": {
      "totalResults": 15,
      "searchTime": 45
    }
  }
}
```

### 11. Get Content Statistics

Retrieve content statistics and analytics.

**Endpoint:** `GET /stats`

**Query Parameters:**
| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `type` | string | Content type filter | - |
| `locale` | string | Language filter | - |
| `timeframe` | string | Time period (`7d`, `30d`, `90d`, `1y`) | `30d` |

**Example Request:**
```http
GET /api/cms/stats?type=blog&locale=en&timeframe=30d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "total": 156,
      "published": 134,
      "draft": 18,
      "archived": 4,
      "featured": 12
    },
    "byType": {
      "blog": 89,
      "market-report": 23,
      "origin-story": 31,
      "service": 13
    },
    "byLocale": {
      "en": 89,
      "es": 34,
      "fr": 21,
      "pt": 12
    },
    "byStatus": {
      "published": 134,
      "draft": 18,
      "archived": 4
    },
    "byAuthor": {
      "Maria Rodriguez": 45,
      "John Smith": 38,
      "Ana Garcia": 29,
      "Others": 44
    },
    "byCategory": {
      "Market Analysis": 34,
      "Origin Stories": 28,
      "Brewing Guides": 22,
      "Industry News": 19,
      "Others": 53
    },
    "contentHealth": {
      "withImages": 142,
      "withoutImages": 14,
      "seoOptimized": 128,
      "needsSeoWork": 28,
      "averageWordCount": 847,
      "shortContent": 12,
      "longContent": 23
    },
    "publishingTrends": {
      "thisMonth": 12,
      "lastMonth": 15,
      "thisWeek": 3,
      "lastWeek": 4,
      "today": 1,
      "yesterday": 0
    },
    "recentActivity": [
      {
        "action": "created",
        "contentId": "2024-01-20-new-blog-post",
        "contentTitle": "New Blog Post",
        "author": "Maria Rodriguez",
        "timestamp": "2024-01-20T10:30:00.000Z"
      },
      {
        "action": "updated",
        "contentId": "2024-01-15-colombian-coffee-harvest",
        "contentTitle": "Colombian Coffee Harvest 2024",
        "author": "John Smith",
        "timestamp": "2024-01-19T15:45:00.000Z"
      }
    ]
  }
}
```

## Error Responses

All endpoints return consistent error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "field": "title",
    "message": "Title is required"
  }
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Content not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Content with this slug already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- **General endpoints**: 100 requests per minute per IP
- **Search endpoints**: 30 requests per minute per IP
- **Content creation**: 10 requests per minute per user

Rate limit headers are included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## Webhooks

Configure webhooks to receive notifications about content changes:

### Webhook Events
- `content.created`
- `content.updated`
- `content.deleted`
- `content.published`
- `content.archived`
- `content.featured`

### Webhook Payload
```json
{
  "event": "content.published",
  "timestamp": "2024-01-20T10:30:00.000Z",
  "data": {
    "id": "2024-01-15-colombian-coffee-harvest",
    "type": "blog",
    "locale": "en",
    "metadata": {
      "title": "Colombian Coffee Harvest 2024",
      "status": "published"
    }
  }
}
```

## SDK Examples

### JavaScript/TypeScript
```typescript
import { CMSClient } from '@/lib/cms-client';

const cms = new CMSClient({
  baseURL: 'http://localhost:3000/api/cms',
  apiKey: 'your-api-key'
});

// Get all blog posts
const posts = await cms.content.list({
  type: 'blog',
  status: 'published'
});

// Create new content
const newPost = await cms.content.create({
  type: 'blog',
  locale: 'en',
  metadata: {
    title: 'New Post',
    description: 'Post description',
    slug: 'new-post',
    status: 'draft'
  },
  content: '# New Post\n\nContent here...'
});

// Search content
const results = await cms.search({
  query: 'coffee',
  type: 'blog',
  limit: 10
});
```

### cURL Examples

#### Create Content
```bash
curl -X POST http://localhost:3000/api/cms/content \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "type": "blog",
    "locale": "en",
    "metadata": {
      "title": "New Blog Post",
      "description": "Description",
      "slug": "new-blog-post",
      "status": "draft"
    },
    "content": "# New Blog Post\n\nContent..."
  }'
```

#### Search Content
```bash
curl -X POST http://localhost:3000/api/cms/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-jwt-token" \
  -d '{
    "query": "coffee harvest",
    "type": "blog",
    "status": "published",
    "limit": 10
  }'
```

## Testing

Use the provided test suite to validate API functionality:

```bash
# Run API tests
npm run test:api

# Run specific endpoint tests
npm run test:api -- --grep "content creation"

# Run integration tests
npm run test:integration
```

## Support

For API support and questions:
- Documentation: `/docs/API_REFERENCE.md`
- Issues: GitHub repository issues
- Email: dev@greatbeans.com