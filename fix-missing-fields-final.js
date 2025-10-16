const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const filesToFix = [
  'content/services/de/private-label-kaffee-loesungen.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx', 
  'content/services/en/private-label-coffee-solutions.mdx'
];

function addMissingFields(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      console.log(`❌ No frontmatter found in ${filePath}`);
      return false;
    }

    const frontmatterContent = frontmatterMatch[1];
    const restContent = content.substring(frontmatterMatch[0].length);
    
    let frontmatter;
    try {
      frontmatter = yaml.load(frontmatterContent);
    } catch (e) {
      console.log(`❌ YAML parse error in ${filePath}: ${e.message}`);
      return false;
    }

    let hasChanges = false;

    // Add missing fields based on file
    if (!frontmatter.description) {
      if (filePath.includes('private-label-kaffee-loesungen')) {
        frontmatter.description = "Umfassende Private-Label-Kaffee-Lösungen von der Beschaffung bis zur Verpackung. Bauen Sie Ihre Kaffeemarke mit vietnamesischer Spezialitätenkaffee-Expertise auf.";
      } else if (filePath.includes('oem-coffee-manufacturing')) {
        frontmatter.description = "Professional OEM coffee manufacturing services for businesses. Custom roasting, packaging, and quality control for your coffee brand requirements.";
      } else if (filePath.includes('private-label-coffee-solutions')) {
        frontmatter.description = "Complete private label coffee services from sourcing to packaging. Build your coffee brand with Vietnamese specialty coffee expertise.";
      }
      hasChanges = true;
    }

    if (!frontmatter.publishedAt) {
      frontmatter.publishedAt = "2024-01-05";
      hasChanges = true;
    }

    if (!frontmatter.author) {
      frontmatter.author = "The Great Beans Team";
      hasChanges = true;
    }

    if (!frontmatter.category) {
      frontmatter.category = "BUSINESS_SERVICE";
      hasChanges = true;
    }

    if (!frontmatter.locale) {
      if (filePath.includes('/de/')) {
        frontmatter.locale = "de";
      } else if (filePath.includes('/en/')) {
        frontmatter.locale = "en";
      } else if (filePath.includes('/ja/')) {
        frontmatter.locale = "ja";
      }
      hasChanges = true;
    }

    if (hasChanges) {
      const newFrontmatter = yaml.dump(frontmatter, { 
        indent: 2,
        lineWidth: -1,
        quotingType: '"'
      });
      
      const newContent = `---\n${newFrontmatter}---${restContent}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed missing fields in ${filePath}`);
      return true;
    } else {
      console.log(`ℹ️  No missing fields in ${filePath}`);
      return false;
    }

  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

console.log('🔧 Fixing missing required fields...\n');

let fixedCount = 0;
filesToFix.forEach(file => {
  if (addMissingFields(file)) {
    fixedCount++;
  }
});

console.log(`\n✨ Fixed ${fixedCount} files with missing fields`);