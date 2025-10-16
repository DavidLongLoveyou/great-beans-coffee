const fs = require('fs');
const path = require('path');

// Files with errors from latest build
const errorFiles = [
  'origin-stories/en/da-lat-arabica-highlands.mdx',
  'origin-stories/en/dak-lak-central-highlands.mdx', 
  'origin-stories/en/dak-lak-robusta-heritage.mdx',
  'origin-stories/en/gia-lai-sustainable-robusta.mdx',
  'origin-stories/en/kon-tum-highland-arabica.mdx',
  'origin-stories/en/lam-dong-arabica-excellence.mdx',
  'origin-stories/en/son-la-mountain-arabica.mdx',
  'services/de/private-label-kaffee-loesungen.mdx',
  'services/en/oem-coffee-manufacturing.mdx',
  'services/en/private-label-coffee-solutions.mdx',
  'services/en/specialty-arabica-sourcing.mdx',
  'services/ja/private-label-coffee-solutions.mdx'
];

function fixYamlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = [];

    // Fix 1: Fix broken gallery arrays (corrupted by previous script)
    content = content.replace(
      /gallery:\s*-\s*'([^']+)'\s*-\s*'([^']+)'([^']*)/g,
      (match, first, second, rest) => {
        // Extract all items from the corrupted line
        const allItems = [first, second];
        const restItems = rest.match(/'[^']+'/g) || [];
        allItems.push(...restItems.map(item => item.slice(1, -1)));
        
        const formattedItems = allItems.map(item => `  - '${item}'`).join('\n');
        changes.push('gallery: fixed corrupted array');
        return `gallery:\n${formattedItems}`;
      }
    );

    // Fix 2: Fix inline arrays that should be block format
    content = content.replace(
      /^(\s*)(gallery|tags|keywords):\s*-\s*'([^']+)'(\s*-\s*'[^']+')*/gm,
      (match, indent, key, firstItem, rest) => {
        const items = [firstItem];
        const restMatches = rest.match(/-\s*'([^']+)'/g) || [];
        items.push(...restMatches.map(item => item.match(/'([^']+)'/)[1]));
        
        const formattedItems = items.map(item => `${indent}  - '${item}'`).join('\n');
        changes.push(`${key}: converted to block format`);
        return `${indent}${key}:\n${formattedItems}`;
      }
    );

    // Fix 3: Quote unquoted strings with special characters
    content = content.replace(
      /^(\s*)(\w+):\s*([^'"\s>|][^:\n]*[^\s\n])$/gm,
      (match, indent, key, value) => {
        // Skip if already quoted or is a number/boolean
        if (value.match(/^['"]/) || value.match(/^\d+$/) || value.match(/^(true|false)$/)) {
          return match;
        }
        // Quote if contains special characters
        if (value.match(/[&*{}[\]|>%@`]/)) {
          changes.push(`${key}: quoted special characters`);
          return `${indent}${key}: '${value}'`;
        }
        return match;
      }
    );

    // Fix 4: Fix multiline strings that need proper block scalar format
    content = content.replace(
      /^(\s*)(\w+):\s*>\s*\n((?:\s*[^\n]+\n)*)/gm,
      (match, indent, key, content_block) => {
        // Ensure proper indentation for block scalar content
        const lines = content_block.split('\n').filter(line => line.trim());
        const properIndent = indent + '  ';
        const formattedLines = lines.map(line => {
          const trimmed = line.trim();
          return trimmed ? properIndent + trimmed : '';
        }).join('\n');
        
        if (formattedLines !== content_block.trim()) {
          changes.push(`${key}: fixed block scalar indentation`);
          return `${indent}${key}: >\n${formattedLines}\n`;
        }
        return match;
      }
    );

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${filePath}`);
      if (changes.length > 0) {
        console.log(`   Changes: ${changes.join(', ')}`);
      }
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${filePath}`);
      return false;
    }
  } catch (error) {
    console.log(`⚠️  Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Process all files
let fixedCount = 0;
let totalCount = 0;

console.log('🔧 Starting precise YAML fix process...\n');

for (const file of errorFiles) {
  const filePath = path.join('content', file);
  totalCount++;
  
  if (fs.existsSync(filePath)) {
    if (fixYamlFile(filePath)) {
      fixedCount++;
    }
  } else {
    console.log(`⚠️  File not found: ${filePath}`);
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files out of ${totalCount} total files.`);
console.log('\n✨ Precise YAML fix process completed!');