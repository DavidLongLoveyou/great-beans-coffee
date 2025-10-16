'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import type { LucideIcon } from 'lucide-react';

// Icon loading cache
const iconCache = new Map<string, ComponentType<any>>();

// Dynamic icon loader function
const loadIcon = (iconName: string): ComponentType<any> => {
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!;
  }

  const IconComponent = lazy(async () => {
    try {
      const module = await import('lucide-react');
      const Icon = (module as any)[iconName];
      
      if (!Icon) {
        console.warn(`Icon "${iconName}" not found in lucide-react`);
        // Return a fallback icon
        return { default: module.HelpCircle };
      }
      
      return { default: Icon };
    } catch (error) {
      console.error(`Failed to load icon "${iconName}":`, error);
      // Return a fallback icon
      const module = await import('lucide-react');
      return { default: module.HelpCircle };
    }
  });

  iconCache.set(iconName, IconComponent);
  return IconComponent;
};

// Dynamic Icon component
interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  [key: string]: any;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ 
  name, 
  className, 
  size = 24, 
  color, 
  strokeWidth = 2,
  ...props 
}) => {
  const IconComponent = loadIcon(name);

  return (
    <Suspense fallback={<div className={`w-6 h-6 ${className || ''}`} />}>
      <IconComponent
        className={className}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        {...props}
      />
    </Suspense>
  );
};

