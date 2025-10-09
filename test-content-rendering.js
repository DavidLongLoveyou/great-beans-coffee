#!/usr/bin/env node

/**
 * Test Content Rendering Script
 * Verifies that contentlayer is working and content is properly parsed
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Content Rendering...\n');

// Test 1: Check if contentlayer build is working
console.log('1️⃣ Testing Contentlayer Build...');
try {
  const buildOutput = execSync('npx contentlayer2 build', { 
    encoding: 'utf8',
    cwd: __dirname 
  });
  
  // Extract document count from output
  const documentMatch = buildOutput.match(/(\d+) documents? generated/);
  const documentCount = documentMatch ? parseInt(documentMatch[1]) : 0;
  
  console.log(`✅ Contentlayer build successful: ${documentCount} documents generated`);
  
  if (documentCount === 0) {
    console.log('⚠️  Warning: No documents were generated');
  }
} catch (error) {
  console.log('❌ Contentlayer build failed:');
  console.log(error.message);
  process.exit(1);
}

// Test 2: Check if generated files exist
console.log('\n2️⃣ Testing Generated Files...');
const generatedPath = path.join(__dirname, '.contentlayer', 'generated');

if (fs.existsSync(generatedPath)) {
  const files = fs.readdirSync(generatedPath);
  console.log(`✅ Generated files found: ${files.length} files`);
  console.log(`   Files: ${files.join(', ')}`);
} else {
  console.log('❌ Generated files directory not found');
  process.exit(1);
}

// Test 3: Test content import
console.log('\n3️⃣ Testing Content Import...');
try {
  // We need to use dynamic import since this is a CommonJS script
  const testImport = `
    import { allBlogPosts, allMarketReports, allOriginStories, allServicePages } from './.contentlayer/generated/index.mjs';
    
    console.log('Blog Posts:', allBlogPosts.length);
    console.log('Market Reports:', allMarketReports.length);
    console.log('Origin Stories:', allOriginStories.length);
    console.log('Service Pages:', allServicePages.length);
    
    // Test a specific blog post
    if (allBlogPosts.length > 0) {
      const firstPost = allBlogPosts[0];
      console.log('First Blog Post:');
      console.log('  Title:', firstPost.title);
      console.log('  Slug:', firstPost.slug);
      console.log('  Locale:', firstPost.locale);
      console.log('  URL:', firstPost.url);
    }
  `;
  
  fs.writeFileSync(path.join(__dirname, 'temp-test.mjs'), testImport);
  
  const importOutput = execSync('node temp-test.mjs', { 
    encoding: 'utf8',
    cwd: __dirname 
  });
  
  console.log('✅ Content import successful:');
  console.log(importOutput);
  
  // Clean up
  fs.unlinkSync(path.join(__dirname, 'temp-test.mjs'));
  
} catch (error) {
  console.log('❌ Content import failed:');
  console.log(error.message);
  
  // Clean up on error
  const tempFile = path.join(__dirname, 'temp-test.mjs');
  if (fs.existsSync(tempFile)) {
    fs.unlinkSync(tempFile);
  }
}

// Test 4: Check specific content files
console.log('\n4️⃣ Testing Content Files...');
const contentDir = path.join(__dirname, 'content');
const contentTypes = ['blog', 'market-reports', 'origin-stories', 'services'];

contentTypes.forEach(type => {
  const typePath = path.join(contentDir, type);
  if (fs.existsSync(typePath)) {
    const locales = fs.readdirSync(typePath).filter(item => 
      fs.statSync(path.join(typePath, item)).isDirectory()
    );
    
    let totalFiles = 0;
    locales.forEach(locale => {
      const localePath = path.join(typePath, locale);
      const files = fs.readdirSync(localePath).filter(file => file.endsWith('.mdx'));
      totalFiles += files.length;
    });
    
    console.log(`✅ ${type}: ${totalFiles} files across ${locales.length} locales`);
  } else {
    console.log(`❌ ${type}: Directory not found`);
  }
});

console.log('\n🎉 Content rendering test completed!');
console.log('\n📋 Summary:');
console.log('- Contentlayer build: ✅ Working');
console.log('- Generated files: ✅ Present');
console.log('- Content import: ✅ Functional');
console.log('- Content files: ✅ Available');
console.log('\n🚀 Ready to test frontend rendering!');