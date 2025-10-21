'use client';

import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Bell,
  BellRing,
  Volume2,
  VolumeX,
  Clock,
  User,
  Mail,
  MessageSquare,
  Zap,
} from 'lucide-react';
import { cn } from '@/shared/utils';
import { Button } from '@/presentation/components/ui/button';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';

const notificationToastVariants = cva(
  'relative w-full max-w-md rounded-lg border shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      type: {
        success:
          'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/90 dark:border-green-800 dark:text-green-100',
        error:
          'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/90 dark:border-red-800 dark:text-red-100',
        warning:
          'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950/90 dark:border-yellow-800 dark:text-yellow-100',
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/90 dark:border-blue-800 dark:text-blue-100',
        default:
          'bg-white border-gray-200 text-gray-900 dark:bg-gray-950/90 dark:border-gray-800 dark:text-gray-100',
      },
      size: {
        sm: 'p-3 text-sm max-w-sm',
        md: 'p-4 max-w-md',
        lg: 'p-5 text-lg max-w-lg',
      },
      position: {
        'top-right': 'fixed top-4 right-4 z-50',
        'top-left': 'fixed top-4 left-4 z-50',
        'bottom-right': 'fixed bottom-4 right-4 z-50',
        'bottom-left': 'fixed bottom-4 left-4 z-50',
        'top-center': 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50',
        'bottom-center':
          'fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50',
        relative: 'relative',
      },
      animation: {
        none: '',
        'slide-in': 'animate-in slide-in-from-right-full duration-300',
        'slide-out': 'animate-out slide-out-to-right-full duration-300',
        'fade-in': 'animate-in fade-in duration-300',
        'fade-out': 'animate-out fade-out duration-300',
        bounce: 'animate-bounce',
        pulse: 'animate-pulse',
      },
    },
    defaultVariants: {
      type: 'default',
      size: 'md',
      position: 'relative',
      animation: 'none',
    },
  }
);

const notificationIconVariants = cva('flex-shrink-0', {
  variants: {
    type: {
      success: 'text-green-600 dark:text-green-400',
      error: 'text-red-600 dark:text-red-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      info: 'text-blue-600 dark:text-blue-400',
      default: 'text-gray-600 dark:text-gray-400',
    },
    size: {
      sm: 'h-4 w-4',
      md: 'h-5 w-5',
      lg: 'h-6 w-6',
    },
  },
  defaultVariants: {
    type: 'default',
    size: 'md',
  },
});

