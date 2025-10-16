const fs = require('fs');
const path = require('path');

// List of missing document paths from the link checker
const missingDocuments = [
  '/documents/sustainability-report-2024.pdf',
  '/documents/quality-certifications.pdf',
  '/documents/export-documentation.pdf',
  '/documents/product-catalog-2024.pdf',
  '/documents/pricing-guide.pdf',
  '/documents/shipping-terms.pdf',
  '/documents/quality-standards.pdf',
  '/documents/certifications-overview.pdf',
  '/documents/sustainability-practices.pdf',
  '/documents/origin-profiles.pdf',
  '/documents/processing-methods.pdf',
  '/documents/cupping-notes.pdf',
  '/documents/harvest-calendar.pdf',
  '/documents/logistics-overview.pdf',
  '/documents/packaging-options.pdf',
  '/documents/custom-blending-guide.pdf',
  '/documents/private-label-services.pdf',
  '/documents/market-insights-2024.pdf',
  '/documents/trade-finance-options.pdf',
  '/documents/sample-request-form.pdf',
  '/documents/partnership-opportunities.pdf',
  '/documents/technical-specifications.pdf',
  '/documents/compliance-documentation.pdf',
  '/documents/roasting-profiles.pdf',
  '/documents/storage-handling-guide.pdf',
  '/documents/traceability-documentation.pdf',
  '/documents/fair-trade-certification.pdf',
  '/documents/organic-certification.pdf',
  '/documents/rainforest-alliance-certification.pdf',
  '/documents/export-license.pdf',
  '/documents/phytosanitary-certificate.pdf',
  '/documents/certificate-of-origin.pdf',
  '/documents/logistics-shipping-brochure.pdf',
  '/documents/rfq-001/quality-specifications.pdf',
  '/documents/rfq-001/packaging-requirements.pdf',
  '/documents/rfq-002/brand-guidelines.pdf',
  '/documents/rfq-002/product-specifications.xlsx',
  '/documents/rfq-002/market-research.pdf',
  '/documents/rfq-003/quality-requirements-ja.pdf',
  '/documents/rfq-003/import-regulations.pdf',
  '/documents/rfq-004/company-profile.pdf',
  '/documents/rfq-004/market-entry-objectives.pdf',
  '/documents/rfq-005/flavor-profile-requirements.pdf',
  '/documents/rfq-005/cafe-brand-guidelines.pdf'
];

console.log('📁 Creating missing document structure...\n');

// Create base documents directory
const documentsDir = path.join('public', 'documents');
if (!fs.existsSync(documentsDir)) {
  fs.mkdirSync(documentsDir, { recursive: true });
  console.log('✅ Created documents directory');
}

// Function to create a placeholder PDF content
function createPlaceholderPDF() {
  return `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 100
>>
stream
BT
/F1 12 Tf
50 750 Td
(Document placeholder - Content coming soon) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000424 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
521
%%EOF`;
}

// Function to create a placeholder Excel content
function createPlaceholderExcel() {
  return `PK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x13\x00\x00\x00[Content_Types].xmlPK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x0b\x00\x00\x00_rels/.relsPK\x03\x04\x14\x00\x00\x00\x08\x00\x00\x00!\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x10\x00\x00\x00xl/workbook.xmlPK\x05\x06\x00\x00\x00\x00\x03\x00\x03\x00\x9f\x00\x00\x00\x00\x00\x00\x00\x00\x00`;
}

let createdCount = 0;
let skippedCount = 0;

// Create each missing document
for (const docPath of missingDocuments) {
  const fullPath = path.join('public', docPath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Skip if file already exists
  if (fs.existsSync(fullPath)) {
    skippedCount++;
    continue;
  }
  
  try {
    // Create appropriate placeholder content based on file extension
    if (docPath.endsWith('.pdf')) {
      fs.writeFileSync(fullPath, createPlaceholderPDF());
    } else if (docPath.endsWith('.xlsx')) {
      fs.writeFileSync(fullPath, createPlaceholderExcel(), 'binary');
    } else {
      // Default text content
      fs.writeFileSync(fullPath, 'Document placeholder - Content coming soon');
    }
    
    createdCount++;
    console.log(`✅ Created: ${docPath}`);
  } catch (error) {
    console.log(`❌ Failed to create ${docPath}: ${error.message}`);
  }
}

// Create a README file in the documents directory
const readmePath = path.join(documentsDir, 'README.md');
if (!fs.existsSync(readmePath)) {
  const readmeContent = `# Documents Directory

This directory contains various business documents and resources for Great Beans Coffee.

## Document Categories

### Business Documents
- Sustainability reports
- Quality certifications
- Export documentation
- Product catalogs

### Technical Documents
- Quality standards
- Processing methods
- Roasting profiles
- Technical specifications

### RFQ Documents
- Request for Quote documentation
- Quality specifications
- Brand guidelines
- Market research

## Note
Some documents are currently placeholders and will be replaced with actual content as it becomes available.

Generated on: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(readmePath, readmeContent);
  console.log('✅ Created README.md');
}

console.log('\n📊 SUMMARY:');
console.log(`   Documents created: ${createdCount}`);
console.log(`   Documents skipped (already exist): ${skippedCount}`);
console.log(`   Total processed: ${missingDocuments.length}`);

console.log('\n✨ Document structure creation completed!');
console.log('\n💡 Next steps:');
console.log('   1. Replace placeholder PDFs with actual documents');
console.log('   2. Update Excel files with real data');
console.log('   3. Review and organize document categories');
console.log('   4. Consider implementing document access controls');