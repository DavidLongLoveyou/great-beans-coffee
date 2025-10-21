'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { PersonalProfile } from '@/components/features/account/PersonalProfile';
import SecuritySettings from '@/components/features/account/SecuritySettings';

import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Switch } from '@/presentation/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

export default function AccountPageSimple() {
  const t = useTranslations('account');
  const [companyName, setCompanyName] = useState('Test Company');
  const [businessType, setBusinessType] = useState('Coffee Export');
  const [website, setWebsite] = useState('https://example.com');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);

  const handleSaveProfile = () => {
    // Mock save functionality
    console.log('Profile saved');
  };

  return (
    <ContentContainer>
      <ContentSection>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <CoffeeHeading as="h1" className="mb-2">
              {t('title')}
            </CoffeeHeading>
            <p className="text-gray-600">{t('subtitle')}</p>
          </div>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="personal">{t('tabs.personal')}</TabsTrigger>
            <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
            <TabsTrigger value="team">{t('tabs.team')}</TabsTrigger>
            <TabsTrigger value="preferences">
              {t('tabs.preferences')}
            </TabsTrigger>
            <TabsTrigger value="security">{t('tabs.security')}</TabsTrigger>
          </TabsList>

          {/* Personal Profile Tab */}
          <TabsContent value="personal" className="space-y-6">
            <PersonalProfile />
          </TabsContent>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('profile.title')}</CardTitle>
                <CardDescription>{t('profile.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">
                      {t('profile.companyName')}
                    </Label>
                    <Input
                      id="companyName"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessType">
                      {t('profile.businessType')}
                    </Label>
                    <Input
                      id="businessType"
                      value={businessType}
                      onChange={e => setBusinessType(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">{t('profile.website')}</Label>
                    <Input
                      id="website"
                      value={website}
                      onChange={e => setWebsite(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handleSaveProfile}>{t('common.save')}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('team.title')}</CardTitle>
                <CardDescription>{t('team.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>{t('team.addMember')}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('preferences.title')}</CardTitle>
                <CardDescription>
                  {t('preferences.description')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">
                    {t('preferences.emailNotifications')}
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">
                    {t('preferences.pushNotifications')}
                  </Label>
                  <Switch
                    id="pushNotifications"
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecuritySettings />
          </TabsContent>
        </Tabs>
      </ContentSection>
    </ContentContainer>
  );
}
