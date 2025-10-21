'use client';

import React from 'react';
import {
  Clock,
  Calendar,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Switch } from '@/presentation/components/ui/switch';
import { Label } from '@/presentation/components/ui/label';
import { Slider } from '@/presentation/components/ui/slider';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { cn } from '@/shared/utils';

export interface FrequencySettings {
  email: {
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    quietHours: {
      enabled: boolean;
      start: string; // HH:MM format
      end: string; // HH:MM format
    };
    digest: {
      enabled: boolean;
      time: string; // HH:MM format
      days: string[]; // ['monday', 'tuesday', etc.]
    };
  };
  push: {
    frequency: 'immediate' | 'batched';
    batchInterval: number; // minutes
    quietHours: {
      enabled: boolean;
      start: string;
      end: string;
    };
    sound: {
      enabled: boolean;
      volume: number; // 0-100
    };
  };
  general: {
    timezone: string;
    businessHoursOnly: boolean;
    weekendsEnabled: boolean;
    priorityOverride: boolean; // High priority notifications bypass quiet hours
  };
}

export interface NotificationFrequencyProps {
  settings: FrequencySettings;
  onSettingsChange: (settings: FrequencySettings) => void;
  className?: string;
  disabled?: boolean;
}

const frequencyOptions = [
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Receive notifications as they happen',
    icon: Zap,
  },
  {
    value: 'hourly',
    label: 'Hourly',
    description: 'Bundled notifications every hour',
    icon: Clock,
  },
  {
    value: 'daily',
    label: 'Daily',
    description: 'Daily digest of notifications',
    icon: Calendar,
  },
  {
    value: 'weekly',
    label: 'Weekly',
    description: 'Weekly summary of notifications',
    icon: Calendar,
  },
];

const pushFrequencyOptions = [
  {
    value: 'immediate',
    label: 'Immediate',
    description: 'Instant push notifications',
    icon: Zap,
  },
  {
    value: 'batched',
    label: 'Batched',
    description: 'Group notifications together',
    icon: Clock,
  },
];

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Asia/Ho_Chi_Minh', label: 'Indochina Time (ICT)' },
];

const weekDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' },
  { value: 'saturday', label: 'Saturday' },
  { value: 'sunday', label: 'Sunday' },
];

