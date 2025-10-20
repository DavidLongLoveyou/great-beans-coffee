const fs = require('fs');
const path = require('path');

// All language files
const languages = ['de', 'es', 'fr', 'it', 'ja', 'ko', 'nl', 'vi'];
const baseLanguage = 'en';

// Load the base English file
const enPath = path.join('messages', `${baseLanguage}.json`);
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Get all top-level keys from English
const allKeys = Object.keys(enData);
console.log(
  `📋 Found ${allKeys.length} top-level keys in ${baseLanguage}.json:`
);
console.log(allKeys.join(', '));
console.log();

// Function to create placeholder translations
function createPlaceholderTranslation(key, value, targetLang) {
  if (typeof value === 'string') {
    // For strings, add a language indicator
    return `[${targetLang.toUpperCase()}] ${value}`;
  } else if (typeof value === 'object' && value !== null) {
    // For objects, recursively process
    const result = {};
    for (const [subKey, subValue] of Object.entries(value)) {
      result[subKey] = createPlaceholderTranslation(
        subKey,
        subValue,
        targetLang
      );
    }
    return result;
  } else {
    // For other types (numbers, booleans), keep as is
    return value;
  }
}

// Process each language file
for (const lang of languages) {
  const langPath = path.join('messages', `${lang}.json`);

  try {
    // Load existing language file
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const existingKeys = Object.keys(langData);

    console.log(
      `🔍 Processing ${lang}.json (${existingKeys.length} existing keys)...`
    );

    // Find missing keys
    const missingKeys = allKeys.filter(key => !existingKeys.includes(key));

    if (missingKeys.length === 0) {
      console.log(`✅ ${lang}.json is already complete!`);
      continue;
    }

    console.log(
      `📝 Adding ${missingKeys.length} missing keys: ${missingKeys.join(', ')}`
    );

    // Add missing keys with placeholder translations
    for (const key of missingKeys) {
      langData[key] = createPlaceholderTranslation(key, enData[key], lang);
    }

    // Sort keys to match English file order
    const sortedData = {};
    for (const key of allKeys) {
      if (langData[key]) {
        sortedData[key] = langData[key];
      }
    }

    // Write back to file with proper formatting
    fs.writeFileSync(
      langPath,
      JSON.stringify(sortedData, null, 2) + '\n',
      'utf8'
    );

    console.log(`✅ Updated ${lang}.json successfully!`);
  } catch (error) {
    console.log(`⚠️  Error processing ${lang}.json: ${error.message}`);
  }

  console.log();
}

// Verify all files now have the same structure
console.log('🔍 Verification - Key counts after synchronization:');
for (const lang of [baseLanguage, ...languages]) {
  const langPath = path.join('messages', `${lang}.json`);
  try {
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const keyCount = Object.keys(langData).length;
    console.log(
      `   ${lang}.json: ${keyCount} keys ${keyCount === allKeys.length ? '✅' : '❌'}`
    );
  } catch (error) {
    console.log(`   ${lang}.json: Error reading file ❌`);
  }
}

console.log('\n🎉 i18n synchronization completed!');
console.log(
  '\n📝 Note: All new keys have been marked with language prefixes (e.g., [DE], [ES])'
);
console.log(
  '   Please review and translate these placeholder texts to proper translations.'
);
