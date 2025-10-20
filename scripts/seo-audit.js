const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function auditSEOMetadata() {
  const contentDir = path.join(__dirname, '..', 'content');
  const results = {
    totalFiles: 0,
    issues: [],
    recommendations: [],
    summary: {
      missingTitles: 0,
      missingDescriptions: 0,
      missingKeywords: 0,
      missingSEOTitles: 0,
      missingSEODescriptions: 0,
      duplicateFrontmatter: 0,
      longTitles: 0,
      longDescriptions: 0,
      missingImages: 0,
      missingAuthors: 0,
      missingCategories: 0,
      missingReadingTime: 0,
      invalidYAML: 0,
    },
  };

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        auditFile(fullPath);
      }
    }
  }

  function auditFile(filePath) {
    results.totalFiles++;
    const relativePath = path.relative(contentDir, filePath);

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

      if (!frontmatterMatch) {
        results.issues.push({
          file: relativePath,
          type: 'error',
          message: 'No frontmatter found',
        });
        return;
      }

      // Check for duplicate frontmatter
      const frontmatterCount = (content.match(/^---$/gm) || []).length;
      if (frontmatterCount > 2) {
        results.summary.duplicateFrontmatter++;
        results.issues.push({
          file: relativePath,
          type: 'error',
          message: 'Duplicate frontmatter detected',
        });
      }

      let metadata;
      try {
        metadata = yaml.load(frontmatterMatch[1]);
      } catch (error) {
        results.summary.invalidYAML++;
        results.issues.push({
          file: relativePath,
          type: 'error',
          message: `YAML parsing error: ${error.message}`,
        });
        return;
      }

      // Check required fields
      if (!metadata.title) {
        results.summary.missingTitles++;
        results.issues.push({
          file: relativePath,
          type: 'error',
          message: 'Missing title',
        });
      } else if (metadata.title.length > 60) {
        results.summary.longTitles++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: `Title too long (${metadata.title.length} chars, recommended: <60)`,
        });
      }

      if (!metadata.description) {
        results.summary.missingDescriptions++;
        results.issues.push({
          file: relativePath,
          type: 'error',
          message: 'Missing description',
        });
      } else if (metadata.description.length > 160) {
        results.summary.longDescriptions++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: `Description too long (${metadata.description.length} chars, recommended: <160)`,
        });
      }

      if (!metadata.seoTitle) {
        results.summary.missingSEOTitles++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: 'Missing seoTitle for better SEO optimization',
        });
      }

      if (!metadata.seoDescription) {
        results.summary.missingSEODescriptions++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: 'Missing seoDescription for better SEO optimization',
        });
      }

      if (
        !metadata.keywords ||
        !Array.isArray(metadata.keywords) ||
        metadata.keywords.length === 0
      ) {
        results.summary.missingKeywords++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: 'Missing or empty keywords array',
        });
      }

      if (!metadata.coverImage && !metadata.images) {
        results.summary.missingImages++;
        results.issues.push({
          file: relativePath,
          type: 'info',
          message: 'No cover image or images specified',
        });
      }

      if (!metadata.author) {
        results.summary.missingAuthors++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: 'Missing author information',
        });
      }

      if (!metadata.category) {
        results.summary.missingCategories++;
        results.issues.push({
          file: relativePath,
          type: 'warning',
          message: 'Missing category',
        });
      }

      if (!metadata.readingTime) {
        results.summary.missingReadingTime++;
        results.issues.push({
          file: relativePath,
          type: 'info',
          message: 'Missing reading time estimate',
        });
      }
    } catch (error) {
      results.issues.push({
        file: relativePath,
        type: 'error',
        message: `File reading error: ${error.message}`,
      });
    }
  }

  scanDirectory(contentDir);

  // Generate recommendations
  if (results.summary.missingTitles > 0) {
    results.recommendations.push(
      `Add titles to ${results.summary.missingTitles} files`
    );
  }
  if (results.summary.missingDescriptions > 0) {
    results.recommendations.push(
      `Add descriptions to ${results.summary.missingDescriptions} files`
    );
  }
  if (results.summary.missingSEOTitles > 0) {
    results.recommendations.push(
      `Add SEO-optimized titles to ${results.summary.missingSEOTitles} files`
    );
  }
  if (results.summary.missingSEODescriptions > 0) {
    results.recommendations.push(
      `Add SEO descriptions to ${results.summary.missingSEODescriptions} files`
    );
  }
  if (results.summary.missingKeywords > 0) {
    results.recommendations.push(
      `Add keywords to ${results.summary.missingKeywords} files`
    );
  }
  if (results.summary.duplicateFrontmatter > 0) {
    results.recommendations.push(
      `Fix duplicate frontmatter in ${results.summary.duplicateFrontmatter} files`
    );
  }

  return results;
}

// Run audit
console.log('🔍 Starting SEO metadata audit...\n');
const auditResults = auditSEOMetadata();

console.log('📊 SEO Audit Results:');
console.log('='.repeat(50));
console.log(`Total files scanned: ${auditResults.totalFiles}`);
console.log(`Total issues found: ${auditResults.issues.length}`);
console.log();

console.log('📈 Summary:');
Object.entries(auditResults.summary).forEach(([key, value]) => {
  if (value > 0) {
    console.log(`  ${key}: ${value}`);
  }
});

if (auditResults.issues.length > 0) {
  console.log('\n🚨 Issues by type:');
  const errorCount = auditResults.issues.filter(i => i.type === 'error').length;
  const warningCount = auditResults.issues.filter(
    i => i.type === 'warning'
  ).length;
  const infoCount = auditResults.issues.filter(i => i.type === 'info').length;

  console.log(`  Errors: ${errorCount}`);
  console.log(`  Warnings: ${warningCount}`);
  console.log(`  Info: ${infoCount}`);

  console.log('\n📋 Detailed Issues:');
  auditResults.issues.forEach(issue => {
    const icon =
      issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
    console.log(`  ${icon} ${issue.file}: ${issue.message}`);
  });
}

if (auditResults.recommendations.length > 0) {
  console.log('\n💡 Recommendations:');
  auditResults.recommendations.forEach(rec => {
    console.log(`  • ${rec}`);
  });
}

console.log('\n✅ SEO audit completed!');
