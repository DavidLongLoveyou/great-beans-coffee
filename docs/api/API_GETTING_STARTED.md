# API Getting Started Guide - The Great Beans Coffee Export Platform

## Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Your First API Call](#your-first-api-call)
4. [Common Use Cases](#common-use-cases)
5. [SDK and Libraries](#sdk-and-libraries)
6. [Code Examples](#code-examples)
7. [Best Practices](#best-practices)
8. [Rate Limits](#rate-limits)
9. [Error Handling](#error-handling)
10. [Next Steps](#next-steps)

---

## Quick Start

Welcome to The Great Beans Coffee Export Platform API! This guide will help you get up and running in minutes.

### Prerequisites

- Basic knowledge of REST APIs
- An API key (contact our team to get one)
- Your preferred programming language and HTTP client

### Base URLs

- **Production**: `https://greatbeans.com/api`
- **Staging**: `https://staging.greatbeans.com/api`
- **Development**: `http://localhost:3000/api`

---

## Authentication

All API requests require authentication using an API key in the Authorization header.

### API Key Format

```http
Authorization: Bearer YOUR_API_KEY_HERE
```

### Getting Your API Key

1. Contact our business development team
2. Complete the partner registration process
3. Receive your unique API key via secure email
4. Store your API key securely (never commit to version control)

### Environment Variables

Store your API key securely:

```bash
# .env
GREAT_BEANS_API_KEY=your_api_key_here
GREAT_BEANS_API_URL=https://greatbeans.com/api
```

---

## Your First API Call

Let's start with a simple request to get the list of available coffee products.

### cURL Example

```bash
curl -X GET "https://greatbeans.com/api/products" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

### Expected Response

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": "prod_colombia_001",
        "sku": "COL-HG-001",
        "coffeeType": "arabica",
        "origin": "colombia",
        "grade": "high_grown",
        "processing": "washed",
        "translations": {
          "name": "Colombian High Grown Arabica",
          "description": "Premium Colombian coffee from high altitude regions"
        },
        "pricing": {
          "basePrice": 4.25,
          "currency": "USD",
          "unit": "lb"
        },
        "availability": {
          "inStock": true,
          "stockLevel": "high",
          "minimumOrder": 100
        },
        "images": [
          {
            "url": "https://cdn.greatbeans.com/products/colombia-001.jpg",
            "alt": "Colombian High Grown Arabica Coffee Beans",
            "isPrimary": true
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 156,
      "totalPages": 8
    },
    "facets": {
      "coffeeTypes": ["arabica", "robusta"],
      "origins": ["colombia", "brazil", "ethiopia"],
      "grades": ["high_grown", "strictly_hard_bean"]
    }
  },
  "meta": {
    "timestamp": "2024-01-20T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## Common Use Cases

### 1. Browse Coffee Products

Perfect for building product catalogs and search interfaces.

```javascript
// Get products with filtering
const response = await fetch(
  'https://greatbeans.com/api/products?coffeeType=arabica&origin=colombia&page=1&limit=20',
  {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

const data = await response.json();
console.log(`Found ${data.data.pagination.total} products`);
```

### 2. Search for Specific Coffee

```javascript
// Search for specific coffee types
const searchResponse = await fetch(
  'https://greatbeans.com/api/products/search?q=organic+ethiopian&facets=true',
  {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

const searchData = await searchResponse.json();
```

### 3. Submit a Request for Quote (RFQ)

```javascript
// Submit an RFQ for bulk coffee purchase
const rfqData = {
  companyInfo: {
    companyName: 'Your Coffee Company',
    contactPerson: 'John Smith',
    email: 'john@yourcoffee.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Coffee Street',
      city: 'Coffee City',
      state: 'CA',
      postalCode: '90210',
      country: 'United States',
    },
    businessType: 'importer',
    yearsInBusiness: 10,
  },
  productRequirements: [
    {
      coffeeType: 'arabica',
      origin: 'colombia',
      grade: 'high_grown',
      processing: 'washed',
      certifications: ['organic', 'fair_trade'],
    },
  ],
  quantityRequirements: {
    quantity: 1000,
    unit: 'bags',
    frequency: 'monthly',
    contractDuration: '12_months',
  },
  timeline: {
    urgency: 'standard',
    preferredDelivery: '2024-06-01',
  },
};

const rfqResponse = await fetch('https://greatbeans.com/api/rfq', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(rfqData),
});

const rfqResult = await rfqResponse.json();
console.log(`RFQ created with ID: ${rfqResult.data.rfq.id}`);
```

### 4. Track RFQ Status

```javascript
// Check RFQ status
const rfqId = 'rfq_abc123';
const statusResponse = await fetch(
  `https://greatbeans.com/api/rfq/${rfqId}/status`,
  {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  }
);

const statusData = await statusResponse.json();
console.log(`RFQ Status: ${statusData.data.status.current}`);
```

---

## SDK and Libraries

### Official JavaScript/TypeScript SDK

```bash
npm install @greatbeans/api-sdk
```

```javascript
import { GreatBeansAPI } from '@greatbeans/api-sdk';

const api = new GreatBeansAPI({
  apiKey: process.env.GREAT_BEANS_API_KEY,
  environment: 'production', // or 'staging', 'development'
});

// Get products
const products = await api.products.list({
  coffeeType: 'arabica',
  origin: 'colombia',
  page: 1,
  limit: 20,
});

// Submit RFQ
const rfq = await api.rfq.create({
  companyInfo: {
    /* ... */
  },
  productRequirements: [
    /* ... */
  ],
  quantityRequirements: {
    /* ... */
  },
});
```

### Python SDK

```bash
pip install greatbeans-api
```

```python
from greatbeans_api import GreatBeansAPI

api = GreatBeansAPI(api_key="your_api_key_here")

# Get products
products = api.products.list(
    coffee_type="arabica",
    origin="colombia",
    page=1,
    limit=20
)

# Submit RFQ
rfq = api.rfq.create({
    "companyInfo": { # ... },
    "productRequirements": [ # ... ],
    "quantityRequirements": { # ... }
})
```

### PHP SDK

```bash
composer require greatbeans/api-sdk
```

```php
<?php
use GreatBeans\API\Client;

$api = new Client([
    'api_key' => getenv('GREAT_BEANS_API_KEY'),
    'environment' => 'production'
]);

// Get products
$products = $api->products()->list([
    'coffeeType' => 'arabica',
    'origin' => 'colombia',
    'page' => 1,
    'limit' => 20
]);

// Submit RFQ
$rfq = $api->rfq()->create([
    'companyInfo' => [ /* ... */ ],
    'productRequirements' => [ /* ... */ ],
    'quantityRequirements' => [ /* ... */ ]
]);
?>
```

---

## Code Examples

### React Integration

```jsx
import React, { useState, useEffect } from 'react';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    coffeeType: '',
    origin: '',
    page: 1,
  });

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const response = await fetch(`/api/products?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setProducts(data.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-catalog">
      <div className="filters">
        <select
          value={filters.coffeeType}
          onChange={e => setFilters({ ...filters, coffeeType: e.target.value })}
        >
          <option value="">All Coffee Types</option>
          <option value="arabica">Arabica</option>
          <option value="robusta">Robusta</option>
        </select>

        <select
          value={filters.origin}
          onChange={e => setFilters({ ...filters, origin: e.target.value })}
        >
          <option value="">All Origins</option>
          <option value="colombia">Colombia</option>
          <option value="brazil">Brazil</option>
          <option value="ethiopia">Ethiopia</option>
        </select>
      </div>

      {loading ? (
        <div>Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <img src={product.images[0]?.url} alt={product.images[0]?.alt} />
              <h3>{product.translations.name}</h3>
              <p>{product.translations.description}</p>
              <div className="price">
                ${product.pricing.basePrice} per {product.pricing.unit}
              </div>
              <div className="origin">Origin: {product.origin}</div>
              <div className="grade">Grade: {product.grade}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
```

### Node.js Express Integration

```javascript
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Middleware for API authentication
const authenticateAPI = (req, res, next) => {
  const apiKey = process.env.GREAT_BEANS_API_KEY;
  req.apiHeaders = {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  };
  next();
};

// Proxy endpoint for products
app.get('/api/products', authenticateAPI, async (req, res) => {
  try {
    const response = await axios.get('https://greatbeans.com/api/products', {
      headers: req.apiHeaders,
      params: req.query,
    });

    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to fetch products',
    });
  }
});

// RFQ submission endpoint
app.post('/api/rfq', authenticateAPI, async (req, res) => {
  try {
    const response = await axios.post(
      'https://greatbeans.com/api/rfq',
      req.body,
      {
        headers: req.apiHeaders,
      }
    );

    res.status(201).json(response.data);
  } catch (error) {
    console.error(
      'RFQ Submission Error:',
      error.response?.data || error.message
    );
    res.status(error.response?.status || 500).json({
      success: false,
      message: 'Failed to submit RFQ',
    });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Python Flask Integration

```python
from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

API_BASE_URL = "https://greatbeans.com/api"
API_KEY = os.getenv("GREAT_BEANS_API_KEY")

def get_api_headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        response = requests.get(
            f"{API_BASE_URL}/products",
            headers=get_api_headers(),
            params=request.args
        )
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "message": "Failed to fetch products"
        }), 500

@app.route('/api/rfq', methods=['POST'])
def submit_rfq():
    try:
        response = requests.post(
            f"{API_BASE_URL}/rfq",
            headers=get_api_headers(),
            json=request.json
        )
        response.raise_for_status()
        return jsonify(response.json()), 201
    except requests.exceptions.RequestException as e:
        return jsonify({
            "success": False,
            "message": "Failed to submit RFQ"
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
```

---

## Best Practices

### 1. API Key Security

```javascript
// ✅ Good: Store API keys in environment variables
const apiKey = process.env.GREAT_BEANS_API_KEY;

// ❌ Bad: Hardcode API keys
const apiKey = 'gb_live_abc123...'; // Never do this!

// ✅ Good: Use server-side proxy for client-side apps
// Client -> Your Server -> Great Beans API

// ❌ Bad: Expose API keys in client-side code
fetch('https://greatbeans.com/api/products', {
  headers: { Authorization: 'Bearer ' + apiKey }, // Exposed to users!
});
```

### 2. Error Handling

```javascript
async function fetchProducts(filters = {}) {
  try {
    const response = await fetch('https://greatbeans.com/api/products', {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);

    // Handle different error types
    if (error.message.includes('401')) {
      // Handle authentication error
      throw new Error('Invalid API key');
    } else if (error.message.includes('429')) {
      // Handle rate limiting
      throw new Error('Rate limit exceeded. Please try again later.');
    } else {
      // Handle other errors
      throw new Error('Failed to fetch products. Please try again.');
    }
  }
}
```

### 3. Pagination Handling

```javascript
async function getAllProducts(filters = {}) {
  const allProducts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(
      `https://greatbeans.com/api/products?page=${page}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    allProducts.push(...data.data.products);

    hasMore = page < data.data.pagination.totalPages;
    page++;

    // Add delay to respect rate limits
    if (hasMore) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  return allProducts;
}
```

### 4. Caching Strategies

```javascript
class GreatBeansAPIClient {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  async getProducts(filters = {}) {
    const cacheKey = JSON.stringify(filters);
    const cached = this.cache.get(cacheKey);

    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    const data = await this.fetchProducts(filters);
    this.cache.set(cacheKey, {
      data,
      timestamp: Date.now(),
    });

    return data;
  }

  async fetchProducts(filters) {
    // Actual API call implementation
  }
}
```

---

## Rate Limits

### Current Limits

- **Standard Plan**: 1,000 requests per hour
- **Business Plan**: 10,000 requests per hour
- **Enterprise Plan**: Custom limits

### Rate Limit Headers

```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642694400
```

### Handling Rate Limits

```javascript
async function makeAPIRequest(url, options = {}) {
  const response = await fetch(url, options);

  if (response.status === 429) {
    const resetTime = parseInt(response.headers.get('X-RateLimit-Reset'));
    const waitTime = resetTime * 1000 - Date.now();

    console.log(`Rate limit exceeded. Waiting ${waitTime}ms...`);
    await new Promise(resolve => setTimeout(resolve, waitTime));

    // Retry the request
    return makeAPIRequest(url, options);
  }

  return response;
}
```

---

## Error Handling

### Common Error Codes

| Status Code | Error Type            | Description                |
| ----------- | --------------------- | -------------------------- |
| 400         | Bad Request           | Invalid request parameters |
| 401         | Unauthorized          | Invalid or missing API key |
| 403         | Forbidden             | Insufficient permissions   |
| 404         | Not Found             | Resource not found         |
| 409         | Conflict              | Resource already exists    |
| 429         | Too Many Requests     | Rate limit exceeded        |
| 500         | Internal Server Error | Server error               |

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request parameters",
    "details": [
      {
        "field": "companyInfo.email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-20T10:30:00Z",
    "requestId": "req_error_123"
  }
}
```

### Error Handling Best Practices

```javascript
function handleAPIError(error, response) {
  const errorData = response?.data || {};

  switch (response?.status) {
    case 400:
      console.error('Validation Error:', errorData.error?.details);
      return 'Please check your input and try again.';

    case 401:
      console.error('Authentication Error:', errorData.error?.message);
      return 'Invalid API credentials. Please check your API key.';

    case 403:
      console.error('Permission Error:', errorData.error?.message);
      return 'You do not have permission to access this resource.';

    case 404:
      console.error('Not Found:', errorData.error?.message);
      return 'The requested resource was not found.';

    case 429:
      console.error('Rate Limit Exceeded:', errorData.error?.message);
      return 'Too many requests. Please try again later.';

    case 500:
      console.error('Server Error:', errorData.error?.message);
      return 'Server error. Please try again later.';

    default:
      console.error('Unknown Error:', error);
      return 'An unexpected error occurred. Please try again.';
  }
}
```

---

## Next Steps

### 1. Explore Advanced Features

- **Webhooks**: Get real-time notifications for RFQ updates
- **Bulk Operations**: Process multiple products or RFQs at once
- **Analytics**: Access detailed market and performance data
- **Custom Integrations**: Build tailored solutions for your business

### 2. Join Our Developer Community

- **Developer Portal**: [https://developers.greatbeans.com](https://developers.greatbeans.com)
- **Discord Community**: [https://discord.gg/greatbeans-dev](https://discord.gg/greatbeans-dev)
- **GitHub**: [https://github.com/greatbeans](https://github.com/greatbeans)
- **Stack Overflow**: Tag your questions with `great-beans-api`

### 3. Get Support

- **Technical Support**: [api-support@greatbeans.com](mailto:api-support@greatbeans.com)
- **Business Development**: [partnerships@greatbeans.com](mailto:partnerships@greatbeans.com)
- **Documentation Issues**: [docs@greatbeans.com](mailto:docs@greatbeans.com)

### 4. Stay Updated

- **API Changelog**: [https://developers.greatbeans.com/changelog](https://developers.greatbeans.com/changelog)
- **Status Page**: [https://status.greatbeans.com](https://status.greatbeans.com)
- **Developer Newsletter**: Subscribe for updates and tips

### 5. Additional Resources

- [API Reference Documentation](./COMPREHENSIVE_API_DOCUMENTATION.md)
- [API Testing Guide](./API_TESTING_GUIDE.md)
- [OpenAPI Specification](./openapi.yaml)
- [Postman Collection](./postman-collection.json)

---

## Quick Reference

### Essential Endpoints

```bash
# Get products
GET /api/products

# Search products
GET /api/products/search?q=colombian

# Get single product
GET /api/products/{id}

# Submit RFQ
POST /api/rfq

# Get RFQ status
GET /api/rfq/{id}/status

# Search content
GET /api/search?q=market+report&type=blog
```

### Authentication Header

```http
Authorization: Bearer YOUR_API_KEY_HERE
```

### Response Format

```json
{
  "success": true,
  "data": {
    /* response data */
  },
  "meta": {
    "timestamp": "2024-01-20T10:30:00Z",
    "requestId": "req_abc123"
  }
}
```

---

_Happy coding! Welcome to The Great Beans developer community._

_Last Updated: January 20, 2024_
_Version: 1.0.0_
