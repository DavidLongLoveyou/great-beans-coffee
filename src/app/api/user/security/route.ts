import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/infrastructure/database/prisma';
import { Prisma } from '@prisma/client';
import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { z } from 'zod';

// 2FA setup schema
const TwoFactorSetupSchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
  secret: z.string().min(1, 'Secret is required'),
});

// 2FA disable schema
const TwoFactorDisableSchema = z.object({
  token: z.string().length(6, 'Token must be 6 digits'),
  password: z.string().min(1, 'Password is required'),
});

// Generate backup codes
function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
  }
  return codes;
}

// GET /api/user/security - Get security settings and status
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        passwordChangedAt: true,
        lastLoginAt: true,
        loginAttempts: true,
        lockedUntil: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get recent security events
    const recentEvents = await prisma.securityEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        eventType: true,
        description: true,
        createdAt: true,
        metadata: true,
      },
    });

    // Get active sessions (if session management is implemented)
    // This would require a sessions table
    const activeSessions: any[] = []; // Placeholder

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled,
          lastPasswordChange: user.passwordChangedAt,
          lastLoginAt: user.lastLoginAt,
          accountCreated: user.createdAt,
          isLocked: user.lockedUntil ? user.lockedUntil > new Date() : false,
          failedAttempts: user.loginAttempts || 0,
        },
        recentEvents,
        activeSessions,
        securityScore: calculateSecurityScore(user),
      },
    });
  } catch (error) {
    console.error('Security info fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/user/security - Setup or manage security settings
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'setup_2fa':
        return await setup2FA(session.user.id, session.user.email!);

      case 'enable_2fa':
        return await enable2FA(session.user.id, body);

      case 'disable_2fa':
        return await disable2FA(session.user.id, body);

      case 'regenerate_backup_codes':
        return await regenerateBackupCodes(session.user.id, body);

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Security action error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Setup 2FA - Generate secret and QR code
async function setup2FA(userId: string, email: string) {
  const secret = authenticator.generateSecret();
  const serviceName = 'The Great Beans';
  const otpauth = authenticator.keyuri(email, serviceName, secret);

  try {
    const qrCodeDataURL = await QRCode.toDataURL(otpauth);

    return NextResponse.json({
      success: true,
      data: {
        secret,
        qrCode: qrCodeDataURL,
        manualEntryKey: secret,
        serviceName,
      },
      message: 'Scan the QR code with your authenticator app',
    });
  } catch (error) {
    console.error('QR code generation error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}

// Enable 2FA - Verify token and save secret
async function enable2FA(userId: string, body: any) {
  try {
    const { token, secret } = TwoFactorSetupSchema.parse(body);

    // Verify the token
    const isValid = authenticator.verify({ token, secret });

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Generate backup codes
    const backupCodes = generateBackupCodes();

    // Save 2FA settings
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: backupCodes,
      },
    });

    // Log security event
    await prisma.securityEvent
      .create({
        data: {
          userId,
          eventType: 'TWO_FACTOR_ENABLED',
          description: 'Two-factor authentication enabled',
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      })
      .catch(console.error);

    return NextResponse.json({
      success: true,
      data: {
        backupCodes,
        enabled: true,
      },
      message: 'Two-factor authentication enabled successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }
    throw error;
  }
}

// Disable 2FA - Verify password and token
async function disable2FA(userId: string, body: any) {
  try {
    const { token, password } = TwoFactorDisableSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        password: true,
        twoFactorSecret: true,
        twoFactorEnabled: true,
      },
    });

    if (!user?.twoFactorEnabled) {
      return NextResponse.json(
        { success: false, error: 'Two-factor authentication is not enabled' },
        { status: 400 }
      );
    }

    // Verify password
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid password' },
        { status: 400 }
      );
    }

    // Verify 2FA token
    const isTokenValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret!,
    });

    if (!isTokenValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid verification code' },
        { status: 400 }
      );
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorEnabled: false,
        twoFactorSecret: null,
        backupCodes: Prisma.JsonNull,
      },
    });

    // Log security event
    await prisma.securityEvent
      .create({
        data: {
          userId,
          eventType: 'TWO_FACTOR_DISABLED',
          description: 'Two-factor authentication disabled',
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      })
      .catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Two-factor authentication disabled successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 }
      );
    }
    throw error;
  }
}

// Regenerate backup codes
async function regenerateBackupCodes(userId: string, body: any) {
  const { password } = body;

  if (!password) {
    return NextResponse.json(
      { success: false, error: 'Password is required' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      password: true,
      twoFactorEnabled: true,
    },
  });

  if (!user?.twoFactorEnabled) {
    return NextResponse.json(
      { success: false, error: 'Two-factor authentication is not enabled' },
      { status: 400 }
    );
  }

  // Verify password
  const bcrypt = require('bcryptjs');
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return NextResponse.json(
      { success: false, error: 'Invalid password' },
      { status: 400 }
    );
  }

  // Generate new backup codes
  const backupCodes = generateBackupCodes();

  await prisma.user.update({
    where: { id: userId },
    data: {
      backupCodes: backupCodes,
    },
  });

  return NextResponse.json({
    success: true,
    data: {
      backupCodes,
    },
    message: 'Backup codes regenerated successfully',
  });
}

// Calculate security score
function calculateSecurityScore(user: any): number {
  let score = 0;

  // Base score
  score += 20;

  // 2FA enabled
  if (user.twoFactorEnabled) score += 30;

  // Recent password change (within 90 days)
  if (user.passwordChangedAt) {
    const daysSinceChange = Math.floor(
      (Date.now() - user.passwordChangedAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceChange <= 90) score += 25;
    else if (daysSinceChange <= 180) score += 15;
  }

  // Recent login activity
  if (user.lastLoginAt) {
    const daysSinceLogin = Math.floor(
      (Date.now() - user.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSinceLogin <= 7) score += 15;
    else if (daysSinceLogin <= 30) score += 10;
  }

  // No failed attempts
  if (!user.loginAttempts || user.loginAttempts === 0) score += 10;

  return Math.min(score, 100);
}
