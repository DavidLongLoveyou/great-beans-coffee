const fs = require('fs');
const path = require('path');

function fixEmptyStringsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Remove empty strings from arrays in YAML frontmatter
    // Pattern: '    '',\n' or '    '',]' or '    ''\n'
    content = content.replace(/^\s*'',?\s*$/gm, '');

    // Clean up any double commas that might result
    content = content.replace(/,\s*,/g, ',');

    // Clean up trailing commas before closing brackets
    content = content.replace(/,\s*\]/g, ']');

    // Clean up empty lines in arrays
    content = content.replace(/\[\s*\n\s*\]/g, '[]');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      fixEmptyStringsInFile(filePath);
    }
  }
}

// Fix all MDX files in content directory
const contentDir = path.join(__dirname, '..', 'content');
console.log('Fixing empty strings in MDX files...');
walkDirectory(contentDir);
console.log('Done!');
