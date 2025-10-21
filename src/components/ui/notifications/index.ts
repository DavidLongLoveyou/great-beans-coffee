// Notification Components
export { default as NotificationToast } from '../alerts/NotificationToast';

export { NotificationPreferences } from './NotificationPreferences';
export type {
  NotificationPreferencesProps,
  NotificationSettings,
} from './NotificationPreferences';

export { NotificationFrequency } from './NotificationFrequency';
export type {
  NotificationFrequencyProps,
  FrequencySettings,
} from './NotificationFrequency';

export { NotificationHistory } from './NotificationHistory';
export type {
  NotificationHistoryProps,
  NotificationHistoryItem,
} from './NotificationHistory';

// Re-export commonly used notification utilities
export const NOTIFICATION_TYPES = {
  QUOTES: 'quotes',
  ORDERS: 'orders',
  SHIPMENTS: 'shipments',
  MARKETING: 'marketing',
  SECURITY: 'security',
  SYSTEM: 'system',
} as const;

export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  PUSH: 'push',
  SMS: 'sms',
  IN_APP: 'inApp',
} as const;

export const NOTIFICATION_STATUS = {
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  FAILED: 'failed',
  PENDING: 'pending',
} as const;

export const EMAIL_FREQUENCIES = {
  IMMEDIATE: 'immediate',
  HOURLY: 'hourly',
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const;

export const PUSH_FREQUENCIES = {
  IMMEDIATE: 'immediate',
  BATCHED: 'batched',
} as const;