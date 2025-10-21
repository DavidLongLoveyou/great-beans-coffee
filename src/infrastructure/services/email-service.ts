import nodemailer from 'nodemailer';
import { LoggerService } from './logger-service';

const logger = new LoggerService();

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || 'noreply@greatbeans.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${options.to}`);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      return false;
    }
  }

  async sendPasswordResetEmail(
    email: string,
    resetToken: string
  ): Promise<boolean> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

    const template: EmailTemplate = {
      subject: 'Password Reset Request - Great Beans Coffee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You have requested to reset your password for your Great Beans Coffee account.</p>
          <p>Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you did not request this password reset, please ignore this email.</p>
        </div>
      `,
      text: `Password Reset Request\n\nYou have requested to reset your password for your Great Beans Coffee account.\n\nClick the link below to reset your password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this password reset, please ignore this email.`,
    };

    const emailOptions: EmailOptions = {
      to: email,
      subject: template.subject,
      html: template.html,
    };

    if (template.text) {
      emailOptions.text = template.text;
    }

    return this.sendEmail(emailOptions);
  }

  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    const template: EmailTemplate = {
      subject: 'Welcome to Great Beans Coffee',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Great Beans Coffee, ${name}!</h2>
          <p>Thank you for joining our premium coffee export platform.</p>
          <p>You can now access our full range of services including:</p>
          <ul>
            <li>Premium coffee sourcing</li>
            <li>Quality assurance reports</li>
            <li>Custom export solutions</li>
            <li>Market insights and reports</li>
          </ul>
          <p>Get started by exploring our product catalog and requesting your first quote.</p>
          <a href="${process.env.NEXTAUTH_URL}" style="background-color: #8B4513; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Visit Platform</a>
        </div>
      `,
      text: `Welcome to Great Beans Coffee, ${name}!\n\nThank you for joining our premium coffee export platform.\n\nYou can now access our full range of services including:\n- Premium coffee sourcing\n- Quality assurance reports\n- Custom export solutions\n- Market insights and reports\n\nGet started by exploring our product catalog and requesting your first quote.\n\nVisit: ${process.env.NEXTAUTH_URL}`,
    };

    const emailOptions: EmailOptions = {
      to: email,
      subject: template.subject,
      html: template.html,
    };

    if (template.text) {
      emailOptions.text = template.text;
    }

    return this.sendEmail(emailOptions);
  }
}

export const emailService = new EmailService();
