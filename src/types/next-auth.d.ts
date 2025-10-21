import { UserRole } from '@prisma/client';
import { DefaultSession, DefaultUser } from 'next-auth';
import { DefaultJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      companyName?: string;
      twoFactorEnabled: boolean;
      emailVerified?: Date;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    role: UserRole;
    companyName?: string;
    twoFactorEnabled: boolean;
    emailVerified?: Date;
    avatar?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    role: UserRole;
    companyName?: string;
    twoFactorEnabled: boolean;
    emailVerified?: Date;
  }
}
