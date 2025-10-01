import { Prisma } from '@prisma/client';

import { RFQEntity } from '../../../domain/entities/rfq.entity';
import { prisma } from '../prisma';

export interface IRFQRepository {
  findById(id: string): Promise<RFQEntity | null>;
  findByReferenceNumber(referenceNumber: string): Promise<RFQEntity | null>;
  findAll(filters?: RFQFilters): Promise<RFQEntity[]>;
  findByStatus(status: string): Promise<RFQEntity[]>;
  findByCompany(companyId: string): Promise<RFQEntity[]>;
  findPending(): Promise<RFQEntity[]>;
  findExpiringSoon(days?: number): Promise<RFQEntity[]>;
  create(
    data: Omit<RFQEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RFQEntity>;
  update(id: string, data: Partial<RFQEntity>): Promise<RFQEntity>;
  updateStatus(id: string, status: string, notes?: string): Promise<RFQEntity>;
  delete(id: string): Promise<void>;
  addCommunication(rfqId: string, communication: any): Promise<void>;
  addDocument(rfqId: string, document: any): Promise<void>;
  getAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
}

export interface RFQFilters {
  status?: string[];
  priority?: string[];
  source?: string[];
  companyId?: string;
  productType?: string[];
  minValue?: number;
  maxValue?: number;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'validUntil' | 'estimatedValue';
  sortOrder?: 'asc' | 'desc';
}

export class RFQRepository implements IRFQRepository {
  private mapToEntity(rfq: any): RFQEntity {
    return new RFQEntity({
      id: rfq.id,
      referenceNumber: rfq.referenceNumber,
      status: rfq.status,
      priority: rfq.priority,
      source: rfq.source,
      companyInfo: rfq.companyInfo,
      contactPerson: rfq.contactPerson,
      productRequirements: rfq.productRequirements,
      quantityRequirements: rfq.quantityRequirements,
      deliveryRequirements: rfq.deliveryRequirements,
      paymentTerms: rfq.paymentTerms,
      additionalRequirements: rfq.additionalRequirements,
      estimatedValue: rfq.estimatedValue,
      validUntil: rfq.validUntil,
      internalNotes: rfq.internalNotes,
      clientCompanyId: rfq.clientCompanyId,
      assignedToId: rfq.assignedToId,
      createdAt: rfq.createdAt,
      updatedAt: rfq.updatedAt,
    });
  }

