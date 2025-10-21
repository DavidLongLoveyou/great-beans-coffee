'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';

const securityAlertVariants = cva(
  'relative w-full rounded-lg border p-4 transition-all duration-200',
  {
    variants: {
      severity: {
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-100',
        warning:
          'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/50 dark:border-yellow-800 dark:text-yellow-100',
        error:
          'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/50 dark:border-red-800 dark:text-red-100',
        success:
          'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/50 dark:border-green-800 dark:text-green-100',
        critical:
          'bg-red-100 border-red-300 text-red-950 dark:bg-red-900/50 dark:border-red-700 dark:text-red-50 shadow-lg',
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
      },
    },
    defaultVariants: {
      severity: 'info',
      size: 'md',
      variant: 'bordered',
    },
  }
);

const securityAlertIconVariants = cva('flex-shrink-0', {
  variants: {
    severity: {
      info: 'text-blue-600 dark:text-blue-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
      success: 'text-green-600 dark:text-green-400',
      critical: 'text-red-700 dark:text-red-300',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    severity: 'info',
    size: 'md',
  },
});

interface SecurityAlertAction {
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
}

interface SecurityAlertProps
  extends VariantProps<typeof securityAlertVariants> {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: SecurityAlertAction[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  timestamp?: Date | string;
  source?: string;
  category?:
    | 'authentication'
    | 'authorization'
    | 'data'
    | 'system'
    | 'network'
    | 'compliance';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  persistent?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

const getDefaultIcon = (
  severity: SecurityAlertProps['severity'],
  category?: SecurityAlertProps['category']
) => {
  if (category) {
    switch (category) {
      case 'authentication':
        return severity === 'error' ? <ShieldX /> : <Shield />;
      case 'authorization':
        return severity === 'error' ? <ShieldAlert /> : <ShieldCheck />;
      case 'data':
        return severity === 'error' ? <EyeOff /> : <Eye />;
      default:
        break;
    }
  }

  switch (severity) {
    case 'info':
      return <Info />;
    case 'warning':
      return <AlertTriangle />;
    case 'error':
      return <XCircle />;
    case 'success':
      return <CheckCircle />;
    case 'critical':
      return <ShieldAlert />;
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

export const SecurityAlert: React.FC<SecurityAlertProps> = ({
  severity = 'info',
  size = 'md',
  variant = 'bordered',
  title,
  children,
  icon,
  className,
  dismissible = false,
  onDismiss,
  actions = [],
  badge,
  timestamp,
  source,
  category,
  priority,
  persistent = false,
  collapsible = false,
  defaultCollapsed = false,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isDismissed, setIsDismissed] = React.useState(false);

  const displayIcon = icon || getDefaultIcon(severity, category);

  const handleDismiss = () => {
    if (!persistent) {
      setIsDismissed(true);
      onDismiss?.();
    }
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
        securityAlertVariants({ severity, size, variant }),
        className
      )}
      role="alert"
      aria-live={severity === 'critical' ? 'assertive' : 'polite'}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={cn(securityAlertIconVariants({ severity, size }))}>
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
                    collapsible && 'cursor-pointer hover:underline'
                  )}
                  onClick={toggleCollapse}
                >
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
                  variant={
                    priority === 'critical' || priority === 'high'
                      ? 'destructive'
                      : 'outline'
                  }
                  className="text-xs"
                >
                  {priority.toUpperCase()}
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-1">
              {collapsible && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleCollapse}
                  className="h-6 w-6 p-0 hover:bg-transparent"
                >
                  <span
                    className={cn(
                      'transition-transform duration-200',
                      isCollapsed ? 'rotate-0' : 'rotate-90'
                    )}
                  >
                    ▶
                  </span>
                </Button>
              )}

              {dismissible && !persistent && (
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

          {/* Metadata */}
          {(timestamp || source || category) && !isCollapsed && (
            <div className="mb-2 flex items-center gap-3 text-xs opacity-75">
              {timestamp && <span>{formatTimestamp(timestamp)}</span>}
              {source && <span>Source: {source}</span>}
              {category && <span>Category: {category}</span>}
            </div>
          )}

          {/* Content */}
          {!isCollapsed && (
            <div className="mb-3 text-sm leading-relaxed">{children}</div>
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
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    action.label
                  )}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Preset security alert components
export const AuthenticationAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="authentication" />;

export const AuthorizationAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="authorization" />;

export const DataSecurityAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="data" />;

export const SystemSecurityAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="system" />;

export const NetworkSecurityAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="network" />;

export const ComplianceAlert: React.FC<
  Omit<SecurityAlertProps, 'category'>
> = props => <SecurityAlert {...props} category="compliance" />;

export type { SecurityAlertAction, SecurityAlertProps };
export default SecurityAlert;
