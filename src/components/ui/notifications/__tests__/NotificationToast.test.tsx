import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import NotificationToast from '../../alerts/NotificationToast';
import { createWrapper } from '@/test/utils';
import { NOTIFICATION_TYPES } from '../index';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
    custom: jest.fn(),
  },
}));

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe('NotificationToast Component', () => {
  const user = userEvent.setup();

  const defaultNotification = {
    id: '1',
    type: 'order_update' as const,
    title: 'Order Updated',
    message: 'Your order #12345 has been shipped',
    timestamp: new Date('2024-01-15T10:30:00Z'),
    read: false,
    priority: 'medium' as const,
    actions: [
      {
        label: 'View Order',
        action: 'navigate',
        url: '/orders/12345',
      },
      {
        label: 'Track Package',
        action: 'external',
        url: 'https://tracking.example.com/12345',
      },
    ],
    metadata: {
      orderId: '12345',
      trackingNumber: 'TN123456789',
    },
  };

  const mockOnDismiss = jest.fn();
  const mockOnAction = jest.fn();

  // Helper function to convert notification object to component props
  const getNotificationProps = (notification: any) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    timestamp: notification.timestamp,
    actions: notification.actions?.map((action: any) => ({
      ...action,
      onClick: () => mockOnAction(notification.id, action),
    })),
    onDismiss: mockOnDismiss,
    dismissible: true,
    priority: notification.priority,
    category: notification.type,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders notification toast with basic information', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Order Updated')).toBeInTheDocument();
      expect(
        screen.getByText('Your order #12345 has been shipped')
      ).toBeInTheDocument();
      expect(screen.getByText('View Order')).toBeInTheDocument();
      expect(screen.getByText('Track Package')).toBeInTheDocument();
    });

    it('displays correct icon for notification type', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const icon = screen.getByTestId('notification-icon');
      expect(icon).toHaveClass('text-blue-500'); // Order update icon color
    });

    it('shows timestamp in relative format', () => {
      const recentNotification = {
        ...defaultNotification,
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      };

      render(
        <NotificationToast
          {...getNotificationProps(recentNotification)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('5 minutes ago')).toBeInTheDocument();
    });

    it('displays priority indicator for high priority notifications', () => {
      const highPriorityNotification = {
        ...defaultNotification,
        priority: 'high' as const,
      };

      render(
        <NotificationToast
          {...getNotificationProps(highPriorityNotification)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('priority-indicator')).toBeInTheDocument();
      expect(screen.getByTestId('priority-indicator')).toHaveClass(
        'bg-red-500'
      );
    });

    it('shows unread indicator for unread notifications', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('unread-indicator')).toBeInTheDocument();
    });

    it('hides unread indicator for read notifications', () => {
      const readNotification = {
        ...defaultNotification,
        read: true,
      };

      render(
        <NotificationToast
          {...getNotificationProps(readNotification)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByTestId('unread-indicator')).not.toBeInTheDocument();
    });
  });

  describe('Different Notification Types', () => {
    const notificationTypes = [
      {
        type: 'order_update',
        expectedColor: 'text-blue-500',
        expectedIcon: 'Package',
      },
      {
        type: 'quote_update',
        expectedColor: 'text-green-500',
        expectedIcon: 'FileText',
      },
      {
        type: 'shipping_update',
        expectedColor: 'text-orange-500',
        expectedIcon: 'Truck',
      },
      {
        type: 'payment_update',
        expectedColor: 'text-purple-500',
        expectedIcon: 'CreditCard',
      },
      {
        type: 'system_alert',
        expectedColor: 'text-red-500',
        expectedIcon: 'AlertTriangle',
      },
      {
        type: 'marketing',
        expectedColor: 'text-pink-500',
        expectedIcon: 'Megaphone',
      },
    ] as const;

    notificationTypes.forEach(({ type, expectedColor }) => {
      it(`renders ${type} notification with correct styling`, () => {
        const notification = {
          ...defaultNotification,
          type,
          title: `${type} notification`,
        };

        render(
          <NotificationToast
            {...getNotificationProps(notification)}
          />,
          { wrapper: createWrapper() }
        );

        const icon = screen.getByTestId('notification-icon');
        expect(icon).toHaveClass(expectedColor);
      });
    });
  });

  describe('Actions', () => {
    it('handles navigate action correctly', async () => {
      const mockPush = jest.fn();
      jest.doMock('next/navigation', () => ({
        useRouter: () => ({ push: mockPush }),
      }));

      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const viewOrderButton = screen.getByText('View Order');
      await user.click(viewOrderButton);

      expect(mockOnAction).toHaveBeenCalledWith(defaultNotification.id, {
        label: 'View Order',
        action: 'navigate',
        url: '/orders/12345',
      });
    });

    it('handles external action correctly', async () => {
      // Mock window.open
      const mockOpen = jest.fn();
      Object.defineProperty(window, 'open', {
        value: mockOpen,
        writable: true,
      });

      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const trackPackageButton = screen.getByText('Track Package');
      await user.click(trackPackageButton);

      expect(mockOnAction).toHaveBeenCalledWith(defaultNotification.id, {
        label: 'Track Package',
        action: 'external',
        url: 'https://tracking.example.com/12345',
      });
    });

    it('handles custom action correctly', async () => {
      const customNotification = {
        ...defaultNotification,
        actions: [
          {
            label: 'Custom Action',
            action: 'custom' as const,
            handler: jest.fn(),
          },
        ],
      };

      render(
        <NotificationToast
          {...getNotificationProps(customNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const customButton = screen.getByText('Custom Action');
      await user.click(customButton);

      expect(mockOnAction).toHaveBeenCalledWith(customNotification.id, {
        label: 'Custom Action',
        action: 'custom',
        handler: expect.any(Function),
      });
    });

    it('renders notification without actions', () => {
      const notificationWithoutActions = {
        ...defaultNotification,
        actions: undefined,
      };

      render(
        <NotificationToast
          {...getNotificationProps(notificationWithoutActions)}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByText('View Order')).not.toBeInTheDocument();
      expect(screen.queryByText('Track Package')).not.toBeInTheDocument();
    });

    it('limits number of action buttons displayed', () => {
      const notificationWithManyActions = {
        ...defaultNotification,
        actions: [
          { label: 'Action 1', action: 'navigate' as const, url: '/1' },
          { label: 'Action 2', action: 'navigate' as const, url: '/2' },
          { label: 'Action 3', action: 'navigate' as const, url: '/3' },
          { label: 'Action 4', action: 'navigate' as const, url: '/4' },
        ],
      };

      render(
        <NotificationToast
          {...getNotificationProps(notificationWithManyActions)}
        />,
        { wrapper: createWrapper() }
      );

      // Should only show first 2 actions + "More" button
      expect(screen.getByText('Action 1')).toBeInTheDocument();
      expect(screen.getByText('Action 2')).toBeInTheDocument();
      expect(screen.getByText('More')).toBeInTheDocument();
      expect(screen.queryByText('Action 3')).not.toBeInTheDocument();
    });
  });

  describe('Dismiss Functionality', () => {
    it('calls onDismiss when close button is clicked', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const closeButton = screen.getByTestId('dismiss-button');
      await user.click(closeButton);

      expect(mockOnDismiss).toHaveBeenCalledWith(defaultNotification.id);
    });

    it('auto-dismisses after specified duration', async () => {
      jest.useFakeTimers();

      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={false}
          duration={3000}
        />,
        { wrapper: createWrapper() }
      );

      // Fast-forward time
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith(defaultNotification.id);
      });

      jest.useRealTimers();
    });

    it('pauses auto-dismiss on hover', async () => {
      jest.useFakeTimers();

      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={false}
          duration={3000}
        />,
        { wrapper: createWrapper() }
      );

      const toast = screen.getByTestId('notification-toast');

      // Hover over toast
      fireEvent.mouseEnter(toast);

      // Fast-forward time
      jest.advanceTimersByTime(3000);

      // Should not dismiss while hovered
      expect(mockOnDismiss).not.toHaveBeenCalled();

      // Mouse leave
      fireEvent.mouseLeave(toast);

      // Fast-forward time again
      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(mockOnDismiss).toHaveBeenCalledWith(defaultNotification.id);
      });

      jest.useRealTimers();
    });

    it('does not auto-dismiss when autoDismiss is false', async () => {
      jest.useFakeTimers();

      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={true}
        />,
        { wrapper: createWrapper() }
      );

      // Fast-forward time
      jest.advanceTimersByTime(5000);

      expect(mockOnDismiss).not.toHaveBeenCalled();

      jest.useRealTimers();
    });
  });

  describe('Animations', () => {
    it('applies enter animation on mount', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const toast = screen.getByTestId('notification-toast');
      expect(toast).toHaveClass('animate-slide-in');
    });

    it('applies exit animation on dismiss', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const closeButton = screen.getByTestId('dismiss-button');
      await user.click(closeButton);

      const toast = screen.getByTestId('notification-toast');
      expect(toast).toHaveClass('animate-slide-out');
    });

    it('shows progress bar for auto-dismiss', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={false}
          duration={3000}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
    });

    it('hides progress bar when autoDismiss is false', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={true}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.queryByTestId('progress-bar')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const toast = screen.getByTestId('notification-toast');
      expect(toast).toHaveAttribute('role', 'alert');
      expect(toast).toHaveAttribute('aria-live', 'polite');
      expect(toast).toHaveAttribute('aria-atomic', 'true');
    });

    it('has proper ARIA label for close button', () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const closeButton = screen.getByTestId('dismiss-button');
      expect(closeButton).toHaveAttribute('aria-label', 'Dismiss notification');
    });

    it('supports keyboard navigation', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const firstAction = screen.getByText('View Order');
      firstAction.focus();

      fireEvent.keyDown(firstAction, { key: 'Tab' });

      const secondAction = screen.getByText('Track Package');
      expect(secondAction).toHaveFocus();
    });

    it('handles Enter key for action buttons', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const viewOrderButton = screen.getByText('View Order');
      viewOrderButton.focus();

      fireEvent.keyDown(viewOrderButton, { key: 'Enter' });

      expect(mockOnAction).toHaveBeenCalledWith(defaultNotification.id, {
        label: 'View Order',
        action: 'navigate',
        url: '/orders/12345',
      });
    });

    it('handles Escape key for dismissing', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const toast = screen.getByTestId('notification-toast');
      fireEvent.keyDown(toast, { key: 'Escape' });

      expect(mockOnDismiss).toHaveBeenCalledWith(defaultNotification.id);
    });
  });

  describe('Edge Cases', () => {
    it('handles notification without title', () => {
      const notificationWithoutTitle = {
        ...defaultNotification,
        title: '',
      };

      render(
        <NotificationToast
          {...getNotificationProps(notificationWithoutTitle)}
        />,
        { wrapper: createWrapper() }
      );

      // Should still render the message
      expect(
        screen.getByText('Your order #12345 has been shipped')
      ).toBeInTheDocument();
    });

    it('handles notification without message', () => {
      const notificationWithoutMessage = {
        ...defaultNotification,
        message: '',
      };

      render(
        <NotificationToast
          {...getNotificationProps(notificationWithoutMessage)}
        />,
        { wrapper: createWrapper() }
      );

      // Should still render the title
      expect(screen.getByText('Order Updated')).toBeInTheDocument();
    });

    it('handles very long notification content', () => {
      const longNotification = {
        ...defaultNotification,
        title: 'A'.repeat(100),
        message: 'B'.repeat(500),
      };

      render(
        <NotificationToast
          {...getNotificationProps(longNotification)}
        />,
        { wrapper: createWrapper() }
      );

      // Should truncate long content
      const toast = screen.getByTestId('notification-toast');
      expect(toast).toHaveClass('max-w-sm'); // Should have max width
    });

    it('handles null/undefined callbacks gracefully', async () => {
      render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          onDismiss={null as any}
        />,
        { wrapper: createWrapper() }
      );

      const closeButton = screen.getByTestId('dismiss-button');

      // Should not crash when clicking
      await user.click(closeButton);

      expect(screen.getByText('Order Updated')).toBeInTheDocument();
    });

    it('handles invalid timestamp gracefully', () => {
      const invalidTimestampNotification = {
        ...defaultNotification,
        timestamp: new Date('invalid-date'),
      };

      render(
        <NotificationToast
          {...getNotificationProps(invalidTimestampNotification)}
        />,
        { wrapper: createWrapper() }
      );

      // Should fallback to "Just now" or similar
      expect(screen.getByText(/now|moment/i)).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('memoizes action handlers to prevent unnecessary re-renders', () => {
      const { rerender } = render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />,
        { wrapper: createWrapper() }
      );

      const initialActionButton = screen.getByText('View Order');
      const initialHandler = initialActionButton.onclick;

      // Re-render with same props
      rerender(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
        />
      );

      const rerenderedActionButton = screen.getByText('View Order');
      const rerenderedHandler = rerenderedActionButton.onclick;

      // Handlers should be the same (memoized)
      expect(initialHandler).toBe(rerenderedHandler);
    });

    it('cleans up timers on unmount', () => {
      jest.useFakeTimers();
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <NotificationToast
          {...getNotificationProps(defaultNotification)}
          persistent={false}
          duration={3000}
        />,
        { wrapper: createWrapper() }
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      jest.useRealTimers();
      clearTimeoutSpy.mockRestore();
    });
  });
});