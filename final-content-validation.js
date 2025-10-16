const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Comprehensive validation for all content
function validateContent() {
  const contentDir = path.join(__dirname, 'content');
  const results = {
    totalFiles: 0,
    validFiles: 0,
    errors: [],
    warnings: []
  };

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        results.totalFiles++;
        validateFile(fullPath);
      }
    }
  }

  function validateFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(__dirname, filePath);
      
      // Check for frontmatter
      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!frontmatterMatch) {
        // Debug: show first few lines
        const firstLines = content.split('\n').slice(0, 3).join('\\n');
        results.errors.push(`${relativePath}: No frontmatter found. First lines: ${firstLines}`);
        return;
      }

      // Parse YAML
      try {
        const frontmatter = yaml.load(frontmatterMatch[1]);
        
        // Validate required fields
        const requiredFields = ['title', 'description', 'publishedAt', 'author', 'category', 'locale'];
        for (const field of requiredFields) {
          if (!frontmatter[field]) {
            results.errors.push(`${relativePath}: Missing required field '${field}'`);
          }
        }

        // Validate specific content types
        if (relativePath.includes('origin-stories')) {
          const originFields = ['province', 'altitude', 'region', 'coffeeVariety'];
          for (const field of originFields) {
            if (!frontmatter[field]) {
              results.warnings.push(`${relativePath}: Missing origin story field '${field}'`);
            }
          }
        }

        // Check for proper array formatting
        const arrayFields = ['gallery', 'keywords', 'certifications', 'targetMarkets', 'serviceIncludes'];
        for (const field of arrayFields) {
          if (frontmatter[field] && !Array.isArray(frontmatter[field])) {
            results.errors.push(`${relativePath}: Field '${field}' should be an array`);
          }
        }

        // Check for mixed quotes in strings
        for (const [key, value] of Object.entries(frontmatter)) {
          if (typeof value === 'string' && value.includes("'") && value.includes('"')) {
            results.warnings.push(`${relativePath}: Mixed quotes in field '${key}'`);
          }
        }

        results.validFiles++;
        
      } catch (yamlError) {
        results.errors.push(`${relativePath}: YAML Parse Error - ${yamlError.message}`);
      }
      
    } catch (error) {
      results.errors.push(`${relativePath}: File read error - ${error.message}`);
    }
  }

  scanDirectory(contentDir);
  return results;
}

// Run validation
console.log('🔍 Running final content validation...\n');

const results = validateContent();

console.log('📊 Validation Results:');
console.log(`   Total files: ${results.totalFiles}`);
console.log(`   Valid files: ${results.validFiles}`);
console.log(`   Files with errors: ${results.errors.length > 0 ? results.totalFiles - results.validFiles : 0}`);
console.log(`   Total errors: ${results.errors.length}`);
console.log(`   Total warnings: ${results.warnings.length}\n`);

if (results.errors.length > 0) {
  console.log('❌ Errors found:');
  results.errors.forEach(error => console.log(`   • ${error}`));
  console.log('');
}

if (results.warnings.length > 0) {
  console.log('⚠️  Warnings:');
  results.warnings.forEach(warning => console.log(`   • ${warning}`));
  console.log('');
}

if (results.errors.length === 0) {
  console.log('✅ All content files are valid!');
  console.log('🎉 Content validation passed successfully!');
} else {
  console.log('❌ Content validation failed. Please fix the errors above.');
  process.exit(1);
}