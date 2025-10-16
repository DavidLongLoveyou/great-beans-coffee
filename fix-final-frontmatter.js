const fs = require('fs');
const path = require('path');

// Fix specific frontmatter issues
function fixFrontmatterIssues() {
  const fixes = [
    {
      file: 'content/origin-stories/en/da-lat-arabica-highlands.mdx',
      action: 'fix-frontmatter'
    },
    {
      file: 'content/origin-stories/en/dak-lak-central-highlands.mdx', 
      action: 'fix-frontmatter'
    },
    {
      file: 'content/blog/en/vietnam-coffee-export-trends-2024.mdx',
      action: 'fix-excerpt'
    },
    {
      file: 'content/blog/en/vietnamese-arabica-specialty-coffee-revolution.mdx',
      action: 'fix-tags'
    },
    {
      file: 'content/market-reports/en/vietnam-robusta-market-analysis-2024.mdx',
      action: 'fix-tags'
    }
  ];

  fixes.forEach(fix => {
    const filePath = path.join(__dirname, fix.file);
    console.log(`Fixing ${fix.file}...`);
    
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      let newContent = content;

      if (fix.action === 'fix-frontmatter') {
        // Rebuild frontmatter for origin stories
        const bodyMatch = content.match(/# (.+)/);
        if (bodyMatch) {
          const bodyStart = content.indexOf(bodyMatch[0]);
          const body = content.substring(bodyStart);
          
          const frontmatter = fix.file.includes('da-lat') ? 
            getDaLatFrontmatter() : getDakLakFrontmatter();
          
          newContent = `---\n${frontmatter}\n---\n\n${body}`;
        }
      } else if (fix.action === 'fix-excerpt') {
        // Fix excerpt quotes
        newContent = content.replace(
          /excerpt: "Vietnam"s coffee exports/,
          'excerpt: "Vietnam\'s coffee exports'
        );
      } else if (fix.action === 'fix-tags') {
        // Fix tags indentation
        newContent = content.replace(
          /tags: - '/,
          'tags:\n- \''
        );
      }

      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed ${fix.file}`);
      
    } catch (error) {
      console.log(`❌ Error fixing ${fix.file}: ${error.message}`);
    }
  });
}

function getDaLatFrontmatter() {
  return `title: 'Da Lat Arabica Highlands: Where Vietnamese Coffee Excellence Begins'
description: 'Discover the exceptional Arabica coffee cultivation in Da Lat's highland terroir, where perfect climate and volcanic soil create world-class specialty coffee.'
publishedAt: "2024-01-15"
author: "Great Beans Coffee Team"
category: 'ORIGIN_STORIES'
locale: "en"
province: "Lam Dong"
altitude: "1,200-1,800m"
region: 'Da Lat, Lam Dong Province'
coffeeVariety: "Arabica"
elevation: '1,200-1,800m'
climate: 'Subtropical highland climate with distinct wet and dry seasons'
soilType: 'Volcanic red basalt with excellent drainage'
harvestSeason: 'October to February'
processingMethods:
- 'Washed'
- 'Honey'
- 'Natural'
cupProfile: 'Bright acidity, floral notes, medium body, citrus undertones'
certifications:
- 'Organic'
- 'Rainforest Alliance'
- 'UTZ'
featured: true
coverImage: '/images/origin-stories/da-lat-arabica-highlands.jpg'
excerpt: 'Nestled in the cool highlands of Da Lat, Vietnamese Arabica coffee thrives in perfect terroir conditions, producing exceptional specialty coffee with unique flavor profiles.'
seoTitle: 'Da Lat Arabica Coffee - Vietnamese Highland Specialty Coffee Origin'
seoDescription: 'Discover Da Lat exceptional Arabica coffee cultivation in Vietnam highlands. Perfect terroir, sustainable farming, and world-class specialty coffee quality.'
keywords:
- 'da lat coffee'
- 'vietnamese arabica'
- 'highland coffee'
- 'specialty coffee'
- 'coffee origin'`;
}

function getDakLakFrontmatter() {
  return `title: 'Dak Lak Central Highlands: The Heart of Vietnamese Coffee Excellence'
description: 'Discover the legendary coffee region of Dak Lak in Vietnam's Central Highlands, where volcanic soils and perfect climate create exceptional Robusta and Arabica beans.'
publishedAt: "2024-01-15"
author: "Great Beans Coffee Team"
category: 'ORIGIN_STORIES'
locale: "en"
province: "Dak Lak"
altitude: "500-1,500m"
region: 'Dak Lak Province, Central Highlands, Vietnam'
coffeeVariety: "Robusta, Arabica"
elevation: '500-1,500m'
climate: 'Tropical highland monsoon with distinct wet and dry seasons'
soilType: 'Volcanic red basalt soil with excellent drainage'
harvestSeason: 'October to February'
processingMethods:
- 'Wet'
- 'Semi-washed'
- 'Natural'
- 'Honey'
cupProfile: 'Full body, low acidity, chocolate notes, earthy undertones'
certifications:
- 'Rainforest Alliance'
- 'UTZ Certified'
- 'Organic'
- 'Fair Trade'
featured: true
coverImage: '/images/origin-stories/dak-lak-central-highlands.jpg'
excerpt: 'The legendary coffee heartland of Vietnam, Dak Lak Province in the Central Highlands produces some of the world\'s finest Robusta and premium Arabica beans on volcanic soils that have nurtured coffee excellence for generations.'
seoTitle: 'Dak Lak Central Highlands Coffee - Vietnam Coffee Excellence'
seoDescription: 'Explore Dak Lak Central Highlands, Vietnam\'s premier coffee region producing exceptional Robusta and Arabica beans on volcanic soils.'
keywords:
- 'dak lak coffee'
- 'central highlands'
- 'vietnamese robusta'
- 'coffee origin'
- 'volcanic soil coffee'`;
}

// Run the fixes
console.log('🔧 Fixing final frontmatter issues...\n');
fixFrontmatterIssues();
console.log('\n✅ All frontmatter issues fixed!');