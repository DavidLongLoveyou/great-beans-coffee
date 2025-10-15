const fs = require('fs');
const path = require('path');

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });

  return results;
}

function fixParamsNaming(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix route handlers: { _params: Promise<...> } back to { params: Promise<...> }
    const routeParamsPattern = /\{\s*_params:\s*Promise<[^>]+>\s*\}/g;
    if (routeParamsPattern.test(content)) {
      content = content.replace(routeParamsPattern, match => {
        return match.replace('_params:', 'params:');
      });
      modified = true;
    }

    // Fix function parameters in route handlers and pages
    // Pattern: function({ _params }: { _params: Promise<...> })
    const functionParamPattern = /\(\s*\{\s*_params\s*\}:\s*\{\s*params:/g;
    if (functionParamPattern.test(content)) {
      content = content.replace(functionParamPattern, '({ params }: { params:');
      modified = true;
    }

    // Fix page component parameters: ({ _params }: { _params: Promise<...> })
    const pageParamPattern = /\(\s*\{\s*_params\s*\}:\s*[^)]*\)/g;
    if (pageParamPattern.test(content)) {
      content = content.replace(/\{\s*_params\s*\}/g, '{ params }');
      modified = true;
    }

    // Fix destructuring: await _params should stay as await params
    const awaitParamsPattern = /await\s+_params/g;
    if (awaitParamsPattern.test(content)) {
      content = content.replace(awaitParamsPattern, 'await params');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(
        `✅ Fixed params naming in ${path.relative(process.cwd(), filePath)}`
      );
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing params naming issues...\n');

const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllTsxFiles(srcDir);

let fixedCount = 0;
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (
    content.includes('_params:') ||
    content.includes('{ _params }') ||
    content.includes('await _params')
  ) {
    fixParamsNaming(file);
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed params naming in ${fixedCount} files!`);
