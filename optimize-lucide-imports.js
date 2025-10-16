const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/JavaScript files
const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { cwd: process.cwd() });

const iconUsage = new Set();
const fileUpdates = [];

console.log('Analyzing Lucide icon usage...');

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  
  // Find lucide-react imports
  const importMatch = content.match(/import\s*{([^}]+)}\s*from\s*['"]lucide-react['"]/);
  if (importMatch) {
    const imports = importMatch[1]
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon && !icon.includes('LucideIcon'));
    
    imports.forEach(icon => iconUsage.add(icon));
    
    console.log(`${file}: ${imports.join(', ')}`);
    
    // Store file for later update
    fileUpdates.push({
      file,
      content,
      imports,
      importMatch: importMatch[0]
    });
  }
});

console.log(`\nTotal unique icons used: ${iconUsage.size}`);
console.log('Icons:', Array.from(iconUsage).sort().join(', '));

// Create optimized icon module
const iconModule = `// Auto-generated optimized icon exports
// This file contains only the icons actually used in the project
import {
${Array.from(iconUsage).sort().map(icon => `  ${icon},`).join('\n')}
  type LucideIcon
} from 'lucide-react';

export {
${Array.from(iconUsage).sort().map(icon => `  ${icon},`).join('\n')}
  type LucideIcon
};

// Re-export for convenience
export default {
${Array.from(iconUsage).sort().map(icon => `  ${icon},`).join('\n')}
};
`;

// Write the optimized icon module
fs.writeFileSync('src/components/ui/icons.ts', iconModule);
console.log('\nCreated optimized icon module: src/components/ui/icons.ts');

// Update all files to use the optimized import
let updatedFiles = 0;
fileUpdates.forEach(({ file, content, imports, importMatch }) => {
  const newImport = `import { ${imports.join(', ')} } from '@/components/ui/icons'`;
  const newContent = content.replace(importMatch, newImport);
  
  if (newContent !== content) {
    fs.writeFileSync(file, newContent);
    updatedFiles++;
  }
});

console.log(`\nUpdated ${updatedFiles} files to use optimized imports`);
console.log('\nOptimization complete! This should significantly reduce bundle size.');