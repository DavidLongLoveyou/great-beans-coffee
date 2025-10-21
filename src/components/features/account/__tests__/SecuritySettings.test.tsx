import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import SecuritySettings from '../SecuritySettings';
import { createWrapper } from '@/test/utils';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const mockToast = toast as jest.Mocked<typeof toast>;

// Helper function to create mock Response objects
const createMockResponse = (data: unknown, options: { ok?: boolean; status?: number } = {}) => {
  const { ok = true, status = 200 } = options;
  return {
    ok,
    status,
    headers: new Headers(),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)]),
    arrayBuffer: async () => new ArrayBuffer(0),
    formData: async () => new FormData(),
    clone: () => createMockResponse(data, { ok, status }),
    body: null,
    bodyUsed: false,
    redirected: false,
    type: 'basic' as ResponseType,
    url: '',
    statusText: ok ? 'OK' : 'Error',
  } as Response;
};

describe('SecuritySettings Component', () => {
  const user = userEvent.setup();

  const mockSecurityData = {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-01T00:00:00Z',
    activeSessions: [
      {
        id: 'session-1',
        device: 'Chrome on Windows',
        location: 'Ho Chi Minh City, Vietnam',
        ipAddress: '192.168.1.1',
        lastActive: '2024-01-15T10:30:00Z',
        current: true,
      },
      {
        id: 'session-2',
        device: 'Safari on iPhone',
        location: 'Hanoi, Vietnam',
        ipAddress: '192.168.1.2',
        lastActive: '2024-01-14T15:20:00Z',
        current: false,
      },
    ],
    recentActivity: [
      {
        id: 'activity-1',
        action: 'Login',
        timestamp: '2024-01-15T10:30:00Z',
        ipAddress: '192.168.1.1',
        location: 'Ho Chi Minh City, Vietnam',
        device: 'Chrome on Windows',
        success: true,
      },
      {
        id: 'activity-2',
        action: 'Failed Login Attempt',
        timestamp: '2024-01-15T09:45:00Z',
        ipAddress: '192.168.1.3',
        location: 'Unknown',
        device: 'Unknown',
        success: false,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockSecurityData,
    } as Response);
  });

  describe('Rendering', () => {
    it('renders security settings interface', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      expect(screen.getByText('Security Settings')).toBeInTheDocument();
      expect(screen.getByText('Password Management')).toBeInTheDocument();
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('loads security data on mount', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/user/security');
        expect(mockFetch).toHaveBeenCalledWith('/api/user/sessions');
      });
    });

    it('displays loading state initially', () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('displays security data after loading', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
        expect(screen.getByText('Safari on iPhone')).toBeInTheDocument();
        expect(screen.getByText('Login')).toBeInTheDocument();
        expect(screen.getByText('Failed Login Attempt')).toBeInTheDocument();
      });
    });
  });

  describe('Password Management', () => {
    beforeEach(async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });
    });

    it('opens change password dialog when button is clicked', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      expect(screen.getByText('Change Your Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Current Password')).toBeInTheDocument();
      expect(screen.getByLabelText('New Password')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    });

    it('validates password change form', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const submitButton = screen.getByText('Update Password');
      await user.click(submitButton);

      expect(
        screen.getByText('Current password is required')
      ).toBeInTheDocument();
      expect(screen.getByText('New password is required')).toBeInTheDocument();
      expect(
        screen.getByText('Please confirm your new password')
      ).toBeInTheDocument();
    });

    it('validates password strength', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const newPasswordInput = screen.getByLabelText('New Password');
      await user.type(newPasswordInput, '123');

      expect(
        screen.getByText('Password must be at least 8 characters long')
      ).toBeInTheDocument();
    });

    it('validates password confirmation match', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText(
        'Confirm New Password'
      );

      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');

      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });

    it('submits password change successfully', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const currentPasswordInput = screen.getByLabelText('Current Password');
      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText(
        'Confirm New Password'
      );

      await user.type(currentPasswordInput, 'CurrentPassword123!');
      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');

      const submitButton = screen.getByText('Update Password');
      await user.click(submitButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: 'CurrentPassword123!',
          newPassword: 'NewPassword123!',
        }),
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Password updated successfully'
        );
      });
    });

    it('handles password change error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Invalid current password'));

      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const currentPasswordInput = screen.getByLabelText('Current Password');
      const newPasswordInput = screen.getByLabelText('New Password');
      const confirmPasswordInput = screen.getByLabelText(
        'Confirm New Password'
      );

      await user.type(currentPasswordInput, 'WrongPassword');
      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'NewPassword123!');

      const submitButton = screen.getByText('Update Password');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to update password'
        );
      });
    });

    it('shows password strength indicator', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      await user.click(changePasswordButton);

      const newPasswordInput = screen.getByLabelText('New Password');

      // Weak password
      await user.type(newPasswordInput, '123456');
      expect(screen.getByText('Weak')).toBeInTheDocument();

      // Clear and type strong password
      await user.clear(newPasswordInput);
      await user.type(newPasswordInput, 'StrongPassword123!@#');
      expect(screen.getByText('Strong')).toBeInTheDocument();
    });
  });

  describe('Two-Factor Authentication', () => {
    beforeEach(async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });
    });

    it('shows enable 2FA option when disabled', () => {
      expect(
        screen.getByText('Enable Two-Factor Authentication')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Add an extra layer of security to your account')
      ).toBeInTheDocument();
    });

    it('opens 2FA setup dialog when enable button is clicked', async () => {
      const enableButton = screen.getByText('Enable Two-Factor Authentication');
      await user.click(enableButton);

      expect(
        screen.getByText('Set Up Two-Factor Authentication')
      ).toBeInTheDocument();
      expect(screen.getByText('Scan QR Code')).toBeInTheDocument();
    });

    it('generates QR code for 2FA setup', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          qrCode:
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
          secret: 'JBSWY3DPEHPK3PXP',
        }),
      } as Response);

      const enableButton = screen.getByText('Enable Two-Factor Authentication');
      await user.click(enableButton);

      await waitFor(() => {
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
        expect(screen.getByText('JBSWY3DPEHPK3PXP')).toBeInTheDocument();
      });
    });

    it('verifies 2FA setup with verification code', async () => {
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            qrCode: 'data:image/png;base64,test',
            secret: 'JBSWY3DPEHPK3PXP',
          }),
        })
        .mockResolvedValueOnce(createMockResponse({ success: true }));

      const enableButton = screen.getByText('Enable Two-Factor Authentication');
      await user.click(enableButton);

      await waitFor(() => {
        expect(screen.getByTestId('qr-code')).toBeInTheDocument();
      });

      const verificationInput = screen.getByLabelText('Verification Code');
      await user.type(verificationInput, '123456');

      const verifyButton = screen.getByText('Verify and Enable');
      await user.click(verifyButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: '123456' }),
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Two-factor authentication enabled successfully'
        );
      });
    });

    it('shows disable 2FA option when enabled', async () => {
      const enabledSecurityData = {
        ...mockSecurityData,
        twoFactorEnabled: true,
      };

      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => enabledSecurityData,
      } as Response);

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Disable Two-Factor Authentication')
        ).toBeInTheDocument();
        expect(
          screen.getByText('Two-factor authentication is currently enabled')
        ).toBeInTheDocument();
      });
    });

    it('disables 2FA when disable button is clicked', async () => {
      const enabledSecurityData = {
        ...mockSecurityData,
        twoFactorEnabled: true,
      };

      mockFetch
        .mockResolvedValueOnce(createMockResponse(enabledSecurityData))
        .mockResolvedValueOnce(createMockResponse(enabledSecurityData))
        .mockResolvedValueOnce(createMockResponse({ success: true }));

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Disable Two-Factor Authentication')
        ).toBeInTheDocument();
      });

      const disableButton = screen.getByText(
        'Disable Two-Factor Authentication'
      );
      await user.click(disableButton);

      // Confirm disable
      const confirmButton = screen.getByText('Disable 2FA');
      await user.click(confirmButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/2fa/disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Two-factor authentication disabled'
        );
      });
    });
  });

  describe('Session Management', () => {
    beforeEach(async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });
    });

    it('displays active sessions correctly', () => {
      expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      expect(screen.getByText('Safari on iPhone')).toBeInTheDocument();
      expect(screen.getByText('Ho Chi Minh City, Vietnam')).toBeInTheDocument();
      expect(screen.getByText('Hanoi, Vietnam')).toBeInTheDocument();
      expect(screen.getByText('Current Session')).toBeInTheDocument();
    });

    it('terminates session when revoke button is clicked', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const revokeButtons = screen.getAllByText('Revoke');
      const nonCurrentSessionRevokeButton = revokeButtons.find(
        button =>
          !button
            .closest('[data-testid="session-item"]')
            ?.textContent?.includes('Current Session')
      );

      if (nonCurrentSessionRevokeButton) {
        await user.click(nonCurrentSessionRevokeButton);

        expect(mockFetch).toHaveBeenCalledWith('/api/user/sessions/session-2', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        await waitFor(() => {
          expect(mockToast.success).toHaveBeenCalledWith(
            'Session terminated successfully'
          );
        });
      }
    });

    it('terminates all other sessions', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const terminateAllButton = screen.getByText(
        'Terminate All Other Sessions'
      );
      await user.click(terminateAllButton);

      // Confirm termination
      const confirmButton = screen.getByText('Terminate All');
      await user.click(confirmButton);

      expect(mockFetch).toHaveBeenCalledWith(
        '/api/user/sessions/terminate-all',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        }
      );

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'All other sessions terminated'
        );
      });
    });

    it('prevents revoking current session', () => {
      const currentSessionItem = screen
        .getByText('Current Session')
        .closest('[data-testid="session-item"]');
      const revokeButton = currentSessionItem?.querySelector('button');

      expect(revokeButton).toBeDisabled();
    });

    it('shows session details correctly', () => {
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.2')).toBeInTheDocument();

      // Check relative time display
      expect(
        screen.getByText(/minutes ago|hours ago|days ago/)
      ).toBeInTheDocument();
    });
  });

  describe('Recent Activity', () => {
    beforeEach(async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });
    });

    it('displays recent activity correctly', () => {
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Failed Login Attempt')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.1')).toBeInTheDocument();
      expect(screen.getByText('192.168.1.3')).toBeInTheDocument();
    });

    it('shows success and failure indicators', () => {
      const successActivity = screen
        .getByText('Login')
        .closest('[data-testid="activity-item"]');
      const failureActivity = screen
        .getByText('Failed Login Attempt')
        .closest('[data-testid="activity-item"]');

      expect(
        successActivity?.querySelector('.text-green-500')
      ).toBeInTheDocument();
      expect(
        failureActivity?.querySelector('.text-red-500')
      ).toBeInTheDocument();
    });

    it('displays activity timestamps', () => {
      // Should show relative time
      expect(
        screen.getByText(/minutes ago|hours ago|days ago/)
      ).toBeInTheDocument();
    });

    it('shows unknown location for failed attempts', () => {
      const failureActivity = screen
        .getByText('Failed Login Attempt')
        .closest('[data-testid="activity-item"]');
      expect(failureActivity?.textContent).toContain('Unknown');
    });

    it('loads more activity when button is clicked', async () => {
      const moreActivityData = {
        recentActivity: [
          ...mockSecurityData.recentActivity,
          {
            id: 'activity-3',
            action: 'Password Changed',
            timestamp: '2024-01-14T12:00:00Z',
            ipAddress: '192.168.1.1',
            location: 'Ho Chi Minh City, Vietnam',
            device: 'Chrome on Windows',
            success: true,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce(createMockResponse(moreActivityData));

      const loadMoreButton = screen.getByText('Load More Activity');
      await user.click(loadMoreButton);

      await waitFor(() => {
        expect(screen.getByText('Password Changed')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when security data fails to load', async () => {
      mockFetch.mockRejectedValue(new Error('API Error'));

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Failed to load security settings')
        ).toBeInTheDocument();
      });

      expect(mockToast.error).toHaveBeenCalledWith(
        'Failed to load security settings'
      );
    });

    it('handles 2FA setup error', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });

      mockFetch.mockRejectedValueOnce(new Error('2FA setup failed'));

      const enableButton = screen.getByText('Enable Two-Factor Authentication');
      await user.click(enableButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to set up two-factor authentication'
        );
      });
    });

    it('handles session termination error', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });

      mockFetch.mockRejectedValueOnce(new Error('Session termination failed'));

      const revokeButtons = screen.getAllByText('Revoke');
      const nonCurrentSessionRevokeButton = revokeButtons.find(
        button =>
          !button
            .closest('[data-testid="session-item"]')
            ?.textContent?.includes('Current Session')
      );

      if (nonCurrentSessionRevokeButton) {
        await user.click(nonCurrentSessionRevokeButton);

        await waitFor(() => {
          expect(mockToast.error).toHaveBeenCalledWith(
            'Failed to terminate session'
          );
        });
      }
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });
    });

    it('has proper ARIA labels', () => {
      expect(screen.getByLabelText('Security settings')).toBeInTheDocument();
      expect(screen.getByLabelText('Active sessions')).toBeInTheDocument();
      expect(screen.getByLabelText('Recent activity')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      changePasswordButton.focus();

      fireEvent.keyDown(changePasswordButton, { key: 'Tab' });

      const enable2FAButton = screen.getByText(
        'Enable Two-Factor Authentication'
      );
      expect(enable2FAButton).toHaveFocus();
    });

    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 2 });
      expect(mainHeading).toHaveTextContent('Security Settings');

      const sectionHeadings = screen.getAllByRole('heading', { level: 3 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('provides screen reader announcements for security actions', async () => {
      const changePasswordButton = screen.getByText('Change Password');
      expect(changePasswordButton).toHaveAttribute('aria-describedby');

      const enable2FAButton = screen.getByText(
        'Enable Two-Factor Authentication'
      );
      expect(enable2FAButton).toHaveAttribute('aria-describedby');
    });
  });

  describe('Performance', () => {
    it('memoizes session and activity lists to prevent unnecessary re-renders', async () => {
      const { rerender } = render(<SecuritySettings />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });

      const initialCallCount = mockFetch.mock.calls.length;

      // Re-render with same data
      rerender(<SecuritySettings />);

      // Should not make additional API calls
      expect(mockFetch.mock.calls.length).toBe(initialCallCount);
    });

    it('debounces activity loading to prevent excessive API calls', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      });

      const loadMoreButton = screen.getByText('Load More Activity');

      // Click multiple times quickly
      await user.click(loadMoreButton);
      await user.click(loadMoreButton);
      await user.click(loadMoreButton);

      // Should only make one additional API call
      await waitFor(() => {
        const activityCalls = mockFetch.mock.calls.filter(call =>
          call[0]?.toString().includes('/api/user/activity')
        );
        expect(activityCalls.length).toBeLessThanOrEqual(1);
      });
    });
  });
});