'use client';

import { useState } from 'react';
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

interface ForgotPasswordFormData {
  email: string;
}

interface FormErrors {
  email?: string;
  general?: string;
}

export default function ForgotPasswordPage() {
  const t = useTranslations('auth.forgotPassword');
  const { requestPasswordReset } = useAuthActions();

  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('errors.emailInvalid');
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

  const startResendCooldown = () => {
    setResendCooldown(60);
    const timer = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await requestPasswordReset(formData.email);

      if (result.success) {
        setIsEmailSent(true);
        startResendCooldown();
      } else {
        setErrors({
          general: getErrorMessage(result.error || 'UNKNOWN_ERROR'),
        });
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: t('errors.sendFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const result = await requestPasswordReset(formData.email);

      if (result.success) {
        startResendCooldown();
      } else {
        setErrors({
          general: getErrorMessage(result.error || 'UNKNOWN_ERROR'),
        });
      }
    } catch (error) {
      console.error('Resend password reset error:', error);
      setErrors({ general: t('errors.sendFailed') });
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = (error: string): string => {
    switch (error) {
      case 'USER_NOT_FOUND':
        return t('errors.emailNotFound');
      case 'RATE_LIMITED':
        return t('errors.rateLimited');
      case 'EMAIL_SEND_FAILED':
        return t('errors.sendFailed');
      default:
        return t('errors.sendFailed');
    }
  };

  if (isEmailSent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-amber-50 px-4 py-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="mb-4 flex items-center justify-center">
              <Icons.mail className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center text-2xl">
              {t('emailSent')}
            </CardTitle>
            <CardDescription className="text-center">
              {t('emailSentDescription')}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="rounded-lg bg-green-50 p-4 text-center">
              <p className="text-sm text-green-700">
                <strong>{formData.email}</strong>
              </p>
              <p className="mt-2 text-sm text-green-600">{t('checkInbox')}</p>
              <p className="mt-1 text-xs text-green-500">{t('checkSpam')}</p>
            </div>

            {/* General Error Display */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={handleResend}
              disabled={isLoading || resendCooldown > 0}
            >
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t('resending')}
                </>
              ) : resendCooldown > 0 ? (
                `${t('resendIn')} ${resendCooldown}s`
              ) : (
                t('resendLink')
              )}
            </Button>
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
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                className={errors.email ? 'border-red-500' : ''}
                autoComplete="email"
                autoFocus
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {t('sending')}
                </>
              ) : (
                t('sendResetLink')
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
