const fs = require('fs');
const path = require('path');

// Components that should be dynamically imported
const HEAVY_COMPONENTS = [
  'Chart',
  'DataTable',
  'Calendar',
  'Dialog',
  'Sheet',
  'Popover',
  'Tooltip',
  'DropdownMenu',
  'NavigationMenu',
  'Accordion',
  'Tabs',
  'Select',
  'Combobox',
  'Command',
  'Carousel',
  'Slider',
  'Progress',
  'ScrollArea',
  'Separator',
  'Toggle',
  'ToggleGroup',
  'RadioGroup',
  'Checkbox',
  'Switch',
  'Textarea',
  'Input',
  'Label',
  'Button',
  'Badge',
  'Avatar',
  'Card',
  'Alert',
  'AlertDialog',
  'AspectRatio',
  'Collapsible',
  'ContextMenu',
  'HoverCard',
  'Menubar',
  'ResizablePanelGroup',
  'Skeleton',
  'Sonner',
  'Table',
  'Toast'
];

// Scan for component usage
function scanDirectory(dir, results = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      scanDirectory(filePath, results);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Analyze component usage
function analyzeComponentUsage() {
  const files = scanDirectory('./src');
  const componentUsage = new Map();
  
  for (const filePath of files) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for heavy component imports
      for (const component of HEAVY_COMPONENTS) {
        const importRegex = new RegExp(`import.*${component}.*from`, 'g');
        const usageRegex = new RegExp(`<${component}[\\s>]`, 'g');
        
        if (importRegex.test(content) || usageRegex.test(content)) {
          if (!componentUsage.has(component)) {
            componentUsage.set(component, []);
          }
          componentUsage.get(component).push(filePath);
        }
      }
    } catch (error) {
      console.warn(`Warning: Could not read file ${filePath}:`, error.message);
    }
  }
  
  return componentUsage;
}

// Generate dynamic import suggestions
function generateOptimizationSuggestions(componentUsage) {
  console.log('🔍 Bundle Size Optimization Analysis\n');
  console.log('=' .repeat(50));
  
  const suggestions = [];
  
  for (const [component, files] of componentUsage.entries()) {
    if (files.length > 0) {
      console.log(`\n📦 ${component} (used in ${files.length} files):`);
      
      // Check if component is used in critical pages
      const criticalFiles = files.filter(file => 
        file.includes('/page.') || 
        file.includes('/layout.') ||
        file.includes('/loading.') ||
        file.includes('/error.')
      );
      
      if (criticalFiles.length === 0) {
        console.log(`   ✅ Safe to dynamically import`);
        suggestions.push({
          component,
          files,
          recommendation: 'dynamic-import',
          priority: 'high'
        });
      } else {
        console.log(`   ⚠️  Used in critical pages - consider lazy loading`);
        suggestions.push({
          component,
          files: criticalFiles,
          recommendation: 'lazy-load',
          priority: 'medium'
        });
      }
      
      files.forEach(file => {
        console.log(`     - ${file.replace(process.cwd(), '.')}`);
      });
    }
  }
  
  return suggestions;
}

// Generate dynamic import code
function generateDynamicImportCode(suggestions) {
  console.log('\n\n🚀 Dynamic Import Code Suggestions:\n');
  console.log('=' .repeat(50));
  
  const highPriority = suggestions.filter(s => s.priority === 'high');
  
  if (highPriority.length > 0) {
    console.log('\n// Add these dynamic imports to reduce initial bundle size:\n');
    
    for (const suggestion of highPriority) {
      const component = suggestion.component;
      console.log(`// Dynamic import for ${component}`);
      console.log(`const ${component} = dynamic(() => import('@/components/ui/${component.toLowerCase()}'), {`);
      console.log(`  loading: () => <div className="animate-pulse bg-muted h-8 w-24 rounded" />,`);
      console.log(`  ssr: false`);
      console.log(`});\n`);
    }
  }
  
  console.log('\n// Consider creating a dynamic UI components file:');
  console.log('// src/components/ui/dynamic.tsx\n');
  
  console.log(`import dynamic from 'next/dynamic';

// Heavy UI components loaded dynamically
export const DynamicChart = dynamic(() => import('./chart'), {
  loading: () => <div className="animate-pulse bg-muted h-64 w-full rounded" />,
  ssr: false
});

export const DynamicDataTable = dynamic(() => import('./data-table'), {
  loading: () => <div className="animate-pulse bg-muted h-96 w-full rounded" />,
  ssr: false
});

export const DynamicCalendar = dynamic(() => import('./calendar'), {
  loading: () => <div className="animate-pulse bg-muted h-80 w-full rounded" />,
  ssr: false
});`);
}

// Main execution
console.log('🔍 Analyzing component usage for bundle optimization...\n');

const componentUsage = analyzeComponentUsage();
const suggestions = generateOptimizationSuggestions(componentUsage);
generateDynamicImportCode(suggestions);

console.log('\n\n📊 Summary:');
console.log('=' .repeat(30));
console.log(`Total heavy components found: ${componentUsage.size}`);
console.log(`High priority optimizations: ${suggestions.filter(s => s.priority === 'high').length}`);
console.log(`Medium priority optimizations: ${suggestions.filter(s => s.priority === 'medium').length}`);

console.log('\n💡 Next Steps:');
console.log('1. Replace static imports with dynamic imports for non-critical components');
console.log('2. Create loading states for better UX');
console.log('3. Test bundle size reduction with: npm run build');
console.log('4. Analyze with: ANALYZE=true npm run build');