const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx,js,jsx}', { ignore: ['src/components/ui/icons.ts'] });
let foundDirectImports = false;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes("from 'lucide-react'") || content.includes('from "lucide-react"')) {
    console.log('Direct import found in:', file);
    foundDirectImports = true;
  }
});

if (!foundDirectImports) {
  console.log('No direct lucide-react imports found in source files');
}