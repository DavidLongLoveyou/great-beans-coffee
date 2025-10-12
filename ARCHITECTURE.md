# The Great Beans - Domain-Driven Design Architecture

## 🏗️ Architecture Overview

This project follows **Domain-Driven Design (DDD)** principles with **Clean Architecture** patterns, specifically designed for a B2B coffee export platform.

## 📁 Folder Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── [locale]/          # Internationalized routes
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
│
├── domain/                # 🎯 CORE BUSINESS LOGIC
│   ├── entities/          # Business entities with identity
│   ├── value-objects/     # Immutable domain primitives
│   ├── services/          # Domain business logic
│   ├── repositories/      # Data access contracts
│   └── events/            # Domain events
│
├── application/           # 🔄 USE CASES & ORCHESTRATION
│   ├── use-cases/         # Business use cases
│   ├── dtos/              # Data transfer objects
│   └── services/          # Application services
│
├── infrastructure/        # 🔌 EXTERNAL CONCERNS
│   ├── database/          # Prisma & database implementations
│   ├── external-services/ # Third-party integrations
│   └── config/            # Environment configurations
│
├── presentation/          # 🎨 UI & USER INTERACTION
│   ├── components/        # React components
│   └── hooks/             # Custom React hooks
│
├── shared/                # 🔧 CROSS-CUTTING CONCERNS
│   ├── utils/             # Helper functions
│   └── types/             # Common type definitions
│
├── lib/                   # 📚 LIBRARY CONFIGURATIONS
│   ├── prisma.ts          # Database client
│   ├── contentlayer.ts    # Content management
│   └── next-intl.ts       # Internationalization
│
└── styles/                # 🎨 STYLING
    ├── globals.css        # Global styles
    └── components.css     # Component styles
```

## 🎯 Domain Layer (Core Business Logic)

### Entities

- `CoffeeProduct` - Core coffee product with specifications
- `BusinessService` - Services offered (OEM, Private Label, etc.)
- `RFQ` - Request for Quote with business rules
- `ClientCompany` - B2B client information
- `Content` - Multilingual content management

### Value Objects

- `CoffeeGrade` - Quality grades and standards
- `ProcessingMethod` - Coffee processing techniques
- `Certification` - Quality certifications
- `Price` - Pricing with currency and terms
- `Quantity` - Measurements and units

### Domain Services

- `PricingService` - Complex pricing calculations
- `QualityAssessmentService` - Coffee quality evaluation
- `ShippingCalculatorService` - Logistics calculations
- `RFQMatchingService` - Match RFQs with products

## 🔄 Application Layer (Use Cases)

### Use Cases

- **Coffee Products**: Get, search, filter products
- **RFQ Management**: Submit, process, respond to RFQs
- **Content Management**: Multilingual content operations
- **SEO Management**: Automated SEO optimization

### Application Services

- `EmailService` - Email notifications
- `TranslationService` - Content localization
- `AnalyticsService` - Business intelligence
- `SEOService` - Search engine optimization

## 🔌 Infrastructure Layer (External Concerns)

### Database

- **Prisma ORM** with PostgreSQL
- Repository pattern implementations
- Database migrations and seeders

### External Services

- **Cloudinary** - Image optimization
- **SendGrid** - Email delivery
- **Google Analytics** - Web analytics
- **Vercel Analytics** - Performance monitoring

## 🎨 Presentation Layer (UI)

### Components Structure

```
components/
├── ui/           # Reusable UI primitives (shadcn/ui)
├── features/     # Feature-specific components
├── layout/       # Layout components
├── forms/        # Form components
└── seo/          # SEO components
```

### Custom Hooks

- `useCoffeeProducts` - Product data management
- `useRFQForm` - RFQ form logic
- `useLocalization` - Internationalization
- `useSEO` - SEO optimization

## 🌐 Internationalization

- **8 Languages**: EN, DE, JA, FR, IT, ES, NL, KO
- **Market-Specific**: Currency, timezone, ports
- **SEO Optimized**: hreflang, localized URLs
- **Content Localization**: Products, services, metadata

## 🔍 SEO Strategy

### Technical SEO

- **Schema.org** JSON-LD for B2B
- **hreflang** for international targeting
- **Core Web Vitals** optimization
- **Structured Data** for coffee products

### Content SEO

- **Content Clusters** for coffee types
- **Market-Specific** landing pages
- **Automated Sitemaps** for all locales
- **Rich Snippets** for products/services

## 🧪 Testing Strategy

### Unit Tests

- Domain entities and value objects
- Use cases and domain services
- Utility functions

### Integration Tests

- API endpoints
- Database operations
- External service integrations

### E2E Tests

- Critical user journeys
- RFQ submission flow
- Multilingual navigation

## 🚀 Development Workflow

1. **Domain First**: Start with business logic
2. **Use Cases**: Define application operations
3. **Infrastructure**: Implement external concerns
4. **Presentation**: Build UI components
5. **Testing**: Comprehensive test coverage

## 📊 Performance Optimizations

- **Image Optimization** via Cloudinary
- **Code Splitting** by route and feature
- **Caching Strategy** for static content
- **Database Indexing** for search operations
- **CDN Distribution** for global performance

## 🔒 Security Considerations

- **Input Validation** with Zod schemas
- **SQL Injection** prevention via Prisma
- **XSS Protection** with proper sanitization
- **CSRF Protection** for forms
- **Rate Limiting** for API endpoints

## 🔧 Recent Architectural Improvements (January 2025)

### TypeScript Compliance & Type Safety

**Product Specification Architecture Enhancement**:

- **Helper Function Pattern**: Implemented reusable utility functions for data extraction
  - `getSpecificationValue()` - Safe extraction of specification values from arrays
  - `getSpecificationValueWithUnit()` - Formatted value extraction with units
  - Enhanced null safety and error handling patterns

- **API Interface Alignment**: 
  - Corrected frontend-backend data structure mapping
  - Fixed `specifications` vs `specificationItems` field alignment
  - Proper handling of array-based specification data
  - Consistent property naming (`type` → `coffeeType`)

- **Type System Improvements**:
  - Enhanced `CoffeeCertification` type handling with proper validation
  - Improved array type casting with safe fallbacks
  - Strengthened TypeScript strict mode compliance
  - Better error prevention through enhanced type checking

### Code Quality & Maintainability

**Component Architecture Enhancements**:

- **Reusable Utility Pattern**: Created specification extraction utilities that can be reused across product components
- **Error Handling**: Implemented robust null/undefined value handling throughout product pages
- **Type Safety**: Achieved better alignment between frontend components and backend API structure
- **Maintainability**: Improved code organization with clear separation of data access logic

### Performance & Developer Experience

**Development Workflow Improvements**:

- **Reduced Compilation Errors**: Substantial reduction in TypeScript errors (185+ → manageable levels)
- **Enhanced Developer Experience**: Cleaner compilation with better error messages
- **Code Consistency**: Standardized patterns for specification data handling
- **Future-Proof Structure**: Architecture that supports easy extension and modification

These improvements strengthen the foundation for Phase 1 development while maintaining the core DDD principles and clean architecture patterns.

---

This architecture ensures scalability, maintainability, and testability while providing excellent performance for global B2B coffee export operations.
