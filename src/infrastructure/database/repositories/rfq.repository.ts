import { Prisma } from '@prisma/client';

import { RFQEntity, type RFQ } from '../../../domain/entities/rfq.entity';
import { prisma } from '../prisma';

export interface IRFQRepository {
  findById(id: string): Promise<RFQEntity | null>;
  findByRfqNumber(rfqNumber: string): Promise<RFQEntity | null>;
  findAll(filters?: RFQFilters): Promise<RFQEntity[]>;
  findByStatus(status: string): Promise<RFQEntity[]>;
  findByCompany(companyId: string): Promise<RFQEntity[]>;
  findPending(): Promise<RFQEntity[]>;
  findExpiringSoon(days?: number): Promise<RFQEntity[]>;
  create(
    data: Omit<RFQ, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<RFQEntity>;
  update(id: string, data: Partial<RFQ>): Promise<RFQEntity>;
  updateStatus(id: string, status: string, notes?: string): Promise<RFQEntity>;
  delete(id: string): Promise<void>;
  addCommunication(rfqId: string, communication: any): Promise<void>;
  addDocument(rfqId: string, document: any): Promise<void>;
  getAnalytics(startDate?: Date, endDate?: Date): Promise<any>;
}

export interface RFQFilters {
  status?: string[];
  priority?: string[];
  businessType?: string[];
  companyId?: string;
  productType?: string[];
  minValue?: number;
  maxValue?: number;
  dateFrom?: Date;
  dateTo?: Date;
  limit?: number;
  offset?: number;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
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

  async findByRfqNumber(
    rfqNumber: string
  ): Promise<RFQEntity | null> {
    const rfq = await prisma.rFQ.findUnique({
      where: { rfqNumber },
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

      if (filters.companyId) {
        where.clientId = filters.companyId;
      }

      if (filters.minValue !== undefined || filters.maxValue !== undefined) {
        where.totalValue = {
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
      ...(filters?.limit && { take: filters.limit }),
      ...(filters?.offset && { skip: filters.offset }),
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
    const rfqs = await prisma.rFQ.findMany({
      where: { clientId: companyId },
      include: this.getIncludeClause(),
      orderBy: { createdAt: 'desc' },
    });
    return rfqs.map(rfq => this.mapToEntity(rfq));
  }

  async findPending(): Promise<RFQEntity[]> {
    const rfqs = await prisma.rFQ.findMany({
      where: { status: 'PENDING' },
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
    if (data.companyInfo.businessType) createData.businessType = data.companyInfo.businessType;
    if (data.additionalRequirements) createData.additionalRequirements = data.additionalRequirements;
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
    console.log('addCommunication not implemented - missing RFQCommunication model');
  }

  async addDocument(rfqId: string, document: any): Promise<void> {
    // TODO: Implement when RFQDocument model is added to schema
    console.log('addDocument not implemented - missing RFQDocument model');
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
      businessTypeBreakdown: businessTypeBreakdown.reduce(
        (acc, item) => {
          const key = item.businessType || 'UNKNOWN';
          acc[key] = item._count;
          return acc;
        },
        {} as Record<string, number>
      ),
      conversionRate,
      averageResponseTimeHours: 0, // Placeholder until RFQCommunication model is added
    };
  }
}

export const rfqRepository = new RFQRepository();
