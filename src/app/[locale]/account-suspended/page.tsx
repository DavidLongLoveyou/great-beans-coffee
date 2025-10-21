'use client';

import { useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { Ban, Mail, Phone } from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';

export default function AccountSuspendedPage() {
  const t = useTranslations('auth');

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleContactSupport = () => {
    window.location.href =
      'mailto:support@thegreatbeans.com?subject=Account Suspension Appeal';
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Ban className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('suspended.title')}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t('suspended.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertDescription className="text-amber-800">
              {t('suspended.reason')}
            </AlertDescription>
          </Alert>

          <div className="space-y-2 text-sm text-gray-600">
            <p>{t('suspended.message')}</p>
            <p>{t('suspended.appeal')}</p>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleContactSupport}
              variant="outline"
              className="w-full"
            >
              <Mail className="mr-2 h-4 w-4" />
              {t('suspended.contactSupport')}
            </Button>

            <div className="text-center">
              <div className="mb-2 text-sm text-gray-500">
                {t('suspended.phoneSupport')}
              </div>
              <a
                href="tel:+84-28-1234-5678"
                className="inline-flex items-center font-medium text-amber-600 hover:text-amber-700"
              >
                <Phone className="mr-1 h-4 w-4" />
                +84 28 1234 5678
              </a>
            </div>

            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full"
            >
              {t('suspended.signOut')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
