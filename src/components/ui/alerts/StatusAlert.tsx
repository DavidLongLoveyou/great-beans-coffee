'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Clock,
  Loader2,
  TrendingUp,
  TrendingDown,
  Zap,
  AlertCircle,
  X,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Progress } from '@/presentation/components/ui/progress';

const statusAlertVariants = cva(
  'relative w-full rounded-lg border transition-all duration-200',
  {
    variants: {
      status: {
        success:
          'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-800 dark:text-green-100',
        error:
          'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100',
        warning:
          'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-100',
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100',
        pending:
          'bg-gray-50 border-gray-200 text-gray-900 dark:bg-gray-950/50 dark:border-gray-800 dark:text-gray-100',
        loading:
          'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100',
        neutral:
          'bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-950/50 dark:border-slate-800 dark:text-slate-100',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4',
        lg: 'p-6 text-lg',
      },
      variant: {
        default: '',
        bordered: 'border-l-4',
        filled: 'border-0 shadow-md',
        outlined: 'bg-transparent border-2',
        minimal: 'border-0 bg-transparent p-2',
      },
      animation: {
        none: '',
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        fade: 'animate-in fade-in duration-500',
        slide: 'animate-in slide-in-from-top-2 duration-300',
      },
    },
    defaultVariants: {
      status: 'info',
      size: 'md',
      variant: 'bordered',
      animation: 'none',
    },
  }
);

