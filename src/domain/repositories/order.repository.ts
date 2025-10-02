import {
  OrderEntity,
  type Order,
  type OrderStatus,
  type PaymentStatus,
  type ShipmentStatus,
  type OrderPriority,
  type OrderDocument,
  type OrderCommunication,
  type OrderItem,
} from '../entities/order.entity';

// Search and filter criteria
export interface OrderSearchCriteria {
  // Status filters
  status?: OrderStatus | OrderStatus[];
  paymentStatus?: PaymentStatus | PaymentStatus[];
  shipmentStatus?: ShipmentStatus | ShipmentStatus[];
  priority?: OrderPriority | OrderPriority[];

  // Client and relationship filters
  clientId?: string;
  rfqId?: string;
  assignedTo?: string;
  salesRep?: string;
  accountManager?: string;

  // Order characteristics
  type?: string | string[];
  isRecurring?: boolean;

  // Value filters
  minTotalAmount?: number;
  maxTotalAmount?: number;
  currency?: string;

  // Quantity filters
  minTotalWeight?: number;
  maxTotalWeight?: number;

  // Date filters
  orderDateAfter?: Date;
  orderDateBefore?: Date;
  confirmedAfter?: Date;
  confirmedBefore?: Date;
  requestedDeliveryAfter?: Date;
  requestedDeliveryBefore?: Date;
  actualDeliveryAfter?: Date;
  actualDeliveryBefore?: Date;

  // Product filters
  productType?: string | string[];
  productGrade?: string | string[];
  processingMethod?: string | string[];

  // Shipping filters
  incoterms?: string | string[];
  originPort?: string;
  destinationPort?: string;
  destinationCountry?: string;
  shippingLine?: string;

  // Quality filters
  requiresQualityCheck?: boolean;
  qualityCheckPassed?: boolean;

  // Document filters
  hasRequiredDocuments?: boolean;
  missingDocuments?: boolean;

  // Text search
  searchTerm?: string; // Search in order number, client name, product names

  // Pagination and sorting
  page?: number;
  limit?: number;
  sortBy?:
    | 'orderNumber'
    | 'orderDate'
    | 'totalAmount'
    | 'requestedDeliveryDate'
    | 'status'
    | 'priority';
  sortOrder?: 'asc' | 'desc';
}

