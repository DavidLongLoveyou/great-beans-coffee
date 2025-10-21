'use client';

import { useAuth } from '@/shared/contexts/AuthContext';
import { useAuthActions } from '@/shared/hooks/useAuthActions';
import { DetailedRole } from '@/shared/rbac';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  User,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  Bell,
  HelpCircle,
  Building,
} from '@/components/ui/icons';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Button } from '@/presentation/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu';
import { Badge } from '@/presentation/components/ui/badge';

interface UserAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showRole?: boolean;
  className?: string;
}

export function UserAvatar({
  size = 'md',
  showName = false,
  showRole = false,
  className = '',
}: UserAvatarProps) {
  const { user, isAuthenticated } = useAuth();
  const { logout, isLoading } = useAuthActions();
  const t = useTranslations('auth');
  const router = useRouter();

  if (!isAuthenticated || !user) {
    return null;
  }

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'supplier':
        return 'default';
      case 'buyer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={`h-auto min-h-[44px] justify-start px-3 py-2 ${
            showName || showRole ? 'w-full' : 'w-auto'
          } ${className}`}
        >
          <Avatar
            className={`${sizeClasses[size]} flex-shrink-0 ${showName || showRole ? 'mr-3' : ''}`}
          >
            <AvatarImage
              src={user.avatar || undefined}
              alt={user.fullName || 'User'}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {getInitials(user.fullName || user.email || 'U')}
            </AvatarFallback>
          </Avatar>

          {(showName || showRole) && (
            <div className="flex min-w-0 flex-1 flex-col items-start">
              {showName && (
                <span className="w-full truncate text-sm font-medium">
                  {user.fullName || user.email}
                </span>
              )}
              {showRole && user.role && (
                <div className="flex items-center gap-2">
                  <span className="w-full truncate text-xs capitalize text-muted-foreground">
                    {user.role}
                  </span>
                  {user.role === DetailedRole.ADMIN && (
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="text-xs"
                    >
                      Admin
                    </Badge>
                  )}
                </div>
              )}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="pb-2">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.fullName || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
            {user.role && (
              <Badge
                variant={getRoleBadgeVariant(user.role)}
                className="w-fit text-xs capitalize"
              >
                {user.role}
              </Badge>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={() => handleNavigation('/dashboard/account')}
        >
          <User className="mr-2 h-4 w-4" />
          {t('common.profile')}
        </DropdownMenuItem>

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={() => handleNavigation('/dashboard/account/settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          {t('common.settings')}
        </DropdownMenuItem>

        {user.role === DetailedRole.SUPPLIER && (
          <DropdownMenuItem
            className="min-h-[44px] cursor-pointer"
            onClick={() => handleNavigation('/dashboard/company')}
          >
            <Building className="mr-2 h-4 w-4" />
            Company Profile
          </DropdownMenuItem>
        )}

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={() => handleNavigation('/dashboard/account/billing')}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Billing
        </DropdownMenuItem>

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={() => handleNavigation('/dashboard/account/notifications')}
        >
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </DropdownMenuItem>

        {user.role === DetailedRole.ADMIN && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="min-h-[44px] cursor-pointer"
              onClick={() => handleNavigation('/admin')}
            >
              <Shield className="mr-2 h-4 w-4" />
              Admin Panel
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer"
          onClick={() => handleNavigation('/support')}
        >
          <HelpCircle className="mr-2 h-4 w-4" />
          Help & Support
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="min-h-[44px] cursor-pointer text-red-600 focus:text-red-600"
          onClick={handleLogout}
          disabled={isLoading}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoading ? 'Signing out...' : t('common.signOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
