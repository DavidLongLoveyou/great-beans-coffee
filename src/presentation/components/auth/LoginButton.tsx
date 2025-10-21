'use client';

import { useAuth } from '@/shared/contexts/AuthContext';
import { navigationStorage } from '@/shared/utils/sessionStorage';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { LogIn, UserPlus } from '@/components/ui/icons';

import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';

interface LoginButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showDropdown?: boolean;
  className?: string;
}

export function LoginButton({
  variant = 'default',
  size = 'default',
  showDropdown = true,
  className = '',
}: LoginButtonProps) {
  const { isAuthenticated } = useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const pathname = usePathname();

  // Don't show login button if user is already authenticated
  if (isAuthenticated) {
    return null;
  }

  const handleLogin = () => {
    // Store current page for redirect after login
    if (
      pathname &&
      pathname !== '/auth/login' &&
      pathname !== '/auth/register'
    ) {
      navigationStorage.setLoginRedirect(pathname);
    }
    router.push('/auth/login');
  };

  const handleRegister = () => {
    // Store current page for redirect after registration
    if (
      pathname &&
      pathname !== '/auth/login' &&
      pathname !== '/auth/register'
    ) {
      navigationStorage.setLoginRedirect(pathname);
    }
    router.push('/auth/register');
  };

  if (!showDropdown) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleLogin}
        className={className}
      >
        <LogIn className="mr-2 h-4 w-4" />
        {t('login.title')}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <LogIn className="mr-2 h-4 w-4" />
          {t('common.signIn')}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>{t('common.getStarted')}</DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={handleLogin}
        >
          <LogIn className="mr-2 h-4 w-4" />
          {t('login.title')}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={handleRegister}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          {t('register.title')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
