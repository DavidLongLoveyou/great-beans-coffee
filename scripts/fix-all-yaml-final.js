const fs = require('fs');
const path = require('path');

const glob = require('glob');

function fixAllYamlFinal() {
  // Find all MDX files
  const mdxFiles = glob.sync('content/**/*.mdx', { cwd: process.cwd() });

  mdxFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      return;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');
      let hasChanges = false;

      // Remove all invisible characters
      const originalContent = content;
      content = content.replace(/[\u200B-\u200D\uFEFF]/g, '');
      content = content.replace(/\r\n/g, '\n');
      content = content.replace(/\r/g, '\n');

      if (content !== originalContent) {
        hasChanges = true;
      }

      // Fix all array-like structures in YAML frontmatter
      // This regex finds arrays in YAML and normalizes them
      content = content.replace(
        /^(\s*\w+):\s*\[([^\]]+)\]\s*$/gm,
        (match, key, items) => {
          // Clean and normalize items
          const cleanItems = items.split(',').map(item => {
            const cleaned = item.trim().replace(/^['"]|['"]$/g, '');
            return `'${cleaned}'`;
          });
          hasChanges = true;
          return `${key}: [${cleanItems.join(', ')}]`;
        }
      );

      // Fix any remaining trailing commas in arrays
      content = content.replace(/,(\s*\])/g, '$1');

      // Fix any malformed arrays that span multiple lines
      content = content.replace(
        /^(\s*\w+):\s*\n\s*\[([^\]]+)\]/gm,
        (match, key, items) => {
          const cleanItems = items.split(',').map(item => {
            const cleaned = item
              .trim()
              .replace(/^['"]|['"]$/g, '')
              .replace(/\n/g, '');
            return `'${cleaned}'`;
          });
          hasChanges = true;
          return `${key}: [${cleanItems.join(', ')}]`;
        }
      );

      // Write the fixed content back if there were changes
      if (hasChanges) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed YAML in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

console.log('Starting final comprehensive YAML fixes...');
fixAllYamlFinal();
console.log('Final YAML fixes completed!');
