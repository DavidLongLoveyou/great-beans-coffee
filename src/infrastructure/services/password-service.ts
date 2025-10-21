import bcrypt from 'bcryptjs';
import { LoggerService } from './logger-service';

const logger = new LoggerService();

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  score: number; // 0-100
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbidCommonPasswords: boolean;
  maxLength?: number;
}

class PasswordService {
  private readonly saltRounds = 12;
  private readonly defaultPolicy: PasswordPolicy = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbidCommonPasswords: true,
    maxLength: 128,
  };

  private readonly commonPasswords = new Set([
    'password',
    '123456',
    '123456789',
    'qwerty',
    'abc123',
    'password123',
    'admin',
    'letmein',
    'welcome',
    'monkey',
    '1234567890',
    'iloveyou',
    'princess',
    'rockyou',
    '12345678',
  ]);

  /**
   * Hash a password using bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      logger.debug('Password hashed successfully');
      return hashedPassword;
    } catch (error) {
      logger.error('Failed to hash password:', error);
      throw new Error('Password hashing failed');
    }
  }

  /**
   * Verify a password against its hash
   */
  async verifyPassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    try {
      const isValid = await bcrypt.compare(password, hashedPassword);

      if (isValid) {
        logger.debug('Password verification successful');
      } else {
        logger.debug('Password verification failed');
      }

      return isValid;
    } catch (error) {
      logger.error('Failed to verify password:', error);
      return false;
    }
  }

  /**
   * Validate password against policy
   */
  validatePassword(
    password: string,
    policy: Partial<PasswordPolicy> = {}
  ): PasswordValidationResult {
    const activePolicy = { ...this.defaultPolicy, ...policy };
    const errors: string[] = [];
    let score = 0;

    // Check minimum length
    if (password.length < activePolicy.minLength) {
      errors.push(
        `Password must be at least ${activePolicy.minLength} characters long`
      );
    } else {
      score += 20;
    }

    // Check maximum length
    if (activePolicy.maxLength && password.length > activePolicy.maxLength) {
      errors.push(
        `Password must not exceed ${activePolicy.maxLength} characters`
      );
    }

    // Check uppercase requirement
    if (activePolicy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (/[A-Z]/.test(password)) {
      score += 15;
    }

    // Check lowercase requirement
    if (activePolicy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (/[a-z]/.test(password)) {
      score += 15;
    }

    // Check numbers requirement
    if (activePolicy.requireNumbers && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    } else if (/\d/.test(password)) {
      score += 15;
    }

    // Check special characters requirement
    if (
      activePolicy.requireSpecialChars &&
      !/[!@#$%^&*(),.?":{}|<>]/.test(password)
    ) {
      errors.push('Password must contain at least one special character');
    } else if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 15;
    }

    // Check against common passwords
    if (activePolicy.forbidCommonPasswords && this.isCommonPassword(password)) {
      errors.push(
        'Password is too common. Please choose a more unique password'
      );
    }

    // Additional scoring for complexity
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
    if (/[!@#$%^&*(),.?":{}|<>].*[!@#$%^&*(),.?":{}|<>]/.test(password))
      score += 5; // Multiple special chars
    if (/\d.*\d/.test(password)) score += 5; // Multiple numbers

    // Cap the score at 100
    score = Math.min(score, 100);

    return {
      isValid: errors.length === 0,
      errors,
      score,
    };
  }

  /**
   * Check if password is in common passwords list
   */
  private isCommonPassword(password: string): boolean {
    return this.commonPasswords.has(password.toLowerCase());
  }

  /**
   * Generate a secure random password
   */
  generateSecurePassword(length: number = 16): string {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*(),.?":{}|<>';

    const allChars = uppercase + lowercase + numbers + specialChars;
    let password = '';

    // Ensure at least one character from each category
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += specialChars[Math.floor(Math.random() * specialChars.length)];

    // Fill the rest randomly
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password
    return password
      .split('')
      .sort(() => Math.random() - 0.5)
      .join('');
  }

  /**
   * Check if password needs to be rehashed (due to changed salt rounds)
   */
  needsRehash(hashedPassword: string): boolean {
    try {
      const rounds = bcrypt.getRounds(hashedPassword);
      return rounds < this.saltRounds;
    } catch (error) {
      logger.error('Failed to check if password needs rehash:', error);
      return false;
    }
  }

  /**
   * Get password strength description
   */
  getPasswordStrengthDescription(score: number): string {
    if (score >= 90) return 'Very Strong';
    if (score >= 70) return 'Strong';
    if (score >= 50) return 'Moderate';
    if (score >= 30) return 'Weak';
    return 'Very Weak';
  }

  /**
   * Check for password breaches (placeholder implementation)
   */
  async checkPasswordBreach(password: string): Promise<boolean> {
    // In a real implementation, this would check against services like HaveIBeenPwned
    // For now, we'll just check against our common passwords list
    return this.isCommonPassword(password);
  }

  /**
   * Generate password reset token
   */
  generatePasswordResetToken(): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < 32; i++) {
      token += chars[Math.floor(Math.random() * chars.length)];
    }

    return token;
  }

  /**
   * Estimate time to crack password
   */
  estimateCrackTime(password: string): string {
    const charsetSize = this.getCharsetSize(password);
    const combinations = Math.pow(charsetSize, password.length);

    // Assume 1 billion guesses per second
    const secondsToCrack = combinations / (2 * 1000000000);

    if (secondsToCrack < 60) return 'Less than a minute';
    if (secondsToCrack < 3600)
      return `${Math.ceil(secondsToCrack / 60)} minutes`;
    if (secondsToCrack < 86400)
      return `${Math.ceil(secondsToCrack / 3600)} hours`;
    if (secondsToCrack < 31536000)
      return `${Math.ceil(secondsToCrack / 86400)} days`;
    if (secondsToCrack < 31536000000)
      return `${Math.ceil(secondsToCrack / 31536000)} years`;

    return 'Centuries';
  }

  /**
   * Get character set size for password
   */
  private getCharsetSize(password: string): number {
    let size = 0;

    if (/[a-z]/.test(password)) size += 26;
    if (/[A-Z]/.test(password)) size += 26;
    if (/\d/.test(password)) size += 10;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) size += 32;

    return size;
  }
}

export const passwordService = new PasswordService();
