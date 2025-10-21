import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Schema for password verification
const verifyPasswordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

/**
 * Generate secure backup codes
 */
function generateBackupCodes(count: number = 10): string[] {
  const codes: string[] = [];

  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric code
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    codes.push(code);
  }

  return codes;
}

/**
 * GET /api/user/backup-codes
 * Get backup codes status (not the actual codes)
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        twoFactorEnabled: true,
        backupCodes: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA must be enabled to manage backup codes' },
        { status: 400 }
      );
    }

    const backupCodes = (user.backupCodes as string[]) || [];

    return NextResponse.json({
      hasBackupCodes: backupCodes.length > 0,
      codesCount: backupCodes.length,
      lastGenerated: user.backupCodes ? new Date() : null, // In real app, store generation timestamp
    });
  } catch (error) {
    console.error('Error fetching backup codes status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/backup-codes
 * Generate new backup codes (requires password verification)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = verifyPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User not found or no password set' },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled) {
      return NextResponse.json(
        { error: '2FA must be enabled to generate backup codes' },
        { status: 400 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Generate new backup codes
    const backupCodes = generateBackupCodes(10);

    // Update user with new backup codes
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        backupCodes: backupCodes,
      },
    });

    // Log security event
    await prisma.securityEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'TWO_FACTOR_BACKUP_USED', // Using this as closest match for backup codes generation
        description: 'New backup codes generated',
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'Backup codes generated successfully',
      backupCodes: backupCodes,
      warning:
        'Save these codes in a secure location. They will not be shown again.',
    });
  } catch (error) {
    console.error('Error generating backup codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/backup-codes
 * Revoke all backup codes
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validation = verifyPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validation.error.issues },
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        password: true,
        twoFactorEnabled: true,
      },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'User not found or no password set' },
        { status: 404 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    // Remove all backup codes
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        backupCodes: Prisma.JsonNull,
      },
    });

    // Log security event
    await prisma.securityEvent.create({
      data: {
        userId: session.user.id,
        eventType: 'TWO_FACTOR_BACKUP_USED', // Using this as closest match
        description: 'All backup codes revoked',
        ipAddress:
          request.headers.get('x-forwarded-for') ||
          request.headers.get('x-real-ip') ||
          'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({
      message: 'All backup codes have been revoked successfully',
    });
  } catch (error) {
    console.error('Error revoking backup codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
