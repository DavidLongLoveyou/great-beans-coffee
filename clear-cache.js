#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Clear Next.js and Webpack cache script
 * Resolves caching warnings and ensures clean builds
 */

const cacheDirectories = [
  '.next',
  'node_modules/.cache',
  '.contentlayer',
  'dist',
  'out'
];

function deleteFolderRecursive(folderPath) {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(folderPath);
  }
}

console.log('🧹 Clearing Next.js and Webpack cache...\n');

cacheDirectories.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (fs.existsSync(fullPath)) {
    console.log(`🗑️  Removing ${dir}...`);
    try {
      deleteFolderRecursive(fullPath);
      console.log(`✅ Successfully removed ${dir}`);
    } catch (error) {
      console.log(`❌ Failed to remove ${dir}: ${error.message}`);
    }
  } else {
    console.log(`⏭️  ${dir} doesn't exist, skipping...`);
  }
});

console.log('\n✨ Cache clearing completed!');
console.log('💡 You can now run "npm run dev" for a clean start.');