import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { tokenService } from '@/infrastructure/services/token-service';
import { passwordService } from '@/infrastructure/services/password-service';
import { logger } from '@/infrastructure/services/logger-service';
import { auditService, AuditAction } from '@/infrastructure/services/audit-service';

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);
    const { token, password } = validatedData;

    // Find all non-expired reset tokens and verify against the provided token
    const resetTokenRecords = await prisma.verificationToken.findMany({
      where: {
        expires: {
          gt: new Date(),
        },
        identifier: {
          startsWith: 'password-reset:',
        },
      },
    });

    // Find the matching token by verifying hash
    let resetTokenRecord = null;
    let userId = null;
    for (const record of resetTokenRecords) {
      const isTokenValid = tokenService.verifyPasswordResetToken(token, record.token);
      if (isTokenValid) {
        resetTokenRecord = record;
        // Extract userId from identifier: "password-reset:userId"
        userId = record.identifier.replace('password-reset:', '');
        break;
      }
    }

    if (!resetTokenRecord || !userId) {
      logger.warn('Password reset token not found or invalid', {
        token: token.substring(0, 10) + '...',
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'TOKEN_INVALID',
          message: 'Invalid or expired reset token',
        },
        { status: 400 }
      );
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'USER_NOT_FOUND',
          message: 'User not found',
        },
        { status: 400 }
      );
    }

    // Check if user is active and email is verified
    if (!user.isActive) {
      logger.warn('Password reset attempted for inactive user', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'USER_INACTIVE',
          message: 'User account is not active',
        },
        { status: 400 }
      );
    }

    if (!user.emailVerified) {
      logger.warn('Password reset attempted for unverified user', {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'EMAIL_NOT_VERIFIED',
          message: 'Email address is not verified',
        },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = passwordService.validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'WEAK_PASSWORD',
          message: 'Password does not meet security requirements',
          details: passwordValidation.errors,
        },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await passwordService.hashPassword(password);

    // Update user password and invalidate all reset tokens
    await prisma.$transaction(async tx => {
      // Update user password
      await tx.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordChangedAt: new Date(),
        },
      });

      // Delete all password reset tokens for this user
      await tx.verificationToken.deleteMany({
        where: {
          identifier: {
            startsWith: `password-reset:${user.id}`,
          },
        },
      });

      // Invalidate all user sessions (force re-login)
      await tx.session.deleteMany({
        where: { userId: user.id },
      });

      // Log the password reset in audit trail
      await auditService.logSecurityEvent(
        AuditAction.PASSWORD_RESET,
        {
          email: user.email,
          resetTokenId: resetTokenRecord.identifier,
          timestamp: new Date().toISOString(),
        },
        {
          ip: request.headers.get('x-forwarded-for') ||
              request.headers.get('x-real-ip') ||
              'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
          userId: user.id,
        }
      );
    });

    logger.info('Password reset successful', {
      userId: user.id,
      email: user.email,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    logger.error('Reset password endpoint error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Token validation endpoint (GET)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {
          valid: false,
          error: 'TOKEN_MISSING',
          message: 'Reset token is required',
        },
        { status: 400 }
      );
    }

    // Find all non-expired reset tokens and verify against the provided token
    const resetTokenRecords = await prisma.verificationToken.findMany({
      where: {
        expires: {
          gt: new Date(),
        },
        identifier: {
          startsWith: 'password-reset:',
        },
      },
    });

    // Find the matching token by verifying hash
    let resetTokenRecord = null;
    let userId = null;
    for (const record of resetTokenRecords) {
      const isTokenValid = tokenService.verifyPasswordResetToken(token, record.token);
      if (isTokenValid) {
        resetTokenRecord = record;
        // Extract userId from identifier: "password-reset:userId"
        userId = record.identifier.replace('password-reset:', '');
        break;
      }
    }

    if (!resetTokenRecord || !userId) {
      return NextResponse.json({
        valid: false,
        error: 'TOKEN_INVALID',
        message: 'Invalid reset token',
      });
    }

    // Find the user to check if active and email verified
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        isActive: true,
        emailVerified: true,
      },
    });

    if (!user || !user.isActive || !user.emailVerified) {
      return NextResponse.json({
        valid: false,
        error: 'TOKEN_INVALID',
        message: 'Invalid reset token',
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'Token is valid',
    });
  } catch (error) {
    logger.error('Token validation error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        valid: false,
        error: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}