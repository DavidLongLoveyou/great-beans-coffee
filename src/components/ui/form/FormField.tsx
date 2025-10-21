'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/presentation/components/ui/label';
import { Input } from '@/presentation/components/ui/input';
import { Textarea } from '@/presentation/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Checkbox } from '@/presentation/components/ui/checkbox';
import { Switch } from '@/presentation/components/ui/switch';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/presentation/components/ui/button';
import { ValidationMessage } from './ValidationMessage';

export interface FormFieldProps {
  id: string;
  label?: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'tel'
    | 'url'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'switch';
  placeholder?: string;
  value?: string | boolean;
  onChange?: (value: string | boolean) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  description?: string;
  options?: Array<{ value: string; label: string; disabled?: boolean }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  showPasswordToggle?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const FormField: React.FC<FormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  required = false,
  disabled = false,
  className,
  description,
  options = [],
  rows = 3,
  min,
  max,
  step,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');

  const handleChange = (newValue: string | boolean) => {
    setInternalValue(
      typeof newValue === 'boolean' ? String(newValue) : newValue
    );
    onChange?.(newValue);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            placeholder={placeholder}
            value={internalValue as string}
            onChange={e => handleChange(e.target.value)}
            onBlur={onBlur}
            disabled={disabled}
            rows={rows}
            className={cn(
              sizeClasses[size],
              error && 'border-red-500 focus:border-red-500',
              className
            )}
          />
        );

      case 'select':
        return (
          <Select
            value={internalValue as string}
            onValueChange={handleChange}
            disabled={disabled}
          >
            <SelectTrigger
              className={cn(
                sizeClasses[size],
                error && 'border-red-500 focus:border-red-500',
                className
              )}
            >
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map(option => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  disabled={Boolean(option.disabled)}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={id}
              checked={internalValue as boolean}
              onCheckedChange={handleChange}
              disabled={disabled}
              className={cn(error && 'border-red-500')}
            />
            {label && (
              <Label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  error && 'text-red-600'
                )}
              >
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </Label>
            )}
          </div>
        );

      case 'switch':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={id}
              checked={internalValue as boolean}
              onCheckedChange={handleChange}
              disabled={disabled}
            />
            {label && (
              <Label
                htmlFor={id}
                className={cn(
                  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                  error && 'text-red-600'
                )}
              >
                {label}
                {required && <span className="ml-1 text-red-500">*</span>}
              </Label>
            )}
          </div>
        );

      default:
        return (
          <div className="relative">
            {leftIcon && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                {leftIcon}
              </div>
            )}
            <Input
              id={id}
              type={inputType}
              placeholder={placeholder}
              value={internalValue as string}
              onChange={e => handleChange(e.target.value)}
              onBlur={onBlur}
              disabled={disabled}
              min={min}
              max={max}
              step={step}
              className={cn(
                sizeClasses[size],
                leftIcon && 'pl-10',
                (rightIcon || (type === 'password' && showPasswordToggle)) &&
                  'pr-10',
                error && 'border-red-500 focus:border-red-500',
                className
              )}
            />
            {type === 'password' && showPasswordToggle && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={disabled}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            )}
            {rightIcon && !showPasswordToggle && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400">
                {rightIcon}
              </div>
            )}
          </div>
        );
    }
  };

  if (type === 'checkbox' || type === 'switch') {
    return (
      <div className={cn('space-y-2', className)}>
        {renderInput()}
        {description && <p className="text-sm text-gray-600">{description}</p>}
        {error && <ValidationMessage message={error} type="error" size="sm" />}
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            error && 'text-red-600'
          )}
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </Label>
      )}
      {renderInput()}
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {error && <ValidationMessage message={error} type="error" size="sm" />}
    </div>
  );
};

export default FormField;
