# Development Guide - The Great Beans

## 📋 Development History & Progress

### Phase 0: Foundation Setup (COMPLETED ✅)

**Date**: January 2025

### Phase 0.1: TypeScript Error Fixes (COMPLETED ✅)

**Date**: January 2025
**Focus**: Systematic TypeScript compilation error resolution across the codebase

#### Session 1: RFQ Repository Fixes (COMPLETED ✅)

**Issues Addressed**:

- ✅ **Field Mapping Corrections**: Fixed mismatched field names between Prisma schema and entity mappings
- ✅ **Entity Structure Alignment**: Updated RFQEntity constructor to match schema requirements
- ✅ **Prisma Query Optimization**: Simplified include clauses and removed non-existent relations
- ✅ **Filter System Cleanup**: Removed unsupported fields and complex JSON queries

#### Session 2: Multimedia Components Fixes (COMPLETED ✅)

**Issues Addressed**:

- ✅ **ImageGallery Component**: Fixed null/undefined checks for currentImage, added type assertions for categories
- ✅ **MediaCarousel Component**: Fixed useEffect return statements, navigator.share parameter handling

#### Session 3: Design System Components Fixes (COMPLETED ✅)

**Issues Addressed**:

- ✅ **Badge Component Types**: Added missing `'subtle'` variant to `BadgeVariant` type definition
- ✅ **TastingNotes Component**:
  - Added missing `'other'` category to `TastingNoteCategory` type
  - Added missing tasting note categories: `citrus`, `berry`, `tropical`, `caramel`, `vanilla`
  - Enhanced `TastingNotesProps` interface with `size`, `variant`, `maxDisplay`, `showCategories`, `onNoteClick`
- ✅ **Type Compatibility**: Fixed `onClick` prop type mismatches with wrapper functions
- ✅ **Component Integration**: Ensured all design system components work seamlessly together

#### Session 4: YAML Content & Build Configuration Fixes (COMPLETED ✅)

**Issues Addressed**:

- ✅ **YAML Content Cleanup**:
  - Fixed empty strings in `keywords` arrays across 35 `.mdx` files
  - Removed carriage return characters (`\r`) causing parsing errors
  - Fixed array syntax and multi-line formatting
  - Corrected boolean, number, and string value formatting
- ✅ **Build Configuration**:
  - Resolved Babel configuration conflicts
  - Renamed `babel.config.js` to `babel.config.test.js` for test-only usage
  - Verified Jest configuration uses correct `next/babel` preset
- ✅ **Content Layer Integration**:
  - Fixed `contentlayer2 build` errors
  - Successfully generates 39 documents
  - All content types properly processed
- ✅ **Automation Scripts**:
  - Created `scripts/fix-empty-strings.js` for YAML array cleanup
  - Created `scripts/fix-yaml-comprehensive.js` for comprehensive YAML fixes

#### Current Status

- ✅ **Complete TypeScript Error Resolution**: All compilation errors fixed across the entire codebase
- ✅ **RFQ Repository**: Completely fixed and functional
- ✅ **Multimedia Components**: All type issues resolved
- ✅ **Design System**: All component types properly defined and compatible
- ✅ **YAML Content**: All content files properly formatted and error-free
- ✅ **Build Configuration**: Optimized for production and testing environments
- ✅ **Content Layer**: Successfully processing all content types
- 🔄 **ESLint Issues**: Minor issues identified (native binding, unused imports, unescaped entities)
- 📝 **Comprehensive Documentation**: All fixes documented and tracked

#### Next Steps

- 🎯 **UI/UX Implementation**: Begin visual design and styling implementation
- 🎯 **Component Styling**: Apply Tailwind CSS styling to all components
- 🎯 **User Experience**: Implement responsive design and interactions
- 🎯 **Performance Optimization**: Optimize component rendering and loading

#### Database & Infrastructure

- ✅ **Prisma Setup**: Configured PostgreSQL schema with SQLite for development
- ✅ **Database Seeding**: Created comprehensive seed data including:
  - Sample users (admin, customers)
  - Coffee products (Arabica, Robusta varieties)
  - Content (blog posts, market reports, origin stories)
  - RFQ samples with different statuses
- ✅ **Dependency Injection**: Implemented clean architecture with DI container
- ✅ **Use Cases Implementation**: Created all RFQ management use cases:
  - `GetRfqByIdUseCase`
  - `GetRfqsUseCase`
  - `SubmitRfqUseCase`
  - `UpdateRfqStatusUseCase`

#### Application Services

- ✅ **Email Service**: Email sending functionality for RFQ notifications
- ✅ **Notification Service**: Comprehensive notification system
- ✅ **File Upload Service**: Cloud storage integration (simulated)
- ✅ **Cache Service**: In-memory caching with TTL support
- ✅ **Search Service**: Coffee product search with filters
- ✅ **Translation Service**: Multi-language support infrastructure
- ✅ **Analytics Service**: Event tracking and metrics
- ✅ **SEO Service**: Metadata and structured data generation

