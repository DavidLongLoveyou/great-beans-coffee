export interface SEOMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  structuredData?: Record<string, any>;
}

export interface ISEOService {
  generateMetadata(page: string, data?: Record<string, any>): Promise<SEOMetadata>;
  generateStructuredData(type: string, data: Record<string, any>): Promise<Record<string, any>>;
  generateSitemap(): Promise<string[]>;
  validateMetadata(metadata: SEOMetadata): Promise<boolean>;
}

export class SEOService implements ISEOService {
  private baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://greatbeans.com';

  async generateMetadata(page: string, data: Record<string, any> = {}): Promise<SEOMetadata> {
    try {
      console.log(`Generating SEO metadata for page: ${page}`);
      
      const metadata: SEOMetadata = {
        title: this.generateTitle(page, data),
        description: this.generateDescription(page, data),
        keywords: this.generateKeywords(page, data),
        canonical: `${this.baseUrl}${page}`,
        ogTitle: this.generateTitle(page, data),
        ogDescription: this.generateDescription(page, data),
        ogImage: this.generateOGImage(page, data),
        ogType: 'website',
        twitterCard: 'summary_large_image',
        twitterTitle: this.generateTitle(page, data),
        twitterDescription: this.generateDescription(page, data),
        twitterImage: this.generateOGImage(page, data)
      };
      
      // Add structured data if applicable
      if (data.product) {
        metadata.structuredData = await this.generateStructuredData('Product', data.product);
      } else if (data.service) {
        metadata.structuredData = await this.generateStructuredData('Service', data.service);
      } else if (data.organization) {
        metadata.structuredData = await this.generateStructuredData('Organization', data.organization);
      }
      
      return metadata;
    } catch (error) {
      console.error('Failed to generate SEO metadata:', error);
      return this.getDefaultMetadata();
    }
  }

