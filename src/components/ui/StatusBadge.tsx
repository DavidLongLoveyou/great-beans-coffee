'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Archive,
  Eye,
  EyeOff,
  Shield,
  ShieldOff,
  Bell,
  BellOff,
  Zap,
  ZapOff,
  Globe,
  Star,
  Target,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Pause,
  Play,
  RefreshCw,
  Lock,
  Unlock,
  AlertCircle,
  Info,
  CheckSquare,
  X,
  Minus,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Badge } from '@/presentation/components/ui/badge';

// Status Badge Variants
const statusBadgeVariants = cva(
  'inline-flex items-center gap-1 font-medium transition-colors',
  {
    variants: {
      status: {
        // General statuses
        active: 'bg-green-100 text-green-800 border-green-200',
        inactive: 'bg-gray-100 text-gray-800 border-gray-200',
        pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        expired: 'bg-red-100 text-red-800 border-red-200',
        archived: 'bg-gray-100 text-gray-600 border-gray-200',

        // Order/Quote statuses
        confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
        processing: 'bg-orange-100 text-orange-800 border-orange-200',
        shipped: 'bg-purple-100 text-purple-800 border-purple-200',
        delivered: 'bg-green-100 text-green-800 border-green-200',
        cancelled: 'bg-red-100 text-red-800 border-red-200',
        quoted: 'bg-blue-100 text-blue-800 border-blue-200',
        approved: 'bg-green-100 text-green-800 border-green-200',
        rejected: 'bg-red-100 text-red-800 border-red-200',

        // Inventory statuses
        in_stock: 'bg-green-100 text-green-800 border-green-200',
        low_stock: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        out_of_stock: 'bg-red-100 text-red-800 border-red-200',
        reserved: 'bg-blue-100 text-blue-800 border-blue-200',

        // Payment statuses
        paid: 'bg-green-100 text-green-800 border-green-200',
        overdue: 'bg-red-100 text-red-800 border-red-200',
        refunded: 'bg-gray-100 text-gray-800 border-gray-200',

        // Content statuses
        published: 'bg-green-100 text-green-800 border-green-200',
        draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',

        // Security levels
        low: 'bg-green-100 text-green-800 border-green-200',
        medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        high: 'bg-orange-100 text-orange-800 border-orange-200',
        critical: 'bg-red-100 text-red-800 border-red-200',

        // Market positions
        premium: 'bg-purple-100 text-purple-800 border-purple-200',
        competitive: 'bg-blue-100 text-blue-800 border-blue-200',
        value: 'bg-green-100 text-green-800 border-green-200',

        // Trends
        up: 'bg-green-100 text-green-800 border-green-200',
        down: 'bg-red-100 text-red-800 border-red-200',
        stable: 'bg-gray-100 text-gray-800 border-gray-200',

        // Boolean states
        enabled: 'bg-green-100 text-green-800 border-green-200',
        disabled: 'bg-gray-100 text-gray-800 border-gray-200',
        online: 'bg-green-100 text-green-800 border-green-200',
        offline: 'bg-red-100 text-red-800 border-red-200',

        // Quality/Performance
        excellent: 'bg-green-100 text-green-800 border-green-200',
        good: 'bg-blue-100 text-blue-800 border-blue-200',
        fair: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        poor: 'bg-red-100 text-red-800 border-red-200',

        // Custom variants
        new: 'bg-blue-100 text-blue-800 border-blue-200',
        featured: 'bg-amber-100 text-amber-800 border-amber-200',
        recommended: 'bg-green-100 text-green-800 border-green-200',
        deprecated: 'bg-red-100 text-red-800 border-red-200',
        beta: 'bg-purple-100 text-purple-800 border-purple-200',

        // Default
        default: 'bg-gray-100 text-gray-800 border-gray-200',
      },
      size: {
        xs: 'px-1.5 py-0.5 text-xs',
        sm: 'px-2 py-1 text-xs',
        md: 'px-2.5 py-1 text-sm',
        lg: 'px-3 py-1.5 text-sm',
        xl: 'px-4 py-2 text-base',
      },
      variant: {
        default: 'border',
        solid: 'border-transparent',
        outline: 'bg-transparent border-2',
        ghost: 'border-transparent bg-transparent',
      },
    },
    defaultVariants: {
      status: 'default',
      size: 'sm',
      variant: 'default',
    },
  }
);

