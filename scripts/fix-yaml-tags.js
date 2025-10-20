const fs = require('fs');
const path = require('path');

function fixYamlTags(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix tags format: tags: - 'value' -> tags:\n  - 'value'
    content = content.replace(
      /^(\s*tags:\s*)-\s*'([^']+)'$/gm,
      (match, prefix, tag) => {
        modified = true;
        return `${prefix.trim()}:\n  - '${tag}'`;
      }
    );

    // Fix keywords format: keywords: - 'value' -> keywords:\n  - 'value'
    content = content.replace(
      /^(\s*keywords:\s*)-\s*'([^']+)'$/gm,
      (match, prefix, keyword) => {
        modified = true;
        return `${prefix.trim()}:\n  - '${keyword}'`;
      }
    );

    // Fix publishedAt format with spaces
    content = content.replace(
      /publishedAt:\s*"([^"]*:\s*[^"]*:\s*[^"]*)"/g,
      (match, dateStr) => {
        modified = true;
        const cleanDate = dateStr.replace(/:\s+/g, ':');
        return `publishedAt: "${cleanDate}"`;
      }
    );

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

function processDirectory(dirPath) {
  let fixedCount = 0;

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else if (item.endsWith('.mdx')) {
        if (fixYamlTags(fullPath)) {
          fixedCount++;
        }
      }
    }
  }

  walkDir(dirPath);
  return fixedCount;
}

// Process content directory
const contentDir = path.join(__dirname, '..', 'content');
const fixedCount = processDirectory(contentDir);

console.log(`\nFixed ${fixedCount} files with YAML tag formatting issues.`);
