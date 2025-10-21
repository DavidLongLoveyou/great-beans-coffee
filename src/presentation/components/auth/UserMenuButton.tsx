'use client';

import { useState } from 'react';
import { useAuth } from '@/shared/contexts/AuthContext';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { User, LogIn, UserPlus } from '@/components/ui/icons';
import { navigationStorage } from '@/shared/utils/sessionStorage';

import { Button } from '@/presentation/components/ui/button';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';

interface UserMenuButtonProps {
  className?: string;
}

export function UserMenuButton({ className = '' }: UserMenuButtonProps) {
  const { isAuthenticated, user } = useAuth();
  const t = useTranslations('auth');
  const router = useRouter();
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

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

  const handleDashboard = () => {
    router.push('/dashboard');
  };

  // If user is authenticated, show avatar with dashboard link
  if (isAuthenticated && user) {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={handleDashboard}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-forest-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
          aria-label="Go to Dashboard"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.avatar || ''}
              alt={user.fullName || 'User'}
            />
            <AvatarFallback className="bg-forest-500 text-sm font-medium text-white">
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </div>
    );
  }

  // If user is not authenticated, show user icon with hover popup
  return (
    <div
      className={`relative ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* User Icon Button */}
      <button
        className="flex h-10 w-10 items-center justify-center rounded-full bg-forest-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-forest-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2"
        aria-label="User Menu"
      >
        <User className="h-5 w-5" />
      </button>

      {/* Hover Popup */}
      {isHovered && (
        <div className="absolute right-0 top-12 z-50 w-56 duration-200 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <div className="rounded-xl border border-forest-200/60 bg-white/95 shadow-2xl ring-1 ring-forest-100/30 backdrop-blur-lg">
            <div className="p-4">
              <div className="mb-3">
                <h3 className="text-sm font-semibold text-forest-800">
                  {t('common.getStarted')}
                </h3>
                <p className="mt-1 text-xs text-forest-600">
                  Đăng nhập để truy cập dashboard và quản lý đơn hàng
                </p>
              </div>

              <div className="space-y-2">
                {/* Login Button */}
                <Button
                  onClick={handleLogin}
                  variant="outline"
                  size="sm"
                  className="h-10 w-full justify-start border-forest-200 transition-all duration-200 hover:border-forest-300 hover:bg-forest-50"
                >
                  <LogIn className="mr-2 h-4 w-4 text-forest-600" />
                  <span className="font-medium text-forest-700">
                    {t('login.title')}
                  </span>
                </Button>

                {/* Register Button */}
                <Button
                  onClick={handleRegister}
                  size="sm"
                  className="h-10 w-full justify-start bg-forest-600 text-white shadow-sm transition-all duration-200 hover:bg-forest-700"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span className="font-medium">{t('register.title')}</span>
                </Button>
              </div>

              {/* Divider */}
              <div className="my-3 border-t border-forest-100"></div>

              {/* Additional Info */}
              <div className="text-center text-xs text-forest-500">
                Tham gia cộng đồng xuất khẩu cà phê hàng đầu Việt Nam
              </div>
            </div>

            {/* Arrow pointer */}
            <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-forest-200/60 bg-white/95"></div>
          </div>
        </div>
      )}
    </div>
  );
}
