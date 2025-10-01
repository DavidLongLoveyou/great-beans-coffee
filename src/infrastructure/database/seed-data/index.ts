// Seed Data Exports
// This file provides centralized access to all seed data for The Great Beans platform

import { businessServicesData } from './business-services';
import { clientCompaniesData } from './client-companies';
import { coffeeProductsData } from './coffee-products';
import { contentData } from './content';
import { rfqsData } from './rfqs';
import { usersData } from './users';

// Re-export all data
export { coffeeProductsData } from './coffee-products';
export type { SeedCoffeeProduct } from './coffee-products';

export { businessServicesData } from './business-services';
export type { SeedBusinessService } from './business-services';

export { rfqsData } from './rfqs';
export type { SeedRFQ } from './rfqs';

export { clientCompaniesData } from './client-companies';
export type { SeedClientCompany } from './client-companies';

export { contentData } from './content';
export type { SeedContent } from './content';

export { usersData } from './users';
export type { SeedUser } from './users';

// Consolidated seed data object for easy access
export const seedData = {
  users: usersData,
  coffeeProducts: coffeeProductsData,
  businessServices: businessServicesData,
  rfqs: rfqsData,
  clientCompanies: clientCompaniesData,
  content: contentData,
} as const;

// Seed data statistics
export const seedDataStats = {
  users: usersData.length,
  coffeeProducts: coffeeProductsData.length,
  businessServices: businessServicesData.length,
  rfqs: rfqsData.length,
  clientCompanies: clientCompaniesData.length,
  content: contentData.length,
  total:
    usersData.length +
    coffeeProductsData.length +
    businessServicesData.length +
    rfqsData.length +
    clientCompaniesData.length +
    contentData.length,
} as const;

// Utility function to get seed data by type
export function getSeedDataByType<T extends keyof typeof seedData>(
  type: T
): (typeof seedData)[T] {
  return seedData[type];
}

// Utility function to validate seed data integrity
export function validateSeedData(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Check for duplicate IDs across all data types
  const allIds = new Set<string>();

  Object.entries(seedData).forEach(([type, data]) => {
    data.forEach((item: any) => {
      if (allIds.has(item.id)) {
        errors.push(`Duplicate ID found: ${item.id} in ${type}`);
      }
      allIds.add(item.id);
    });
  });

  // Check for valid email formats in users
  usersData.forEach(user => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user.email)) {
      errors.push(`Invalid email format for user: ${user.id} - ${user.email}`);
    }
  });

  // Check for valid references between entities
  rfqsData.forEach(rfq => {
    // Check if client company exists
    if (
      rfq.clientCompany &&
      !clientCompaniesData.find(c => c.id === rfq.clientCompany.id)
    ) {
      errors.push(
        `RFQ ${rfq.id} references non-existent client company: ${rfq.clientCompany.id}`
      );
    }

    // Check if assigned user exists
    if (rfq.assignedTo && !usersData.find(u => u.id === rfq.assignedTo)) {
      errors.push(
        `RFQ ${rfq.id} references non-existent user: ${rfq.assignedTo}`
      );
    }
  });

  // Check content references
  contentData.forEach(content => {
    // Check if author exists
    if (!usersData.find(u => u.email === content.author.email)) {
      errors.push(
        `Content ${content.id} references non-existent author: ${content.author.email}`
      );
    }

    // Check related content references
    if (content.relatedContent) {
      content.relatedContent.forEach(relatedId => {
        if (!contentData.find(c => c.id === relatedId)) {
          errors.push(
            `Content ${content.id} references non-existent related content: ${relatedId}`
          );
        }
      });
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Export validation result
export const seedDataValidation = validateSeedData();
