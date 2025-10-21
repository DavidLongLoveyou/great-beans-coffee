import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/infrastructure/database/prisma';
import { z } from 'zod';

// Profile update schema
const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
  name: z.string().min(1).max(100).optional(),
  phone: z.string().optional(),
  bio: z.string().max(500).optional(),
  avatar: z.string().url().optional(),
  companyName: z.string().max(100).optional(),
  position: z.string().max(100).optional(),
  department: z.string().max(100).optional(),
  location: z.string().max(100).optional(),
  timezone: z.string().optional(),
  language: z
    .enum(['en', 'es', 'fr', 'pt', 'vi', 'de', 'it', 'ja', 'ko', 'nl'])
    .optional(),
  notifications: z
    .object({
      email: z.boolean().optional(),
      push: z.boolean().optional(),
      sms: z.boolean().optional(),
      marketing: z.boolean().optional(),
    })
    .optional(),
});

// GET /api/user/profile - Get current user profile
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
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        avatar: true,
        image: true,
        companyName: true,
        position: true,
        department: true,
        bio: true,
        location: true,
        timezone: true,
        language: true,
        country: true,
        role: true,
        emailVerified: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...user,
        fullName:
          (user as any).firstName && (user as any).lastName
            ? `${(user as any).firstName} ${(user as any).lastName}`
            : user.name || '',
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH /api/user/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ProfileUpdateSchema.parse(body);

    // Prepare update data
    const updateData: any = {};

    // Basic profile fields
    if (validatedData.firstName !== undefined)
      updateData.firstName = validatedData.firstName;
    if (validatedData.lastName !== undefined)
      updateData.lastName = validatedData.lastName;
    if (validatedData.phone !== undefined)
      updateData.phone = validatedData.phone;
    if (validatedData.bio !== undefined) updateData.bio = validatedData.bio;
    if (validatedData.avatar !== undefined)
      updateData.avatar = validatedData.avatar;
    if (validatedData.companyName !== undefined)
      updateData.companyName = validatedData.companyName;
    if (validatedData.position !== undefined)
      updateData.position = validatedData.position;
    if (validatedData.department !== undefined)
      updateData.department = validatedData.department;
    if (validatedData.location !== undefined)
      updateData.location = validatedData.location;
    if (validatedData.timezone !== undefined)
      updateData.timezone = validatedData.timezone;
    if (validatedData.language !== undefined)
      updateData.language = validatedData.language;

    // Update name if provided (for backward compatibility)
    if (validatedData.name) {
      updateData.name = validatedData.name;
    }

    // Handle notifications (using individual notification fields)
    if (validatedData.notifications) {
      if (validatedData.notifications.email !== undefined) {
        updateData.emailNotifications = validatedData.notifications.email;
      }
      if (validatedData.notifications.marketing !== undefined) {
        updateData.marketingEmails = validatedData.notifications.marketing;
      }
      // Note: security and rfq notifications are not in the validation schema
      // They would need to be added to the schema if needed
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        avatar: true,
        image: true,
        companyName: true,
        position: true,
        department: true,
        bio: true,
        location: true,
        timezone: true,
        language: true,
        country: true,
        role: true,
        emailVerified: true,
        twoFactorEnabled: true,
        updatedAt: true,
        emailNotifications: true,
        marketingEmails: true,
        securityAlerts: true,
        rfqNotifications: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        ...updatedUser,
        fullName:
          (updatedUser as any).firstName && (updatedUser as any).lastName
            ? `${(updatedUser as any).firstName} ${(updatedUser as any).lastName}`
            : updatedUser.name || '',
      },
      message: 'Profile updated successfully',
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

    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