  async generateStructuredData(type: string, data: Record<string, any>): Promise<Record<string, any>> {
    try {
      console.log(`Generating structured data for type: ${type}`);
      
      const baseStructure = {
        '@context': 'https://schema.org',
        '@type': type
      };
      
      switch (type) {
        case 'Product':
          return {
            ...baseStructure,
            name: data.name,
            description: data.description,
            image: data.image,
            brand: {
              '@type': 'Brand',
              name: 'The Great Beans'
            },
            offers: {
              '@type': 'Offer',
              price: data.price,
              priceCurrency: data.currency || 'USD',
              availability: 'https://schema.org/InStock'
            },
            category: data.category,
            origin: data.origin
          };
          
        case 'Service':
          return {
            ...baseStructure,
            name: data.name,
            description: data.description,
            provider: {
              '@type': 'Organization',
              name: 'The Great Beans'
            },
            serviceType: data.serviceType,
            areaServed: 'Worldwide'
          };
          
        case 'Organization':
          return {
            ...baseStructure,
            name: 'The Great Beans',
            description: 'Premium Vietnamese Coffee Exporter',
            url: this.baseUrl,
            logo: `${this.baseUrl}/logo.png`,
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+84-xxx-xxx-xxx',
              contactType: 'Customer Service',
              email: 'info@greatbeans.com'
            },
            address: {
              '@type': 'PostalAddress',
              addressCountry: 'VN',
              addressRegion: 'Ho Chi Minh City'
            },
            sameAs: [
              'https://linkedin.com/company/greatbeans',
              'https://facebook.com/greatbeans'
            ]
          };
          
        default:
          return baseStructure;
      }
    } catch (error) {
      console.error('Failed to generate structured data:', error);
      return {};
    }
  }

  async generateSitemap(): Promise<string[]> {
    try {
      console.log('Generating sitemap URLs');
      
      const urls = [
        '/',
        '/products',
        '/services',
        '/about',
        '/contact',
        '/blog',
        '/certifications'
      ];
      
      // Add dynamic product URLs (in a real implementation, fetch from database)
      const productSlugs = ['robusta-premium', 'arabica-specialty', 'instant-coffee'];
      productSlugs.forEach(slug => {
        urls.push(`/products/${slug}`);
      });
      
      // Add service URLs
      const serviceSlugs = ['oem-manufacturing', 'private-label', 'sourcing-consulting'];
      serviceSlugs.forEach(slug => {
        urls.push(`/services/${slug}`);
      });
      
      return urls.map(url => `${this.baseUrl}${url}`);
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
      return [];
    }
  }

  async validateMetadata(metadata: SEOMetadata): Promise<boolean> {
    try {
      const issues: string[] = [];
      
      // Title validation
      if (!metadata.title) {
        issues.push('Title is required');
      } else if (metadata.title.length > 60) {
        issues.push('Title is too long (max 60 characters)');
      }
      
      // Description validation
      if (!metadata.description) {
        issues.push('Description is required');
      } else if (metadata.description.length > 160) {
        issues.push('Description is too long (max 160 characters)');
      }
      
      // Keywords validation
      if (metadata.keywords && metadata.keywords.length > 10) {
        issues.push('Too many keywords (max 10)');
      }
      
      if (issues.length > 0) {
        console.warn('SEO metadata validation issues:', issues);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to validate metadata:', error);
      return false;
    }
  }

  private generateTitle(page: string, data: Record<string, any>): string {
    const baseTitle = 'The Great Beans';
    
    switch (page) {
      case '/':
        return `Premium Vietnamese Coffee Export | ${baseTitle}`;
      case '/products':
        return `Coffee Products | ${baseTitle}`;
      case '/services':
        return `Export Services | ${baseTitle}`;
      case '/about':
        return `About Us | ${baseTitle}`;
      case '/contact':
        return `Contact | ${baseTitle}`;
      default:
        if (data.title) {
          return `${data.title} | ${baseTitle}`;
        }
        return baseTitle;
    }
  }

  private generateDescription(page: string, data: Record<string, any>): string {
    switch (page) {
      case '/':
        return 'Leading Vietnamese coffee exporter offering premium Robusta and Arabica beans. Direct sourcing, competitive pricing, and reliable logistics for global markets.';
      case '/products':
        return 'Explore our range of premium Vietnamese coffee products. High-quality Robusta, specialty Arabica, and custom blends for international markets.';
      case '/services':
        return 'Comprehensive coffee export services including OEM manufacturing, private label solutions, and expert sourcing from Vietnam\'s finest coffee regions.';
      default:
        return data.description || 'Premium Vietnamese coffee export services and products for global markets.';
    }
  }

  private generateKeywords(page: string, data: Record<string, any>): string[] {
    const baseKeywords = ['vietnamese coffee', 'coffee export', 'robusta', 'arabica', 'coffee beans'];
    
    switch (page) {
      case '/':
        return [...baseKeywords, 'premium coffee', 'coffee supplier', 'vietnam coffee'];
      case '/products':
        return [...baseKeywords, 'coffee products', 'green beans', 'instant coffee'];
      case '/services':
        return [...baseKeywords, 'oem manufacturing', 'private label', 'coffee sourcing'];
      default:
        return data.keywords || baseKeywords;
    }
  }

  private generateOGImage(page: string, data: Record<string, any>): string {
    if (data.image) {
      return data.image;
    }
    return `${this.baseUrl}/og-image.jpg`;
  }

  private getDefaultMetadata(): SEOMetadata {
    return {
      title: 'The Great Beans - Premium Vietnamese Coffee Export',
      description: 'Leading Vietnamese coffee exporter offering premium Robusta and Arabica beans for global markets.',
      keywords: ['vietnamese coffee', 'coffee export', 'robusta', 'arabica'],
      canonical: this.baseUrl,
      ogTitle: 'The Great Beans - Premium Vietnamese Coffee Export',
      ogDescription: 'Leading Vietnamese coffee exporter offering premium Robusta and Arabica beans for global markets.',
      ogImage: `${this.baseUrl}/og-image.jpg`,
      ogType: 'website',
      twitterCard: 'summary_large_image'
    };
  }
}