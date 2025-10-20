import dynamic from 'next/dynamic';

// Loading components for better UX
const LoadingSpinner = () => (
  <div className="h-8 w-24 animate-pulse rounded bg-muted" />
);

const LoadingCard = () => (
  <div className="h-32 w-full animate-pulse rounded bg-muted" />
);

const LoadingTable = () => (
  <div className="h-96 w-full animate-pulse rounded bg-muted" />
);

// Heavy UI components loaded dynamically - only existing components
export const DynamicDataTable = dynamic(() => import('./DataTable'), {
  loading: LoadingTable,
  ssr: false,
});

export const DynamicBulkPricingCalculator = dynamic(
  () =>
    import('./BulkPricingCalculator').then(mod => ({
      default: mod.BulkPricingCalculator,
    })),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

export const DynamicLogisticsCostEstimator = dynamic(
  () =>
    import('./LogisticsCostEstimator').then(mod => ({
      default: mod.LogisticsCostEstimator,
    })),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

export const DynamicTrendIndicator = dynamic(
  () =>
    import('./TrendIndicator').then(mod => ({ default: mod.TrendIndicator })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicCalloutBox = dynamic(
  () => import('./CalloutBox').then(mod => ({ default: mod.CalloutBox })),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

// Presentation UI components
export const DynamicCalendar = dynamic(
  () =>
    import('@/presentation/components/ui/calendar').then(mod => ({
      default: mod.Calendar,
    })),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

export const DynamicDialog = dynamic(
  () =>
    import('@/presentation/components/ui/dialog').then(mod => ({
      default: mod.Dialog,
    })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicDropdownMenu = dynamic(
  () =>
    import('@/presentation/components/ui/dropdown-menu').then(mod => ({
      default: mod.DropdownMenu,
    })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

export const DynamicPopover = dynamic(
  () =>
    import('@/presentation/components/ui/popover').then(mod => ({
      default: mod.Popover,
    })),
  {
    loading: LoadingSpinner,
    ssr: false,
  }
);

// Multimedia components
export const DynamicVideoPlayer = dynamic(
  () =>
    import('../../presentation/components/multimedia/VideoPlayer').then(
      mod => ({ default: mod.VideoPlayer })
    ),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

export const DynamicMediaCarousel = dynamic(
  () =>
    import('../../presentation/components/multimedia/MediaCarousel').then(
      mod => ({ default: mod.MediaCarousel })
    ),
  {
    loading: LoadingCard,
    ssr: false,
  }
);

export const DynamicComponents = {
  DataTable: DynamicDataTable,
  Calendar: DynamicCalendar,
  Dialog: DynamicDialog,
  DropdownMenu: DynamicDropdownMenu,
  Popover: DynamicPopover,
  BulkPricingCalculator: DynamicBulkPricingCalculator,
  LogisticsCostEstimator: DynamicLogisticsCostEstimator,
  TrendIndicator: DynamicTrendIndicator,
  CalloutBox: DynamicCalloutBox,
  VideoPlayer: DynamicVideoPlayer,
  MediaCarousel: DynamicMediaCarousel,
};
