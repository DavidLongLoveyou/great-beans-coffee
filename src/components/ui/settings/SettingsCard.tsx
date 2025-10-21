'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronDown,
  ChevronUp,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';

const settingsCardVariants = cva('transition-all duration-200', {
  variants: {
    variant: {
      default: 'border-border',
      elevated: 'shadow-md border-border',
      outlined: 'border-2 border-border',
      ghost: 'border-transparent shadow-none',
      danger:
        'border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20',
      warning:
        'border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20',
      success:
        'border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20',
      info: 'border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20',
    },
    size: {
      sm: 'text-sm',
      md: '',
      lg: 'text-lg',
    },
    state: {
      default: '',
      disabled: 'opacity-60 pointer-events-none',
      loading: 'opacity-75',
      error: 'border-red-300 dark:border-red-700',
      success: 'border-green-300 dark:border-green-700',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'md',
    state: 'default',
  },
});

export interface SettingsAction {
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

export interface SettingsCardProps
  extends VariantProps<typeof settingsCardVariants> {
  id?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;

  // Header customization
  headerActions?: SettingsAction[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  status?: {
    type: 'info' | 'warning' | 'error' | 'success';
    message: string;
  };

  // Behavior
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  // Footer
  footerActions?: SettingsAction[];
  showSeparator?: boolean;

  // Security & Privacy
  sensitive?: boolean;
  requiresAuth?: boolean;

  // Metadata
  lastModified?: Date | string;
  modifiedBy?: string;

  // Loading & Error states
  loading?: boolean;
  error?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const getStatusIcon = (
  type: NonNullable<SettingsCardProps['status']>['type']
) => {
  switch (type) {
    case 'info':
      return <Info className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    case 'error':
      return <AlertTriangle className="h-4 w-4" />;
    case 'success':
      return <CheckCircle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getStatusColor = (
  type: NonNullable<SettingsCardProps['status']>['type']
) => {
  switch (type) {
    case 'info':
      return 'text-blue-600 dark:text-blue-400';
    case 'warning':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'error':
      return 'text-red-600 dark:text-red-400';
    case 'success':
      return 'text-green-600 dark:text-green-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
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

export const SettingsCard: React.FC<SettingsCardProps> = ({
  id,
  title,
  description,
  icon,
  className,
  children,
  variant = 'default',
  size = 'md',
  state = 'default',
  headerActions = [],
  badge,
  status,
  collapsible = false,
  defaultCollapsed = false,
  onCollapsedChange,
  footerActions = [],
  showSeparator = true,
  sensitive = false,
  requiresAuth = false,
  lastModified,
  modifiedBy,
  loading = false,
  error,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [isBlurred, setIsBlurred] = React.useState(sensitive);

  const handleCollapsedChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  const toggleCollapsed = () => {
    handleCollapsedChange(!isCollapsed);
  };

  const toggleBlur = () => {
    setIsBlurred(!isBlurred);
  };

  const cardVariant = error
    ? 'danger'
    : status
      ? status.type === 'error'
        ? 'danger'
        : status.type
      : variant;
  const cardState = loading ? 'loading' : state;

  return (
    <Card
      className={cn(
        settingsCardVariants({ variant: cardVariant, size, state: cardState }),
        className
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      {...props}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {icon && (
              <div className="mt-0.5 flex-shrink-0">
                {React.cloneElement(icon as React.ReactElement, {
                  className: cn('h-5 w-5', (icon as any).props?.className),
                })}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle
                  className={cn(
                    'leading-tight',
                    size === 'sm' && 'text-base',
                    size === 'lg' && 'text-xl'
                  )}
                >
                  {title}
                </CardTitle>

                {badge && (
                  <Badge
                    variant={badge.variant || 'secondary'}
                    className="text-xs"
                  >
                    {badge.text}
                  </Badge>
                )}

                {requiresAuth && (
                  <Lock
                    className="h-4 w-4 text-gray-500"
                    aria-label="Requires authentication"
                  />
                )}

                {sensitive && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBlur}
                    className="h-6 w-6 p-0"
                    title={
                      isBlurred
                        ? 'Show sensitive content'
                        : 'Hide sensitive content'
                    }
                  >
                    {isBlurred ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </div>

              {description && (
                <CardDescription className="mt-1">
                  {description}
                </CardDescription>
              )}

              {status && (
                <div
                  className={cn(
                    'mt-2 flex items-center gap-2 text-sm',
                    getStatusColor(status.type)
                  )}
                >
                  {getStatusIcon(status.type)}
                  <span>{status.message}</span>
                </div>
              )}

              {error && (
                <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            {headerActions.length > 0 && (
              <div className="flex items-center gap-1">
                {headerActions.slice(0, 2).map(action => (
                  <Button
                    key={action.id}
                    variant={action.variant || 'ghost'}
                    size={action.size || 'sm'}
                    onClick={action.onClick}
                    disabled={action.disabled || action.loading}
                    className="h-8"
                  >
                    {action.loading && (
                      <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    )}
                    {action.icon}
                    {action.label}
                  </Button>
                ))}

                {headerActions.length > 2 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {headerActions.slice(2).map(action => (
                        <DropdownMenuItem
                          key={action.id}
                          onClick={action.onClick}
                          disabled={Boolean(action.disabled || action.loading)}
                        >
                          {action.icon && (
                            <span className="mr-2">{action.icon}</span>
                          )}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            )}

            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapsed}
                className="h-8 w-8 p-0"
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >
                {isCollapsed ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronUp className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Metadata */}
        {(lastModified || modifiedBy) && (
          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
            {lastModified && (
              <span>Last modified: {formatTimestamp(lastModified)}</span>
            )}
            {modifiedBy && <span>by {modifiedBy}</span>}
          </div>
        )}
      </CardHeader>

      {!isCollapsed && (
        <>
          <CardContent
            className={cn(
              'pt-0',
              isBlurred && 'blur-sm filter transition-all duration-200'
            )}
          >
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                </div>
              </div>
            ) : (
              children
            )}
          </CardContent>

          {footerActions.length > 0 && (
            <>
              {showSeparator && <Separator />}
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {footerActions.map(action => (
                      <Button
                        key={action.id}
                        variant={action.variant || 'outline'}
                        size={action.size || 'sm'}
                        onClick={action.onClick}
                        disabled={action.disabled || action.loading}
                      >
                        {action.loading && (
                          <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        )}
                        {action.icon}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </>
      )}
    </Card>
  );
};

// Preset settings card components
export const SecuritySettingsCard: React.FC<
  Omit<SettingsCardProps, 'icon' | 'variant'>
> = props => (
  <SettingsCard
    {...props}
    icon={<Lock />}
    variant="outlined"
    requiresAuth
    sensitive
  />
);

export const GeneralSettingsCard: React.FC<
  Omit<SettingsCardProps, 'icon'>
> = props => <SettingsCard {...props} icon={<Settings />} />;

export const InfoSettingsCard: React.FC<
  Omit<SettingsCardProps, 'variant'>
> = props => <SettingsCard {...props} variant="info" />;

export const DangerSettingsCard: React.FC<
  Omit<SettingsCardProps, 'variant'>
> = props => <SettingsCard {...props} variant="danger" />;

export default SettingsCard;
