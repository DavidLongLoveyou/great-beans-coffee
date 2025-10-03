const fs = require('fs');
const path = require('path');

const glob = require('glob');

function fixRelatedPostsArrays() {
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

      // Fix relatedPosts arrays that are incorrectly formatted
      const relatedPostsRegex = /relatedPosts:\s*\n\s*\[([^\]]+)\]/gm;
      if (relatedPostsRegex.test(content)) {
        content = content.replace(relatedPostsRegex, (match, items) => {
          // Clean the items and put them on the same line
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
        });
        hasChanges = true;
      }

      // Also fix single line relatedPosts that might have formatting issues
      const singleLineRegex = /relatedPosts:\s*\[([^\]]+)\]/g;
      content = content.replace(singleLineRegex, (match, items) => {
        const cleanItems = items
          .split(',')
          .map(item => item.trim().replace(/['"]/g, "'"));
        return `relatedPosts: [${cleanItems.join(', ')}]`;
      });

      // Write the fixed content back if there were changes
      if (hasChanges) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Fixed relatedPosts in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error fixing ${filePath}:`, error.message);
    }
  });
}

console.log('Starting relatedPosts array fixes...');
fixRelatedPostsArrays();
console.log('relatedPosts fixes completed!');
