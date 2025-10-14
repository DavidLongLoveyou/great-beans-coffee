'use client';

import {
  Edit,
  Plus,
  Trash2,
  Save,
  X,
  Shield,
  Eye,
  Key,
  Download,
  Camera,
  User,
  Crown,
  UserCheck,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

import { type Locale } from '@/i18n';
import { ContentContainer } from '@/presentation/components/layout/ContentContainer';
import { ContentSection } from '@/presentation/components/layout/ContentSection';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/presentation/components/ui/avatar';
import { Badge } from '@/presentation/components/ui/badge';
import { Button } from '@/presentation/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Switch } from '@/presentation/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { Textarea } from '@/presentation/components/ui/textarea';
import { CoffeeHeading } from '@/shared/components/typography/CoffeeHeading';

interface AccountPageProps {
  params: Promise<{
    locale: Locale;
  }>;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'buyer' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  lastLogin: string;
  avatar?: string;
}

interface CompanyProfile {
  name: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  taxId: string;
  description: string;
  logo?: string;
}

// Mock data
const mockCompanyProfile: CompanyProfile = {
  name: 'Premium Coffee Importers Ltd.',
  industry: 'Coffee Import & Distribution',
  website: 'https://premiumcoffee.com',
  phone: '+1 (555) 123-4567',
  email: 'info@premiumcoffee.com',
  address: '123 Coffee Street',
  city: 'New York',
  country: 'United States',
  taxId: 'US123456789',
  description:
    'Leading coffee importer specializing in premium Vietnamese coffee beans for the North American market.',
};

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@premiumcoffee.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15 14:30',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@premiumcoffee.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-15 09:15',
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@premiumcoffee.com',
    role: 'buyer',
    status: 'active',
    lastLogin: '2024-01-14 16:45',
  },
  {
    id: '4',
    name: 'Emma Wilson',
    email: 'emma.wilson@premiumcoffee.com',
    role: 'viewer',
    status: 'pending',
    lastLogin: 'Never',
  },
];

