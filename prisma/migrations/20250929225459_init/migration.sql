-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "avatar" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "coffee_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sku" TEXT NOT NULL,
    "coffeeType" TEXT NOT NULL,
    "grade" TEXT NOT NULL,
    "processing" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "specifications" TEXT NOT NULL,
    "pricing" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "originInfo" TEXT NOT NULL,
    "images" TEXT,
    "documents" TEXT,
    "seoMetadata" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "createdBy" TEXT NOT NULL,
    "updatedBy" TEXT NOT NULL,
    CONSTRAINT "coffee_products_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "coffee_products_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "coffee_product_translations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "locale" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "features" TEXT,
    "benefits" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "slug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    CONSTRAINT "coffee_product_translations_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rfqs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfqNumber" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
    "companyName" TEXT NOT NULL,
    "contactPerson" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "country" TEXT NOT NULL,
    "businessType" TEXT,
    "productRequirements" TEXT NOT NULL,
    "deliveryRequirements" TEXT NOT NULL,
    "paymentRequirements" TEXT,
    "additionalRequirements" TEXT,
    "sampleRequired" BOOLEAN NOT NULL DEFAULT false,
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "locale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "assignedTo" TEXT,
    "createdBy" TEXT,
    "updatedBy" TEXT,
    CONSTRAINT "rfqs_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "rfqs_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rfq_products" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "rfqId" TEXT NOT NULL,
    "productId" TEXT,
    "productType" TEXT NOT NULL,
    "grade" TEXT,
    "origin" TEXT,
    "processingMethod" TEXT,
    "certifications" TEXT,
    "quantity" REAL NOT NULL,
    "quantityUnit" TEXT NOT NULL,
    "targetPrice" REAL,
    "currency" TEXT,
    CONSTRAINT "rfq_products_rfqId_fkey" FOREIGN KEY ("rfqId") REFERENCES "rfqs" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "rfq_products_productId_fkey" FOREIGN KEY ("productId") REFERENCES "coffee_products" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "locale" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "media" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT,
    "tags" TEXT,
    "category" TEXT,
    "publishedAt" DATETIME,
    "scheduledAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "authorId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "coffee_products_sku_key" ON "coffee_products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "coffee_product_translations_productId_locale_key" ON "coffee_product_translations"("productId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "coffee_product_translations_locale_slug_key" ON "coffee_product_translations"("locale", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "rfqs_rfqNumber_key" ON "rfqs"("rfqNumber");

-- CreateIndex
CREATE UNIQUE INDEX "content_locale_slug_key" ON "content"("locale", "slug");
