const fs = require('fs');
const path = require('path');

// Files that need fixing based on the error messages
const problematicFiles = [
  'content/blog/en/vietnam-coffee-export-trends-2024.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx',
];

function fixYamlFile(filePath) {
  try {
    const fullPath = path.join(__dirname, '..', filePath);
    let content = fs.readFileSync(fullPath, 'utf8');

    // Remove carriage returns (\r) that cause YAML parsing issues
    content = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Fix specific issues
    // Fix tableOfContents: ensure it's a proper boolean
    content = content.replace(
      /tableOfContents:\s*['"]?true['"]?\s*$/gm,
      'tableOfContents: true'
    );
    content = content.replace(
      /tableOfContents:\s*['"]?false['"]?\s*$/gm,
      'tableOfContents: false'
    );

    // Fix qualityLabs: ensure it's a proper number
    content = content.replace(
      /qualityLabs:\s*['"]?(\d+)['"]?\s*$/gm,
      'qualityLabs: $1'
    );

    // Fix equipmentLines: ensure it's a proper number
    content = content.replace(
      /equipmentLines:\s*['"]?(\d+)['"]?\s*$/gm,
      'equipmentLines: $1'
    );

    // Remove any trailing whitespace
    content = content.replace(/[ \t]+$/gm, '');

    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix the problematic files
problematicFiles.forEach(fixYamlFile);

console.log('YAML cleanup completed!');
