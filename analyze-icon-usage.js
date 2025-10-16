const fs = require('fs');
const path = require('path');

// Read all icon imports from the search results
const iconImports = new Set();

// Function to extract icons from import statements
function extractIconsFromFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const importRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"]@\/components\/ui\/icons['"]/g;
    
    let match;
    while ((match = importRegex.exec(content)) !== null) {
      const icons = match[1].split(',').map(icon => icon.trim());
      icons.forEach(icon => {
        // Remove 'type' keyword if present
        const cleanIcon = icon.replace(/^type\s+/, '');
        if (cleanIcon && !cleanIcon.includes('LucideIcon')) {
          iconImports.add(cleanIcon);
        }
      });
    }
  } catch (error) {
    console.log(`Could not read file: ${filePath}`);
  }
}

// List of files that import icons (from the search results)
const filesToCheck = [
  'src/components/charts/RiskHeatmap.tsx',
  'src/presentation/components/multimedia/VideoPlayer.tsx',
  'src/presentation/components/rfq/RFQDetailModal.tsx',
  'src/presentation/components/ui/sheet.tsx',
  'src/app/[locale]/products/blends/page.tsx',
  'src/app/[locale]/services/sourcing/page.tsx',
  'src/app/[locale]/legal/[slug]/page.tsx',
  'src/presentation/components/LanguageSwitcher.tsx',
  'src/presentation/components/charts/ConsumptionMap.tsx',
  'src/app/[locale]/services/[slug]/page.tsx',
  'src/app/[locale]/products/arabica/page.tsx',
  'src/app/[locale]/origin-stories/page.tsx',
  'src/presentation/components/cms/ContentPreview.tsx',
  'src/presentation/components/catalog/ProductGrid.tsx',
  'src/presentation/components/search/SearchSuggestions.tsx',
  'src/components/ui/rfq-status-manager.tsx',
  'src/presentation/components/rfq/RFQListFilters.tsx',
  'src/app/[locale]/certifications/page.tsx',
  'src/app/[locale]/dashboard/quotes/page.tsx',
  'src/app/[locale]/dashboard/account/page.tsx',
  'src/app/[locale]/dashboard/analytics/page.tsx',
  'src/components/ui/BulkPricingCalculator.tsx',
  'src/app/[locale]/services/private-label/page.tsx',
  'src/presentation/components/ui/navigation-menu.tsx',
  'src/presentation/components/charts/PriceAnalysis.tsx',
  'src/components/charts/SupplyChainNetwork.tsx',
  'src/components/features/products/ProductImageGallery.tsx',
  'src/presentation/components/navigation/ClusterNavigation.tsx',
  'src/app/[locale]/dashboard/page.tsx',
  'src/components/features/admin/InventoryManager.tsx',
  'src/app/[locale]/market-reports/[slug]/page.tsx',
  'src/presentation/components/ui/hydration-safe-navigation-menu.tsx',
  'src/app/[locale]/terms/page.tsx',
  'src/presentation/components/rfq/RFQListTable.tsx',
  'src/app/[locale]/search/page.tsx',
  'src/app/[locale]/origin-stories/[slug]/page.tsx',
  'src/app/[locale]/rfq/page.tsx',
  'src/app/[locale]/market-reports/page.tsx',
  'src/app/[locale]/dashboard/orders/page.tsx',
  'src/app/[locale]/blog/[slug]/page.tsx',
  'src/components/features/admin/ProductEditor.tsx',
  'src/presentation/components/sections/ServerHeroSection.tsx',
  'src/presentation/components/cms/ContentList.tsx',
  'src/app/[locale]/sustainability/page.tsx',
  'src/app/[locale]/contact/page.tsx',
  'src/shared/components/performance/WebVitalsDashboard.tsx',
  'src/presentation/components/search/SearchFilters.tsx',
  'src/shared/components/design-system/Coffee/EnhancedCertificationBadge.tsx',
  'src/components/tools/RiskAssessmentTool.tsx',
  'src/presentation/components/charts/MarketChart.tsx',
  'src/presentation/components/sections/FeaturedProductsSection.tsx',
  'src/app/[locale]/products/[id]/page.tsx',
  'src/app/[locale]/products/instant/page.tsx',
  'src/presentation/components/ui/dialog.tsx',
  'src/app/[locale]/careers/page.tsx',
  'src/app/[locale]/products/compare/page.tsx',
  'src/presentation/components/sections/TestimonialsSection.tsx',
  'src/components/layout/dashboard-layout.tsx',
  'src/components/features/products/ProductComparison.tsx',
  'src/presentation/components/multimedia/ImageGallery.tsx',
  'src/app/[locale]/market-info/page.tsx',
  'src/presentation/components/sections/HeroSection.tsx',
  'src/app/[locale]/dashboard/products/page.tsx',
  'src/components/clusters/ClusterServiceCard.tsx',
  'src/components/layout/page-header.tsx',
  'src/components/features/admin/ProductImageUpload.tsx',
  'src/app/[locale]/about/page.tsx',
  'src/app/[locale]/dashboard/documents/page.tsx',
  'src/shared/components/pdf/pdf-download-button.tsx',
  'src/app/[locale]/dashboard/messages/page.tsx',
  'src/app/[locale]/blog/page.tsx',
  'src/presentation/components/ui/hydration-safe-navigation.tsx',
  'src/presentation/components/sections/ValuePropositionSection.tsx',
  'src/presentation/components/cms/ContentEditor.tsx',
  'src/presentation/components/search/SearchInput.tsx',
  'src/app/[locale]/services/logistics/page.tsx',
  'src/shared/components/design-system/Coffee/AdvancedProductComparison.tsx',
  'src/presentation/components/ui/checkbox.tsx',
  'src/presentation/components/layout/Footer.tsx',
  'src/presentation/components/sections/OurProcessSection.tsx',
  'src/app/[locale]/services/oem/page.tsx',
  'src/components/clusters/ClusterProductCard.tsx',
  'src/components/features/admin/PricingManager.tsx',
  'src/app/[locale]/products/robusta/page.tsx',
  'src/presentation/components/catalog/ProductComparison.tsx',
  'src/app/[locale]/rfq/[id]/page.tsx',
  'src/components/clusters/ClusterArticleCard.tsx',
  'src/app/[locale]/privacy/page.tsx',
  'src/app/[locale]/quote/page.tsx',
  'src/presentation/components/ui/select.tsx',
  'src/presentation/components/cms/ContentFilters.tsx',
  'src/presentation/components/ui/dropdown-menu.tsx',
  'src/app/[locale]/page.tsx',
  'src/app/[locale]/dashboard/logistics/page.tsx',
  'src/app/[locale]/products/page.tsx',
  'src/components/charts/DynamicCharts.tsx',
  'src/presentation/components/catalog/ProductFilters.tsx',
  'src/presentation/components/search/SearchResults.tsx',
  'src/presentation/components/ui/calendar.tsx',
  'src/shared/components/seo/SEODashboard.tsx',
  'src/presentation/components/multimedia/MediaCarousel.tsx',
  'src/presentation/components/features/MarketInfo.tsx',
  'src/components/ui/LogisticsCostEstimator.tsx',
  'src/components/charts/ClimateImpactChart.tsx',
  'src/presentation/components/layout/Header.tsx',
  'src/presentation/components/cms/ContentSearch.tsx',
  'src/shared/components/design-system/Coffee/EnhancedRelatedProducts.tsx',
  'src/app/[locale]/services/page.tsx',
  'src/presentation/components/cms/ContentValidator.tsx'
];

