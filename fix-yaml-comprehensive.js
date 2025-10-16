#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

/**
 * Comprehensive YAML Error Fixer for MDX Files
 * Fixes all types of YAML frontmatter issues
 */

const problematicFiles = [
  'content/origin-stories/en/kon-tum-highland-arabica.mdx',
  'content/origin-stories/en/lam-dong-arabica-excellence.mdx', 
  'content/origin-stories/en/son-la-mountain-arabica.mdx',
  'content/services/de/private-label-kaffee-loesungen.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx',
  'content/services/en/private-label-coffee-solutions.mdx',
  'content/services/en/specialty-arabica-sourcing.mdx',
  'content/services/ja/private-label-coffee-solutions.mdx'
];

function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: '', body: content };
  }
  
  return {
    frontmatter: match[1],
    body: match[2]
  };
}

function fixYamlSyntax(yamlContent) {
  let fixed = yamlContent;
  
  // Fix 1: Handle multiline descriptions with proper block scalar syntax
  fixed = fixed.replace(
    /description:\s*>\s*\n([^:]+?)(?=\n[a-zA-Z])/gms,
    (match, desc) => {
      const cleanDesc = desc.trim().replace(/\n\s*/g, ' ');
      return `description: "${cleanDesc}"`;
    }
  );
  
  // Fix 2: Fix array syntax - convert inline arrays to block format
  fixed = fixed.replace(
    /(\w+):\s*-\s*'([^']+)'/g,
    (match, key, value) => {
      return `${key}:\n  - '${value}'`;
    }
  );
  
  // Fix 3: Fix quoted strings that span multiple lines
  fixed = fixed.replace(
    /'([^']*\n[^']*?)'/gms,
    (match, content) => {
      const cleanContent = content.replace(/\n\s*/g, ' ').trim();
      return `"${cleanContent}"`;
    }
  );
  
  // Fix 4: Ensure proper indentation for nested objects
  const lines = fixed.split('\n');
  const fixedLines = [];
  let inNestedObject = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Check if this is a key with nested content
    if (trimmed.includes(':') && !trimmed.startsWith('-') && !trimmed.includes('"')) {
      const [key, value] = trimmed.split(':');
      if (value && value.trim() && !value.trim().startsWith('"') && !value.trim().startsWith("'")) {
        // This might be a nested object or array
        if (value.trim().startsWith('-')) {
          // It's an array
          fixedLines.push(`${key}:`);
          fixedLines.push(`  ${value.trim()}`);
          continue;
        }
      }
    }
    
    fixedLines.push(line);
  }
  
  return fixedLines.join('\n');
}

function validateAndFixYaml(yamlContent) {
  try {
    // Try to parse the original YAML
    yaml.load(yamlContent);
    return yamlContent; // If it parses, return as-is
  } catch (error) {
    console.log(`YAML parsing failed, attempting to fix: ${error.message}`);
    
    // Apply fixes
    let fixed = fixYamlSyntax(yamlContent);
    
    try {
      // Try to parse the fixed YAML
      yaml.load(fixed);
      return fixed;
    } catch (secondError) {
      console.log(`Second attempt failed: ${secondError.message}`);
      
      // More aggressive fixes
      fixed = fixed
        // Remove problematic characters
        .replace(/[^\x00-\x7F]/g, '')
        // Fix common quote issues
        .replace(/'/g, '"')
        // Ensure proper spacing around colons
        .replace(/:\s*([^"\n]+)$/gm, ': "$1"')
        // Fix array formatting
        .replace(/:\s*-\s*/g, ':\n  - ');
      
      try {
        yaml.load(fixed);
        return fixed;
      } catch (finalError) {
        console.log(`Final attempt failed: ${finalError.message}`);
        return yamlContent; // Return original if all fixes fail
      }
    }
  }
}

function fixFile(filePath) {
  try {
    console.log(`\n🔧 Processing: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${filePath}`);
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { frontmatter, body } = extractFrontmatter(content);
    
    if (!frontmatter) {
      console.log(`⚠️  No frontmatter found in: ${filePath}`);
      return false;
    }
    
    const fixedFrontmatter = validateAndFixYaml(frontmatter);
    
    if (fixedFrontmatter !== frontmatter) {
      const newContent = `---\n${fixedFrontmatter}\n---\n${body}`;
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed YAML in: ${filePath}`);
      return true;
    } else {
      console.log(`✓ No changes needed: ${filePath}`);
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Error processing ${filePath}: ${error.message}`);
    return false;
  }
}

// Main execution
console.log('🔍 Starting comprehensive YAML error fixing...\n');

let fixedCount = 0;
let totalFiles = problematicFiles.length;

for (const file of problematicFiles) {
  if (fixFile(file)) {
    fixedCount++;
  }
}

console.log(`\n📊 Summary:`);
console.log(`   Total files processed: ${totalFiles}`);
console.log(`   Files fixed: ${fixedCount}`);
console.log(`   Files unchanged: ${totalFiles - fixedCount}`);

if (fixedCount > 0) {
  console.log('\n✨ YAML fixes completed! Please restart your dev server.');
} else {
  console.log('\n💡 No fixes were needed or possible.');
}