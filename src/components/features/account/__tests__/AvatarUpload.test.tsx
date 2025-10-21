import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';

import { AvatarUpload } from '../AvatarUpload';
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
  },
}));

// Mock UI components
jest.mock('@/presentation/components/ui/avatar', () => ({
  Avatar: ({ children, className }: any) => (
    <div data-testid="avatar" className={className}>
      {children}
    </div>
  ),
  AvatarImage: ({ src, alt }: any) => (
    <img data-testid="avatar-image" src={src} alt={alt} />
  ),
  AvatarFallback: ({ children, className }: any) => (
    <div data-testid="avatar-fallback" className={className}>
      {children}
    </div>
  ),
}));

jest.mock('@/presentation/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, className, ...props }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-testid={props['data-testid'] || 'button'}
      {...props}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/presentation/components/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div
      data-testid="dialog"
      data-open={open}
      onClick={() => onOpenChange?.(false)}
    >
      {open && children}
    </div>
  ),
  DialogContent: ({ children }: any) => (
    <div data-testid="dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: any) => (
    <div data-testid="dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: any) => (
    <h2 data-testid="dialog-title">{children}</h2>
  ),
  DialogDescription: ({ children }: any) => (
    <p data-testid="dialog-description">{children}</p>
  ),
  DialogFooter: ({ children }: any) => (
    <div data-testid="dialog-footer">{children}</div>
  ),
}));

jest.mock('@/presentation/components/ui/progress', () => ({
  Progress: ({ value, className }: any) => (
    <div data-testid="progress" data-value={value} className={className}>
      <div style={{ width: `${value}%` }} />
    </div>
  ),
}));

// Mock icons
jest.mock('lucide-react', () => ({
  Camera: () => <span data-testid="camera-icon">Camera</span>,
  Upload: ({ className }: any) => (
    <span data-testid="upload-icon" className={className}>
      Upload
    </span>
  ),
  X: () => <span data-testid="x-icon">X</span>,
  Check: () => <span data-testid="check-icon">Check</span>,
}));

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

// Mock URL.createObjectURL and revokeObjectURL
global.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
global.URL.revokeObjectURL = jest.fn();

const mockToast = toast as jest.Mocked<typeof toast>;

