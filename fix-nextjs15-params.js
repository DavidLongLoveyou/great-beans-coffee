const fs = require('fs');
const path = require('path');

// Files that need to be fixed for Next.js 15 async params
const filesToFix = [
  'src/app/[locale]/products/arabica/page.tsx',
  'src/app/[locale]/products/robusta/page.tsx',
  'src/app/[locale]/products/blends/page.tsx',
  'src/app/[locale]/products/instant/page.tsx',
  'src/app/[locale]/services/sourcing/page.tsx',
  'src/app/[locale]/services/logistics/page.tsx',
  'src/app/[locale]/services/oem/page.tsx',
  'src/app/[locale]/services/private-label/page.tsx',
  'src/app/[locale]/careers/page.tsx',
  'src/app/[locale]/contact/page.tsx',
  'src/app/[locale]/privacy/page.tsx',
  'src/app/[locale]/terms/page.tsx',
  'src/app/[locale]/certifications/page.tsx',
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

  // 1. Fix the Props type definition
  if (content.includes('params: { locale: Locale }')) {
    content = content.replace(
      /params: \{ locale: Locale \}/g,
      'params: Promise<{ locale: Locale }>'
    );
    modified = true;
    console.log(`Fixed Props type in: ${filePath}`);
  }

  // 2. Fix generateMetadata function if it exists
  const generateMetadataMatch = content.match(
    /export async function generateMetadata\(\{ params \}: Props\): Promise<Metadata> \{\s*const t = await getTranslations\(\{\s*locale: params\.locale,/
  );
  if (generateMetadataMatch) {
    content = content.replace(
      /export async function generateMetadata\(\{ params \}: Props\): Promise<Metadata> \{\s*const t = await getTranslations\(\{\s*locale: params\.locale,/,
      `export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale,`
    );
    modified = true;
    console.log(`Fixed generateMetadata in: ${filePath}`);
  }

  // 3. Fix the main page component function
  const pageComponentMatch = content.match(
    /export default async function (\w+Page)\(\{ params \}: Props\) \{/
  );
  if (pageComponentMatch) {
    const functionName = pageComponentMatch[1];

    // Check if it already has locale destructuring
    if (!content.includes('const { locale } = await params;')) {
      // Add locale destructuring after the function declaration
      content = content.replace(
        new RegExp(
          `export default async function ${functionName}\\(\\{ params \\}: Props\\) \\{`
        ),
        `export default async function ${functionName}({ params }: Props) {
  const { locale } = await params;`
      );
      modified = true;
      console.log(`Added locale destructuring in: ${filePath}`);
    }

    // 4. Replace all params.locale references with locale
    const componentStartIndex = content.indexOf(
      `export default async function ${functionName}`
    );
    if (componentStartIndex !== -1) {
      const beforeComponent = content.substring(0, componentStartIndex);
      let afterComponent = content.substring(componentStartIndex);

      // Replace params.locale with locale in the component
      const originalAfterComponent = afterComponent;
      afterComponent = afterComponent.replace(/params\.locale/g, 'locale');
      
      if (originalAfterComponent !== afterComponent) {
        modified = true;
        console.log(`Replaced params.locale references in: ${filePath}`);
      }

      content = beforeComponent + afterComponent;
    }
  }

  // 5. Handle getTranslations calls that might be outside the component
  if (content.includes('locale: params.locale,')) {
    content = content.replace(/locale: params\.locale,/g, 'locale: locale,');
    modified = true;
    console.log(`Fixed getTranslations calls in: ${filePath}`);
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✅ Successfully fixed: ${filePath}`);
    fixedCount++;
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log(`\n🎉 Fixed ${fixedCount} files total for Next.js 15 async params.`);