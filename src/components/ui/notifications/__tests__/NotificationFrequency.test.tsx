import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { NotificationFrequency } from '../NotificationFrequency';
import { createWrapper } from '@/test/utils';

describe('NotificationFrequency Component', () => {
  const user = userEvent.setup();

  const defaultSettings = {
    email: {
      frequency: 'immediate' as const,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
      digest: {
        enabled: true,
        time: '09:00',
        days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
    },
    push: {
      frequency: 'immediate' as const,
      batchInterval: 30,
      quietHours: {
        enabled: true,
        start: '22:00',
        end: '08:00',
      },
      sound: {
        enabled: true,
        volume: 80,
      },
    },
    general: {
      timezone: 'Asia/Ho_Chi_Minh',
      businessHoursOnly: false,
      weekendsEnabled: true,
      priorityOverride: true,
    },
  };

  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all frequency settings sections', () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByText('Email Frequency')).toBeInTheDocument();
      expect(screen.getByText('Quiet Hours')).toBeInTheDocument();
      expect(screen.getByText('Daily Digest')).toBeInTheDocument();
      expect(screen.getByText('Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('Sound Settings')).toBeInTheDocument();
      expect(screen.getByText('General Settings')).toBeInTheDocument();
    });

    it('displays current email frequency selection', () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByDisplayValue('immediate')).toBeInTheDocument();
    });
  });

  describe('Email Frequency Settings', () => {
    it('updates email frequency when changed', async () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const frequencySelect = screen.getByDisplayValue('immediate');
      await user.selectOptions(frequencySelect, 'hourly');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultSettings,
        email: {
          ...defaultSettings.email,
          frequency: 'hourly',
        },
      });
    });
  });

  describe('Quiet Hours Settings', () => {
    it('toggles quiet hours when switch is clicked', async () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const quietHoursSwitch = screen.getByRole('switch', {
        name: /quiet hours/i,
      });
      await user.click(quietHoursSwitch);

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultSettings,
        email: {
          ...defaultSettings.email,
          quietHours: {
            ...defaultSettings.email.quietHours,
            enabled: false,
          },
        },
      });
    });
  });

  describe('Push Notification Settings', () => {
    it('updates push frequency when changed', async () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      const pushFrequencySelect = screen.getByDisplayValue('immediate');
      await user.selectOptions(pushFrequencySelect, 'batched');

      expect(mockOnChange).toHaveBeenCalledWith({
        ...defaultSettings,
        push: {
          ...defaultSettings.push,
          frequency: 'batched',
        },
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels for all controls', () => {
      render(
        <NotificationFrequency
          settings={defaultSettings}
          onSettingsChange={mockOnChange}
        />,
        { wrapper: createWrapper() }
      );

      expect(screen.getByLabelText(/email frequency/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/quiet hours/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/daily digest/i)).toBeInTheDocument();
    });
  });
});
