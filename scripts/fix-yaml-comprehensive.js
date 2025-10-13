const fs = require('fs');
const path = require('path');

// Function to recursively find all MDX files
function findMDXFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMDXFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Function to fix YAML frontmatter issues
function fixYAMLIssues(content) {
  let fixed = content;

  // Fix carriage return issues in YAML values
  fixed = fixed.replace(/: ([^'\[\n]+)\r/g, ': $1');
  fixed = fixed.replace(/: '([^']+)'\r/g, ": '$1'");
  fixed = fixed.replace(/: "([^"]+)"\r/g, ': "$1"');
  fixed = fixed.replace(/: (\d+)\r/g, ': $1');
  fixed = fixed.replace(/: (true|false)\r/g, ': $1');

  // Fix array syntax issues - ensure proper spacing and remove invalid entries
  fixed = fixed.replace(/chartTypes:\s*\[([^\]]+)\]/g, (match, content) => {
    // Clean up the array content
    const cleanContent = content
      .split(',')
      .map(item => item.trim())
      .filter(
        item => item && item !== "'--'" && item !== '"--"' && item !== '--'
      )
      .join(', ');
    return `chartTypes: [${cleanContent}]`;
  });

  // Fix other array fields
  fixed = fixed.replace(/tags:\s*\[([^\]]+)\]/g, (match, content) => {
    const cleanContent = content
      .split(',')
      .map(item => item.trim())
      .join(', ');
    return `tags: [${cleanContent}]`;
  });

  fixed = fixed.replace(/keywords:\s*\[([^\]]+)\]/g, (match, content) => {
    const cleanContent = content
      .split(',')
      .map(item => item.trim())
      .join(', ');
    return `keywords: [${cleanContent}]`;
  });

  fixed = fixed.replace(/targetMarkets:\s*\[([^\]]+)\]/g, (match, content) => {
    const cleanContent = content
      .split(',')
      .map(item => item.trim())
      .join(', ');
    return `targetMarkets: [${cleanContent}]`;
  });

  fixed = fixed.replace(/certifications:\s*\[([^\]]+)\]/g, (match, content) => {
    const cleanContent = content
      .split(',')
      .map(item => item.trim())
      .join(', ');
    return `certifications: [${cleanContent}]`;
  });

  // Remove invalid fields
  fixed = fixed.replace(/^qualityLabs:.*$/gm, '');

  // Clean up extra empty lines in frontmatter
  const parts = fixed.split('---');
  if (parts.length >= 3) {
    parts[1] = parts[1].replace(/\n\n+/g, '\n');
    fixed = parts.join('---');
  }

  return fixed;
}

// Main execution
const contentDir = path.join(__dirname, '..', 'content');
const mdxFiles = findMDXFiles(contentDir);

console.log(`Found ${mdxFiles.length} MDX files to process...`);

let fixedCount = 0;

mdxFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixYAMLIssues(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed: ${path.relative(contentDir, filePath)}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\nFixed ${fixedCount} files with YAML issues.`);
