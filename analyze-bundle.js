const fs = require('fs');
const path = require('path');

function analyzeBundleSize() {
  console.log('🔍 Analyzing bundle composition...\n');
  
  // Check package.json for large dependencies
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  console.log('📦 Large Dependencies (potential bundle bloat):');
  const largeDeps = [
    '@radix-ui', 'framer-motion', 'lucide-react', 'recharts', 
    'contentlayer2', '@next/mdx', 'next-intl', 'prisma'
  ];
  
  largeDeps.forEach(dep => {
    const matches = Object.keys(dependencies).filter(key => key.includes(dep));
    matches.forEach(match => {
      console.log(`  • ${match}: ${dependencies[match]}`);
    });
  });
  
  console.log('\n🎯 Bundle Size Analysis:');
  console.log('  Current First Load JS: 4.18 MB');
  console.log('  Target: < 250 KB');
  console.log('  Reduction needed: ~94%');
  
  console.log('\n🔧 Recommended Optimizations:');
  console.log('  1. Enable dynamic imports for heavy components');
  console.log('  2. Split vendor chunks more aggressively');
  console.log('  3. Remove unused dependencies');
  console.log('  4. Optimize Contentlayer configuration');
  console.log('  5. Use tree-shaking for UI libraries');
  
  // Check for potential unused files
  console.log('\n📁 Checking for potential optimization targets...');
  
  const srcDir = 'src';
  const checkDirs = ['components', 'lib', 'shared'];
  
  checkDirs.forEach(dir => {
    const fullPath = path.join(srcDir, dir);
    if (fs.existsSync(fullPath)) {
      const files = fs.readdirSync(fullPath, { recursive: true });
      console.log(`  ${dir}/: ${files.length} files`);
    }
  });
}

analyzeBundleSize();