const statusIconVariants = cva('flex-shrink-0', {
  variants: {
    status: {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
      pending: 'text-gray-600 dark:text-gray-400',
      loading: 'text-blue-600 dark:text-blue-400',
      neutral: 'text-slate-600 dark:text-slate-400',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    status: 'info',
    size: 'md',
  },
});

interface StatusAlertAction {
  id: string;
  label: string;
  onClick: () => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
}

interface StatusAlertProps extends VariantProps<typeof statusAlertVariants> {
  status?:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'pending'
    | 'loading'
    | 'neutral';
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: StatusAlertAction[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  timestamp?: Date | string;
  progress?: {
    value: number;
    max?: number;
    label?: string;
    showPercentage?: boolean;
  };
  metadata?: Array<{
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }>;
  autoHide?: {
    delay: number;
    onAutoHide?: () => void;
  };
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  trend?: 'up' | 'down' | 'neutral';
  priority?: 'low' | 'medium' | 'high';
}

const getDefaultIcon = (
  status:
    | 'success'
    | 'error'
    | 'warning'
    | 'info'
    | 'pending'
    | 'loading'
    | 'neutral'
    | null
    | undefined,
  trend?: StatusAlertProps['trend']
) => {
  if (status === 'loading') {
    return <Loader2 className="animate-spin" />;
  }

  if (trend) {
    switch (trend) {
      case 'up':
        return <TrendingUp />;
      case 'down':
        return <TrendingDown />;
      default:
        break;
    }
  }

  switch (status as string) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <XCircle />;
    case 'warning':
      return <AlertTriangle />;
    case 'info':
      return <Info />;
    case 'pending':
      return <Clock />;
    case 'loading':
      return <Loader2 className="animate-spin" />;
    case 'neutral':
      return <AlertCircle />;
    default:
      return <Info />;
  }
};

const formatTimestamp = (timestamp: Date | string) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const StatusAlert: React.FC<StatusAlertProps> = ({
  status = 'info',
  size = 'md',
  variant = 'bordered',
  animation = 'none',
  title,
  children,
  icon,
  className,
  dismissible = false,
  onDismiss,
  actions = [],
  badge,
  timestamp,
  progress,
  metadata = [],
  autoHide,
  collapsible = false,
  defaultCollapsed = false,
  trend,
  priority,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isDismissed, setIsDismissed] = React.useState(false);

  const displayIcon = icon || getDefaultIcon(status, trend);

  // Auto-hide functionality
  React.useEffect(() => {
    if (autoHide && !isDismissed) {
      const timer = setTimeout(() => {
        setIsDismissed(true);
        autoHide.onAutoHide?.();
        onDismiss?.();
      }, autoHide.delay);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [autoHide, isDismissed, onDismiss]);

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={cn(
        statusAlertVariants({ status, size, variant, animation }),
        className
      )}
      role="alert"
      aria-live={status === 'error' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(statusIconVariants({ status, size }))}>
          {displayIcon}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-2 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {title && (
                <h4
                  className={cn(
                    'font-semibold leading-tight',
                    collapsible &&
                      'flex cursor-pointer items-center gap-1 hover:underline'
                  )}
                  onClick={toggleCollapse}
                >
                  {collapsible &&
                    (isCollapsed ? (
                      <ChevronRight className="h-3 w-3" />
                    ) : (
                      <ChevronDown className="h-3 w-3" />
                    ))}
                  {title}
                </h4>
              )}

              {badge && (
                <Badge
                  variant={badge.variant || 'secondary'}
                  className="text-xs"
                >
                  {badge.text}
                </Badge>
              )}

              {priority && priority !== 'medium' && (
                <Badge
                  variant={priority === 'high' ? 'destructive' : 'outline'}
                  className="text-xs"
                >
                  {priority.toUpperCase()}
                </Badge>
              )}

              {trend && (
                <Badge
                  variant={
                    trend === 'up'
                      ? 'default'
                      : trend === 'down'
                        ? 'destructive'
                        : 'secondary'
                  }
                  className="text-xs"
                >
                  <Zap className="mr-1 h-3 w-3" />
                  {trend.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {timestamp && (
                <span className="text-xs opacity-75">
                  {formatTimestamp(timestamp)}
                </span>
              )}

              {dismissible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 opacity-70 hover:bg-transparent hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress */}
          {progress && !isCollapsed && (
            <div className="mb-3">
              <div className="mb-1 flex items-center justify-between text-xs">
                {progress.label && <span>{progress.label}</span>}
                {progress.showPercentage && (
                  <span>
                    {Math.round((progress.value / (progress.max || 100)) * 100)}
                    %
                  </span>
                )}
              </div>
              <Progress
                value={progress.value}
                max={progress.max || 100}
                className="h-2"
              />
            </div>
          )}

          {/* Content */}
          {!isCollapsed && (
            <div className="mb-3 text-sm leading-relaxed">{children}</div>
          )}

          {/* Metadata */}
          {metadata.length > 0 && !isCollapsed && (
            <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {metadata.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {item.icon && <span className="opacity-75">{item.icon}</span>}
                  <span className="opacity-75">{item.label}:</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions.length > 0 && !isCollapsed && (
            <div className="flex flex-wrap items-center gap-2">
              {actions.map(action => (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  size={action.size || 'sm'}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className="text-xs"
                >
                  {action.loading ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : action.icon ? (
                    <span className="mr-1">{action.icon}</span>
                  ) : null}
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Preset status alert components
export const SuccessAlert: React.FC<
  Omit<StatusAlertProps, 'status'>
> = props => <StatusAlert {...props} status="success" />;

export const ErrorAlert: React.FC<Omit<StatusAlertProps, 'status'>> = props => (
  <StatusAlert {...props} status="error" />
);

export const WarningAlert: React.FC<
  Omit<StatusAlertProps, 'status'>
> = props => <StatusAlert {...props} status="warning" />;

export const InfoAlert: React.FC<Omit<StatusAlertProps, 'status'>> = props => (
  <StatusAlert {...props} status="info" />
);

export const LoadingAlert: React.FC<
  Omit<StatusAlertProps, 'status'>
> = props => <StatusAlert {...props} status="loading" />;

export const PendingAlert: React.FC<
  Omit<StatusAlertProps, 'status'>
> = props => <StatusAlert {...props} status="pending" />;

// Specialized alerts for common use cases
export const ProcessingAlert: React.FC<
  Omit<StatusAlertProps, 'status' | 'icon'>
> = props => (
  <StatusAlert
    {...props}
    status="loading"
    icon={<Loader2 className="animate-spin" />}
  />
);

export const TrendAlert: React.FC<
  Omit<StatusAlertProps, 'trend'> & { trend: 'up' | 'down' | 'neutral' }
> = props => <StatusAlert {...props} />;

export type { StatusAlertAction, StatusAlertProps };
export default StatusAlert;
