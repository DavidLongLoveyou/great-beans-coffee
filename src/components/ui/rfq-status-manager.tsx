'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/presentation/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import { Textarea } from '@/presentation/components/ui/textarea';
import { Badge } from '@/presentation/components/ui/badge';
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  ArrowRight,
} from 'lucide-react';

export type RFQStatus =
  | 'pending'
  | 'processing'
  | 'quoted'
  | 'accepted'
  | 'rejected'
  | 'expired';

interface StatusTransition {
  from: RFQStatus;
  to: RFQStatus;
  label: string;
  requiresNote?: boolean;
  confirmationMessage?: string;
}

interface RFQStatusManagerProps {
  currentStatus: RFQStatus;
  rfqId: string;
  onStatusChange: (newStatus: RFQStatus, note?: string) => Promise<void>;
  disabled?: boolean;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    label: 'pending',
  },
  processing: {
    icon: AlertCircle,
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    label: 'processing',
  },
  quoted: {
    icon: FileText,
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    label: 'quoted',
  },
  accepted: {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 border-green-200',
    label: 'accepted',
  },
  rejected: {
    icon: XCircle,
    color: 'bg-red-100 text-red-800 border-red-200',
    label: 'rejected',
  },
  expired: {
    icon: XCircle,
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    label: 'expired',
  },
};

// Define allowed status transitions
const allowedTransitions: StatusTransition[] = [
  { from: 'pending', to: 'processing', label: 'Start Processing' },
  {
    from: 'pending',
    to: 'rejected',
    label: 'Reject Request',
    requiresNote: true,
    confirmationMessage: 'Are you sure you want to reject this RFQ?',
  },
  { from: 'processing', to: 'quoted', label: 'Provide Quote' },
  {
    from: 'processing',
    to: 'rejected',
    label: 'Reject Request',
    requiresNote: true,
    confirmationMessage: 'Are you sure you want to reject this RFQ?',
  },
  { from: 'quoted', to: 'accepted', label: 'Mark as Accepted' },
  {
    from: 'quoted',
    to: 'rejected',
    label: 'Mark as Rejected',
    requiresNote: true,
  },
  { from: 'quoted', to: 'expired', label: 'Mark as Expired' },
];

export function RFQStatusBadge({ status }: { status: RFQStatus }) {
  const t = useTranslations('rfq.status');
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge
        variant="outline"
        className="flex items-center gap-1 border-gray-200 bg-gray-100 text-gray-800"
      >
        <AlertCircle className="h-3 w-3" />
        {status}
      </Badge>
    );
  }

  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1`}
    >
      <Icon className="h-3 w-3" />
      {t(config.label)}
    </Badge>
  );
}

export function RFQStatusManager({
  currentStatus,
  rfqId,
  onStatusChange,
  disabled = false,
}: RFQStatusManagerProps) {
  const t = useTranslations('statusManager');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTransition, setSelectedTransition] =
    useState<StatusTransition | null>(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Get available transitions for current status
  const availableTransitions = allowedTransitions.filter(
    transition => transition.from === currentStatus
  );

  const handleTransitionSelect = (transition: StatusTransition) => {
    setSelectedTransition(transition);
    setNote('');
    setIsDialogOpen(true);
  };

  const handleConfirmTransition = async () => {
    if (!selectedTransition) return;

    setIsLoading(true);
    try {
      await onStatusChange(selectedTransition.to, note || undefined);
      setIsDialogOpen(false);
      setSelectedTransition(null);
      setNote('');
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsDialogOpen(false);
    setSelectedTransition(null);
    setNote('');
  };

  if (availableTransitions.length === 0 || disabled) {
    return <RFQStatusBadge status={currentStatus} />;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <RFQStatusBadge status={currentStatus} />

      {availableTransitions.length === 1 && availableTransitions[0] ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleTransitionSelect(availableTransitions[0]!)}
          className="flex w-full items-center justify-center gap-1 sm:w-auto"
        >
          <ArrowRight className="h-3 w-3" />
          <span className="truncate">{availableTransitions[0].label}</span>
        </Button>
      ) : (
        <Select
          onValueChange={value => {
            const transition = availableTransitions.find(
              t => `${t.from}-${t.to}` === value
            );
            if (transition) handleTransitionSelect(transition);
          }}
        >
          <SelectTrigger className="w-full sm:w-auto sm:min-w-[180px]">
            <SelectValue placeholder={t('changeStatus')} />
          </SelectTrigger>
          <SelectContent>
            {availableTransitions.map(transition => (
              <SelectItem
                key={`${transition.from}-${transition.to}`}
                value={`${transition.from}-${transition.to}`}
              >
                <div className="flex items-center gap-2">
                  <ArrowRight className="h-3 w-3" />
                  <span className="truncate">{transition.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('confirmTransition')}</DialogTitle>
            <DialogDescription>
              {selectedTransition?.confirmationMessage ||
                t('confirmTransitionDescription', {
                  from: selectedTransition?.from || '',
                  to: selectedTransition?.to || '',
                })}
            </DialogDescription>
          </DialogHeader>

          {selectedTransition?.requiresNote && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                {t('note')} {selectedTransition.requiresNote && '*'}
              </label>
              <Textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder={t('notePlaceholder')}
                rows={3}
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button
              onClick={handleConfirmTransition}
              disabled={
                isLoading || (selectedTransition?.requiresNote && !note.trim())
              }
            >
              {isLoading ? t('updating') : t('confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Status History Component
interface StatusHistoryEntry {
  id: string;
  status: RFQStatus;
  timestamp: Date;
  note?: string;
  updatedBy: string;
}

interface RFQStatusHistoryProps {
  history: StatusHistoryEntry[];
}

export function RFQStatusHistory({ history }: RFQStatusHistoryProps) {
  const tHistory = useTranslations('rfq.statusHistory');
  const tStatus = useTranslations('rfq.status');

  // Safety check for history prop
  if (!history || !Array.isArray(history) || history.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No status history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold sm:text-xl">{tHistory('title')}</h3>

      <div className="space-y-3">
        {history.map((entry, index) => {
          const config = statusConfig[entry.status];
          const Icon = config.icon;

          return (
            <div
              key={entry.id}
              className="flex items-start gap-3 rounded-lg border p-3 transition-shadow hover:shadow-sm"
            >
              <div className={`rounded-full p-2 ${config.color} flex-shrink-0`}>
                <Icon className="h-4 w-4" />
              </div>

              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-2">
                  <span className="font-medium">{tStatus(config.label)}</span>
                  <span className="text-xs text-gray-500 sm:text-sm">
                    <span className="block sm:inline">
                      {entry.timestamp.toLocaleDateString()}
                    </span>
                    <span className="block sm:ml-1 sm:inline">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </span>
                </div>

                <div className="text-xs text-gray-600 sm:text-sm">
                  {tHistory('updatedBy', { name: entry.updatedBy })}
                </div>

                {entry.note && (
                  <div className="rounded border-l-2 border-gray-200 bg-gray-50 p-2 text-xs sm:text-sm">
                    {entry.note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
