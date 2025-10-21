# API Testing Guide - The Great Beans Coffee Export Platform

## Table of Contents

1. [Overview](#overview)
2. [Testing Strategy](#testing-strategy)
3. [Environment Setup](#environment-setup)
4. [Postman Collection](#postman-collection)
5. [Manual Testing](#manual-testing)
6. [Automated Testing](#automated-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)
9. [Testing Workflows](#testing-workflows)
10. [Troubleshooting](#troubleshooting)

---

## Overview

This guide provides comprehensive testing strategies, tools, and examples for The Great Beans Coffee Export Platform API. It covers manual testing, automated testing, performance testing, and security testing approaches.

### Testing Objectives

- **Functionality**: Verify all endpoints work as expected
- **Performance**: Ensure API meets performance requirements
- **Security**: Validate authentication and authorization
- **Reliability**: Test error handling and edge cases
- **Integration**: Verify end-to-end workflows

---

## Testing Strategy

### Testing Pyramid

```
    /\
   /  \    E2E Tests (10%)
  /____\   Integration Tests (20%)
 /______\  Unit Tests (70%)
```

### Test Types

1. **Unit Tests**: Individual endpoint testing
2. **Integration Tests**: Multi-endpoint workflows
3. **Contract Tests**: API contract validation
4. **Performance Tests**: Load and stress testing
5. **Security Tests**: Authentication and authorization
6. **E2E Tests**: Complete user journeys

---

## Environment Setup

### Prerequisites

- Node.js 18+
- Postman or Insomnia
- Jest (for automated testing)
- Artillery (for load testing)
- Valid API credentials

### Environment Variables

Create a `.env.test` file:

```bash
# API Configuration
API_BASE_URL=http://localhost:3000/api
API_BASE_URL_PROD=https://greatbeans.com/api

# Authentication
TEST_API_KEY=your-test-api-key
TEST_JWT_TOKEN=your-test-jwt-token

# Test Data
TEST_PRODUCT_ID=prod_test_123
TEST_RFQ_ID=rfq_test_456
TEST_COMPANY_EMAIL=test@example.com

# Database
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/greatbeans_test
```

### Test Database Setup

```bash
# Create test database
npm run db:test:setup

# Run migrations
npm run db:test:migrate

# Seed test data
npm run db:test:seed
```

---

## Postman Collection

### Collection Structure

```json
{
  "info": {
    "name": "Great Beans Coffee API - Complete Test Suite",
    "description": "Comprehensive API testing collection for The Great Beans Coffee Export Platform",
    "version": "1.0.0",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
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
      "value": "{{base_url}}",
      "type": "string"
    },
    {
      "key": "api_key",
      "value": "{{api_key}}",
      "type": "string"
    },
    {
      "key": "test_product_id",
      "value": "",
      "type": "string"
    },
    {
      "key": "test_rfq_id",
      "value": "",
      "type": "string"
    }
  ]
}
```

### Environment Configuration

#### Development Environment

```json
{
  "name": "Development",
  "values": [
    {
      "key": "base_url",
      "value": "http://localhost:3000/api",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "dev-api-key-here",
      "enabled": true
    }
  ]
}
```

#### Production Environment

```json
{
  "name": "Production",
  "values": [
    {
      "key": "base_url",
      "value": "https://greatbeans.com/api",
      "enabled": true
    },
    {
      "key": "api_key",
      "value": "prod-api-key-here",
      "enabled": true
    }
  ]
}
```

### Test Collections

#### 1. Products API Tests

```json
{
  "name": "Products API",
  "item": [
    {
      "name": "Get Products List",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Response has success flag', function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.success).to.be.true;",
              "});",
              "",
              "pm.test('Response contains products array', function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.products).to.be.an('array');",
              "});",
              "",
              "pm.test('Products have required fields', function () {",
              "    const jsonData = pm.response.json();",
              "    if (jsonData.data.products.length > 0) {",
              "        const product = jsonData.data.products[0];",
              "        pm.expect(product).to.have.property('id');",
              "        pm.expect(product).to.have.property('sku');",
              "        pm.expect(product).to.have.property('coffeeType');",
              "        pm.expect(product).to.have.property('origin');",
              "        ",
              "        // Store first product ID for other tests",
              "        pm.collectionVariables.set('test_product_id', product.id);",
              "    }",
              "});",
              "",
              "pm.test('Pagination is present', function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.pagination).to.be.an('object');",
              "    pm.expect(jsonData.data.pagination).to.have.property('page');",
              "    pm.expect(jsonData.data.pagination).to.have.property('limit');",
              "    pm.expect(jsonData.data.pagination).to.have.property('total');",
              "});"
            ]
          }
        }
      ],
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
      "name": "Get Single Product",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Status code is 200', function () {",
              "    pm.response.to.have.status(200);",
              "});",
              "",
              "pm.test('Product details are complete', function () {",
              "    const jsonData = pm.response.json();",
              "    const product = jsonData.data.product;",
              "    ",
              "    pm.expect(product).to.have.property('id');",
              "    pm.expect(product).to.have.property('translations');",
              "    pm.expect(product).to.have.property('pricing');",
              "    pm.expect(product).to.have.property('availability');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/products/{{test_product_id}}",
          "host": ["{{base_url}}"],
          "path": ["products", "{{test_product_id}}"]
        }
      }
    },
    {
      "name": "Search Products",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('Search returns relevant results', function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.products).to.be.an('array');",
              "    ",
              "    // Check if results contain search term",
              "    if (jsonData.data.products.length > 0) {",
              "        const product = jsonData.data.products[0];",
              "        const searchTerm = 'colombian';",
              "        const productText = JSON.stringify(product).toLowerCase();",
              "        pm.expect(productText).to.include(searchTerm);",
              "    }",
              "});"
            ]
          }
        }
      ],
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
}
```

#### 2. RFQ API Tests

```json
{
  "name": "RFQ API",
  "item": [
    {
      "name": "Submit RFQ",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('RFQ submission successful', function () {",
              "    pm.response.to.have.status(201);",
              "});",
              "",
              "pm.test('RFQ ID is returned', function () {",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.rfq).to.have.property('id');",
              "    pm.expect(jsonData.data.rfq).to.have.property('rfqNumber');",
              "    ",
              "    // Store RFQ ID for other tests",
              "    pm.collectionVariables.set('test_rfq_id', jsonData.data.rfq.id);",
              "});"
            ]
          }
        }
      ],
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
          "raw": "{\n  \"companyInfo\": {\n    \"companyName\": \"Test Coffee Importers\",\n    \"contactPerson\": \"John Test\",\n    \"email\": \"john.test@example.com\",\n    \"phone\": \"+1-555-TEST\",\n    \"address\": {\n      \"street\": \"123 Test Street\",\n      \"city\": \"Test City\",\n      \"state\": \"TS\",\n      \"postalCode\": \"12345\",\n      \"country\": \"United States\"\n    },\n    \"businessType\": \"importer\",\n    \"yearsInBusiness\": 10\n  },\n  \"productRequirements\": [\n    {\n      \"coffeeType\": \"arabica\",\n      \"origin\": \"colombia\",\n      \"grade\": \"high_grown\",\n      \"processing\": \"washed\",\n      \"certifications\": [\"organic\"]\n    }\n  ],\n  \"quantityRequirements\": {\n    \"quantity\": 500,\n    \"unit\": \"bags\",\n    \"frequency\": \"monthly\",\n    \"contractDuration\": \"6_months\"\n  },\n  \"timeline\": {\n    \"urgency\": \"standard\",\n    \"preferredDelivery\": \"2024-06-01\"\n  }\n}"
        },
        "url": {
          "raw": "{{base_url}}/rfq",
          "host": ["{{base_url}}"],
          "path": ["rfq"]
        }
      }
    },
    {
      "name": "Get RFQ Details",
      "event": [
        {
          "listen": "test",
          "script": {
            "exec": [
              "pm.test('RFQ details retrieved', function () {",
              "    pm.response.to.have.status(200);",
              "    const jsonData = pm.response.json();",
              "    pm.expect(jsonData.data.rfq).to.have.property('id');",
              "    pm.expect(jsonData.data.rfq).to.have.property('status');",
              "});"
            ]
          }
        }
      ],
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/rfq/{{test_rfq_id}}",
          "host": ["{{base_url}}"],
          "path": ["rfq", "{{test_rfq_id}}"]
        }
      }
    }
  ]
}
```

### Pre-request Scripts

#### Authentication Setup

```javascript
// Pre-request script for authenticated endpoints
const apiKey = pm.environment.get('api_key');
if (apiKey) {
  pm.request.headers.add({
    key: 'Authorization',
    value: `Bearer ${apiKey}`,
  });
}

// Set timestamp for requests
pm.globals.set('timestamp', new Date().toISOString());
```

#### Dynamic Data Generation

```javascript
// Generate test data
const faker = require('faker');

pm.globals.set('test_email', faker.internet.email());
pm.globals.set('test_company', faker.company.companyName());
pm.globals.set('test_phone', faker.phone.phoneNumber());
```

---

## Manual Testing

### Testing Checklist

#### Products API

- [ ] Get products list with default parameters
- [ ] Get products with filtering (coffeeType, origin, grade)
- [ ] Get products with pagination
- [ ] Get products with sorting
- [ ] Get single product by valid ID
- [ ] Get single product by invalid ID (404 test)
- [ ] Search products with query
- [ ] Search products with filters
- [ ] Test product image URLs

#### RFQ API

- [ ] Submit valid RFQ
- [ ] Submit RFQ with missing required fields
- [ ] Submit RFQ with invalid data types
- [ ] Get RFQ list with filters
- [ ] Get RFQ details by ID
- [ ] Update RFQ status
- [ ] Add communication to RFQ
- [ ] Create quote for RFQ

#### Authentication

- [ ] Access protected endpoint without token (401 test)
- [ ] Access protected endpoint with invalid token (401 test)
- [ ] Access protected endpoint with expired token (401 test)
- [ ] Access protected endpoint with valid token (200 test)

#### Error Handling

- [ ] Test rate limiting (429 test)
- [ ] Test malformed JSON (400 test)
- [ ] Test unsupported HTTP methods (405 test)
- [ ] Test non-existent endpoints (404 test)

### Manual Test Cases

#### Test Case 1: Product Search Functionality

**Objective**: Verify product search returns relevant results

**Steps**:

1. Send GET request to `/api/products/search?q=colombian`
2. Verify response status is 200
3. Verify response contains products array
4. Verify products contain "colombian" in relevant fields
5. Test with different search terms

**Expected Results**:

- Status: 200 OK
- Response contains relevant products
- Search highlighting works correctly

#### Test Case 2: RFQ Submission Workflow

**Objective**: Test complete RFQ submission and processing

**Steps**:

1. Submit RFQ with valid data
2. Verify RFQ is created with unique ID
3. Retrieve RFQ details
4. Update RFQ status
5. Add communication
6. Create quote

**Expected Results**:

- RFQ created successfully
- Status updates work
- Communications are tracked
- Quotes can be generated

---

## Automated Testing

### Jest Test Suite

#### Setup

```javascript
// tests/api/setup.js
import { beforeAll, afterAll } from '@jest/globals';
import { setupTestDatabase, teardownTestDatabase } from '../utils/database';

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});
```

#### Products API Tests

```javascript
// tests/api/products.test.js
import request from 'supertest';
import { app } from '../../src/app';

describe('Products API', () => {
  describe('GET /api/products', () => {
    test('should return products list', async () => {
      const response = await request(app).get('/api/products').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.products).toBeInstanceOf(Array);
      expect(response.body.data.pagination).toBeDefined();
    });

    test('should filter products by coffee type', async () => {
      const response = await request(app)
        .get('/api/products?coffeeType=arabica')
        .expect(200);

      const products = response.body.data.products;
      products.forEach(product => {
        expect(product.coffeeType).toBe('arabica');
      });
    });

    test('should paginate results correctly', async () => {
      const page1 = await request(app)
        .get('/api/products?page=1&limit=5')
        .expect(200);

      const page2 = await request(app)
        .get('/api/products?page=2&limit=5')
        .expect(200);

      expect(page1.body.data.products).toHaveLength(5);
      expect(page2.body.data.products).toHaveLength(5);
      expect(page1.body.data.products[0].id).not.toBe(
        page2.body.data.products[0].id
      );
    });
  });

  describe('GET /api/products/:id', () => {
    test('should return single product', async () => {
      const productsResponse = await request(app)
        .get('/api/products?limit=1')
        .expect(200);

      const productId = productsResponse.body.data.products[0].id;

      const response = await request(app)
        .get(`/api/products/${productId}`)
        .expect(200);

      expect(response.body.data.product.id).toBe(productId);
      expect(response.body.data.product).toHaveProperty('translations');
      expect(response.body.data.product).toHaveProperty('pricing');
    });

    test('should return 404 for non-existent product', async () => {
      await request(app).get('/api/products/non-existent-id').expect(404);
    });
  });
});
```

#### RFQ API Tests

```javascript
// tests/api/rfq.test.js
import request from 'supertest';
import { app } from '../../src/app';

const mockRFQData = {
  companyInfo: {
    companyName: 'Test Coffee Co',
    contactPerson: 'John Test',
    email: 'john@testcoffee.com',
    phone: '+1-555-0123',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TS',
      postalCode: '12345',
      country: 'United States',
    },
    businessType: 'importer',
    yearsInBusiness: 5,
  },
  productRequirements: [
    {
      coffeeType: 'arabica',
      origin: 'colombia',
      grade: 'high_grown',
      processing: 'washed',
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

describe('RFQ API', () => {
  let rfqId;

  describe('POST /api/rfq', () => {
    test('should create RFQ successfully', async () => {
      const response = await request(app)
        .post('/api/rfq')
        .send(mockRFQData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.rfq).toHaveProperty('id');
      expect(response.body.data.rfq).toHaveProperty('rfqNumber');

      rfqId = response.body.data.rfq.id;
    });

    test('should validate required fields', async () => {
      const invalidData = { ...mockRFQData };
      delete invalidData.companyInfo.email;

      await request(app).post('/api/rfq').send(invalidData).expect(400);
    });
  });

  describe('GET /api/rfq/:id', () => {
    test('should retrieve RFQ details', async () => {
      const response = await request(app).get(`/api/rfq/${rfqId}`).expect(200);

      expect(response.body.data.rfq.id).toBe(rfqId);
      expect(response.body.data.rfq).toHaveProperty('companyInfo');
      expect(response.body.data.rfq).toHaveProperty('productRequirements');
    });
  });
});
```

### Test Utilities

```javascript
// tests/utils/api-client.js
export class TestAPIClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL;
    this.apiKey = apiKey;
  }

  async request(method, endpoint, data = null) {
    const url = `${this.baseURL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    return {
      status: response.status,
      data: await response.json(),
    };
  }

  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request('GET', `/products?${queryString}`);
  }

  async submitRFQ(rfqData) {
    return this.request('POST', '/rfq', rfqData);
  }
}
```

---

## Performance Testing

### Artillery Configuration

```yaml
# artillery-load-test.yml
config:
  target: 'http://localhost:3000'
  phases:
    - duration: 60
      arrivalRate: 10
      name: 'Warm up'
    - duration: 120
      arrivalRate: 50
      name: 'Load test'
    - duration: 60
      arrivalRate: 100
      name: 'Stress test'
  headers:
    Authorization: 'Bearer {{$env.TEST_API_KEY}}'

scenarios:
  - name: 'Product browsing'
    weight: 60
    flow:
      - get:
          url: '/api/products'
          qs:
            page: 1
            limit: 20
      - think: 2
      - get:
          url: '/api/products/search'
          qs:
            q: 'arabica'
      - think: 3

  - name: 'Product details'
    weight: 30
    flow:
      - get:
          url: '/api/products'
          capture:
            - json: '$.data.products[0].id'
              as: 'productId'
      - get:
          url: '/api/products/{{ productId }}'
      - think: 5

  - name: 'RFQ submission'
    weight: 10
    flow:
      - post:
          url: '/api/rfq'
          json:
            companyInfo:
              companyName: 'Load Test Company'
              contactPerson: 'Test User'
              email: 'test@loadtest.com'
            productRequirements:
              - coffeeType: 'arabica'
                origin: 'colombia'
                quantity: 1000
                unit: 'bags'
      - think: 1
```

### Performance Test Scripts

```javascript
// scripts/performance-test.js
import { check, sleep } from 'k6';
import http from 'k6/http';

export let options = {
  stages: [
    { duration: '2m', target: 10 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.1'],
  },
};

const BASE_URL = 'http://localhost:3000/api';
const API_KEY = __ENV.TEST_API_KEY;

export default function () {
  const headers = {
    Authorization: `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
  };

  // Test product listing
  let response = http.get(`${BASE_URL}/products?page=1&limit=20`, { headers });
  check(response, {
    'products list status is 200': r => r.status === 200,
    'products list response time < 500ms': r => r.timings.duration < 500,
  });

  sleep(1);

  // Test product search
  response = http.get(`${BASE_URL}/products/search?q=arabica`, { headers });
  check(response, {
    'product search status is 200': r => r.status === 200,
    'product search response time < 1000ms': r => r.timings.duration < 1000,
  });

  sleep(2);
}
```

---

## Security Testing

### Authentication Tests

```javascript
// tests/security/auth.test.js
describe('Authentication Security', () => {
  test('should reject requests without authentication', async () => {
    await request(app).get('/api/rfq').expect(401);
  });

  test('should reject requests with invalid token', async () => {
    await request(app)
      .get('/api/rfq')
      .set('Authorization', 'Bearer invalid-token')
      .expect(401);
  });

  test('should reject requests with expired token', async () => {
    const expiredToken = generateExpiredToken();
    await request(app)
      .get('/api/rfq')
      .set('Authorization', `Bearer ${expiredToken}`)
      .expect(401);
  });
});
```

### Input Validation Tests

```javascript
// tests/security/validation.test.js
describe('Input Validation Security', () => {
  test('should prevent SQL injection in search', async () => {
    const maliciousQuery = "'; DROP TABLE products; --";
    await request(app)
      .get(`/api/products/search?q=${encodeURIComponent(maliciousQuery)}`)
      .expect(400);
  });

  test('should prevent XSS in RFQ submission', async () => {
    const xssPayload = '<script>alert("xss")</script>';
    const rfqData = {
      ...mockRFQData,
      companyInfo: {
        ...mockRFQData.companyInfo,
        companyName: xssPayload,
      },
    };

    const response = await request(app)
      .post('/api/rfq')
      .send(rfqData)
      .expect(400);

    expect(response.body.message).toContain('validation');
  });
});
```

---

## Testing Workflows

### CI/CD Pipeline Tests

```yaml
# .github/workflows/api-tests.yml
name: API Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: greatbeans_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Setup test database
        run: npm run db:test:setup
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/greatbeans_test

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration

      - name: Run API tests
        run: npm run test:api

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

### Test Data Management

```javascript
// tests/fixtures/test-data.js
export const testProducts = [
  {
    id: 'test_prod_001',
    sku: 'TEST-COL-001',
    coffeeType: 'arabica',
    origin: 'colombia',
    grade: 'high_grown',
    processing: 'washed',
    translations: {
      name: 'Test Colombian Coffee',
      description: 'Test description',
    },
    pricing: {
      basePrice: 4.5,
      currency: 'USD',
      unit: 'lb',
    },
    availability: {
      inStock: true,
      stockLevel: 'high',
    },
  },
];

export const testRFQs = [
  {
    id: 'test_rfq_001',
    rfqNumber: 'RFQ-TEST-001',
    status: 'submitted',
    companyInfo: {
      companyName: 'Test Coffee Importers',
      contactPerson: 'John Test',
      email: 'john@testcoffee.com',
    },
  },
];
```

---

## Troubleshooting

### Common Issues

#### 1. Authentication Failures

**Problem**: 401 Unauthorized responses

**Solutions**:

- Verify API key is correct and active
- Check token expiration
- Ensure proper Authorization header format
- Validate token permissions

#### 2. Rate Limiting

**Problem**: 429 Too Many Requests

**Solutions**:

- Implement exponential backoff
- Reduce request frequency
- Use different API keys for testing
- Check rate limit headers

#### 3. Timeout Issues

**Problem**: Request timeouts during testing

**Solutions**:

- Increase timeout values
- Optimize database queries
- Use connection pooling
- Implement request queuing

#### 4. Test Data Conflicts

**Problem**: Tests failing due to data conflicts

**Solutions**:

- Use isolated test databases
- Implement proper test cleanup
- Use unique test identifiers
- Reset database between test suites

### Debug Tools

#### API Response Logging

```javascript
// Debug middleware for testing
function debugMiddleware(req, res, next) {
  console.log(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
    headers: req.headers,
  });

  const originalSend = res.send;
  res.send = function (data) {
    console.log('Response:', data);
    originalSend.call(this, data);
  };

  next();
}
```

#### Test Environment Validation

```javascript
// Validate test environment
function validateTestEnvironment() {
  const required = ['TEST_API_KEY', 'TEST_DATABASE_URL', 'API_BASE_URL'];

  const missing = required.filter(env => !process.env[env]);

  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
}
```

---

## Test Reports

### Coverage Reports

```bash
# Generate coverage report
npm run test:coverage

# View coverage report
open coverage/lcov-report/index.html
```

### Performance Reports

```bash
# Run performance tests
npm run test:performance

# Generate performance report
artillery report performance-results.json
```

### Security Scan Reports

```bash
# Run security audit
npm audit

# Run OWASP ZAP scan
zap-baseline.py -t http://localhost:3000/api
```

---

_Last Updated: January 20, 2024_
_Version: 1.0.0_
