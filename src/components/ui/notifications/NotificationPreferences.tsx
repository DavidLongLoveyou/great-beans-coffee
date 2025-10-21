'use client';

import React from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  Shield,
  Truck,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { Switch } from '@/presentation/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { cn } from '@/shared/utils';

export interface NotificationSettings {
  email: {
    quotes: boolean;
    orders: boolean;
    shipments: boolean;
    marketing: boolean;
    security: boolean;
    system: boolean;
  };
  push: {
    quotes: boolean;
    orders: boolean;
    shipments: boolean;
    marketing: boolean;
    security: boolean;
    system: boolean;
  };
  sms: {
    quotes: boolean;
    orders: boolean;
    shipments: boolean;
    security: boolean;
  };
  inApp: {
    quotes: boolean;
    orders: boolean;
    shipments: boolean;
    marketing: boolean;
    security: boolean;
    system: boolean;
  };
}

export interface NotificationPreferencesProps {
  settings: NotificationSettings;
  onSettingsChange: (settings: NotificationSettings) => void;
  className?: string;
  showSmsOptions?: boolean;
  showInAppOptions?: boolean;
  disabled?: boolean;
}

const notificationTypes = [
  {
    key: 'quotes' as const,
    label: 'Quote Updates',
    description:
      'Receive notifications when quotes are updated or responded to',
    icon: MessageSquare,
    category: 'business',
  },
  {
    key: 'orders' as const,
    label: 'Order Updates',
    description: 'Get notified about order status changes and confirmations',
    icon: ShoppingCart,
    category: 'business',
  },
  {
    key: 'shipments' as const,
    label: 'Shipment Updates',
    description: 'Track your shipments and delivery notifications',
    icon: Truck,
    category: 'business',
  },
  {
    key: 'marketing' as const,
    label: 'Marketing Communications',
    description:
      'Receive market insights, product updates, and promotional content',
    icon: TrendingUp,
    category: 'marketing',
  },
  {
    key: 'security' as const,
    label: 'Security Alerts',
    description: 'Important security notifications and account alerts',
    icon: Shield,
    category: 'security',
  },
  {
    key: 'system' as const,
    label: 'System Notifications',
    description: 'Platform updates, maintenance notices, and system alerts',
    icon: Bell,
    category: 'system',
  },
] as const;

const channelConfig = [
  {
    key: 'email' as const,
    label: 'Email Notifications',
    description: 'Receive notifications via email',
    icon: Mail,
    color: 'blue',
  },
  {
    key: 'push' as const,
    label: 'Push Notifications',
    description: 'Browser and mobile push notifications',
    icon: Smartphone,
    color: 'green',
  },
  {
    key: 'sms' as const,
    label: 'SMS Notifications',
    description: 'Text message notifications for urgent updates',
    icon: MessageSquare,
    color: 'orange',
  },
  {
    key: 'inApp' as const,
    label: 'In-App Notifications',
    description: 'Notifications within the application',
    icon: Bell,
    color: 'purple',
  },
] as const;

export function NotificationPreferences({
  settings,
  onSettingsChange,
  className,
  showSmsOptions = true,
  showInAppOptions = true,
  disabled = false,
}: NotificationPreferencesProps) {
  const handleChannelToggle = (
    channel: keyof NotificationSettings,
    type: keyof NotificationSettings['email'],
    value: boolean
  ) => {
    if (disabled) return;

    const newSettings = {
      ...settings,
      [channel]: {
        ...settings[channel],
        [type]: value,
      },
    };
    onSettingsChange(newSettings);
  };

  const getChannelIcon = (channelKey: string) => {
    const config = channelConfig.find(c => c.key === channelKey);
    if (!config) return Bell;
    return config.icon;
  };

  const getChannelColor = (channelKey: string) => {
    const config = channelConfig.find(c => c.key === channelKey);
    return config?.color || 'gray';
  };

  const getNotificationIcon = (typeKey: string) => {
    const type = notificationTypes.find(t => t.key === typeKey);
    if (!type) return Bell;
    return type.icon;
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'business':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'marketing':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'security':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'system':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const visibleChannels = channelConfig.filter(channel => {
    if (channel.key === 'sms' && !showSmsOptions) return false;
    if (channel.key === 'inApp' && !showInAppOptions) return false;
    return true;
  });

  return (
    <div className={cn('space-y-6', className)}>
      {visibleChannels.map(channel => {
        const ChannelIcon = channel.icon;

        return (
          <Card key={channel.key} className={disabled ? 'opacity-50' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ChannelIcon
                  className={cn(
                    'h-5 w-5',
                    `text-${channel.color}-600 dark:text-${channel.color}-400`
                  )}
                />
                {channel.label}
              </CardTitle>
              <CardDescription>{channel.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {notificationTypes.map((type, index) => {
                const TypeIcon = type.icon;
                const channelSettings = settings[channel.key];
                const isEnabled = channelSettings && type.key in channelSettings 
                  ? (channelSettings as any)[type.key] 
                  : false;

                // Skip SMS for marketing and system notifications
                if (
                  channel.key === 'sms' &&
                  (type.key === 'marketing' || type.key === 'system')
                ) {
                  return null;
                }

                return (
                  <div key={type.key}>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-1 items-start gap-3">
                        <TypeIcon
                          className={cn(
                            'mt-1 h-4 w-4 flex-shrink-0',
                            isEnabled
                              ? `text-${channel.color}-600 dark:text-${channel.color}-400`
                              : 'text-gray-400 dark:text-gray-600'
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="mb-1 flex items-center gap-2">
                            <p className="text-sm font-medium">{type.label}</p>
                            <Badge
                              variant="secondary"
                              className={cn(
                                'text-xs',
                                getCategoryBadgeColor(type.category)
                              )}
                            >
                              {type.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {type.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={isEnabled}
                        onCheckedChange={checked =>
                          handleChannelToggle(channel.key, type.key, checked)
                        }
                        disabled={disabled}
                        className="ml-4"
                      />
                    </div>
                    {index < notificationTypes.length - 1 &&
                      !(
                        channel.key === 'sms' &&
                        (notificationTypes[index + 1]?.key === 'marketing' ||
                          notificationTypes[index + 1]?.key === 'system')
                      ) && <Separator className="mt-4" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default NotificationPreferences;