console.log('Analyzing icon usage...\n');

// Check each file
filesToCheck.forEach(file => {
  extractIconsFromFile(path.join(__dirname, file));
});

// Read current icons.ts to see what's exported
const iconsFile = path.join(__dirname, 'src/components/ui/icons.ts');
const iconsContent = fs.readFileSync(iconsFile, 'utf8');
const exportedIcons = new Set();

const exportRegex = /export\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/g;
let match;
while ((match = exportRegex.exec(iconsContent)) !== null) {
  const icons = match[1].split(',').map(icon => icon.trim());
  icons.forEach(icon => exportedIcons.add(icon));
}

// Also check for individual exports
const individualExportRegex = /export\s*{\s*([^}]+)\s*}\s*from\s*['"]lucide-react['"]/g;

console.log('=== ICON USAGE ANALYSIS ===\n');
console.log(`Total icons currently exported: ${exportedIcons.size}`);
console.log(`Total icons actually used: ${iconImports.size}`);
console.log(`Potential savings: ${exportedIcons.size - iconImports.size} icons\n`);

console.log('=== ACTUALLY USED ICONS ===');
const usedIconsArray = Array.from(iconImports).sort();
usedIconsArray.forEach(icon => console.log(`- ${icon}`));

console.log('\n=== UNUSED ICONS ===');
const unusedIcons = Array.from(exportedIcons).filter(icon => !iconImports.has(icon));
unusedIcons.sort().forEach(icon => console.log(`- ${icon}`));

console.log(`\n=== SUMMARY ===`);
console.log(`Used icons: ${usedIconsArray.length}`);
console.log(`Unused icons: ${unusedIcons.length}`);
console.log(`Reduction potential: ${((unusedIcons.length / exportedIcons.size) * 100).toFixed(1)}%`);

// Generate optimized icons.ts content
console.log('\n=== OPTIMIZED ICONS.TS CONTENT ===');
console.log('// Optimized icons.ts - only exports actually used icons');
usedIconsArray.forEach(icon => {
  console.log(`export { ${icon} } from 'lucide-react';`);
});
console.log('\nexport type { LucideIcon } from \'lucide-react\';');