// Pre-defined commonly used icons for better performance
export const Activity = loadIcon('Activity');
export const AlertCircle = loadIcon('AlertCircle');
export const AlertTriangle = loadIcon('AlertTriangle');
export const Archive = loadIcon('Archive');
export const ArrowDown = loadIcon('ArrowDown');
export const ArrowDownRight = loadIcon('ArrowDownRight');
export const ArrowLeft = loadIcon('ArrowLeft');
export const ArrowRight = loadIcon('ArrowRight');
export const ArrowUp = loadIcon('ArrowUp');
export const ArrowUpDown = loadIcon('ArrowUpDown');
export const ArrowUpRight = loadIcon('ArrowUpRight');
export const Award = loadIcon('Award');
export const BarChart3 = loadIcon('BarChart3');
export const Bell = loadIcon('Bell');
export const Bold = loadIcon('Bold');
export const BookOpen = loadIcon('BookOpen');
export const Briefcase = loadIcon('Briefcase');
export const Building = loadIcon('Building');
export const Building2 = loadIcon('Building2');
export const Calculator = loadIcon('Calculator');
export const Calendar = loadIcon('Calendar');
export const CalendarDays = loadIcon('CalendarDays');
export const Camera = loadIcon('Camera');
export const Check = loadIcon('Check');
export const CheckCircle = loadIcon('CheckCircle');
export const ChevronDown = loadIcon('ChevronDown');
export const ChevronLeft = loadIcon('ChevronLeft');
export const ChevronRight = loadIcon('ChevronRight');
export const ChevronUp = loadIcon('ChevronUp');
export const ChevronsLeft = loadIcon('ChevronsLeft');
export const ChevronsRight = loadIcon('ChevronsRight');
export const Circle = loadIcon('Circle');
export const Clock = loadIcon('Clock');
export const CloudRain = loadIcon('CloudRain');
export const Code = loadIcon('Code');
export const Coffee = loadIcon('Coffee');
export const Copy = loadIcon('Copy');
export const CreditCard = loadIcon('CreditCard');
export const Crown = loadIcon('Crown');
export const DollarSign = loadIcon('DollarSign');
export const Download = loadIcon('Download');
export const Droplets = loadIcon('Droplets');
export const Edit = loadIcon('Edit');
export const ExternalLink = loadIcon('ExternalLink');
export const Eye = loadIcon('Eye');
export const EyeOff = loadIcon('EyeOff');
export const Factory = loadIcon('Factory');
export const FileCheck = loadIcon('FileCheck');
export const FileStack = loadIcon('FileStack');
export const FileText = loadIcon('FileText');
export const Filter = loadIcon('Filter');
export const Flame = loadIcon('Flame');
export const Gauge = loadIcon('Gauge');
export const Globe = loadIcon('Globe');
export const Grid3X3 = loadIcon('Grid3X3');
export const HardDrive = loadIcon('HardDrive');
export const Hash = loadIcon('Hash');
export const Heading1 = loadIcon('Heading1');
export const Heading2 = loadIcon('Heading2');
export const Heading3 = loadIcon('Heading3');
export const Heart = loadIcon('Heart');
export const HelpCircle = loadIcon('HelpCircle');
export const Home = loadIcon('Home');
export const Image = loadIcon('Image');
export const Info = loadIcon('Info');
export const Italic = loadIcon('Italic');
export const Key = loadIcon('Key');
export const Layers = loadIcon('Layers');
export const LayoutDashboard = loadIcon('LayoutDashboard');
export const Leaf = loadIcon('Leaf');
export const Lightbulb = loadIcon('Lightbulb');
export const LineChart = loadIcon('LineChart');
export const Link = loadIcon('Link');
export const List = loadIcon('List');
export const ListOrdered = loadIcon('ListOrdered');
export const Loader2 = loadIcon('Loader2');
export const Lock = loadIcon('Lock');
export const LogOut = loadIcon('LogOut');
export const Mail = loadIcon('Mail');
export const MapPin = loadIcon('MapPin');
export const Maximize = loadIcon('Maximize');
export const Maximize2 = loadIcon('Maximize2');
export const Menu = loadIcon('Menu');
export const MessageSquare = loadIcon('MessageSquare');
export const Minimize = loadIcon('Minimize');
export const Minus = loadIcon('Minus');
export const Monitor = loadIcon('Monitor');
export const MoreHorizontal = loadIcon('MoreHorizontal');
export const MoreVertical = loadIcon('MoreVertical');
export const Mountain = loadIcon('Mountain');
export const Package = loadIcon('Package');
export const Palette = loadIcon('Palette');
export const Paperclip = loadIcon('Paperclip');
export const Pause = loadIcon('Pause');
export const Percent = loadIcon('Percent');
export const Phone = loadIcon('Phone');
export const PieChart = loadIcon('PieChart');
export const Plane = loadIcon('Plane');
export const Play = loadIcon('Play');
export const Plus = loadIcon('Plus');
export const Quote = loadIcon('Quote');
export const Recycle = loadIcon('Recycle');
export const Redo = loadIcon('Redo');
export const RefreshCw = loadIcon('RefreshCw');
export const Rocket = loadIcon('Rocket');
export const RotateCw = loadIcon('RotateCw');
export const Save = loadIcon('Save');
export const Scale = loadIcon('Scale');
export const Search = loadIcon('Search');
export const Send = loadIcon('Send');
export const Settings = loadIcon('Settings');
export const Share = loadIcon('Share');
export const Share2 = loadIcon('Share2');
export const Shield = loadIcon('Shield');
export const Ship = loadIcon('Ship');
export const ShoppingCart = loadIcon('ShoppingCart');
export const SkipBack = loadIcon('SkipBack');
export const SkipForward = loadIcon('SkipForward');
export const SlidersHorizontal = loadIcon('SlidersHorizontal');
export const Smartphone = loadIcon('Smartphone');
export const SortAsc = loadIcon('ArrowUp');
export const SortDesc = loadIcon('ArrowDown');
export const Sparkles = loadIcon('Sparkles');
export const Sprout = loadIcon('Sprout');
export const Star = loadIcon('Star');
export const StarOff = loadIcon('StarOff');
export const Sun = loadIcon('Sun');
export const Tablet = loadIcon('Tablet');
export const Tag = loadIcon('Tag');
export const Target = loadIcon('Target');
export const Thermometer = loadIcon('Thermometer');
export const Trash2 = loadIcon('Trash2');
export const TreePine = loadIcon('TreePine');
export const TrendingDown = loadIcon('TrendingDown');
export const TrendingUp = loadIcon('TrendingUp');
export const Truck = loadIcon('Truck');
export const Undo = loadIcon('Undo');
export const Upload = loadIcon('Upload');
export const User = loadIcon('User');
export const UserCheck = loadIcon('UserCheck');
export const Users = loadIcon('Users');
export const Video = loadIcon('Video');
export const Volume2 = loadIcon('Volume2');
export const VolumeX = loadIcon('VolumeX');
export const Wind = loadIcon('Wind');
export const X = loadIcon('X');
export const XCircle = loadIcon('XCircle');
export const Zap = loadIcon('Zap');
export const ZoomIn = loadIcon('ZoomIn');
export const ZoomOut = loadIcon('ZoomOut');

// Icon aliases for compatibility
export const SearchIcon = loadIcon('Search');
export const SortAscIcon = loadIcon('ArrowUp');
export const SortDescIcon = loadIcon('ArrowDown');
export const GridIcon = loadIcon('Grid3X3');
export const ListIcon = loadIcon('List');
export const LoaderIcon = loadIcon('Loader2');
export const CalendarIcon = loadIcon('Calendar');
export const FilterIcon = loadIcon('Filter');
export const XIcon = loadIcon('X');

// Export the LucideIcon type for compatibility
export type { LucideIcon } from 'lucide-react';

// Helper function to create icon components
export const createIcon = (iconName: string) => loadIcon(iconName);

// Batch icon loader for multiple icons
export const loadIcons = (iconNames: string[]) => {
  return iconNames.reduce((acc, name) => {
    acc[name] = loadIcon(name);
    return acc;
  }, {} as Record<string, ComponentType<any>>);
};