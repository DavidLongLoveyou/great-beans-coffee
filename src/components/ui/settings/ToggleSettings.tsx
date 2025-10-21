'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  Check,
  X,
  AlertTriangle,
  Info,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Shield,
  ShieldOff,
  Zap,
  ZapOff,
  Globe,
  Mail,
  MailX,
  Smartphone,
  PhoneOff,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Switch } from '@/presentation/components/ui/switch';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import { Label } from '@/presentation/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/presentation/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';

const toggleSettingsVariants = cva(
  'flex items-start justify-between gap-4 p-4 rounded-lg transition-colors',
  {
    variants: {
      variant: {
        default: 'hover:bg-gray-50 dark:hover:bg-gray-900/50',
        card: 'border bg-card text-card-foreground shadow-sm',
        outlined: 'border-2',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        danger:
          'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/50',
        warning:
          'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/50',
        success:
          'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/50',
        info: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/50',
      },
      size: {
        sm: 'p-3 text-sm',
        md: 'p-4',
        lg: 'p-6 text-lg',
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
  }
);

export interface ToggleSettingsAction {
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

export interface ToggleSettingsProps
  extends VariantProps<typeof toggleSettingsVariants> {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;

  // Visual customization
  icon?: React.ReactNode;
  checkedIcon?: React.ReactNode;
  uncheckedIcon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };

  // Behavior
  disabled?: boolean;
  loading?: boolean;
  requiresConfirmation?: boolean;
  confirmationTitle?: string;
  confirmationDescription?: string;
  confirmationAction?: string;

  // Security & Privacy
  sensitive?: boolean;
  requiresAuth?: boolean;
  securityLevel?: 'low' | 'medium' | 'high' | 'critical';

  // Categorization
  category?:
    | 'general'
    | 'security'
    | 'privacy'
    | 'notifications'
    | 'appearance'
    | 'advanced'
    | 'integrations';
  type?:
    | 'feature'
    | 'permission'
    | 'notification'
    | 'security'
    | 'privacy'
    | 'preference';

  // Additional actions
  actions?: ToggleSettingsAction[];
  helpText?: string;
  learnMoreUrl?: string;

  // State indicators
  isNew?: boolean;
  isRecommended?: boolean;
  isDeprecated?: boolean;
  hasChanges?: boolean;

  // Dependencies
  dependsOn?: string[];
  affects?: string[];

  // Accessibility
  'aria-label'?: string;
  'aria-describedby'?: string;
}

const getCategoryIcon = (
  category: ToggleSettingsProps['category'],
  checked: boolean
) => {
  const iconClass = 'h-4 w-4';

  switch (category) {
    case 'security':
      return checked ? (
        <Shield className={iconClass} />
      ) : (
        <ShieldOff className={iconClass} />
      );
    case 'privacy':
      return checked ? (
        <Lock className={iconClass} />
      ) : (
        <Unlock className={iconClass} />
      );
    case 'notifications':
      return checked ? (
        <Bell className={iconClass} />
      ) : (
        <BellOff className={iconClass} />
      );
    case 'appearance':
      return checked ? (
        <Eye className={iconClass} />
      ) : (
        <EyeOff className={iconClass} />
      );
    case 'advanced':
      return checked ? (
        <Zap className={iconClass} />
      ) : (
        <ZapOff className={iconClass} />
      );
    case 'integrations':
      return checked ? (
        <Globe className={iconClass} />
      ) : (
        <Globe className={iconClass} />
      );
    default:
      return checked ? (
        <Check className={iconClass} />
      ) : (
        <X className={iconClass} />
      );
  }
};

const getTypeIcon = (type: ToggleSettingsProps['type'], checked: boolean) => {
  const iconClass = 'h-4 w-4';

  switch (type) {
    case 'notification':
      return checked ? (
        <Bell className={iconClass} />
      ) : (
        <BellOff className={iconClass} />
      );
    case 'security':
      return checked ? (
        <Shield className={iconClass} />
      ) : (
        <ShieldOff className={iconClass} />
      );
    case 'privacy':
      return checked ? (
        <Lock className={iconClass} />
      ) : (
        <Unlock className={iconClass} />
      );
    case 'permission':
      return checked ? (
        <Check className={iconClass} />
      ) : (
        <X className={iconClass} />
      );
    default:
      return null;
  }
};

const getSecurityLevelColor = (level: ToggleSettingsProps['securityLevel']) => {
  switch (level) {
    case 'low':
      return 'text-green-600 dark:text-green-400';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400';
    case 'high':
      return 'text-orange-600 dark:text-orange-400';
    case 'critical':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};

export const ToggleSettings: React.FC<ToggleSettingsProps> = ({
  id,
  label,
  description,
  checked,
  onCheckedChange,
  className,
  variant = 'default',
  size = 'md',
  state = 'default',
  icon,
  checkedIcon,
  uncheckedIcon,
  badge,
  disabled = false,
  loading = false,
  requiresConfirmation = false,
  confirmationTitle,
  confirmationDescription,
  confirmationAction,
  sensitive = false,
  requiresAuth = false,
  securityLevel,
  category,
  type,
  actions = [],
  helpText,
  learnMoreUrl,
  isNew = false,
  isRecommended = false,
  isDeprecated = false,
  hasChanges = false,
  dependsOn = [],
  affects = [],
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}) => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [pendingValue, setPendingValue] = React.useState<boolean | null>(null);

  const handleToggleChange = (newValue: boolean) => {
    if (requiresConfirmation && newValue !== checked) {
      setPendingValue(newValue);
      setShowConfirmation(true);
    } else {
      onCheckedChange(newValue);
    }
  };

  const handleConfirm = () => {
    if (pendingValue !== null) {
      onCheckedChange(pendingValue);
      setPendingValue(null);
    }
    setShowConfirmation(false);
  };

  const handleCancel = () => {
    setPendingValue(null);
    setShowConfirmation(false);
  };

  const displayIcon =
    icon ||
    (checkedIcon && uncheckedIcon
      ? checked
        ? checkedIcon
        : uncheckedIcon
      : null) ||
    (category ? getCategoryIcon(category, checked) : null) ||
    (type ? getTypeIcon(type, checked) : null);

  const isDisabled = disabled || loading || state === 'disabled';

  return (
    <TooltipProvider>
      <div
        className={cn(
          toggleSettingsVariants({ variant, size, state }),
          isDisabled && 'pointer-events-none opacity-60',
          className
        )}
        {...props}
      >
        <div className="min-w-0 flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-start gap-3">
            {displayIcon && (
              <div
                className={cn(
                  'mt-0.5 flex-shrink-0',
                  securityLevel && getSecurityLevelColor(securityLevel)
                )}
              >
                {displayIcon}
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Label
                  htmlFor={id}
                  className={cn(
                    'cursor-pointer font-medium leading-tight',
                    isDisabled && 'cursor-not-allowed'
                  )}
                >
                  {label}
                </Label>

                {/* Badges */}
                {badge && (
                  <Badge
                    variant={badge.variant || 'secondary'}
                    className="text-xs"
                  >
                    {badge.text}
                  </Badge>
                )}

                {isNew && (
                  <Badge variant="default" className="text-xs">
                    NEW
                  </Badge>
                )}

                {isRecommended && (
                  <Badge
                    variant="outline"
                    className="border-green-600 text-xs text-green-600"
                  >
                    RECOMMENDED
                  </Badge>
                )}

                {isDeprecated && (
                  <Badge variant="destructive" className="text-xs">
                    DEPRECATED
                  </Badge>
                )}

                {hasChanges && (
                  <Badge
                    variant="outline"
                    className="border-blue-600 text-xs text-blue-600"
                  >
                    MODIFIED
                  </Badge>
                )}

                {securityLevel && (
                  <Badge
                    variant={
                      securityLevel === 'critical' || securityLevel === 'high'
                        ? 'destructive'
                        : 'outline'
                    }
                    className="text-xs"
                  >
                    {securityLevel.toUpperCase()}
                  </Badge>
                )}

                {sensitive && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        <Lock className="mr-1 h-3 w-3" />
                        SENSITIVE
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This setting contains sensitive information</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                {requiresAuth && (
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="text-xs">
                        <Shield className="mr-1 h-3 w-3" />
                        AUTH REQUIRED
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Authentication required to change this setting</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>

              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}

              {helpText && (
                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                  <Info className="h-4 w-4" />
                  <span>{helpText}</span>
                </div>
              )}

              {/* Dependencies */}
              {dependsOn.length > 0 && (
                <div className="mt-2 text-xs text-muted-foreground">
                  <span>Depends on: {dependsOn.join(', ')}</span>
                </div>
              )}

              {affects.length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  <span>Affects: {affects.join(', ')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {actions.map(action => (
                <Button
                  key={action.id}
                  variant={action.variant || 'ghost'}
                  size={action.size || 'sm'}
                  onClick={action.onClick}
                  disabled={action.disabled || action.loading}
                  className="h-7 text-xs"
                >
                  {action.loading && (
                    <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
                  {action.icon}
                  {action.label}
                </Button>
              ))}

              {learnMoreUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(learnMoreUrl, '_blank')}
                  className="h-7 text-xs"
                >
                  Learn More
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Toggle Switch */}
        <div className="flex-shrink-0">
          <Switch
            id={id}
            checked={checked}
            onCheckedChange={handleToggleChange}
            disabled={isDisabled}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
          />
          {loading && (
            <div className="ml-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
          )}
        </div>

        {/* Confirmation Dialog */}
        {requiresConfirmation && (
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {confirmationTitle ||
                    `${pendingValue ? 'Enable' : 'Disable'} ${label}?`}
                </DialogTitle>
                <DialogDescription>
                  {confirmationDescription ||
                    `Are you sure you want to ${pendingValue ? 'enable' : 'disable'} this setting? This action may affect your account security and functionality.`}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirm}
                  variant={pendingValue ? 'default' : 'destructive'}
                >
                  {confirmationAction || (pendingValue ? 'Enable' : 'Disable')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </TooltipProvider>
  );
};

// Preset toggle settings components
export const SecurityToggle: React.FC<
  Omit<ToggleSettingsProps, 'category' | 'type'>
> = props => <ToggleSettings {...props} category="security" type="security" />;

export const PrivacyToggle: React.FC<
  Omit<ToggleSettingsProps, 'category' | 'type'>
> = props => <ToggleSettings {...props} category="privacy" type="privacy" />;

export const NotificationToggle: React.FC<
  Omit<ToggleSettingsProps, 'category' | 'type'>
> = props => (
  <ToggleSettings {...props} category="notifications" type="notification" />
);

export const FeatureToggle: React.FC<
  Omit<ToggleSettingsProps, 'type'>
> = props => <ToggleSettings {...props} type="feature" />;

export const PermissionToggle: React.FC<
  Omit<ToggleSettingsProps, 'type'>
> = props => <ToggleSettings {...props} type="permission" />;

export const PreferenceToggle: React.FC<
  Omit<ToggleSettingsProps, 'type'>
> = props => <ToggleSettings {...props} type="preference" />;

export default ToggleSettings;
