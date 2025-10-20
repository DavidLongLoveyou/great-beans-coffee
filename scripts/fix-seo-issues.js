const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

function fixSEOIssues() {
  const contentDir = path.join(__dirname, '..', 'content');
  let fixedFiles = 0;
  let totalIssues = 0;

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.endsWith('.mdx')) {
        if (fixFile(fullPath)) {
          fixedFiles++;
        }
      }
    }
  }

  function fixFile(filePath) {
    const relativePath = path.relative(contentDir, filePath);
    let hasChanges = false;
    let issues = [];

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;

      // Fix 1: Remove duplicate frontmatter
      const frontmatterMatches = content.match(/^---\n([\s\S]*?)\n---/g);
      if (frontmatterMatches && frontmatterMatches.length > 1) {
        console.log(`🔧 Fixing duplicate frontmatter in ${relativePath}`);

        // Extract all frontmatter blocks
        const frontmatterBlocks = frontmatterMatches
          .map(match => {
            const yamlContent = match
              .replace(/^---\n/, '')
              .replace(/\n---$/, '');
            try {
              return yaml.load(yamlContent);
            } catch (error) {
              console.log(
                `⚠️ Error parsing YAML in ${relativePath}: ${error.message}`
              );
              return null;
            }
          })
          .filter(block => block !== null);

        if (frontmatterBlocks.length > 1) {
          // Merge frontmatter blocks, with later blocks taking precedence
          const mergedFrontmatter = Object.assign({}, ...frontmatterBlocks);

          // Remove all existing frontmatter
          content = content.replace(/^---\n[\s\S]*?\n---\n*/g, '');

          // Add merged frontmatter at the beginning
          const yamlString = yaml.dump(mergedFrontmatter, {
            lineWidth: -1,
            noRefs: true,
            quotingType: '"',
            forceQuotes: false,
          });
          content = `---\n${yamlString}---\n${content}`;
          hasChanges = true;
          issues.push('Fixed duplicate frontmatter');
        }
      }

      // Parse the current frontmatter for further fixes
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
      if (!frontmatterMatch) {
        console.log(`⚠️ No frontmatter found in ${relativePath}`);
        return false;
      }

      let metadata;
      try {
        metadata = yaml.load(frontmatterMatch[1]);
      } catch (error) {
        console.log(
          `⚠️ YAML parsing error in ${relativePath}: ${error.message}`
        );
        return hasChanges;
      }

      let metadataChanged = false;

      // Fix 2: Add missing SEO fields
      if (!metadata.seoTitle && metadata.title) {
        metadata.seoTitle =
          metadata.title.length > 60
            ? metadata.title.substring(0, 57) + '...'
            : metadata.title;
        metadataChanged = true;
        issues.push('Added seoTitle');
      }

      if (!metadata.seoDescription && metadata.description) {
        metadata.seoDescription =
          metadata.description.length > 160
            ? metadata.description.substring(0, 157) + '...'
            : metadata.description;
        metadataChanged = true;
        issues.push('Added seoDescription');
      }

      // Fix 3: Add keywords if missing
      if (
        !metadata.keywords ||
        !Array.isArray(metadata.keywords) ||
        metadata.keywords.length === 0
      ) {
        // Generate basic keywords from title and category
        const keywords = [];
        if (metadata.title) {
          // Extract meaningful words from title
          const titleWords = metadata.title
            .toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3);
          keywords.push(...titleWords.slice(0, 3));
        }
        if (metadata.category) {
          keywords.push(metadata.category.toLowerCase().replace(/_/g, ' '));
        }
        // Add coffee-related keywords
        keywords.push('coffee', 'vietnam coffee');

        metadata.keywords = [...new Set(keywords)]; // Remove duplicates
        metadataChanged = true;
        issues.push('Added keywords');
      }

      // Fix 4: Add reading time if missing
      if (!metadata.readingTime) {
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const wordCount = bodyContent.split(/\s+/).length;
        metadata.readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
        metadataChanged = true;
        issues.push('Added reading time');
      }

      // Fix 5: Ensure author is present
      if (!metadata.author) {
        metadata.author = 'The Great Beans Team';
        metadataChanged = true;
        issues.push('Added default author');
      }

      // Fix 6: Add category if missing
      if (!metadata.category) {
        // Infer category from file path
        const pathParts = relativePath.split(path.sep);
        if (pathParts.includes('blog')) {
          metadata.category = 'Blog';
        } else if (pathParts.includes('services')) {
          metadata.category = 'BUSINESS_SERVICE';
        } else if (pathParts.includes('market-reports')) {
          metadata.category = 'Market Report';
        } else if (pathParts.includes('origin-stories')) {
          metadata.category = 'Origin Story';
        } else {
          metadata.category = 'General';
        }
        metadataChanged = true;
        issues.push('Added category');
      }

      // Fix 7: Ensure dates are properly formatted
      if (!metadata.publishedAt) {
        metadata.publishedAt = '2024-01-01';
        metadataChanged = true;
        issues.push('Added publishedAt');
      }

      if (!metadata.updatedAt) {
        metadata.updatedAt = metadata.publishedAt || '2024-01-01';
        metadataChanged = true;
        issues.push('Added updatedAt');
      }

      // Fix 8: Add locale if missing
      if (!metadata.locale) {
        const pathParts = relativePath.split(path.sep);
        const localeFromPath = pathParts.find(part =>
          ['en', 'vi', 'de', 'ja'].includes(part)
        );
        metadata.locale = localeFromPath || 'en';
        metadataChanged = true;
        issues.push('Added locale');
      }

      // Fix 9: Truncate long titles and descriptions
      if (metadata.title && metadata.title.length > 60) {
        metadata.title = metadata.title.substring(0, 57) + '...';
        metadataChanged = true;
        issues.push('Truncated long title');
      }

      if (metadata.description && metadata.description.length > 160) {
        metadata.description = metadata.description.substring(0, 157) + '...';
        metadataChanged = true;
        issues.push('Truncated long description');
      }

      // Apply metadata changes
      if (metadataChanged) {
        const bodyContent = content.replace(/^---\n[\s\S]*?\n---\n/, '');
        const yamlString = yaml.dump(metadata, {
          lineWidth: -1,
          noRefs: true,
          quotingType: '"',
          forceQuotes: false,
        });
        content = `---\n${yamlString}---\n${bodyContent}`;
        hasChanges = true;
      }

      // Write changes if any
      if (hasChanges && content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${relativePath}: ${issues.join(', ')}`);
        totalIssues += issues.length;
        return true;
      }
    } catch (error) {
      console.log(`❌ Error processing ${relativePath}: ${error.message}`);
    }

    return false;
  }

  scanDirectory(contentDir);

  console.log(`\n📊 Summary:`);
  console.log(`  Files fixed: ${fixedFiles}`);
  console.log(`  Total issues resolved: ${totalIssues}`);
}

// Run the fix
console.log('🔧 Starting SEO issues fix...\n');
fixSEOIssues();
console.log('\n✅ SEO fixes completed!');
