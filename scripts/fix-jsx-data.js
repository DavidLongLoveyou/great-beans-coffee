const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixJsxData(content) {
  let fixed = content;
  
  // Fix malformed regions array in Vietnamese market report
  const vietnameseRegionsPattern = /regions: \['{ name: 'Bắc Mỹ''[\s\S]*?'color: '#F4A460' }'\]/;
  if (vietnameseRegionsPattern.test(fixed)) {
    fixed = fixed.replace(vietnameseRegionsPattern, `regions: [
      { name: 'Bắc Mỹ', consumption: 28.5, growth: 1.8, color: '#8B4513' },
      { name: 'Châu Âu', consumption: 52.2, growth: 0.9, color: '#D2691E' },
      { name: 'Châu Á-Thái Bình Dương', consumption: 35.8, growth: 4.2, color: '#CD853F' },
      { name: 'Châu Mỹ Latin', consumption: 22.1, growth: 2.5, color: '#DEB887' },
      { name: 'Châu Phi & Trung Đông', consumption: 12.8, growth: 3.8, color: '#F4A460' }
    ]`);
  }
  
  // Fix malformed countries array in German market report
  const germanCountriesPattern = /countries: \['{ name: 'Deutschland''[\s\S]*?'marketValue: 2\.8 }'\]/;
  if (germanCountriesPattern.test(fixed)) {
    fixed = fixed.replace(germanCountriesPattern, `countries: [
      { name: 'Deutschland', consumption: 8.4, growth: 1.8, marketValue: 4.2 },
      { name: 'USA', consumption: 4.2, growth: 2.3, marketValue: 18.9 },
      { name: 'Brasilien', consumption: 6.1, growth: 3.1, marketValue: 5.8 },
      { name: 'Japan', consumption: 3.6, growth: 0.8, marketValue: 7.1 },
      { name: 'Italien', consumption: 5.9, growth: 1.2, marketValue: 3.4 },
      { name: 'Frankreich', consumption: 5.1, growth: 1.5, marketValue: 2.8 }
    ]`);
  }
  
  return fixed;
}

// Get all market report MDX files
const marketReportsDir = path.join(__dirname, '..', 'content', 'market-reports');
const mdxFiles = glob.sync('**/*.mdx', { cwd: marketReportsDir });

console.log(`Checking ${mdxFiles.length} market report files for JSX data issues...`);

let fixedCount = 0;

mdxFiles.forEach(file => {
  const filePath = path.join(marketReportsDir, file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixJsxData(content);
    
    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`Fixed JSX data: ${file}`);
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nJSX data fix completed!`);
console.log(`Fixed ${fixedCount} files.`);