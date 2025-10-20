const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function fixDuplicateFrontmatter() {
  const contentDir = path.join(__dirname, '..', 'content');
  let fixedFiles = 0;
  let totalFiles = 0;

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        totalFiles++;
        if (fixFile(fullPath)) {
          fixedFiles++;
        }
      }
    }
  }

  function fixFile(filePath) {
    const relativePath = path.relative(contentDir, filePath);

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Find all frontmatter blocks (including those that might be separated)
      const frontmatterRegex = /---\n([\s\S]*?)\n---/g;
      const matches = [];
      let match;

      while ((match = frontmatterRegex.exec(content)) !== null) {
        matches.push({
          fullMatch: match[0],
          yamlContent: match[1],
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        });
      }

      if (matches.length <= 1) {
        return false; // No duplicate frontmatter
      }

      console.log(
        `🔧 Fixing duplicate frontmatter in ${relativePath} (${matches.length} blocks found)`
      );

      // Parse all YAML blocks
      const parsedBlocks = [];
      for (let i = 0; i < matches.length; i++) {
        try {
          const parsed = yaml.load(matches[i].yamlContent);
          if (parsed && typeof parsed === 'object') {
            parsedBlocks.push(parsed);
          }
        } catch (error) {
          console.log(
            `⚠️ Error parsing YAML block ${i + 1} in ${relativePath}: ${error.message}`
          );
        }
      }

      if (parsedBlocks.length === 0) {
        console.log(`❌ No valid YAML blocks found in ${relativePath}`);
        return false;
      }

      // Merge all blocks (later blocks override earlier ones)
      const mergedMetadata = {};
      for (const block of parsedBlocks) {
        Object.assign(mergedMetadata, block);
      }

      // Remove all existing frontmatter blocks
      let cleanContent = content;

      // Sort matches by start index in descending order to remove from end to beginning
      matches.sort((a, b) => b.startIndex - a.startIndex);

      for (const match of matches) {
        cleanContent =
          cleanContent.substring(0, match.startIndex) +
          cleanContent.substring(match.endIndex);
      }

      // Remove any leading whitespace/newlines
      cleanContent = cleanContent.replace(/^\s+/, '');

      // Generate new frontmatter
      const yamlString = yaml.dump(mergedMetadata, {
        lineWidth: -1,
        noRefs: true,
        quotingType: '"',
        forceQuotes: false,
        sortKeys: false,
      });

      // Reconstruct the file
      const newContent = `---\n${yamlString}---\n${cleanContent}`;

      // Write the fixed content
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed ${relativePath}`);

      return true;
    } catch (error) {
      console.log(`❌ Error processing ${relativePath}: ${error.message}`);
      return false;
    }
  }

  scanDirectory(contentDir);

  console.log(`\n📊 Summary:`);
  console.log(`  Total files checked: ${totalFiles}`);
  console.log(`  Files with duplicate frontmatter fixed: ${fixedFiles}`);
}

// Run the fix
console.log('🔧 Starting duplicate frontmatter fix...\n');
fixDuplicateFrontmatter();
console.log('\n✅ Duplicate frontmatter fixes completed!');
