import { siteConfig } from '@/shared/config/site';

/**
 * Sitemap submission and monitoring utilities
 * Handles automatic submission to search engines and health checks
 */

export interface SitemapSubmissionResult {
  success: boolean;
  searchEngine: string;
  statusCode?: number;
  message?: string;
  submittedAt: Date;
}

export interface SitemapHealthCheck {
  url: string;
  accessible: boolean;
  statusCode: number;
  responseTime: number;
  lastChecked: Date;
  errorMessage?: string;
}

export class SitemapSubmissionService {
  private readonly baseUrl: string;
  private readonly sitemapUrls: string[];

  constructor() {
    this.baseUrl = siteConfig.url;
    this.sitemapUrls = [
      `${this.baseUrl}/sitemap.xml`,
      `${this.baseUrl}/sitemap-blog.xml`,
      `${this.baseUrl}/sitemap-index.xml`,
    ];
  }

  /**
   * Submit sitemap to Google Search Console
   */
  async submitToGoogle(sitemapUrl: string): Promise<SitemapSubmissionResult> {
    try {
      const googleSubmissionUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      const response = await fetch(googleSubmissionUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'The Great Beans Coffee Sitemap Submitter',
        },
      });

      return {
        success: response.ok,
        searchEngine: 'Google',
        statusCode: response.status,
        message: response.ok ? 'Sitemap submitted successfully' : 'Submission failed',
        submittedAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        searchEngine: 'Google',
        message: error instanceof Error ? error.message : 'Unknown error',
        submittedAt: new Date(),
      };
    }
  }

  /**
   * Submit sitemap to Bing Webmaster Tools
   */
  async submitToBing(sitemapUrl: string): Promise<SitemapSubmissionResult> {
    try {
      const bingSubmissionUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
      
      const response = await fetch(bingSubmissionUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'The Great Beans Coffee Sitemap Submitter',
        },
      });

      return {
        success: response.ok,
        searchEngine: 'Bing',
        statusCode: response.status,
        message: response.ok ? 'Sitemap submitted successfully' : 'Submission failed',
        submittedAt: new Date(),
      };
    } catch (error) {
      return {
        success: false,
        searchEngine: 'Bing',
        message: error instanceof Error ? error.message : 'Unknown error',
        submittedAt: new Date(),
      };
    }
  }

  /**
   * Submit all sitemaps to all search engines
   */
  async submitAllSitemaps(): Promise<SitemapSubmissionResult[]> {
    const results: SitemapSubmissionResult[] = [];

    for (const sitemapUrl of this.sitemapUrls) {
      // Submit to Google
      const googleResult = await this.submitToGoogle(sitemapUrl);
      results.push(googleResult);

      // Submit to Bing
      const bingResult = await this.submitToBing(sitemapUrl);
      results.push(bingResult);

      // Add delay between submissions to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  /**
   * Check sitemap health and accessibility
   */
  async checkSitemapHealth(sitemapUrl: string): Promise<SitemapHealthCheck> {
    const startTime = Date.now();
    
    try {
      const response = await fetch(sitemapUrl, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'The Great Beans Coffee Sitemap Health Checker',
        },
      });

      const responseTime = Date.now() - startTime;

      return {
        url: sitemapUrl,
        accessible: response.ok,
        statusCode: response.status,
        responseTime,
        lastChecked: new Date(),
        errorMessage: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      return {
        url: sitemapUrl,
        accessible: false,
        statusCode: 0,
        responseTime,
        lastChecked: new Date(),
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Check health of all sitemaps
   */
  async checkAllSitemapsHealth(): Promise<SitemapHealthCheck[]> {
    const healthChecks = await Promise.all(
      this.sitemapUrls.map(url => this.checkSitemapHealth(url))
    );

    return healthChecks;
  }

  /**
   * Generate sitemap submission report
   */
  generateSubmissionReport(results: SitemapSubmissionResult[]): string {
    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;
    
    let report = `Sitemap Submission Report\n`;
    report += `========================\n`;
    report += `Success Rate: ${successCount}/${totalCount} (${Math.round((successCount / totalCount) * 100)}%)\n\n`;

    results.forEach(result => {
      report += `${result.searchEngine}: ${result.success ? '✅ SUCCESS' : '❌ FAILED'}\n`;
      if (result.statusCode) {
        report += `  Status Code: ${result.statusCode}\n`;
      }
      if (result.message) {
        report += `  Message: ${result.message}\n`;
      }
      report += `  Submitted At: ${result.submittedAt.toISOString()}\n\n`;
    });

    return report;
  }

  /**
   * Generate health check report
   */
  generateHealthReport(healthChecks: SitemapHealthCheck[]): string {
    const accessibleCount = healthChecks.filter(h => h.accessible).length;
    const totalCount = healthChecks.length;
    
    let report = `Sitemap Health Report\n`;
    report += `====================\n`;
    report += `Accessibility: ${accessibleCount}/${totalCount} (${Math.round((accessibleCount / totalCount) * 100)}%)\n\n`;

    healthChecks.forEach(check => {
      report += `${check.url}: ${check.accessible ? '✅ ACCESSIBLE' : '❌ INACCESSIBLE'}\n`;
      report += `  Status Code: ${check.statusCode}\n`;
      report += `  Response Time: ${check.responseTime}ms\n`;
      if (check.errorMessage) {
        report += `  Error: ${check.errorMessage}\n`;
      }
      report += `  Last Checked: ${check.lastChecked.toISOString()}\n\n`;
    });

    return report;
  }
}

// Export singleton instance
export const sitemapSubmissionService = new SitemapSubmissionService();

/**
 * Utility function for automated sitemap submission
 * Can be called from API routes or scheduled tasks
 */
export async function submitSitemapsToSearchEngines(): Promise<{
  submissions: SitemapSubmissionResult[];
  healthChecks: SitemapHealthCheck[];
}> {
  const submissions = await sitemapSubmissionService.submitAllSitemaps();
  const healthChecks = await sitemapSubmissionService.checkAllSitemapsHealth();

  // Log results for monitoring
  console.log('Sitemap Submission Results:', submissions);
  console.log('Sitemap Health Checks:', healthChecks);

  return {
    submissions,
    healthChecks,
  };
}