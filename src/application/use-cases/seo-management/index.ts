// SEO Management Use Cases
// TODO: Implement SEO management use cases

// Temporary interfaces for SEO management
export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
}

export interface SEOAnalysis {
  score: number;
  recommendations: string[];
  issues: string[];
}

// Placeholder use cases - to be implemented
export class GetSEOMetadataUseCase {
  async execute(url: string): Promise<SEOMetadata> {
    throw new Error('Not implemented');
  }
}

export class UpdateSEOMetadataUseCase {
  async execute(url: string, metadata: SEOMetadata): Promise<void> {
    throw new Error('Not implemented');
  }
}

export class AnalyzeSEOPerformanceUseCase {
  async execute(url: string): Promise<SEOAnalysis> {
    throw new Error('Not implemented');
  }
}