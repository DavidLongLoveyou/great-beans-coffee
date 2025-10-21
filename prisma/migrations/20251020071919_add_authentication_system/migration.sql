-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" DATETIME NOT NULL,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "address" TEXT,
    "postalCode" TEXT,
    "businessType" TEXT,
    "establishedYear" INTEGER,
    "certifications" JSONB,
    "capacity" TEXT,
    "qualityRating" REAL,
    "complianceScore" REAL,
    "lastAuditDate" DATETIME,
    "nextAuditDate" DATETIME,
    "paymentTerms" TEXT,
    "creditRating" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isPreferred" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "supplier_contacts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "supplierId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "position" TEXT,
    "department" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "supplier_contacts_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_suppliers" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT NOT NULL,
    "supplierSku" TEXT,
    "leadTime" INTEGER,
    "minimumOrder" REAL,
    "maximumOrder" REAL,
    "pricePerUnit" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "qualityGrade" TEXT,
    "lastDelivery" DATETIME,
    "deliveryRating" REAL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "product_suppliers_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_suppliers_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "product_inventory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "currentStock" REAL NOT NULL DEFAULT 0,
    "reservedStock" REAL NOT NULL DEFAULT 0,
    "availableStock" REAL NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL DEFAULT 'MT',
    "warehouse" TEXT,
    "location" TEXT,
    "batchNumber" TEXT,
    "harvestDate" DATETIME,
    "receivedDate" DATETIME,
    "expiryDate" DATETIME,
    "qualityGrade" TEXT,
    "moistureContent" REAL,
    "defectRate" REAL,
    "lastUpdated" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" TEXT,
    CONSTRAINT "product_inventory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "quality_reports" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "supplierId" TEXT,
    "reportNumber" TEXT NOT NULL,
    "reportType" TEXT NOT NULL,
    "testDate" DATETIME NOT NULL,
    "reportDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "cuppingScore" REAL,
    "aroma" REAL,
    "flavor" REAL,
    "aftertaste" REAL,
    "acidity" REAL,
    "body" REAL,
    "balance" REAL,
    "uniformity" REAL,
    "cleanCup" REAL,
    "sweetness" REAL,
    "moistureContent" REAL,
    "waterActivity" REAL,
    "density" REAL,
    "screenSize" TEXT,
    "defectCount" INTEGER,
    "defectRate" REAL,
    "caffeine" REAL,
    "chlorogenicAcid" REAL,
    "trigonelline" REAL,
    "totalPlateCount" INTEGER,
    "yeastMold" INTEGER,
    "coliform" INTEGER,
    "certifiedBy" TEXT,
    "certifierName" TEXT,
    "certificationNumber" TEXT,
    "notes" TEXT,
    "attachments" JSONB,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    CONSTRAINT "quality_reports_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "quality_reports_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "password" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "companyName" TEXT,
    "companyType" TEXT,
    "country" TEXT,
    "phone" TEXT,
    "position" TEXT,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "lastLoginAt" DATETIME,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lockedUntil" DATETIME
);
INSERT INTO "new_users" ("avatar", "createdAt", "email", "id", "isActive", "name", "role", "updatedAt") SELECT "avatar", "createdAt", "email", "id", "isActive", "name", "role", "updatedAt" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "suppliers_code_key" ON "suppliers"("code");

-- CreateIndex
CREATE UNIQUE INDEX "product_suppliers_productId_supplierId_key" ON "product_suppliers"("productId", "supplierId");

-- CreateIndex
CREATE UNIQUE INDEX "quality_reports_reportNumber_key" ON "quality_reports"("reportNumber");
