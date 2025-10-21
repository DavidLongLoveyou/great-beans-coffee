'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Icons } from '@/components/ui/icons';
import { useAuthActions } from '@/shared/hooks/useAuthActions';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function ResetPasswordPage() {
  const t = useTranslations('auth.resetPassword');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuthActions();

  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);

  useEffect(() => {
    // Validate token on component mount
    if (!token) {
      setIsValidToken(false);
      setErrors({ general: t('errors.tokenInvalid') });
    } else {
      setIsValidToken(true);
    }
  }, [token, t]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 8) {
      newErrors.password = t('errors.passwordMinLength');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear specific field error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !token) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await resetPassword(token, formData.password);

      if (result.success) {
        setIsSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?message=password-reset-success');
        }, 3000);
      } else {
        setErrors({
          general: getErrorMessage(result.error || 'UNKNOWN_ERROR'),
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: t('errors.resetFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'TOKEN_EXPIRED':
        return t('errors.tokenExpired');
      case 'TOKEN_INVALID':
        return t('errors.tokenInvalid');
      case 'USER_NOT_FOUND':
        return t('errors.userNotFound');
      case 'RESET_FAILED':
        return t('errors.resetFailed');
      default:
        return t('errors.resetFailed');
    }
  };

  // Invalid token state
  if (isValidToken === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mb-4 flex items-center justify-center">
              <Icons.alertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-center text-2xl text-red-600">
              {t('error.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('error.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{t('errors.tokenInvalid')}</AlertDescription>
            </Alert>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <Button asChild className="w-full">
              <Link href="/auth/forgot-password">Request New Reset Link</Link>
            </Button>
            <Link
              href="/auth/login"
              className="text-sm text-green-600 hover:text-green-500"
            >
              {t('backToLogin')}
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mb-4 flex items-center justify-center">
              <Icons.checkCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl text-green-600">
              {t('success.title')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('success.description')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">
                {t('success.redirecting')}
              </p>
              <div className="mt-2 flex items-center justify-center">
                <Icons.spinner className="h-4 w-4 animate-spin text-green-600" />
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="w-full text-center">
              <Link
                href="/auth/login"
                className="text-sm text-green-600 hover:text-green-500"
              >
                {t('backToLogin')}
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Loading state while validating token
  if (isValidToken === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <Icons.spinner className="mx-auto h-8 w-8 animate-spin text-green-600" />
              <p className="mt-2 text-sm text-muted-foreground">
                Validating reset link...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mb-4 flex items-center justify-center">
            <Icons.key className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-center text-2xl">{t('title')}</CardTitle>
          <CardDescription className="text-center">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* General Error Display */}
          {errors.general && (
            <Alert variant="destructive">
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your new password"
                value={formData.password}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.password ? 'border-red-500' : ''}
                autoComplete="new-password"
                autoFocus
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.confirmPassword ? 'border-red-500' : ''}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t('resetting')}
                </>
              ) : (
                t('resetPassword')
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <div className="w-full text-center">
            <Link
              href="/auth/login"
              className="text-sm text-green-600 hover:text-green-500"
            >
              {t('backToLogin')}
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}