const fs = require('fs');
const path = require('path');

// Get all TypeScript and TSX files in src directory
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.match(/\.(ts|tsx)$/)) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract icon names from the current icons.ts file
function getExportedIcons() {
  const iconsPath = path.join(__dirname, 'src', 'components', 'ui', 'icons.ts');
  if (!fs.existsSync(iconsPath)) {
    console.log('icons.ts not found');
    return [];
  }
  
  const content = fs.readFileSync(iconsPath, 'utf8');
  const exportMatches = content.match(/export\s*{\s*([^}]+)\s*}/g);
  
  if (!exportMatches) return [];
  
  const icons = [];
  exportMatches.forEach(match => {
    const iconNames = match
      .replace(/export\s*{\s*/, '')
      .replace(/\s*}/, '')
      .split(',')
      .map(name => name.trim())
      .filter(name => name && !name.includes('type'));
    
    icons.push(...iconNames);
  });
  
  return [...new Set(icons)]; // Remove duplicates
}

// Process each file
function processFile(filePath, exportedIcons) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Check if file imports from icons.ts
  const iconImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"']@?\.?\.?\/?(components\/ui\/icons|@\/components\/ui\/icons)['"']/g;
  
  let match;
  while ((match = iconImportRegex.exec(content)) !== null) {
    const importedIcons = match[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon && !icon.includes('type'));
    
    // Replace the import statement
    const newImport = `import { ${importedIcons.join(', ')} } from '@/components/ui/dynamic-icons'`;
    content = content.replace(match[0], newImport);
    modified = true;
  }
  
  // Also check for relative imports
  const relativeIconImportRegex = /import\s*{\s*([^}]+)\s*}\s*from\s*['"']\.\.?\/.*\/icons['"']/g;
  
  while ((match = relativeIconImportRegex.exec(content)) !== null) {
    const importedIcons = match[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon && !icon.includes('type'));
    
    // Replace the import statement
    const newImport = `import { ${importedIcons.join(', ')} } from '@/components/ui/dynamic-icons'`;
    content = content.replace(match[0], newImport);
    modified = true;
  }
  
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

// Main execution
function main() {
  console.log('Starting icon migration...');
  
  const exportedIcons = getExportedIcons();
  console.log(`Found ${exportedIcons.length} exported icons`);
  
  const srcDir = path.join(__dirname, 'src');
  const allFiles = getAllFiles(srcDir);
  
  console.log(`Processing ${allFiles.length} files...`);
  
  let processedCount = 0;
  allFiles.forEach(filePath => {
    // Skip the icons.ts file itself and the new dynamic-icons.tsx
    if (filePath.includes('icons.ts') || filePath.includes('dynamic-icons.tsx')) {
      return;
    }
    
    processFile(filePath, exportedIcons);
    processedCount++;
  });
  
  console.log(`Migration completed! Processed ${processedCount} files.`);
  console.log('Next steps:');
  console.log('1. Review the changes');
  console.log('2. Test the application');
  console.log('3. Remove or rename the old icons.ts file');
  console.log('4. Run a build to verify bundle size reduction');
}

main();