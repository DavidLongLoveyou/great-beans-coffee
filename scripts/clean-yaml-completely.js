const fs = require('fs');
const path = require('path');

// Files with specific YAML errors
const problematicFiles = [
  'content/blog/en/specialty-coffee-market-trends-2024.mdx',
  'content/blog/en/sustainable-coffee-farming-climate-adaptation.mdx',
  'content/blog/en/vietnam-coffee-export-regulations-2024.mdx',
  'content/blog/en/global-coffee-supply-chain-disruptions-2024.mdx',
];

function cleanYamlCompletely() {
  problematicFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${fullPath}`);
      return;
    }

    try {
      let content = fs.readFileSync(fullPath, 'utf8');

      // Remove all invisible characters and normalize
      content = content.replace(/[\u200B-\u200D\uFEFF]/g, ''); // Remove zero-width characters
      content = content.replace(/\r\n/g, '\n'); // Normalize line endings
      content = content.replace(/\r/g, '\n'); // Convert remaining \r to \n

      // Fix relatedPosts specifically - rewrite the entire line cleanly
      content = content.replace(
        /relatedPosts:\s*\[([^\]]+)\]/g,
        (match, items) => {
          // Split by comma, clean each item, and rebuild
          const cleanItems = items.split(',').map(item => {
            // Remove all quotes and whitespace, then add single quotes
            const cleaned = item.trim().replace(/['"]/g, '');
            return `'${cleaned}'`;
          });
          return `relatedPosts: [${cleanItems.join(', ')}]`;
        }
      );

      // Write the cleaned content back
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log(`Cleaned YAML in: ${filePath}`);
    } catch (error) {
      console.error(`Error cleaning ${filePath}:`, error.message);
    }
  });
}

console.log('Starting complete YAML cleanup...');
cleanYamlCompletely();
console.log('Complete YAML cleanup finished!');
