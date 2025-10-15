const fs = require('fs');
const path = require('path');

// Files with specific issues mentioned in the build error
const problematicFiles = [
  'content/blog/en/vietnam-coffee-export-trends-2024.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx'
];

function fixSpecificFiles() {
  console.log('Fixing specific YAML issues...');
  
  problematicFiles.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let modified = false;
      
      // Fix tableOfContents issue - ensure it's a boolean, not a string
      if (content.includes('tableOfContents: true\r')) {
        content = content.replace(/tableOfContents: true\r/g, 'tableOfContents: true');
        modified = true;
        console.log(`Fixed tableOfContents carriage return in ${filePath}`);
      }
      
      // Fix equipmentLines issue - ensure it's a number, not a string
      if (content.includes('equipmentLines: "8\r"')) {
        content = content.replace(/equipmentLines: "8\r"/g, 'equipmentLines: 8');
        modified = true;
        console.log(`Fixed equipmentLines carriage return in ${filePath}`);
      }
      
      // General carriage return cleanup in YAML frontmatter
      const frontmatterMatch = content.match(/^(---\n[\s\S]*?\n---\n)([\s\S]*)$/);
      if (frontmatterMatch) {
        let [, frontmatter, body] = frontmatterMatch;
        const originalFrontmatter = frontmatter;
        
        // Remove all carriage returns from frontmatter
        frontmatter = frontmatter.replace(/\r/g, '');
        
        if (frontmatter !== originalFrontmatter) {
          content = frontmatter + body;
          modified = true;
          console.log(`Removed carriage returns from frontmatter in ${filePath}`);
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`✓ Fixed ${filePath}`);
      } else {
        console.log(`- No changes needed for ${filePath}`);
      }
      
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
}

// Run the fix
fixSpecificFiles();