export function NotificationFrequency({
  settings,
  onSettingsChange,
  className,
  disabled = false,
}: NotificationFrequencyProps) {
  const updateEmailSettings = (
    updates: Partial<FrequencySettings['email']>
  ) => {
    if (disabled) return;
    onSettingsChange({
      ...settings,
      email: { ...settings.email, ...updates },
    });
  };

  const updatePushSettings = (updates: Partial<FrequencySettings['push']>) => {
    if (disabled) return;
    onSettingsChange({
      ...settings,
      push: { ...settings.push, ...updates },
    });
  };

  const updateGeneralSettings = (
    updates: Partial<FrequencySettings['general']>
  ) => {
    if (disabled) return;
    onSettingsChange({
      ...settings,
      general: { ...settings.general, ...updates },
    });
  };

  const toggleDigestDay = (day: string) => {
    if (disabled) return;
    const currentDays = settings.email.digest.days;
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day];

    updateEmailSettings({
      digest: { ...settings.email.digest, days: newDays },
    });
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* General Settings */}
      <Card className={disabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            General Settings
          </CardTitle>
          <CardDescription>
            Configure global notification timing and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.general.timezone}
                onValueChange={value =>
                  updateGeneralSettings({ timezone: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Business Hours Only
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Only send notifications during business hours (9 AM - 6 PM)
                </p>
              </div>
              <Switch
                checked={settings.general.businessHoursOnly}
                onCheckedChange={checked =>
                  updateGeneralSettings({ businessHoursOnly: checked })
                }
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">
                  Weekend Notifications
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Allow notifications on weekends
                </p>
              </div>
              <Switch
                checked={settings.general.weekendsEnabled}
                onCheckedChange={checked =>
                  updateGeneralSettings({ weekendsEnabled: checked })
                }
                disabled={disabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-medium">Priority Override</Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  High priority notifications bypass quiet hours and frequency
                  limits
                </p>
              </div>
              <Switch
                checked={settings.general.priorityOverride}
                onCheckedChange={checked =>
                  updateGeneralSettings({ priorityOverride: checked })
                }
                disabled={disabled}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Frequency */}
      <Card className={disabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Email Frequency
          </CardTitle>
          <CardDescription>
            Control how often you receive email notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select
              value={settings.email.frequency}
              onValueChange={(value: any) =>
                updateEmailSettings({ frequency: value })
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {frequencyOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Quiet Hours */}
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Moon className="h-4 w-4" />
                  Quiet Hours
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pause email notifications during specified hours
                </p>
              </div>
              <Switch
                checked={settings.email.quietHours.enabled}
                onCheckedChange={checked =>
                  updateEmailSettings({
                    quietHours: {
                      ...settings.email.quietHours,
                      enabled: checked,
                    },
                  })
                }
                disabled={disabled}
              />
            </div>

            {settings.email.quietHours.enabled && (
              <div className="ml-6 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quiet-start">Start Time</Label>
                  <input
                    id="quiet-start"
                    type="time"
                    value={settings.email.quietHours.start}
                    onChange={e =>
                      updateEmailSettings({
                        quietHours: {
                          ...settings.email.quietHours,
                          start: e.target.value,
                        },
                      })
                    }
                    disabled={disabled}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quiet-end">End Time</Label>
                  <input
                    id="quiet-end"
                    type="time"
                    value={settings.email.quietHours.end}
                    onChange={e =>
                      updateEmailSettings({
                        quietHours: {
                          ...settings.email.quietHours,
                          end: e.target.value,
                        },
                      })
                    }
                    disabled={disabled}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Daily Digest */}
          {settings.email.frequency === 'daily' && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Daily Digest</Label>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Receive a summary of notifications at a specific time
                    </p>
                  </div>
                  <Switch
                    checked={settings.email.digest.enabled}
                    onCheckedChange={checked =>
                      updateEmailSettings({
                        digest: { ...settings.email.digest, enabled: checked },
                      })
                    }
                    disabled={disabled}
                  />
                </div>

                {settings.email.digest.enabled && (
                  <div className="ml-6 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="digest-time">Delivery Time</Label>
                      <input
                        id="digest-time"
                        type="time"
                        value={settings.email.digest.time}
                        onChange={e =>
                          updateEmailSettings({
                            digest: {
                              ...settings.email.digest,
                              time: e.target.value,
                            },
                          })
                        }
                        disabled={disabled}
                        className="flex h-10 w-32 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Delivery Days</Label>
                      <div className="flex flex-wrap gap-2">
                        {weekDays.map(day => (
                          <Badge
                            key={day.value}
                            variant={
                              settings.email.digest.days.includes(day.value)
                                ? 'default'
                                : 'outline'
                            }
                            className="cursor-pointer"
                            onClick={() => toggleDigestDay(day.value)}
                          >
                            {day.label}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Push Notification Settings */}
      <Card className={disabled ? 'opacity-50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-green-600" />
            Push Notification Settings
          </CardTitle>
          <CardDescription>
            Configure push notification timing and behavior
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select
              value={settings.push.frequency}
              onValueChange={(value: any) =>
                updatePushSettings({ frequency: value })
              }
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {pushFrequencyOptions.map(option => {
                  const Icon = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {settings.push.frequency === 'batched' && (
            <div className="space-y-2">
              <Label>Batch Interval (minutes)</Label>
              <div className="px-3">
                <Slider
                  value={[settings.push.batchInterval]}
                  onValueChange={([value]) =>
                    value !== undefined && updatePushSettings({ batchInterval: value })
                  }
                  max={60}
                  min={5}
                  step={5}
                  disabled={disabled}
                  className="w-full"
                />
                <div className="mt-1 flex justify-between text-sm text-gray-600">
                  <span>5 min</span>
                  <span>{settings.push.batchInterval} min</span>
                  <span>60 min</span>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Sound Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-2 text-sm font-medium">
                  {settings.push.sound.enabled ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                  Notification Sound
                </Label>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Play sound for push notifications
                </p>
              </div>
              <Switch
                checked={settings.push.sound.enabled}
                onCheckedChange={checked =>
                  updatePushSettings({
                    sound: { ...settings.push.sound, enabled: checked },
                  })
                }
                disabled={disabled}
              />
            </div>

            {settings.push.sound.enabled && (
              <div className="ml-6 space-y-2">
                <Label>Volume</Label>
                <div className="px-3">
                  <Slider
                    value={[settings.push.sound.volume]}
                    onValueChange={([value]) =>
                      value !== undefined && updatePushSettings({
                        sound: { ...settings.push.sound, volume: value },
                      })
                    }
                    max={100}
                    min={0}
                    step={10}
                    disabled={disabled}
                    className="w-full"
                  />
                  <div className="mt-1 flex justify-between text-sm text-gray-600">
                    <span>0%</span>
                    <span>{settings.push.sound.volume}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default NotificationFrequency;