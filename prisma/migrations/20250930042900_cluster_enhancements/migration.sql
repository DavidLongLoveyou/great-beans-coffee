-- CreateTable
CREATE TABLE "pricing_models" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT,
    "basePrice" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "unit" TEXT,
    "minimumOrder" REAL,
    "maximumOrder" REAL,
    "tiers" JSONB,
    "modifiers" JSONB,
    "paymentTerms" TEXT,
    "deliveryTerms" TEXT,
    "validityPeriod" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "product_pricing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "productId" TEXT NOT NULL,
    "pricingModelId" TEXT NOT NULL,
    "customPrice" REAL,
    "customTerms" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "product_pricing_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "product_pricing_pricingModelId_fkey" FOREIGN KEY ("pricingModelId") REFERENCES "pricing_models" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "service_pricing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "serviceId" TEXT NOT NULL,
    "pricingModelId" TEXT NOT NULL,
    "customPrice" REAL,
    "customTerms" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "service_pricing_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "business_services" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "service_pricing_pricingModelId_fkey" FOREIGN KEY ("pricingModelId") REFERENCES "pricing_models" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cluster_content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clusterId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT NOT NULL,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "heroDescription" TEXT,
    "heroImage" TEXT,
    "heroVideo" TEXT,
    "aboutSection" JSONB,
    "benefitsSection" JSONB,
    "processSection" JSONB,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" JSONB,
    "slug" TEXT NOT NULL,
    "schemaData" JSONB,
    "featuredProducts" JSONB,
    "featuredServices" JSONB,
    "featuredArticles" JSONB,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_business_services" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "pricingType" TEXT NOT NULL DEFAULT 'QUOTE',
    "minOrder" INTEGER,
    "leadTime" INTEGER,
    "leadTimeText" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "minimumOrder" TEXT,
    "maximumOrder" TEXT,
    "capabilities" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "business_services_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "business_services_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_business_services" ("category", "createdAt", "createdBy", "currency", "id", "isActive", "isFeatured", "leadTime", "minOrder", "price", "pricingType", "slug", "sortOrder", "type", "updatedAt", "updatedBy") SELECT "category", "createdAt", "createdBy", "currency", "id", "isActive", "isFeatured", "leadTime", "minOrder", "price", "pricingType", "slug", "sortOrder", "type", "updatedAt", "updatedBy" FROM "business_services";
DROP TABLE "business_services";
ALTER TABLE "new_business_services" RENAME TO "business_services";
CREATE UNIQUE INDEX "business_services_slug_key" ON "business_services"("slug");
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
    "cuppingScore" REAL,
    "moisture" TEXT,
    "screenSize" TEXT,
    "defectRate" TEXT,
    "leadTime" TEXT,
    "inStock" BOOLEAN NOT NULL DEFAULT true,
    "minimumOrder" TEXT,
    "specifications" JSONB,
    "pricing" JSONB,
    "availability" JSONB,
    "originInfo" JSONB,
    "features" JSONB,
    "images" JSONB,
    "documents" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "coffee_products_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "coffee_products_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_coffee_products" ("altitude", "availability", "coffeeType", "createdAt", "createdBy", "documents", "farm", "grade", "harvestSeason", "id", "images", "isActive", "isFeatured", "origin", "originInfo", "pricing", "processing", "region", "sku", "sortOrder", "specifications", "updatedAt", "updatedBy") SELECT "altitude", "availability", "coffeeType", "createdAt", "createdBy", "documents", "farm", "grade", "harvestSeason", "id", "images", "isActive", "isFeatured", "origin", "originInfo", "pricing", "processing", "region", "sku", "sortOrder", "specifications", "updatedAt", "updatedBy" FROM "coffee_products";
DROP TABLE "coffee_products";
ALTER TABLE "new_coffee_products" RENAME TO "coffee_products";
CREATE UNIQUE INDEX "coffee_products_sku_key" ON "coffee_products"("sku");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "product_pricing_productId_pricingModelId_key" ON "product_pricing"("productId", "pricingModelId");

-- CreateIndex
CREATE UNIQUE INDEX "service_pricing_serviceId_pricingModelId_key" ON "service_pricing"("serviceId", "pricingModelId");

-- CreateIndex
CREATE UNIQUE INDEX "cluster_content_clusterId_key" ON "cluster_content"("clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "cluster_content_clusterId_locale_key" ON "cluster_content"("clusterId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "cluster_content_locale_slug_key" ON "cluster_content"("locale", "slug");
