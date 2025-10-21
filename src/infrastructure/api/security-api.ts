export interface SecurityData {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: ActiveSession[];
  recentActivity: SecurityEvent[];
}

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  ipAddress?: string;
  userAgent?: string;
}

export interface SecurityEvent {
  id: string;
  type:
    | 'login'
    | 'logout'
    | 'password_change'
    | 'permission_change'
    | 'suspicious_activity';
  description: string;
  timestamp: string;
  location?: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface TwoFactorSetupData {
  qrCode: string;
  backupCodes: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Get security data including 2FA status, sessions, and recent activity
 */
export async function getSecurityData(): Promise<ApiResponse<SecurityData>> {
  try {
    const response = await fetch('/api/user/security', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching security data:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch security data',
    };
  }
}

/**
 * Change user password
 */
export async function changePassword(
  passwordData: ChangePasswordData
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/user/security/password', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error changing password:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to change password',
    };
  }
}

/**
 * Enable two-factor authentication
 */
export async function enable2FA(): Promise<ApiResponse<TwoFactorSetupData>> {
  try {
    const response = await fetch('/api/user/security/2fa/enable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error enabling 2FA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to enable 2FA',
    };
  }
}

/**
 * Verify and complete 2FA setup
 */
export async function verify2FA(code: string): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/user/security/2fa/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error verifying 2FA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify 2FA',
    };
  }
}

/**
 * Disable two-factor authentication
 */
export async function disable2FA(): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/user/security/2fa/disable', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error disabling 2FA:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to disable 2FA',
    };
  }
}

/**
 * Get active sessions
 */
export async function getActiveSessions(): Promise<
  ApiResponse<ActiveSession[]>
> {
  try {
    const response = await fetch('/api/user/security/sessions', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching active sessions:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch active sessions',
    };
  }
}

/**
 * Revoke a session
 */
export async function revokeSession(
  sessionId: string
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch(`/api/user/security/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error revoking session:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to revoke session',
    };
  }
}

/**
 * Get security events/activity
 */
export async function getSecurityEvents(
  limit?: number
): Promise<ApiResponse<SecurityEvent[]>> {
  try {
    const url = new URL('/api/user/security/events', window.location.origin);
    if (limit) {
      url.searchParams.set('limit', limit.toString());
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching security events:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to fetch security events',
    };
  }
}

/**
 * Generate new backup codes
 */
export async function generateBackupCodes(): Promise<ApiResponse<string[]>> {
  try {
    const response = await fetch('/api/user/security/2fa/backup-codes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating backup codes:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to generate backup codes',
    };
  }
}

/**
 * Report suspicious activity
 */
export async function reportSuspiciousActivity(
  description: string,
  metadata?: Record<string, any>
): Promise<ApiResponse<void>> {
  try {
    const response = await fetch('/api/user/security/report', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description, metadata }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error reporting suspicious activity:', error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to report suspicious activity',
    };
  }
}
