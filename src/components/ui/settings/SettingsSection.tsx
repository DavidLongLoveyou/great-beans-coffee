'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  Lock,
  Users,
  Globe,
  Bell,
  Shield,
  Palette,
  Database,
  Zap,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/presentation/components/ui/collapsible';

const settingsSectionVariants = cva('space-y-4', {
  variants: {
    variant: {
      default: '',
      card: 'p-6 rounded-lg border bg-card text-card-foreground shadow-sm',
      outlined: 'p-6 rounded-lg border-2',
      ghost: 'p-4',
      compact: 'space-y-2',
    },
    spacing: {
      none: 'space-y-0',
      sm: 'space-y-2',
      md: 'space-y-4',
      lg: 'space-y-6',
      xl: 'space-y-8',
    },
    level: {
      1: '',
      2: 'ml-4',
      3: 'ml-8',
      4: 'ml-12',
    },
  },
  defaultVariants: {
    variant: 'default',
    spacing: 'md',
    level: 1,
  },
});

const sectionHeaderVariants = cva('flex items-center justify-between', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
    },
    sticky: {
      true: 'sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    sticky: false,
  },
});

export interface SettingsSectionAction {
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

export interface SettingsSectionProps
  extends VariantProps<typeof settingsSectionVariants> {
  id?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;

  // Header customization
  headerSize?: 'sm' | 'md' | 'lg' | 'xl';
  headerActions?: SettingsSectionAction[];
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };

  // Behavior
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;

  // Layout
  showSeparator?: boolean;
  separatorPosition?: 'top' | 'bottom' | 'both';
  sticky?: boolean;

  // Categorization
  category?:
    | 'general'
    | 'security'
    | 'privacy'
    | 'notifications'
    | 'appearance'
    | 'advanced'
    | 'integrations'
    | 'billing';
  priority?: 'low' | 'medium' | 'high' | 'critical';

  // State
  disabled?: boolean;
  loading?: boolean;
  error?: string;

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
  role?: string;
}

const getCategoryIcon = (category: SettingsSectionProps['category']) => {
  switch (category) {
    case 'general':
      return <Settings className="h-4 w-4" />;
    case 'security':
      return <Shield className="h-4 w-4" />;
    case 'privacy':
      return <Lock className="h-4 w-4" />;
    case 'notifications':
      return <Bell className="h-4 w-4" />;
    case 'appearance':
      return <Palette className="h-4 w-4" />;
    case 'advanced':
      return <Zap className="h-4 w-4" />;
    case 'integrations':
      return <Globe className="h-4 w-4" />;
    case 'billing':
      return <Database className="h-4 w-4" />;
    default:
      return <Settings className="h-4 w-4" />;
  }
};

const getPriorityColor = (priority: SettingsSectionProps['priority']) => {
  switch (priority) {
    case 'low':
      return 'text-gray-600 dark:text-gray-400';
    case 'medium':
      return 'text-blue-600 dark:text-blue-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  id,
  title,
  description,
  icon,
  className,
  children,
  variant = 'default',
  spacing = 'md',
  level = 1,
  headerSize = 'md',
  headerActions = [],
  badge,
  collapsible = false,
  defaultCollapsed = false,
  onCollapsedChange,
  showSeparator = false,
  separatorPosition = 'bottom',
  sticky = false,
  category,
  priority,
  disabled = false,
  loading = false,
  error,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  role = 'region',
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const handleCollapsedChange = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapsedChange?.(collapsed);
  };

  const toggleCollapsed = () => {
    handleCollapsedChange(!isCollapsed);
  };

  const displayIcon = icon || (category ? getCategoryIcon(category) : null);

  const sectionContent = (
    <div
      className={cn(
        settingsSectionVariants({ variant, spacing, level }),
        disabled && 'pointer-events-none opacity-60',
        className
      )}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      {...props}
    >
      {/* Top Separator */}
      {showSeparator &&
        (separatorPosition === 'top' || separatorPosition === 'both') && (
          <Separator />
        )}

      {/* Header */}
      {(title || headerActions.length > 0) && (
        <div
          className={cn(sectionHeaderVariants({ size: headerSize, sticky }))}
        >
          <div className="flex min-w-0 flex-1 items-center gap-3">
            {displayIcon && (
              <div
                className={cn(
                  'flex-shrink-0',
                  priority && getPriorityColor(priority)
                )}
              >
                {displayIcon}
              </div>
            )}

            {title && (
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3
                    className={cn(
                      'font-semibold leading-tight',
                      headerSize === 'sm' && 'text-sm',
                      headerSize === 'md' && 'text-base',
                      headerSize === 'lg' && 'text-lg',
                      headerSize === 'xl' && 'text-xl',
                      priority && getPriorityColor(priority)
                    )}
                  >
                    {title}
                  </h3>

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

                {description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {description}
                  </p>
                )}

                {error && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Header Actions */}
          <div className="flex flex-shrink-0 items-center gap-2">
            {headerActions.map(action => (
              <Button
                key={action.id}
                variant={action.variant || 'ghost'}
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

            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCollapsed}
                className="h-8 w-8 p-0"
                aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
              >
                {isCollapsed ? (
                  <ChevronRight className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {collapsible ? (
        <Collapsible
          open={!isCollapsed}
          onOpenChange={(open: boolean) => handleCollapsedChange(!open)}
        >
          <CollapsibleContent className="space-y-4">
            {loading ? (
              <div className="space-y-4">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="h-4 w-2/3 rounded bg-gray-200"></div>
                </div>
              </div>
            ) : (
              children
            )}
          </CollapsibleContent>
        </Collapsible>
      ) : (
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                <div className="h-4 w-1/2 rounded bg-gray-200"></div>
                <div className="h-4 w-2/3 rounded bg-gray-200"></div>
              </div>
            </div>
          ) : (
            children
          )}
        </div>
      )}

      {/* Bottom Separator */}
      {showSeparator &&
        (separatorPosition === 'bottom' || separatorPosition === 'both') && (
          <Separator />
        )}
    </div>
  );

  return sectionContent;
};

// Preset settings section components
export const GeneralSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="general" />;

export const SecuritySettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="security" />;

export const PrivacySettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="privacy" />;

export const NotificationSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="notifications" />;

export const AppearanceSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="appearance" />;

export const AdvancedSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="advanced" />;

export const IntegrationsSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="integrations" />;

export const BillingSettingsSection: React.FC<
  Omit<SettingsSectionProps, 'category'>
> = props => <SettingsSection {...props} category="billing" />;

export default SettingsSection;
