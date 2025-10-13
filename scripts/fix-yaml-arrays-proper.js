const fs = require('fs');
const path = require('path');

function fixYamlArrays(content) {
  // Split content into frontmatter and body
  const parts = content.split('---');
  if (parts.length < 3) return content;

  let frontmatter = parts[1];
  const body = parts.slice(2).join('---');

  // Fix array syntax - convert "key: - 'value'" to proper YAML
  frontmatter = frontmatter.replace(
    /^(\s*)(\w+):\s*-\s*'([^']+)'(.*)$/gm,
    (match, indent, key, firstValue, rest) => {
      // Check if there are more items on the same line or following lines
      const lines = match.split('\n');
      if (lines.length === 1) {
        // Single line, convert to proper array format
        return `${indent}${key}:\n${indent}  - '${firstValue}'`;
      }
      return match; // Let other logic handle multi-line cases
    }
  );

  // Fix cases where arrays start on the same line as the key
  frontmatter = frontmatter.replace(
    /^(\s*)(\w+):\s*-\s*'([^']+)'$/gm,
    "$1$2:\n$1  - '$3'"
  );

  // Fix multi-line arrays that might be malformed
  const lines = frontmatter.split('\n');
  const fixedLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this line starts an array incorrectly
    const arrayMatch = line.match(/^(\s*)(\w+):\s*-\s*'([^']+)'(.*)$/);
    if (arrayMatch) {
      const [, indent, key, firstValue, rest] = arrayMatch;
      fixedLines.push(`${indent}${key}:`);
      fixedLines.push(`${indent}  - '${firstValue}'`);

      // Check following lines for more array items
      i++;
      while (i < lines.length) {
        const nextLine = lines[i];
        const nextItemMatch = nextLine.match(/^\s*-\s*'([^']+)'$/);
        if (nextItemMatch) {
          fixedLines.push(`${indent}  - '${nextItemMatch[1]}'`);
          i++;
        } else {
          break;
        }
      }
    } else {
      fixedLines.push(line);
      i++;
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
console.log('Fixing YAML array syntax...');

const fixedCount = processDirectory(contentDir);
console.log(`\nArray syntax fix complete! Fixed ${fixedCount} files.`);
