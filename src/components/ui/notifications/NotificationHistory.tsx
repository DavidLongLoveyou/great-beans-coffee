'use client';

import React, { useState } from 'react';
import {
  Bell,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Send,
  RefreshCw,
  Eye,
  Trash2,
  Archive,
  MoreHorizontal,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/presentation/components/ui/dropdown-menu';
import { ScrollArea } from '@/presentation/components/ui/scroll-area';
import { Separator } from '@/presentation/components/ui/separator';
import { cn } from '@/shared/utils';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationHistoryItem {
  id: string;
  type: 'quotes' | 'orders' | 'shipments' | 'marketing' | 'security' | 'system';
  channel: 'email' | 'push' | 'sms' | 'inApp';
  title: string;
  message: string;
  status: 'sent' | 'delivered' | 'read' | 'failed' | 'pending';
  timestamp: Date;
  recipient: string;
  metadata?: {
    emailId?: string;
    pushId?: string;
    smsId?: string;
    errorMessage?: string;
    retryCount?: number;
  };
}

export interface NotificationHistoryProps {
  notifications: NotificationHistoryItem[];
  onResendNotification?: (id: string) => void;
  onDeleteNotification?: (id: string) => void;
  onMarkAsRead?: (id: string) => void;
  onTestNotification?: (type: string, channel: string) => void;
  className?: string;
  showTestingPanel?: boolean;
}

const notificationTypeConfig = {
  quotes: { label: 'Quotes', icon: MessageSquare, color: 'blue' },
  orders: { label: 'Orders', icon: CheckCircle, color: 'green' },
  shipments: { label: 'Shipments', icon: Clock, color: 'orange' },
  marketing: { label: 'Marketing', icon: Bell, color: 'purple' },
  security: { label: 'Security', icon: XCircle, color: 'red' },
  system: { label: 'System', icon: Bell, color: 'gray' },
};

const channelConfig = {
  email: { label: 'Email', icon: Mail, color: 'blue' },
  push: { label: 'Push', icon: Smartphone, color: 'green' },
  sms: { label: 'SMS', icon: MessageSquare, color: 'orange' },
  inApp: { label: 'In-App', icon: Bell, color: 'purple' },
};

const statusConfig = {
  sent: { label: 'Sent', color: 'blue' },
  delivered: { label: 'Delivered', color: 'green' },
  read: { label: 'Read', color: 'green' },
  failed: { label: 'Failed', color: 'red' },
  pending: { label: 'Pending', color: 'yellow' },
};

export function NotificationHistory({
  notifications,
  onResendNotification,
  onDeleteNotification,
  onMarkAsRead,
  onTestNotification,
  className,
  showTestingPanel = true,
}: NotificationHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterChannel, setFilterChannel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationHistoryItem | null>(null);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      filterType === 'all' || notification.type === filterType;
    const matchesChannel =
      filterChannel === 'all' || notification.channel === filterChannel;
    const matchesStatus =
      filterStatus === 'all' || notification.status === filterStatus;

    return matchesSearch && matchesType && matchesChannel && matchesStatus;
  });

  const getStatusBadgeColor = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    switch (config?.color) {
      case 'green':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'blue':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'red':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    const config =
      notificationTypeConfig[type as keyof typeof notificationTypeConfig];
    return config?.icon || Bell;
  };

  const getChannelIcon = (channel: string) => {
    const config = channelConfig[channel as keyof typeof channelConfig];
    return config?.icon || Bell;
  };

  const handleTestNotification = (type: string, channel: string) => {
    if (onTestNotification) {
      onTestNotification(type, channel);
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Notification History</TabsTrigger>
          {showTestingPanel && (
            <TabsTrigger value="testing">Test Notifications</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
                    <Input
                      placeholder="Search notifications..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {Object.entries(notificationTypeConfig).map(
                      ([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>

                <Select value={filterChannel} onValueChange={setFilterChannel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Channels</SelectItem>
                    {Object.entries(channelConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Notification List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Recent Notifications ({filteredNotifications.length})
              </CardTitle>
              <CardDescription>
                View and manage your notification history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredNotifications.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <Bell className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No notifications found matching your criteria</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification, index) => {
                      const TypeIcon = getTypeIcon(notification.type);
                      const ChannelIcon = getChannelIcon(notification.channel);

                      return (
                        <div key={notification.id}>
                          <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-900">
                            <div className="flex-shrink-0">
                              <div className="relative">
                                <TypeIcon className="h-5 w-5 text-gray-600" />
                                <ChannelIcon className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-white p-0.5 dark:bg-gray-900" />
                              </div>
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium">
                                    {notification.title}
                                  </h4>
                                  <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
                                    {notification.message}
                                  </p>
                                  <div className="mt-2 flex items-center gap-2">
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {
                                        notificationTypeConfig[
                                          notification.type
                                        ]?.label
                                      }
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      {
                                        channelConfig[notification.channel]
                                          ?.label
                                      }
                                    </Badge>
                                    <Badge
                                      className={cn(
                                        'text-xs',
                                        getStatusBadgeColor(notification.status)
                                      )}
                                    >
                                      {statusConfig[notification.status]?.label}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                      {formatDistanceToNow(
                                        notification.timestamp,
                                        { addSuffix: true }
                                      )}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      to {notification.recipient}
                                    </p>
                                  </div>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                      >
                                        <MoreHorizontal className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={() =>
                                          setSelectedNotification(notification)
                                        }
                                      >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Details
                                      </DropdownMenuItem>
                                      {notification.status === 'failed' &&
                                        onResendNotification && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              onResendNotification(
                                                notification.id
                                              )
                                            }
                                          >
                                            <RefreshCw className="mr-2 h-4 w-4" />
                                            Resend
                                          </DropdownMenuItem>
                                        )}
                                      {notification.status !== 'read' &&
                                        onMarkAsRead && (
                                          <DropdownMenuItem
                                            onClick={() =>
                                              onMarkAsRead(notification.id)
                                            }
                                          >
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Mark as Read
                                          </DropdownMenuItem>
                                        )}
                                      <DropdownMenuSeparator />
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onDeleteNotification?.(
                                            notification.id
                                          )
                                        }
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </div>
                              </div>

                              {notification.metadata?.errorMessage && (
                                <div className="mt-2 rounded bg-red-50 p-2 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-300">
                                  <strong>Error:</strong>{' '}
                                  {notification.metadata.errorMessage}
                                  {notification.metadata.retryCount && (
                                    <span className="ml-2">
                                      (Retry {notification.metadata.retryCount})
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {index < filteredNotifications.length - 1 && (
                            <Separator />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {showTestingPanel && (
          <TabsContent value="testing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Test Notifications
                </CardTitle>
                <CardDescription>
                  Send test notifications to verify your settings are working
                  correctly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {Object.entries(notificationTypeConfig).map(
                    ([type, config]) => (
                      <Card key={type} className="p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <config.icon className="h-5 w-5" />
                          <h4 className="font-medium">{config.label}</h4>
                        </div>
                        <div className="space-y-2">
                          {Object.entries(channelConfig).map(
                            ([channel, channelConfig]) => (
                              <Button
                                key={channel}
                                variant="outline"
                                size="sm"
                                className="w-full justify-start"
                                onClick={() =>
                                  handleTestNotification(type, channel)
                                }
                              >
                                <channelConfig.icon className="mr-2 h-4 w-4" />
                                Test {channelConfig.label}
                              </Button>
                            )
                          )}
                        </div>
                      </Card>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default NotificationHistory;