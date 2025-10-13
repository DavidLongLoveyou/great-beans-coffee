const fs = require('fs');
const path = require('path');

function fixYamlArrays(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;

  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');

  // Split into lines for processing
  const lines = frontmatter.split('\n');
  const fixedLines = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if this line has an array that starts on the same line as the key
    const arrayStartMatch = line.match(/^(\s*)(\w+):\s*-\s*'([^']+)'(.*)$/);
    if (arrayStartMatch) {
      const [, indent, key, firstValue] = arrayStartMatch;

      // Add the key on its own line
      fixedLines.push(`${indent}${key}:`);
      // Add the first array item
      fixedLines.push(`${indent}  - '${firstValue}'`);

      // Check if there are more array items following
      let j = i + 1;
      while (j < lines.length) {
        const nextLine = lines[j];
        const nextItemMatch = nextLine.match(/^\s*-\s*'([^']+)'$/);
        if (nextItemMatch) {
          fixedLines.push(`${indent}  - '${nextItemMatch[1]}'`);
          j++;
        } else {
          break;
        }
      }
      i = j - 1; // Skip the processed lines
    } else {
      fixedLines.push(line);
    }
  }

  return `---\n${fixedLines.join('\n')}\n---${body}`;
}

function processDirectory(dirPath) {
  let fixedCount = 0;

  function processFile(filePath) {
    if (path.extname(filePath) === '.mdx') {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const fixedContent = fixYamlArrays(content);

        if (content !== fixedContent) {
          fs.writeFileSync(filePath, fixedContent, 'utf8');
          console.log(
            `Fixed arrays in: ${path.relative(process.cwd(), filePath)}`
          );
          fixedCount++;
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
      }
    }
  }

  function walkDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        walkDirectory(fullPath);
      } else {
        processFile(fullPath);
      }
    }
  }

  walkDirectory(dirPath);
  return fixedCount;
}

// Process content directory
const contentDir = path.join(process.cwd(), 'content');
console.log('Final YAML array fix...');

const fixedCount = processDirectory(contentDir);
console.log(`\nFinal array fix complete! Fixed ${fixedCount} files.`);
