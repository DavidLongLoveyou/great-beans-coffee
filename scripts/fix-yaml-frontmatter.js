const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Fix YAML frontmatter issues in MDX files
 * - Normalize line endings (CRLF to LF)
 * - Fix array syntax issues
 * - Ensure proper YAML formatting
 */

function fixYamlFrontmatter(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;

    // Normalize line endings (CRLF to LF)
    if (content.includes('\r\n')) {
      content = content.replace(/\r\n/g, '\n');
      hasChanges = true;
    }

    // Fix specific YAML issues
    const lines = content.split('\n');
    const frontmatterEnd = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
    
    if (frontmatterEnd > 0) {
      for (let i = 1; i < frontmatterEnd; i++) {
        const line = lines[i];
        
        // Fix tableOfContents with trailing \r
        if (line.includes('tableOfContents: true\r')) {
          lines[i] = line.replace('tableOfContents: true\r', 'tableOfContents: true');
          hasChanges = true;
        }
        
        // Fix array syntax issues - ensure proper spacing
        if (line.includes('certifications:') && line.includes('[')) {
          // Fix inline array formatting
          const match = line.match(/certifications:\s*\[(.*)\]/);
          if (match) {
            const arrayContent = match[1];
            // Ensure proper quotes and spacing
            const fixedArray = arrayContent
              .split(',')
              .map(item => item.trim())
              .map(item => {
                // Remove existing quotes and add proper single quotes
                const cleaned = item.replace(/^['"]|['"]$/g, '');
                return `'${cleaned}'`;
              })
              .join(', ');
            
            lines[i] = `certifications: [${fixedArray}]`;
            hasChanges = true;
          }
        }
        
        // Fix other array fields
        const arrayFields = ['tags', 'keywords', 'gallery', 'sustainabilityPractices', 'relatedPosts', 'alternateLanguages'];
        arrayFields.forEach(field => {
          if (line.includes(`${field}:`) && line.includes('[')) {
            const match = line.match(new RegExp(`${field}:\\s*\\[(.*)\\]`));
            if (match) {
              const arrayContent = match[1];
              const fixedArray = arrayContent
                .split(',')
                .map(item => item.trim())
                .map(item => {
                  const cleaned = item.replace(/^['"]|['"]$/g, '');
                  return `'${cleaned}'`;
                })
                .join(', ');
              
              lines[i] = `${field}: [${fixedArray}]`;
              hasChanges = true;
            }
          }
        });
      }
    }

    if (hasChanges) {
      const fixedContent = lines.join('\n');
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

function main() {
  console.log('🔧 Fixing YAML frontmatter issues in MDX files...\n');
  
  const contentDir = path.join(__dirname, '..', 'content');
  const mdxFiles = glob.sync('**/*.mdx', { cwd: contentDir });
  
  let fixedCount = 0;
  let totalCount = 0;
  
  mdxFiles.forEach(relativePath => {
    const fullPath = path.join(contentDir, relativePath);
    totalCount++;
    
    if (fixYamlFrontmatter(fullPath)) {
      fixedCount++;
    }
  });
  
  console.log(`\n📊 Summary:`);
  console.log(`   Total files processed: ${totalCount}`);
  console.log(`   Files fixed: ${fixedCount}`);
  console.log(`   Files unchanged: ${totalCount - fixedCount}`);
  
  if (fixedCount > 0) {
    console.log('\n✅ YAML frontmatter issues have been fixed!');
    console.log('   You can now restart the development server.');
  } else {
    console.log('\n✅ No YAML issues found.');
  }
}

if (require.main === module) {
  main();
}

module.exports = { fixYamlFrontmatter };