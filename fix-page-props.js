const fs = require('fs');
const path = require('path');

// Files that need to be fixed
const filesToFix = [
  'src/app/[locale]/products/robusta/page.tsx',
  'src/app/[locale]/products/blends/page.tsx',
  'src/app/[locale]/certifications/page.tsx',
  'src/app/[locale]/services/sourcing/page.tsx',
  'src/app/[locale]/terms/page.tsx',
  'src/app/[locale]/products/instant/page.tsx',
  'src/app/[locale]/contact/page.tsx',
  'src/app/[locale]/services/logistics/page.tsx',
  'src/app/[locale]/sustainability/page.tsx',
  'src/app/[locale]/services/oem/page.tsx',
  'src/app/[locale]/services/private-label/page.tsx',
  'src/app/[locale]/products/arabica/page.tsx',
  'src/app/[locale]/privacy/page.tsx'
];

let fixedCount = 0;

filesToFix.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;
  
  // Check if the file has the main page component function
  const pageComponentMatch = content.match(/export default async function (\w+Page)\(\{ params \}: Props\) \{/);
  if (pageComponentMatch) {
    const functionName = pageComponentMatch[1];
    
    // Check if it already has locale destructuring
    if (!content.includes('const { locale } = await params;')) {
      // Add locale destructuring after the function declaration
      content = content.replace(
        new RegExp(`export default async function ${functionName}\\(\\{ params \\}: Props\\) \\{`),
        `export default async function ${functionName}({ params }: Props) {\n  const { locale } = await params;`
      );
      modified = true;
    }
    
    // Replace any remaining locale references in the component
    const componentStartIndex = content.indexOf(`export default async function ${functionName}`);
    if (componentStartIndex !== -1) {
      const beforeComponent = content.substring(0, componentStartIndex);
      let afterComponent = content.substring(componentStartIndex);
      
      // Only replace locale references in the component part
      afterComponent = afterComponent.replace(/\$\{locale\}/g, '${locale}'); // Keep existing correct ones
      afterComponent = afterComponent.replace(/params\.locale/g, 'locale');
      
      content = beforeComponent + afterComponent;
      modified = true;
    }
  }
  
  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
    fixedCount++;
  } else {
    console.log(`No changes needed: ${filePath}`);
  }
});

console.log(`\nFixed ${fixedCount} files total.`);