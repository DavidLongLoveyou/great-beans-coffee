const fs = require('fs');
const path = require('path');

function analyzeChunk(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const size = (fs.statSync(filePath).size / 1024 / 1024).toFixed(2);
  
  console.log(`\n=== Analyzing ${path.basename(filePath)} (${size} MB) ===`);
  
  // Count different types of content
  const analysis = {
    lucideIcons: (content.match(/lucide-react/gi) || []).length,
    recharts: (content.match(/recharts/gi) || []).length,
    reactComponents: (content.match(/React\./g) || []).length,
    nextjs: (content.match(/next/gi) || []).length,
    i18n: (content.match(/i18n/gi) || []).length,
    largeStrings: (content.match(/"[^"]{1000,}"/g) || []).length,
    contentlayer: (content.match(/contentlayer/gi) || []).length,
    shadcn: (content.match(/shadcn|@radix/gi) || []).length,
    tailwind: (content.match(/tailwind/gi) || []).length
  };
  
  // Find large string literals
  const largeStrings = content.match(/"[^"]{2000,}"/g) || [];
  console.log('\nLarge string literals (>2000 chars):');
  largeStrings.slice(0, 5).forEach((str, i) => {
    console.log(`${i + 1}. ${str.substring(0, 100)}... (${str.length} chars)`);
  });
  
  // Find repeated patterns
  const patterns = {
    'function declarations': (content.match(/function\s+\w+/g) || []).length,
    'var declarations': (content.match(/var\s+\w+/g) || []).length,
    'const declarations': (content.match(/const\s+\w+/g) || []).length,
    'import statements': (content.match(/import\s+/g) || []).length,
    'export statements': (content.match(/export\s+/g) || []).length
  };
  
  console.log('\nContent analysis:');
  Object.entries(analysis).forEach(([key, value]) => {
    if (value > 0) {
      console.log(`${key}: ${value}`);
    }
  });
  
  console.log('\nCode patterns:');
  Object.entries(patterns).forEach(([key, value]) => {
    if (value > 100) {
      console.log(`${key}: ${value}`);
    }
  });
  
  // Check for specific problematic imports
  const problematicImports = [
    'lucide-react',
    'recharts',
    '@radix-ui',
    'framer-motion',
    'date-fns',
    'lodash'
  ];
  
  console.log('\nProblematic imports found:');
  problematicImports.forEach(imp => {
    const count = (content.match(new RegExp(imp, 'gi')) || []).length;
    if (count > 0) {
      console.log(`${imp}: ${count} occurrences`);
    }
  });
  
  return analysis;
}

// Analyze the largest chunks
const chunksDir = '.next/static/chunks';
if (fs.existsSync(chunksDir)) {
  const chunks = fs.readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => ({
      name: file,
      path: path.join(chunksDir, file),
      size: fs.statSync(path.join(chunksDir, file)).size
    }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 3); // Top 3 largest chunks
  
  console.log('Analyzing top 3 largest chunks...\n');
  
  chunks.forEach(chunk => {
    analyzeChunk(chunk.path);
  });
  
  console.log('\n=== Summary ===');
  console.log('Total chunks analyzed:', chunks.length);
  console.log('Total size of top 3 chunks:', 
    (chunks.reduce((sum, chunk) => sum + chunk.size, 0) / 1024 / 1024).toFixed(2) + ' MB');
} else {
  console.log('No .next/static/chunks directory found. Please run build first.');
}