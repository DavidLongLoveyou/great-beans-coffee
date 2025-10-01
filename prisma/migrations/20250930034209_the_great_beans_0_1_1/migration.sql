/*
  Warnings:

  - You are about to alter the column `benefits` on the `coffee_product_translations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `features` on the `coffee_product_translations` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `seoMetadata` on the `coffee_products` table. All the data in the column will be lost.
  - You are about to alter the column `availability` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `documents` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `images` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `originInfo` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `pricing` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `specifications` on the `coffee_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to drop the column `keywords` on the `content` table. All the data in the column will be lost.
  - You are about to alter the column `media` on the `content` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `tags` on the `content` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `certifications` on the `rfq_products` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `deliveryRequirements` on the `rfqs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `paymentRequirements` on the `rfqs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `productRequirements` on the `rfqs` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - Added the required column `origin` to the `coffee_products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "product_specifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "product_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "certifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "issuer" TEXT,
    "website" TEXT,
    "logo" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "certification_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificationId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    CONSTRAINT "certification_translations_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_certifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "certificationId" TEXT NOT NULL,
    "certificateNumber" TEXT,
    "issueDate" DATETIME,
    "expiryDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "product_certifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_certifications_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "business_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pricingType" TEXT NOT NULL DEFAULT 'QUOTE',
    "minOrder" INTEGER,
    "leadTime" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "business_services_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "business_services_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "business_service_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "features" JSONB,
    "benefits" JSONB,
    "process" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "slug" TEXT NOT NULL,
    CONSTRAINT "business_service_translations_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "business_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_specifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "unit" TEXT,
    "category" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "service_specifications_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "business_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "client_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "website" TEXT,
    "industry" TEXT,
    "companySize" TEXT,
    "country" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "taxId" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "source" TEXT,
    "assignedTo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "client_contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "companyId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "position" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "client_contacts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "client_companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rfq_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfqId" TEXT NOT NULL,
    "serviceId" TEXT,
    "serviceType" TEXT NOT NULL,
    "description" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unitPrice" REAL,
    "totalPrice" REAL,
    "notes" TEXT,
    CONSTRAINT "rfq_services_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rfq_services_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "business_services" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_coffee_product_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "tastingNotes" TEXT,
    "processingNotes" TEXT,
    "features" JSONB,
    "benefits" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "slug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "coffee_product_translations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_coffee_product_translations" ("benefits", "description", "features", "id", "locale", "metaDescription", "metaTitle", "name", "productId", "shortDescription", "slug") SELECT "benefits", "description", "features", "id", "locale", "metaDescription", "metaTitle", "name", "productId", "shortDescription", "slug" FROM "coffee_product_translations";
DROP TABLE "coffee_product_translations";
ALTER TABLE "new_coffee_product_translations" RENAME TO "coffee_product_translations";
CREATE UNIQUE INDEX "coffee_product_translations_productId_locale_key" ON "coffee_product_translations"("productId", "locale");
CREATE UNIQUE INDEX "coffee_product_translations_locale_slug_key" ON "coffee_product_translations"("locale", "slug");
CREATE TABLE "new_coffee_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "coffeeType" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "processing" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "region" TEXT,
    "farm" TEXT,
    "altitude" TEXT,
    "harvestSeason" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "specifications" JSONB,
    "pricing" JSONB,
    "availability" JSONB,
    "originInfo" JSONB,
    "images" JSONB,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "coffee_products_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "coffee_products_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_coffee_products" ("availability", "coffeeType", "createdAt", "createdBy", "documents", "grade", "id", "images", "isActive", "originInfo", "pricing", "processing", "sku", "specifications", "updatedAt", "updatedBy") SELECT "availability", "coffeeType", "createdAt", "createdBy", "documents", "grade", "id", "images", "isActive", "originInfo", "pricing", "processing", "sku", "specifications", "updatedAt", "updatedBy" FROM "coffee_products";
DROP TABLE "coffee_products";
ALTER TABLE "new_coffee_products" RENAME TO "coffee_products";
CREATE UNIQUE INDEX "coffee_products_sku_key" ON "coffee_products"("sku");
CREATE TABLE "new_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "media" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "tags" JSONB,
    "category" TEXT,
    "publishedAt" DATETIME,
    "scheduledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL
);
INSERT INTO "new_content" ("authorId", "category", "content", "createdAt", "excerpt", "featuredImage", "id", "locale", "media", "metaDescription", "metaTitle", "publishedAt", "scheduledAt", "slug", "status", "tags", "title", "type", "updatedAt") SELECT "authorId", "category", "content", "createdAt", "excerpt", "featuredImage", "id", "locale", "media", "metaDescription", "metaTitle", "publishedAt", "scheduledAt", "slug", "status", "tags", "title", "type", "updatedAt" FROM "content";
DROP TABLE "content";
ALTER TABLE "new_content" RENAME TO "content";
CREATE UNIQUE INDEX "content_locale_slug_key" ON "content"("locale", "slug");
CREATE TABLE "new_rfq_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfqId" TEXT NOT NULL,
    "productId" TEXT,
    "productType" TEXT NOT NULL,
    "grade" TEXT,
    "origin" TEXT,
    "processingMethod" TEXT,
    "certifications" JSONB,
    "quantity" REAL NOT NULL,
    "quantityUnit" TEXT NOT NULL,
    "targetPrice" REAL,
    "unitPrice" REAL,
    "totalPrice" REAL,
    "currency" TEXT,
    "notes" TEXT,
    CONSTRAINT "rfq_products_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rfq_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_rfq_products" ("certifications", "currency", "grade", "id", "origin", "processingMethod", "productId", "productType", "quantity", "quantityUnit", "rfqId", "targetPrice") SELECT "certifications", "currency", "grade", "id", "origin", "processingMethod", "productId", "productType", "quantity", "quantityUnit", "rfqId", "targetPrice" FROM "rfq_products";
DROP TABLE "rfq_products";
ALTER TABLE "new_rfq_products" RENAME TO "rfq_products";
CREATE TABLE "new_rfqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfqNumber" TEXT NOT NULL,
    "clientId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "businessType" TEXT,
    "productRequirements" JSONB,
    "deliveryRequirements" JSONB,
    "paymentRequirements" JSONB,
    "additionalRequirements" TEXT,
    "sampleRequired" BOOLEAN NOT NULL DEFAULT false,
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "totalValue" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "incoterms" TEXT,
    "destination" TEXT,
    "deadline" DATETIME,
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "assignedTo" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    "notes" TEXT,
    CONSTRAINT "rfqs_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "client_companies" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rfqs_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rfqs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_rfqs" ("additionalRequirements", "assignedTo", "businessType", "companyName", "contactPerson", "country", "createdAt", "createdBy", "deliveryRequirements", "email", "id", "locale", "paymentRequirements", "phone", "priority", "productRequirements", "rfqNumber", "sampleRequired", "status", "updatedAt", "updatedBy", "urgency") SELECT "additionalRequirements", "assignedTo", "businessType", "companyName", "contactPerson", "country", "createdAt", "createdBy", "deliveryRequirements", "email", "id", "locale", "paymentRequirements", "phone", "priority", "productRequirements", "rfqNumber", "sampleRequired", "status", "updatedAt", "updatedBy", "urgency" FROM "rfqs";
DROP TABLE "rfqs";
ALTER TABLE "new_rfqs" RENAME TO "rfqs";
CREATE UNIQUE INDEX "rfqs_rfqNumber_key" ON "rfqs"("rfqNumber");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "certifications_name_key" ON "certifications"("name");

-- CreateIndex
CREATE UNIQUE INDEX "certifications_code_key" ON "certifications"("code");

-- CreateIndex
CREATE UNIQUE INDEX "certification_translations_certificationId_locale_key" ON "certification_translations"("certificationId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "product_certifications_productId_certificationId_key" ON "product_certifications"("productId", "certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "business_services_slug_key" ON "business_services"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "business_service_translations_serviceId_locale_key" ON "business_service_translations"("serviceId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "business_service_translations_locale_slug_key" ON "business_service_translations"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "client_companies_email_key" ON "client_companies"("email");
