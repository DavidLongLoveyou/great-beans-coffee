'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
  description?: string;
}

interface StaggeredMenuProps {
  items?: MenuItem[];
  trigger?: React.ReactNode;
  className?: string;
  menuClassName?: string;
  itemClassName?: string;
  direction?: 'down' | 'up' | 'left' | 'right';
  staggerDelay?: number;
  animationDuration?: number;
  isOpen?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export const StaggeredMenu: React.FC<StaggeredMenuProps> = ({
  items = [],
  trigger,
  className,
  menuClassName,
  itemClassName,
  direction = 'down',
  staggerDelay = 0.1,
  animationDuration = 0.3,
  isOpen: externalIsOpen,
  onClose,
  children,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        if (onClose) {
          onClose();
        } else {
          setInternalIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const getMenuVariants = () => {
    switch (direction) {
      case 'up':
        return {
          hidden: { opacity: 0, scale: 0.95, y: 10 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: animationDuration,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            y: 10,
            transition: {
              duration: animationDuration * 0.7,
            },
          },
        };
      case 'down':
        return {
          hidden: { opacity: 0, scale: 0.95, y: -10 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              duration: animationDuration,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            y: -10,
            transition: {
              duration: animationDuration * 0.7,
            },
          },
        };
      case 'left':
        return {
          hidden: { opacity: 0, scale: 0.95, x: 10 },
          visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
              duration: animationDuration,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            x: 10,
            transition: {
              duration: animationDuration * 0.7,
            },
          },
        };
      case 'right':
        return {
          hidden: { opacity: 0, scale: 0.95, x: -10 },
          visible: {
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
              duration: animationDuration,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            x: -10,
            transition: {
              duration: animationDuration * 0.7,
            },
          },
        };
      default:
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: animationDuration,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.95,
            transition: {
              duration: animationDuration * 0.7,
            },
          },
        };
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 10 : -10,
      scale: 0.95,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: index * staggerDelay,
        duration: animationDuration,
      },
    }),
    exit: (index: number) => ({
      opacity: 0,
      y: direction === 'up' ? 10 : -10,
      scale: 0.95,
      transition: {
        delay: (items?.length || 0 - 1 - index) * (staggerDelay * 0.5),
        duration: animationDuration * 0.7,
      },
    }),
  };

  const handleToggle = () => {
    if (onClose && isOpen) {
      onClose();
    } else if (!onClose) {
      setInternalIsOpen(!internalIsOpen);
    }
  };

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      {trigger && (
        <div
          onClick={handleToggle}
          className="cursor-pointer"
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleToggle();
            }
          }}
        >
          {trigger}
        </div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={getMenuVariants()}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={cn(
              'absolute z-50 min-w-[200px] rounded-lg border bg-white/95 shadow-lg backdrop-blur-md',
              'dark:border-gray-700 dark:bg-gray-900/95',
              direction === 'down' && 'top-full mt-2',
              direction === 'up' && 'bottom-full mb-2',
              direction === 'left' && 'right-full mr-2',
              direction === 'right' && 'left-full ml-2',
              menuClassName
            )}
          >
            {children ? (
              children
            ) : (
              <div className="p-2">
                {items.map((item, index) => (
                  <motion.div
                    key={item.href}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={index}
                  >
                    <Link
                      href={item.href}
                      onClick={() => {
                        if (onClose) {
                          onClose();
                        } else {
                          setInternalIsOpen(false);
                        }
                      }}
                      className={cn(
                        'flex items-center gap-3 rounded-md px-3 py-2 text-sm',
                        'hover:bg-gray-100 dark:hover:bg-gray-800',
                        'transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500',
                        itemClassName
                      )}
                    >
                      {item.icon && (
                        <span className="h-4 w-4 flex-shrink-0 text-gray-500 dark:text-gray-400">
                          {item.icon}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;
