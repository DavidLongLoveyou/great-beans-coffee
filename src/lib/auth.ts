import { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { prisma } from '@/infrastructure/database/prisma';
import { UserRole } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // Credentials Provider for email/password login
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error(
            'Account is temporarily locked. Please try again later.'
          );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          // Increment login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: user.loginAttempts + 1,
              lockedUntil:
                user.loginAttempts >= 4
                  ? new Date(Date.now() + 15 * 60 * 1000)
                  : null, // Lock for 15 minutes after 5 attempts
            },
          });
          throw new Error('Invalid email or password');
        }

        // Check if account is active
        if (!user.isActive) {
          throw new Error('Account is deactivated. Please contact support.');
        }

        // Reset login attempts and update last login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        });

        const userResult: any = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          image: user.image || user.avatar,
          twoFactorEnabled: user.twoFactorEnabled,
        };

        if (user.companyName) {
          userResult.companyName = user.companyName;
        }
        if (user.emailVerified) {
          userResult.emailVerified = user.emailVerified;
        }

        return userResult;
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/welcome',
  },

  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google') {
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            // Create new user for OAuth
            await prisma.user.create({
              data: {
                email: user.email!,
                name: user.name || '',
                image: user.image || null,
                emailVerified: new Date(),
                role: UserRole.USER,
                isActive: true,
              },
            });
          } else if (!existingUser.isActive) {
            return false; // Prevent sign-in for deactivated accounts
          }

          return true;
        } catch (error) {
          console.error('OAuth sign-in error:', error);
          return false;
        }
      }

      // For credentials provider, authorization is handled in the authorize function
      return true;
    },

    async jwt({ token, user, account }) {
      // Initial sign in
      if (user) {
        token.id = user.id || '';
        token.role = user.role;
        if (user.companyName) {
          token.companyName = user.companyName;
        }
        token.twoFactorEnabled = user.twoFactorEnabled;
        if (user.emailVerified) {
          token.emailVerified = user.emailVerified;
        }
      }

      // Refresh user data from database on each request
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            avatar: true,
            image: true,
            companyName: true,
            emailVerified: true,
            twoFactorEnabled: true,
            isActive: true,
          },
        });

        if (dbUser && dbUser.isActive) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          if (dbUser.companyName) {
            token.companyName = dbUser.companyName;
          }
          token.twoFactorEnabled = dbUser.twoFactorEnabled;
          if (dbUser.emailVerified) {
            token.emailVerified = dbUser.emailVerified;
          }
          token.picture = dbUser.image || dbUser.avatar;
        } else {
          // User is deactivated or doesn't exist - clear sensitive data but keep token structure
          token.id = '';
          token.role = UserRole.USER;
          token.twoFactorEnabled = false;
          delete token.companyName;
          delete token.emailVerified;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.companyName = token.companyName as string;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.emailVerified = token.emailVerified as Date;
      }

      return session;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log(`User ${user.email} signed in via ${account?.provider}`);
    },
    async signOut({ session, token }) {
      console.log(`User signed out`);
    },
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`);
    },
  },

  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
};
