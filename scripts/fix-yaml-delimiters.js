const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixYamlDelimiters(content) {
  // Check if file starts with YAML frontmatter
  if (!content.startsWith('---\n')) {
    return content;
  }

  // Find the end of YAML frontmatter
  const lines = content.split('\n');
  let yamlEndIndex = -1;
  let inYaml = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (i === 0 && line === '---') {
      inYaml = true;
      continue;
    }

    if (inYaml && line === '---') {
      yamlEndIndex = i;
      break;
    }

    // If we encounter a markdown heading or content without closing ---,
    // we need to add the closing delimiter
    if (
      inYaml &&
      (line.startsWith('#') ||
        (line.length > 0 &&
          !line.includes(':') &&
          !line.startsWith('-') &&
          !line.startsWith('[')))
    ) {
      // Insert closing --- before this line
      lines.splice(i, 0, '---');
      yamlEndIndex = i;
      break;
    }
  }

  return lines.join('\n');
}

// Get all MDX files
const contentDir = path.join(__dirname, '..', 'content');
const mdxFiles = glob.sync('**/*.mdx', { cwd: contentDir });

console.log(
  `Checking ${mdxFiles.length} MDX files for YAML delimiter issues...`
);

let fixedCount = 0;

mdxFiles.forEach(file => {
  const filePath = path.join(contentDir, file);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixYamlDelimiters(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed YAML delimiters: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nYAML delimiter fix completed!`);
console.log(`Fixed ${fixedCount} files.`);
