// ================================
// DATE UTILITIES - LOCALIZED FORMATTING
// ================================

import { getMarketConfig } from '@/shared/config/markets';
import { Locale } from '@/shared/types/locale.types';

/**
 * Format date with locale-specific formatting
 */
export function formatDate(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const config = getMarketConfig(locale);

  return new Intl.DateTimeFormat(locale, {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date and time with locale-specific formatting
 */
export function formatDateTime(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const config = getMarketConfig(locale);

  return new Intl.DateTimeFormat(locale, {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format date with full month name for RFQ details
 */
export function formatDateLong(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const config = getMarketConfig(locale);

  return new Intl.DateTimeFormat(locale, {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

/**
 * Format date and time with full details for RFQ timestamps
 */
export function formatDateTimeLong(
  date: Date | string,
  locale: Locale
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const config = getMarketConfig(locale);

  return new Intl.DateTimeFormat(locale, {
    timeZone: config.timezone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
}

/**
 * Format relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(
  date: Date | string,
  locale: Locale
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  // Define time units in seconds
  const units = [
    { unit: 'year', seconds: 31536000 },
    { unit: 'month', seconds: 2592000 },
    { unit: 'week', seconds: 604800 },
    { unit: 'day', seconds: 86400 },
    { unit: 'hour', seconds: 3600 },
    { unit: 'minute', seconds: 60 },
    { unit: 'second', seconds: 1 },
  ] as const;

  for (const { unit, seconds } of units) {
    const interval = Math.floor(Math.abs(diffInSeconds) / seconds);
    if (interval >= 1) {
      return rtf.format(diffInSeconds < 0 ? interval : -interval, unit);
    }
  }

  return rtf.format(0, 'second');
}

/**
 * Format deadline with urgency indicator
 */
export function formatDeadline(
  date: Date | string,
  locale: Locale
): {
  formatted: string;
  relative: string;
  isUrgent: boolean;
  isOverdue: boolean;
} {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = (dateObj.getTime() - now.getTime()) / (1000 * 60 * 60);

  return {
    formatted: formatDateTime(dateObj, locale),
    relative: formatRelativeTime(dateObj, locale),
    isUrgent: diffInHours <= 24 && diffInHours > 0, // Less than 24 hours remaining
    isOverdue: diffInHours < 0, // Past deadline
  };
}

/**
 * Format business hours in local timezone
 */
export function formatBusinessHours(locale: Locale): string {
  const config = getMarketConfig(locale);
  const { start, end, timezone } = config.businessHours;

  // Create date objects for formatting
  const today = new Date();
  const startTime = new Date(`${today.toDateString()} ${start}`);
  const endTime = new Date(`${today.toDateString()} ${end}`);

  const timeFormat = new Intl.DateTimeFormat(locale, {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${timeFormat.format(startTime)} - ${timeFormat.format(endTime)} (${timezone})`;
}

/**
 * Check if a date is within business hours
 */
export function isWithinBusinessHours(
  date: Date | string,
  locale: Locale
): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const config = getMarketConfig(locale);

  // Convert to market timezone
  const marketTime = new Intl.DateTimeFormat('en-CA', {
    timeZone: config.timezone,
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);

  const [hours, minutes] = marketTime.split(':').map(Number);
  if (hours === undefined || minutes === undefined) {
    return false; // Invalid time format
  }
  const currentMinutes = hours * 60 + minutes;

  const [startHours, startMinutes] = config.businessHours.start
    .split(':')
    .map(Number);
  if (startHours === undefined || startMinutes === undefined) {
    return false; // Invalid start time format
  }
  const startTotalMinutes = startHours * 60 + startMinutes;

  const [endHours, endMinutes] = config.businessHours.end
    .split(':')
    .map(Number);
  if (endHours === undefined || endMinutes === undefined) {
    return false; // Invalid end time format
  }
  const endTotalMinutes = endHours * 60 + endMinutes;

  return (
    currentMinutes >= startTotalMinutes && currentMinutes <= endTotalMinutes
  );
}

/**
 * Get timezone abbreviation for display
 */
export function getTimezoneAbbreviation(locale: Locale): string {
  const config = getMarketConfig(locale);
  const now = new Date();

  const timeZoneName = new Intl.DateTimeFormat('en', {
    timeZone: config.timezone,
    timeZoneName: 'short',
  })
    .formatToParts(now)
    .find(part => part.type === 'timeZoneName')?.value;

  return timeZoneName || config.timezone;
}

/**
 * Format date for input fields (YYYY-MM-DD)
 */
export function formatDateForInput(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const datePart = dateObj.toISOString().split('T')[0];
  return datePart || dateObj.toISOString().substring(0, 10);
}

/**
 * Parse date from input field
 */
export function parseDateFromInput(dateString: string): Date {
  return new Date(dateString + 'T00:00:00.000Z');
}
