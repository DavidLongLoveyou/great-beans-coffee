const fs = require('fs');
const path = require('path');

function performanceAudit() {
  console.log('🚀 Starting Performance Audit...\n');

  // 1. Analyze bundle sizes
  console.log('📦 Bundle Size Analysis:');
  console.log('='.repeat(50));

  const nextDir = path.join(__dirname, '..', '.next');
  const staticDir = path.join(nextDir, 'static');
  const chunksDir = path.join(staticDir, 'chunks');

  if (!fs.existsSync(chunksDir)) {
    console.log('❌ No build found. Please run "npm run build" first.');
    return;
  }

  // Analyze JavaScript chunks
  const jsFiles = fs
    .readdirSync(chunksDir)
    .filter(file => file.endsWith('.js'))
    .map(file => {
      const filePath = path.join(chunksDir, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size,
        sizeMB: (stats.size / 1024 / 1024).toFixed(2),
      };
    })
    .sort((a, b) => b.size - a.size);

  console.log('📊 JavaScript Chunks (Top 10):');
  jsFiles.slice(0, 10).forEach((file, index) => {
    console.log(`  ${index + 1}. ${file.name}: ${file.sizeMB} MB`);
  });

  const totalJSSize = jsFiles.reduce((sum, file) => sum + file.size, 0);
  console.log(
    `\n📈 Total JS Size: ${(totalJSSize / 1024 / 1024).toFixed(2)} MB`
  );

  // Analyze CSS files
  const cssDir = path.join(staticDir, 'css');
  if (fs.existsSync(cssDir)) {
    const cssFiles = fs
      .readdirSync(cssDir)
      .filter(file => file.endsWith('.css'))
      .map(file => {
        const filePath = path.join(cssDir, file);
        const stats = fs.statSync(filePath);
        return {
          name: file,
          size: stats.size,
          sizeMB: (stats.size / 1024 / 1024).toFixed(2),
        };
      })
      .sort((a, b) => b.size - a.size);

    console.log('\n🎨 CSS Files:');
    cssFiles.forEach((file, index) => {
      console.log(`  ${index + 1}. ${file.name}: ${file.sizeMB} MB`);
    });

    const totalCSSSize = cssFiles.reduce((sum, file) => sum + file.size, 0);
    console.log(
      `\n📈 Total CSS Size: ${(totalCSSSize / 1024 / 1024).toFixed(2)} MB`
    );
  }

  // 2. Analyze package.json dependencies
  console.log('\n\n📚 Dependency Analysis:');
  console.log('='.repeat(50));

  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});

    console.log(`📦 Production Dependencies: ${dependencies.length}`);
    console.log(`🔧 Development Dependencies: ${devDependencies.length}`);

    // Identify potentially heavy dependencies
    const heavyDeps = dependencies.filter(
      dep =>
        dep.includes('react') ||
        dep.includes('next') ||
        dep.includes('chart') ||
        dep.includes('recharts') ||
        dep.includes('lucide') ||
        dep.includes('framer') ||
        dep.includes('contentlayer')
    );

    console.log('\n🏋️ Potentially Heavy Dependencies:');
    heavyDeps.forEach(dep => {
      console.log(`  • ${dep}: ${packageJson.dependencies[dep]}`);
    });
  }

  // 3. Analyze Next.js configuration
  console.log('\n\n⚙️ Next.js Configuration Analysis:');
  console.log('='.repeat(50));

  const nextConfigPath = path.join(__dirname, '..', 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfig = fs.readFileSync(nextConfigPath, 'utf8');

    console.log('📋 Configuration Features:');

    // Check for performance optimizations
    const optimizations = [
      { feature: 'Image Optimization', check: nextConfig.includes('images') },
      {
        feature: 'Bundle Analyzer',
        check: nextConfig.includes('bundleAnalyzer'),
      },
      { feature: 'Compression', check: nextConfig.includes('compress') },
      {
        feature: 'Experimental Features',
        check: nextConfig.includes('experimental'),
      },
      {
        feature: 'Webpack Optimization',
        check: nextConfig.includes('webpack'),
      },
      { feature: 'SWC Minification', check: nextConfig.includes('swcMinify') },
      { feature: 'Output File Tracing', check: nextConfig.includes('output') },
    ];

    optimizations.forEach(opt => {
      const status = opt.check ? '✅' : '❌';
      console.log(`  ${status} ${opt.feature}`);
    });
  }

  // 4. Check for performance best practices
  console.log('\n\n🎯 Performance Best Practices Check:');
  console.log('='.repeat(50));

  const checks = [
    {
      name: 'Dynamic Imports Usage',
      check: () => {
        // Check if dynamic imports are used in components
        const srcDir = path.join(__dirname, '..', 'src');
        let dynamicImports = 0;

        function scanForDynamicImports(dir) {
          const items = fs.readdirSync(dir);
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              scanForDynamicImports(fullPath);
            } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              const matches = content.match(/import\(/g);
              if (matches) {
                dynamicImports += matches.length;
              }
            }
          }
        }

        scanForDynamicImports(srcDir);
        return dynamicImports;
      },
    },
    {
      name: 'Image Optimization',
      check: () => {
        const srcDir = path.join(__dirname, '..', 'src');
        let nextImages = 0;
        let regularImages = 0;

        function scanForImages(dir) {
          const items = fs.readdirSync(dir);
          for (const item of items) {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
              scanForImages(fullPath);
            } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
              const content = fs.readFileSync(fullPath, 'utf8');
              const nextImageMatches = content.match(
                /from ['"]next\/image['"]/g
              );
              const imgMatches = content.match(/<img/g);

              if (nextImageMatches) nextImages += nextImageMatches.length;
              if (imgMatches) regularImages += imgMatches.length;
            }
          }
        }

        scanForImages(srcDir);
        return { nextImages, regularImages };
      },
    },
  ];

  // Run dynamic imports check
  const dynamicImportsCount = checks[0].check();
  console.log(`📦 Dynamic Imports Found: ${dynamicImportsCount}`);

  // Run image optimization check
  const imageStats = checks[1].check();
  console.log(`🖼️ Next.js Image Components: ${imageStats.nextImages}`);
  console.log(`🖼️ Regular <img> Tags: ${imageStats.regularImages}`);

  if (imageStats.regularImages > 0) {
    console.log(
      '⚠️ Consider replacing <img> tags with Next.js Image component for better performance'
    );
  }

  // 5. Generate recommendations
  console.log('\n\n💡 Performance Recommendations:');
  console.log('='.repeat(50));

  const recommendations = [];

  if (totalJSSize > 5 * 1024 * 1024) {
    // > 5MB
    recommendations.push(
      '🔴 JavaScript bundle is large (>5MB). Consider code splitting and lazy loading.'
    );
  }

  if (jsFiles[0] && parseFloat(jsFiles[0].sizeMB) > 2) {
    recommendations.push(
      '🔴 Largest JS chunk is >2MB. Consider breaking it down.'
    );
  }

  if (dynamicImportsCount < 5) {
    recommendations.push(
      '🟡 Low usage of dynamic imports. Consider lazy loading heavy components.'
    );
  }

  if (imageStats.regularImages > imageStats.nextImages) {
    recommendations.push(
      '🟡 More regular <img> tags than Next.js Image components. Optimize images.'
    );
  }

  if (recommendations.length === 0) {
    console.log('✅ No major performance issues detected!');
  } else {
    recommendations.forEach((rec, index) => {
      console.log(`  ${index + 1}. ${rec}`);
    });
  }

  console.log('\n✅ Performance audit completed!');
}

// Run the audit
performanceAudit();
