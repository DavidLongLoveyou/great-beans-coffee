const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixYamlSpacing(content) {
  let fixed = content;
  
  // Fix missing spaces after arrays that are followed by other YAML properties
  // Pattern: array ending with ']' followed immediately by a property name (no newline)
  const arraySpacingPattern = /(\])([\w]+:)/g;
  fixed = fixed.replace(arraySpacingPattern, '$1\n$2');
  
  // Fix specific patterns found in the error logs
  // Pattern: ']harvestSeason:' -> ']\nharvestSeason:'
  fixed = fixed.replace(/\]harvestSeason:/g, ']\nharvestSeason:');
  
  // Pattern: ']processingMethod:' -> ']\nprocessingMethod:'
  fixed = fixed.replace(/\]processingMethod:/g, ']\nprocessingMethod:');
  
  // Pattern: ']varietals:' -> ']\nvarietals:'
  fixed = fixed.replace(/\]varietals:/g, ']\nvarietals:');
  
  // Pattern: ']cupScore:' -> ']\ncupScore:'
  fixed = fixed.replace(/\]cupScore:/g, ']\ncupScore:');
  
  // Pattern: ']targetMarkets:' -> ']\ntargetMarkets:'
  fixed = fixed.replace(/\]targetMarkets:/g, ']\ntargetMarkets:');
  
  return fixed;
}

// Get all MDX files in content directory
const contentDir = path.join(__dirname, '..', 'content');
const mdxFiles = glob.sync('**/*.mdx', { cwd: contentDir });

console.log(`Checking ${mdxFiles.length} MDX files for YAML spacing issues...`);

let fixedCount = 0;

mdxFiles.forEach(file => {
  const filePath = path.join(contentDir, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixYamlSpacing(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed YAML spacing: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nYAML spacing fix completed!`);
console.log(`Fixed ${fixedCount} files.`);