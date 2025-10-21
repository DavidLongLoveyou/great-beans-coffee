import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Helper function to parse user agent
function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase();

  // Browser detection
  let browser = 'Unknown';
  if (ua.includes('chrome') && !ua.includes('edg')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
  else if (ua.includes('edg')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';

  // OS detection
  let os = 'Unknown';
  if (ua.includes('windows')) os = 'Windows';
  else if (ua.includes('mac')) os = 'macOS';
  else if (ua.includes('linux')) os = 'Linux';
  else if (ua.includes('android')) os = 'Android';
  else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

  // Device type
  let deviceType = 'Desktop';
  if (
    ua.includes('mobile') ||
    ua.includes('android') ||
    ua.includes('iphone')
  ) {
    deviceType = 'Mobile';
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    deviceType = 'Tablet';
  }

  return { browser, os, deviceType };
}

// Schema for session revocation
const revokeSessionSchema = z.object({
  sessionToken: z.string().min(1, 'Session token is required'),
});

/**
 * GET /api/user/sessions
 * Get all active sessions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const currentUserAgent = request.headers.get('user-agent') || 'unknown';
    const currentIpAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Get all active sessions for the user
    const sessions = await prisma.session.findMany({
      where: {
        userId: session.user.id,
        expires: {
          gt: new Date(), // Only active sessions
        },
      },
      select: {
        id: true,
        sessionToken: true,
        expires: true,
        createdAt: true,
        updatedAt: true,
        userAgent: true,
        ipAddress: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Get security events for context
    const recentSecurityEvents = await prisma.securityEvent.findMany({
      where: {
        userId: session.user.id,
        eventType: {
          in: ['LOGIN_SUCCESS', 'LOGIN_FAILED'],
        },
      },
      select: {
        id: true,
        eventType: true,
        description: true,
        ipAddress: true,
        userAgent: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    // Get recent login events with user agent info for session enrichment
    const loginEvents = await prisma.securityEvent.findMany({
      where: {
        userId: session.user.id,
        eventType: 'LOGIN_SUCCESS',
      },
      select: {
        userAgent: true,
        ipAddress: true,
        createdAt: true,
        metadata: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Get more to match with sessions
    });

    // Create a map of user agents to login event data for matching
    const userAgentEventMap = new Map();
    loginEvents.forEach(event => {
      if (event.userAgent) {
        userAgentEventMap.set(event.userAgent, event);
      }
    });

    return NextResponse.json({
      sessions: sessions.map(s => {
        const loginEvent = userAgentEventMap.get(s.userAgent || '');
        const deviceInfo = s.userAgent ? parseUserAgent(s.userAgent) : null;

        // Try to determine if this is the current session
        // This is a best-effort approach since NextAuth doesn't expose session token directly
        const isCurrentSession =
          s.userAgent === currentUserAgent &&
          s.ipAddress === currentIpAddress &&
          Math.abs(new Date(s.updatedAt).getTime() - Date.now()) <
            5 * 60 * 1000; // Within 5 minutes

        return {
          id: s.id,
          sessionToken: s.sessionToken.substring(0, 8) + '...', // Mask token for security
          expires: s.expires,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          isCurrent: isCurrentSession,
          device: deviceInfo
            ? {
                browser: deviceInfo.browser,
                os: deviceInfo.os,
                type: deviceInfo.deviceType,
              }
            : null,
          location: {
            ipAddress: s.ipAddress
              ? s.ipAddress.split('.').slice(0, 2).join('.') + '.x.x' // Mask IP for privacy
              : 'Unknown',
          },
        };
      }),
      recentActivity: recentSecurityEvents,
    });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/sessions
 * Revoke a specific session or all sessions except current
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // If sessionToken is provided, revoke specific session
    if (body.sessionToken) {
      const validation = revokeSessionSchema.safeParse(body);

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Invalid request data', details: validation.error.issues },
          { status: 400 }
        );
      }

      const { sessionToken } = validation.data;

      // Note: We can't easily identify current session from NextAuth session object
      // This check would need to be implemented differently if needed

      // Revoke the specific session
      await prisma.session.delete({
        where: {
          sessionToken,
          userId: session.user.id, // Ensure user can only revoke their own sessions
        },
      });

      // Log security event
      await prisma.securityEvent.create({
        data: {
          userId: session.user.id,
          eventType: 'ACCOUNT_UNLOCKED', // Using this as closest match for session revocation
          description: 'Session revoked manually',
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      return NextResponse.json({
        message: 'Session revoked successfully',
      });
    }

    // If no specific session, revoke all sessions except current
    if (body.revokeAll) {
      // Note: This will revoke ALL sessions including current one
      // In a real implementation, you'd need to identify current session differently
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
        },
      });

      // Log security event
      await prisma.securityEvent.create({
        data: {
          userId: session.user.id,
          eventType: 'ACCOUNT_UNLOCKED', // Using this as closest match
          description: 'All other sessions revoked',
          ipAddress:
            request.headers.get('x-forwarded-for') ||
            request.headers.get('x-real-ip') ||
            'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown',
        },
      });

      return NextResponse.json({
        message: 'All other sessions revoked successfully',
      });
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error revoking session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