#### Technical Fixes

- ✅ **Import Resolution**: Fixed all module import errors
- ✅ **Interface Consistency**: Standardized naming conventions
- ✅ **Development Server**: Successfully running at `http://localhost:3000`

### Phase 1: Content Management (PENDING ⏳)

**Target**: Q1 2025

#### Blog System

- [ ] MDX content structure setup
- [ ] Sample blog posts about coffee industry insights
- [ ] Blog listing and detail pages
- [ ] SEO optimization for blog content

#### Market Reports

- [ ] Market report content with data visualization
- [ ] Interactive charts and graphs
- [ ] Export functionality (PDF/Excel)
- [ ] Subscription system for premium reports

#### Origin Stories

- [ ] Coffee farm showcase content
- [ ] Interactive maps and timelines
- [ ] Farmer profiles and testimonials
- [ ] Sustainability metrics display

### Phase 2: Technical SEO (PENDING ⏳)

**Target**: Q1 2025

#### Structured Data

- [ ] Schema.org JSON-LD for Organization
- [ ] Product schema implementation
- [ ] Service schema for B2B offerings
- [ ] Review and rating schema

#### Performance Optimization

- [ ] Core Web Vitals optimization
- [ ] Image optimization with Cloudinary
- [ ] Lazy loading implementation
- [ ] Performance monitoring setup

#### SEO Infrastructure

- [ ] Automated sitemap generation
- [ ] Meta tag optimization
- [ ] Open Graph and Twitter Card setup
- [ ] Canonical URL management

### Phase 3: Business Services Enhancement (PENDING ⏳)

**Target**: Q1 2025

#### OEM Services

- [ ] Detailed process flow visualization
- [ ] Case studies and success stories
- [ ] Custom packaging options
- [ ] Quality certification display

#### Private Label Services

- [ ] Customization options interface
- [ ] Portfolio showcase
- [ ] Brand development tools
- [ ] Sample request system

#### Consulting Services

- [ ] Expertise areas breakdown
- [ ] Consultation booking system
- [ ] Calendar integration
- [ ] Video call setup

## 🛠 Development Environment Setup

### Prerequisites

```bash
# Node.js version
node --version  # Should be 18+

# Package manager
npm --version   # or yarn --version
```

### Quick Start

```bash
# Clone and setup
git clone https://github.com/DavidLongLoveyou/great-beans-coffee.git
cd great-beans-coffee
npm install

# Environment setup
cp .env.example .env

# Database setup
npx prisma generate
npx prisma migrate dev
npm run seed

# Start development
npm run dev
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Prisma Studio
npm run seed         # Seed database with sample data

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # TypeScript type checking

# Testing
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:e2e     # Run E2E tests
npm run test:coverage # Run tests with coverage
```

## 🏗 Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│           Presentation              │
│     (React Components, Pages)       │
├─────────────────────────────────────┤
│           Application               │
│      (Use Cases, Services)          │
├─────────────────────────────────────┤
│             Domain                  │
│   (Entities, Value Objects)         │
├─────────────────────────────────────┤
│          Infrastructure             │
│  (Database, External Services)      │
└─────────────────────────────────────┘
```

### Key Design Patterns

- **Repository Pattern**: Data access abstraction
- **Factory Pattern**: Object creation
- **Observer Pattern**: Event handling
- **Strategy Pattern**: Algorithm selection
- **Decorator Pattern**: Feature enhancement

### Dependency Injection

All dependencies are managed through the DI container located at:
`src/infrastructure/di/container.ts`

## 🔧 Configuration Files

### Core Configuration

- `next.config.ts` - Next.js configuration with i18n
- `tailwind.config.js` - Tailwind CSS customization
- `tsconfig.json` - TypeScript compiler options
- `contentlayer.config.ts` - Content management setup

### Development Tools

- `.eslintrc.json` - ESLint rules and plugins
- `.prettierrc` - Code formatting rules
- `.husky/pre-commit` - Git hooks for code quality
- `components.json` - Shadcn/UI configuration

### Environment Variables

```bash
# Database
DATABASE_URL="file:./dev.db"

# Next.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# External Services (Optional)
CLOUDINARY_CLOUD_NAME=""
CLOUDINARY_API_KEY=""
CLOUDINARY_API_SECRET=""

