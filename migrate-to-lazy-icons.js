const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });
  
  return results;
}

// Function to update imports in a file
function updateImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace import statements
    const importRegex = /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/dynamic-icons['"];?/g;
    
    content = content.replace(importRegex, (match, imports) => {
      modified = true;
      return `import { ${imports} } from '@/components/ui/lazy-icons';`;
    });
    
    // Also handle type imports
    const typeImportRegex = /import\s+type\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/dynamic-icons['"];?/g;
    
    content = content.replace(typeImportRegex, (match, imports) => {
      modified = true;
      return `import type { ${imports} } from '@/components/ui/lazy-icons';`;
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Updated: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('🔄 Starting migration from dynamic-icons to lazy-icons...\n');

const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);

let updatedCount = 0;

files.forEach(file => {
  if (updateImports(file)) {
    updatedCount++;
  }
});

console.log(`\n✨ Migration completed! Updated ${updatedCount} files.`);

// Also update the page-header.tsx to use the correct type
const pageHeaderPath = path.join(__dirname, 'src', 'components', 'layout', 'page-header.tsx');
if (fs.existsSync(pageHeaderPath)) {
  let content = fs.readFileSync(pageHeaderPath, 'utf8');
  
  // Replace the import
  content = content.replace(
    /import type { LucideIcon } from '@\/components\/ui\/dynamic-icons';/,
    'import type { LucideProps } from \'@/components/ui/lazy-icons\';'
  );
  
  // Replace the type usage
  content = content.replace(
    /icon\?: LucideIcon;/,
    'icon?: React.ComponentType<LucideProps>;'
  );
  
  fs.writeFileSync(pageHeaderPath, content, 'utf8');
  console.log('✅ Updated page-header.tsx type definitions');
}