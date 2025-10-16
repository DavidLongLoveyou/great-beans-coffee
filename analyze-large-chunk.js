const fs = require('fs');
const path = require('path');

// Find the largest chunk file
const chunksDir = '.next/static/chunks';
const files = fs.readdirSync(chunksDir);

let largestFile = null;
let largestSize = 0;

files.forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(chunksDir, file);
    const stats = fs.statSync(filePath);
    if (stats.size > largestSize) {
      largestSize = stats.size;
      largestFile = file;
    }
  }
});

console.log(`Largest chunk: ${largestFile} (${(largestSize / 1024 / 1024).toFixed(2)} MB)`);

if (largestFile) {
  const filePath = path.join(chunksDir, largestFile);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Analyze content for common patterns
  const patterns = [
    { name: 'React components', regex: /react/gi },
    { name: 'Next.js internals', regex: /next/gi },
    { name: 'Radix UI', regex: /radix/gi },
    { name: 'Framer Motion', regex: /framer-motion/gi },
    { name: 'Recharts', regex: /recharts/gi },
    { name: 'Lucide icons', regex: /lucide/gi },
    { name: 'Contentlayer', regex: /contentlayer/gi },
    { name: 'Prisma', regex: /prisma/gi },
    { name: 'Zod', regex: /zod/gi },
    { name: 'Date-fns', regex: /date-fns/gi },
    { name: 'Lodash', regex: /lodash/gi },
    { name: 'D3', regex: /d3-/gi },
    { name: 'PDF generation', regex: /jspdf|html2canvas/gi },
    { name: 'Internationalization', regex: /intl|i18n/gi }
  ];
  
  console.log('\nContent analysis:');
  patterns.forEach(pattern => {
    const matches = content.match(pattern.regex);
    if (matches && matches.length > 10) {
      console.log(`${pattern.name}: ${matches.length} occurrences`);
    }
  });
  
  // Check for large string literals or data
  const largeStrings = content.match(/"[^"]{1000,}"/g);
  if (largeStrings) {
    console.log(`\nLarge string literals found: ${largeStrings.length}`);
    largeStrings.slice(0, 3).forEach((str, i) => {
      console.log(`String ${i + 1}: ${str.length} characters`);
    });
  }
  
  // Check for base64 data
  const base64Matches = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+\/=]{100,}/g);
  if (base64Matches) {
    console.log(`\nBase64 images found: ${base64Matches.length}`);
    base64Matches.forEach((match, i) => {
      console.log(`Image ${i + 1}: ${(match.length / 1024).toFixed(2)} KB`);
    });
  }
  
  // Check for repeated patterns
  const modulePattern = /\n\s*\/\*\*\*\/ \(function\(module, exports, __webpack_require__\)/g;
  const modules = content.match(modulePattern);
  if (modules) {
    console.log(`\nWebpack modules: ${modules.length}`);
  }
}