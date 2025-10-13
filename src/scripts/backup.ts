#!/usr/bin/env tsx

/**
 * Database Backup Script
 *
 * This script creates backups of the database for data protection.
 * Run with: npm run db:backup
 */

import { exec } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { promisify } from 'util';

import { format } from 'date-fns';

import { createScopedLogger } from '../shared/utils/logger';

const execAsync = promisify(exec);
const logger = createScopedLogger('DatabaseBackup');

interface BackupOptions {
  outputDir?: string;
  includeSchema?: boolean;
  includeData?: boolean;
  compress?: boolean;
}

class DatabaseBackup {
  private databaseUrl: string;
  private backupDir: string;

  constructor() {
    this.databaseUrl = process.env.DATABASE_URL || '';
    this.backupDir = join(process.cwd(), 'backups');

    if (!this.databaseUrl) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    // Ensure backup directory exists
    if (!existsSync(this.backupDir)) {
      mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * Create a full database backup
   */
  async createBackup(options: BackupOptions = {}): Promise<string> {
    const {
      outputDir = this.backupDir,
      includeSchema = true,
      includeData = true,
      compress = true,
    } = options;

    const timestamp = format(new Date(), 'yyyy-MM-dd_HH-mm-ss');
    const filename = `great-beans-backup_${timestamp}.sql${compress ? '.gz' : ''}`;
    const outputPath = join(outputDir, filename);

    // Script layer logging removed for production

    try {
      // Parse database URL
      const dbUrl = new URL(this.databaseUrl);
      const host = dbUrl.hostname;
      const port = dbUrl.port || '5432';
      const database = dbUrl.pathname.slice(1);
      const username = dbUrl.username;
      const password = dbUrl.password;

      // Build pg_dump command
      let command = 'pg_dump';

      // Connection parameters
      command += ` --host=${host}`;
      command += ` --port=${port}`;
      command += ` --username=${username}`;
      command += ` --dbname=${database}`;

      // Backup options
      if (includeSchema && includeData) {
        // Full backup (default)
      } else if (includeSchema && !includeData) {
        command += ' --schema-only';
      } else if (!includeSchema && includeData) {
        command += ' --data-only';
      }

      // Additional options
      command += ' --verbose';
      command += ' --no-password';
      command += ' --format=plain';
      command += ' --no-owner';
      command += ' --no-privileges';

      // Output redirection
      if (compress) {
        command += ` | gzip > "${outputPath}"`;
      } else {
        command += ` > "${outputPath}"`;
      }

      // Set password environment variable
      const env = { ...process.env, PGPASSWORD: password };

      // Script layer logging removed for production
      await execAsync(command, { env });

      // Script layer logging removed for production

      return outputPath;
    } catch (error) {
      // Script layer logging removed for production
      throw error;
    }
  }

  /**
   * Create a schema-only backup
   */
  async createSchemaBackup(): Promise<string> {
    // Script layer logging removed for production
    return this.createBackup({
      includeSchema: true,
      includeData: false,
      compress: false,
    });
  }

  /**
   * Create a data-only backup
   */
  async createDataBackup(): Promise<string> {
    // Script layer logging removed for production
    return this.createBackup({
      includeSchema: false,
      includeData: true,
      compress: true,
    });
  }

  /**
   * List existing backups
   */
  async listBackups(): Promise<void> {
    const { readdirSync, statSync } = await import('fs');

    // Script layer logging removed for production

    try {
      const files = readdirSync(this.backupDir)
        .filter(file => file.startsWith('great-beans-backup_'))
        .map(file => {
          const filePath = join(this.backupDir, file);
          const stats = statSync(filePath);
          return {
            name: file,
            size: this.formatFileSize(stats.size),
            created: stats.mtime.toISOString(),
          };
        })
        .sort((a, b) => b.created.localeCompare(a.created));

      if (files.length === 0) {
        // Script layer logging removed for production
        return;
      }

      files.forEach((file, index) => {
        // Script layer logging removed for production
      });
    } catch (error) {
      // Script layer logging removed for production
    }
  }

  /**
   * Clean old backups (keep last N backups)
   */
  async cleanOldBackups(keepCount: number = 5): Promise<void> {
    const { readdirSync, unlinkSync, statSync } = await import('fs');

    // Script layer logging removed for production

    try {
      const files = readdirSync(this.backupDir)
        .filter(file => file.startsWith('great-beans-backup_'))
        .map(file => ({
          name: file,
          path: join(this.backupDir, file),
          created: statSync(join(this.backupDir, file)).mtime,
        }))
        .sort((a, b) => b.created.getTime() - a.created.getTime());

      if (files.length <= keepCount) {
        // Script layer logging removed for production
        return;
      }

      const filesToDelete = files.slice(keepCount);

      filesToDelete.forEach(file => {
        unlinkSync(file.path);
        // Script layer logging removed for production
      });

      // Script layer logging removed for production
    } catch (error) {
      // Script layer logging removed for production
    }
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    // Script layer logging removed for production
    process.exit(0);
  }

  try {
    const backup = new DatabaseBackup();

    if (args.includes('--list')) {
      await backup.listBackups();
    } else if (args.includes('--clean')) {
      await backup.cleanOldBackups();
    } else if (args.includes('--schema-only')) {
      await backup.createSchemaBackup();
    } else if (args.includes('--data-only')) {
      await backup.createDataBackup();
    } else {
      await backup.createBackup();
    }

    // Script layer logging removed for production
  } catch (error) {
    // Script layer logging removed for production
    process.exit(1);
  }
}

main();
