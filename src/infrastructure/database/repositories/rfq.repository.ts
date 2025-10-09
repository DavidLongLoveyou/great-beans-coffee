import { randomUUID } from 'crypto';

import { Prisma, RFQStatus as PrismaRFQStatus } from '@prisma/client';

import {
  RFQEntity,
  type RFQ,
  type RFQStatus,
  type RFQPriority,
  type RFQQuote,
} from '../../../domain/entities/rfq.entity';
import {
  type RFQSearchCriteria,
  type RFQSearchResult,
  type RFQAnalytics,
} from '../../../domain/repositories/rfq.repository';
import { prisma } from '../prisma';

export interface IRFQRepository {
  findById(id: string): Promise<RFQEntity | null>;
  findByRfqNumber(rfqNumber: string): Promise<RFQEntity | null>;
  findAll(filters?: RFQSearchCriteria): Promise<RFQEntity[]>;
  findByStatus(status: string): Promise<RFQEntity[]>;
  findByCompany(companyId: string): Promise<RFQEntity[]>;
  findPending(): Promise<RFQEntity[]>;
  findExpiringSoon(days?: number): Promise<RFQEntity[]>;
  create(data: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt'>): Promise<RFQEntity>;
  update(id: string, data: Partial<RFQ>): Promise<RFQEntity>;
  updateStatus(id: string, status: string, notes?: string): Promise<RFQEntity>;
  delete(id: string): Promise<void>;
  addCommunication(rfqId: string, communication: any): Promise<void>;
  addDocument(rfqId: string, document: any): Promise<void>;
  getAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
}

export class RFQRepository implements IRFQRepository {
  private mapToEntity(rfq: any): RFQEntity {
    return new RFQEntity({
      id: rfq.id,
      rfqNumber: rfq.rfqNumber,
      status: rfq.status,
      priority: rfq.priority,
      companyInfo: {
        companyName: rfq.companyName,
        contactPerson: rfq.contactPerson,
        email: rfq.email,
        phone: rfq.phone,
        address: {
          street: rfq.address?.street || '',
          city: rfq.address?.city || '',
          postalCode: rfq.address?.postalCode || '',
          country: rfq.country || '',
        },
        businessType: rfq.businessType || 'IMPORTER',
      },
      productRequirements: rfq.productRequirements || {
        coffeeType: 'ARABICA',
      },
      quantityRequirements: {
        quantity: rfq.quantity || 1,
        unit: rfq.unit || 'MT',
        isRecurringOrder: rfq.isRecurringOrder || false,
      },
      deliveryRequirements: rfq.deliveryRequirements || {
        incoterms: 'FOB',
        destinationPort: rfq.destinationPort || '',
        destinationCountry: rfq.country || '',
        preferredDeliveryDate: rfq.preferredDeliveryDate || new Date(),
        latestDeliveryDate: rfq.latestDeliveryDate || new Date(),
        packaging: 'JUTE_BAGS_60KG',
      },
      paymentTerms: rfq.paymentRequirements || {
        preferredCurrency: 'USD',
        paymentMethod: 'LC',
        paymentTerms: rfq.paymentTerms || '',
      },
      additionalRequirements: rfq.additionalRequirements,
      sampleRequired: rfq.sampleRequired || false,
      estimatedValue: rfq.totalValue,
      assignedTo: rfq.assignedTo,
      submittedAt: rfq.submittedAt || rfq.createdAt,
      lastActivityAt: rfq.lastActivityAt || rfq.updatedAt,
      createdAt: rfq.createdAt,
      updatedAt: rfq.updatedAt,
      updatedBy: rfq.updatedBy || rfq.createdBy || '',
    });
  }

