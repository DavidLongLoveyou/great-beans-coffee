const fs = require('fs');
const path = require('path');

const glob = require('glob');

function fixYamlErrors() {
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

      // Fix chartTypes lines by removing any invisible characters and ensuring proper formatting
      const chartTypesRegex = /chartTypes:\s*\[([^\]]+)\]\s*$/gm;
      if (chartTypesRegex.test(content)) {
        content = content.replace(chartTypesRegex, (match, items) => {
          const cleanItems = items
            .split(',')
            .map(item => item.trim().replace(/['"]/g, "'"));
          return `chartTypes: [${cleanItems.join(', ')}]`;
        });
        hasChanges = true;
      }

      // Fix flavorProfile lines with quotes
      const flavorProfileRegex = /flavorProfile:\s*["']([^"']+)["']\s*$/gm;
      if (flavorProfileRegex.test(content)) {
        content = content.replace(flavorProfileRegex, (match, profile) => {
          return `flavorProfile: "${profile}"`;
        });
        hasChanges = true;
      }

      // Fix array endings with trailing commas
      const arrayEndingRegex = /(\s+['"]\w+['"]),(\s*\])/gm;
      if (arrayEndingRegex.test(content)) {
        content = content.replace(arrayEndingRegex, '$1$2');
        hasChanges = true;
      }

      // Fix relatedPosts arrays that are incorrectly formatted (multiline to single line)
      const relatedPostsMultilineRegex = /relatedPosts:\s*\n\s*\[([^\]]+)\]/gm;
      if (relatedPostsMultilineRegex.test(content)) {
        content = content.replace(
          relatedPostsMultilineRegex,
          (match, items) => {
            const cleanItems = items
              .split(',')
              .map(item =>
                item
                  .trim()
                  .replace(/['"]/g, "'")
                  .replace(/\n/g, '')
                  .replace(/\s+/g, ' ')
              );
            return `relatedPosts: [${cleanItems.join(', ')}]`;
          }
        );
        hasChanges = true;
      }

      // Fix single line relatedPosts that might have formatting issues
      const singleLineRegex = /relatedPosts:\s*\[([^\]]+)\]/g;
      content = content.replace(singleLineRegex, (match, items) => {
        const cleanItems = items
          .split(',')
          .map(item => item.trim().replace(/['"]/g, "'"));
        return `relatedPosts: [${cleanItems.join(', ')}]`;
      });

      // Fix any remaining YAML array syntax issues
      // Remove any trailing commas before closing brackets
      content = content.replace(/,(\s*\])/g, '$1');

      // Fix any double quotes that should be single quotes in arrays
      content = content.replace(
        /\[([^\]]*)"([^"]*)"([^\]]*)\]/g,
        (match, before, middle, after) => {
          return `[${before}'${middle}'${after}]`;
        }
      );

      // Write the fixed content back if there were changes
      if (hasChanges) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed YAML errors in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

console.log('Starting comprehensive YAML error fixes...');
fixYamlErrors();
console.log('YAML error fixes completed!');
