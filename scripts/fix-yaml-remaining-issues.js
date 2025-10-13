const fs = require('fs');
const path = require('path');

function fixRemainingYamlIssues(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;

  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');

  // Fix long description strings by using proper YAML multiline syntax
  frontmatter = frontmatter.replace(
    /^(\s*)(seoDescription|description|excerpt):\s*'([^']*…[^']*)'$/gm,
    (match, indent, key, value) => {
      // Remove the ellipsis and use proper YAML block scalar
      const cleanValue = value.replace(/…$/, '').trim();
      return `${indent}${key}: |\n${indent}  ${cleanValue}`;
    }
  );

  // Fix pricing object syntax
  frontmatter = frontmatter.replace(
    /^(\s*)pricing:\s*startingPrice:\s*(.+)$/gm,
    (match, indent, price) => {
      return `${indent}pricing:\n${indent}  startingPrice: ${price}`;
    }
  );

  // Fix any remaining long single-quoted strings that might cause issues
  frontmatter = frontmatter.replace(
    /^(\s*)(\w+):\s*'([^']{80,})'$/gm,
    (match, indent, key, value) => {
      // Use YAML block scalar for very long strings
      return `${indent}${key}: |\n${indent}  ${value}`;
    }
  );

  return `---\n${frontmatter}\n---${body}`;
}

function processDirectory(dirPath) {
  let fixedCount = 0;

  function processFile(filePath) {
    if (path.extname(filePath) === '.mdx') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = fixRemainingYamlIssues(content);

        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(
            `Fixed remaining issues in: ${path.relative(process.cwd(), filePath)}`
          );
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
console.log(
  'Fixing remaining YAML issues (long strings and pricing objects)...'
);

const fixedCount = processDirectory(contentDir);
console.log(`\nRemaining issues fix complete! Fixed ${fixedCount} files.`);
