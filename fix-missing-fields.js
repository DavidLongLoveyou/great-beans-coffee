const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing frontmatter formatting in MDX files...\n');

// Files with formatting issues
const filesToFix = [
  'content/origin-stories/en/gia-lai-sustainable-robusta.mdx',
  'content/origin-stories/en/kon-tum-highland-arabica.mdx',
  'content/services/de/private-label-kaffee-loesungen.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx',
  'content/services/en/private-label-coffee-solutions.mdx'
];

function fixFrontmatter(filePath) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    
    // Split content into frontmatter and body
    const parts = content.split('---');
    if (parts.length < 3) {
      console.log(`❌ Invalid frontmatter format: ${filePath}`);
      return false;
    }

    let frontmatter = parts[1];
    const body = parts.slice(2).join('---');

    // Clean up frontmatter - remove extra spaces and fix formatting
    const lines = frontmatter.split('\n');
    const cleanedLines = [];
    
    for (let line of lines) {
      line = line.trim();
      if (line) {
        // Fix specific formatting issues
        if (line.includes('publishedAt:') && !line.includes("'")) {
          line = line.replace(/publishedAt:\s*(.+)/, "publishedAt: '$1'");
        }
        if (line.includes('author:') && !line.includes("'")) {
          line = line.replace(/author:\s*(.+)/, "author: '$1'");
        }
        if (line.includes('category:') && line.includes('ORIGIN_STORY')) {
          line = "category: 'Origin Stories'";
        }
        if (line.includes('category:') && line.includes('SERVICE')) {
          line = "category: 'Services'";
        }
        if (line.includes('coffeeVariety:') && line.includes('ROBUSTA')) {
          line = "coffeeVariety: 'Robusta'";
        }
        if (line.includes('coffeeVariety:') && line.includes('ARABICA')) {
          line = "coffeeVariety: 'Arabica'";
        }
        
        cleanedLines.push(line);
      }
    }

    // Add missing locale field based on file path
    const locale = filePath.includes('/en/') ? 'en' : 
                   filePath.includes('/de/') ? 'de' : 
                   filePath.includes('/ja/') ? 'ja' : 'en';
    
    if (!cleanedLines.some(line => line.includes('locale:'))) {
      cleanedLines.push(`locale: '${locale}'`);
    }

    const newFrontmatter = '\n' + cleanedLines.join('\n') + '\n';
    const newContent = `---${newFrontmatter}---${body}`;
    
    fs.writeFileSync(fullPath, newContent);
    console.log(`✅ Fixed frontmatter: ${filePath}`);
    return true;

  } catch (error) {
    console.log(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Process all files
let totalFixed = 0;
filesToFix.forEach(filePath => {
  if (fixFrontmatter(filePath)) {
    totalFixed++;
  }
});

console.log(`\n🎉 Process completed! Fixed ${totalFixed} files.`);
console.log('\n📋 Summary:');
console.log('- Fixed frontmatter formatting issues');
console.log('- Added missing locale fields');
console.log('- Standardized field values');
console.log('- Ready for clean Contentlayer validation');