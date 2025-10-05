const fs = require('fs');
const path = require('path');

function fixYamlInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove carriage returns that cause YAML parsing issues
    if (content.includes('\r')) {
      content = content.replace(/\r/g, '');
      modified = true;
    }
    
    // Fix array syntax issues - ensure proper spacing and formatting
    // Fix arrays that might have syntax issues
    content = content.replace(/\[\s*\n\s*([^[\]]+)\s*\n\s*\]/g, (match, items) => {
      const cleanItems = items.split(',').map(item => item.trim().replace(/^['"]|['"]$/g, '')).filter(item => item);
      return `[${cleanItems.map(item => `'${item}'`).join(', ')}]`;
    });
    
    // Fix multi-line arrays
    content = content.replace(/(\w+):\s*\[\s*\n([\s\S]*?)\n\s*\]/g, (match, key, items) => {
      const lines = items.split('\n').map(line => line.trim()).filter(line => line && !line.startsWith('#'));
      const cleanItems = [];
      
      for (const line of lines) {
        const cleaned = line.replace(/^['"]|['"]$|,$/, '').trim();
        if (cleaned && cleaned !== '') {
          cleanItems.push(cleaned);
        }
      }
      
      if (cleanItems.length === 0) {
        return `${key}: []`;
      }
      
      return `${key}: [${cleanItems.map(item => `'${item}'`).join(', ')}]`;
    });
    
    // Fix boolean values that might have extra characters
    content = content.replace(/^(\s*\w+):\s*true\s*[\r\n]*$/gm, '$1: true');
    content = content.replace(/^(\s*\w+):\s*false\s*[\r\n]*$/gm, '$1: false');
    
    // Fix number values that might have extra characters
    content = content.replace(/^(\s*\w+):\s*(\d+)\s*[\r\n]*$/gm, '$1: $2');
    
    // Fix string values that might have extra characters
    content = content.replace(/^(\s*\w+):\s*'([^']+)'\s*[\r\n]*$/gm, "$1: '$2'");
    
    if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed YAML in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error fixing YAML in ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalFixed = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      totalFixed += walkDirectory(filePath);
    } else if (file.endsWith('.mdx')) {
      if (fixYamlInFile(filePath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

// Fix all MDX files in content directory
const contentDir = path.join(__dirname, '..', 'content');
console.log('Fixing YAML issues in MDX files...');
const fixedCount = walkDirectory(contentDir);
console.log(`Fixed YAML issues in ${fixedCount} files.`);
console.log('Done!');