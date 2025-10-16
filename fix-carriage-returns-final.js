const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixCarriageReturns() {
  console.log('🔧 Fixing carriage returns in MDX files...');
  
  // Find all MDX files
  const mdxFiles = glob.sync('content/**/*.mdx', { cwd: process.cwd() });
  
  let fixedCount = 0;
  
  mdxFiles.forEach(filePath => {
    const fullPath = path.resolve(filePath);
    
    try {
      // Read file content
      let content = fs.readFileSync(fullPath, 'utf8');
      const originalContent = content;
      
      // Remove carriage returns
      content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
      
      // Only write if content changed
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✅ Fixed: ${filePath}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Fixed carriage returns in ${fixedCount} files`);
}

fixCarriageReturns();