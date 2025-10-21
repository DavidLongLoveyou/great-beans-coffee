'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';

import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';

export default function UnauthorizedPage() {
  const t = useTranslations('auth');
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {t('unauthorized.title')}
          </CardTitle>
          <CardDescription className="text-gray-600">
            {t('unauthorized.description')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            {t('unauthorized.message')}
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t('unauthorized.goBack')}
            </Button>

            <Button
              onClick={() => router.push('/')}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <Home className="mr-2 h-4 w-4" />
              {t('unauthorized.goHome')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
