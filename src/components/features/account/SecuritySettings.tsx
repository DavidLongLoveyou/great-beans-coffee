'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
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
import { Badge } from '@/presentation/components/ui/badge';
import { Alert, AlertDescription } from '@/presentation/components/ui/alert';
import { Separator } from '@/presentation/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/presentation/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/presentation/components/ui/table';
import {
  Shield,
  Key,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Download,
  Trash2,
  Monitor,
  Clock,
  Tablet,
  MapPin,
} from 'lucide-react';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  eventType: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface Session {
  id: string;
  sessionToken: string;
  expires: string;
  createdAt: string;
  updatedAt: string;
  isCurrent: boolean;
  device?: {
    browser: string;
    os: string;
    type: string;
  };
  location?: {
    ipAddress: string;
  };
}

interface SecurityStatus {
  twoFactorEnabled: boolean;
  hasBackupCodes: boolean;
  codesCount: number;
  passwordLastChanged?: string;
}

export default function SecuritySettings() {
  const { data: session } = useSession();
  const t = useTranslations('account.security');

  // State management
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus | null>(
    null
  );
  const [sessions, setSessions] = useState<Session[]>([]);
  const [recentActivity, setRecentActivity] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 2FA state
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [manualEntryKey, setManualEntryKey] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [showDisable2FA, setShowDisable2FA] = useState(false);
  const [disableForm, setDisableForm] = useState({
    password: '',
    token: '',
  });

  // Load security data
  useEffect(() => {
    loadSecurityData();
  }, []);

  const loadSecurityData = async () => {
    try {
      setLoading(true);

      // Load security status
      const securityResponse = await fetch('/api/user/security');
      if (securityResponse.ok) {
        const securityData = await securityResponse.json();
        setSecurityStatus(securityData);
      }

      // Load sessions
      const sessionsResponse = await fetch('/api/user/sessions');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setSessions(sessionsData.sessions || []);
        setRecentActivity(sessionsData.recentActivity || []);
      }
    } catch (error) {
      console.error('Error loading security data:', error);
      toast.error('Failed to load security settings');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }

    try {
      const response = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully');
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setShowPasswordForm(false);
        loadSecurityData();
      } else {
        toast.error(data.error || 'Failed to change password');
      }
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleEnable2FA = async () => {
    try {
      const response = await fetch('/api/user/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup_2fa' }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setQrCodeUrl(data.data.qrCode);
        setTwoFactorSecret(data.data.secret);
        setManualEntryKey(data.data.manualEntryKey);
        setShow2FASetup(true);
      } else {
        toast.error(data.error || 'Failed to setup 2FA');
      }
    } catch (error) {
      toast.error('Failed to setup 2FA');
    }
  };

  const handleVerify2FA = async () => {
    try {
      const response = await fetch('/api/user/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'enable_2fa',
          token: verificationCode,
          secret: twoFactorSecret,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('2FA enabled successfully');
        setBackupCodes(data.data.backupCodes || []);
        setShowBackupCodes(true);
        setShow2FASetup(false);
        setVerificationCode('');
        setTwoFactorSecret('');
        setManualEntryKey('');
        loadSecurityData();
      } else {
        toast.error(data.error || 'Invalid verification code');
      }
    } catch (error) {
      toast.error('Failed to verify 2FA');
    }
  };

  const handleDisable2FA = () => {
    setShowDisable2FA(true);
  };

  const handleConfirmDisable2FA = async () => {
    try {
      const response = await fetch('/api/user/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'disable_2fa',
          password: disableForm.password,
          token: disableForm.token,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('2FA disabled successfully');
        setShowDisable2FA(false);
        setDisableForm({ password: '', token: '' });
        loadSecurityData();
      } else {
        toast.error(data.error || 'Failed to disable 2FA');
      }
    } catch (error) {
      toast.error('Failed to disable 2FA');
    }
  };

  const handleRevokeSession = async (sessionToken: string) => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionToken }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Session revoked successfully');
        loadSecurityData();
      } else {
        toast.error(data.error || 'Failed to revoke session');
      }
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAllSessions = async () => {
    try {
      const response = await fetch('/api/user/sessions', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ revokeAll: true }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          data.message || 'All other sessions revoked successfully'
        );
        loadSecurityData();
      } else {
        toast.error(data.error || 'Failed to revoke sessions');
      }
    } catch (error) {
      toast.error('Failed to revoke sessions');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'LOGIN_SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'LOGIN_FAILED':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Shield className="h-4 w-4 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-32 rounded-lg bg-gray-200"></div>
          <div className="h-32 rounded-lg bg-gray-200"></div>
          <div className="h-32 rounded-lg bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Security
          </CardTitle>
          <CardDescription>
            Manage your password and account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Password</p>
              <p className="text-sm text-gray-600">
                {securityStatus?.passwordLastChanged
                  ? `Last changed: ${formatDate(securityStatus.passwordLastChanged)}`
                  : 'Change your password regularly for better security'}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              Change Password
            </Button>
          </div>

          {showPasswordForm && (
            <form
              onSubmit={handlePasswordChange}
              className="space-y-4 border-t pt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        currentPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                  >
                    {showPasswords.current ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        newPassword: e.target.value,
                      })
                    }
                    required
                    minLength={8}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                  >
                    {showPasswords.new ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={e =>
                      setPasswordForm({
                        ...passwordForm,
                        confirmPassword: e.target.value,
                      })
                    }
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                  >
                    {showPasswords.confirm ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">Update Password</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            Add an extra layer of security to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="font-medium">2FA Status</p>
                <p className="text-sm text-gray-600">
                  {securityStatus?.twoFactorEnabled
                    ? 'Two-factor authentication is enabled'
                    : 'Two-factor authentication is disabled'}
                </p>
              </div>
              <Badge
                variant={
                  securityStatus?.twoFactorEnabled ? 'default' : 'secondary'
                }
              >
                {securityStatus?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <Button
              variant={
                securityStatus?.twoFactorEnabled ? 'destructive' : 'default'
              }
              onClick={
                securityStatus?.twoFactorEnabled
                  ? handleDisable2FA
                  : handleEnable2FA
              }
            >
              {securityStatus?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
            </Button>
          </div>

          {securityStatus?.twoFactorEnabled && (
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Backup Codes</p>
                  <p className="text-sm text-gray-600">
                    {securityStatus.hasBackupCodes
                      ? `${securityStatus.codesCount} backup codes available`
                      : 'No backup codes generated'}
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Manage Backup Codes
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Active Sessions
          </CardTitle>
          <CardDescription>
            Manage your active login sessions across devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {sessions.length} active session
                {sessions.length !== 1 ? 's' : ''}
              </p>
              {sessions.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRevokeAllSessions}
                >
                  Revoke All Other Sessions
                </Button>
              )}
            </div>

            <div className="space-y-3">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className="flex items-start justify-between rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    {/* Device Icon */}
                    {session.device?.type === 'Mobile' ? (
                      <Smartphone className="mt-0.5 h-5 w-5 text-gray-500" />
                    ) : session.device?.type === 'Tablet' ? (
                      <Tablet className="mt-0.5 h-5 w-5 text-gray-500" />
                    ) : (
                      <Monitor className="mt-0.5 h-5 w-5 text-gray-500" />
                    )}

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {session.isCurrent
                            ? 'Current Session'
                            : session.device
                              ? `${session.device.browser} on ${session.device.os}`
                              : 'Unknown Device'}
                        </p>
                        {session.isCurrent && (
                          <Badge variant="default" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </div>

                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-600">
                          Last active: {formatDate(session.updatedAt)}
                        </p>

                        {session.device && (
                          <p className="text-xs text-gray-500">
                            {session.device.browser} • {session.device.os} •{' '}
                            {session.device.type}
                          </p>
                        )}

                        {session.location?.ipAddress &&
                          session.location.ipAddress !== 'Unknown' && (
                            <p className="flex items-center gap-1 text-xs text-gray-500">
                              <MapPin className="h-3 w-3" />
                              {session.location.ipAddress}
                            </p>
                          )}

                        <p className="text-xs text-gray-400">
                          Session ID: {session.sessionToken}
                        </p>
                      </div>
                    </div>
                  </div>

                  {!session.isCurrent && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRevokeSession(session.sessionToken)}
                      className="ml-3"
                    >
                      Revoke
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Security Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Security Activity
          </CardTitle>
          <CardDescription>
            Review recent login attempts and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-600">No recent activity</p>
            ) : (
              recentActivity.map(event => (
                <div
                  key={event.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {getEventIcon(event.eventType)}
                  <div className="flex-1">
                    <p className="font-medium">{event.description}</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.createdAt)}
                      {event.ipAddress && ` • ${event.ipAddress}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* 2FA Setup Dialog */}
      <Dialog open={show2FASetup} onOpenChange={setShow2FASetup}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Setup Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Follow these steps to secure your account with 2FA
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="text-sm">
                <p className="mb-2 font-medium">
                  Step 1: Install an authenticator app
                </p>
                <p className="text-gray-600">
                  Download Google Authenticator, Authy, or any TOTP-compatible
                  app
                </p>
              </div>

              <div className="text-sm">
                <p className="mb-2 font-medium">
                  Step 2: Scan QR code or enter key manually
                </p>
                {qrCodeUrl && (
                  <div className="mb-4 flex justify-center">
                    <img
                      src={qrCodeUrl}
                      alt="2FA QR Code"
                      className="h-48 w-48 rounded border"
                    />
                  </div>
                )}

                {manualEntryKey && (
                  <div className="space-y-2">
                    <p className="text-gray-600">
                      Can't scan? Enter this key manually:
                    </p>
                    <div className="break-all rounded bg-gray-100 p-3 font-mono text-sm">
                      {manualEntryKey}
                    </div>
                  </div>
                )}
              </div>

              <div className="text-sm">
                <p className="mb-2 font-medium">
                  Step 3: Enter verification code
                </p>
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">
                    6-digit code from your app
                  </Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={e =>
                      setVerificationCode(e.target.value.replace(/\D/g, ''))
                    }
                    placeholder="000000"
                    maxLength={6}
                    className="text-center text-lg tracking-widest"
                  />
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShow2FASetup(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleVerify2FA}
              disabled={verificationCode.length !== 6}
            >
              Verify & Enable
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Codes Dialog */}
      <Dialog open={showBackupCodes} onOpenChange={setShowBackupCodes}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Your Backup Codes</DialogTitle>
            <DialogDescription>
              Save these backup codes in a secure location. Each code can only
              be used once.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                These codes will not be shown again. Make sure to save them
                securely.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-2 gap-2 font-mono text-sm">
              {backupCodes.map((code, index) => (
                <div
                  key={index}
                  className="rounded bg-gray-100 p-2 text-center"
                >
                  {code}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowBackupCodes(false)}>
              I've Saved These Codes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Dialog */}
      <Dialog open={showDisable2FA} onOpenChange={setShowDisable2FA}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              To disable 2FA, please enter your password and a verification code
              from your authenticator app.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Disabling 2FA will make your account less secure. Make sure you
                understand the risks.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="disablePassword">Current Password</Label>
                <Input
                  id="disablePassword"
                  type="password"
                  value={disableForm.password}
                  onChange={e =>
                    setDisableForm(prev => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder="Enter your password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="disableToken">Verification Code</Label>
                <Input
                  id="disableToken"
                  value={disableForm.token}
                  onChange={e =>
                    setDisableForm(prev => ({
                      ...prev,
                      token: e.target.value.replace(/\D/g, ''),
                    }))
                  }
                  placeholder="000000"
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDisable2FA(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDisable2FA}
              disabled={!disableForm.password || disableForm.token.length !== 6}
            >
              Disable 2FA
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
