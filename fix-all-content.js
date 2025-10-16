const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

function fixMultilineDescription(content) {
  // Fix multiline descriptions that break YAML
  return content.replace(
    /description: >\s*\n\s*([^\n]+)\s*\n\s*publishedAt:/g,
    'description: "$1"\npublishedAt:'
  );
}

function fixMixedQuotes(content) {
  // Fix mixed quote types in frontmatter
  const frontmatterMatch = content.match(/^(---\n[\s\S]*?\n---)([\s\S]*)/);
  if (!frontmatterMatch) return content;
  
  let frontmatter = frontmatterMatch[1];
  const restContent = frontmatterMatch[2];
  
  // Standardize quotes - use double quotes for all string values
  frontmatter = frontmatter.replace(/: '([^']*?)'/g, ': "$1"');
  
  return frontmatter + restContent;
}

function addMissingFrontmatter(filePath, content) {
  // If no frontmatter, add basic structure
  if (!content.match(/^---\n/)) {
    const fileName = path.basename(filePath, '.mdx');
    const locale = filePath.includes('/en/') ? 'en' : 
                   filePath.includes('/vi/') ? 'vi' : 
                   filePath.includes('/ja/') ? 'ja' : 
                   filePath.includes('/de/') ? 'de' : 'en';
    
    let contentType = 'ServicePage';
    let category = 'BUSINESS_SERVICE';
    
    if (filePath.includes('origin-stories')) {
      contentType = 'OriginStory';
      category = 'ORIGIN_STORY';
    }
    
    const basicFrontmatter = `---
title: "${fileName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}"
description: "Content description for ${fileName}"
publishedAt: "2024-01-01"
updatedAt: "2024-01-01"
author: "The Great Beans Team"
category: "${category}"
locale: "${locale}"
featured: false
${contentType === 'OriginStory' ? `region: "Vietnam"
province: "Unknown"
altitude: "1000-1500m"
coffeeVariety: "Arabica"` : ''}
---
`;
    
    return basicFrontmatter + '\n' + content;
  }
  
  return content;
}

function addMissingFields(content, filePath) {
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return content;
  
  try {
    const frontmatterContent = frontmatterMatch[1];
    const restContent = content.substring(frontmatterMatch[0].length);
    const frontmatter = yaml.load(frontmatterContent);
    
    let hasChanges = false;
    
    // Add missing fields for origin stories
    if (filePath.includes('origin-stories')) {
      if (!frontmatter.province) {
        frontmatter.province = "Unknown Province";
        hasChanges = true;
      }
      if (!frontmatter.altitude) {
        frontmatter.altitude = "1000-1500m";
        hasChanges = true;
      }
      if (!frontmatter.region) {
        frontmatter.region = "Vietnam";
        hasChanges = true;
      }
      if (!frontmatter.coffeeVariety) {
        frontmatter.coffeeVariety = "Arabica";
        hasChanges = true;
      }
    }
    
    // Add missing common fields
    if (!frontmatter.locale) {
      const locale = filePath.includes('/en/') ? 'en' : 
                     filePath.includes('/vi/') ? 'vi' : 
                     filePath.includes('/ja/') ? 'ja' : 
                     filePath.includes('/de/') ? 'de' : 'en';
      frontmatter.locale = locale;
      hasChanges = true;
    }
    
    if (!frontmatter.author) {
      frontmatter.author = "The Great Beans Team";
      hasChanges = true;
    }
    
    if (!frontmatter.publishedAt) {
      frontmatter.publishedAt = "2024-01-01";
      hasChanges = true;
    }
    
    if (!frontmatter.description) {
      frontmatter.description = `Content description for ${path.basename(filePath, '.mdx')}`;
      hasChanges = true;
    }
    
    if (hasChanges) {
      const newFrontmatter = yaml.dump(frontmatter, { 
        indent: 2,
        lineWidth: -1,
        quotingType: '"'
      });
      
      return `---\n${newFrontmatter}---${restContent}`;
    }
    
  } catch (e) {
    console.log(`Error processing ${filePath}: ${e.message}`);
  }
  
  return content;
}

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Apply fixes in order
    content = addMissingFrontmatter(filePath, content);
    content = fixMultilineDescription(content);
    content = fixMixedQuotes(content);
    content = addMissingFields(content, filePath);
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed: ${filePath}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Error fixing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main function
function fixAllContent() {
  console.log('🔧 Fixing all content issues...\n');
  
  const contentPattern = 'content/**/*.mdx';
  const files = glob.sync(contentPattern);
  
  let fixedCount = 0;
  
  files.forEach(file => {
    if (fixFile(file)) {
      fixedCount++;
    }
  });
  
  console.log(`\n✨ Fixed ${fixedCount} out of ${files.length} files`);
}

// Run fixes
fixAllContent();