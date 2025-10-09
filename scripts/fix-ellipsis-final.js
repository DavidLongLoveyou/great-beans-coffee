const fs = require('fs');
const path = require('path');

function fixEllipsisIssues(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;
  
  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');
  
  // Remove ellipsis characters from YAML strings
  frontmatter = frontmatter.replace(/…/g, '');
  
  // Fix any strings that might have become too long or malformed
  frontmatter = frontmatter.replace(
    /^(\s*)(excerpt|seoDescription|description):\s*'([^']*)'$/gm,
    (match, indent, key, value) => {
      // Clean up the value and ensure it's properly formatted
      const cleanValue = value.trim();
      if (cleanValue.length > 150) {
        // Use block scalar for very long strings
        return `${indent}${key}: |\n${indent}  ${cleanValue}`;
      }
      return `${indent}${key}: '${cleanValue}'`;
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
        const fixedContent = fixEllipsisIssues(content);
        
        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`Fixed ellipsis in: ${path.relative(process.cwd(), filePath)}`);
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
console.log('Fixing ellipsis characters in YAML strings...');

const fixedCount = processDirectory(contentDir);
console.log(`\nEllipsis fix complete! Fixed ${fixedCount} files.`);