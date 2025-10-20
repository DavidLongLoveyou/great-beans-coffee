import React from 'react';

// Mock dynamic icons for testing
const createMockIcon = (name: string) => {
  const MockIcon = ({
    className,
    ...props
  }: {
    className?: string;
    [key: string]: unknown;
  }) => (
    <div
      data-testid={`${name.toLowerCase()}-icon`}
      className={className}
      {...props}
    />
  );
  MockIcon.displayName = name;
  return MockIcon;
};

export const DynamicIcon = ({
  name,
  className,
  ...props
}: {
  name: string;
  className?: string;
  [key: string]: unknown;
}) => (
  <div
    data-testid={`${name.toLowerCase()}-icon`}
    className={className}
    {...props}
  />
);

// Export all commonly used icons
export const Search = createMockIcon('Search');
export const TrendingUp = createMockIcon('TrendingUp');
export const AlertTriangle = createMockIcon('AlertTriangle');
export const CheckCircle = createMockIcon('CheckCircle');
export const XCircle = createMockIcon('XCircle');
export const Info = createMockIcon('Info');
export const Download = createMockIcon('Download');
export const RefreshCw = createMockIcon('RefreshCw');
export const Globe = createMockIcon('Globe');
export const Zap = createMockIcon('Zap');
export const Eye = createMockIcon('Eye');
export const Target = createMockIcon('Target');
export const Activity = createMockIcon('Activity');
export const AlertCircle = createMockIcon('AlertCircle');
export const BarChart3 = createMockIcon('BarChart3');
export const Clock = createMockIcon('Clock');
export const FileText = createMockIcon('FileText');
export const Link = createMockIcon('Link');
export const Settings = createMockIcon('Settings');
export const Users = createMockIcon('Users');
export const ArrowUp = createMockIcon('ArrowUp');
export const ArrowDown = createMockIcon('ArrowDown');
export const Calendar = createMockIcon('Calendar');
export const ExternalLink = createMockIcon('ExternalLink');
export const Filter = createMockIcon('Filter');
export const Home = createMockIcon('Home');
export const Menu = createMockIcon('Menu');
export const Plus = createMockIcon('Plus');
export const Refresh = createMockIcon('Refresh');
export const Star = createMockIcon('Star');
export const X = createMockIcon('X');
