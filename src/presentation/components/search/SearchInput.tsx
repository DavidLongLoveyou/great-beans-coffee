'use client';

import { Search, X, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';

import { Input } from '@/presentation/components/ui/input';
import { Button } from '@/presentation/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/presentation/components/ui/popover';
import { Badge } from '@/presentation/components/ui/badge';
import { cn } from '@/shared/utils/cn';

interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'popular' | 'trending' | 'category' | 'tag';
  count?: number;
  url?: string;
  description?: string;
}

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  className?: string;
  showSuggestions?: boolean;
  suggestions?: SearchSuggestion[];
  recentSearches?: string[];
  popularSearches?: string[];
  debounceMs?: number;
  maxSuggestions?: number;
  disabled?: boolean;
  loading?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'hero' | 'compact';
}

export function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Search coffee products, origins, reports...',
  className,
  showSuggestions = true,
  suggestions = [],
  recentSearches = [],
  popularSearches = [],
  debounceMs = 300,
  maxSuggestions = 8,
  disabled = false,
  loading = false,
  size = 'md',
  variant = 'default',
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Debounce the input value
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceMs);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, debounceMs]);

  // Call onSearch when debounced value changes
  useEffect(() => {
    if (onSearch && debouncedValue !== value) {
      onSearch(debouncedValue);
    }
  }, [debouncedValue, onSearch, value]);

  // Generate combined suggestions
  const combinedSuggestions = useCallback(() => {
    const allSuggestions: SearchSuggestion[] = [];

    // Add recent searches
    if (recentSearches.length > 0 && !value.trim()) {
      recentSearches.slice(0, 3).forEach((search, index) => {
        allSuggestions.push({
          id: `recent-${index}`,
          text: search,
          type: 'recent',
        });
      });
    }

    // Add popular searches
    if (popularSearches.length > 0 && !value.trim()) {
      popularSearches.slice(0, 3).forEach((search, index) => {
        allSuggestions.push({
          id: `popular-${index}`,
          text: search,
          type: 'popular',
        });
      });
    }

    // Add dynamic suggestions based on input
    if (value.trim()) {
      suggestions
        .filter(s => s.text.toLowerCase().includes(value.toLowerCase()))
        .slice(0, maxSuggestions - allSuggestions.length)
        .forEach(suggestion => {
          allSuggestions.push(suggestion);
        });
    }

    return allSuggestions.slice(0, maxSuggestions);
  }, [value, suggestions, recentSearches, popularSearches, maxSuggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    
    if (showSuggestions) {
      setIsOpen(newValue.length > 0 || recentSearches.length > 0 || popularSearches.length > 0);
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    onChange(suggestion.text);
    setIsOpen(false);
    if (onSearch) {
      onSearch(suggestion.text);
    }
    inputRef.current?.focus();
  };

  const handleClear = () => {
    onChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsOpen(false);
      if (onSearch) {
        onSearch(value);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  const currentSuggestions = combinedSuggestions();

  // Size variants
  const sizeClasses = {
    sm: 'h-9',
    md: 'h-11',
    lg: 'h-14'
  };

  const iconSizeClasses = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const paddingClasses = {
    sm: 'pl-8 pr-8',
    md: 'pl-10 pr-10',
    lg: 'pl-12 pr-12'
  };

  // Variant styles
  const variantClasses = {
    default: 'border-gray-200 bg-white shadow-sm',
    hero: 'border-gray-300 bg-white/95 backdrop-blur-sm shadow-lg',
    compact: 'border-gray-200 bg-gray-50'
  };

  const containerClasses = cn(
    'relative group transition-all duration-200',
    variant === 'hero' && 'transform hover:scale-[1.02]',
    className
  );

  const inputWrapperClasses = cn(
    'relative transition-all duration-200',
    isFocused && variant === 'hero' && 'ring-2 ring-amber-500/20 ring-offset-2',
    isFocused && variant === 'default' && 'ring-2 ring-blue-500/20',
    'rounded-lg overflow-hidden'
  );

  return (
    <div className={containerClasses}>
      <Popover open={isOpen && showSuggestions} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <div className={inputWrapperClasses}>
            <div className="relative">
              {/* Search Icon */}
              <div className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 transition-colors duration-200',
                size === 'lg' && 'left-4',
                isFocused ? 'text-amber-600' : 'text-gray-400'
              )}>
                <Search className={iconSizeClasses[size]} />
              </div>

              {/* Input Field */}
              <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  setIsFocused(true);
                  if (showSuggestions && currentSuggestions.length > 0) {
                    setIsOpen(true);
                  }
                }}
                onBlur={() => setIsFocused(false)}
                placeholder={placeholder}
                disabled={disabled}
                className={cn(
                  sizeClasses[size],
                  paddingClasses[size],
                  variantClasses[variant],
                  'border-0 focus:ring-0 focus:border-0 transition-all duration-200',
                  'placeholder:text-gray-500 text-gray-900',
                  variant === 'hero' && 'text-lg placeholder:text-gray-400',
                  loading && 'animate-pulse',
                  disabled && 'opacity-50 cursor-not-allowed'
                )}
              />

              {/* Clear Button */}
              {value && !loading && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className={cn(
                    'absolute right-2 top-1/2 -translate-y-1/2 p-1.5',
                    'hover:bg-gray-100 transition-all duration-200',
                    'opacity-0 group-hover:opacity-100 focus:opacity-100',
                    size === 'lg' && 'right-3 p-2'
                  )}
                >
                  <X className={cn(iconSizeClasses[size], 'text-gray-400')} />
                </Button>
              )}

              {/* Loading Spinner */}
              {loading && (
                <div className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  size === 'lg' && 'right-4'
                )}>
                  <div className={cn(
                    'animate-spin rounded-full border-2 border-gray-300 border-t-amber-600',
                    iconSizeClasses[size]
                  )} />
                </div>
              )}

              {/* Focus Ring Effect */}
              <div className={cn(
                'absolute inset-0 rounded-lg pointer-events-none transition-all duration-200',
                isFocused && variant === 'hero' && 'bg-gradient-to-r from-amber-500/5 to-orange-500/5',
                'opacity-0 group-hover:opacity-100'
              )} />
            </div>
          </div>
        </PopoverTrigger>

        {/* Suggestions Dropdown */}
        {currentSuggestions.length > 0 && (
          <PopoverContent
            className={cn(
              'w-full p-0 border-0 shadow-xl',
              'bg-white/95 backdrop-blur-sm',
              'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2',
              'duration-200'
            )}
            align="start"
            side="bottom"
            sideOffset={8}
          >
            <div className="max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {currentSuggestions.map((suggestion, index) => (
                <button
                  key={suggestion.id}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-3 text-left',
                    'hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50',
                    'focus:bg-gradient-to-r focus:from-amber-50 focus:to-orange-50',
                    'focus:outline-none transition-all duration-150',
                    'border-b border-gray-100 last:border-b-0',
                    'group/item'
                  )}
                  style={{
                    animationDelay: `${index * 50}ms`
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 transition-colors duration-150 group-hover/item:text-amber-600">
                    {suggestion.type === 'recent' && (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                    {suggestion.type === 'popular' && (
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                    )}
                    {suggestion.type === 'trending' && (
                      <Sparkles className="h-4 w-4 text-gray-400" />
                    )}
                    {(suggestion.type === 'category' || suggestion.type === 'tag') && (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <span className="text-sm text-gray-900 group-hover/item:text-gray-800 transition-colors duration-150">
                      {suggestion.text}
                    </span>
                    {suggestion.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {suggestion.description}
                      </p>
                    )}
                  </div>

                  {/* Badges */}
                  <div className="flex-shrink-0 flex items-center gap-1">
                    {suggestion.type === 'recent' && (
                      <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                        Recent
                      </Badge>
                    )}
                    {suggestion.type === 'popular' && (
                      <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 border-green-200">
                        Popular
                      </Badge>
                    )}
                    {suggestion.type === 'trending' && (
                      <Badge variant="secondary" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
                        Trending
                      </Badge>
                    )}
                    {suggestion.count && (
                      <Badge variant="outline" className="text-xs text-gray-600">
                        {suggestion.count}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Footer */}
            {!value.trim() && (recentSearches.length > 0 || popularSearches.length > 0) && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-3">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {recentSearches.length > 0 ? 'Recent searches' : 'Popular searches'}
                </p>
              </div>
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}