'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export interface ValidationMessageProps {
  message?: string;
  type?: 'error' | 'warning' | 'success' | 'info';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  inline?: boolean;
  children?: React.ReactNode;
}

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  success: CheckCircle,
  info: Info,
};

const colorMap = {
  error: 'text-red-600 border-red-200 bg-red-50',
  warning: 'text-yellow-600 border-yellow-200 bg-yellow-50',
  success: 'text-green-600 border-green-200 bg-green-50',
  info: 'text-blue-600 border-blue-200 bg-blue-50',
};

const iconColorMap = {
  error: 'text-red-500',
  warning: 'text-yellow-500',
  success: 'text-green-500',
  info: 'text-blue-500',
};

const sizeMap = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

const iconSizeMap = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-5 w-5',
};

export const ValidationMessage: React.FC<ValidationMessageProps> = ({
  message,
  type = 'error',
  className,
  size = 'md',
  showIcon = true,
  inline = false,
  children,
}) => {
  const content = children || message;

  if (!content) {
    return null;
  }

  const Icon = iconMap[type];

  if (inline) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1',
          sizeMap[size],
          iconColorMap[type],
          className
        )}
        role="alert"
        aria-live="polite"
      >
        {showIcon && Icon && <Icon className={iconSizeMap[size]} />}
        <span>{content}</span>
      </span>
    );
  }

  return (
    <div
      className={cn(
        'flex items-start gap-2 rounded-md border p-3',
        colorMap[type],
        sizeMap[size],
        className
      )}
      role="alert"
      aria-live="polite"
    >
      {showIcon && Icon && (
        <Icon className={cn(iconSizeMap[size], 'mt-0.5 flex-shrink-0')} />
      )}
      <div className="flex-1">{content}</div>
    </div>
  );
};

// Convenience components for specific types
export const ErrorMessage: React.FC<
  Omit<ValidationMessageProps, 'type'>
> = props => <ValidationMessage {...props} type="error" />;

export const WarningMessage: React.FC<
  Omit<ValidationMessageProps, 'type'>
> = props => <ValidationMessage {...props} type="warning" />;

export const SuccessMessage: React.FC<
  Omit<ValidationMessageProps, 'type'>
> = props => <ValidationMessage {...props} type="success" />;

export const InfoMessage: React.FC<
  Omit<ValidationMessageProps, 'type'>
> = props => <ValidationMessage {...props} type="info" />;

export default ValidationMessage;
