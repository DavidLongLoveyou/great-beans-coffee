#!/usr/bin/env tsx

/**
 * Database Seeding Script
 *
 * This script populates the database with initial data for development and testing.
 * Run with: npm run db:seed
 */

import { prisma } from '../infrastructure/database/prisma';
import { seedDatabase } from '../infrastructure/database/seeders';
import { createScopedLogger } from '../shared/utils/logger';

const logger = createScopedLogger('Seed');

async function main() {
  logger.info('🌱 Starting database seeding process...');
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

  try {
    // Check database connection
    await prisma.$connect();
    logger.info('✅ Database connection established');

    // Run all seeders
    const result = await seedDatabase();

    if (result.success) {
      logger.info('\n🎉 Database seeding completed successfully!');
      logger.info('📊 Seeded data:');
      result.seeded.forEach(item => {
        logger.info(`   ✓ ${item}`);
      });

      logger.info('\n📝 Next steps:');
      logger.info('   1. Run "npm run dev" to start the development server');
      logger.info('   2. Visit http://localhost:3000 to see your application');
      logger.info(
        '   3. Run "npm run db:studio" to view data in Prisma Studio'
      );

      process.exit(0);
    } else {
      logger.error('\n❌ Database seeding failed!', result.error);
      process.exit(1);
    }
  } catch (error) {
    logger.error('\n💥 Unexpected error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  logger.info(`
Database Seeding Script

Usage:
  npm run db:seed              # Run all seeders
  npm run db:seed -- --clear   # Clear all data first (development only)

Options:
  --clear    Clear all existing data before seeding (development only)
  --help     Show this help message

Examples:
  npm run db:seed
  npm run db:seed -- --clear
`);
  process.exit(0);
}

if (args.includes('--clear')) {
  logger.info('🧹 Clearing existing data first...');

  databaseSeeders
    .clearAllData()
    .then(result => {
      if (result.success) {
        logger.info('✅ Data cleared successfully');
        return main();
      } else {
        logger.error('❌ Failed to clear data:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      logger.error('💥 Error clearing data:', error);
      process.exit(1);
    });
} else {
  main();
}
