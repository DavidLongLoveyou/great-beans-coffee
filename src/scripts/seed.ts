#!/usr/bin/env tsx

/**
 * Database Seeding Script
 * 
 * This script populates the database with initial data for development and testing.
 * Run with: npm run db:seed
 */

import { databaseSeeders } from '../infrastructure/database/seeders';
import { prisma } from '../infrastructure/database/prisma';

async function main() {
  console.log('🌱 Starting database seeding process...');
  console.log('Environment:', process.env.NODE_ENV || 'development');
  
  try {
    // Check database connection
    await prisma.$connect();
    console.log('✅ Database connection established');
    
    // Run all seeders
    const result = await databaseSeeders.runAllSeeders();
    
    if (result.success) {
      console.log('\n🎉 Database seeding completed successfully!');
      console.log('📊 Seeded data:');
      result.seeded.forEach(item => {
        console.log(`   ✓ ${item}`);
      });
      
      console.log('\n📝 Next steps:');
      console.log('   1. Run "npm run dev" to start the development server');
      console.log('   2. Visit http://localhost:3000 to see your application');
      console.log('   3. Run "npm run db:studio" to view data in Prisma Studio');
      
      process.exit(0);
    } else {
      console.error('\n❌ Database seeding failed!');
      console.error('Error:', result.error);
      process.exit(1);
    }
  } catch (error) {
    console.error('\n💥 Unexpected error during seeding:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Handle script arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
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
  console.log('🧹 Clearing existing data first...');
  
  databaseSeeders.clearAllData()
    .then(result => {
      if (result.success) {
        console.log('✅ Data cleared successfully');
        return main();
      } else {
        console.error('❌ Failed to clear data:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Error clearing data:', error);
      process.exit(1);
    });
} else {
  main();
}