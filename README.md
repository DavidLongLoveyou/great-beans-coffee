# The Great Beans - Premium Vietnamese Coffee Export Platform

A world-class B2B Coffee Export Platform built with Next.js 15, TypeScript, and modern web technologies. This platform focuses on transparency, professionalism, and building trust with global coffee partners.

## 🌟 Features

- 🌐 **Multilingual Support**: English, Vietnamese, and 6 other languages
- ☕ **Premium Coffee Catalog**: Comprehensive product showcase with detailed specifications
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🎨 **Modern UI**: Built with Shadcn/UI and Tailwind CSS
- 🔍 **SEO Optimized**: Technical SEO with Schema.org structured data
- 📊 **Business Analytics**: Comprehensive tracking and insights
- 🌱 **Sustainability Focus**: Environmental and social responsibility
- 💼 **B2B Services**: OEM, Private Label, and Consulting services
- 📝 **Content Management**: MDX-powered blog, market reports, and origin stories
- 🔐 **Secure RFQ System**: Request for Quote with status tracking

## 🛠 Tech Stack

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI + Radix UI
- **Icons**: Lucide React
- **Content**: MDX + Contentlayer
- **Internationalization**: next-intl

### Backend & Database

- **Database**: PostgreSQL (Development: SQLite)
- **ORM**: Prisma
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Dependency Injection**: Custom DI Container

### Development & Quality

- **Testing**: Jest + React Testing Library (Unit), Playwright (E2E)
- **Linting**: ESLint + Prettier
- **Git Hooks**: Husky
- **Type Safety**: TypeScript strict mode

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/DavidLongLoveyou/great-beans-coffee.git
cd great-beans-coffee
```

2. **Install dependencies**

```bash
npm install
```

3. **Environment Setup**

```bash
cp .env.example .env
```

4. **Database Setup**

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npm run seed
```

5. **Start development server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   ├── blog/              # Blog pages
│   ├── market-reports/    # Market reports
│   └── origin-stories/    # Coffee origin stories
├── application/           # Application layer (Use Cases & Services)
│   ├── dtos/             # Data Transfer Objects
│   ├── services/         # Application services
│   └── use-cases/        # Business use cases
├── domain/               # Domain layer (Entities & Business Logic)
│   ├── entities/         # Domain entities
│   ├── repositories/     # Repository interfaces
│   └── value-objects/    # Value objects
├── infrastructure/       # Infrastructure layer
│   ├── database/         # Database repositories
│   ├── di/              # Dependency injection
│   └── external-services/ # External API integrations
├── presentation/         # Presentation layer
│   ├── components/       # React components
│   └── hooks/           # Custom React hooks
└── shared/              # Shared utilities
    ├── config/          # Configuration
    ├── types/           # TypeScript types
    └── utils/           # Utility functions
```

## 🎯 Development Phases

### ✅ Phase 0: Foundation (COMPLETED)

- [x] Database setup and seeding
- [x] Dependency injection container
- [x] Use cases and services implementation
- [x] Development environment setup

### 🔄 Phase 1: Content Management (IN PROGRESS)

- [ ] MDX content structure setup
- [ ] Blog posts about coffee industry insights
- [ ] Market reports with data visualization
- [ ] Origin stories content

### 📋 Phase 2: Technical SEO

- [ ] Schema.org JSON-LD implementation
- [ ] Core Web Vitals optimization
- [ ] Automated sitemap generation

### 💼 Phase 3: Business Services Enhancement

- [ ] OEM services with process flow
- [ ] Private Label customization options
- [ ] Consulting services booking system

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run tests with coverage
npm run test:coverage
```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Format code
npm run format
```

## 🌍 Internationalization

The platform supports multiple languages:

- English (en)
- Vietnamese (vi)
- German (de)
- Spanish (es)
- French (fr)
- Italian (it)
- Japanese (ja)
- Korean (ko)
- Dutch (nl)

## 📊 Database Schema

Key entities:

- **Users**: Customer accounts and authentication
- **CoffeeProducts**: Product catalog with specifications
- **RFQs**: Request for Quote system
- **Content**: Blog posts, market reports, origin stories

## 🔧 Configuration Files

- `next.config.ts` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `contentlayer.config.ts` - Content management configuration
- `prisma/schema.prisma` - Database schema
- `tsconfig.json` - TypeScript configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Vietnamese coffee farmers and exporters
- Open source community
- Next.js and React teams
- All contributors to this project

## 📞 Contact

For business inquiries or support:

- Website: [The Great Beans](https://great-beans-coffee.vercel.app)
- Email: contact@greatbeans.com
- GitHub: [@DavidLongLoveyou](https://github.com/DavidLongLoveyou)

---

**Built with ❤️ for the global coffee community**
