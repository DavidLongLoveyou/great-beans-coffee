const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TSX files
const files = glob.sync('src/**/*.tsx', { cwd: __dirname });

let fixedCount = 0;
let totalReplacements = 0;

files.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  let fileReplacements = 0;

  // Fix unescaped apostrophes in JSX text content
  // Look for patterns like >text with ' in it< or "text with ' in it"

  // Pattern 1: JSX text content with apostrophes
  const jsxTextPattern = />(.*?Vietnam's.*?)</g;
  content = content.replace(jsxTextPattern, (match, textContent) => {
    if (textContent.includes("Vietnam's") && !textContent.includes('&apos;')) {
      const fixed = textContent.replace(/Vietnam's/g, 'Vietnam&apos;s');
      fileReplacements++;
      return `>${fixed}<`;
    }
    return match;
  });

  // Pattern 2: String literals in JSX attributes
  const attrPattern = /"([^"]*Vietnam's[^"]*)"/g;
  content = content.replace(attrPattern, (match, attrContent) => {
    if (attrContent.includes("Vietnam's") && !attrContent.includes('&apos;')) {
      const fixed = attrContent.replace(/Vietnam's/g, 'Vietnam&apos;s');
      fileReplacements++;
      return `"${fixed}"`;
    }
    return match;
  });

  // Pattern 3: Template literals
  const templatePattern = /`([^`]*Vietnam's[^`]*)`/g;
  content = content.replace(templatePattern, (match, templateContent) => {
    if (
      templateContent.includes("Vietnam's") &&
      !templateContent.includes('&apos;')
    ) {
      const fixed = templateContent.replace(/Vietnam's/g, 'Vietnam&apos;s');
      fileReplacements++;
      return `\`${fixed}\``;
    }
    return match;
  });

  if (fileReplacements > 0) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed ${fileReplacements} apostrophes in: ${filePath}`);
    fixedCount++;
    totalReplacements += fileReplacements;
    modified = true;
  }
});

console.log(
  `\nFixed ${totalReplacements} unescaped apostrophes in ${fixedCount} files total.`
);