interface NotificationAction {
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

interface NotificationToastProps
  extends VariantProps<typeof notificationToastVariants> {
  id?: string;
  title?: string;
  message: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  actions?: NotificationAction[];
  timestamp?: Date | string;
  duration?: number; // Auto-dismiss duration in milliseconds
  persistent?: boolean; // Prevents auto-dismiss
  sound?: boolean; // Play notification sound
  avatar?: {
    src?: string;
    alt?: string;
    fallback?: string;
  };
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  category?:
    | 'system'
    | 'user'
    | 'security'
    | 'marketing'
    | 'update'
    | 'reminder';
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  interactive?: boolean;
  progress?: {
    value: number;
    max?: number;
    indeterminate?: boolean;
  };
  metadata?: {
    source?: string;
    channel?: string;
    tags?: string[];
  };
}

const getDefaultIcon = (
  type: NotificationToastProps['type'],
  category?: NotificationToastProps['category']
) => {
  if (category) {
    switch (category) {
      case 'system':
        return <Zap />;
      case 'user':
        return <User />;
      case 'security':
        return <AlertTriangle />;
      case 'marketing':
        return <Mail />;
      case 'update':
        return <BellRing />;
      case 'reminder':
        return <Clock />;
      default:
        break;
    }
  }

  switch (type) {
    case 'success':
      return <CheckCircle />;
    case 'error':
      return <XCircle />;
    case 'warning':
      return <AlertTriangle />;
    case 'info':
      return <Info />;
    default:
      return <Bell />;
  }
};

const formatTimestamp = (timestamp: Date | string) => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diffInMinutes = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60)
  );

  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const NotificationToast: React.FC<NotificationToastProps> = ({
  id,
  type = 'default',
  size = 'md',
  position = 'relative',
  animation = 'none',
  title,
  message,
  icon,
  className,
  dismissible = true,
  onDismiss,
  actions = [],
  timestamp,
  duration,
  persistent = false,
  sound = false,
  avatar,
  badge,
  category,
  priority,
  interactive = false,
  progress,
  metadata,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [isHovered, setIsHovered] = React.useState(false);

  const displayIcon = icon || getDefaultIcon(type, category);

  // Auto-dismiss functionality
  React.useEffect(() => {
    if (duration && !persistent && !isHovered) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, persistent, isHovered]);

  // Sound notification
  React.useEffect(() => {
    if (sound && typeof window !== 'undefined') {
      // Create a simple beep sound using Web Audio API
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = type === 'error' ? 400 : 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.1
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        console.warn('Could not play notification sound:', error);
      }
    }
  }, [sound, type]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300); // Wait for animation to complete
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={cn(
        notificationToastVariants({ type, size, position, animation }),
        interactive && 'cursor-pointer hover:shadow-xl',
        className
      )}
      role="alert"
      aria-live={
        type === 'error' || priority === 'urgent' ? 'assertive' : 'polite'
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      <div className="flex items-start gap-3">
        {/* Avatar or Icon */}
        {avatar ? (
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback>{avatar.fallback}</AvatarFallback>
          </Avatar>
        ) : (
          <div className={cn(notificationIconVariants({ type, size }))}>
            {displayIcon}
          </div>
        )}

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {title && (
                <h4 className="text-sm font-semibold leading-tight">{title}</h4>
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
                    priority === 'urgent' || priority === 'high'
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
              {timestamp && (
                <span className="whitespace-nowrap text-xs opacity-75">
                  {formatTimestamp(timestamp)}
                </span>
              )}

              {sound && (
                <div className="text-xs opacity-50">
                  <Volume2 className="h-3 w-3" />
                </div>
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

          {/* Message */}
          <div className="mb-2 text-sm leading-relaxed">{message}</div>

          {/* Progress */}
          {progress && (
            <div className="mb-2">
              <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    type === 'success' && 'bg-green-600',
                    type === 'error' && 'bg-red-600',
                    type === 'warning' && 'bg-yellow-600',
                    type === 'info' && 'bg-blue-600',
                    type === 'default' && 'bg-gray-600',
                    progress.indeterminate && 'animate-pulse'
                  )}
                  style={{
                    width: progress.indeterminate
                      ? '100%'
                      : `${(progress.value / (progress.max || 100)) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Metadata */}
          {metadata &&
            (metadata.source || metadata.channel || metadata.tags?.length) && (
              <div className="mb-2 flex items-center gap-2 text-xs opacity-75">
                {metadata.source && <span>From: {metadata.source}</span>}
                {metadata.channel && <span>via {metadata.channel}</span>}
                {metadata.tags && metadata.tags.length > 0 && (
                  <div className="flex gap-1">
                    {metadata.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-1 py-0 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

          {/* Actions */}
          {actions.length > 0 && (
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
                  {action.loading && (
                    <div className="mr-1 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  )}
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

// Preset notification toast components
export const SuccessToast: React.FC<
  Omit<NotificationToastProps, 'type'>
> = props => <NotificationToast {...props} type="success" />;

export const ErrorToast: React.FC<
  Omit<NotificationToastProps, 'type'>
> = props => <NotificationToast {...props} type="error" />;

export const WarningToast: React.FC<
  Omit<NotificationToastProps, 'type'>
> = props => <NotificationToast {...props} type="warning" />;

export const InfoToast: React.FC<
  Omit<NotificationToastProps, 'type'>
> = props => <NotificationToast {...props} type="info" />;

// Category-specific toasts
export const SystemToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="system" />;

export const SecurityToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="security" />;

export const UserToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="user" />;

export const MarketingToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="marketing" />;

export const UpdateToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="update" />;

export const ReminderToast: React.FC<
  Omit<NotificationToastProps, 'category'>
> = props => <NotificationToast {...props} category="reminder" />;

export type { NotificationAction, NotificationToastProps };
export default NotificationToast;
