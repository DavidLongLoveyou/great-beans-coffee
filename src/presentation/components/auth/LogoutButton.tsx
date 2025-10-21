'use client';

import { useAuth } from '@/shared/contexts/AuthContext';
import { useAuthActions } from '@/shared/hooks/useAuthActions';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { LogOut, Loader2 } from '@/components/ui/icons';

import { Button } from '@/presentation/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/presentation/components/ui/alert-dialog';

interface LogoutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showConfirmation?: boolean;
  showIcon?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({
  variant = 'ghost',
  size = 'default',
  showConfirmation = true,
  showIcon = true,
  className = '',
  children,
}: LogoutButtonProps) {
  const { isAuthenticated } = useAuth();
  const { logout, isLoading } = useAuthActions();
  const t = useTranslations('auth');
  const [isOpen, setIsOpen] = useState(false);

  // Don't show logout button if user is not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const buttonContent = (
    <>
      {showIcon &&
        (isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="mr-2 h-4 w-4" />
        ))}
      {children || (isLoading ? t('common.signingOut') : t('common.signOut'))}
    </>
  );

  if (!showConfirmation) {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleLogout}
        disabled={isLoading}
        className={className}
      >
        {buttonContent}
      </Button>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {buttonContent}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('common.confirmSignOut')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('common.signOutConfirmation')}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {t('common.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.signingOut')}
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                {t('common.signOut')}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
