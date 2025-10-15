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

function fixDoubleUnderscoreParams(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Pattern 1: Fix function parameters with __params in destructuring
  // { __params, } -> { params, }
  const functionParamPattern = /\{\s*__params\s*,?\s*\}/g;
  if (functionParamPattern.test(content)) {
    newContent = newContent.replace(functionParamPattern, '{ params }');
    modified = true;
  }

  // Pattern 2: Fix standalone __params in function signatures
  // (__params) -> (params)
  const standaloneParamPattern = /\(\s*__params\s*\)/g;
  if (standaloneParamPattern.test(newContent)) {
    newContent = newContent.replace(standaloneParamPattern, '(params)');
    modified = true;
  }

  // Pattern 3: Fix __params in function parameter lists
  // function({ __params }: Props) -> function({ params }: Props)
  const functionSignaturePattern = /\{\s*__params\s*\}\s*:\s*\w+/g;
  if (functionSignaturePattern.test(newContent)) {
    newContent = newContent.replace(functionSignaturePattern, match => {
      return match.replace('__params', 'params');
    });
    modified = true;
  }

  // Pattern 4: Fix __params in multiline function signatures
  const multilinePattern = /\{\s*\n\s*__params\s*,?\s*\n\s*\}/g;
  if (multilinePattern.test(newContent)) {
    newContent = newContent.replace(multilinePattern, '{\n  params,\n}');
    modified = true;
  }

  // Pattern 5: Fix __params in single line with other parameters
  const mixedParamsPattern = /__params\s*,/g;
  if (mixedParamsPattern.test(newContent)) {
    newContent = newContent.replace(mixedParamsPattern, 'params,');
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
    `Checking ${files.length} TypeScript files for __params issues...`
  );

  for (const file of files) {
    try {
      if (fixDoubleUnderscoreParams(file)) {
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed __params issues in ${fixedCount} files.`);
}

main();
