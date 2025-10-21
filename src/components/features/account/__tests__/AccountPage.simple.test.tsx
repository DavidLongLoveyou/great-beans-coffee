import { render } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

import AccountPage from '@/app/[locale]/dashboard/account/page';

// Mock all dependencies
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
}));

// Mock the i18n configuration
jest.mock('@/i18n', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn(),
  },
}));

// Mock all components
jest.mock('@/components/features/account/PersonalProfile', () => {
  return function MockPersonalProfile() {
    return <div>Personal Profile</div>;
  };
});

jest.mock('@/components/features/account/SecuritySettings', () => {
  return function MockSecuritySettings() {
    return <div>Security Settings</div>;
  };
});

jest.mock('@/shared/components/typography/CoffeeHeading', () => ({
  CoffeeHeading: ({ children }: any) => <h2>{children}</h2>,
}));

jest.mock('@/presentation/components/layout/ContentContainer', () => ({
  ContentContainer: ({ children }: any) => <div>{children}</div>,
}));

jest.mock('@/presentation/components/layout/ContentSection', () => ({
  ContentSection: ({ children }: any) => <div>{children}</div>,
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockUseTranslations = useTranslations as jest.MockedFunction<
  typeof useTranslations
>;

describe('AccountPage Simple Test', () => {
  beforeEach(() => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
        },
      },
      status: 'authenticated',
    } as any);

    mockUseTranslations.mockReturnValue(
      Object.assign((key: string) => key, {
        rich: (key: string) => key,
        markup: (key: string) => key,
        raw: (key: string) => key,
        has: (key: string) => true,
      }) as any
    );
  });

  it('should render without crashing', () => {
    expect(() => {
      render(<AccountPage params={Promise.resolve({ locale: 'en' as any })} />);
    }).not.toThrow();
  });
});