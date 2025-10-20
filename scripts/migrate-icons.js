const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript/JavaScript files
function findFiles(dir, extensions = ['.tsx', '.ts', '.jsx', '.js']) {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat && stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        results = results.concat(findFiles(filePath, extensions));
      }
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        results.push(filePath);
      }
    }
  });

  return results;
}

// Function to migrate imports in a file
function migrateFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file imports from lazy-icons
    if (content.includes('@/components/ui/lazy-icons')) {
      console.log(`Migrating: ${filePath}`);

      // Replace the import statement
      const newContent = content.replace(
        /@\/components\/ui\/lazy-icons/g,
        '@/components/ui/dynamic-icons'
      );

      // Write the updated content back
      fs.writeFileSync(filePath, newContent, 'utf8');
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Main migration function
function migrateIcons() {
  const srcDir = path.join(__dirname, '..', 'src');
  const files = findFiles(srcDir);

  let migratedCount = 0;

  console.log(`Found ${files.length} files to check...`);

  files.forEach(file => {
    if (migrateFile(file)) {
      migratedCount++;
    }
  });

  console.log(`\nMigration completed!`);
  console.log(`Files migrated: ${migratedCount}`);
  console.log(`Total files checked: ${files.length}`);
}

// Run the migration
migrateIcons();
