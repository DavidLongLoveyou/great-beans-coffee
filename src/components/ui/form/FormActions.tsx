'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/presentation/components/ui/button';
import { Separator } from '@/presentation/components/ui/separator';
import { Loader2 } from 'lucide-react';

export interface FormAction {
  id: string;
  label: string;
  type?: 'submit' | 'button' | 'reset';
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export interface FormActionsProps {
  actions: FormAction[];
  className?: string;
  layout?: 'horizontal' | 'vertical' | 'split';
  alignment?: 'left' | 'center' | 'right' | 'between' | 'around';
  size?: 'sm' | 'md' | 'lg';
  sticky?: boolean;
  showSeparator?: boolean;
  primaryAction?: string; // ID of the primary action
  secondaryActions?: string[]; // IDs of secondary actions
  destructiveActions?: string[]; // IDs of destructive actions
}

export const FormActions: React.FC<FormActionsProps> = ({
  actions,
  className,
  layout = 'horizontal',
  alignment = 'right',
  size = 'md',
  sticky = false,
  showSeparator = false,
  primaryAction,
  secondaryActions = [],
  destructiveActions = [],
}) => {
  const sizeClasses = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  const getActionVariant = (action: FormAction): FormAction['variant'] => {
    if (action.variant) return action.variant;

    if (action.id === primaryAction) return 'default';
    if (destructiveActions.includes(action.id)) return 'destructive';
    if (secondaryActions.includes(action.id)) return 'outline';

    return 'outline';
  };

  const renderAction = (action: FormAction) => {
    const variant = getActionVariant(action);
    const isPrimary = action.id === primaryAction;

    return (
      <Button
        key={action.id}
        type={action.type || 'button'}
        variant={variant}
        size={action.size || 'default'}
        onClick={action.onClick}
        disabled={Boolean(action.disabled || action.loading)}
        className={cn(
          isPrimary && 'order-last', // Primary action appears last
          action.className
        )}
      >
        {action.loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {action.label}
          </>
        ) : (
          <>
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </>
        )}
      </Button>
    );
  };

  const renderActions = () => {
    if (layout === 'split' && actions.length >= 2) {
      const leftActions = actions.slice(0, Math.floor(actions.length / 2));
      const rightActions = actions.slice(Math.floor(actions.length / 2));

      return (
        <div className="flex w-full items-center justify-between">
          <div className={cn('flex', sizeClasses[size])}>
            {leftActions.map(renderAction)}
          </div>
          <div className={cn('flex', sizeClasses[size])}>
            {rightActions.map(renderAction)}
          </div>
        </div>
      );
    }

    if (layout === 'vertical') {
      return (
        <div className={cn('flex flex-col', sizeClasses[size])}>
          {actions.map(renderAction)}
        </div>
      );
    }

    // Horizontal layout (default)
    return (
      <div
        className={cn(
          'flex',
          sizeClasses[size],
          alignmentClasses[alignment],
          layout === 'horizontal' && 'flex-wrap'
        )}
      >
        {actions.map(renderAction)}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'w-full',
        sticky && 'sticky bottom-0 z-10 border-t bg-white',
        sticky && paddingClasses[size],
        className
      )}
    >
      {showSeparator && !sticky && <Separator className="mb-4" />}
      {renderActions()}
    </div>
  );
};

// Preset action configurations
export const createSaveActions = (
  onSave: () => void,
  onCancel: () => void,
  options: {
    saveLabel?: string;
    cancelLabel?: string;
    saveLoading?: boolean;
    saveDisabled?: boolean;
  } = {}
): FormAction[] => [
  {
    id: 'cancel',
    label: options.cancelLabel || 'Cancel',
    variant: 'outline',
    onClick: onCancel,
  },
  {
    id: 'save',
    label: options.saveLabel || 'Save',
    type: 'submit',
    variant: 'default',
    onClick: onSave,
    loading: Boolean(options.saveLoading),
    disabled: Boolean(options.saveDisabled),
  },
];

export const createSubmitActions = (
  onSubmit: () => void,
  onReset?: () => void,
  options: {
    submitLabel?: string;
    resetLabel?: string;
    submitLoading?: boolean;
    submitDisabled?: boolean;
    showReset?: boolean;
  } = {}
): FormAction[] => {
  const actions: FormAction[] = [
    {
      id: 'submit',
      label: options.submitLabel || 'Submit',
      type: 'submit',
      variant: 'default',
      onClick: onSubmit,
      loading: Boolean(options.submitLoading),
      disabled: Boolean(options.submitDisabled),
    },
  ];

  if (options.showReset && onReset) {
    actions.unshift({
      id: 'reset',
      label: options.resetLabel || 'Reset',
      type: 'reset',
      variant: 'outline',
      onClick: onReset,
    });
  }

  return actions;
};

export const createDeleteActions = (
  onDelete: () => void,
  onCancel: () => void,
  options: {
    deleteLabel?: string;
    cancelLabel?: string;
    deleteLoading?: boolean;
  } = {}
): FormAction[] => [
  {
    id: 'cancel',
    label: options.cancelLabel || 'Cancel',
    variant: 'outline',
    onClick: onCancel,
  },
  {
    id: 'delete',
    label: options.deleteLabel || 'Delete',
    variant: 'destructive',
    onClick: onDelete,
    loading: Boolean(options.deleteLoading),
  },
];

export default FormActions;
