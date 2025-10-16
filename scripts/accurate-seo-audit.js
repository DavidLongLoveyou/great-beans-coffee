const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function accurateSEOAudit() {
  const contentDir = path.join(__dirname, '..', 'content');
  let totalFiles = 0;
  let duplicateFrontmatterFiles = 0;
  let otherIssues = 0;

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        auditFile(fullPath);
      }
    }
  }

  function auditFile(filePath) {
    totalFiles++;
    const relativePath = path.relative(contentDir, filePath);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // More accurate duplicate frontmatter detection
      const frontmatterBlocks = content.match(/---\n[\s\S]*?\n---/g);
      
      if (!frontmatterBlocks || frontmatterBlocks.length === 0) {
        console.log(`⚠️ ${relativePath}: No frontmatter found`);
        otherIssues++;
        return;
      }

      if (frontmatterBlocks.length > 1) {
        console.log(`❌ ${relativePath}: ${frontmatterBlocks.length} frontmatter blocks detected`);
        duplicateFrontmatterFiles++;
        
        // Show the blocks for debugging
        frontmatterBlocks.forEach((block, index) => {
          console.log(`   Block ${index + 1}: ${block.substring(0, 100)}...`);
        });
        return;
      }

      // Parse the single frontmatter block
      const frontmatterMatch = frontmatterBlocks[0].match(/---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`⚠️ ${relativePath}: Invalid frontmatter format`);
        otherIssues++;
        return;
      }

      let metadata;
      try {
        metadata = yaml.load(frontmatterMatch[1]);
      } catch (error) {
        console.log(`❌ ${relativePath}: YAML parsing error - ${error.message}`);
        otherIssues++;
        return;
      }

      // Quick checks for major SEO issues
      const issues = [];
      
      if (!metadata.title) issues.push('missing title');
      if (!metadata.description) issues.push('missing description');
      if (!metadata.seoTitle) issues.push('missing seoTitle');
      if (!metadata.seoDescription) issues.push('missing seoDescription');
      if (!metadata.keywords || !Array.isArray(metadata.keywords) || metadata.keywords.length === 0) {
        issues.push('missing keywords');
      }

      if (issues.length > 0) {
        console.log(`⚠️ ${relativePath}: ${issues.join(', ')}`);
        otherIssues++;
      } else {
        console.log(`✅ ${relativePath}: OK`);
      }

    } catch (error) {
      console.log(`❌ ${relativePath}: File reading error - ${error.message}`);
      otherIssues++;
    }
  }

  scanDirectory(contentDir);
  
  console.log(`\n📊 Accurate SEO Audit Summary:`);
  console.log(`  Total files: ${totalFiles}`);
  console.log(`  Files with duplicate frontmatter: ${duplicateFrontmatterFiles}`);
  console.log(`  Files with other SEO issues: ${otherIssues}`);
  console.log(`  Files with no issues: ${totalFiles - duplicateFrontmatterFiles - otherIssues}`);
}

console.log('🔍 Starting accurate SEO audit...\n');
accurateSEOAudit();
console.log('\n✅ Accurate SEO audit completed!');