const fs = require('fs');
const path = require('path');

// Remaining missing documents from the latest check
const remainingDocuments = [
  '/documents/rob-g1-nat-001-phytosanitary.pdf',
  '/documents/rob-g1-nat-001-origin.pdf',
  '/documents/rob-g1-nat-001-cupping.pdf',
  '/documents/rob-g1-wash-002-spec.pdf',
  '/documents/ara-spec-001-spec.pdf',
  '/documents/ara-spec-001-cupping.pdf',
  '/documents/ara-spec-001-coa.pdf',
  '/documents/ara-spec-001-quality-cert.pdf',
  '/documents/ara-spec-001-origin-story.pdf',
  '/documents/inst-prem-001-spec.pdf',
  '/documents/rob-g2-nat-003-spec.pdf',
  '/documents/oem-manufacturing-brochure.pdf',
  '/documents/oem-manufacturing-specs.pdf',
  '/documents/private-label-brochure.pdf',
  '/documents/coffee-sourcing-brochure.pdf'
];

console.log('📁 Creating remaining product-specific documents...\n');

// Function to create a more detailed placeholder PDF content
function createDetailedPlaceholderPDF(filename) {
  const docType = getDocumentType(filename);
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
/F2 6 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 250
>>
stream
BT
/F1 16 Tf
50 750 Td
(${docType.title}) Tj
0 -30 Td
/F2 12 Tf
(Document: ${path.basename(filename)}) Tj
0 -20 Td
(Status: ${docType.status}) Tj
0 -20 Td
(Category: ${docType.category}) Tj
0 -40 Td
(${docType.description}) Tj
0 -20 Td
(This is a placeholder document.) Tj
0 -20 Td
(Content will be updated with actual data.) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica-Bold
>>
endobj

6 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 7
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000274 00000 n 
0000000574 00000 n 
0000000634 00000 n 
trailer
<<
/Size 7
/Root 1 0 R
>>
startxref
691
%%EOF`;
}

// Function to determine document type and metadata
function getDocumentType(filename) {
  const name = path.basename(filename, '.pdf');
  
  if (name.includes('phytosanitary')) {
    return {
      title: 'Phytosanitary Certificate',
      status: 'Template',
      category: 'Export Documentation',
      description: 'Official plant health certificate for coffee exports.'
    };
  } else if (name.includes('origin')) {
    return {
      title: 'Certificate of Origin',
      status: 'Template',
      category: 'Export Documentation',
      description: 'Official document certifying coffee origin country.'
    };
  } else if (name.includes('cupping')) {
    return {
      title: 'Cupping Notes & Evaluation',
      status: 'Sample',
      category: 'Quality Assessment',
      description: 'Professional coffee cupping scores and tasting notes.'
    };
  } else if (name.includes('spec')) {
    return {
      title: 'Product Specifications',
      status: 'Template',
      category: 'Technical Documentation',
      description: 'Detailed technical specifications and quality parameters.'
    };
  } else if (name.includes('coa')) {
    return {
      title: 'Certificate of Analysis',
      status: 'Template',
      category: 'Quality Documentation',
      description: 'Laboratory analysis results and quality metrics.'
    };
  } else if (name.includes('quality-cert')) {
    return {
      title: 'Quality Certification',
      status: 'Template',
      category: 'Quality Documentation',
      description: 'Third-party quality certification documents.'
    };
  } else if (name.includes('origin-story')) {
    return {
      title: 'Origin Story & Farm Profile',
      status: 'Sample',
      category: 'Marketing Materials',
      description: 'Detailed story about coffee origin and farming practices.'
    };
  } else if (name.includes('manufacturing')) {
    return {
      title: 'OEM Manufacturing Information',
      status: 'Current',
      category: 'Service Documentation',
      description: 'Custom manufacturing capabilities and processes.'
    };
  } else if (name.includes('private-label')) {
    return {
      title: 'Private Label Services',
      status: 'Current',
      category: 'Service Documentation',
      description: 'Private labeling options and customization services.'
    };
  } else if (name.includes('sourcing')) {
    return {
      title: 'Coffee Sourcing Services',
      status: 'Current',
      category: 'Service Documentation',
      description: 'Direct sourcing and procurement services overview.'
    };
  } else {
    return {
      title: 'Product Documentation',
      status: 'Placeholder',
      category: 'General',
      description: 'Product-related documentation and specifications.'
    };
  }
}

let createdCount = 0;
let skippedCount = 0;

// Create each remaining document
for (const docPath of remainingDocuments) {
  const fullPath = path.join('public', docPath);
  const dir = path.dirname(fullPath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Skip if file already exists
  if (fs.existsSync(fullPath)) {
    skippedCount++;
    console.log(`⏭️  Skipped (exists): ${docPath}`);
    continue;
  }
  
  try {
    // Create detailed placeholder PDF
    fs.writeFileSync(fullPath, createDetailedPlaceholderPDF(docPath));
    createdCount++;
    console.log(`✅ Created: ${docPath}`);
  } catch (error) {
    console.log(`❌ Failed to create ${docPath}: ${error.message}`);
  }
}

// Update the main README with new document categories
const readmePath = path.join('public', 'documents', 'README.md');
const updatedReadmeContent = `# Documents Directory

This directory contains various business documents and resources for Great Beans Coffee.

## Document Categories

### Export Documentation
- Phytosanitary certificates
- Certificates of origin
- Export licenses
- Compliance documentation

### Quality Documentation
- Certificates of analysis (COA)
- Quality certifications
- Cupping notes and evaluations
- Technical specifications

### Product Documentation
- Product specifications by SKU
- Quality standards
- Processing methods
- Roasting profiles

### Service Documentation
- OEM manufacturing capabilities
- Private label services
- Coffee sourcing services
- Logistics and shipping

### Business Documents
- Sustainability reports
- Market insights
- Partnership opportunities
- Trade finance options

### RFQ Documents
- Request for Quote documentation
- Quality specifications
- Brand guidelines
- Market research

## Product-Specific Documents

### Robusta Coffee (ROB-G1-NAT-001)
- Phytosanitary certificate
- Certificate of origin
- Cupping notes

### Arabica Specialty (ARA-SPEC-001)
- Product specifications
- Cupping evaluation
- Certificate of analysis
- Quality certification
- Origin story

### Instant Premium (INST-PREM-001)
- Technical specifications

### Robusta Grade 2 (ROB-G2-NAT-003)
- Product specifications

## Note
Some documents are currently placeholders and will be replaced with actual content as it becomes available.

Last updated: ${new Date().toISOString()}
Total documents: ${fs.readdirSync(path.join('public', 'documents')).length - 1} (excluding README)
`;

fs.writeFileSync(readmePath, updatedReadmeContent);

console.log('\n📊 SUMMARY:');
console.log(`   Documents created: ${createdCount}`);
console.log(`   Documents skipped (already exist): ${skippedCount}`);
console.log(`   Total processed: ${remainingDocuments.length}`);

console.log('\n✨ Product document creation completed!');
console.log('\n💡 Document organization:');
console.log('   📋 Export Documentation: Certificates and compliance');
console.log('   🔬 Quality Documentation: Analysis and certifications');
console.log('   📦 Product Documentation: Specifications by SKU');
console.log('   🏭 Service Documentation: Manufacturing and sourcing');
console.log('   📈 Business Documents: Reports and opportunities');