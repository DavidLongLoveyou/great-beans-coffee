import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/infrastructure/database/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// Password change schema
const PasswordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
    confirmPassword: z.string(),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// POST /api/user/password - Change user password
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
    const { currentPassword, newPassword } = PasswordChangeSchema.parse(body);

    // Get current user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        password: true,
        passwordChangedAt: true,
        loginAttempts: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Account is temporarily locked due to too many failed attempts',
        },
        { status: 423 }
      );
    }

    // Verify current password
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: 'No password set for this account' },
        { status: 400 }
      );
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      // Increment login attempts
      const newAttempts = (user.loginAttempts || 0) + 1;
      const shouldLock = newAttempts >= 5;

      await prisma.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + 30 * 60 * 1000)
            : null, // 30 minutes
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: 'Current password is incorrect',
          attemptsRemaining: shouldLock ? 0 : 5 - newAttempts,
        },
        { status: 400 }
      );
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'New password must be different from current password',
        },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password and reset security fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedNewPassword,
        passwordChangedAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
        // Optionally invalidate all sessions except current one
        // This would require session management implementation
      },
    });

    // Log security event
    await prisma.securityEvent
      .create({
        data: {
          userId: user.id,
          eventType: 'PASSWORD_CHANGED',
          description: 'Password changed successfully',
          userAgent: request.headers.get('user-agent'),
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
          metadata: {
            timestamp: new Date().toISOString(),
          },
        },
      })
      .catch(error => {
        // Log error but don't fail the password change
        console.error('Failed to log security event:', error);
      });

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully',
      data: {
        passwordChangedAt: new Date(),
      },
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

    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/user/password - Get password policy and last change info
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
        passwordChangedAt: true,
        loginAttempts: true,
        lockedUntil: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const passwordPolicy = {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      maxAge: 90, // days
      preventReuse: 5, // last 5 passwords
    };

    const daysSinceLastChange = user.passwordChangedAt
      ? Math.floor(
          (Date.now() - user.passwordChangedAt.getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : null;

    return NextResponse.json({
      success: true,
      data: {
        policy: passwordPolicy,
        lastPasswordChange: user.passwordChangedAt,
        daysSinceLastChange,
        needsChange: daysSinceLastChange
          ? daysSinceLastChange > passwordPolicy.maxAge
          : false,
        isLocked: user.lockedUntil ? user.lockedUntil > new Date() : false,
        lockExpiresAt: user.lockedUntil,
        failedAttempts: user.loginAttempts || 0,
      },
    });
  } catch (error) {
    console.error('Password info fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
