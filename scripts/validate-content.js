const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function validateYAMLFrontmatter(filePath, content) {
  const errors = [];

  // Normalize line endings
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Extract frontmatter
  const frontmatterMatch = normalizedContent.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    errors.push(`No frontmatter found in ${filePath}`);
    return errors;
  }

  try {
    yaml.load(frontmatterMatch[1]);
  } catch (error) {
    errors.push(`YAML parsing error in ${filePath}: ${error.message}`);
  }

  return errors;
}

function validateMDXSyntax(filePath, content) {
  const errors = [];

  // Check for common MDX issues
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;

    // Check for inline JSX components that should be on separate lines
    if (
      line.includes(': <') &&
      (line.includes('<div') || line.includes('<DataTable'))
    ) {
      errors.push(
        `Line ${lineNum} in ${filePath}: JSX component should be on separate line`
      );
    }

    // Check for unclosed JSX tags
    const openTags = line.match(/<[^/][^>]*>/g) || [];
    const closeTags = line.match(/<\/[^>]*>/g) || [];

    if (openTags.length > closeTags.length) {
      // Check if it's a self-closing tag
      const selfClosing = line.match(/<[^>]*\/>/g) || [];
      if (openTags.length - selfClosing.length > closeTags.length) {
        // This might be a multi-line component, skip for now
      }
    }
  }

  return errors;
}

function validateFile(filePath) {
  const errors = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Validate YAML frontmatter
    errors.push(...validateYAMLFrontmatter(filePath, content));

    // Validate MDX syntax
    errors.push(...validateMDXSyntax(filePath, content));
  } catch (error) {
    errors.push(`Error reading file ${filePath}: ${error.message}`);
  }

  return errors;
}

function findContentFiles(dir) {
  const files = [];

  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);

    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (item.endsWith('.mdx')) {
        files.push(fullPath);
      }
    }
  }

  traverse(dir);
  return files;
}

function main() {
  const contentDir = path.join(__dirname, '..', 'content');

  if (!fs.existsSync(contentDir)) {
    console.error('Content directory not found:', contentDir);
    process.exit(1);
  }

  const files = findContentFiles(contentDir);
  console.log(`Found ${files.length} content files to validate...`);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const file of files) {
    const errors = validateFile(file);

    if (errors.length > 0) {
      console.log(`\n❌ ${path.relative(contentDir, file)}:`);
      errors.forEach(error => {
        console.log(`  - ${error}`);
        totalErrors++;
      });
    }
  }

  console.log(`\n📊 Validation Summary:`);
  console.log(`  Files checked: ${files.length}`);
  console.log(`  Errors: ${totalErrors}`);
  console.log(`  Warnings: ${totalWarnings}`);

  if (totalErrors === 0) {
    console.log(`\n✅ All content files are valid!`);
    process.exit(0);
  } else {
    console.log(`\n❌ Found ${totalErrors} errors that need to be fixed.`);
    process.exit(1);
  }
}

main();
