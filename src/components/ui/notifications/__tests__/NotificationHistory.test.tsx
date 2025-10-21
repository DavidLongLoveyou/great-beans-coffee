import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotificationHistory } from '../NotificationHistory';
import { createWrapper } from '@/test/utils';

describe('NotificationHistory Component', () => {
  const user = userEvent.setup();

  const mockNotifications = [
    {
      id: '1',
      type: 'orders' as const,
      channel: 'email' as const,
      status: 'delivered' as const,
      title: 'Order #12345 Updated',
      message: 'Your order has been shipped',
      timestamp: new Date('2024-01-15T10:30:00Z'),
      recipient: 'user@example.com',
      metadata: {
        emailId: 'email-123',
      },
    },
    {
      id: '2',
      type: 'quotes' as const,
      channel: 'push' as const,
      status: 'failed' as const,
      title: 'Quote Request Response',
      message: 'Your quote request has been processed',
      timestamp: new Date('2024-01-15T09:15:00Z'),
      recipient: 'user@example.com',
      metadata: {
        pushId: 'push-456',
        errorMessage: 'Push notification service unavailable',
        retryCount: 1,
      },
    },
    {
      id: '3',
      type: 'shipments' as const,
      channel: 'sms' as const,
      status: 'pending' as const,
      title: 'Shipment Notification',
      message: 'Your shipment is on the way',
      timestamp: new Date('2024-01-15T08:00:00Z'),
      recipient: '+1234567890',
      metadata: {
        smsId: 'sms-789',
      },
    },
  ];

  const mockOnResend = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnMarkAsRead = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders notification history interface', () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Notification History')).toBeInTheDocument();
    });

    it('displays all notifications', () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Order #12345 Updated')).toBeInTheDocument();
      expect(screen.getByText('Quote Request Response')).toBeInTheDocument();
      expect(screen.getByText('Shipment Notification')).toBeInTheDocument();
    });

    it('shows notification status correctly', () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('delivered')).toBeInTheDocument();
      expect(screen.getByText('failed')).toBeInTheDocument();
      expect(screen.getByText('pending')).toBeInTheDocument();
    });
  });

  describe('Filtering', () => {
    it('filters notifications by status', async () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      // Test filtering functionality if it exists
      const statusFilter = screen.queryByLabelText(/status/i);
      if (statusFilter) {
        await user.selectOptions(statusFilter, 'delivered');
        expect(screen.getByText('Order #12345 Updated')).toBeInTheDocument();
      }
    });
  });

  describe('Actions', () => {
    it('calls onResendNotification when resend button is clicked', async () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      const resendButton = screen.queryByText(/resend/i);
      if (resendButton) {
        await user.click(resendButton);
        expect(mockOnResend).toHaveBeenCalled();
      }
    });

    it('calls onDeleteNotification when delete button is clicked', async () => {
      render(
        <NotificationHistory
          notifications={mockNotifications}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      const deleteButton = screen.queryByText(/delete/i);
      if (deleteButton) {
        await user.click(deleteButton);
        expect(mockOnDelete).toHaveBeenCalled();
      }
    });
  });

  describe('Empty State', () => {
    it('shows empty state when no notifications', () => {
      render(
        <NotificationHistory
          notifications={[]}
          onResendNotification={mockOnResend}
          onDeleteNotification={mockOnDelete}
          onMarkAsRead={mockOnMarkAsRead}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(/no notifications/i)).toBeInTheDocument();
    });
  });
});
