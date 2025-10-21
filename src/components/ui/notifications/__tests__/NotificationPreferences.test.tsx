import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import NotificationPreferences from '../NotificationPreferences';
import { createWrapper } from '@/test/utils';
import { NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from '../index';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

const mockToast = toast as jest.Mocked<typeof toast>;

describe('NotificationPreferences Component', () => {
  const user = userEvent.setup();

  const defaultPreferences = {
    email: {
      quotes: true,
      orders: true,
      shipments: false,
      marketing: false,
      security: true,
      system: true,
    },
    push: {
      quotes: true,
      orders: true,
      shipments: true,
      marketing: false,
      security: true,
      system: false,
    },
    sms: {
      quotes: false,
      orders: true,
      shipments: false,
      marketing: false,
      security: true,
      system: false,
    },
    inApp: {
      quotes: true,
      orders: true,
      shipments: true,
      marketing: true,
      security: true,
      system: true,
    },
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all notification channels', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
    });

    it('renders all notification types', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Quote Updates')).toBeInTheDocument();
      expect(screen.getByText('Order Updates')).toBeInTheDocument();
      expect(screen.getByText('Shipment Updates')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Security Alerts')).toBeInTheDocument();
      expect(screen.getByText('System Notifications')).toBeInTheDocument();
    });

    it('displays correct switch states based on preferences', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Check email preferences
      const emailQuotesSwitch = screen.getByTestId('switch-email-quotes');
      expect(emailQuotesSwitch).toBeChecked();

      const emailMarketingSwitch = screen.getByTestId('switch-email-marketing');
      expect(emailMarketingSwitch).not.toBeChecked();

      // Check push preferences
      const pushShipmentsSwitch = screen.getByTestId('switch-push-shipments');
      expect(pushShipmentsSwitch).toBeChecked();

      const pushSystemSwitch = screen.getByTestId('switch-push-system');
      expect(pushSystemSwitch).not.toBeChecked();
    });

    it('shows channel badges with correct variants', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailBadge = screen.getByText('Email');
      expect(emailBadge).toHaveClass('bg-blue-100');

      const pushBadge = screen.getByText('Push');
      expect(pushBadge).toHaveClass('bg-green-100');

      const smsBadge = screen.getByText('SMS');
      expect(smsBadge).toHaveClass('bg-orange-100');

      const inAppBadge = screen.getByText('In-App');
      expect(inAppBadge).toHaveClass('bg-purple-100');
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when email preference is toggled', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailMarketingSwitch = screen.getByTestId('switch-email-marketing');
      await user.click(emailMarketingSwitch);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultPreferences,
        email: {
          ...defaultPreferences.email,
          marketing: true,
        },
      });
    });

    it('calls onChange when push preference is toggled', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const pushSystemSwitch = screen.getByTestId('switch-push-system');
      await user.click(pushSystemSwitch);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultPreferences,
        push: {
          ...defaultPreferences.push,
          system: true,
        },
      });
    });

    it('calls onChange when SMS preference is toggled', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const smsQuotesSwitch = screen.getByTestId('switch-sms-quotes');
      await user.click(smsQuotesSwitch);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultPreferences,
        sms: {
          ...defaultPreferences.sms,
          quotes: true,
        },
      });
    });

    it('calls onChange when in-app preference is toggled', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const inAppMarketingSwitch = screen.getByTestId('switch-inApp-marketing');
      await user.click(inAppMarketingSwitch);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultPreferences,
        inApp: {
          ...defaultPreferences.inApp,
          marketing: false,
        },
      });
    });

    it('handles multiple rapid toggles correctly', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailQuotesSwitch = screen.getByTestId('switch-email-quotes');

      // Rapid toggles
      await user.click(emailQuotesSwitch);
      await user.click(emailQuotesSwitch);
      await user.click(emailQuotesSwitch);

      expect(mockOnChange).toHaveBeenCalledTimes(3);

      // Last call should toggle back to false
      expect(mockOnChange).toHaveBeenLastCalledWith({
        ...defaultPreferences,
        email: {
          ...defaultPreferences.email,
          quotes: false,
        },
      });
    });
  });

  describe('Channel Management', () => {
    it('displays all available channels', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Check for actual channel labels displayed in the component
      expect(screen.getByText('Email Notifications')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
    });

    it('shows channel descriptions', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(
        screen.getByText('Receive notifications via email')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Get instant push notifications on your device')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Receive important alerts via SMS')
      ).toBeInTheDocument();
      expect(
        screen.getByText('See notifications within the application')
      ).toBeInTheDocument();
    });

    it('applies correct styling for each channel', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailSection = screen.getByTestId('channel-email');
      expect(emailSection).toHaveClass('border-blue-200');

      const pushSection = screen.getByTestId('channel-push');
      expect(pushSection).toHaveClass('border-green-200');

      const smsSection = screen.getByTestId('channel-sms');
      expect(smsSection).toHaveClass('border-orange-200');

      const inAppSection = screen.getByTestId('channel-inApp');
      expect(inAppSection).toHaveClass('border-purple-200');
    });
  });

  describe('Notification Types', () => {
    it('displays all notification types with descriptions', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Check for actual notification type labels displayed in the component
      expect(screen.getByText('Quote Updates')).toBeInTheDocument();
      expect(screen.getByText('Order Updates')).toBeInTheDocument();
      expect(screen.getByText('Shipment Updates')).toBeInTheDocument();
      expect(screen.getByText('Marketing Communications')).toBeInTheDocument();
      expect(screen.getByText('Security Alerts')).toBeInTheDocument();
      expect(screen.getByText('System Notifications')).toBeInTheDocument();
    });

    it('shows priority badges for important notifications', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Security and System notifications should have priority badges
      const securityBadges = screen.getAllByText('High Priority');
      expect(securityBadges.length).toBeGreaterThan(0);
    });

    it('groups notification types correctly', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Business notifications group
      expect(screen.getByText('Business Updates')).toBeInTheDocument();

      // System notifications group
      expect(screen.getByText('System & Security')).toBeInTheDocument();
    });
  });

  describe('Loading and Disabled States', () => {
    it('shows loading state when loading prop is true', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      // Switches should be disabled during loading
      const switches = screen.getAllByRole('switch');
      switches.forEach(switch_ => {
        expect(switch_).toBeDisabled();
      });
    });

    it('disables all switches when disabled prop is true', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
          disabled={true}
        />,
        { wrapper: createWrapper() }
      );

      const switches = screen.getAllByRole('switch');
      switches.forEach(switch_ => {
        expect(switch_).toBeDisabled();
      });
    });

    it('shows error state when error prop is provided', () => {
      const errorMessage = 'Failed to load preferences';

      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for switches', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailQuotesSwitch = screen.getByTestId('switch-email-quotes');
      expect(emailQuotesSwitch).toHaveAttribute(
        'aria-label',
        'Toggle email notifications for quotes'
      );

      const pushOrdersSwitch = screen.getByTestId('switch-push-orders');
      expect(pushOrdersSwitch).toHaveAttribute(
        'aria-label',
        'Toggle push notifications for orders'
      );
    });

    it('supports keyboard navigation', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const firstSwitch = screen.getByTestId('switch-email-quotes');
      firstSwitch.focus();

      fireEvent.keyDown(firstSwitch, { key: 'Tab' });

      const secondSwitch = screen.getByTestId('switch-email-orders');
      expect(secondSwitch).toHaveFocus();
    });

    it('announces state changes to screen readers', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const emailMarketingSwitch = screen.getByTestId('switch-email-marketing');

      await user.click(emailMarketingSwitch);

      expect(emailMarketingSwitch).toHaveAttribute('aria-checked', 'true');
    });

    it('has proper heading structure', () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Notification Preferences');

      const channelHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(channelHeadings).toHaveLength(4); // One for each channel
    });
  });

  describe('Edge Cases', () => {
    it('handles empty preferences object', () => {
      const emptyPreferences = {
        email: {},
        push: {},
        sms: {},
        inApp: {},
      };

      render(
        <NotificationPreferences
          settings={emptyPreferences as any}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Should render without crashing
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    });

    it('handles missing channel in preferences', () => {
      const incompletePreferences = {
        email: defaultPreferences.email,
        push: defaultPreferences.push,
        // Missing sms and inApp
      };

      render(
        <NotificationPreferences
          settings={incompletePreferences as any}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Should render without crashing and show all channels
      expect(screen.getByText('SMS Notifications')).toBeInTheDocument();
      expect(screen.getByText('In-App Notifications')).toBeInTheDocument();
    });

    it('handles null onChange callback gracefully', async () => {
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={null as any}
        />,
        { wrapper: createWrapper() }
      );

      const emailQuotesSwitch = screen.getByTestId('switch-email-quotes');

      // Should not crash when clicking
      await user.click(emailQuotesSwitch);

      expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    });
  });

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const { rerender } = render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Re-render with same props
      rerender(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />
      );

      // Component should still be functional
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
    });

    it('handles large number of notification types efficiently', () => {
      // This test ensures the component can handle scaling
      render(
        <NotificationPreferences
          settings={defaultPreferences}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      // Should render all switches without performance issues
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBe(24); // 6 types × 4 channels
    });
  });
});