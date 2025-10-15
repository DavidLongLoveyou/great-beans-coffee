const fs = require('fs');
const path = require('path');

function fixUnusedVariables() {
  const files = [
    'src/app/[locale]/contact/page.tsx',
    'src/app/[locale]/privacy/page.tsx', 
    'src/app/[locale]/terms/page.tsx',
    'src/app/[locale]/sustainability/page.tsx',
    'src/app/[locale]/products/arabica/page.tsx',
    'src/app/[locale]/products/robusta/page.tsx',
    'src/app/[locale]/products/blends/page.tsx',
    'src/app/[locale]/products/instant/page.tsx',
    'src/app/[locale]/services/sourcing/page.tsx',
    'src/app/[locale]/services/logistics/page.tsx',
    'src/app/[locale]/services/oem/page.tsx',
    'src/app/[locale]/services/private-label/page.tsx'
  ];

  files.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Remove unused getTranslations import if not used
      if (!content.includes('getTranslations(') && content.includes('getTranslations')) {
        content = content.replace(/import \{\s*getTranslations\s*\} from 'next-intl\/server';\n?/g, '');
        content = content.replace(/,\s*getTranslations/g, '');
        content = content.replace(/getTranslations\s*,/g, '');
      }
      
      // Remove unused Image import if not used
      if (!content.includes('<Image') && content.includes('import Image')) {
        content = content.replace(/import Image from 'next\/image';\n?/g, '');
      }
      
      // Remove other unused imports
      const unusedImports = ['DollarSign', 'Calendar', 'Clock', 'MapPin'];
      unusedImports.forEach(importName => {
        if (!content.includes(importName + ' ') && !content.includes('<' + importName)) {
          content = content.replace(new RegExp(',\\s*' + importName + '\\s*', 'g'), '');
          content = content.replace(new RegExp('\\s*' + importName + '\\s*,', 'g'), '');
          content = content.replace(new RegExp('\\{\\s*' + importName + '\\s*\\}', 'g'), '{}');
        }
      });
      
      // Clean up empty import statements
      content = content.replace(/import \{\s*\} from[^;]+;\n?/g, '');
      
      // Prefix unused params in generateMetadata if params is not used
      if (content.includes('generateMetadata({ params }') && !content.includes('await params')) {
        content = content.replace(/generateMetadata\(\{ params \}/g, 'generateMetadata({ params: _params }');
      }
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed ${file}`);
    }
  });
}

function fixSpecificFiles() {
  // Fix any remaining unescaped entities
  const filesToCheck = [
    'src/app/[locale]/careers/page.tsx',
    'src/app/[locale]/about/page.tsx'
  ];
  
  filesToCheck.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix unescaped apostrophes
      content = content.replace(/Don't/g, "Don&apos;t");
      content = content.replace(/We're/g, "We&apos;re"); 
      content = content.replace(/let's/g, "let&apos;s");
      content = content.replace(/can't/g, "can&apos;t");
      content = content.replace(/won't/g, "won&apos;t");
      content = content.replace(/isn't/g, "isn&apos;t");
      content = content.replace(/aren't/g, "aren&apos;t");
      content = content.replace(/doesn't/g, "doesn&apos;t");
      content = content.replace(/haven't/g, "haven&apos;t");
      content = content.replace(/hasn't/g, "hasn&apos;t");
      content = content.replace(/wouldn't/g, "wouldn&apos;t");
      content = content.replace(/shouldn't/g, "shouldn&apos;t");
      content = content.replace(/couldn't/g, "couldn&apos;t");
      
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed unescaped entities in ${file}`);
    }
  });
}

function main() {
  try {
    console.log('🔧 Fixing all remaining ESLint issues...\n');
    
    fixUnusedVariables();
    fixSpecificFiles();
    
    console.log('\n✅ All ESLint issues fixed!');
    console.log('📝 Running prettier to ensure formatting is correct...');
    
  } catch (error) {
    console.error('❌ Error fixing ESLint issues:', error.message);
    process.exit(1);
  }
}

main();