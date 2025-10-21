# The Great Beans Coffee Export Platform - Comprehensive API Documentation

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL & Environment](#base-url--environment)
4. [Request/Response Format](#requestresponse-format)
5. [Error Handling](#error-handling)
6. [Rate Limiting](#rate-limiting)
7. [API Endpoints](#api-endpoints)
   - [Products API](#products-api)
   - [RFQ (Request for Quote) API](#rfq-request-for-quote-api)
   - [CMS Content API](#cms-content-api)
   - [Search API](#search-api)
   - [Analytics API](#analytics-api)
   - [SEO API](#seo-api)
   - [PDF Generation API](#pdf-generation-api)
   - [Sitemap API](#sitemap-api)
8. [Integration Examples](#integration-examples)
9. [Testing Guide](#testing-guide)
10. [Postman Collection](#postman-collection)

---

## Overview

The Great Beans Coffee Export Platform API provides comprehensive endpoints for managing coffee products, processing RFQs (Request for Quotes), content management, search functionality, analytics, and SEO optimization. This RESTful API is built with Next.js 15+ and follows industry best practices for security, performance, and developer experience.

### Key Features

- **RESTful Design**: Clean, predictable URLs and HTTP methods
- **JSON API**: All requests and responses use JSON format
- **Authentication**: JWT-based authentication with API key support
- **Validation**: Comprehensive input validation using Zod schemas
- **Error Handling**: Consistent error responses with detailed messages
- **Rate Limiting**: Protection against abuse and excessive usage
- **Internationalization**: Multi-language support (EN, ES, FR, PT)
- **Real-time Analytics**: Performance monitoring and business insights

---

## Authentication

### Authentication Methods

The API supports two authentication methods:

#### 1. JWT Bearer Token (Recommended)

For user-authenticated requests:

```http
Authorization: Bearer <jwt-token>
```

#### 2. API Key

For server-to-server communication and administrative functions:

```http
Authorization: Bearer <api-key>
```

### Authentication Flow

1. **User Login**: Authenticate user credentials to receive JWT token
2. **Token Usage**: Include token in Authorization header for protected endpoints
3. **Token Refresh**: Refresh tokens before expiration
4. **Logout**: Invalidate tokens on logout

### Protected Endpoints

The following endpoints require authentication:

- All CMS management endpoints (`/api/cms/*`)
- RFQ creation and management (`/api/rfq/*`)
- Analytics endpoints (`/api/analytics/*`)
- SEO audit endpoints (`/api/seo/*`)
- PDF generation endpoints (`/api/pdf/*`)
- Sitemap submission (`/api/sitemap/submit`)

### Public Endpoints

These endpoints are publicly accessible:

- Product catalog (`/api/products`)
- Global search (`/api/search`)
- RSS feeds (`/rss.xml`)

---

## Base URL & Environment

### Development

```
http://localhost:3000/api
```

### Production

```
https://greatbeans.com/api
```

### API Versioning

Currently using v1 (implicit). Future versions will be explicitly versioned:

```
https://greatbeans.com/api/v2/...
```

---

## Request/Response Format

### Request Format

All API requests should:

- Use `Content-Type: application/json` for POST/PUT requests
- Include proper authentication headers
- Use UTF-8 encoding
- Follow REST conventions for HTTP methods

### Response Format

All API responses follow a consistent structure:

#### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

#### Error Response

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message",
  "details": {
    // Additional error details
  }
}
```

---

## Error Handling

### HTTP Status Codes

| Code | Description           | Usage                      |
| ---- | --------------------- | -------------------------- |
| 200  | OK                    | Successful GET, PUT, PATCH |
| 201  | Created               | Successful POST            |
| 204  | No Content            | Successful DELETE          |
| 400  | Bad Request           | Invalid request data       |
| 401  | Unauthorized          | Authentication required    |
| 403  | Forbidden             | Insufficient permissions   |
| 404  | Not Found             | Resource not found         |
| 409  | Conflict              | Resource conflict          |
| 422  | Unprocessable Entity  | Validation errors          |
| 429  | Too Many Requests     | Rate limit exceeded        |
| 500  | Internal Server Error | Server error               |

### Error Response Examples

#### Validation Error (400)

```json
{
  "success": false,
  "error": "Validation error",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "quantity",
      "message": "Must be greater than 0"
    }
  ]
}
```

#### Authentication Error (401)

```json
{
  "success": false,
  "error": "Unauthorized",
  "message": "Authentication token required"
}
```

#### Rate Limit Error (429)

```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many requests. Try again in 60 seconds.",
  "retryAfter": 60
}
```

---

## Rate Limiting

### Rate Limits by Endpoint Type

| Endpoint Type    | Limit        | Window     |
| ---------------- | ------------ | ---------- |
| General API      | 100 requests | per minute |
| Search API       | 30 requests  | per minute |
| Content Creation | 10 requests  | per minute |
| Analytics        | 50 requests  | per minute |
| SEO Audit        | 10 requests  | per hour   |

### Rate Limit Headers

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
X-RateLimit-RetryAfter: 60
```

---

## API Endpoints

## Products API

### Get Products List

Retrieve a paginated list of coffee products with filtering and search capabilities.

**Endpoint:** `GET /api/products`

**Query Parameters:**

| Parameter         | Type    | Description                                       | Default   |
| ----------------- | ------- | ------------------------------------------------- | --------- |
| `page`            | number  | Page number                                       | 1         |
| `limit`           | number  | Items per page (max 50)                           | 20        |
| `search`          | string  | Search query                                      | -         |
| `coffeeType`      | string  | Filter by coffee type                             | -         |
| `grade`           | string  | Filter by grade                                   | -         |
| `processing`      | string  | Filter by processing method                       | -         |
| `origin`          | string  | Filter by origin country                          | -         |
| `region`          | string  | Filter by region                                  | -         |
| `minCuppingScore` | number  | Minimum cupping score                             | -         |
| `maxCuppingScore` | number  | Maximum cupping score                             | -         |
| `certifications`  | string  | Comma-separated certification IDs                 | -         |
| `inStock`         | boolean | Filter by stock availability                      | -         |
| `isFeatured`      | boolean | Filter featured products                          | -         |
| `sortBy`          | string  | Sort field (name, price, cuppingScore, createdAt) | createdAt |
| `sortOrder`       | string  | Sort order (asc, desc)                            | desc      |
| `locale`          | string  | Language (en, es, fr, pt)                         | en        |

**Example Request:**

```http
GET /api/products?page=1&limit=10&coffeeType=arabica&origin=colombia&sortBy=cuppingScore&sortOrder=desc
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_123",
        "sku": "COL-HG-001",
        "coffeeType": "arabica",
        "grade": "high_grown",
        "processing": "washed",
        "origin": "colombia",
        "region": "huila",
        "farm": "Finca El Paraiso",
        "altitude": "1600-1800m",
        "cuppingScore": 86.5,
        "harvestSeason": "2024",
        "translations": {
          "name": "Colombian Huila High Grown",
          "description": "Exceptional single-origin coffee...",
          "tastingNotes": "Chocolate, caramel, citrus"
        },
        "certifications": [
          {
            "id": "cert_organic",
            "name": "Organic",
            "logo": "/images/certifications/organic.svg"
          }
        ],
        "pricing": {
          "basePrice": 4.5,
          "currency": "USD",
          "unit": "lb",
          "minimumOrder": 150
        },
        "availability": {
          "inStock": true,
          "stockLevel": "high",
          "availableQuantity": 5000
        },
        "images": [
          {
            "url": "/images/products/col-hg-001-1.jpg",
            "alt": "Colombian Huila coffee beans",
            "isPrimary": true
          }
        ],
        "isFeatured": true,
        "isActive": true,
        "createdAt": "2024-01-15T10:30:00Z",
        "updatedAt": "2024-01-20T14:45:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 45,
      "totalPages": 5,
      "hasNext": true,
      "hasPrevious": false
    }
  }
}
```

### Get Single Product

Retrieve detailed information about a specific product.

**Endpoint:** `GET /api/products/{id}`

**Path Parameters:**

- `id` (string, required): Product ID

**Query Parameters:**

- `locale` (string): Language preference
- `includeInventory` (boolean): Include inventory details
- `includeQuality` (boolean): Include quality metrics

**Example Request:**

```http
GET /api/products/prod_123?locale=en&includeInventory=true
```

**Response:**

```json
{
  "success": true,
  "data": {
    "product": {
      "id": "prod_123",
      "sku": "COL-HG-001",
      // ... full product details
      "specifications": [
        {
          "name": "Moisture Content",
          "value": "10.5%",
          "category": "physical"
        },
        {
          "name": "Screen Size",
          "value": "17/18",
          "category": "physical"
        }
      ],
      "qualityMetrics": {
        "cuppingScore": 86.5,
        "defectCount": 2,
        "uniformity": 95,
        "cleanCup": 10
      },
      "inventory": {
        "totalStock": 5000,
        "availableStock": 4500,
        "reservedStock": 500,
        "lastUpdated": "2024-01-20T14:45:00Z"
      },
      "suppliers": [
        {
          "id": "sup_001",
          "name": "Cooperativa Huila",
          "contactPerson": "Carlos Rodriguez",
          "email": "carlos@coophuila.com"
        }
      ]
    }
  }
}
```

### Search Products

Advanced product search with filtering and faceted results.

**Endpoint:** `GET /api/products/search`

**Query Parameters:**

| Parameter | Type    | Description             |
| --------- | ------- | ----------------------- |
| `q`       | string  | Search query            |
| `filters` | object  | Advanced filters        |
| `facets`  | boolean | Include faceted results |
| `page`    | number  | Page number             |
| `limit`   | number  | Results per page        |

**Example Request:**

```http
GET /api/products/search?q=colombian+arabica&facets=true&page=1&limit=20
```

**Response:**

```json
{
  "success": true,
  "data": {
    "products": [
      // ... product results
    ],
    "pagination": {
      // ... pagination info
    },
    "filters": {
      "coffeeTypes": [
        { "value": "arabica", "count": 25 },
        { "value": "robusta", "count": 8 }
      ],
      "origins": [
        { "value": "colombia", "count": 15 },
        { "value": "brazil", "count": 10 }
      ],
      "certifications": [
        { "id": "cert_organic", "name": "Organic", "count": 12 }
      ]
    }
  }
}
```

---

## RFQ (Request for Quote) API

### Submit RFQ

Create a new Request for Quote.

**Endpoint:** `POST /api/rfq`

**Request Body:**

```json
{
  "companyInfo": {
    "companyName": "Global Coffee Importers Ltd",
    "contactPerson": "John Smith",
    "email": "john@globalcoffee.com",
    "phone": "+1-555-0123",
    "address": {
      "street": "123 Coffee Street",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "country": "United States"
    },
    "businessType": "importer",
    "yearsInBusiness": 15,
    "website": "https://globalcoffee.com"
  },
  "productRequirements": [
    {
      "productId": "prod_123",
      "coffeeType": "arabica",
      "origin": "colombia",
      "grade": "high_grown",
      "processing": "washed",
      "certifications": ["organic", "fair_trade"],
      "specifications": {
        "cuppingScore": { "min": 85 },
        "moisture": { "max": 12 },
        "screenSize": "17/18"
      }
    }
  ],
  "quantityRequirements": {
    "quantity": 1000,
    "unit": "bags",
    "frequency": "monthly",
    "contractDuration": "12_months",
    "deliveryTerms": "FOB",
    "paymentTerms": "LC_at_sight"
  },
  "additionalRequirements": {
    "packaging": "jute_bags",
    "labeling": "private_label",
    "qualityControl": "pre_shipment_sample",
    "documentation": ["phytosanitary", "origin_certificate"]
  },
  "timeline": {
    "urgency": "standard",
    "preferredDelivery": "2024-03-15",
    "flexibleDates": true
  },
  "notes": "Looking for long-term partnership with reliable supplier."
}
```

**Response:**

```json
{
  "success": true,
  "message": "RFQ submitted successfully",
  "data": {
    "rfq": {
      "id": "rfq_456",
      "rfqNumber": "RFQ-2024-001",
      "status": "submitted",
      "priority": "standard",
      "submittedAt": "2024-01-20T15:30:00Z",
      "estimatedResponseTime": "2-3 business days"
    }
  }
}
```

### Get RFQ List

Retrieve a list of RFQs with filtering and pagination.

**Endpoint:** `GET /api/rfq`

**Query Parameters:**

| Parameter      | Type   | Description             |
| -------------- | ------ | ----------------------- |
| `status`       | string | Filter by status        |
| `priority`     | string | Filter by priority      |
| `dateFrom`     | string | Start date filter       |
| `dateTo`       | string | End date filter         |
| `country`      | string | Filter by country       |
| `businessType` | string | Filter by business type |
| `page`         | number | Page number             |
| `limit`        | number | Items per page          |

**Response:**

```json
{
  "success": true,
  "data": {
    "rfqs": [
      {
        "id": "rfq_456",
        "rfqNumber": "RFQ-2024-001",
        "status": "in_progress",
        "priority": "high",
        "companyInfo": {
          "companyName": "Global Coffee Importers Ltd",
          "contactPerson": "John Smith",
          "email": "john@globalcoffee.com",
          "country": "United States"
        },
        "productRequirements": [
          {
            "coffeeType": "arabica",
            "origin": "colombia",
            "quantity": 1000,
            "unit": "bags"
          }
        ],
        "submittedAt": "2024-01-20T15:30:00Z",
        "lastActivityAt": "2024-01-21T10:15:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "limit": 20,
      "totalPages": 2
    }
  }
}
```

### Get RFQ Details

Retrieve detailed information about a specific RFQ.

**Endpoint:** `GET /api/rfq/{id}`

**Response:**

```json
{
  "success": true,
  "data": {
    "rfq": {
      "id": "rfq_456",
      "rfqNumber": "RFQ-2024-001",
      "status": "in_progress",
      "priority": "high",
      "companyInfo": {
        // ... full company information
      },
      "productRequirements": [
        // ... detailed product requirements
      ],
      "quantityRequirements": {
        // ... quantity and delivery requirements
      },
      "statusHistory": [
        {
          "status": "submitted",
          "timestamp": "2024-01-20T15:30:00Z",
          "updatedBy": "system",
          "note": "RFQ submitted by customer"
        },
        {
          "status": "in_progress",
          "timestamp": "2024-01-21T09:00:00Z",
          "updatedBy": "sales_team",
          "note": "Assigned to sales representative"
        }
      ],
      "assignedTo": {
        "id": "user_789",
        "name": "Maria Garcia",
        "email": "maria@greatbeans.com",
        "role": "sales_representative"
      },
      "quotes": [
        {
          "id": "quote_101",
          "version": 1,
          "status": "draft",
          "totalAmount": 4500.0,
          "currency": "USD",
          "validUntil": "2024-02-20T23:59:59Z"
        }
      ],
      "communications": [
        {
          "id": "comm_201",
          "type": "email",
          "subject": "RFQ Acknowledgment",
          "timestamp": "2024-01-20T16:00:00Z",
          "isInternal": false
        }
      ]
    }
  }
}
```

### Update RFQ Status

Update the status of an RFQ.

**Endpoint:** `PATCH /api/rfq/{id}/status`

**Request Body:**

```json
{
  "status": "quoted",
  "note": "Quote prepared and sent to customer",
  "assignedTo": "user_789"
}
```

### Get RFQ Communications

Retrieve communication history for an RFQ.

**Endpoint:** `GET /api/rfq/{id}/communications`

**Response:**

```json
{
  "success": true,
  "data": {
    "rfqId": "rfq_456",
    "communications": [
      {
        "id": "comm_201",
        "type": "email",
        "subject": "RFQ Acknowledgment",
        "content": "Thank you for your RFQ...",
        "isInternal": false,
        "createdBy": "system",
        "createdAt": "2024-01-20T16:00:00Z",
        "attachments": []
      }
    ],
    "total": 5
  }
}
```

### Add RFQ Communication

Add a new communication to an RFQ.

**Endpoint:** `POST /api/rfq/{id}/communications`

**Request Body:**

```json
{
  "type": "email",
  "subject": "Quote Follow-up",
  "content": "Following up on the quote we sent...",
  "isInternal": false,
  "attachments": [
    {
      "filename": "quote_v2.pdf",
      "url": "/uploads/quotes/quote_v2.pdf",
      "size": 245760
    }
  ]
}
```

### Get RFQ Quotes

Retrieve all quotes for an RFQ.

**Endpoint:** `GET /api/rfq/{id}/quotes`

### Create RFQ Quote

Create a new quote for an RFQ.

**Endpoint:** `POST /api/rfq/{id}/quotes`

**Request Body:**

```json
{
  "currency": "USD",
  "validUntil": "2024-02-20T23:59:59Z",
  "items": [
    {
      "productId": "prod_123",
      "description": "Colombian Huila High Grown",
      "quantity": 1000,
      "unit": "bags",
      "unitPrice": 4.5,
      "totalPrice": 4500.0
    }
  ],
  "shipping": {
    "method": "sea_freight",
    "cost": 2500.0,
    "estimatedDays": 21,
    "terms": "FOB"
  },
  "paymentTerms": {
    "method": "LC_at_sight",
    "description": "Letter of Credit at sight"
  },
  "notes": "Prices valid for 30 days. Subject to final quality approval."
}
```

---

## CMS Content API

### Get Content List

Retrieve a list of content items with filtering.

**Endpoint:** `GET /api/cms/content`

**Query Parameters:**

| Parameter   | Type    | Description                                               |
| ----------- | ------- | --------------------------------------------------------- |
| `type`      | string  | Content type (blog, market-report, origin-story, service) |
| `locale`    | string  | Language filter                                           |
| `status`    | string  | Status filter (draft, published, archived)                |
| `category`  | string  | Category filter                                           |
| `author`    | string  | Author filter                                             |
| `featured`  | boolean | Featured content only                                     |
| `limit`     | number  | Items per page                                            |
| `offset`    | number  | Pagination offset                                         |
| `sortBy`    | string  | Sort field                                                |
| `sortOrder` | string  | Sort order                                                |

**Response:**

```json
{
  "success": true,
  "data": {
    "content": [
      {
        "id": "blog_001",
        "type": "blog",
        "slug": "coffee-harvest-season-2024",
        "title": "Coffee Harvest Season 2024: What to Expect",
        "excerpt": "An overview of the upcoming coffee harvest...",
        "status": "published",
        "locale": "en",
        "category": "industry-news",
        "author": {
          "name": "Maria Santos",
          "email": "maria@greatbeans.com"
        },
        "publishedAt": "2024-01-15T10:00:00Z",
        "updatedAt": "2024-01-16T14:30:00Z",
        "featured": true,
        "coverImage": "/images/blog/harvest-2024.jpg",
        "readingTime": 5,
        "tags": ["harvest", "2024", "industry"]
      }
    ],
    "pagination": {
      "total": 50,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

### Get Content by ID

Retrieve a specific content item.

**Endpoint:** `GET /api/cms/content/{id}`

**Query Parameters:**

- `includeContent` (boolean): Include full content body

**Response:**

```json
{
  "success": true,
  "data": {
    "content": {
      "id": "blog_001",
      "type": "blog",
      "slug": "coffee-harvest-season-2024",
      "title": "Coffee Harvest Season 2024: What to Expect",
      "content": "# Coffee Harvest Season 2024\n\nThe 2024 coffee harvest season...",
      "metadata": {
        "seoTitle": "Coffee Harvest 2024 - Industry Insights",
        "seoDescription": "Comprehensive guide to the 2024 coffee harvest...",
        "keywords": ["coffee", "harvest", "2024", "industry"]
      },
      "structuredData": {
        "@type": "Article",
        "headline": "Coffee Harvest Season 2024: What to Expect",
        "author": {
          "@type": "Person",
          "name": "Maria Santos"
        }
      }
    }
  }
}
```

### Search Content

Search across all content types.

**Endpoint:** `GET /api/cms/search`

**Query Parameters:**

| Parameter  | Type   | Description         |
| ---------- | ------ | ------------------- |
| `q`        | string | Search query        |
| `type`     | string | Content type filter |
| `locale`   | string | Language filter     |
| `category` | string | Category filter     |
| `dateFrom` | string | Date range start    |
| `dateTo`   | string | Date range end      |
| `page`     | number | Page number         |
| `limit`    | number | Results per page    |

**Response:**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "id": "blog_001",
        "type": "blog",
        "title": "Coffee Harvest Season 2024",
        "excerpt": "An overview of the upcoming coffee harvest...",
        "url": "/en/blog/coffee-harvest-season-2024",
        "relevanceScore": 0.95,
        "highlightedText": "...upcoming <mark>coffee harvest</mark> season..."
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    },
    "suggestions": [
      "coffee harvest 2024",
      "coffee market trends",
      "arabica prices"
    ]
  }
}
```

---

## Search API

### Global Search

Search across all content types and products.

**Endpoint:** `GET /api/search`

**Query Parameters:**

| Parameter   | Type   | Description                                                  |
| ----------- | ------ | ------------------------------------------------------------ |
| `q`         | string | Search query                                                 |
| `type`      | string | Content type (all, blog, market-reports, services, products) |
| `category`  | string | Category filter                                              |
| `locale`    | string | Language preference                                          |
| `page`      | number | Page number                                                  |
| `limit`     | number | Results per page (max 50)                                    |
| `sortBy`    | string | Sort by (relevance, date, title)                             |
| `sortOrder` | string | Sort order (asc, desc)                                       |

**Example Request:**

```http
GET /api/search?q=colombian+coffee&type=all&locale=en&page=1&limit=20
```

**Response:**

```json
{
  "items": [
    {
      "id": "prod_123",
      "type": "product",
      "title": "Colombian Huila High Grown",
      "description": "Exceptional single-origin coffee from Colombia",
      "url": "/en/products/colombian-huila-high-grown",
      "publishedAt": "2024-01-15T10:00:00Z",
      "category": "arabica",
      "coverImage": "/images/products/col-hg-001.jpg",
      "featured": true
    },
    {
      "id": "blog_002",
      "type": "blog",
      "title": "The Colombian Coffee Renaissance",
      "description": "Exploring the resurgence of Colombian coffee...",
      "excerpt": "Colombia has long been synonymous with quality coffee...",
      "url": "/en/blog/colombian-coffee-renaissance",
      "publishedAt": "2024-01-10T14:30:00Z",
      "category": "origin-stories",
      "tags": ["colombia", "coffee", "origin"],
      "coverImage": "/images/blog/colombia-renaissance.jpg",
      "readingTime": 7
    }
  ],
  "total": 25,
  "page": 1,
  "limit": 20,
  "totalPages": 2,
  "hasNext": true,
  "hasPrevious": false,
  "query": "colombian coffee",
  "filters": {
    "type": "all",
    "locale": "en"
  }
}
```

---

## Analytics API

### Submit Web Vitals

Submit Core Web Vitals metrics for performance monitoring.

**Endpoint:** `POST /api/analytics/web-vitals`

**Request Body:**

```json
{
  "metric": {
    "name": "LCP",
    "value": 2100,
    "rating": "good",
    "delta": 150,
    "id": "metric_123",
    "navigationType": "navigate"
  },
  "timestamp": 1642694400000,
  "url": "https://greatbeans.com/en/products",
  "userAgent": "Mozilla/5.0...",
  "connection": "4g",
  "sessionId": "session_456",
  "userId": "user_789"
}
```

### Get RFQ Analytics

Retrieve analytics data for RFQ performance.

**Endpoint:** `GET /api/rfq/analytics`

**Query Parameters:**

| Parameter      | Type   | Description             |
| -------------- | ------ | ----------------------- |
| `dateFrom`     | string | Start date (ISO 8601)   |
| `dateTo`       | string | End date (ISO 8601)     |
| `status`       | string | Filter by status        |
| `priority`     | string | Filter by priority      |
| `country`      | string | Filter by country       |
| `businessType` | string | Filter by business type |

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalRfqs": 150,
      "completedRfqs": 120,
      "conversionRate": 0.8,
      "averageResponseTime": 2.5
    },
    "breakdowns": {
      "byStatus": {
        "submitted": 15,
        "in_progress": 25,
        "quoted": 45,
        "completed": 65
      },
      "byPriority": {
        "low": 30,
        "standard": 90,
        "high": 25,
        "urgent": 5
      },
      "byCountry": {
        "United States": 45,
        "Germany": 25,
        "Japan": 20,
        "Others": 60
      }
    },
    "trends": {
      "monthly": [
        {
          "month": "2024-01",
          "rfqs": 35,
          "completed": 28,
          "conversionRate": 0.8
        }
      ]
    }
  }
}
```

---

## SEO API

### SEO Audit

Perform SEO audit on a page or content.

**Endpoint:** `POST /api/seo/audit`

**Request Body:**

```json
{
  "url": "https://greatbeans.com/en/products/colombian-huila",
  "content": "<html>...</html>",
  "metadata": {
    "title": "Colombian Huila High Grown Coffee",
    "description": "Premium Colombian coffee from Huila region"
  },
  "structuredData": [
    {
      "@type": "Product",
      "name": "Colombian Huila High Grown",
      "description": "Premium Colombian coffee..."
    }
  ],
  "config": {
    "checkImages": true,
    "checkLinks": true,
    "checkPerformance": false
  }
}
```

**Response:**

```json
{
  "audit": {
    "score": 85,
    "issues": [
      {
        "type": "warning",
        "category": "meta",
        "message": "Meta description could be more descriptive",
        "element": "meta[name='description']",
        "suggestion": "Consider expanding the description to 150-160 characters"
      }
    ],
    "recommendations": [
      {
        "priority": "high",
        "category": "content",
        "title": "Add alt text to images",
        "description": "3 images are missing alt text"
      }
    ],
    "metrics": {
      "titleLength": 45,
      "descriptionLength": 120,
      "headingStructure": "good",
      "imageOptimization": "needs_improvement",
      "structuredDataValid": true
    }
  },
  "timestamp": "2024-01-20T15:30:00Z",
  "url": "https://greatbeans.com/en/products/colombian-huila"
}
```

---

## PDF Generation API

### Generate Product Specification PDF

Generate a PDF document for product specifications.

**Endpoint:** `POST /api/pdf/product-spec`

**Request Body:**

```json
{
  "productId": "prod_123",
  "locale": "en",
  "options": {
    "includeImages": true,
    "includePricing": false,
    "includeSupplierInfo": true,
    "format": "A4",
    "orientation": "portrait"
  }
}
```

**Response:**

- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="product-spec-colombian-huila-high-grown-1642694400.pdf"`

### Generate RFQ Document PDF

Generate a PDF document for RFQ details.

**Endpoint:** `POST /api/pdf/rfq-document`

**Request Body:**

```json
{
  "rfqId": "rfq_456",
  "type": "quote",
  "locale": "en",
  "options": {
    "includeTerms": true,
    "includeCompanyLogo": true,
    "watermark": "CONFIDENTIAL"
  }
}
```

---

## Sitemap API

### Submit Sitemap

Submit sitemaps to search engines.

**Endpoint:** `POST /api/sitemap/submit`

**Headers:**

```http
Authorization: Bearer <api-key>
```

**Response:**

```json
{
  "success": true,
  "message": "Sitemap submission completed",
  "data": {
    "submissions": [
      {
        "searchEngine": "google",
        "status": "success",
        "submittedAt": "2024-01-20T15:30:00Z",
        "response": "Sitemap submitted successfully"
      },
      {
        "searchEngine": "bing",
        "status": "success",
        "submittedAt": "2024-01-20T15:30:15Z",
        "response": "Sitemap received"
      }
    ],
    "healthChecks": [
      {
        "url": "https://greatbeans.com/sitemap.xml",
        "status": "healthy",
        "responseTime": 245,
        "lastModified": "2024-01-20T10:00:00Z"
      }
    ]
  }
}
```

---

## Integration Examples

### JavaScript/TypeScript Client

```typescript
class GreatBeansAPI {
  private baseURL: string;
  private apiKey: string;

  constructor(baseURL: string, apiKey: string) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Get products with filtering
  async getProducts(params: ProductSearchParams) {
    const queryString = new URLSearchParams(params).toString();
    return this.request<ProductsResponse>(`/api/products?${queryString}`);
  }

  // Submit RFQ
  async submitRFQ(rfqData: RFQSubmission) {
    return this.request<RFQResponse>('/api/rfq', {
      method: 'POST',
      body: JSON.stringify(rfqData),
    });
  }

  // Search content
  async searchContent(query: string, filters: SearchFilters = {}) {
    const params = new URLSearchParams({
      q: query,
      ...filters,
    });
    return this.request<SearchResponse>(`/api/search?${params}`);
  }
}

// Usage example
const api = new GreatBeansAPI('https://greatbeans.com', 'your-api-key');

// Search for Colombian coffee products
const products = await api.getProducts({
  search: 'colombian',
  coffeeType: 'arabica',
  page: 1,
  limit: 10,
});

// Submit an RFQ
const rfq = await api.submitRFQ({
  companyInfo: {
    companyName: 'Coffee Importers Inc',
    contactPerson: 'John Doe',
    email: 'john@coffeeimporters.com',
    // ... other required fields
  },
  productRequirements: [
    {
      coffeeType: 'arabica',
      origin: 'colombia',
      quantity: 1000,
      unit: 'bags',
    },
  ],
  // ... other requirements
});
```

### Python Client

```python
import requests
from typing import Dict, Any, Optional

class GreatBeansAPI:
    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key
        self.session = requests.Session()
        self.session.headers.update({
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        })

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict[str, Any]:
        url = f"{self.base_url}{endpoint}"
        response = self.session.request(method, url, **kwargs)
        response.raise_for_status()
        return response.json()

    def get_products(self, **params) -> Dict[str, Any]:
        """Get products with filtering"""
        return self._request('GET', '/api/products', params=params)

    def submit_rfq(self, rfq_data: Dict[str, Any]) -> Dict[str, Any]:
        """Submit a new RFQ"""
        return self._request('POST', '/api/rfq', json=rfq_data)

    def search_content(self, query: str, **filters) -> Dict[str, Any]:
        """Search across all content"""
        params = {'q': query, **filters}
        return self._request('GET', '/api/search', params=params)

# Usage example
api = GreatBeansAPI('https://greatbeans.com', 'your-api-key')

# Get featured products
products = api.get_products(isFeatured=True, limit=5)

# Submit RFQ
rfq_response = api.submit_rfq({
    'companyInfo': {
        'companyName': 'Global Coffee Ltd',
        'contactPerson': 'Jane Smith',
        'email': 'jane@globalcoffee.com',
        # ... other fields
    },
    'productRequirements': [{
        'coffeeType': 'arabica',
        'origin': 'ethiopia',
        'quantity': 500,
        'unit': 'bags'
    }]
})
```

### cURL Examples

```bash
# Get products
curl -X GET "https://greatbeans.com/api/products?coffeeType=arabica&limit=10" \
  -H "Authorization: Bearer your-api-key"

# Submit RFQ
curl -X POST "https://greatbeans.com/api/rfq" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "companyInfo": {
      "companyName": "Coffee Importers Inc",
      "contactPerson": "John Doe",
      "email": "john@example.com"
    },
    "productRequirements": [{
      "coffeeType": "arabica",
      "origin": "colombia",
      "quantity": 1000,
      "unit": "bags"
    }]
  }'

# Search content
curl -X GET "https://greatbeans.com/api/search?q=coffee+market&type=blog" \
  -H "Authorization: Bearer your-api-key"

# Generate product PDF
curl -X POST "https://greatbeans.com/api/pdf/product-spec" \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"productId": "prod_123", "locale": "en"}' \
  --output product-spec.pdf
```

---

## Testing Guide

### Unit Testing

Test individual API endpoints using Jest and Supertest:

```javascript
import request from 'supertest';
import { app } from '../src/app';

describe('Products API', () => {
  test('GET /api/products returns product list', async () => {
    const response = await request(app).get('/api/products').expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.products).toBeInstanceOf(Array);
  });

  test('GET /api/products with filters', async () => {
    const response = await request(app)
      .get('/api/products?coffeeType=arabica&origin=colombia')
      .expect(200);

    expect(response.body.data.products).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          coffeeType: 'arabica',
          origin: 'colombia',
        }),
      ])
    );
  });
});
```

### Integration Testing

Test complete workflows:

```javascript
describe('RFQ Workflow', () => {
  test('Complete RFQ submission and processing', async () => {
    // Submit RFQ
    const rfqResponse = await request(app)
      .post('/api/rfq')
      .send(mockRFQData)
      .expect(201);

    const rfqId = rfqResponse.body.data.rfq.id;

    // Update status
    await request(app)
      .patch(`/api/rfq/${rfqId}/status`)
      .send({ status: 'in_progress' })
      .expect(200);

    // Add communication
    await request(app)
      .post(`/api/rfq/${rfqId}/communications`)
      .send(mockCommunication)
      .expect(201);

    // Create quote
    const quoteResponse = await request(app)
      .post(`/api/rfq/${rfqId}/quotes`)
      .send(mockQuoteData)
      .expect(201);

    expect(quoteResponse.body.data.quote).toHaveProperty('id');
  });
});
```

### Load Testing

Use Artillery or similar tools:

```yaml
# artillery-config.yml
config:
  target: 'https://greatbeans.com'
  phases:
    - duration: 60
      arrivalRate: 10
  headers:
    Authorization: 'Bearer your-api-key'

scenarios:
  - name: 'Product Search'
    weight: 70
    flow:
      - get:
          url: '/api/products'
          qs:
            page: 1
            limit: 20
      - think: 2

  - name: 'Content Search'
    weight: 30
    flow:
      - get:
          url: '/api/search'
          qs:
            q: 'coffee'
            type: 'all'
      - think: 3
```

---

## Postman Collection

### Collection Structure

```json
{
  "info": {
    "name": "Great Beans Coffee API",
    "description": "Comprehensive API collection for The Great Beans Coffee Export Platform",
    "version": "1.0.0"
  },
  "auth": {
    "type": "bearer",
    "bearer": [
      {
        "key": "token",
        "value": "{{api_key}}",
        "type": "string"
      }
    ]
  },
  "variable": [
    {
      "key": "base_url",
      "value": "https://greatbeans.com/api",
      "type": "string"
    },
    {
      "key": "api_key",
      "value": "your-api-key-here",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Products",
      "item": [
        {
          "name": "Get Products",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/products?page=1&limit=10",
              "host": ["{{base_url}}"],
              "path": ["products"],
              "query": [
                { "key": "page", "value": "1" },
                { "key": "limit", "value": "10" }
              ]
            }
          }
        },
        {
          "name": "Search Products",
          "request": {
            "method": "GET",
            "header": [],
            "url": {
              "raw": "{{base_url}}/products/search?q=colombian&facets=true",
              "host": ["{{base_url}}"],
              "path": ["products", "search"],
              "query": [
                { "key": "q", "value": "colombian" },
                { "key": "facets", "value": "true" }
              ]
            }
          }
        }
      ]
    },
    {
      "name": "RFQ",
      "item": [
        {
          "name": "Submit RFQ",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"companyInfo\": {\n    \"companyName\": \"Test Company\",\n    \"contactPerson\": \"John Doe\",\n    \"email\": \"john@test.com\"\n  },\n  \"productRequirements\": [{\n    \"coffeeType\": \"arabica\",\n    \"origin\": \"colombia\",\n    \"quantity\": 1000,\n    \"unit\": \"bags\"\n  }]\n}"
            },
            "url": {
              "raw": "{{base_url}}/rfq",
              "host": ["{{base_url}}"],
              "path": ["rfq"]
            }
          }
        }
      ]
    }
  ]
}
```

### Environment Variables

```json
{
  "name": "Great Beans API - Production",
  "values": [
    {
      "key": "base_url",
      "value": "https://greatbeans.com/api",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "your-production-api-key",
      "enabled": true
    }
  ]
}
```

---

## Support and Resources

### Documentation

- **API Reference**: This document
- **Getting Started Guide**: `/docs/API_GETTING_STARTED.md`
- **Authentication Guide**: `/docs/API_AUTHENTICATION.md`
- **Rate Limiting**: `/docs/API_RATE_LIMITING.md`

### Development Tools

- **Postman Collection**: Available in `/docs/postman/`
- **OpenAPI Specification**: `/docs/openapi.yaml`
- **SDK Libraries**: Available for JavaScript, Python, PHP

### Support Channels

- **Technical Support**: api-support@greatbeans.com
- **Documentation Issues**: docs@greatbeans.com
- **Feature Requests**: GitHub Issues
- **Community Forum**: https://community.greatbeans.com

### Status Page

Monitor API status and uptime: https://status.greatbeans.com

---

_Last Updated: January 20, 2024_
_API Version: 1.0.0_
_Documentation Version: 1.0.0_
