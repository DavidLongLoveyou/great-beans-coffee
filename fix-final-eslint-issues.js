const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing final ESLint issues...');

// Fix contact page issues
const contactPagePath = 'src/app/[locale]/contact/page.tsx';
let contactContent = fs.readFileSync(contactPagePath, 'utf8');

// Remove unused 't' variable
contactContent = contactContent.replace(
  /export default async function ContactPage\(\{ params \}: Props\) \{\s*const \{ locale \} = await params;\s*const t = await getTranslations\(\{ locale, namespace: 'contact' \}\);/,
  `export default async function ContactPage({ params }: Props) {
  const { locale } = await params;`
);

// Fix unescaped apostrophes
const apostropheReplacements = [
  { from: "we'll get back", to: 'we&apos;ll get back' },
  { from: "We're working", to: 'We&apos;re working' },
  { from: "We'll provide", to: 'We&apos;ll provide' },
  { from: "we'll deduct", to: 'we&apos;ll deduct' },
];

apostropheReplacements.forEach(({ from, to }) => {
  contactContent = contactContent.replace(new RegExp(from, 'g'), to);
});

fs.writeFileSync(contactPagePath, contactContent);
console.log('✅ Fixed contact page');

console.log('✅ All final ESLint issues fixed!');
