const fs = require('fs');
const path = require('path');

// Function to recursively find all files with specific extensions
function findFiles(dir, extensions) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFiles(fullPath, extensions));
    } else if (extensions.some(ext => item.endsWith(ext))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Function to extract internal links from file content
function extractInternalLinks(content, filePath) {
  const links = [];
  
  // Regex patterns for different types of internal links
  const patterns = [
    // href="/path" or href='/path'
    /href=['"]([^'"]*?)['"][^>]*>/g,
    // router.push('/path') or router.push("/path")
    /router\.push\(['"]([^'"]*?)['"][\),]/g,
    // Link to="/path" or Link to='/path'
    /Link\s+to=['"]([^'"]*?)['"][^>]*>/g,
    // redirect('/path') or redirect("/path")
    /redirect\(['"]([^'"]*?)['"][\),]/g,
    // pathname: '/path' or pathname: "/path"
    /pathname:\s*['"]([^'"]*?)['"][,}]/g,
    // url: '/path' or url: "/path"
    /url:\s*['"]([^'"]*?)['"][,}]/g
  ];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      const link = match[1];
      
      // Filter for internal links (start with / but not //)
      if (link.startsWith('/') && !link.startsWith('//')) {
        // Exclude common external patterns
        if (!link.startsWith('/images/') && 
            !link.startsWith('/icons/') && 
            !link.startsWith('/api/') &&
            !link.includes('mailto:') &&
            !link.includes('tel:') &&
            !link.includes('#')) {
          
          links.push({
            url: link,
            file: path.relative(process.cwd(), filePath),
            line: content.substring(0, match.index).split('\n').length
          });
        }
      }
    }
  }
  
  return links;
}

// Function to check if a route exists in the app directory
function checkRouteExists(route) {
  // Remove query parameters and hash
  const cleanRoute = route.split('?')[0].split('#')[0];
  
  // Handle dynamic routes and locale prefixes
  const routeWithoutLocale = cleanRoute.replace(/^\/[a-z]{2}(\/|$)/, '/');
  const finalRoute = routeWithoutLocale === '/' ? '' : routeWithoutLocale;
  
  // Check for page.tsx/page.js in app directory
  const possiblePaths = [
    path.join('src', 'app', '[locale]' + finalRoute, 'page.tsx'),
    path.join('src', 'app', '[locale]' + finalRoute, 'page.js'),
    path.join('src', 'app' + finalRoute, 'page.tsx'),
    path.join('src', 'app' + finalRoute, 'page.js'),
    // Check for dynamic routes
    path.join('src', 'app', '[locale]' + finalRoute.replace(/\/[^\/]+$/, '/[slug]'), 'page.tsx'),
    path.join('src', 'app', '[locale]' + finalRoute.replace(/\/[^\/]+$/, '/[id]'), 'page.tsx'),
  ];
  
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      return { exists: true, path: possiblePath };
    }
  }
  
  // Check for static files in public directory
  const publicPath = path.join('public' + cleanRoute);
  if (fs.existsSync(publicPath)) {
    return { exists: true, path: publicPath, type: 'static' };
  }
  
  return { exists: false };
}

console.log('🔍 Starting internal link analysis...\n');

// Find all relevant files
const sourceFiles = [
  ...findFiles('src', ['.tsx', '.ts', '.js', '.jsx']),
  ...findFiles('content', ['.mdx', '.md'])
];

console.log(`📁 Found ${sourceFiles.length} files to analyze`);

// Extract all internal links
let allLinks = [];
for (const file of sourceFiles) {
  try {
    const content = fs.readFileSync(file, 'utf8');
    const links = extractInternalLinks(content, file);
    allLinks.push(...links);
  } catch (error) {
    console.log(`⚠️  Error reading ${file}: ${error.message}`);
  }
}

console.log(`🔗 Found ${allLinks.length} internal links to check\n`);

// Group links by URL for easier analysis
const linksByUrl = {};
for (const link of allLinks) {
  if (!linksByUrl[link.url]) {
    linksByUrl[link.url] = [];
  }
  linksByUrl[link.url].push(link);
}

// Check each unique URL
const results = {
  valid: [],
  invalid: [],
  suspicious: []
};

console.log('🔍 Checking routes...\n');

for (const [url, occurrences] of Object.entries(linksByUrl)) {
  const check = checkRouteExists(url);
  
  if (check.exists) {
    results.valid.push({ url, occurrences, path: check.path, type: check.type });
  } else {
    // Check if it might be a valid dynamic route or API endpoint
    if (url.includes('/api/') || 
        url.match(/\/\d+$/) || // ends with number (likely ID)
        url.includes('[') || 
        url.includes(']')) {
      results.suspicious.push({ url, occurrences, reason: 'Dynamic route or API endpoint' });
    } else {
      results.invalid.push({ url, occurrences });
    }
  }
}

// Report results
console.log('📊 RESULTS:\n');

console.log(`✅ Valid links: ${results.valid.length}`);
if (results.valid.length > 0) {
  console.log('   Sample valid links:');
  results.valid.slice(0, 5).forEach(item => {
    console.log(`   • ${item.url} (${item.occurrences.length} occurrences)`);
  });
  if (results.valid.length > 5) {
    console.log(`   ... and ${results.valid.length - 5} more`);
  }
}

console.log(`\n⚠️  Suspicious links: ${results.suspicious.length}`);
if (results.suspicious.length > 0) {
  results.suspicious.forEach(item => {
    console.log(`   • ${item.url} - ${item.reason} (${item.occurrences.length} occurrences)`);
  });
}

console.log(`\n❌ Potentially broken links: ${results.invalid.length}`);
if (results.invalid.length > 0) {
  results.invalid.forEach(item => {
    console.log(`   • ${item.url} (${item.occurrences.length} occurrences)`);
    item.occurrences.slice(0, 3).forEach(occ => {
      console.log(`     - ${occ.file}:${occ.line}`);
    });
    if (item.occurrences.length > 3) {
      console.log(`     ... and ${item.occurrences.length - 3} more occurrences`);
    }
  });
}

// Summary
console.log('\n📋 SUMMARY:');
console.log(`   Total unique URLs checked: ${Object.keys(linksByUrl).length}`);
console.log(`   Valid: ${results.valid.length}`);
console.log(`   Suspicious: ${results.suspicious.length}`);
console.log(`   Potentially broken: ${results.invalid.length}`);

if (results.invalid.length > 0) {
  console.log('\n🔧 RECOMMENDATIONS:');
  console.log('   1. Review potentially broken links and update them');
  console.log('   2. Create missing pages if they should exist');
  console.log('   3. Add redirects for moved content');
  console.log('   4. Consider implementing a 404 page with helpful navigation');
}

console.log('\n✨ Internal link analysis completed!');