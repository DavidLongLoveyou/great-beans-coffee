'use client';

import React from 'react';

interface CalloutBoxProps {
  type?: 'info' | 'warning' | 'success' | 'error' | 'note';
  title?: string;
  children: React.ReactNode;
  icon?: string;
  className?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export const CalloutBox: React.FC<CalloutBoxProps> = ({
  type = 'info',
  title,
  children,
  icon,
  className = '',
  dismissible = false,
  onDismiss,
}) => {
  const typeStyles = {
    info: {
      container: 'bg-blue-50 border-blue-200 text-blue-800',
      icon: '💡',
      titleColor: 'text-blue-900',
      borderColor: 'border-l-blue-500',
    },
    warning: {
      container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      icon: '⚠️',
      titleColor: 'text-yellow-900',
      borderColor: 'border-l-yellow-500',
    },
    success: {
      container: 'bg-green-50 border-green-200 text-green-800',
      icon: '✅',
      titleColor: 'text-green-900',
      borderColor: 'border-l-green-500',
    },
    error: {
      container: 'bg-red-50 border-red-200 text-red-800',
      icon: '❌',
      titleColor: 'text-red-900',
      borderColor: 'border-l-red-500',
    },
    note: {
      container: 'bg-gray-50 border-gray-200 text-gray-800',
      icon: '📝',
      titleColor: 'text-gray-900',
      borderColor: 'border-l-gray-500',
    },
  };

  const styles = typeStyles[type];
  const displayIcon = icon || styles.icon;

  return (
    <div
      className={`my-4 rounded-lg border border-l-4 p-4 ${styles.container} ${styles.borderColor} ${className}`}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <span className="text-lg" role="img" aria-label={type}>
            {displayIcon}
          </span>
        </div>

        <div className="ml-3 flex-1">
          {title && (
            <h4 className={`mb-2 font-semibold ${styles.titleColor}`}>
              {title}
            </h4>
          )}

          <div className="text-sm leading-relaxed">{children}</div>
        </div>

        {dismissible && onDismiss && (
          <div className="ml-3 flex-shrink-0">
            <button
              onClick={onDismiss}
              className={`text-lg transition-opacity hover:opacity-70 ${styles.titleColor}`}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Preset components for common use cases
export const InfoBox: React.FC<Omit<CalloutBoxProps, 'type'>> = props => (
  <CalloutBox {...props} type="info" />
);

export const WarningBox: React.FC<Omit<CalloutBoxProps, 'type'>> = props => (
  <CalloutBox {...props} type="warning" />
);

export const SuccessBox: React.FC<Omit<CalloutBoxProps, 'type'>> = props => (
  <CalloutBox {...props} type="success" />
);

export const ErrorBox: React.FC<Omit<CalloutBoxProps, 'type'>> = props => (
  <CalloutBox {...props} type="error" />
);

export const NoteBox: React.FC<Omit<CalloutBoxProps, 'type'>> = props => (
  <CalloutBox {...props} type="note" />
);

// Market-specific callout boxes
export const MarketInsight: React.FC<
  Omit<CalloutBoxProps, 'type' | 'icon'>
> = props => <CalloutBox {...props} type="info" icon="📊" />;

export const PriceAlert: React.FC<
  Omit<CalloutBoxProps, 'type' | 'icon'>
> = props => <CalloutBox {...props} type="warning" icon="💰" />;

export const QualityNote: React.FC<
  Omit<CalloutBoxProps, 'type' | 'icon'>
> = props => <CalloutBox {...props} type="success" icon="☕" />;

export const SupplyChainUpdate: React.FC<
  Omit<CalloutBoxProps, 'type' | 'icon'>
> = props => <CalloutBox {...props} type="note" icon="🚢" />;

export default CalloutBox;
