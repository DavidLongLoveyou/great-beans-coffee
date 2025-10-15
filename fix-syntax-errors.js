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

function fixSyntaxErrors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix incorrect destructuring syntax: { locale: _locale: _locale }
    if (content.includes('{ locale: _locale: _locale }')) {
      content = content.replace(
        /\{ locale: _locale: _locale \}/g,
        '{ locale: _locale }'
      );
      modified = true;
    }

    // Fix incorrect await syntax: await params: _params
    const awaitParamsPattern = /await\s+params:\s*_params/g;
    if (awaitParamsPattern.test(content)) {
      content = content.replace(awaitParamsPattern, 'await _params');
      modified = true;
    }

    // Fix patterns like: const { locale: _locale } = await params: _params;
    const destructuringPattern =
      /const\s+\{[^}]+\}\s*=\s*await\s+params:\s*_params/g;
    if (destructuringPattern.test(content)) {
      content = content.replace(destructuringPattern, match => {
        return match.replace(/await\s+params:\s*_params/, 'await _params');
      });
      modified = true;
    }

    // Fix any remaining "params: _params" patterns
    const paramsPattern = /params:\s*_params/g;
    if (paramsPattern.test(content)) {
      content = content.replace(paramsPattern, '_params');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(
        `✅ Fixed syntax errors in ${path.relative(process.cwd(), filePath)}`
      );
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Fixing all destructuring syntax errors...\n');

const srcDir = path.join(process.cwd(), 'src');
const allFiles = getAllTsxFiles(srcDir);

let fixedCount = 0;
allFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (
    content.includes('params: _params') ||
    content.includes('locale: _locale: _locale')
  ) {
    fixSyntaxErrors(file);
    fixedCount++;
  }
});

console.log(`\n🎉 Fixed syntax errors in ${fixedCount} files!`);
