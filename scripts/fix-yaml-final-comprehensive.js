const fs = require('fs');
const path = require('path');

function fixYamlIssues(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;
  
  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');
  
  // Fix long strings that break across lines by using proper YAML multiline syntax
  frontmatter = frontmatter.replace(
    /^(\s*)(title|description|excerpt|seoDescription|authorBio):\s*'([^']*(?:\n[^']*)*)'$/gm,
    (match, indent, key, value) => {
      // If the value contains newlines or is very long, use block scalar
      const cleanValue = value.replace(/\n\s*/g, ' ').trim();
      if (cleanValue.length > 100 || value.includes('\n')) {
        return `${indent}${key}: >\n${indent}  ${cleanValue}`;
      }
      return `${indent}${key}: '${cleanValue}'`;
    }
  );
  
  // Fix pricing objects - convert "pricing: startingPrice: 2500" to proper YAML object
  frontmatter = frontmatter.replace(
    /^(\s*)pricing:\s*(\w+):\s*(\d+)$/gm,
    '$1pricing:\n$1  $2: $3'
  );
  
  // Fix any remaining object syntax issues
  frontmatter = frontmatter.replace(
    /^(\s*)(\w+):\s*(\w+):\s*(.+)$/gm,
    (match, indent, key, subkey, value) => {
      if (key === 'pricing' || key === 'results' || key === 'testimonial' || key === 'heroSection' || key === 'featuresSection') {
        return `${indent}${key}:\n${indent}  ${subkey}: ${value}`;
      }
      return match;
    }
  );
  
  // Fix titles with special characters by ensuring proper quoting
  frontmatter = frontmatter.replace(
    /^(\s*)title:\s*'([^']*:[^']*)'$/gm,
    (match, indent, title) => {
      // Use double quotes for titles with colons
      return `${indent}title: "${title}"`;
    }
  );
  
  // Fix any unescaped quotes in strings
  frontmatter = frontmatter.replace(
    /^(\s*)(\w+):\s*'([^']*'[^']*)'$/gm,
    (match, indent, key, value) => {
      // Use double quotes if the value contains single quotes
      return `${indent}${key}: "${value}"`;
    }
  );
  
  // Clean up any remaining formatting issues
  frontmatter = frontmatter
    // Remove carriage returns
    .replace(/\r/g, '')
    // Fix spacing around colons
    .replace(/:\s+/g, ': ')
    // Remove trailing spaces
    .replace(/\s+$/gm, '')
    // Ensure consistent indentation for arrays
    .replace(/^(\s*)  -\s*/gm, '$1  - ');
  
  return `---\n${frontmatter}\n---${body}`;
}

function processDirectory(dirPath) {
  let fixedCount = 0;
  
  function processFile(filePath) {
    if (path.extname(filePath) === '.mdx') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = fixYamlIssues(content);
        
        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
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
console.log('Applying comprehensive YAML fixes...');

const fixedCount = processDirectory(contentDir);
console.log(`\nComprehensive YAML fix complete! Fixed ${fixedCount} files.`);