  private getIncludeClause() {
    return {
      clientCompany: {
        select: {
          id: true,
          name: true,
          email: true,
          country: true,
          relationshipStatus: true,
        },
      },
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      documents: true,
      communications: {
        orderBy: { createdAt: 'desc' },
      },
      products: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true,
              type: true,
              grade: true,
            },
          },
        },
      },
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              type: true,
              category: true,
            },
          },
        },
      },
    };
  }

  async findById(id: string): Promise<RFQEntity | null> {
    const rfq = await prisma.rFQ.findUnique({
      where: { id },
      include: this.getIncludeClause(),
    });

    return rfq ? this.mapToEntity(rfq) : null;
  }

  async findByReferenceNumber(
    referenceNumber: string
  ): Promise<RFQEntity | null> {
    const rfq = await prisma.rFQ.findUnique({
      where: { referenceNumber },
      include: this.getIncludeClause(),
    });

    return rfq ? this.mapToEntity(rfq) : null;
  }

  async findAll(filters?: RFQFilters): Promise<RFQEntity[]> {
    const where: Prisma.RFQWhereInput = {};

    if (filters) {
      if (filters.status?.length) {
        where.status = { in: filters.status as any[] };
      }
      if (filters.priority?.length) {
        where.priority = { in: filters.priority as any[] };
      }
      if (filters.source?.length) {
        where.source = { in: filters.source };
      }
      if (filters.companyId) {
        where.clientCompanyId = filters.companyId;
      }
      if (filters.productType?.length) {
        where.productRequirements = {
          path: ['type'],
          in: filters.productType,
        };
      }
      if (filters.minValue !== undefined || filters.maxValue !== undefined) {
        where.estimatedValue = {
          ...(filters.minValue !== undefined && { gte: filters.minValue }),
          ...(filters.maxValue !== undefined && { lte: filters.maxValue }),
        };
      }
      if (filters.dateFrom || filters.dateTo) {
        where.createdAt = {
          ...(filters.dateFrom && { gte: filters.dateFrom }),
          ...(filters.dateTo && { lte: filters.dateTo }),
        };
      }
    }

    const orderBy: Prisma.RFQOrderByWithRelationInput = {};
    if (filters?.sortBy) {
      orderBy[filters.sortBy] = filters.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const rfqs = await prisma.rFQ.findMany({
      where,
      include: this.getIncludeClause(),
      orderBy,
      take: filters?.limit,
      skip: filters?.offset,
    });

    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async findByStatus(status: string): Promise<RFQEntity[]> {
    return this.findAll({
      status: [status],
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }

  async findByCompany(companyId: string): Promise<RFQEntity[]> {
    return this.findAll({
      companyId,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  }

  async findPending(): Promise<RFQEntity[]> {
    return this.findAll({
      status: ['PENDING', 'IN_REVIEW'],
      sortBy: 'createdAt',
      sortOrder: 'asc',
    });
  }

  async findExpiringSoon(days: number = 7): Promise<RFQEntity[]> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + days);

    const rfqs = await prisma.rFQ.findMany({
      where: {
        status: { in: ['PENDING', 'IN_REVIEW', 'QUOTED'] },
        validUntil: {
          lte: expiryDate,
          gte: new Date(),
        },
      },
      include: this.getIncludeClause(),
      orderBy: { validUntil: 'asc' },
    });

    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async create(
    data: Omit<RFQEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RFQEntity> {
    const rfq = await prisma.rFQ.create({
      data: {
        referenceNumber: data.referenceNumber,
        status: data.status,
        priority: data.priority,
        source: data.source,
        companyInfo: data.companyInfo as any,
        contactPerson: data.contactPerson as any,
        productRequirements: data.productRequirements as any,
        quantityRequirements: data.quantityRequirements as any,
        deliveryRequirements: data.deliveryRequirements as any,
        paymentTerms: data.paymentTerms as any,
        additionalRequirements: data.additionalRequirements,
        estimatedValue: data.estimatedValue,
        validUntil: data.validUntil,
        internalNotes: data.internalNotes,
        clientCompanyId: data.clientCompanyId,
        assignedToId: data.assignedToId,
      },
      include: this.getIncludeClause(),
    });

    return this.mapToEntity(rfq);
  }

  async update(id: string, data: Partial<RFQEntity>): Promise<RFQEntity> {
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
    await prisma.rFQCommunication.create({
      data: {
        rfqId,
        type: communication.type,
        direction: communication.direction,
        subject: communication.subject,
        content: communication.content,
        attachments: communication.attachments || [],
        userId: communication.userId,
        isInternal: communication.isInternal || false,
      },
    });
  }

  async addDocument(rfqId: string, document: any): Promise<void> {
    await prisma.rFQDocument.create({
      data: {
        rfqId,
        name: document.name,
        type: document.type,
        url: document.url,
        size: document.size,
        uploadedById: document.uploadedById,
      },
    });
  }

  async getAnalytics(startDate?: Date, endDate?: Date): Promise<any> {
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
      sourceBreakdown,
      averageValue,
      conversionRate,
      averageResponseTime,
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

      // Source breakdown
      prisma.rFQ.groupBy({
        by: ['source'],
        where: whereClause,
        _count: true,
      }),

      // Average estimated value
      prisma.rFQ.aggregate({
        where: {
          ...whereClause,
          estimatedValue: { not: null },
        },
        _avg: {
          estimatedValue: true,
        },
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

      // Average response time (first communication after creation)
      prisma.$queryRaw`
        SELECT AVG(EXTRACT(EPOCH FROM (c.created_at - r.created_at)) / 3600) as avg_hours
        FROM "RFQ" r
        INNER JOIN (
          SELECT rfq_id, MIN(created_at) as created_at
          FROM "RFQCommunication"
          WHERE direction = 'OUTBOUND'
          GROUP BY rfq_id
        ) c ON r.id = c.rfq_id
        ${startDate && endDate ? Prisma.sql`WHERE r.created_at BETWEEN ${startDate} AND ${endDate}` : Prisma.empty}
      `,
    ]);

    return {
      totalRFQs,
      statusBreakdown: statusBreakdown.reduce(
        (acc, item) => {
          acc[item.status] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      priorityBreakdown: priorityBreakdown.reduce(
        (acc, item) => {
          acc[item.priority] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      sourceBreakdown: sourceBreakdown.reduce(
        (acc, item) => {
          acc[item.source] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      averageValue: averageValue._avg.estimatedValue,
      conversionRate,
      averageResponseTimeHours: averageResponseTime[0]?.avg_hours || 0,
    };
  }
}

export const rfqRepository = new RFQRepository();
