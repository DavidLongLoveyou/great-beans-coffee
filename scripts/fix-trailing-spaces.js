const fs = require('fs');
const path = require('path');

function removeTrailingSpaces(content) {
  // Remove trailing spaces from each line
  return content.split('\n').map(line => line.trimEnd()).join('\n');
}

function processDirectory(dirPath) {
  let fixedCount = 0;
  
  function processFile(filePath) {
    if (path.extname(filePath) === '.mdx') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = removeTrailingSpaces(content);
        
        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(`Removed trailing spaces in: ${path.relative(process.cwd(), filePath)}`);
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
console.log('Removing trailing spaces from all MDX files...');

const fixedCount = processDirectory(contentDir);
console.log(`\nTrailing spaces cleanup complete! Fixed ${fixedCount} files.`);