'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from '@/components/ui/icons';

// Loading component
const ChartLoader = () => (
  <div className="flex h-64 items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

// Dynamic imports for recharts components
export const DynamicLineChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.LineChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicAreaChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.AreaChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicBarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.BarChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicPieChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PieChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicResponsiveContainer = dynamic(
  () => import('recharts').then(mod => ({ default: mod.ResponsiveContainer })),
  {
    loading: () => <div className="h-64" />,
    ssr: false,
  }
) as any;

// Export other commonly used components
export const DynamicLine = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Line })),
  { ssr: false }
) as any;

export const DynamicArea = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Area })),
  { ssr: false }
) as any;

export const DynamicBar = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Bar })),
  { ssr: false }
) as any;

export const DynamicPie = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Pie })),
  { ssr: false }
) as any;

export const DynamicCell = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Cell })),
  { ssr: false }
) as any;

export const DynamicXAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.XAxis })),
  { ssr: false }
) as any;

export const DynamicYAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.YAxis })),
  { ssr: false }
) as any;

export const DynamicCartesianGrid = dynamic(
  () => import('recharts').then(mod => ({ default: mod.CartesianGrid })),
  { ssr: false }
) as any;

export const DynamicTooltip = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Tooltip })),
  { ssr: false }
) as any;

export const DynamicLegend = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Legend as any })),
  { ssr: false }
) as any;

export const DynamicPolarGrid = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PolarGrid })),
  { ssr: false }
) as any;

export const DynamicPolarAngleAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PolarAngleAxis })),
  { ssr: false }
) as any;

export const DynamicPolarRadiusAxis = dynamic(
  () => import('recharts').then(mod => ({ default: mod.PolarRadiusAxis })),
  { ssr: false }
) as any;

export const DynamicComposedChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.ComposedChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicRadarChart = dynamic(
  () => import('recharts').then(mod => ({ default: mod.RadarChart })),
  {
    loading: ChartLoader,
    ssr: false,
  }
) as any;

export const DynamicRadar = dynamic(
  () => import('recharts').then(mod => ({ default: mod.Radar })),
  { ssr: false }
) as any;
