'use client';

import { useState } from 'react';
import { signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/contexts/AuthContext';

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName: string;
  companyType: string;
  country: string;
  phone: string;
  website?: string;
}

export interface AuthActionResult {
  success: boolean;
  error?: string;
  data?: any;
}

export function useAuthActions() {
  const { refreshUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Login with email and password
  const login = async (
    credentials: LoginCredentials,
    callbackUrl?: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      if (result?.ok) {
        // Refresh user data
        await refreshUser();

        // Redirect to callback URL or dashboard
        const redirectUrl = callbackUrl || '/dashboard';
        router.push(redirectUrl);

        return {
          success: true,
          data: result,
        };
      }

      return {
        success: false,
        error: 'Login failed',
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Login with Google OAuth
  const loginWithGoogle = async (
    callbackUrl?: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const result = await signIn('google', {
        callbackUrl: callbackUrl || '/dashboard',
        redirect: false,
      });

      if (result?.error) {
        return {
          success: false,
          error: result.error,
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Google login error:', error);
      return {
        success: false,
        error: 'Google login failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register new user
  const register = async (data: RegisterData): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Registration failed',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = async (callbackUrl?: string): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      await signOut({
        callbackUrl: callbackUrl || '/auth/login',
        redirect: true,
      });

      return {
        success: true,
      };
    } catch (error) {
      console.error('Logout error:', error);
      return {
        success: false,
        error: 'Logout failed',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify email
  const verifyEmail = async (token: string): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Email verification failed',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Email verification error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Resend verification email
  const resendVerificationEmail = async (
    email: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to resend verification email',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Request password reset
  const requestPasswordReset = async (
    email: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Failed to send password reset email',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Password reset request error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (
    token: string,
    newPassword: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password: newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Password reset failed',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password (for authenticated users)
  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Password change failed',
        };
      }

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Password change error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (
    updates: Partial<RegisterData>
  ): Promise<AuthActionResult> => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.error || 'Profile update failed',
        };
      }

      // Refresh user data
      await refreshUser();

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: 'An unexpected error occurred',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,

    // Actions
    login,
    loginWithGoogle,
    register,
    logout,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword,
    changePassword,
    updateProfile,
  };
}
