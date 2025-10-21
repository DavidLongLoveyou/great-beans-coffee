'use client';

import { useState, useEffect } from 'react';
import {
  Edit,
  Save,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/presentation/components/ui/card';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Label } from '@/presentation/components/ui/label';
import { Textarea } from '@/presentation/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';
import { Badge } from '@/presentation/components/ui/badge';
import { Separator } from '@/presentation/components/ui/separator';
import { AvatarUpload } from './AvatarUpload';
import { toast } from 'sonner';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  bio: string;
  location: string;
  timezone: string;
  language: string;
  avatar?: string;
  joinDate: string;
  lastLogin: string;
}

const timezones = [
  { value: 'UTC', label: 'UTC (Coordinated Universal Time)' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
  { value: 'Europe/Paris', label: 'Central European Time (CET)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
  { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AET)' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
  { value: 'ja', label: '日本語' },
  { value: 'ko', label: '한국어' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'nl', label: 'Nederlands' },
];

export function PersonalProfile() {
  const [profile, setProfile] = useState<PersonalInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    bio: '',
    location: '',
    timezone: 'UTC',
    language: 'en',
    avatar: '',
    joinDate: '',
    lastLogin: '',
  });

  const [localInfo, setLocalInfo] = useState<PersonalInfo>(profile);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      const result = await response.json();

      if (result.success) {
        const userData = result.data;
        const profileData: PersonalInfo = {
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          email: userData.email || '',
          phone: userData.phone || '',
          position: userData.position || '',
          department: userData.department || '',
          bio: userData.bio || '',
          location: userData.location || '',
          timezone: userData.timezone || 'UTC',
          language: userData.language || 'en',
          avatar: userData.avatar || '',
          joinDate: userData.createdAt
            ? new Date(userData.createdAt).toLocaleDateString()
            : '',
          lastLogin: userData.lastLoginAt
            ? new Date(userData.lastLoginAt).toLocaleDateString()
            : '',
        };

        setProfile(profileData);
        setLocalInfo(profileData);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const updateData = {
        firstName: localInfo.firstName,
        lastName: localInfo.lastName,
        phone: localInfo.phone,
        position: localInfo.position,
        department: localInfo.department,
        bio: localInfo.bio,
        location: localInfo.location,
        timezone: localInfo.timezone,
        language: localInfo.language,
      };

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const result = await response.json();

      if (result.success) {
        setProfile(localInfo);
        setIsEditing(false);
        toast.success('Personal information updated successfully');
      } else {
        throw new Error(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update profile'
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setLocalInfo(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (avatarUrl: string) => {
    setLocalInfo(prev => ({ ...prev, avatar: avatarUrl }));
    setProfile(prev => ({ ...prev, avatar: avatarUrl }));
  };

  const getInitials = () => {
    return `${localInfo.firstName.charAt(0)}${localInfo.lastName.charAt(0)}`.toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 w-20 rounded-full bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-4 w-1/4 rounded bg-gray-200"></div>
              <div className="h-4 w-1/2 rounded bg-gray-200"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>
              Manage your personal details and preferences
            </CardDescription>
          </div>
          <Button
            variant={isEditing ? 'outline' : 'default'}
            onClick={isEditing ? handleCancel : () => setIsEditing(true)}
            disabled={saving}
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Avatar and Basic Info */}
        <div className="flex items-start gap-6">
          <AvatarUpload
            currentAvatar={localInfo.avatar || ''}
            fallbackText={getInitials()}
            onAvatarChange={handleAvatarChange}
            size="lg"
            disabled={!isEditing}
          />

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={localInfo.firstName}
                  onChange={e =>
                    setLocalInfo(prev => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>

              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={localInfo.lastName}
                  onChange={e =>
                    setLocalInfo(prev => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={localInfo.bio}
                onChange={e =>
                  setLocalInfo(prev => ({ ...prev, bio: e.target.value }))
                }
                disabled={!isEditing}
                rows={3}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 font-medium">
            <Mail className="h-4 w-4" />
            Contact Information
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={localInfo.email}
                disabled={true} // Email should not be editable in profile
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={localInfo.phone}
                onChange={e =>
                  setLocalInfo(prev => ({ ...prev, phone: e.target.value }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={localInfo.location}
                onChange={e =>
                  setLocalInfo(prev => ({ ...prev, location: e.target.value }))
                }
                disabled={!isEditing}
                placeholder="City, Country"
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Professional Information */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 font-medium">
            <Briefcase className="h-4 w-4" />
            Professional Information
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={localInfo.position}
                onChange={e =>
                  setLocalInfo(prev => ({ ...prev, position: e.target.value }))
                }
                disabled={!isEditing}
              />
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={localInfo.department}
                onChange={e =>
                  setLocalInfo(prev => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Preferences */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 font-medium">
            <MapPin className="h-4 w-4" />
            Preferences
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={localInfo.timezone}
                onValueChange={value =>
                  setLocalInfo(prev => ({ ...prev, timezone: value }))
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map(tz => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="language">Language</Label>
              <Select
                value={localInfo.language}
                onValueChange={value =>
                  setLocalInfo(prev => ({ ...prev, language: value }))
                }
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Account Information */}
        <div>
          <h4 className="mb-4 flex items-center gap-2 font-medium">
            <Calendar className="h-4 w-4" />
            Account Information
          </h4>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label>Member Since</Label>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="secondary">{localInfo.joinDate}</Badge>
              </div>
            </div>

            <div>
              <Label>Last Login</Label>
              <div className="flex items-center gap-2 pt-2">
                <Badge variant="outline">{localInfo.lastLogin}</Badge>
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
