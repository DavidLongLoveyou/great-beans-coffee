const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function fixYamlFrontmatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Extract frontmatter and content
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!frontmatterMatch) {
      console.log(`No frontmatter found in ${filePath}`);
      return;
    }

    const [, frontmatterStr, bodyContent] = frontmatterMatch;
    
    // Parse and fix the frontmatter
    let frontmatter;
    try {
      frontmatter = yaml.load(frontmatterStr);
    } catch (parseError) {
      console.log(`YAML parse error in ${filePath}:`, parseError.message);
      
      // Try to fix common issues
      let fixedFrontmatter = frontmatterStr
        // Fix array syntax - convert ['item1', 'item2'] to proper YAML
        .replace(/\[\s*'([^']+)'(?:\s*,\s*'([^']+)')*\s*\]/g, (match, ...items) => {
          const allItems = match.match(/'([^']+)'/g).map(item => item.slice(1, -1));
          return '\n' + allItems.map(item => `  - '${item}'`).join('\n');
        })
        // Fix boolean values
        .replace(/:\s*true\r?\n/g, ': true\n')
        .replace(/:\s*false\r?\n/g, ': false\n')
        // Fix number values
        .replace(/:\s*(\d+)\r?\n/g, ': $1\n')
        // Fix string values with carriage returns
        .replace(/:\s*'([^']+)'\r?\n/g, ": '$1'\n")
        .replace(/:\s*"([^"]+)"\r?\n/g, ': "$1"\n')
        // Remove carriage returns
        .replace(/\r/g, '');

      try {
        frontmatter = yaml.load(fixedFrontmatter);
        console.log(`Fixed YAML in ${filePath}`);
      } catch (secondError) {
        console.log(`Still can't parse YAML in ${filePath}:`, secondError.message);
        return;
      }
    }

    // Clean up the frontmatter object
    function cleanValue(value) {
      if (typeof value === 'string') {
        return value.replace(/\r/g, '').trim();
      }
      if (Array.isArray(value)) {
        return value.map(cleanValue);
      }
      if (typeof value === 'object' && value !== null) {
        const cleaned = {};
        for (const [key, val] of Object.entries(value)) {
          cleaned[key] = cleanValue(val);
        }
        return cleaned;
      }
      return value;
    }

    const cleanedFrontmatter = cleanValue(frontmatter);

    // Convert back to YAML
    const newFrontmatterStr = yaml.dump(cleanedFrontmatter, {
      indent: 2,
      lineWidth: 120,
      noRefs: true,
      quotingType: '"',
      forceQuotes: false
    });

    // Reconstruct the file
    const newContent = `---\n${newFrontmatterStr}---\n${bodyContent}`;

    // Write back to file
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`✅ Fixed ${filePath}`);

  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log(`Directory ${dirPath} does not exist`);
    return;
  }

  const items = fs.readdirSync(dirPath);
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      processDirectory(itemPath);
    } else if (item.endsWith('.mdx')) {
      fixYamlFrontmatter(itemPath);
    }
  }
}

// Process all content directories
const contentDir = path.join(__dirname, '..', 'content');
console.log('🔧 Fixing YAML frontmatter in all content files...');
processDirectory(contentDir);
console.log('✅ YAML frontmatter fix complete!');