# Email Service (Optional)
SMTP_HOST=""
SMTP_PORT=""
SMTP_USER=""
SMTP_PASS=""
```

## 🧪 Testing Strategy

### Unit Tests

- **Framework**: Jest + React Testing Library
- **Coverage**: Aim for 80%+ coverage
- **Location**: `__tests__` folders alongside components

### E2E Tests

- **Framework**: Playwright
- **Scenarios**: Critical user journeys
- **Location**: `tests/e2e/`

### Testing Commands

```bash
# Run all tests
npm run test

# Watch mode for development
npm run test:watch

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

## 📊 Database Schema

### Key Entities

#### Users

```sql
- id: String (UUID)
- email: String (unique)
- name: String
- role: UserRole (ADMIN, CUSTOMER)
- company: String?
- createdAt: DateTime
- updatedAt: DateTime
```

#### CoffeeProducts

```sql
- id: String (UUID)
- name: String
- description: String
- origin: String
- variety: String (ARABICA, ROBUSTA)
- processingMethod: String
- price: Decimal
- availability: Boolean
- createdAt: DateTime
- updatedAt: DateTime
```

#### RFQs (Request for Quote)

```sql
- id: String (UUID)
- userId: String (FK)
- productId: String (FK)
- quantity: Int
- targetPrice: Decimal?
- deliveryDate: DateTime
- status: RFQStatus
- notes: String?
- createdAt: DateTime
- updatedAt: DateTime
```

## 🚀 Deployment Guide

### Vercel Deployment (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Environment Setup for Production

1. Set up PostgreSQL database
2. Configure environment variables
3. Run database migrations
4. Deploy application

## 🔍 Troubleshooting

### Common Issues

#### Database Connection

```bash
# Reset database
npx prisma migrate reset
npx prisma generate
npm run seed
```

#### Module Resolution

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

#### Type Errors

```bash
# Regenerate types
npx prisma generate
npm run type-check
```

## 📝 Development Notes

### Code Style Guidelines

- Use TypeScript strict mode
- Follow ESLint and Prettier rules
- Implement proper error handling
- Write comprehensive tests
- Document complex business logic

### Git Workflow

1. Create feature branch from `main`
2. Implement changes with tests
3. Run quality checks (`npm run lint`, `npm run test`)
4. Create pull request
5. Code review and merge

### Performance Considerations

- Implement proper caching strategies
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper loading states
- Monitor Core Web Vitals

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Clone your fork
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Pull Request Guidelines

- Clear description of changes
- Include tests for new features
- Update documentation if needed
- Follow existing code style
- Ensure all checks pass

#### Session 5: ProductFilters Implementation (COMPLETED ✅)

**Date**: January 2025
**Focus**: Comprehensive product filtering system for B2B coffee catalog

**Technical Achievements**:

- ✅ **Advanced Filtering System**:
  - Multi-criteria filtering with search, coffee type, grade, processing method, certification, price range, and stock status
  - Debounced search functionality for optimal performance
  - Real-time filtering with useEffect and useState integration
  - Price range slider with min/max controls

- ✅ **Component Architecture**:
  - `ProductFilters.tsx`: Comprehensive filtering interface using shadcn/ui components
  - Integration with `ProductGrid.tsx` for dynamic product display
  - State management between parent and child components
  - Professional UI design with forest theme consistency

- ✅ **Internationalization (i18n)**:
  - Added filter translations to all 9 language files (en, de, ja, fr, it, es, nl, ko, vi)
  - Multi-language support for filter labels and options
  - Proper translation key structure for maintainability

- ✅ **Performance Optimizations**:
  - Debounced search to prevent excessive API calls
  - Optimized re-renders with proper dependency arrays
  - Efficient filtering algorithms for large product catalogs
  - Lazy loading and code splitting considerations

- ✅ **Bug Fixes & Infrastructure**:
  - Fixed missing placeholder image by creating SVG coffee placeholder
  - Resolved blur placeholder errors in OptimizedImage component
  - Fixed Cloudinary service blur data URL generation
  - Eliminated 404 errors and image loading issues

**Files Modified**:
- `src/presentation/components/catalog/ProductFilters.tsx` - New comprehensive component
- `src/app/[locale]/products/page.tsx` - Integrated filtering logic
- `messages/*.json` - Added filter translations for all languages
- `src/infrastructure/external-services/cloudinary.service.ts` - Fixed blur placeholder
- `src/shared/components/performance/OptimizedImage.tsx` - Fixed placeholder logic
- `public/images/coffee-placeholder.svg` - Created placeholder image

**Technical Highlights**:
- **Type Safety**: Full TypeScript implementation with proper interfaces
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Code Quality**: ESLint and Prettier compliant
- **Testing Ready**: Component structure prepared for unit and integration tests

---

**Last Updated**: January 2025 - ProductFilters Implementation Completed
**Next Review**: Q1 2025
**Current Status**: Ready for RFQ Management UI implementation

For questions or support, contact the development team or create an issue on GitHub.
