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

function fixLocaleVariables(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let newContent = content;

  // Pattern 1: Fix destructuring with _locale but usage with locale
  // const { locale: _locale } = await params; -> const { locale } = await params;
  const destructuringPattern =
    /const\s*{\s*locale:\s*_locale\s*}\s*=\s*await\s+params;/g;
  if (destructuringPattern.test(content)) {
    newContent = newContent.replace(
      destructuringPattern,
      'const { locale } = await params;'
    );
    modified = true;
  }

  // Pattern 2: Fix usage of _locale where locale is expected
  // href={`/${_locale}/...`} -> href={`/${locale}/...`}
  const usagePattern = /\$\{_locale\}/g;
  if (usagePattern.test(newContent)) {
    newContent = newContent.replace(usagePattern, '${locale}');
    modified = true;
  }

  // Pattern 3: Fix function parameters with _locale
  // getTranslations({ locale: _locale, ... }) -> getTranslations({ locale, ... })
  const functionParamPattern = /getTranslations\(\{\s*locale:\s*_locale\s*,/g;
  if (functionParamPattern.test(newContent)) {
    newContent = newContent.replace(
      functionParamPattern,
      'getTranslations({ locale,'
    );
    modified = true;
  }

  // Pattern 4: Fix standalone _locale usage
  const standalonePattern = /\b_locale\b/g;
  if (standalonePattern.test(newContent)) {
    newContent = newContent.replace(standalonePattern, 'locale');
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
    `Checking ${files.length} TypeScript files for locale variable issues...`
  );

  for (const file of files) {
    try {
      if (fixLocaleVariables(file)) {
        console.log(`Fixed: ${file}`);
        fixedCount++;
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }

  console.log(`\nFixed locale variables in ${fixedCount} files.`);
}

main();
