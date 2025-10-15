#!/usr/bin/env tsx

/**
 * Database Seeding Script
 *
 * This script populates the database with initial data for development and testing.
 * Run with: npm run db:seed
 */

import { prisma } from '../infrastructure/database/prisma';
import { databaseSeeders } from '../infrastructure/database/seeders';
import { createScopedLogger } from '../shared/utils/logger';

const _logger = createScopedLogger('Seed');

async function main() {
  // Script layer logging removed for production

  try {
    // Check database connection
    await prisma.$connect();
    // Script layer logging removed for production

    // Run all seeders
    const _result = await databaseSeeders.runAllSeeders();

    if (_result.success) {
      // Script layer logging removed for production

      process.exit(0);
    } else {
      // Script layer logging removed for production
      process.exit(1);
    }
  } catch (error) {
    // Script layer logging removed for production
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script arguments
const _args = process.argv.slice(2);

if (_args.includes('--help') || _args.includes('-h')) {
  // Script layer logging removed for production
  process.exit(0);
}

if (_args.includes('--clear')) {
  // Script layer logging removed for production

  databaseSeeders
    .clearAllData()
    .then(result => {
      if (result.success) {
        // Script layer logging removed for production
        return main();
      } else {
        // Script layer logging removed for production
        process.exit(1);
      }
    })
    .catch(_error => {
      // Script layer logging removed for production
      process.exit(1);
    });
} else {
  main();
}
