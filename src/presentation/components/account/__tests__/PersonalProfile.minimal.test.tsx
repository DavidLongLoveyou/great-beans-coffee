import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PersonalProfile } from '@/components/features/account/PersonalProfile';

// Mock all UI components
jest.mock('@/presentation/components/ui/card', () => ({
  Card: ({ children, ...props }: any) => (
    <div data-testid="card" {...props}>
      {children}
    </div>
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
}));

jest.mock('@/presentation/components/ui/button', () => ({
  Button: ({ children, ...props }: any) => (
    <button data-testid="button" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/presentation/components/ui/input', () => ({
  Input: (props: any) => <input data-testid="input" {...props} />,
}));

jest.mock('@/presentation/components/ui/label', () => ({
  Label: ({ children, ...props }: any) => (
    <label data-testid="label" {...props}>
      {children}
    </label>
  ),
}));

jest.mock('@/presentation/components/ui/textarea', () => ({
  Textarea: (props: any) => <textarea data-testid="textarea" {...props} />,
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

jest.mock('@/presentation/components/ui/badge', () => ({
  Badge: ({ children, ...props }: any) => (
    <span data-testid="badge" {...props}>
      {children}
    </span>
  ),
}));

jest.mock('@/presentation/components/ui/separator', () => ({
  Separator: (props: any) => <hr data-testid="separator" {...props} />,
}));

jest.mock('@/components/features/account/AvatarUpload', () => ({
  AvatarUpload: (props: any) => (
    <div data-testid="avatar-upload" {...props}>
      Avatar Upload
    </div>
  ),
}));

// Mock Lucide React icons
jest.mock('lucide-react', () => ({
  Edit: (props: any) => <div data-testid="edit-icon" {...props} />,
  Save: (props: any) => <div data-testid="save-icon" {...props} />,
  X: (props: any) => <div data-testid="x-icon" {...props} />,
  User: (props: any) => <div data-testid="user-icon" {...props} />,
  Mail: (props: any) => <div data-testid="mail-icon" {...props} />,
  Phone: (props: any) => <div data-testid="phone-icon" {...props} />,
  MapPin: (props: any) => <div data-testid="mappin-icon" {...props} />,
  Calendar: (props: any) => <div data-testid="calendar-icon" {...props} />,
  Briefcase: (props: any) => <div data-testid="briefcase-icon" {...props} />,
}));

// Mock dependencies
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock global fetch
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('PersonalProfile Minimal Test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            data: {
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
            },
          }),
      } as Response)
    );
  });

  it('should render without crashing', async () => {
    render(<PersonalProfile />);

    // Wait for the component to load
    await waitFor(() => {
      expect(screen.getByText('Personal Information')).toBeInTheDocument();
    });

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('displays loading state initially', () => {
    mockFetch.mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<PersonalProfile />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
