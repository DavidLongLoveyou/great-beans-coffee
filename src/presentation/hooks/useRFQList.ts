'use client';

import { useState, useMemo, useCallback } from 'react';
import { RFQItem } from '@/presentation/components/rfq/RFQListTable';
import { RFQFilters, RFQSortConfig } from '@/presentation/components/rfq/RFQListFilters';

export interface UseRFQListProps {
  initialData: RFQItem[];
  initialPageSize?: number;
}

export interface UseRFQListReturn {
  // Data
  filteredRFQs: RFQItem[];
  paginatedRFQs: RFQItem[];
  
  // Filters
  filters: RFQFilters;
  setFilters: (filters: RFQFilters) => void;
  resetFilters: () => void;
  
  // Sorting
  sortConfig: RFQSortConfig;
  setSortConfig: (config: RFQSortConfig) => void;
  
  // Pagination
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  
  // Stats
  totalCount: number;
  filteredCount: number;
  
  // Loading state
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const defaultFilters: RFQFilters = {
  search: '',
  status: 'ALL',
  priority: 'ALL',
};

const defaultSortConfig: RFQSortConfig = {
  field: 'submittedAt',
  direction: 'desc',
};

export function useRFQList({
  initialData,
  initialPageSize = 25,
}: UseRFQListProps): UseRFQListReturn {
  const [filters, setFilters] = useState<RFQFilters>(defaultFilters);
  const [sortConfig, setSortConfig] = useState<RFQSortConfig>(defaultSortConfig);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [loading, setLoading] = useState(false);

  // Filter RFQs based on current filters
  const filteredRFQs = useMemo(() => {
    return initialData.filter(rfq => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          rfq.rfqNumber.toLowerCase().includes(searchLower) ||
          rfq.productType.toLowerCase().includes(searchLower) ||
          rfq.companyName.toLowerCase().includes(searchLower) ||
          rfq.contactPerson.toLowerCase().includes(searchLower) ||
          (rfq.assignedTo && rfq.assignedTo.toLowerCase().includes(searchLower));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'ALL' && rfq.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'ALL' && rfq.priority !== filters.priority) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const submittedDate = new Date(rfq.submittedAt);
        
        if (filters.dateFrom && submittedDate < filters.dateFrom) {
          return false;
        }
        
        if (filters.dateTo && submittedDate > filters.dateTo) {
          return false;
        }
      }

      // Value range filter
      if (filters.minValue !== undefined && rfq.estimatedValue < filters.minValue) {
        return false;
      }
      
      if (filters.maxValue !== undefined && rfq.estimatedValue > filters.maxValue) {
        return false;
      }

      // Assigned to filter
      if (filters.assignedTo) {
        const assignedToLower = filters.assignedTo.toLowerCase();
        if (!rfq.assignedTo || !rfq.assignedTo.toLowerCase().includes(assignedToLower)) {
          return false;
        }
      }

      return true;
    });
  }, [initialData, filters]);

  // Sort filtered RFQs
  const sortedRFQs = useMemo(() => {
    const sorted = [...filteredRFQs].sort((a, b) => {
      let aValue: any = a[sortConfig.field as keyof RFQItem];
      let bValue: any = b[sortConfig.field as keyof RFQItem];

      // Handle different data types
      if (sortConfig.field === 'submittedAt' || 
          sortConfig.field === 'lastUpdate' || 
          sortConfig.field === 'responseDeadline') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (sortConfig.field === 'estimatedValue' || 
                 sortConfig.field === 'quantity') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (sortConfig.field === 'priority') {
        const priorityOrder = { LOW: 1, MEDIUM: 2, HIGH: 3, URGENT: 4 };
        aValue = priorityOrder[aValue as keyof typeof priorityOrder];
        bValue = priorityOrder[bValue as keyof typeof priorityOrder];
      } else if (sortConfig.field === 'status') {
        const statusOrder = {
          SUBMITTED: 1,
          UNDER_REVIEW: 2,
          QUOTED: 3,
          NEGOTIATING: 4,
          ACCEPTED: 5,
          REJECTED: 6,
          EXPIRED: 7,
        };
        aValue = statusOrder[aValue as keyof typeof statusOrder];
        bValue = statusOrder[bValue as keyof typeof statusOrder];
      } else {
        // String comparison
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [filteredRFQs, sortConfig]);

  // Paginate sorted RFQs
  const paginatedRFQs = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return sortedRFQs.slice(startIndex, endIndex);
  }, [sortedRFQs, page, pageSize]);

  // Reset page when filters change
  const handleFiltersChange = useCallback((newFilters: RFQFilters) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  // Reset page when sort changes
  const handleSortChange = useCallback((newSortConfig: RFQSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(1);
  }, []);

  // Reset page when page size changes
  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1);
  }, []);

  // Reset all filters and pagination
  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
    setSortConfig(defaultSortConfig);
    setPage(1);
  }, []);

  return {
    // Data
    filteredRFQs: sortedRFQs,
    paginatedRFQs,
    
    // Filters
    filters,
    setFilters: handleFiltersChange,
    resetFilters,
    
    // Sorting
    sortConfig,
    setSortConfig: handleSortChange,
    
    // Pagination
    pagination: {
      page,
      pageSize,
      total: sortedRFQs.length,
    },
    setPage,
    setPageSize: handlePageSizeChange,
    
    // Stats
    totalCount: initialData.length,
    filteredCount: sortedRFQs.length,
    
    // Loading
    loading,
    setLoading,
  };
}