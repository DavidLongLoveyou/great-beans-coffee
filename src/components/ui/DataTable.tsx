'use client';

import React, { useState, useMemo } from 'react';

interface Column {
  key: string;
  label: string;
  type?: 'text' | 'number' | 'currency' | 'percentage' | 'date';
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => string;
  currency?: string;
  precision?: number;
}

interface DataTableProps {
  data: Record<string, any>[];
  columns: Column[];
  title?: string;
  searchable?: boolean;
  sortable?: boolean;
  exportable?: boolean;
  pageSize?: number;
  className?: string;
  striped?: boolean;
  compact?: boolean;
  showRowNumbers?: boolean;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  title,
  searchable = true,
  sortable = true,
  exportable = false,
  pageSize = 10,
  className = '',
  striped = true,
  compact = false,
  showRowNumbers = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;

    return data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'desc' ? comparison * -1 : comparison;
    });
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const totalPages = Math.ceil(sortedData.length / pageSize);

  const handleSort = (key: string) => {
    if (!sortable) return;

    const column = columns.find(col => col.key === key);
    if (!column?.sortable) return;

    setSortConfig(current => {
      if (current?.key === key) {
        return current.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  const formatValue = (value: any, column: Column) => {
    if (value === null || value === undefined) return '-';

    if (column.format) {
      return column.format(value);
    }

    switch (column.type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: column.currency || 'USD',
          minimumFractionDigits: column.precision || 2,
          maximumFractionDigits: column.precision || 2,
        }).format(Number(value));

      case 'percentage':
        return `${Number(value).toFixed(column.precision || 1)}%`;

      case 'number':
        return Number(value).toLocaleString('en-US', {
          minimumFractionDigits: column.precision || 0,
          maximumFractionDigits: column.precision || 2,
        });

      case 'date':
        return new Date(value).toLocaleDateString();

      default:
        return String(value);
    }
  };

  const exportToCSV = () => {
    const headers = columns.map(col => col.label).join(',');
    const rows = sortedData
      .map(row =>
        columns
          .map(col => {
            const value = formatValue(row[col.key], col);
            return `"${value.replace(/"/g, '""')}"`;
          })
          .join(',')
      )
      .join('\n');

    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'data'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <span className="text-gray-400">↕</span>;
    }
    return sortConfig.direction === 'asc' ? (
      <span className="text-blue-600">↑</span>
    ) : (
      <span className="text-blue-600">↓</span>
    );
  };

  return (
    <div
      className={`my-6 overflow-hidden rounded-lg border border-gray-200 bg-white ${className}`}
    >
      {/* Header */}
      {(title || searchable || exportable) && (
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              {title && (
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              )}
              <p className="mt-1 text-sm text-gray-600">
                {sortedData.length}{' '}
                {sortedData.length === 1 ? 'entry' : 'entries'}
                {searchTerm && ` (filtered from ${data.length})`}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {searchable && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="rounded-md border border-gray-300 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="absolute left-2 top-2.5 text-sm text-gray-400">
                    🔍
                  </span>
                </div>
              )}

              {exportable && (
                <button
                  onClick={exportToCSV}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                >
                  Export CSV
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {showRowNumbers && (
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 ${compact ? 'py-2' : ''}`}
                >
                  #
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`cursor-pointer px-4 py-3 text-xs font-medium uppercase tracking-wider text-gray-500 transition-colors hover:bg-gray-100 ${
                    column.align === 'center'
                      ? 'text-center'
                      : column.align === 'right'
                        ? 'text-right'
                        : 'text-left'
                  } ${compact ? 'py-2' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.label}</span>
                    {sortable &&
                      column.sortable !== false &&
                      getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.map((row, index) => (
              <tr
                key={`row-${columns[0]?.key ? row[columns[0].key] : index}-${index}`}
                className={`${striped && index % 2 === 1 ? 'bg-gray-50' : ''} transition-colors hover:bg-gray-100`}
              >
                {showRowNumbers && (
                  <td
                    className={`whitespace-nowrap px-4 py-4 text-sm text-gray-500 ${compact ? 'py-2' : ''}`}
                  >
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                )}
                {columns.map(column => (
                  <td
                    key={column.key}
                    className={`whitespace-nowrap px-4 py-4 text-sm text-gray-900 ${
                      column.align === 'center'
                        ? 'text-center'
                        : column.align === 'right'
                          ? 'text-right'
                          : 'text-left'
                    } ${compact ? 'py-2' : ''}`}
                  >
                    {formatValue(row[column.key], column)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, sortedData.length)} of{' '}
              {sortedData.length} entries
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`rounded-md px-3 py-1 text-sm transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Preset components for common data types
export const PriceTable: React.FC<
  Omit<DataTableProps, 'columns'> & {
    priceColumn: string;
    currency?: string;
  }
> = ({ priceColumn, currency = 'USD', ...props }) => {
  const columns: Column[] = [
    ...(props.data.length > 0 && props.data[0]
      ? Object.keys(props.data[0])
          .filter(key => key !== priceColumn)
          .map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            sortable: true,
          }))
      : []),
    {
      key: priceColumn,
      label: 'Price',
      type: 'currency',
      currency,
      sortable: true,
      align: 'right',
    },
  ];

  return <DataTable {...props} columns={columns} />;
};

export const VolumeTable: React.FC<
  Omit<DataTableProps, 'columns'> & {
    volumeColumn: string;
    unit?: string;
  }
> = ({ volumeColumn, unit = 'MT', ...props }) => {
  const columns: Column[] = [
    ...(props.data.length > 0 && props.data[0]
      ? Object.keys(props.data[0])
          .filter(key => key !== volumeColumn)
          .map(key => ({
            key,
            label: key.charAt(0).toUpperCase() + key.slice(1),
            sortable: true,
          }))
      : []),
    {
      key: volumeColumn,
      label: `Volume (${unit})`,
      type: 'number',
      sortable: true,
      align: 'right',
    },
  ];

  return <DataTable {...props} columns={columns} />;
};

export default DataTable;
