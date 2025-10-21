import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from './logger-service';

const logger = new LoggerService();

export interface TokenPayload {
  userId: string;
  email: string;
  type: 'password-reset' | 'email-verification' | 'access' | 'refresh';
  expiresAt: Date;
}

export interface PasswordResetToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

class TokenService {
  private readonly JWT_SECRET: string =
    process.env.JWT_SECRET || 'fallback-secret-key';
  private readonly RESET_TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
  private readonly VERIFICATION_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  /**
   * Generate a secure random token
   */
  generateSecureToken(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * Generate a JWT token
   */
  generateJWT(
    payload: Omit<TokenPayload, 'expiresAt'>,
    expiresIn: string = '1h'
  ): string {
    try {
      const jwtPayload = {
        userId: payload.userId,
        email: payload.email,
        type: payload.type,
      };
      const options = { expiresIn } as jwt.SignOptions;
      return jwt.sign(jwtPayload, this.JWT_SECRET, options) as string;
    } catch (error) {
      logger.error('Failed to generate JWT:', error);
      throw new Error('Token generation failed');
    }
  }

  /**
   * Verify and decode a JWT token
   */
  verifyJWT(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as TokenPayload;
      return decoded;
    } catch (error) {
      logger.error('Failed to verify JWT:', error);
      return null;
    }
  }

  /**
   * Generate a password reset token
   */
  generatePasswordResetToken(_userId: string): {
    token: string;
    hashedToken: string;
    expiresAt: Date;
  } {
    const token = this.generateSecureToken();
    const hashedToken = this.hashToken(token);
    const expiresAt = new Date(Date.now() + this.RESET_TOKEN_EXPIRY);

    return {
      token,
      hashedToken,
      expiresAt,
    };
  }

  /**
   * Generate an email verification token
   */
  generateEmailVerificationToken(userId: string, email: string): string {
    const payload = {
      userId,
      email,
      type: 'email-verification' as const,
    };

    return this.generateJWT(payload, '24h');
  }

  /**
   * Hash a token for secure storage
   */
  hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  /**
   * Verify a password reset token
   */
  verifyPasswordResetToken(token: string, hashedToken: string): boolean {
    const hashedInput = this.hashToken(token);
    return crypto.timingSafeEqual(
      Buffer.from(hashedInput, 'hex'),
      Buffer.from(hashedToken, 'hex')
    );
  }

  /**
   * Check if a token has expired
   */
  isTokenExpired(expiresAt: Date): boolean {
    return new Date() > expiresAt;
  }

  /**
   * Generate access and refresh tokens
   */
  generateAuthTokens(
    userId: string,
    email: string
  ): {
    accessToken: string;
    refreshToken: string;
  } {
    const accessPayload = {
      userId,
      email,
      type: 'access' as const,
    };

    const refreshPayload = {
      userId,
      email,
      type: 'refresh' as const,
    };

    return {
      accessToken: this.generateJWT(accessPayload, '15m'),
      refreshToken: this.generateJWT(refreshPayload, '7d'),
    };
  }

  /**
   * Refresh an access token using a refresh token
   */
  refreshAccessToken(refreshToken: string): string | null {
    const payload = this.verifyJWT(refreshToken);

    if (!payload || payload.type !== 'refresh') {
      return null;
    }

    const newAccessPayload = {
      userId: payload.userId,
      email: payload.email,
      type: 'access' as const,
    };

    return this.generateJWT(newAccessPayload, '15m');
  }

  /**
   * Generate a secure OTP (One-Time Password)
   */
  generateOTP(length: number = 6): string {
    const digits = '0123456789';
    let otp = '';

    for (let i = 0; i < length; i++) {
      otp += digits[crypto.randomInt(0, digits.length)];
    }

    return otp;
  }

  /**
   * Generate a time-based OTP with expiry
   */
  generateTOTP(secret: string, window: number = 30): string {
    const time = Math.floor(Date.now() / 1000 / window);
    const hmac = crypto.createHmac('sha1', secret);
    hmac.update(Buffer.from(time.toString(16).padStart(16, '0'), 'hex'));

    const hash = hmac.digest();
    const offset = (hash[hash.length - 1] ?? 0) & 0xf;
    const code =
      (((hash[offset] ?? 0) & 0x7f) << 24) |
      (((hash[offset + 1] ?? 0) & 0xff) << 16) |
      (((hash[offset + 2] ?? 0) & 0xff) << 8) |
      ((hash[offset + 3] ?? 0) & 0xff);

    return (code % 1000000).toString().padStart(6, '0');
  }
}

export const tokenService = new TokenService();
