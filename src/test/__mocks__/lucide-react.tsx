import React from 'react';

// Mock all lucide-react icons
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

export const Activity = createMockIcon('Activity');
export const AlertCircle = createMockIcon('AlertCircle');
export const AlertTriangle = createMockIcon('AlertTriangle');
export const BarChart3 = createMockIcon('BarChart3');
export const CheckCircle = createMockIcon('CheckCircle');
export const Clock = createMockIcon('Clock');
export const Eye = createMockIcon('Eye');
export const FileText = createMockIcon('FileText');
export const Globe = createMockIcon('Globe');
export const Info = createMockIcon('Info');
export const Link = createMockIcon('Link');
export const Search = createMockIcon('Search');
export const Settings = createMockIcon('Settings');
export const TrendingUp = createMockIcon('TrendingUp');
export const Users = createMockIcon('Users');
export const Zap = createMockIcon('Zap');
export const ArrowUp = createMockIcon('ArrowUp');
export const ArrowDown = createMockIcon('ArrowDown');
export const Calendar = createMockIcon('Calendar');
export const Download = createMockIcon('Download');
export const ExternalLink = createMockIcon('ExternalLink');
export const Filter = createMockIcon('Filter');
export const Home = createMockIcon('Home');
export const Menu = createMockIcon('Menu');
export const Plus = createMockIcon('Plus');
export const Refresh = createMockIcon('Refresh');
export const Star = createMockIcon('Star');
export const Target = createMockIcon('Target');
export const X = createMockIcon('X');
