const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

// Required fields for different content types
const REQUIRED_FIELDS = {
  OriginStory: ['title', 'description', 'publishedAt', 'author', 'category', 'region', 'province', 'altitude', 'coffeeVariety', 'locale'],
  ServicePage: ['title', 'description', 'publishedAt', 'author', 'category', 'locale'],
  ProductPage: ['title', 'description', 'publishedAt', 'author', 'category', 'locale']
};

// Validation functions
function validateYAMLSyntax(content, filePath) {
  const errors = [];
  
  try {
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      errors.push('No frontmatter found');
      return errors;
    }

    const frontmatterContent = frontmatterMatch[1];
    yaml.load(frontmatterContent);
    
    // Check for common YAML issues
    const lines = frontmatterContent.split('\n');
    lines.forEach((line, index) => {
      const lineNum = index + 2; // +2 because we start after first ---
      
      // Check for concatenated array items
      if (line.includes('"-"') && !line.trim().startsWith('-')) {
        errors.push(`Line ${lineNum}: Possible concatenated array items`);
      }
      
      // Check for missing quotes around strings with special characters
      if (line.includes(':') && line.includes("'") && line.includes('"')) {
        errors.push(`Line ${lineNum}: Mixed quote types`);
      }
      
      // Check for improper indentation in arrays
      if (line.trim().startsWith('-') && line.indexOf('-') % 2 !== 0) {
        errors.push(`Line ${lineNum}: Improper array indentation`);
      }
    });
    
  } catch (e) {
    errors.push(`YAML Parse Error: ${e.message}`);
  }
  
  return errors;
}

function validateRequiredFields(frontmatter, contentType) {
  const errors = [];
  const required = REQUIRED_FIELDS[contentType] || [];
  
  required.forEach(field => {
    if (!frontmatter[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });
  
  return errors;
}

function validateFieldTypes(frontmatter) {
  const errors = [];
  
  // Check date fields
  const dateFields = ['publishedAt', 'updatedAt'];
  dateFields.forEach(field => {
    if (frontmatter[field] && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter[field])) {
      errors.push(`Invalid date format for ${field}: ${frontmatter[field]}`);
    }
  });
  
  // Check boolean fields
  const booleanFields = ['featured', 'draft'];
  booleanFields.forEach(field => {
    if (frontmatter[field] !== undefined && typeof frontmatter[field] !== 'boolean') {
      errors.push(`Field ${field} should be boolean, got: ${typeof frontmatter[field]}`);
    }
  });
  
  // Check array fields
  const arrayFields = ['gallery', 'keywords', 'certifications', 'targetMarkets', 'serviceIncludes'];
  arrayFields.forEach(field => {
    if (frontmatter[field] && !Array.isArray(frontmatter[field])) {
      errors.push(`Field ${field} should be array, got: ${typeof frontmatter[field]}`);
    }
  });
  
  return errors;
}

function validateContent(filePath) {
  const errors = [];
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Validate YAML syntax
    const yamlErrors = validateYAMLSyntax(content, filePath);
    errors.push(...yamlErrors);
    
    if (yamlErrors.length === 0) {
      // If YAML is valid, validate content
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (frontmatterMatch) {
        const frontmatter = yaml.load(frontmatterMatch[1]);
        
        // Determine content type from path
        let contentType = 'ServicePage'; // default
        if (filePath.includes('origin-stories')) contentType = 'OriginStory';
        if (filePath.includes('products')) contentType = 'ProductPage';
        
        // Validate required fields
        const fieldErrors = validateRequiredFields(frontmatter, contentType);
        errors.push(...fieldErrors);
        
        // Validate field types
        const typeErrors = validateFieldTypes(frontmatter);
        errors.push(...typeErrors);
      }
    }
    
  } catch (error) {
    errors.push(`File read error: ${error.message}`);
  }
  
  return errors;
}

// Main validation function
function validateAllContent() {
  console.log('🔍 Validating all MDX content...\n');
  
  const contentPattern = 'content/**/*.mdx';
  const files = glob.sync(contentPattern);
  
  let totalErrors = 0;
  let filesWithErrors = 0;
  
  files.forEach(file => {
    const errors = validateContent(file);
    
    if (errors.length > 0) {
      filesWithErrors++;
      totalErrors += errors.length;
      
      console.log(`❌ ${file}:`);
      errors.forEach(error => {
        console.log(`   • ${error}`);
      });
      console.log('');
    } else {
      console.log(`✅ ${file}`);
    }
  });
  
  console.log(`\n📊 Validation Summary:`);
  console.log(`   Total files: ${files.length}`);
  console.log(`   Files with errors: ${filesWithErrors}`);
  console.log(`   Total errors: ${totalErrors}`);
  
  if (totalErrors === 0) {
    console.log('\n🎉 All content files are valid!');
  } else {
    console.log(`\n⚠️  Found ${totalErrors} issues in ${filesWithErrors} files`);
    process.exit(1);
  }
}

// Run validation
validateAllContent();