import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { toast } from 'sonner';

import { PersonalProfile } from '@/components/features/account/PersonalProfile';

// Mock all UI components
jest.mock('@/presentation/components/ui/avatar', () => ({
  Avatar: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar">{children}</div>
  ),
  AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="avatar-image" />
  ),
  AvatarFallback: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="avatar-fallback">{children}</div>
  ),
}));

jest.mock('@/presentation/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/presentation/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock('@/presentation/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => <label {...props}>{children}</label>,
}));

jest.mock('@/presentation/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
  ),
  CardHeader: ({ children, ...props }: any) => (
    <div data-testid="card-header" {...props}>
      {children}
    </div>
  ),
  CardTitle: ({ children, ...props }: any) => (
    <h3 data-testid="card-title" {...props}>
      {children}
    </h3>
  ),
  CardContent: ({ children, ...props }: any) => (
    <div data-testid="card-content" {...props}>
      {children}
    </div>
  ),
  CardDescription: ({ children, ...props }: any) => (
    <div data-testid="card-description" {...props}>
      {children}
    </div>
  ),
}));

jest.mock('@/presentation/components/ui/separator', () => ({
  Separator: (props: any) => <hr data-testid="separator" {...props} />,
}));

jest.mock('@/presentation/components/ui/badge', () => ({
  Badge: ({ children, variant, ...props }: any) => (
    <span data-testid="badge" data-variant={variant} {...props}>
      {children}
    </span>
  ),
}));

jest.mock('@/presentation/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock('@/presentation/components/ui/select', () => ({
  Select: ({ children, ...props }: any) => (
    <div data-testid="select" {...props}>
      {children}
    </div>
  ),
  SelectContent: ({ children, ...props }: any) => (
    <div data-testid="select-content" {...props}>
      {children}
    </div>
  ),
  SelectItem: ({ children, ...props }: any) => (
    <div data-testid="select-item" {...props}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: any) => (
    <div data-testid="select-trigger" {...props}>
      {children}
    </div>
  ),
  SelectValue: ({ children, ...props }: any) => (
    <div data-testid="select-value" {...props}>
      {children}
    </div>
  ),
}));

// Mock AvatarUpload component
jest.mock('@/components/features/account/AvatarUpload', () => ({
  AvatarUpload: ({ currentAvatar, onAvatarChange }: any) => (
    <div data-testid="avatar-upload">
      <img
        src={currentAvatar}
        alt="Current avatar"
        data-testid="current-avatar"
      />
      <button onClick={() => onAvatarChange?.('new-avatar-url')}>
        Upload Avatar
      </button>
    </div>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  User: () => <div data-testid="user-icon" />,
  Mail: () => <div data-testid="mail-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Building: () => <div data-testid="building-icon" />,
  Calendar: () => <div data-testid="calendar-icon" />,
  Shield: () => <div data-testid="shield-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Save: () => <div data-testid="save-icon" />,
  X: () => <div data-testid="x-icon" />,
  Camera: () => <div data-testid="camera-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock fetch globally
global.fetch = jest.fn();

// Mock user data
const mockUser = {
  id: '1',
  email: 'john.doe@example.com',
  profile: {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    avatar: 'https://example.com/avatar.jpg',
    address: {
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA',
    },
    company: {
      name: 'Acme Corp',
      position: 'Developer',
    },
  },
  role: 'buyer',
  status: 'active',
  preferences: {
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: new Date('2023-01-01'),
    loginAttempts: 0,
    accountLocked: false,
  },
  activity: {
    lastLogin: new Date('2023-12-01'),
    loginCount: 10,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-12-01'),
  },
};

// Mock test wrapper
const createWrapper =
  () =>
  ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

jest.mock('@/shared/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: mockUser,
    isAuthenticated: true,
    isLoading: false,
  }),
}));

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;
const mockToast = toast as jest.Mocked<typeof toast>;

describe('PersonalProfile Component', () => {
  const user = userEvent.setup();

  const mockProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    position: 'Coffee Buyer',
    department: 'Procurement',
    bio: 'Coffee enthusiast',
    location: 'New York',
    timezone: 'UTC',
    language: 'en',
    avatar: '',
    createdAt: '2024-01-01',
    lastLoginAt: '2024-01-15',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: mockProfileData,
          }),
      } as Response)
    );
  });

  describe('Rendering', () => {
    it('renders the personal profile form', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    });

    it('displays loading state initially', () => {
      mockFetch.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<PersonalProfile />, { wrapper: createWrapper() });

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('displays error state when profile loading fails', async () => {
      mockFetch.mockRejectedValue(new Error('Failed to load profile'));

      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to load profile data'
        );
      });
    });

    it('displays profile data after loading', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Coffee enthusiast')).toBeInTheDocument();
      });

      expect(screen.getByText('1/1/2024')).toBeInTheDocument();
      expect(screen.getByText('1/15/2024')).toBeInTheDocument();
    });
  });

  describe('Form Interactions', () => {
    it('enables edit mode when edit button is clicked', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Coffee enthusiast')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel/i })
      ).toBeInTheDocument();
    });

    it('cancels edit mode and reverts changes', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Coffee enthusiast')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Clear required field
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);

      // Try to save
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Enter invalid email
      const emailInput = screen.getByLabelText(/email/i);
      await user.clear(emailInput);
      await user.type(emailInput, 'invalid-email');

      // Try to save
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
      });
    });

    it('validates phone number format', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Personal Information')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Enter invalid phone number
      const phoneInput = screen.getByLabelText(/phone number/i);
      await user.clear(phoneInput);
      await user.type(phoneInput, '123');

      // Try to save
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(
          screen.getByText(/invalid phone number format/i)
        ).toBeInTheDocument();
      });
    });
  });

  describe('Profile Updates', () => {
    it('saves profile successfully', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Coffee enthusiast')).toBeInTheDocument();
      });

      const editButton = screen.getByRole('button', { name: /edit/i });
      fireEvent.click(editButton);

      const saveButton = screen.getByRole('button', { name: /save/i });
      fireEvent.click(saveButton);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          '/api/user/profile',
          expect.objectContaining({
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          })
        );
      });
    });

    it('handles save errors gracefully', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Make changes
      const firstNameInput = screen.getByLabelText(/first name/i);
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'Jane');

      // Mock failed update
      mockFetch.mockRejectedValueOnce(new Error('Failed to update profile'));

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Failed to update profile'
        );
      });
    });

    it('shows loading state during save', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      });

      // Enter edit mode
      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      // Mock slow update
      mockFetch.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      // Save changes
      const saveButton = screen.getByRole('button', { name: /save/i });
      await user.click(saveButton);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Accessibility', () => {
    it('has proper form labels and structure', async () => {
      render(<PersonalProfile />, { wrapper: createWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Coffee enthusiast')).toBeInTheDocument();
      });

      expect(screen.getByText('Personal Information')).toBeInTheDocument();
      expect(screen.getByText('Contact Information')).toBeInTheDocument();
      expect(screen.getByText('Professional Information')).toBeInTheDocument();
    });
  });
});
