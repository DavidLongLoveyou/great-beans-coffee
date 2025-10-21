import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import SecuritySettings from '@/components/features/account/SecuritySettings';
import { mockUser, createWrapper } from '@/test/utils';

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

jest.mock('@/infrastructure/api/security-api', () => ({
  getSecurityData: jest.fn(),
  changePassword: jest.fn(),
  enable2FA: jest.fn(),
  verify2FA: jest.fn(),
  disable2FA: jest.fn(),
  revokeSession: jest.fn(),
  getActiveSessions: jest.fn(),
  getSecurityEvents: jest.fn(),
}));

jest.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser(),
    isAuthenticated: true,
    isLoading: false,
  }),
}));

const mockSecurityApi = jest.requireMock('@/infrastructure/api/security-api');
const mockToast = toast as jest.Mocked<typeof toast>;

describe('SecuritySettings Component', () => {
  const user = userEvent.setup();

  const mockSecurityData = {
    twoFactorEnabled: false,
    lastPasswordChange: '2024-01-15T10:30:00Z',
    activeSessions: [
      {
        id: 'session-1',
        device: 'Chrome on Windows',
        location: 'New York, US',
        lastActive: '2024-01-20T14:30:00Z',
        current: true,
      },
      {
        id: 'session-2',
        device: 'Safari on iPhone',
        location: 'Los Angeles, US',
        lastActive: '2024-01-19T09:15:00Z',
        current: false,
      },
    ],
    recentActivity: [
      {
        id: 'event-1',
        type: 'login',
        description: 'Successful login from Chrome on Windows',
        timestamp: '2024-01-20T14:30:00Z',
        location: 'New York, US',
        riskLevel: 'low',
      },
      {
        id: 'event-2',
        type: 'password_change',
        description: 'Password changed successfully',
        timestamp: '2024-01-15T10:30:00Z',
        location: 'New York, US',
        riskLevel: 'low',
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockSecurityApi.getSecurityData.mockResolvedValue({
      success: true,
      data: mockSecurityData,
    });
    mockSecurityApi.getActiveSessions.mockResolvedValue({
      success: true,
      data: mockSecurityData.activeSessions,
    });
    mockSecurityApi.getSecurityEvents.mockResolvedValue({
      success: true,
      data: mockSecurityData.recentActivity,
    });
  });

  describe('Rendering', () => {
    it('renders all security sections', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
      });

      expect(screen.getByText('Password Security')).toBeInTheDocument();
      expect(screen.getByText('Two-Factor Authentication')).toBeInTheDocument();
      expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      expect(screen.getByText('Recent Activity')).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
      mockSecurityApi.getSecurityData.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<SecuritySettings />, { wrapper: createWrapper() });

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('displays error state when security data loading fails', async () => {
      mockSecurityApi.getSecurityData.mockRejectedValue(
        new Error('Failed to load security data')
      );

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText(/failed to load security data/i)
        ).toBeInTheDocument();
      });
    });

    it('shows 2FA status correctly', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Two-Factor Authentication')
        ).toBeInTheDocument();
      });

      expect(screen.getByText('Disabled')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /enable 2fa/i })
      ).toBeInTheDocument();
    });

    it('displays active sessions', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      });

      expect(screen.getByText('Chrome on Windows')).toBeInTheDocument();
      expect(screen.getByText('Safari on iPhone')).toBeInTheDocument();
      expect(screen.getByText('Current Session')).toBeInTheDocument();
    });

    it('displays recent security activity', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      });

      expect(
        screen.getByText('Successful login from Chrome on Windows')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Password changed successfully')
      ).toBeInTheDocument();
    });
  });

  describe('Password Change', () => {
    it('opens password change dialog', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      expect(screen.getByText('Change Password')).toBeInTheDocument();
      expect(screen.getByLabelText(/current password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
      expect(
        screen.getByLabelText(/confirm new password/i)
      ).toBeInTheDocument();
    });

    it('validates password change form', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Try to submit without filling fields
      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/current password is required/i)
        ).toBeInTheDocument();
        expect(
          screen.getByText(/new password is required/i)
        ).toBeInTheDocument();
      });
    });

    it('validates password strength', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Enter weak password
      const newPasswordInput = screen.getByLabelText(/new password/i);
      await user.type(newPasswordInput, '123');

      await waitFor(() => {
        expect(
          screen.getByText(/password must be at least 8 characters/i)
        ).toBeInTheDocument();
      });
    });

    it('validates password confirmation', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Enter mismatched passwords
      const newPasswordInput = screen.getByLabelText(/new password/i);
      const confirmPasswordInput =
        screen.getByLabelText(/confirm new password/i);

      await user.type(newPasswordInput, 'NewPassword123!');
      await user.type(confirmPasswordInput, 'DifferentPassword123!');

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('successfully changes password', async () => {
      mockSecurityApi.changePassword.mockResolvedValue({
        success: true,
        message: 'Password changed successfully',
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Fill form with valid data
      await user.type(
        screen.getByLabelText(/current password/i),
        'CurrentPassword123!'
      );
      await user.type(
        screen.getByLabelText(/new password/i),
        'NewPassword123!'
      );
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSecurityApi.changePassword).toHaveBeenCalledWith({
          currentPassword: 'CurrentPassword123!',
          newPassword: 'NewPassword123!',
        });
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        'Password changed successfully'
      );
    });

    it('handles password change errors', async () => {
      mockSecurityApi.changePassword.mockRejectedValue(
        new Error('Current password is incorrect')
      );

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Fill form with valid data
      await user.type(
        screen.getByLabelText(/current password/i),
        'WrongPassword'
      );
      await user.type(
        screen.getByLabelText(/new password/i),
        'NewPassword123!'
      );
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Current password is incorrect'
        );
      });
    });
  });

  describe('Two-Factor Authentication', () => {
    it('enables 2FA successfully', async () => {
      const qrCodeData =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
      const backupCodes = ['123456', '789012', '345678'];

      mockSecurityApi.enable2FA.mockResolvedValue({
        success: true,
        data: { qrCode: qrCodeData, backupCodes },
      });

      mockSecurityApi.verify2FA.mockResolvedValue({
        success: true,
        message: '2FA enabled successfully',
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Two-Factor Authentication')
        ).toBeInTheDocument();
      });

      // Click enable 2FA
      const enableButton = screen.getByRole('button', { name: /enable 2fa/i });
      await user.click(enableButton);

      await waitFor(() => {
        expect(
          screen.getByText('Set Up Two-Factor Authentication')
        ).toBeInTheDocument();
        expect(screen.getByAltText('QR Code')).toBeInTheDocument();
      });

      // Enter verification code
      const codeInput = screen.getByLabelText(/verification code/i);
      await user.type(codeInput, '123456');

      const verifyButton = screen.getByRole('button', {
        name: /verify and enable/i,
      });
      await user.click(verifyButton);

      await waitFor(() => {
        expect(mockSecurityApi.verify2FA).toHaveBeenCalledWith('123456');
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        '2FA enabled successfully'
      );
    });

    it('validates 2FA verification code', async () => {
      const qrCodeData =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

      mockSecurityApi.enable2FA.mockResolvedValue({
        success: true,
        data: { qrCode: qrCodeData, backupCodes: [] },
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(
          screen.getByText('Two-Factor Authentication')
        ).toBeInTheDocument();
      });

      const enableButton = screen.getByRole('button', { name: /enable 2fa/i });
      await user.click(enableButton);

      await waitFor(() => {
        expect(
          screen.getByText('Set Up Two-Factor Authentication')
        ).toBeInTheDocument();
      });

      // Try to verify without entering code
      const verifyButton = screen.getByRole('button', {
        name: /verify and enable/i,
      });
      await user.click(verifyButton);

      await waitFor(() => {
        expect(
          screen.getByText(/verification code is required/i)
        ).toBeInTheDocument();
      });
    });

    it('disables 2FA successfully', async () => {
      // Mock 2FA as enabled
      mockSecurityApi.getSecurityData.mockResolvedValue({
        success: true,
        data: { ...mockSecurityData, twoFactorEnabled: true },
      });

      mockSecurityApi.disable2FA.mockResolvedValue({
        success: true,
        message: '2FA disabled successfully',
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Enabled')).toBeInTheDocument();
      });

      const disableButton = screen.getByRole('button', {
        name: /disable 2fa/i,
      });
      await user.click(disableButton);

      // Confirm in dialog
      const confirmButton = screen.getByRole('button', { name: /disable/i });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockSecurityApi.disable2FA).toHaveBeenCalled();
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        '2FA disabled successfully'
      );
    });
  });

  describe('Session Management', () => {
    it('revokes a session successfully', async () => {
      mockSecurityApi.revokeSession.mockResolvedValue({
        success: true,
        message: 'Session revoked successfully',
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      });

      // Find and click revoke button for non-current session
      const revokeButtons = screen.getAllByRole('button', { name: /revoke/i });
      expect(revokeButtons).toHaveLength(1);
      await user.click(revokeButtons[0]!);

      // Confirm in dialog
      const confirmButton = screen.getByRole('button', {
        name: /revoke session/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockSecurityApi.revokeSession).toHaveBeenCalledWith('session-2');
      });

      expect(mockToast.success).toHaveBeenCalledWith(
        'Session revoked successfully'
      );
    });

    it('prevents revoking current session', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Active Sessions')).toBeInTheDocument();
      });

      // Current session should not have a revoke button
      const currentSessionCard = screen
        .getByText('Current Session')
        .closest('[data-testid="session-card"]');
      expect(currentSessionCard).not.toContainElement(
        screen.queryByRole('button', { name: /revoke/i })
      );
    });

    it('refreshes sessions after revoking', async () => {
      mockSecurityApi.revokeSession.mockResolvedValue({
        success: true,
        message: 'Session revoked successfully',
      });

      // Mock updated sessions list without the revoked session
      const updatedSessions = [mockSecurityData.activeSessions[0]];
      mockSecurityApi.getActiveSessions.mockResolvedValueOnce({
        success: true,
        data: updatedSessions,
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Safari on iPhone')).toBeInTheDocument();
      });

      const revokeButtons = screen.getAllByRole('button', { name: /revoke/i });
      expect(revokeButtons).toHaveLength(1);
      await user.click(revokeButtons[0]!);

      const confirmButton = screen.getByRole('button', {
        name: /revoke session/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.queryByText('Safari on iPhone')).not.toBeInTheDocument();
      });
    });
  });

  describe('Security Activity', () => {
    it('displays security events with proper formatting', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      });

      // Check event details
      expect(
        screen.getByText('Successful login from Chrome on Windows')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Password changed successfully')
      ).toBeInTheDocument();

      // Check timestamps are formatted
      expect(screen.getByText(/Jan 20, 2024/)).toBeInTheDocument();
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    it('shows appropriate icons for different event types', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      });

      // Check for login and password change icons
      expect(screen.getByTestId('login-icon')).toBeInTheDocument();
      expect(screen.getByTestId('password-change-icon')).toBeInTheDocument();
    });

    it('handles empty activity list', async () => {
      mockSecurityApi.getSecurityEvents.mockResolvedValue({
        success: true,
        data: [],
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Recent Activity')).toBeInTheDocument();
      });

      expect(
        screen.getByText('No recent security activity')
      ).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels and roles', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
      });

      // Check main sections have proper headings
      expect(
        screen.getByRole('heading', { name: 'Password Security' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Two-Factor Authentication' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Active Sessions' })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'Recent Activity' })
      ).toBeInTheDocument();

      // Check buttons have proper labels
      expect(
        screen.getByRole('button', { name: /change password/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /enable 2fa/i })
      ).toBeInTheDocument();
    });

    it('announces status changes to screen readers', async () => {
      mockSecurityApi.changePassword.mockResolvedValue({
        success: true,
        message: 'Password changed successfully',
      });

      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      // Fill and submit form
      await user.type(
        screen.getByLabelText(/current password/i),
        'CurrentPassword123!'
      );
      await user.type(
        screen.getByLabelText(/new password/i),
        'NewPassword123!'
      );
      await user.type(
        screen.getByLabelText(/confirm new password/i),
        'NewPassword123!'
      );

      const submitButton = screen.getByRole('button', {
        name: /update password/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        // Toast should have proper ARIA attributes
        expect(mockToast.success).toHaveBeenCalledWith(
          'Password changed successfully'
        );
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation through security sections', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Security Settings')).toBeInTheDocument();
      });

      // Tab through interactive elements
      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      changePasswordButton.focus();

      await user.keyboard('{Tab}');
      expect(screen.getByRole('button', { name: /enable 2fa/i })).toHaveFocus();
    });

    it('supports Enter key to activate buttons', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      changePasswordButton.focus();
      await user.keyboard('{Enter}');

      expect(screen.getByText('Change Password')).toBeInTheDocument();
    });

    it('supports Escape key to close dialogs', async () => {
      render(<SecuritySettings />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Password Security')).toBeInTheDocument();
      });

      const changePasswordButton = screen.getByRole('button', {
        name: /change password/i,
      });
      await user.click(changePasswordButton);

      expect(screen.getByText('Change Password')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Change Password')).not.toBeInTheDocument();
      });
    });
  });
});
