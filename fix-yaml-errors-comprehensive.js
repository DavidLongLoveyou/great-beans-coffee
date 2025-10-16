const fs = require('fs');
const path = require('path');

// List of files with YAML errors from build output (updated)
const errorFiles = [
  'blog/en/vietnamese-arabica-specialty-coffee-revolution.mdx',
  'legal/en/terms-of-service.mdx',
  'market-reports/en/coffee-price-volatility-analysis-2024.mdx',
  'market-reports/en/coffee-supply-chain-resilience-risk-management-2024.mdx',
  'market-reports/en/vietnam-robusta-market-analysis-2024.mdx',
  'origin-stories/en/buon-ma-thuot-robusta-legacy.mdx',
  'origin-stories/en/da-lat-arabica-highlands.mdx',
  'origin-stories/en/dak-lak-central-highlands.mdx',
  'origin-stories/en/dak-lak-coffee-heritage.mdx',
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

function fixYamlErrors() {
  let totalFixed = 0;
  
  errorFiles.forEach(relativePath => {
    const filePath = path.join('./content', relativePath);
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${filePath}`);
      return;
    }
    
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      let changes = [];
      
      // Fix 1: Pricing structure issues (nested mappings)
      content = content.replace(
        /pricing:\s*startingPrice:\s*(\d+)/g,
        'pricing:\n  startingPrice: $1'
      );
      
      // Fix 2: Quote unquoted strings that contain special characters
      // Common patterns that need quoting
      const patternsToQuote = [
        // Descriptions with colons, quotes, or special chars
        /description:\s*([^'\n][^:\n]*[:'"][^'\n]*)/g,
        // Titles with colons or special chars  
        /title:\s*([^'\n][^:\n]*[:'"][^'\n]*)/g,
        // Author bios with pipes or special chars
        /authorBio:\s*([^|\n][^:\n]*[|:'][^|\n]*)/g,
        // SEO descriptions
        /seoDescription:\s*([^'\n][^:\n]*[:'"][^'\n]*)/g,
        // SEO titles
        /seoTitle:\s*([^'\n][^:\n]*[:'"][^'\n]*)/g,
        // Excerpts
        /excerpt:\s*([^'\n][^:\n]*[:'"][^'\n]*)/g
      ];
      
      patternsToQuote.forEach(pattern => {
        content = content.replace(pattern, (match, value) => {
          const key = match.split(':')[0];
          const trimmedValue = value.trim();
          
          // Skip if already quoted or is a block scalar
          if (trimmedValue.startsWith("'") || trimmedValue.startsWith('"') || 
              trimmedValue.startsWith('|') || trimmedValue.startsWith('>')) {
            return match;
          }
          
          changes.push(`${key}: quoted value`);
          return `${key}: '${trimmedValue}'`;
        });
      });
      
      // Fix 3: Fix multiline strings that should use block scalars
      content = content.replace(
        /description:\s*'([^']*\n[^']*)*'/g,
        (match, value) => {
          changes.push('description: converted to block scalar');
          return `description: >\n  ${value.replace(/\n/g, '\n  ')}`;
        }
      );
      
      // Fix 4: Fix array formatting issues
      content = content.replace(
        /tags:\s*\n(\s*-\s*'[^']*'\s*\n)+/g,
        (match) => {
          // Ensure proper indentation for array items
          return match.replace(/^(\s*)-/gm, '  -');
        }
      );
      
      // Fix 5: Fix keywords array formatting
      content = content.replace(
        /keywords:\s*\n(\s*-\s*'[^']*'\s*\n)+/g,
        (match) => {
          return match.replace(/^(\s*)-/gm, '  -');
        }
      );
      
      // Fix 6: Fix gallery array formatting
      content = content.replace(
        /gallery:\s*\n(\s*-\s*'[^']*'\s*\n)+/g,
        (match) => {
          return match.replace(/^(\s*)-/gm, '  -');
        }
      );
      
      // Fix 7: Fix inline arrays that should be block arrays (block-seq-ind error)
      content = content.replace(
        /(gallery|tags|keywords):\s*-\s*'([^']+)'\s*-\s*'([^']+)'[^'\n]*/g,
        (match, key, first, rest) => {
          // Split the inline array into proper block format
          const items = match.match(/-\s*'[^']+'/g) || [];
          const formattedItems = items.map(item => `  ${item}`).join('\n');
          changes.push(`${key}: converted inline array to block format`);
          return `${key}:\n${formattedItems}`;
        }
      );
      
      // Fix 8: Fix gallery arrays that are on same line
      content = content.replace(
        /gallery:\s*-\s*'([^']+)'(\s*-\s*'[^']+')*/g,
        (match) => {
          const items = match.match(/-\s*'[^']+'/g) || [];
          const formattedItems = items.map(item => `  ${item}`).join('\n');
          changes.push('gallery: fixed inline array formatting');
          return `gallery:\n${formattedItems}`;
        }
      );
      
      // Fix 9: Fix any remaining inline arrays
      content = content.replace(
        /(\w+):\s*(-\s*'[^']+'\s*)+/g,
        (match, key) => {
          if (match.includes('\n')) return match; // Already multiline
          const items = match.match(/-\s*'[^']+'/g) || [];
          if (items.length > 1) {
            const formattedItems = items.map(item => `  ${item}`).join('\n');
            changes.push(`${key}: fixed inline array`);
            return `${key}:\n${formattedItems}`;
          }
          return match;
        }
      );
      
      // Fix 10: Ensure proper spacing after colons
      content = content.replace(/(\w+):\s*([^'\s>|])/g, '$1: $2');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${filePath}`);
        if (changes.length > 0) {
          console.log(`   Changes: ${changes.join(', ')}`);
        }
        totalFixed++;
      } else {
        console.log(`ℹ️  No changes needed for ${filePath}`);
      }
      
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n🎉 Fixed ${totalFixed} files out of ${errorFiles.length} total files.`);
}

// Run the fix
console.log('🔧 Starting YAML error fixes...\n');
fixYamlErrors();
console.log('\n✨ YAML fix process completed!');