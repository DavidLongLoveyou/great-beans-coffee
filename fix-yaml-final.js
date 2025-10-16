const fs = require('fs');
const path = require('path');

// Get all MDX files from content directory
function getAllMdxFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllMdxFiles(fullPath));
    } else if (item.endsWith('.mdx')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

function fixYamlFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    let changes = [];

    // Split content into frontmatter and body
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      return false; // No frontmatter found
    }

    let frontmatter = frontmatterMatch[1];
    const body = frontmatterMatch[2];

    // Fix 1: Quote unquoted strings with special characters (line 3 errors)
    frontmatter = frontmatter.replace(
      /^(\s*)(\w+):\s*([^'"\s>|][^:\n]*[^\s\n])$/gm,
      (match, indent, key, value) => {
        // Skip if already quoted, is a number/boolean, or is a YAML construct
        if (value.match(/^['"]/) || value.match(/^\d+$/) || value.match(/^(true|false)$/) || value.match(/^[>|]/)) {
          return match;
        }
        // Quote if contains special characters or is very long
        if (value.match(/[&*{}[\]|>%@`]/) || value.length > 100) {
          changes.push(`${key}: quoted special characters`);
          return `${indent}${key}: '${value}'`;
        }
        return match;
      }
    );

    // Fix 2: Fix nested mappings in compact format (pricing sections)
    frontmatter = frontmatter.replace(
      /^(\s*)(pricing|features|specifications):\s*\{([^}]+)\}$/gm,
      (match, indent, key, content) => {
        const items = content.split(',').map(item => {
          const [k, v] = item.split(':').map(s => s.trim());
          return `${indent}  ${k}: ${v}`;
        });
        changes.push(`${key}: converted compact mapping to block`);
        return `${indent}${key}:\n${items.join('\n')}`;
      }
    );

    // Fix 3: Fix inline arrays (block-seq-ind errors)
    frontmatter = frontmatter.replace(
      /^(\s*)(gallery|tags|keywords|regions|varieties|processingMethods):\s*-\s*'([^']+)'(\s*-\s*'[^']+')*/gm,
      (match, indent, key, firstItem, rest) => {
        const items = [firstItem];
        const restMatches = rest.match(/-\s*'([^']+)'/g) || [];
        items.push(...restMatches.map(item => item.match(/'([^']+)'/)[1]));
        
        const formattedItems = items.map(item => `${indent}  - '${item}'`).join('\n');
        changes.push(`${key}: converted inline array to block`);
        return `${indent}${key}:\n${formattedItems}`;
      }
    );

    // Fix 4: Fix arrays that start on same line as key
    frontmatter = frontmatter.replace(
      /^(\s*)(gallery|tags|keywords):\s*\[\s*'([^']+)'[^\]]*\]$/gm,
      (match, indent, key, firstItem) => {
        const items = match.match(/'([^']+)'/g) || [];
        const formattedItems = items.map(item => `${indent}  - ${item}`).join('\n');
        changes.push(`${key}: converted bracket array to block`);
        return `${indent}${key}:\n${formattedItems}`;
      }
    );

    // Fix 5: Fix multiline strings that need proper block scalar format
    frontmatter = frontmatter.replace(
      /^(\s*)(\w+):\s*>\s*\n((?:\s*[^\n]+\n?)*)/gm,
      (match, indent, key, contentBlock) => {
        const lines = contentBlock.split('\n').filter(line => line.trim());
        if (lines.length === 0) return match;
        
        const properIndent = indent + '  ';
        const formattedLines = lines.map(line => {
          const trimmed = line.trim();
          return trimmed ? properIndent + trimmed : '';
        }).filter(line => line).join('\n');
        
        if (formattedLines && formattedLines !== contentBlock.trim()) {
          changes.push(`${key}: fixed block scalar indentation`);
          return `${indent}${key}: >\n${formattedLines}\n`;
        }
        return match;
      }
    );

    // Fix 6: Ensure proper spacing and formatting
    frontmatter = frontmatter.replace(/(\w+):\s*([^'\s>|])/g, '$1: $2');

    // Reconstruct content
    const newContent = `---\n${frontmatter}\n---\n${body}`;

    if (newContent !== originalContent) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed ${path.relative('content', filePath)}`);
      if (changes.length > 0) {
        console.log(`   Changes: ${changes.join(', ')}`);
      }
      return true;
    } else {
      console.log(`ℹ️  No changes needed for ${path.relative('content', filePath)}`);
      return false;
    }
  } catch (error) {
    console.log(`⚠️  Error processing ${path.relative('content', filePath)}: ${error.message}`);
    return false;
  }
}

// Process all MDX files
console.log('🔧 Starting final YAML fix process for all MDX files...\n');

const allMdxFiles = getAllMdxFiles('content');
let fixedCount = 0;
let totalCount = allMdxFiles.length;

for (const filePath of allMdxFiles) {
  if (fixYamlFile(filePath)) {
    fixedCount++;
  }
}

console.log(`\n🎉 Fixed ${fixedCount} files out of ${totalCount} total MDX files.`);
console.log('\n✨ Final YAML fix process completed!');