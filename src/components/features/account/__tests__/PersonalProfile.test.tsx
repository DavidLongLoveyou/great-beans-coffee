import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { PersonalProfile } from '../PersonalProfile';
import { createWrapper } from '@/test/utils';

// Helper function to create mock Response objects
const createMockResponse = (
  data: any,
  options: { ok?: boolean; status?: number } = {}
): Response => {
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

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock AvatarUpload component
jest.mock('../AvatarUpload', () => ({
  AvatarUpload: ({
    currentAvatar,
    onAvatarChange,
    disabled,
    size,
    fallbackText,
  }: any) => (
    <div data-testid="avatar-upload" data-disabled={disabled} data-size={size}>
      <img src={currentAvatar} alt="Avatar" data-testid="avatar-image" />
      <span data-testid="avatar-fallback">{fallbackText}</span>
      <button
        onClick={() => onAvatarChange?.('new-avatar-url')}
        disabled={disabled}
        data-testid="avatar-upload-button"
      >
        Upload Avatar
      </button>
    </div>
  ),
}));

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

const mockToast = toast as jest.Mocked<typeof toast>;

describe('PersonalProfile Component', () => {
  const user = userEvent.setup();

  const mockProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@greatbeans.com',
    phone: '+1-555-0123',
    position: 'Senior Coffee Buyer',
    department: 'Procurement',
    bio: 'Experienced coffee buyer with 10+ years in the industry',
    location: 'Ho Chi Minh City, Vietnam',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'en',
    avatar: 'https://example.com/avatar.jpg',
    createdAt: '2024-01-01T00:00:00Z',
    lastLoginAt: '2024-01-15T10:30:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        data: mockProfileData,
      }),
    } as Response);
  });

  describe('Rendering', () => {
    it('renders personal profile interface', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(
        screen.getByText('Manage your personal details and preferences')
      ).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      });
    });

    it('displays loading state initially', () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<PersonalProfile />, { wrapper: createWrapper() });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('loads and displays profile data', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
        expect(
          screen.getByDisplayValue('john.doe@greatbeans.com')
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue('+1-555-0123')).toBeInTheDocument();
        expect(
          screen.getByDisplayValue('Senior Coffee Buyer')
        ).toBeInTheDocument();
        expect(screen.getByDisplayValue('Procurement')).toBeInTheDocument();
        expect(
          screen.getByDisplayValue(
            'Experienced coffee buyer with 10+ years in the industry'
          )
        ).toBeInTheDocument();
        expect(
          screen.getByDisplayValue('Ho Chi Minh City, Vietnam')
        ).toBeInTheDocument();
      });

      expect(mockFetch).toHaveBeenCalledWith('/api/user/profile');
    });

    it('displays account information badges', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('1/1/2024')).toBeInTheDocument(); // Join date
        expect(screen.getByText('1/15/2024')).toBeInTheDocument(); // Last login
      });
    });

    it('shows all form sections', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Contact Information')).toBeInTheDocument();
        expect(
          screen.getByText('Professional Information')
        ).toBeInTheDocument();
        expect(screen.getByText('Preferences')).toBeInTheDocument();
        expect(screen.getByText('Account Information')).toBeInTheDocument();
      });
    });
  });

  describe('Edit Mode', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });
    });

    it('enters edit mode when edit button is clicked', async () => {
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save Changes')).toBeInTheDocument();

      // Check that inputs are enabled
      const firstNameInput = screen.getByLabelText('First Name');
      expect(firstNameInput).not.toBeDisabled();
    });

    it('cancels edit mode when cancel button is clicked', async () => {
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      // Make some changes
      const firstNameInput = screen.getByLabelText('First Name');
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Cancel changes
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByDisplayValue('John')).toBeInTheDocument(); // Original value restored
    });

    it('disables inputs when not in edit mode', async () => {
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');
      const phoneInput = screen.getByLabelText('Phone Number');

      expect(firstNameInput).toBeDisabled();
      expect(lastNameInput).toBeDisabled();
      expect(phoneInput).toBeDisabled();
    });

    it('keeps email field disabled even in edit mode', async () => {
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      const emailInput = screen.getByLabelText('Email Address');
      expect(emailInput).toBeDisabled();
    });

    it('enables avatar upload only in edit mode', async () => {
      const avatarUpload = screen.getByTestId('avatar-upload');
      expect(avatarUpload).toHaveAttribute('data-disabled', 'true');

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      expect(avatarUpload).toHaveAttribute('data-disabled', 'false');
    });
  });

  describe('Form Validation', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);
    });

    it('validates required fields', async () => {
      const firstNameInput = screen.getByLabelText('First Name');
      const lastNameInput = screen.getByLabelText('Last Name');

      await user.clear(firstNameInput);
      await user.clear(lastNameInput);

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Last name is required')).toBeInTheDocument();
    });

    it('validates phone number format', async () => {
      const phoneInput = screen.getByLabelText('Phone Number');

      await user.clear(phoneInput);
      await user.type(phoneInput, 'invalid-phone');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(
        screen.getByText('Please enter a valid phone number')
      ).toBeInTheDocument();
    });

    it('validates bio length', async () => {
      const bioInput = screen.getByLabelText('Bio');
      const longBio = 'a'.repeat(501); // Assuming 500 character limit

      await user.clear(bioInput);
      await user.type(bioInput, longBio);

      expect(
        screen.getByText('Bio must be less than 500 characters')
      ).toBeInTheDocument();
    });

    it('shows character count for bio field', async () => {
      const bioInput = screen.getByLabelText('Bio');

      await user.clear(bioInput);
      await user.type(bioInput, 'Short bio');

      expect(screen.getByText('9/500')).toBeInTheDocument();
    });
  });

  describe('Profile Updates', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);
    });

    it('saves profile changes successfully', async () => {
      mockFetch.mockResolvedValueOnce(createMockResponse({ success: true }));

      const firstNameInput = screen.getByLabelText('First Name');
      const phoneInput = screen.getByLabelText('Phone Number');

      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');
      await user.clear(phoneInput);
      await user.type(phoneInput, '+1-555-9999');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(mockFetch).toHaveBeenCalledWith('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: 'Jane',
          lastName: 'Doe',
          phone: '+1-555-9999',
          position: 'Senior Coffee Buyer',
          department: 'Procurement',
          bio: 'Experienced coffee buyer with 10+ years in the industry',
          location: 'Ho Chi Minh City, Vietnam',
          timezone: 'Asia/Ho_Chi_Minh',
          language: 'en',
        }),
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Personal information updated successfully'
        );
        expect(screen.getByText('Edit')).toBeInTheDocument(); // Back to view mode
      });
    });

    it('handles save errors gracefully', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const firstNameInput = screen.getByLabelText('First Name');
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to update profile'
        );
        expect(screen.getByText('Cancel')).toBeInTheDocument(); // Still in edit mode
      });
    });

    it('shows loading state during save', async () => {
      mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      expect(screen.getByText('Saving...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    it('handles server validation errors', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse(
          {
            success: false,
            error: 'Phone number already exists',
          },
          { ok: false, status: 400 }
        )
      );

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Phone number already exists'
        );
      });
    });
  });

  describe('Avatar Management', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);
    });

    it('displays current avatar', () => {
      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toHaveAttribute(
        'src',
        'https://example.com/avatar.jpg'
      );
    });

    it('shows initials fallback when no avatar', async () => {
      // Mock profile without avatar
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { ...mockProfileData, avatar: '' },
        }),
      } as Response);

      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
      });
    });

    it('handles avatar upload', async () => {
      const avatarUploadButton = screen.getByTestId('avatar-upload-button');
      await user.click(avatarUploadButton);

      // Avatar change should update local state
      expect(screen.getByTestId('avatar-image')).toHaveAttribute(
        'src',
        'new-avatar-url'
      );
    });

    it('uploads avatar with correct size', () => {
      const avatarUpload = screen.getByTestId('avatar-upload');
      expect(avatarUpload).toHaveAttribute('data-size', 'lg');
    });
  });

  describe('Timezone and Language Selection', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);
    });

    it('displays timezone options', () => {
      const timezoneSelect = screen.getByTestId('timezone-select');
      expect(timezoneSelect).toBeInTheDocument();
    });

    it('displays language options', () => {
      const languageSelect = screen.getByTestId('language-select');
      expect(languageSelect).toBeInTheDocument();
    });

    it('updates timezone selection', async () => {
      const timezoneSelect = screen.getByTestId('timezone-select');
      await user.click(timezoneSelect);

      const utcOption = screen.getByText('UTC (Coordinated Universal Time)');
      await user.click(utcOption);

      expect(screen.getByDisplayValue('UTC')).toBeInTheDocument();
    });

    it('updates language selection', async () => {
      const languageSelect = screen.getByTestId('language-select');
      await user.click(languageSelect);

      const vietnameseOption = screen.getByText('Tiếng Việt');
      await user.click(vietnameseOption);

      expect(screen.getByDisplayValue('vi')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error when profile fails to load', async () => {
      mockFetch.mockRejectedValueOnce(new Error('API Error'));

      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to load profile data'
        );
      });
    });

    it('handles malformed API response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: false }),
      } as Response);

      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to load profile data'
        );
      });
    });

    it('handles network errors during save', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const saveButton = screen.getByText('Save Changes');
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to update profile'
        );
      });
    });
  });

  describe('Accessibility', () => {
    beforeEach(async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });
      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });
    });

    it('has proper ARIA labels', () => {
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
      expect(screen.getByLabelText('Phone Number')).toBeInTheDocument();
      expect(screen.getByLabelText('Position')).toBeInTheDocument();
      expect(screen.getByLabelText('Department')).toBeInTheDocument();
      expect(screen.getByLabelText('Bio')).toBeInTheDocument();
      expect(screen.getByLabelText('Location')).toBeInTheDocument();
    });

    it('supports keyboard navigation', async () => {
      const editButton = screen.getByText('Edit');
      editButton.focus();

      fireEvent.keyDown(editButton, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText('Cancel')).toBeInTheDocument();
      });
    });

    it('has proper heading structure', () => {
      const mainHeading = screen.getByRole('heading', { level: 3 });
      expect(mainHeading).toHaveTextContent('Personal Information');

      const sectionHeadings = screen.getAllByRole('heading', { level: 4 });
      expect(sectionHeadings.length).toBeGreaterThan(0);
    });

    it('provides form validation feedback', async () => {
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      const firstNameInput = screen.getByLabelText('First Name');
      await user.clear(firstNameInput);

      expect(firstNameInput).toHaveAttribute('aria-invalid', 'true');
      expect(firstNameInput).toHaveAttribute('aria-describedby');
    });

    it('announces save status to screen readers', async () => {
      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      } as Response);

      const saveButton = screen.getByText('Save Changes');
      expect(saveButton).toHaveAttribute('aria-describedby');

      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByRole('status')).toHaveTextContent(
          'Profile updated successfully'
        );
      });
    });
  });

  describe('Performance', () => {
    it('memoizes form data to prevent unnecessary re-renders', async () => {
      const { rerender } = render(<PersonalProfile />, {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const initialCallCount = mockFetch.mock.calls.length;

      // Re-render with same props
      rerender(<PersonalProfile />);

      // Should not make additional API calls
      expect(mockFetch.mock.calls.length).toBe(initialCallCount);
    });

    it('debounces form validation to prevent excessive validation calls', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      const firstNameInput = screen.getByLabelText('First Name');

      // Type quickly
      await user.type(firstNameInput, 'abcdefghijk');

      // Should only validate once after typing stops
      await waitFor(() => {
        const validationMessages = screen.queryAllByText(/validation/i);
        expect(validationMessages.length).toBeLessThanOrEqual(1);
      });
    });
  });
});