// Icon mapping for different statuses
const statusIcons = {
  // General statuses
  active: CheckCircle,
  inactive: XCircle,
  pending: Clock,
  expired: XCircle,
  archived: Archive,

  // Order/Quote statuses
  confirmed: CheckCircle,
  processing: RefreshCw,
  shipped: Activity,
  delivered: CheckCircle,
  cancelled: XCircle,
  quoted: Eye,
  approved: CheckCircle,
  rejected: XCircle,

  // Inventory statuses
  in_stock: CheckCircle,
  low_stock: AlertTriangle,
  out_of_stock: XCircle,
  reserved: Archive,

  // Payment statuses
  paid: CheckCircle,
  overdue: AlertTriangle,
  refunded: RefreshCw,

  // Content statuses
  published: CheckCircle,
  draft: Clock,

  // Security levels
  low: Shield,
  medium: Shield,
  high: Shield,
  critical: AlertTriangle,

  // Market positions
  premium: Star,
  competitive: Target,
  value: DollarSign,

  // Trends
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,

  // Boolean states
  enabled: CheckCircle,
  disabled: XCircle,
  online: CheckCircle,
  offline: XCircle,

  // Quality/Performance
  excellent: Star,
  good: CheckCircle,
  fair: AlertTriangle,
  poor: XCircle,

  // Custom variants
  new: Star,
  featured: Star,
  recommended: CheckCircle,
  deprecated: AlertTriangle,
  beta: Zap,

  // Default
  default: Info,
} as const;

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof statusBadgeVariants> {
  status: keyof typeof statusIcons;
  label?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  pulse?: boolean;
  tooltip?: string;
}

export const StatusBadge = React.forwardRef<HTMLSpanElement, StatusBadgeProps>(
  (
    {
      className,
      status,
      label,
      showIcon = true,
      icon,
      size,
      variant,
      pulse = false,
      tooltip,
      ...props
    },
    ref
  ) => {
    const IconComponent = statusIcons[status] || statusIcons.default;
    const displayIcon =
      icon || (showIcon && <IconComponent className="h-3 w-3" />);

    // Generate label if not provided
    const displayLabel =
      label || status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    const badgeContent = (
      <span
        ref={ref}
        className={cn(
          statusBadgeVariants({ status, size, variant }),
          pulse && 'animate-pulse',
          className
        )}
        title={tooltip || displayLabel}
        {...props}
      >
        {displayIcon}
        <span>{displayLabel}</span>
      </span>
    );

    return badgeContent;
  }
);

StatusBadge.displayName = 'StatusBadge';

// Preset status badge components for common use cases
export const OrderStatusBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status:
      | 'pending'
      | 'confirmed'
      | 'processing'
      | 'shipped'
      | 'delivered'
      | 'cancelled';
  }
> = props => <StatusBadge {...props} />;

export const PaymentStatusBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status: 'pending' | 'paid' | 'overdue' | 'refunded';
  }
> = props => <StatusBadge {...props} />;

export const InventoryStatusBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'reserved';
  }
> = props => <StatusBadge {...props} />;

export const SecurityLevelBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status: 'low' | 'medium' | 'high' | 'critical';
  }
> = props => <StatusBadge {...props} />;

export const ContentStatusBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status: 'published' | 'draft' | 'archived';
  }
> = props => <StatusBadge {...props} />;

export const TrendBadge: React.FC<
  Omit<StatusBadgeProps, 'status'> & {
    status: 'up' | 'down' | 'stable';
  }
> = props => <StatusBadge {...props} />;

export default StatusBadge;