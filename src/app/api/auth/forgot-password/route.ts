import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { emailService } from '@/infrastructure/services/email-service';
import { tokenService } from '@/infrastructure/services/token-service';
import { rateLimitService } from '@/infrastructure/services/rate-limit-service';
import { logger } from '@/infrastructure/services/logger-service';

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

// Rate limiting configuration
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxAttempts: 3, // 3 attempts per window
  keyPrefix: 'forgot-password',
};

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);
    const { email } = validatedData;

    // Get client IP for rate limiting
    const clientIP =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Check rate limiting
    const rateLimitKey = `${RATE_LIMIT_CONFIG.keyPrefix}:${clientIP}:${email}`;
    const rateLimitResult = rateLimitService.checkRateLimit(rateLimitKey, {
      windowMs: RATE_LIMIT_CONFIG.windowMs,
      maxRequests: RATE_LIMIT_CONFIG.maxAttempts,
    });
    const isRateLimited = !rateLimitResult.allowed;

    if (isRateLimited) {
      logger.warn('Forgot password rate limit exceeded', {
        email,
        clientIP,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        {
          success: false,
          error: 'TOO_MANY_REQUESTS',
          message: 'Too many reset requests. Please wait before trying again.',
        },
        { status: 429 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        isActive: true,
        emailVerified: true,
      },
    });

    // Always return success to prevent email enumeration attacks
    // But only send email if user exists and is active
    if (user && user.isActive && user.emailVerified) {
      try {
        // Generate password reset token
        const resetToken = tokenService.generatePasswordResetToken(user.id);

        // Store reset token in database using VerificationToken
        await prisma.verificationToken.create({
          data: {
            identifier: `password-reset:${user.id}`,
            token: resetToken.hashedToken,
            expires: resetToken.expiresAt,
          },
        });

        // Send password reset email
        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken.token}`;

        await emailService.sendPasswordResetEmail(user.email, resetToken.token);

        logger.info('Password reset email sent', {
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
        });
      } catch (emailError) {
        logger.error('Failed to send password reset email', {
          error: emailError,
          userId: user.id,
          email: user.email,
          timestamp: new Date().toISOString(),
        });

        // Don't expose email sending errors to client
        // Still return success to prevent information disclosure
      }
    } else {
      logger.info(
        'Password reset requested for non-existent or inactive user',
        {
          email,
          userExists: !!user,
          isActive: user?.isActive,
          emailVerified: user?.emailVerified,
          timestamp: new Date().toISOString(),
        }
      );
    }

    // Always return success response to prevent email enumeration
    return NextResponse.json({
      success: true,
      message:
        'If an account with that email exists, we have sent a password reset link.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'VALIDATION_ERROR',
          message: 'Invalid email address',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    logger.error('Forgot password endpoint error', {
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

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
