// Design System Types
// Professional B2B Coffee Industry Design System

import { ReactNode, HTMLAttributes } from 'react';

// Base Design System Props
export interface DesignSystemProps {
  className?: string;
  children?: ReactNode;
}

// Component Props Base
export interface ComponentProps extends HTMLAttributes<HTMLElement> {
  className?: string;
  children?: ReactNode;
}

// Color Variants
export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'forest'
  | 'sage'
  | 'emerald'
  | 'coffee'
  | 'gold'
  | 'bean'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'muted'
  | 'destructive';

// Coffee-specific color variants
export type CoffeeColorVariant =
  | 'coffee-50'
  | 'coffee-100'
  | 'coffee-200'
  | 'coffee-300'
  | 'coffee-400'
  | 'coffee-500'
  | 'coffee-600'
  | 'coffee-700'
  | 'coffee-800'
  | 'coffee-900'
  | 'coffee-950';

// Size Variants
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

// Spacing Variants
export type SpacingVariant =
  | 'none'
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

// Typography Variants
export type TypographyVariant =
  | 'display-2xl'
  | 'display-xl'
  | 'display-lg'
  | 'display-md'
  | 'display-sm'
  | 'heading-xl'
  | 'heading-lg'
  | 'heading-md'
  | 'heading-sm'
  | 'body-xl'
  | 'body-lg'
  | 'body-md'
  | 'body-sm'
  | 'caption'
  | 'overline';

// Font Weight Variants
export type FontWeightVariant =
  | 'light'
  | 'normal'
  | 'medium'
  | 'semibold'
  | 'bold'
  | 'extrabold';

// Button Variants
export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'forest'
  | 'forest-outline'
  | 'forest-soft'
  | 'sage'
  | 'sage-outline'
  | 'sage-soft'
  | 'emerald'
  | 'emerald-outline'
  | 'emerald-glow'
  | 'coffee'
  | 'gold'
  | 'destructive';

// Card Variants
export type CardVariant =
  | 'default'
  | 'elevated'
  | 'outlined'
  | 'coffee'
  | 'premium'
  | 'product';

// Badge Variants
export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'outline'
  | 'coffee'
  | 'gold'
  | 'bean'
  | 'success'
  | 'warning'
  | 'error'
  | 'certification';

// Alert Variants
export type AlertVariant = 'info' | 'success' | 'warning' | 'error' | 'coffee';

// Animation Variants
export type AnimationVariant =
  | 'fade-in'
  | 'slide-in-left'
  | 'slide-in-right'
  | 'slide-in-up'
  | 'slide-in-down'
  | 'scale-in'
  | 'coffee-steam';

// Coffee Industry Specific Types

// Coffee Origins
export type CoffeeOrigin =
  | 'vietnam'
  | 'brazil'
  | 'colombia'
  | 'ethiopia'
  | 'guatemala'
  | 'honduras'
  | 'peru'
  | 'indonesia'
  | 'india'
  | 'costa-rica'
  | 'nicaragua'
  | 'ecuador'
  | 'mexico'
  | 'panama'
  | 'jamaica';

// Coffee Varieties
export type CoffeeVariety =
  | 'robusta'
  | 'arabica'
  | 'typica'
  | 'bourbon'
  | 'caturra'
  | 'catuai'
  | 'mundo-novo'
  | 'geisha'
  | 'pacamara'
  | 'maragogype';

// Processing Methods
export type ProcessingMethod =
  | 'washed'
  | 'natural'
  | 'honey'
  | 'semi-washed'
  | 'wet-hulled'
  | 'anaerobic'
  | 'carbonic-maceration';

// Coffee Grades
export type CoffeeGrade =
  | 'specialty'
  | 'premium'
  | 'exchange'
  | 'standard'
  | 'grade-1'
  | 'grade-2'
  | 'grade-3'
  | 'grade-4'
  | 'screen-18'
  | 'screen-16'
  | 'screen-14';

// Certifications
export type CoffeeCertification =
  | 'organic'
  | 'fair-trade'
  | 'rainforest-alliance'
  | 'utz'
  | 'bird-friendly'
  | 'shade-grown'
  | 'direct-trade'
  | 'c-cafe'
  | '4c'
  | 'iso-22000'
  | 'haccp'
  | 'brc'
  | 'ifs';

// Tasting Notes Categories
export type TastingNoteCategory =
  | 'fruity'
  | 'floral'
  | 'sweet'
  | 'nutty'
  | 'chocolatey'
  | 'spicy'
  | 'earthy'
  | 'herbal'
  | 'citrus'
  | 'berry'
  | 'tropical'
  | 'wine-like'
  | 'caramel'
  | 'vanilla';

// Business Service Types
export type BusinessServiceType =
  | 'oem'
  | 'private-label'
  | 'sourcing'
  | 'roasting'
  | 'packaging'
  | 'logistics'
  | 'quality-control'
  | 'consulting';

// Incoterms
export type Incoterm =
  | 'exw'
  | 'fca'
  | 'cpt'
  | 'cip'
  | 'dat'
  | 'dap'
  | 'ddp'
  | 'fas'
  | 'fob'
  | 'cfr'
  | 'cif';

// RFQ Status
export type RFQStatus =
  | 'draft'
  | 'submitted'
  | 'under-review'
  | 'quoted'
  | 'negotiating'
  | 'accepted'
  | 'rejected'
  | 'expired';

// Component-specific Props

// Button Props
export interface ButtonProps extends ComponentProps {
  variant?: ButtonVariant;
  size?: SizeVariant;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Card Props
export interface CardProps extends ComponentProps {
  variant?: CardVariant;
  padding?: SpacingVariant;
  shadow?: boolean;
  hover?: boolean;
}

// Typography Props
export interface TypographyProps extends ComponentProps {
  variant?: TypographyVariant;
  color?: ColorVariant;
  weight?: FontWeightVariant;
  align?: 'left' | 'center' | 'right' | 'justify';
  truncate?: boolean;
  gradient?: boolean;
}

// Layout Props
export interface ContainerProps extends ComponentProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: SpacingVariant;
}

export interface SectionProps extends ComponentProps {
  padding?: SpacingVariant;
  background?: ColorVariant;
  pattern?: boolean;
}

export interface GridProps extends ComponentProps {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: SpacingVariant;
  responsive?: boolean;
}

// Coffee-specific Component Props
export interface CoffeeGradeIndicatorProps extends ComponentProps {
  grade: CoffeeGrade;
  size?: SizeVariant;
  showLabel?: boolean;
}

export interface CertificationBadgeProps extends ComponentProps {
  certification: CoffeeCertification;
  size?: SizeVariant;
  variant?: BadgeVariant;
}

export interface OriginFlagProps extends ComponentProps {
  origin: CoffeeOrigin;
  size?: SizeVariant;
  showLabel?: boolean;
}

export interface ProcessingMethodBadgeProps extends ComponentProps {
  method: ProcessingMethod;
  variant?: BadgeVariant;
}

export interface TastingNotesProps extends ComponentProps {
  notes: TastingNoteCategory[];
  limit?: number;
  interactive?: boolean;
}

// Form Props
export interface FormFieldProps extends ComponentProps {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export interface InputProps extends ComponentProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

// Media Props
export interface ImageProps extends ComponentProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Animation Props
export interface AnimationProps extends ComponentProps {
  variant?: AnimationVariant;
  duration?: number;
  delay?: number;
  repeat?: boolean;
  trigger?: 'hover' | 'scroll' | 'click' | 'load';
}
