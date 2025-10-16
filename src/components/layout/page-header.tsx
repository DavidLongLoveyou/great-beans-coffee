import React from 'react';
import { Typography } from '@/presentation/components/ui/typography';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ComponentType<any>;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
          <Typography
            variant="h1"
            className="text-2xl font-bold tracking-tight"
          >
            {title}
          </Typography>
        </div>
        {description && (
          <Typography variant="muted" className="text-muted-foreground">
            {description}
          </Typography>
        )}
      </div>
      {children && (
        <div className="flex items-center space-x-2">{children}</div>
      )}
    </div>
  );
}