export default function AccountPage({ params: _params }: AccountPageProps) {
  const t = useTranslations('account');
  const [companyProfile, setCompanyProfile] = useState(mockCompanyProfile);
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<{
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'buyer' | 'viewer';
  }>({
    name: '',
    email: '',
    role: 'viewer',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailQuotes: true,
    emailOrders: true,
    emailShipments: true,
    emailMarketing: false,
    pushQuotes: true,
    pushOrders: true,
    pushShipments: false,
    pushMarketing: false,
  });

  const handleSaveProfile = () => {
    // Save profile logic here
    setIsEditingProfile(false);
  };

  const handleAddMember = () => {
    if (newMember.name && newMember.email) {
      const member: TeamMember = {
        id: Date.now().toString(),
        ...newMember,
        status: 'pending',
        lastLogin: 'Never',
      };
      setTeamMembers([...teamMembers, member]);
      setNewMember({ name: '', email: '', role: 'viewer' });
      setShowAddMember(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
  };

  const getRoleIcon = (role: TeamMember['role']) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'manager':
        return <Shield className="h-4 w-4" />;
      case 'buyer':
        return <UserCheck className="h-4 w-4" />;
      case 'viewer':
        return <Eye className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role: TeamMember['role']) => {
    const roleConfig = {
      admin: { variant: 'default' as const, label: t('roles.admin') },
      manager: { variant: 'secondary' as const, label: t('roles.manager') },
      buyer: { variant: 'outline' as const, label: t('roles.buyer') },
      viewer: { variant: 'outline' as const, label: t('roles.viewer') },
    };

    const config = roleConfig[role];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: TeamMember['status']) => {
    const statusConfig = {
      active: { variant: 'default' as const, label: t('status.active') },
      pending: { variant: 'secondary' as const, label: t('status.pending') },
      inactive: {
        variant: 'destructive' as const,
        label: t('status.inactive'),
      },
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
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

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">{t('tabs.profile')}</TabsTrigger>
            <TabsTrigger value="team">{t('tabs.team')}</TabsTrigger>
            <TabsTrigger value="preferences">
              {t('tabs.preferences')}
            </TabsTrigger>
          </TabsList>

          {/* Company Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('companyProfile.title')}</CardTitle>
                    <CardDescription>
                      {t('companyProfile.description')}
                    </CardDescription>
                  </div>
                  <Button
                    variant={isEditingProfile ? 'outline' : 'default'}
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? (
                      <>
                        <X className="mr-2 h-4 w-4" />
                        {t('cancel')}
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        {t('edit')}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Logo */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={companyProfile.logo} />
                      <AvatarFallback className="text-lg">
                        {companyProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {isEditingProfile && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {companyProfile.name}
                    </h3>
                    <p className="text-gray-600">{companyProfile.industry}</p>
                  </div>
                </div>

                {/* Company Details */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="companyName">
                        {t('companyProfile.companyName')}
                      </Label>
                      <Input
                        id="companyName"
                        value={companyProfile.name}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            name: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="industry">
                        {t('companyProfile.industry')}
                      </Label>
                      <Input
                        id="industry"
                        value={companyProfile.industry}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            industry: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">
                        {t('companyProfile.website')}
                      </Label>
                      <Input
                        id="website"
                        value={companyProfile.website}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            website: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">{t('companyProfile.phone')}</Label>
                      <Input
                        id="phone"
                        value={companyProfile.phone}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            phone: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">{t('companyProfile.email')}</Label>
                      <Input
                        id="email"
                        value={companyProfile.email}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            email: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="address">
                        {t('companyProfile.address')}
                      </Label>
                      <Input
                        id="address"
                        value={companyProfile.address}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            address: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">{t('companyProfile.city')}</Label>
                      <Input
                        id="city"
                        value={companyProfile.city}
                        onChange={e =>
                          setCompanyProfile({
                            ...companyProfile,
                            city: e.target.value,
                          })
                        }
                        disabled={!isEditingProfile}
                      />
                    </div>

                    <div>
                      <Label htmlFor="country">
                        {t('companyProfile.country')}
                      </Label>
                      <Select
                        value={companyProfile.country}
                        onValueChange={value =>
                          setCompanyProfile({
                            ...companyProfile,
                            country: value,
                          })
                        }
                        disabled={!isEditingProfile}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="United States">
                            United States
                          </SelectItem>
                          <SelectItem value="Germany">Germany</SelectItem>
                          <SelectItem value="Japan">Japan</SelectItem>
                          <SelectItem value="Netherlands">
                            Netherlands
                          </SelectItem>
                          <SelectItem value="Australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">
                    {t('companyProfile.description')}
                  </Label>
                  <Textarea
                    id="description"
                    value={companyProfile.description}
                    onChange={e =>
                      setCompanyProfile({
                        ...companyProfile,
                        description: e.target.value,
                      })
                    }
                    disabled={!isEditingProfile}
                    rows={3}
                  />
                </div>

                {isEditingProfile && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditingProfile(false)}
                    >
                      {t('cancel')}
                    </Button>
                    <Button onClick={handleSaveProfile}>
                      <Save className="mr-2 h-4 w-4" />
                      {t('save')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Team Management Tab */}
          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{t('team.title')}</CardTitle>
                    <CardDescription>{t('team.description')}</CardDescription>
                  </div>
                  <Dialog open={showAddMember} onOpenChange={setShowAddMember}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('team.addMember')}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{t('team.addMemberTitle')}</DialogTitle>
                        <DialogDescription>
                          {t('team.addMemberDescription')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="memberName">
                            {t('team.memberName')}
                          </Label>
                          <Input
                            id="memberName"
                            value={newMember.name}
                            onChange={e =>
                              setNewMember({
                                ...newMember,
                                name: e.target.value,
                              })
                            }
                            placeholder="Enter full name"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberEmail">
                            {t('team.memberEmail')}
                          </Label>
                          <Input
                            id="memberEmail"
                            type="email"
                            value={newMember.email}
                            onChange={e =>
                              setNewMember({
                                ...newMember,
                                email: e.target.value,
                              })
                            }
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <Label htmlFor="memberRole">
                            {t('team.memberRole')}
                          </Label>
                          <Select
                            value={newMember.role}
                            onValueChange={(
                              value: 'admin' | 'manager' | 'buyer' | 'viewer'
                            ) => setNewMember({ ...newMember, role: value })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="viewer">
                                {t('roles.viewer')}
                              </SelectItem>
                              <SelectItem value="buyer">
                                {t('roles.buyer')}
                              </SelectItem>
                              <SelectItem value="manager">
                                {t('roles.manager')}
                              </SelectItem>
                              <SelectItem value="admin">
                                {t('roles.admin')}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setShowAddMember(false)}
                        >
                          {t('cancel')}
                        </Button>
                        <Button onClick={handleAddMember}>
                          {t('team.sendInvitation')}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('team.member')}</TableHead>
                      <TableHead>{t('team.role')}</TableHead>
                      <TableHead>{t('team.status')}</TableHead>
                      <TableHead>{t('team.lastLogin')}</TableHead>
                      <TableHead>{t('team.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamMembers.map(member => (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={member.avatar} />
                              <AvatarFallback>
                                {member.name
                                  .split(' ')
                                  .map(n => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-gray-600">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getRoleIcon(member.role)}
                            {getRoleBadge(member.role)}
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(member.status)}</TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {member.lastLogin}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('preferences.notifications')}</CardTitle>
                <CardDescription>
                  {t('preferences.notificationsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="mb-4 font-medium">
                    {t('preferences.emailNotifications')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.quoteUpdates')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.quoteUpdatesDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailQuotes}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            emailQuotes: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.orderUpdates')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.orderUpdatesDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailOrders}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            emailOrders: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.shipmentUpdates')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.shipmentUpdatesDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailShipments}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            emailShipments: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.marketingEmails')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.marketingEmailsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.emailMarketing}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            emailMarketing: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 font-medium">
                    {t('preferences.pushNotifications')}
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.quoteUpdates')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.quoteUpdatesDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushQuotes}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            pushQuotes: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {t('preferences.orderUpdates')}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t('preferences.orderUpdatesDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={notifications.pushOrders}
                        onCheckedChange={checked =>
                          setNotifications({
                            ...notifications,
                            pushOrders: checked,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('preferences.security')}</CardTitle>
                <CardDescription>
                  {t('preferences.securityDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full sm:w-auto justify-start">
                  <Key className="mr-2 h-4 w-4" />
                  {t('preferences.changePassword')}
                </Button>

                <Button variant="outline" className="w-full sm:w-auto justify-start">
                  <Download className="mr-2 h-4 w-4" />
                  {t('preferences.downloadData')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </ContentSection>
    </ContentContainer>
  );
}
