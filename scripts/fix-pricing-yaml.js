const fs = require('fs');
const path = require('path');

// List of files that need pricing YAML fixes
const filesToFix = [
  'content/services/de/private-label-kaffee-loesungen.mdx',
  'content/services/en/private-label-coffee-solutions.mdx',
  'content/services/ja/private-label-coffee-solutions.mdx',
  'content/services/en/oem-coffee-manufacturing.mdx',
];

function fixPricingYaml(content) {
  // Pattern to match malformed pricing object
  const pricingPattern = /pricing: \{\s*\n([\s\S]*?)\n---\s*\n\s*\}/;

  const match = content.match(pricingPattern);
  if (!match) {
    return content;
  }

  // Extract the pricing content
  const pricingContent = match[1];

  // Convert from object notation to YAML notation
  const yamlPricing = pricingContent
    .split('\n')
    .map(line => {
      const trimmed = line.trim();
      if (trimmed === '') return '';

      // Remove trailing comma and convert to YAML format
      const cleaned = trimmed.replace(/,$/, '');

      // Convert object property to YAML property
      if (cleaned.includes(':')) {
        const [key, value] = cleaned.split(':').map(s => s.trim());
        return `  ${key}: ${value}`;
      }

      return `  ${cleaned}`;
    })
    .filter(line => line.trim() !== '')
    .join('\n');

  // Replace the malformed structure with proper YAML
  const replacement = `pricing:\n${yamlPricing}`;

  return content.replace(pricingPattern, replacement);
}

console.log('Fixing pricing YAML structures...');

let fixedCount = 0;

filesToFix.forEach(file => {
  const filePath = path.join(__dirname, '..', file);

  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${file}`);
      return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixPricingYaml(content);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed pricing YAML: ${file}`);
      fixedCount++;
    } else {
      console.log(`No changes needed: ${file}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nPricing YAML fix completed!`);
console.log(`Fixed ${fixedCount} files.`);
