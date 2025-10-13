const fs = require('fs');
const path = require('path');

function fixContentlayerImports() {
  const contentlayerDir = path.join(
    process.cwd(),
    '.contentlayer',
    'generated'
  );

  if (!fs.existsSync(contentlayerDir)) {
    console.log('No .contentlayer directory found');
    return;
  }

  function processDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (item.endsWith('_index.mjs')) {
        fixImportsInFile(itemPath);
      }
    }
  }

  function fixImportsInFile(filePath) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');

      // Replace the problematic import syntax
      const originalContent = content;
      content = content.replace(
        /import\s+(\w+)\s+from\s+'([^']+)'\s+with\s+\{\s*type:\s*'json'\s*\}/g,
        "import $1 from '$2'"
      );

      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed imports in: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  }

  processDirectory(contentlayerDir);
  console.log('Contentlayer import fixes completed');
}

fixContentlayerImports();
