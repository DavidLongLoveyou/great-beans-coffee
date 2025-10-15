const fs = require('fs');
const path = require('path');

function findTsxFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules'
      ) {
        traverse(fullPath);
      } else if (
        stat.isFile() &&
        (item.endsWith('.tsx') || item.endsWith('.ts'))
      ) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function fixParamsIssues(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Pattern 1: Fix function parameters with _params in destructuring
  // { _params, } -> { params, }
  const functionParamPattern = /\{\s*_params\s*,?\s*\}/g;
  if (functionParamPattern.test(content)) {
    newContent = newContent.replace(functionParamPattern, '{ params }');
    modified = true;
  }

  // Pattern 2: Fix standalone _params in function signatures
  // (_params) -> (params)
  const standaloneParamPattern = /\(\s*_params\s*\)/g;
  if (standaloneParamPattern.test(newContent)) {
    newContent = newContent.replace(standaloneParamPattern, '(params)');
    modified = true;
  }

  // Pattern 3: Fix _params in function parameter lists
  // function({ _params }: Props) -> function({ params }: Props)
  const functionSignaturePattern = /\{\s*_params\s*\}\s*:\s*\w+/g;
  if (functionSignaturePattern.test(newContent)) {
    newContent = newContent.replace(functionSignaturePattern, match => {
      return match.replace('_params', 'params');
    });
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  }

  return false;
}

function main() {
  const srcDir = path.join(__dirname, 'src');
  const files = findTsxFiles(srcDir);

  let fixedCount = 0;

  console.log(
    `Checking ${files.length} TypeScript files for _params issues...`
  );

  for (const file of files) {
    try {
      if (fixParamsIssues(file)) {
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed _params issues in ${fixedCount} files.`);
}

main();
