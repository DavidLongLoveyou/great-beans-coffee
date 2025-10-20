#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing build performance...\n');

// 1. Clean build cache
console.log('1. Cleaning build cache...');
const cacheDirectories = ['.next', '.contentlayer', 'node_modules/.cache'];

cacheDirectories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    fs.rmSync(fullPath, { recursive: true, force: true });
    console.log(`   ✅ Cleaned ${dir}`);
  } else {
    console.log(`   ⏭️  ${dir} not found, skipping`);
  }
});

// 2. Set environment variables for faster builds
console.log('\n2. Setting environment variables for faster builds...');
const envOptimizations = {
  NEXT_TELEMETRY_DISABLED: '1',
  DISABLE_ESLINT_PLUGIN: 'true',
  GENERATE_SOURCEMAP: 'false',
  NODE_OPTIONS: '--max-old-space-size=4096',
};

let envContent = '';
if (fs.existsSync('.env.local')) {
  envContent = fs.readFileSync('.env.local', 'utf8');
}

Object.entries(envOptimizations).forEach(([key, value]) => {
  if (!envContent.includes(key)) {
    envContent += `\n${key}=${value}`;
    console.log(`   ✅ Added ${key}=${value}`);
  } else {
    console.log(`   ⏭️  ${key} already set`);
  }
});

fs.writeFileSync('.env.local', envContent);

// 3. Create optimized package.json scripts
console.log('\n3. Creating optimized build scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const optimizedScripts = {
  'build:fast':
    'cross-env NODE_ENV=production DISABLE_ESLINT_PLUGIN=true next build',
  'build:analyze': 'cross-env ANALYZE=true npm run build',
  'build:clean': 'node scripts/optimize-build.js && npm run build',
  'dev:fast': 'cross-env DISABLE_ESLINT_PLUGIN=true next dev --turbo',
};

Object.entries(optimizedScripts).forEach(([key, value]) => {
  if (!packageJson.scripts[key]) {
    packageJson.scripts[key] = value;
    console.log(`   ✅ Added script: ${key}`);
  } else {
    console.log(`   ⏭️  Script ${key} already exists`);
  }
});

fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));

// 4. Check for large files that might slow down builds
console.log('\n4. Checking for large files...');
function checkLargeFiles(dir, maxSize = 1024 * 1024) {
  // 1MB
  const largeFiles = [];

  function walkDir(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);

      if (
        stat.isDirectory() &&
        !item.startsWith('.') &&
        item !== 'node_modules'
      ) {
        walkDir(fullPath);
      } else if (stat.isFile() && stat.size > maxSize) {
        largeFiles.push({
          path: fullPath,
          size: (stat.size / 1024 / 1024).toFixed(2) + 'MB',
        });
      }
    }
  }

  walkDir(dir);
  return largeFiles;
}

const largeFiles = checkLargeFiles('./src');
if (largeFiles.length > 0) {
  console.log('   ⚠️  Large files found (consider optimizing):');
  largeFiles.forEach(file => {
    console.log(`      - ${file.path} (${file.size})`);
  });
} else {
  console.log('   ✅ No large files found');
}

console.log('\n🎉 Build optimization complete!');
console.log('\n📝 Recommended commands:');
console.log('   npm run build:fast    - Fast build without ESLint');
console.log('   npm run build:clean   - Clean build with optimizations');
console.log('   npm run dev:fast      - Fast development with Turbo');
console.log('   npm run build:analyze - Build with bundle analyzer');
