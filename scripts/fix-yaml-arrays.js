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

// Function to convert inline arrays to multi-line YAML format
function convertArraysToMultiLine(content) {
  let fixed = content;

  // Convert chartTypes array
  fixed = fixed.replace(
    /chartTypes:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item && item !== '--');

      if (items.length === 0) return 'chartTypes: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `chartTypes:\n${multiLine}`;
    }
  );

  // Convert tags array
  fixed = fixed.replace(/tags:\s*\[([^\]]+)\]/g, (match, arrayContent) => {
    const items = arrayContent
      .split(',')
      .map(item => item.trim().replace(/['"]/g, ''))
      .filter(item => item);

    if (items.length === 0) return 'tags: []';

    const multiLine = items.map(item => `  - '${item}'`).join('\n');
    return `tags:\n${multiLine}`;
  });

  // Convert keywords array
  fixed = fixed.replace(/keywords:\s*\[([^\]]+)\]/g, (match, arrayContent) => {
    const items = arrayContent
      .split(',')
      .map(item => item.trim().replace(/['"]/g, ''))
      .filter(item => item);

    if (items.length === 0) return 'keywords: []';

    const multiLine = items.map(item => `  - '${item}'`).join('\n');
    return `keywords:\n${multiLine}`;
  });

  // Convert targetMarkets array
  fixed = fixed.replace(
    /targetMarkets:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item);

      if (items.length === 0) return 'targetMarkets: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `targetMarkets:\n${multiLine}`;
    }
  );

  // Convert certifications array
  fixed = fixed.replace(
    /certifications:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item);

      if (items.length === 0) return 'certifications: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `certifications:\n${multiLine}`;
    }
  );

  // Convert relatedPosts array
  fixed = fixed.replace(
    /relatedPosts:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item);

      if (items.length === 0) return 'relatedPosts: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `relatedPosts:\n${multiLine}`;
    }
  );

  // Convert relatedReports array
  fixed = fixed.replace(
    /relatedReports:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item);

      if (items.length === 0) return 'relatedReports: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `relatedReports:\n${multiLine}`;
    }
  );

  // Convert serviceIncludes array
  fixed = fixed.replace(
    /serviceIncludes:\s*\[([^\]]+)\]/g,
    (match, arrayContent) => {
      const items = arrayContent
        .split(',')
        .map(item => item.trim().replace(/['"]/g, ''))
        .filter(item => item);

      if (items.length === 0) return 'serviceIncludes: []';

      const multiLine = items.map(item => `  - '${item}'`).join('\n');
      return `serviceIncludes:\n${multiLine}`;
    }
  );

  // Convert gallery array
  fixed = fixed.replace(/gallery:\s*\[([^\]]+)\]/g, (match, arrayContent) => {
    const items = arrayContent
      .split(',')
      .map(item => item.trim().replace(/['"]/g, ''))
      .filter(item => item);

    if (items.length === 0) return 'gallery: []';

    const multiLine = items.map(item => `  - '${item}'`).join('\n');
    return `gallery:\n${multiLine}`;
  });

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
    const fixedContent = convertArraysToMultiLine(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed arrays in: ${path.relative(contentDir, filePath)}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

console.log(`\nConverted arrays to multi-line format in ${fixedCount} files.`);