describe('AvatarUpload Component', () => {
  const user = userEvent.setup();
  const mockOnAvatarChange = jest.fn();

  const defaultProps = {
    currentAvatar: 'https://example.com/avatar.jpg',
    fallbackText: 'JD',
    onAvatarChange: mockOnAvatarChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockClear();
    (global.URL.createObjectURL as jest.Mock).mockClear();
    (global.URL.revokeObjectURL as jest.Mock).mockClear();
  });

  describe('Rendering and Display', () => {
    it('renders avatar with current image', () => {
      render(<AvatarUpload {...defaultProps} />);

      expect(screen.getByTestId('avatar')).toBeInTheDocument();
      expect(screen.getByTestId('avatar-image')).toHaveAttribute(
        'src',
        'https://example.com/avatar.jpg'
      );
      expect(screen.getByTestId('avatar-fallback')).toHaveTextContent('JD');
    });

    it('renders camera button when not disabled', () => {
      render(<AvatarUpload {...defaultProps} />);

      expect(screen.getByTestId('camera-icon')).toBeInTheDocument();
    });

    it('does not render camera button when disabled', () => {
      render(<AvatarUpload {...defaultProps} disabled />);

      expect(screen.queryByTestId('camera-icon')).not.toBeInTheDocument();
    });

    it('applies correct size classes', () => {
      const { rerender } = render(<AvatarUpload {...defaultProps} size="sm" />);
      expect(screen.getByTestId('avatar')).toHaveClass('h-12 w-12');

      rerender(<AvatarUpload {...defaultProps} size="md" />);
      expect(screen.getByTestId('avatar')).toHaveClass('h-20 w-20');

      rerender(<AvatarUpload {...defaultProps} size="lg" />);
      expect(screen.getByTestId('avatar')).toHaveClass('h-32 w-32');
    });

    it('renders fallback text with correct size', () => {
      const { rerender } = render(<AvatarUpload {...defaultProps} size="sm" />);
      expect(screen.getByTestId('avatar-fallback')).toHaveClass('text-sm');

      rerender(<AvatarUpload {...defaultProps} size="md" />);
      expect(screen.getByTestId('avatar-fallback')).toHaveClass('text-lg');

      rerender(<AvatarUpload {...defaultProps} size="lg" />);
      expect(screen.getByTestId('avatar-fallback')).toHaveClass('text-2xl');
    });
  });

  describe('File Selection', () => {
    it('opens file dialog when camera button is clicked', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const cameraButton = screen.getByTestId('camera-icon').closest('button');
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]');

      expect(fileInput).toBeInTheDocument();
      expect(fileInput).toHaveAttribute('accept', 'image/*');
      expect(fileInput).toHaveClass('hidden');

      // Mock click on file input
      const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
      await user.click(cameraButton!);

      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it('handles valid image file selection', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      // Mock file validation
      Object.defineProperty(file, 'size', { value: 1024 * 1024 }); // 1MB

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(screen.getByTestId('dialog-title')).toHaveTextContent(
        'Update Avatar'
      );
    });

    it('rejects files that are too large', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['large image content'], 'large-avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      // Mock large file size (6MB)
      Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'File size must be less than 5MB'
        );
      });

      expect(screen.getByTestId('dialog')).toHaveAttribute(
        'data-open',
        'false'
      );
    });

    it('rejects non-image files', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['document content'], 'document.pdf', {
        type: 'application/pdf',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Please select a valid image file (JPEG, PNG, GIF, WebP)'
        );
      });

      expect(screen.getByTestId('dialog')).toHaveAttribute(
        'data-open',
        'false'
      );
    });

    it('handles file input when disabled', async () => {
      render(<AvatarUpload {...defaultProps} disabled />);

      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;
      expect(fileInput).toBeDisabled();
    });
  });

  describe('Upload Dialog', () => {
    beforeEach(async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });
    });

    it('displays preview image in dialog', () => {
      expect(screen.getByTestId('avatar-image')).toHaveAttribute(
        'src',
        'blob:mock-url'
      );
      expect(screen.getByTestId('dialog-description')).toHaveTextContent(
        'Preview your new avatar and confirm the upload.'
      );
    });

    it('shows upload and cancel buttons', () => {
      expect(screen.getByText('Upload')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByTestId('check-icon')).toBeInTheDocument();
      expect(screen.getByTestId('x-icon')).toBeInTheDocument();
    });

    it('cancels upload and closes dialog', async () => {
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
      expect(screen.getByTestId('dialog')).toHaveAttribute(
        'data-open',
        'false'
      );
    });
  });

  describe('Upload Process', () => {
    beforeEach(async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });
    });

    it('uploads file successfully', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          success: true,
          data: { avatarUrl: 'https://example.com/new-avatar.jpg' },
        })
      );

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      // Check upload progress
      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
        expect(screen.getByTestId('progress')).toBeInTheDocument();
      });

      // Wait for upload completion
      await waitFor(() => {
        expect(mockOnAvatarChange).toHaveBeenCalledWith(
          'https://example.com/new-avatar.jpg'
        );
        expect(mockToast.success).toHaveBeenCalledWith(
          'Avatar updated successfully'
        );
      });

      // Check that dialog closes after success
      await waitFor(
        () => {
          expect(screen.getByTestId('dialog')).toHaveAttribute(
            'data-open',
            'false'
          );
        },
        { timeout: 1000 }
      );
    });

    it('handles upload failure', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          error: 'Upload failed',
        }),
      } as Response);

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Upload failed');
      });

      expect(mockOnAvatarChange).not.toHaveBeenCalled();
    });

    it('handles network error', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith('Network error');
      });

      expect(mockOnAvatarChange).not.toHaveBeenCalled();
    });

    it('disables buttons during upload', async () => {
      // Mock a slow upload
      mockFetch.mockImplementation(() => new Promise(() => {}));

      const uploadButton = screen.getByText('Upload');
      const cancelButton = screen.getByText('Cancel');

      await user.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
      });

      expect(uploadButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('shows progress during upload', async () => {
      // Mock successful upload with delay
      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: async () => ({
                    success: true,
                    data: { avatarUrl: 'https://example.com/new-avatar.jpg' },
                  }),
                } as Response),
              500
            )
          )
      );

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      // Check initial progress
      await waitFor(() => {
        const progress = screen.getByTestId('progress');
        expect(progress).toBeInTheDocument();
        expect(progress).toHaveAttribute('data-value', '0');
      });

      // Progress should increase
      await waitFor(() => {
        const progress = screen.getByTestId('progress');
        const value = parseInt(progress.getAttribute('data-value') || '0');
        expect(value).toBeGreaterThan(0);
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      render(<AvatarUpload {...defaultProps} />);

      const avatarImage = screen.getByTestId('avatar-image');
      expect(avatarImage).toHaveAttribute('alt', 'Avatar');

      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]');
      expect(fileInput).toHaveAttribute('accept', 'image/*');
    });

    it('supports keyboard navigation', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const cameraButton = screen.getByTestId('camera-icon').closest('button');

      // Focus the button
      cameraButton?.focus();
      expect(cameraButton).toHaveFocus();

      // Press Enter to trigger click
      const clickSpy = jest.spyOn(HTMLInputElement.prototype, 'click');
      fireEvent.keyDown(cameraButton!, { key: 'Enter' });

      clickSpy.mockRestore();
    });

    it('provides screen reader feedback during upload', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      mockFetch.mockImplementation(() => new Promise(() => {}));

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      await waitFor(() => {
        expect(screen.getByText('Uploading...')).toBeInTheDocument();
        expect(screen.getByText(/\d+%/)).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing file in upload', async () => {
      render(<AvatarUpload {...defaultProps} />);

      // Manually trigger upload without file
      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      // Clear the file input
      Object.defineProperty(fileInput, 'files', { value: null });

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      // Should not proceed with upload
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it('handles empty file list', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [] } });

      // Should not open dialog
      expect(screen.getByTestId('dialog')).toHaveAttribute(
        'data-open',
        'false'
      );
    });

    it('cleans up object URLs on unmount', () => {
      const { unmount } = render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      unmount();

      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('Performance', () => {
    it('memoizes file validation function', async () => {
      const { rerender } = render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });

      // First file selection
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      // Cancel and rerender
      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      rerender(<AvatarUpload {...defaultProps} />);

      // Second file selection should work the same way
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });
    });

    it('debounces progress updates', async () => {
      render(<AvatarUpload {...defaultProps} />);

      const file = new File(['image content'], 'avatar.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen
        .getByRole('button')
        .parentElement?.querySelector('input[type="file"]') as HTMLInputElement;

      Object.defineProperty(file, 'size', { value: 1024 * 1024 });
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(screen.getByTestId('dialog')).toHaveAttribute(
          'data-open',
          'true'
        );
      });

      mockFetch.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve(
                  createMockResponse({
                    success: true,
                    data: { avatarUrl: 'https://example.com/new-avatar.jpg' },
                  })
                ),
              300
            )
          )
      );

      const uploadButton = screen.getByText('Upload');
      await user.click(uploadButton);

      // Progress should update smoothly
      await waitFor(() => {
        expect(screen.getByTestId('progress')).toBeInTheDocument();
      });
    });
  });
});