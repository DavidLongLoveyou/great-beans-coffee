const fs = require('fs');

function findDuplicateKeys(obj, path = '', duplicates = []) {
  if (typeof obj !== 'object' || obj === null) {
    return duplicates;
  }

  const keys = Object.keys(obj);
  const keyCount = {};

  // Count occurrences of each key at this level
  keys.forEach(key => {
    keyCount[key] = (keyCount[key] || 0) + 1;
  });

  // Report duplicates at this level
  Object.entries(keyCount).forEach(([key, count]) => {
    if (count > 1) {
      duplicates.push(`Duplicate key "${key}" at path: ${path || 'root'}`);
    }
  });

  // Recursively check nested objects
  keys.forEach(key => {
    const newPath = path ? `${path}.${key}` : key;
    findDuplicateKeys(obj[key], newPath, duplicates);
  });

  return duplicates;
}

try {
  const content = fs.readFileSync('messages/en.json', 'utf8');
  const jsonData = JSON.parse(content);

  console.log('✅ JSON is valid');

  const duplicates = findDuplicateKeys(jsonData);

  if (duplicates.length === 0) {
    console.log('✅ No duplicate keys found at the same object level');
  } else {
    console.log('❌ Duplicate keys found at the same object level:');
    duplicates.forEach(dup => console.log(dup));
  }
} catch (error) {
  console.log('❌ JSON parsing error:', error.message);
}
