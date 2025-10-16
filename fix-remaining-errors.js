const fs = require('fs');
const path = require('path');

// Fix specific files with remaining errors
const fixes = [
  {
    file: 'content/origin-stories/en/gia-lai-sustainable-robusta.mdx',
    fix: (content) => {
      // Fix gallery indentation
      return content.replace(
        /gallery:\n- '\/images\/origin-stories\/gia-lai[^']*'\n- '\/images\/origin-stories\/gia-lai[^']*'\n  - '\/images\/origin-stories\/gia-lai[^']*'\n  - '\/images\/origin-stories\/gia-lai[^']*'\n  - '\/images\/origin-stories\/gia-lai[^']*'/,
        `gallery:
- '/images/origin-stories/gia-lai-robusta-farm.jpg'
- '/images/origin-stories/gia-lai-processing.jpg'
- '/images/origin-stories/gia-lai-landscape.jpg'
- '/images/origin-stories/gia-lai-farmers.jpg'
- '/images/origin-stories/gia-lai-harvest.jpg'`
      );
    }
  },
  {
    file: 'content/origin-stories/en/kon-tum-highland-arabica.mdx',
    fix: (content) => {
      // Fix multiline excerpt issue
      return content.replace(
        /excerpt: >\nIn the remote highlands of Kon Tum, indigenous[^]*?\nreadingTime: 7/,
        `excerpt: "In the remote highlands of Kon Tum, indigenous communities have cultivated exceptional arabica coffee for generations."
readingTime: 7`
      );
    }
  },
  {
    file: 'content/services/de/private-label-kaffee-loesungen.mdx',
    fix: (content) => {
      // Fix mixed quotes
      return content.replace(/title: 'Private Label Kaffee-Lösungen'/, 'title: "Private Label Kaffee-Lösungen"');
    }
  },
  {
    file: 'content/services/en/oem-coffee-manufacturing.mdx',
    fix: (content) => {
      // Fix mixed quotes
      return content.replace(/title: 'OEM Coffee Manufacturing'/, 'title: "OEM Coffee Manufacturing"');
    }
  },
  {
    file: 'content/services/en/private-label-coffee-solutions.mdx',
    fix: (content) => {
      // Fix mixed quotes
      return content.replace(/title: 'Private Label Coffee Solutions'/, 'title: "Private Label Coffee Solutions"');
    }
  }
];

let fixedCount = 0;

fixes.forEach(({ file, fix }) => {
  try {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const fixedContent = fix(content);
      
      if (fixedContent !== content) {
        fs.writeFileSync(filePath, fixedContent, 'utf8');
        console.log(`✅ Fixed: ${file}`);
        fixedCount++;
      } else {
        console.log(`⚠️  No changes needed: ${file}`);
      }
    } else {
      console.log(`❌ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n✨ Fixed ${fixedCount} files`);