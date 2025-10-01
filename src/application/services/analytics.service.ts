export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: Date;
}

export interface IAnalyticsService {
  track(event: AnalyticsEvent): Promise<boolean>;
  identify(userId: string, traits?: Record<string, any>): Promise<boolean>;
  page(pageName: string, properties?: Record<string, any>): Promise<boolean>;
  getMetrics(startDate: Date, endDate: Date): Promise<Record<string, any>>;
}

export class AnalyticsService implements IAnalyticsService {
  private events: AnalyticsEvent[] = [];

  async track(event: AnalyticsEvent): Promise<boolean> {
    try {
      const eventWithTimestamp = {
        ...event,
        timestamp: event.timestamp || new Date(),
      };

      this.events.push(eventWithTimestamp);

      // In a real implementation, this would send to Google Analytics, Mixpanel, etc.
      await new Promise(resolve => setTimeout(resolve, 50));

      return true;
    } catch (error) {
      // Silent error handling - in production, this would be logged to a proper logging service
      return false;
    }
  }

  async identify(
    userId: string,
    _traits: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      // In a real implementation, this would identify the user in analytics platform
      await new Promise(resolve => setTimeout(resolve, 50));

      return true;
    } catch (error) {
      // Silent error handling - in production, this would be logged to a proper logging service
      return false;
    }
  }

  async page(
    pageName: string,
    properties: Record<string, any> = {}
  ): Promise<boolean> {
    try {
      const pageEvent: AnalyticsEvent = {
        event: 'page_view',
        properties: {
          page: pageName,
          ...properties,
        },
      };

      return await this.track(pageEvent);
    } catch (error) {
      // Silent error handling - in production, this would be logged to a proper logging service
      return false;
    }
  }

  async getMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<Record<string, any>> {
    try {
      // Filter events by date range
      const filteredEvents = this.events.filter(event => {
        const eventDate = event.timestamp || new Date();
        return eventDate >= startDate && eventDate <= endDate;
      });

      // Calculate basic metrics
      const metrics = {
        totalEvents: filteredEvents.length,
        uniqueEvents: new Set(filteredEvents.map(e => e.event)).size,
        pageViews: filteredEvents.filter(e => e.event === 'page_view').length,
        rfqSubmissions: filteredEvents.filter(e => e.event === 'rfq_submitted')
          .length,
        productViews: filteredEvents.filter(e => e.event === 'product_viewed')
          .length,
        eventsByType: filteredEvents.reduce(
          (acc, event) => {
            acc[event.event] = (acc[event.event] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        ),
      };

      return metrics;
    } catch (error) {
      // Silent error handling - in production, this would be logged to a proper logging service
      return {};
    }
  }

  // Additional helper methods for common analytics operations
  async trackRFQSubmission(
    rfqId: string,
    properties?: Record<string, any>
  ): Promise<boolean> {
    return this.track({
      event: 'rfq_submitted',
      properties: {
        rfqId,
        ...properties,
      },
    });
  }

  async trackProductView(
    productId: string,
    properties?: Record<string, any>
  ): Promise<boolean> {
    return this.track({
      event: 'product_viewed',
      properties: {
        productId,
        ...properties,
      },
    });
  }

  async trackServiceView(
    serviceId: string,
    properties?: Record<string, any>
  ): Promise<boolean> {
    return this.track({
      event: 'service_viewed',
      properties: {
        serviceId,
        ...properties,
      },
    });
  }

  async trackDownload(
    fileName: string,
    properties?: Record<string, any>
  ): Promise<boolean> {
    return this.track({
      event: 'file_downloaded',
      properties: {
        fileName,
        ...properties,
      },
    });
  }

  async trackSearch(
    query: string,
    results: number,
    properties?: Record<string, any>
  ): Promise<boolean> {
    return this.track({
      event: 'search_performed',
      properties: {
        query,
        results,
        ...properties,
      },
    });
  }

  // Get events for debugging (development only)
  getEvents(): AnalyticsEvent[] {
    return [...this.events];
  }

  // Clear events (for testing)
  clearEvents(): void {
    this.events = [];
  }
}
