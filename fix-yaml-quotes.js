const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix YAML quotes in a file
function fixYamlQuotes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix quoted array values in YAML frontmatter
    // Pattern: - 'value' -> - value
    const quotedArrayPattern = /^(\s*-\s*)'([^']+)'$/gm;
    if (quotedArrayPattern.test(content)) {
      content = content.replace(quotedArrayPattern, '$1$2');
      modified = true;
    }

    // Fix quoted values in square bracket arrays
    // Pattern: ['value', 'value2'] -> [value, value2]
    const squareBracketPattern = /\[\s*'([^']+)'(?:\s*,\s*'([^']+)')*\s*\]/g;
    if (squareBracketPattern.test(content)) {
      content = content.replace(squareBracketPattern, (match) => {
        return match.replace(/'([^']+)'/g, '$1');
      });
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed: ${filePath}`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Find all MDX files in content directory
const contentDir = path.join(__dirname, 'content');
const mdxFiles = glob.sync('**/*.mdx', { cwd: contentDir });

let fixedCount = 0;
let totalFiles = mdxFiles.length;

console.log(`Processing ${totalFiles} MDX files...`);

mdxFiles.forEach(file => {
  const fullPath = path.join(contentDir, file);
  if (fixYamlQuotes(fullPath)) {
    fixedCount++;
  }
});

console.log(`\nCompleted! Fixed ${fixedCount} out of ${totalFiles} files.`);