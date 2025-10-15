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

function fixParamsReferences(content) {
  let modified = false;

  // Fix _params references in function bodies
  const patterns = [
    // Pattern: use(_params) -> use(params)
    {
      regex: /use\(\s*_params\s*\)/g,
      replacement: 'use(params)',
    },
    // Pattern: await _params -> await params
    {
      regex: /await\s+_params/g,
      replacement: 'await params',
    },
    // Pattern: const { ... } = _params -> const { ... } = params
    {
      regex: /const\s*\{\s*[^}]+\}\s*=\s*_params/g,
      replacement: match => match.replace('_params', 'params'),
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
    const { content: newContent, modified } = fixParamsReferences(content);

    if (modified) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`Fixed _params references in: ${filePath}`);
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

console.log(`\nFixed _params references in ${fixedCount} files.`);