export interface OrderSearchResult {
  orders: OrderEntity[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface OrderAnalytics {
  totalOrders: number;
  ordersByStatus: Record<OrderStatus, number>;
  ordersByPriority: Record<OrderPriority, number>;
  ordersByType: Record<string, number>;
  totalOrderValue: number;
  averageOrderValue: number;
  orderTrends: Array<{ month: string; count: number; value: number }>;
  topClients: Array<{
    clientId: string;
    orderCount: number;
    totalValue: number;
  }>;
  topProducts: Array<{ productType: string; quantity: number; value: number }>;
  deliveryPerformance: {
    onTimeDeliveries: number;
    lateDeliveries: number;
    averageDeliveryTime: number;
    onTimePercentage: number;
  };
  paymentMetrics: {
    paidOnTime: number;
    overduePayments: number;
    averagePaymentTime: number;
    totalOutstanding: number;
  };
}

export interface OrderPerformanceMetrics {
  orderId: string;
  orderNumber: string;
  processingTime: number; // days from order to shipment
  deliveryTime: number; // days from shipment to delivery
  paymentTime: number; // days from invoice to payment
  qualityScore?: number;
  customerSatisfaction?: number;
  profitMargin: number;
  isOnTime: boolean;
  isOnBudget: boolean;
}

// Repository interface
export interface IOrderRepository {
  // Basic CRUD operations
  findById(id: string): Promise<OrderEntity | null>;
  findByOrderNumber(orderNumber: string): Promise<OrderEntity | null>;
  findAll(): Promise<OrderEntity[]>;
  create(
    order: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>
  ): Promise<OrderEntity>;
  update(id: string, updates: Partial<Order>): Promise<OrderEntity>;
  delete(id: string): Promise<void>;

  // Advanced search and filtering
  search(criteria: OrderSearchCriteria): Promise<OrderSearchResult>;
  findByStatus(status: OrderStatus): Promise<OrderEntity[]>;
  findByPaymentStatus(paymentStatus: PaymentStatus): Promise<OrderEntity[]>;
  findByShipmentStatus(shipmentStatus: ShipmentStatus): Promise<OrderEntity[]>;
  findByPriority(priority: OrderPriority): Promise<OrderEntity[]>;
  findByClient(clientId: string): Promise<OrderEntity[]>;
  findByRFQ(rfqId: string): Promise<OrderEntity[]>;

  // Status management
  updateStatus(
    id: string,
    status: OrderStatus,
    updatedBy: string,
    notes?: string
  ): Promise<OrderEntity>;
  updatePaymentStatus(
    id: string,
    paymentStatus: PaymentStatus,
    updatedBy: string
  ): Promise<OrderEntity>;
  updateShipmentStatus(
    id: string,
    shipmentStatus: ShipmentStatus,
    updatedBy: string
  ): Promise<OrderEntity>;

  // Assignment management
  assign(
    id: string,
    assigneeId: string,
    assignedBy: string
  ): Promise<OrderEntity>;
  reassign(
    id: string,
    newAssigneeId: string,
    reassignedBy: string
  ): Promise<OrderEntity>;
  setSalesRep(id: string, salesRepId: string): Promise<OrderEntity>;
  setAccountManager(id: string, accountManagerId: string): Promise<OrderEntity>;

  // Priority management
  updatePriority(
    id: string,
    priority: OrderPriority,
    updatedBy: string
  ): Promise<OrderEntity>;
  findHighPriorityOrders(): Promise<OrderEntity[]>;
  findRushOrders(): Promise<OrderEntity[]>;

  // Order items management
  addItem(
    id: string,
    item: Omit<OrderItem, 'id'>
  ): Promise<OrderEntity>;
  updateItem(
    id: string,
    itemId: string,
    updates: Partial<OrderItem>
  ): Promise<OrderEntity>;
  removeItem(id: string, itemId: string): Promise<OrderEntity>;
  updateItemStatus(
    id: string,
    itemId: string,
    status: OrderStatus
  ): Promise<OrderEntity>;

  // Payment management
  recordPayment(
    id: string,
    paymentId: string,
    amount: number,
    reference?: string
  ): Promise<OrderEntity>;
  updatePaymentTerms(
    id: string,
    paymentTerms: Order['paymentTerms']
  ): Promise<OrderEntity>;
  findOverduePayments(): Promise<OrderEntity[]>;
  findPendingPayments(): Promise<OrderEntity[]>;
  calculateOutstandingAmount(id: string): Promise<number>;

  // Shipping management
  updateShippingDetails(
    id: string,
    shippingDetails: Order['shippingDetails']
  ): Promise<OrderEntity>;
  updateTrackingInfo(
    id: string,
    trackingNumber: string,
    shippingLine?: string
  ): Promise<OrderEntity>;
  findReadyForShipment(): Promise<OrderEntity[]>;
  findInTransit(): Promise<OrderEntity[]>;
  findOverdueDeliveries(): Promise<OrderEntity[]>;

  // Quality control
  setQualityControl(
    id: string,
    qualityControl: Order['qualityControl']
  ): Promise<OrderEntity>;
  findRequiringQualityCheck(): Promise<OrderEntity[]>;
  findFailedQualityCheck(): Promise<OrderEntity[]>;
  updateQualityResults(
    id: string,
    passed: boolean,
    notes?: string
  ): Promise<OrderEntity>;

  // Document management
  addDocument(
    id: string,
    document: Omit<OrderDocument, 'id' | 'uploadedAt'>
  ): Promise<OrderEntity>;
  updateDocument(
    id: string,
    documentId: string,
    updates: Partial<OrderDocument>
  ): Promise<OrderEntity>;
  removeDocument(id: string, documentId: string): Promise<OrderEntity>;
  verifyDocument(
    id: string,
    documentId: string,
    verifiedBy: string
  ): Promise<OrderEntity>;
  findMissingDocuments(): Promise<
    Array<{ orderId: string; missingDocuments: string[] }>
  >;

  // Communication management
  addCommunication(
    id: string,
    communication: Omit<OrderCommunication, 'id' | 'createdAt'>
  ): Promise<OrderEntity>;
  getCommunicationHistory(id: string): Promise<OrderCommunication[]>;
  markCommunicationAsRead(
    id: string,
    communicationId: string,
    readBy: string
  ): Promise<OrderEntity>;

  // Production tracking
  updateProductionStatus(
    id: string,
    itemId: string,
    status: string,
    date?: Date
  ): Promise<OrderEntity>;
  findInProduction(): Promise<OrderEntity[]>;
  getProductionSchedule(): Promise<
    Array<{
      orderId: string;
      itemId: string;
      scheduledDate: Date;
      status: string;
    }>
  >;

  // Delivery management
  confirmDelivery(
    id: string,
    deliveredAt: Date,
    confirmedBy: string
  ): Promise<OrderEntity>;
  updateDeliveryDate(
    id: string,
    newDate: Date,
    updatedBy: string
  ): Promise<OrderEntity>;
  findUpcomingDeliveries(days?: number): Promise<OrderEntity[]>;

  // Financial operations
  calculateTotalValue(id: string): Promise<number>;
  updatePricing(
    id: string,
    itemId: string,
    unitPrice: number,
    totalPrice: number
  ): Promise<OrderEntity>;
  applyDiscount(
    id: string,
    discount: number,
    appliedBy: string
  ): Promise<OrderEntity>;
  addCharges(
    id: string,
    charges: { type: string; amount: number; description?: string }[]
  ): Promise<OrderEntity>;

  // Recurring orders
  createRecurringOrder(
    baseOrderId: string,
    frequency: string,
    nextOrderDate: Date
  ): Promise<OrderEntity>;
  findRecurringOrders(): Promise<OrderEntity[]>;
  updateRecurringSchedule(
    id: string,
    frequency: string,
    nextDate: Date
  ): Promise<OrderEntity>;
  generateNextRecurringOrder(id: string): Promise<OrderEntity>;

  // Bulk operations
  updateMany(
    updates: Array<{ id: string; data: Partial<Order> }>
  ): Promise<OrderEntity[]>;
  deleteMany(ids: string[]): Promise<void>;
  bulkUpdateStatus(
    ids: string[],
    status: OrderStatus,
    updatedBy: string
  ): Promise<OrderEntity[]>;
  bulkAssign(
    ids: string[],
    assigneeId: string,
    assignedBy: string
  ): Promise<OrderEntity[]>;

  // Analytics and reporting
  getAnalytics(dateRange?: { start: Date; end: Date }): Promise<OrderAnalytics>;
  getPerformanceMetrics(orderId: string): Promise<OrderPerformanceMetrics>;
  getClientOrderHistory(clientId: string): Promise<OrderEntity[]>;
  getProductPerformance(): Promise<
    Array<{
      productType: string;
      totalOrders: number;
      totalValue: number;
      avgDeliveryTime: number;
    }>
  >;
  getSalesPerformance(salesRepId?: string): Promise<any>;

  // Forecasting and planning
  getForecast(
    months: number
  ): Promise<
    Array<{ month: string; predictedOrders: number; predictedValue: number }>
  >;
  getCapacityUtilization(): Promise<{
    currentCapacity: number;
    utilizedCapacity: number;
    availableCapacity: number;
  }>;
  getBottlenecks(): Promise<
    Array<{ stage: string; orderCount: number; avgWaitTime: number }>
  >;

  // Compliance and audit
  findComplianceIssues(): Promise<Array<{ orderId: string; issues: string[] }>>;
  auditOrder(id: string): Promise<any>;
  validateOrderData(
    id: string
  ): Promise<{ isValid: boolean; errors: string[] }>;

  // Export and reporting
  exportToCSV(criteria?: OrderSearchCriteria): Promise<string>;
  exportToExcel(criteria?: OrderSearchCriteria): Promise<Buffer>;
  generateInvoice(id: string): Promise<Buffer>;
  generatePackingList(id: string): Promise<Buffer>;
  generateShippingLabel(id: string): Promise<Buffer>;

  // Integration hooks
  syncWithERP(orderId: string): Promise<OrderEntity>;
  syncWithWMS(orderId: string): Promise<OrderEntity>;
  notifyShippingProvider(orderId: string): Promise<void>;

  // Audit and history
  getHistory(
    id: string
  ): Promise<
    Array<{ timestamp: Date; changes: Partial<Order>; changedBy: string }>
  >;
  getStatusHistory(id: string): Promise<
    Array<{
      status: OrderStatus;
      timestamp: Date;
      changedBy: string;
      notes?: string;
    }>
  >;
  getPaymentHistory(id: string): Promise<
    Array<{
      amount: number;
      timestamp: Date;
      reference?: string;
      status: PaymentStatus;
    }>
  >;

  // Cache management
  clearCache(): Promise<void>;
  warmCache(): Promise<void>;
  invalidateOrderCache(id: string): Promise<void>;
}
