const fs = require('fs');
const path = require('path');

function findTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        results = results.concat(findTsxFiles(filePath));
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });

  return results;
}

function fixParameterTypes(content) {
  let modified = false;

  // Fix type annotations where parameter is named 'params' but type says '_params'
  const patterns = [
    // Pattern: { params, }: { _params: Promise<...> }
    {
      regex:
        /(\{\s*params\s*,?\s*\}\s*:\s*\{\s*)_params(\s*:\s*Promise<[^}]+>\s*\})/g,
      replacement: '$1params$2',
    },
    // Pattern: ({ params }: { _params: Promise<...> })
    {
      regex:
        /(\(\s*\{\s*params\s*\}\s*:\s*\{\s*)_params(\s*:\s*Promise<[^}]+>\s*\}\s*\))/g,
      replacement: '$1params$2',
    },
  ];

  patterns.forEach(pattern => {
    const newContent = content.replace(pattern.regex, pattern.replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  return { content, modified };
}

function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { content: newContent, modified } = fixParameterTypes(content);

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed parameter types in: ${filePath}`);
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
const srcDir = path.join(__dirname, 'src');
const files = findTsxFiles(srcDir);

console.log(`Found ${files.length} TypeScript files to check...`);

let fixedCount = 0;
files.forEach(file => {
  if (processFile(file)) {
    fixedCount++;
  }
});

console.log(`\nFixed parameter type annotations in ${fixedCount} files.`);
