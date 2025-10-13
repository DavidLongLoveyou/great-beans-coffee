const fs = require('fs');
const path = require('path');

function cleanYamlFrontmatter(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;

  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');

  // Clean up frontmatter
  frontmatter = frontmatter
    // Remove carriage returns
    .replace(/\r/g, '')
    // Fix any double quotes that might be causing issues
    .replace(/"/g, "'")
    // Ensure proper spacing after colons
    .replace(/:\s*'/g, ": '")
    .replace(/:\s*([^'\s])/g, ': $1')
    // Clean up any malformed boolean values
    .replace(/:\s*true\s*$/gm, ': true')
    .replace(/:\s*false\s*$/gm, ': false')
    // Clean up any trailing spaces
    .replace(/\s+$/gm, '')
    // Ensure proper array formatting (already done by previous script)
    // Remove any empty lines at the start/end of frontmatter
    .trim();

  return `---\n${frontmatter}\n---${body}`;
}

function processDirectory(dirPath) {
  let fixedCount = 0;

  function processFile(filePath) {
    if (path.extname(filePath) === '.mdx') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const cleanedContent = cleanYamlFrontmatter(content);

        if (content !== cleanedContent) {
          fs.writeFileSync(filePath, cleanedContent, 'utf8');
          console.log(`Fixed: ${path.relative(process.cwd(), filePath)}`);
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  function walkDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else {
        processFile(fullPath);
      }
    }
  }

  walkDirectory(dirPath);
  return fixedCount;
}

// Process content directory
const contentDir = path.join(process.cwd(), 'content');
console.log('Starting final YAML cleanup...');

const fixedCount = processDirectory(contentDir);
console.log(`\nFinal cleanup complete! Fixed ${fixedCount} files.`);
