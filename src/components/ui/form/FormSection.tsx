'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Separator } from '@/presentation/components/ui/separator';
import { Badge } from '@/presentation/components/ui/badge';

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'card' | 'simple' | 'bordered';
  size?: 'sm' | 'md' | 'lg';
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  icon?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  actions?: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
  className,
  variant = 'simple',
  size = 'md',
  collapsible = false,
  defaultCollapsed = false,
  badge,
  icon,
  required = false,
  disabled = false,
  error = false,
  actions,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  const sizeClasses = {
    sm: 'space-y-3',
    md: 'space-y-4',
    lg: 'space-y-6',
  };

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const renderHeader = () => {
    if (!title && !description && !badge && !actions) return null;

    const headerContent = (
      <div className="flex items-start justify-between">
        <div className="flex flex-1 items-start space-x-3">
          {icon && (
            <div
              className={cn(
                'mt-1',
                error ? 'text-red-500' : 'text-gray-500',
                disabled && 'opacity-50'
              )}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <div className="mb-1 flex items-center space-x-2">
                <h3
                  className={cn(
                    'text-lg font-semibold leading-none tracking-tight',
                    error && 'text-red-600',
                    disabled && 'text-gray-400'
                  )}
                >
                  {title}
                  {required && <span className="ml-1 text-red-500">*</span>}
                </h3>
                {badge && (
                  <Badge variant={badge.variant || 'default'}>
                    {badge.text}
                  </Badge>
                )}
                {collapsible && (
                  <button
                    type="button"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="ml-auto text-gray-400 transition-colors hover:text-gray-600"
                    disabled={disabled}
                  >
                    <svg
                      className={cn(
                        'h-4 w-4 transition-transform',
                        isCollapsed && 'rotate-180'
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                )}
              </div>
            )}
            {description && (
              <p
                className={cn(
                  'text-sm text-gray-600',
                  error && 'text-red-500',
                  disabled && 'text-gray-400'
                )}
              >
                {description}
              </p>
            )}
          </div>
        </div>
        {actions && !collapsible && (
          <div className="ml-4 flex items-center space-x-2">{actions}</div>
        )}
      </div>
    );

    return variant === 'card' ? null : (
      <div className="mb-4">
        {headerContent}
        <Separator className="mt-4" />
      </div>
    );
  };

  const renderContent = () => {
    if (collapsible && isCollapsed) return null;

    return (
      <div
        className={cn(
          sizeClasses[size],
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        {children}
      </div>
    );
  };

  if (variant === 'card') {
    return (
      <Card
        className={cn(
          error && 'border-red-200 bg-red-50/50',
          disabled && 'opacity-50',
          className
        )}
      >
        {(title || description || badge || actions) && (
          <CardHeader className={cn(paddingClasses[size], 'pb-2')}>
            <div className="flex items-start justify-between">
              <div className="flex flex-1 items-start space-x-3">
                {icon && (
                  <div
                    className={cn(
                      'mt-1',
                      error ? 'text-red-500' : 'text-gray-500'
                    )}
                  >
                    {icon}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  {title && (
                    <CardTitle
                      className={cn(
                        'flex items-center space-x-2',
                        error && 'text-red-600'
                      )}
                    >
                      <span>
                        {title}
                        {required && (
                          <span className="ml-1 text-red-500">*</span>
                        )}
                      </span>
                      {badge && (
                        <Badge variant={badge.variant || 'default'}>
                          {badge.text}
                        </Badge>
                      )}
                      {collapsible && (
                        <button
                          type="button"
                          onClick={() => setIsCollapsed(!isCollapsed)}
                          className="ml-auto text-gray-400 transition-colors hover:text-gray-600"
                          disabled={disabled}
                        >
                          <svg
                            className={cn(
                              'h-4 w-4 transition-transform',
                              isCollapsed && 'rotate-180'
                            )}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      )}
                    </CardTitle>
                  )}
                  {description && (
                    <CardDescription className={cn(error && 'text-red-500')}>
                      {description}
                    </CardDescription>
                  )}
                </div>
              </div>
              {actions && !collapsible && (
                <div className="ml-4 flex items-center space-x-2">
                  {actions}
                </div>
              )}
            </div>
          </CardHeader>
        )}
        <CardContent
          className={cn(
            paddingClasses[size],
            (title || description || badge || actions) && 'pt-2'
          )}
        >
          {renderContent()}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'bordered') {
    return (
      <div
        className={cn(
          'rounded-lg border',
          paddingClasses[size],
          error && 'border-red-200 bg-red-50/50',
          disabled && 'opacity-50',
          className
        )}
      >
        {renderHeader()}
        {renderContent()}
      </div>
    );
  }

  // Simple variant
  return (
    <div className={cn('space-y-4', disabled && 'opacity-50', className)}>
      {renderHeader()}
      {renderContent()}
    </div>
  );
};

export default FormSection;
