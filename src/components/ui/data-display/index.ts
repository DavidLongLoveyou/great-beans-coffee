// Data Display Components
export { default as DataTable } from '../DataTable';
export type { Column as DataTableColumn } from '../DataTable';

export {
  default as StatusBadge,
  OrderStatusBadge,
  PaymentStatusBadge,
  InventoryStatusBadge,
  SecurityLevelBadge,
  ContentStatusBadge,
  TrendBadge,
  type StatusBadgeProps,
} from '../StatusBadge';

// Re-export Badge component for convenience
export { Badge } from '@/presentation/components/ui/badge';

// Re-export Table components for data display
export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';

// Re-export Card components for data display
export {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

// Re-export Progress component for data visualization
export { Progress } from '@/presentation/components/ui/progress';

// Re-export Avatar components for user data display
export {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';

// Re-export Separator for data organization
export { Separator } from '@/presentation/components/ui/separator';

// Re-export Skeleton for loading states
export { Skeleton } from '@/presentation/components/ui/skeleton';