'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Mail, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Icons } from '@/components/ui/icons';

export default function VerifyEmailPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [resendCooldown]);

  const verifyEmail = async (verificationToken: string) => {
    setIsVerifying(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus('success');
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?verified=true');
        }, 3000);
      } else {
        setVerificationStatus('error');
        setErrorMessage(
          data.error || t('verifyEmail.errors.verificationFailed')
        );
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationStatus('error');
      setErrorMessage(t('verifyEmail.errors.verificationFailed'));
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email || resendCooldown > 0) return;

    setIsResending(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setResendCooldown(60); // 60 seconds cooldown
      } else {
        setErrorMessage(data.error || t('verifyEmail.errors.resendFailed'));
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      setErrorMessage(t('verifyEmail.errors.resendFailed'));
    } finally {
      setIsResending(false);
    }
  };

  if (!email && !token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
            <CardTitle className="text-2xl font-bold text-gray-900">
              {t('verifyEmail.invalidAccess')}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {t('verifyEmail.invalidAccessDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full bg-amber-600 hover:bg-amber-700">
              <Link href="/auth/register">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('verifyEmail.backToRegister')}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {verificationStatus === 'pending' && (
            <>
              {isVerifying ? (
                <Icons.spinner className="mx-auto mb-4 h-12 w-12 animate-spin text-amber-600" />
              ) : (
                <Mail className="mx-auto mb-4 h-12 w-12 text-amber-600" />
              )}
              <CardTitle className="text-2xl font-bold text-gray-900">
                {isVerifying
                  ? t('verifyEmail.verifying')
                  : t('verifyEmail.title')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isVerifying
                  ? t('verifyEmail.verifyingDescription')
                  : t('verifyEmail.description')}
              </CardDescription>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('verifyEmail.success.title')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t('verifyEmail.success.description')}
              </CardDescription>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-500" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {t('verifyEmail.error.title')}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {t('verifyEmail.error.description')}
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {errorMessage && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                {errorMessage}
              </AlertDescription>
            </Alert>
          )}

          {email && (
            <div className="text-center">
              <p className="mb-4 text-sm text-gray-600">
                {t('verifyEmail.emailSentTo')}: <strong>{email}</strong>
              </p>
            </div>
          )}

          {verificationStatus === 'pending' && !token && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="mb-4 text-sm text-gray-600">
                  {t('verifyEmail.checkInbox')}
                </p>
                <p className="text-xs text-gray-500">
                  {t('verifyEmail.checkSpam')}
                </p>
              </div>

              <Button
                onClick={handleResendVerification}
                disabled={isResending || resendCooldown > 0}
                variant="outline"
                className="w-full"
              >
                {isResending ? (
                  <>
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    {t('verifyEmail.resending')}
                  </>
                ) : resendCooldown > 0 ? (
                  `${t('verifyEmail.resendIn')} ${resendCooldown}s`
                ) : (
                  t('verifyEmail.resendEmail')
                )}
              </Button>
            </div>
          )}

          {verificationStatus === 'success' && (
            <div className="space-y-4">
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  {t('verifyEmail.success.redirecting')}
                </AlertDescription>
              </Alert>

              <Button
                asChild
                className="w-full bg-amber-600 hover:bg-amber-700"
              >
                <Link href="/auth/login">
                  {t('verifyEmail.continueToLogin')}
                </Link>
              </Button>
            </div>
          )}

          {verificationStatus === 'error' && (
            <div className="space-y-4">
              {email && (
                <Button
                  onClick={handleResendVerification}
                  disabled={isResending || resendCooldown > 0}
                  className="w-full bg-amber-600 hover:bg-amber-700"
                >
                  {isResending ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      {t('verifyEmail.resending')}
                    </>
                  ) : resendCooldown > 0 ? (
                    `${t('verifyEmail.resendIn')} ${resendCooldown}s`
                  ) : (
                    t('verifyEmail.resendEmail')
                  )}
                </Button>
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/register">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {t('verifyEmail.backToRegister')}
                </Link>
              </Button>
            </div>
          )}

          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              {t('verifyEmail.backToLogin')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
