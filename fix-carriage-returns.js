const fs = require('fs');
const path = require('path');

// Files that have carriage return issues
const filesToFix = [
  'content/blog/en/test-article.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx'
];

function fixCarriageReturns(filePath) {
  try {
    const fullPath = path.join(__dirname, filePath);
    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Remove carriage returns
    const fixedContent = content.replace(/\r/g, '');
    
    // Write back the fixed content
    fs.writeFileSync(fullPath, fixedContent, 'utf8');
    console.log(`✅ Fixed carriage returns in: ${filePath}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing carriage return issues in MDX files...\n');
  
  let fixedCount = 0;
  
  for (const filePath of filesToFix) {
    if (fixCarriageReturns(filePath)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✨ Fixed carriage returns in ${fixedCount}/${filesToFix.length} files`);
}

main();