  private getIncludeClause() {
    return {
      client: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
        },
      },
      assignee: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      products: true,
      services: true,
    };
  }

  async findById(id: string): Promise<RFQEntity | null> {
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: this.getIncludeClause(),
    });

    return rfq ? this.mapToEntity(rfq) : null;
  }

  async findByRfqNumber(rfqNumber: string): Promise<RFQEntity | null> {
    const rfq = await prisma.rFQ.findUnique({
      where: { rfqNumber },
      include: this.getIncludeClause(),
    });

    return rfq ? this.mapToEntity(rfq) : null;
  }

  async findAll(filters?: RFQSearchCriteria): Promise<RFQEntity[]> {
    const where: Prisma.RFQWhereInput = {};

    if (filters) {
      // Handle status filter (can be single value or array)
      if (filters.status) {
        if (Array.isArray(filters.status)) {
          where.status = { in: filters.status as any[] };
        } else {
          where.status = filters.status as any;
        }
      }

      // Handle priority filter (can be single value or array)
      if (filters.priority) {
        if (Array.isArray(filters.priority)) {
          where.priority = { in: filters.priority as any[] };
        } else {
          where.priority = filters.priority as any;
        }
      }

      // Client filters
      if (filters.clientId) {
        where.clientId = filters.clientId;
      }

      // Value filters
      if (filters.minValue !== undefined || filters.maxValue !== undefined) {
        where.totalValue = {
          ...(filters.minValue !== undefined && { gte: filters.minValue }),
          ...(filters.maxValue !== undefined && { lte: filters.maxValue }),
        };
      }

      // Date filters
      if (filters.submittedAfter || filters.submittedBefore) {
        where.createdAt = {
          ...(filters.submittedAfter && { gte: filters.submittedAfter }),
          ...(filters.submittedBefore && { lte: filters.submittedBefore }),
        };
      }

      // Text search
      if (filters.searchTerm) {
        where.OR = [
          { companyName: { contains: filters.searchTerm } },
          { contactPerson: { contains: filters.searchTerm } },
          { notes: { contains: filters.searchTerm } },
        ];
      }
    }

    const orderBy: Prisma.RFQOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      // Map domain sortBy values to database fields
      let sortField: keyof Prisma.RFQOrderByWithRelationInput;
      switch (filters.sortBy) {
        case 'submittedAt':
          sortField = 'createdAt';
          break;
        case 'estimatedValue':
          sortField = 'totalValue';
          break;
        case 'responseDeadline':
          sortField = 'deadline';
          break;
        default:
          sortField =
            filters.sortBy as keyof Prisma.RFQOrderByWithRelationInput;
      }
      orderBy[sortField] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const rfqs = await prisma.rFQ.findMany({
      where,
      include: this.getIncludeClause(),
      orderBy,
      ...(filters?.limit && { take: filters.limit }),
      ...(filters?.page &&
        filters?.limit && { skip: (filters.page - 1) * filters.limit }),
    });

    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async findByStatus(status: string): Promise<RFQEntity[]> {
    return this.findAll({
      status: status as any,
      sortBy: 'submittedAt',
      sortOrder: 'desc',
    });
  }

  async findByCompany(companyId: string): Promise<RFQEntity[]> {
    const rfqs = await prisma.rFQ.findMany({
      where: { clientId: companyId },
      include: this.getIncludeClause(),
      orderBy: { createdAt: 'desc' },
    });
    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async findPending(): Promise<RFQEntity[]> {
    const rfqs = await prisma.rFQ.findMany({
      where: { status: PrismaRFQStatus.PENDING },
      include: this.getIncludeClause(),
      orderBy: { createdAt: 'asc' },
    });
    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async findExpiringSoon(days: number = 7): Promise<RFQEntity[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const rfqs = await prisma.rFQ.findMany({
      where: {
        status: { in: ['PENDING', 'IN_REVIEW', 'QUOTED'] },
        deadline: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      include: this.getIncludeClause(),
      orderBy: { deadline: 'asc' },
    });

    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async create(
    data: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RFQEntity> {
    const createData: any = {
      rfqNumber: data.rfqNumber,
      status: data.status,
      priority: data.priority,
      companyName: data.companyInfo.companyName,
      contactPerson: data.companyInfo.contactPerson,
      email: data.companyInfo.email,
      country: data.companyInfo.address.country,
      productRequirements: data.productRequirements as any,
      deliveryRequirements: data.deliveryRequirements as any,
      paymentRequirements: data.paymentTerms as any,
      sampleRequired: data.sampleRequired,
    };

    // Add optional fields only if they exist
    if (data.companyInfo.phone) createData.phone = data.companyInfo.phone;
    if (data.companyInfo.businessType)
      createData.businessType = data.companyInfo.businessType;
    if (data.additionalRequirements)
      createData.additionalRequirements = data.additionalRequirements;
    if (data.assignedTo) createData.assignedTo = data.assignedTo;
    if (data.updatedBy) createData.updatedBy = data.updatedBy;

    const rfq = await prisma.rFQ.create({
      data: createData,
      include: this.getIncludeClause(),
    });

    return this.mapToEntity(rfq);
  }

  async update(id: string, data: Partial<RFQ>): Promise<RFQEntity> {
    const updateData: any = { ...data };
    delete updateData.id;
    delete updateData.createdAt;
    updateData.updatedAt = new Date();

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: updateData,
      include: this.getIncludeClause(),
    });

    return this.mapToEntity(rfq);
  }

  async updateStatus(
    id: string,
    status: string,
    notes?: string
  ): Promise<RFQEntity> {
    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    if (notes) {
      updateData.internalNotes = notes;
    }

    const rfq = await prisma.rFQ.update({
      where: { id },
      data: updateData,
      include: this.getIncludeClause(),
    });

    // Add status change communication
    await this.addCommunication(id, {
      type: 'STATUS_CHANGE',
      direction: 'INTERNAL',
      subject: `Status changed to ${status}`,
      content: notes || `RFQ status updated to ${status}`,
      userId: null, // System generated
      isInternal: true,
    });

    return this.mapToEntity(rfq);
  }

  async delete(id: string): Promise<void> {
    await prisma.rFQ.delete({
      where: { id },
    });
  }

  async addCommunication(rfqId: string, communication: any): Promise<void> {
    // TODO: Implement when RFQCommunication model is added to schema
    throw new Error(
      'addCommunication not implemented - missing RFQCommunication model'
    );
  }

  async addDocument(rfqId: string, document: any): Promise<void> {
    // TODO: Implement when RFQDocument model is added to schema
    throw new Error('addDocument not implemented - missing RFQDocument model');
  }

  async getCommunicationHistory(id: string): Promise<any[]> {
    // Placeholder implementation - would need RFQCommunication model
    return [];
  }

  async markAsRead(
    id: string,
    communicationId: string,
    readBy: string
  ): Promise<RFQEntity> {
    // Placeholder implementation - would need RFQCommunication model
    const rfq = await this.findById(id);
    if (!rfq) {
      throw new Error('RFQ not found');
    }
    return rfq;
  }

  async getQuotes(id: string): Promise<RFQQuote[]> {
    // Placeholder implementation - would need RFQQuote model
    return [];
  }

  async createQuote(
    id: string,
    quote: Omit<RFQQuote, 'id' | 'createdAt'>
  ): Promise<RFQQuote> {
    // Placeholder implementation - would need RFQQuote model
    const rfq = await this.findById(id);
    if (!rfq) {
      throw new Error('RFQ not found');
    }

    // Create a mock quote object for now
    const createdQuote: RFQQuote = {
      id: randomUUID(),
      createdAt: new Date(),
      ...quote,
    };

    return createdQuote;
  }

  async updateQuoteStatus(
    id: string,
    quoteId: string,
    status: string,
    notes?: string,
    updatedBy?: string
  ): Promise<RFQQuote> {
    // Placeholder implementation - would need RFQQuote model
    const rfq = await this.findById(id);
    if (!rfq) {
      throw new Error('RFQ not found');
    }

    // Create a mock updated quote object for now
    const updatedQuote: RFQQuote = {
      id: quoteId,
      rfqId: id,
      version: '1.0',
      status: status as any, // Cast to RFQQuote status enum
      currency: 'USD',
      totalAmount: 0,
      validUntil: new Date(),
      createdAt: new Date(),
      createdBy: updatedBy || 'system',
      updatedAt: new Date(),
      updatedBy: updatedBy,
      items: [],
      shipping: {
        method: 'Standard',
        cost: 0,
        estimatedDays: 7,
        incoterms: 'FOB',
      },
      paymentTerms: {
        method: 'Bank Transfer',
        terms: 'Net 30',
      },
      notes,
      attachments: [],
    };

    return updatedQuote;
  }

  async getPerformanceMetrics(
    assigneeId?: string,
    dateRange?: { start: Date; end: Date }
  ): Promise<any> {
    // Placeholder implementation
    return {
      totalRFQs: 0,
      quotedRFQs: 0,
      acceptedRFQs: 0,
      averageResponseTime: 0,
      conversionRate: 0,
    };
  }

  async search(criteria: RFQSearchCriteria): Promise<RFQSearchResult> {
    // Use existing findAll method with filters
    const rfqs = await this.findAll(criteria);

    // Return in RFQSearchResult format
    const page = criteria.page || 1;
    const limit = criteria.limit || 50;
    const total = rfqs.length;
    const totalPages = Math.ceil(total / limit);

    return {
      rfqs,
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrevious: page > 1,
    };
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<RFQAnalytics> {
    const whereClause =
      startDate && endDate
        ? {
            createdAt: {
              gte: startDate,
              lte: endDate,
            },
          }
        : {};

    const [
      totalRFQs,
      statusBreakdown,
      priorityBreakdown,
      businessTypeBreakdown,
      conversionRate,
    ] = await Promise.all([
      // Total RFQs
      prisma.rFQ.count({ where: whereClause }),

      // Status breakdown
      prisma.rFQ.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
      }),

      // Priority breakdown
      prisma.rFQ.groupBy({
        by: ['priority'],
        where: whereClause,
        _count: true,
      }),

      // Business type breakdown (replacing source)
      prisma.rFQ.groupBy({
        by: ['businessType'],
        where: whereClause,
        _count: true,
      }),

      // Conversion rate (quoted/accepted vs total)
      Promise.all([
        prisma.rFQ.count({
          where: {
            ...whereClause,
            status: { in: ['QUOTED', 'ACCEPTED'] },
          },
        }),
        prisma.rFQ.count({ where: whereClause }),
      ]).then(([converted, total]) =>
        total > 0 ? (converted / total) * 100 : 0
      ),
    ]);

    const statusBreakdownMap = statusBreakdown.reduce(
      (acc, item) => {
        acc[item.status] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const priorityBreakdownMap = priorityBreakdown.reduce(
      (acc, item) => {
        acc[item.priority] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    const businessTypeBreakdownMap = businessTypeBreakdown.reduce(
      (acc, item) => {
        const key = item.businessType || 'UNKNOWN';
        acc[key] = item._count;
        return acc;
      },
      {} as Record<string, number>
    );

    return {
      totalRFQs,
      rfqsByStatus: statusBreakdownMap as Record<RFQStatus, number>,
      rfqsByPriority: priorityBreakdownMap as Record<RFQPriority, number>,
      rfqsByCountry: {}, // Placeholder - need to implement country breakdown
      averageResponseTime: 0, // Placeholder
      averageResponseTimeHours: 0, // Placeholder until RFQCommunication model is added
      conversionRate,
      totalEstimatedValue: 0, // Placeholder
      averageRFQValue: 0, // Placeholder
      topRequestedProducts: [], // Placeholder
      monthlyTrends: [], // Placeholder
      // Breakdown properties (aliases for compatibility)
      statusBreakdown: statusBreakdownMap,
      priorityBreakdown: priorityBreakdownMap,
      businessTypeBreakdown: businessTypeBreakdownMap,
      countryBreakdown: {}, // Placeholder
    };
  }
}

export const rfqRepository = new RFQRepository();
