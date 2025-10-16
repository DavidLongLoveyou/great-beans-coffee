const fs = require('fs');
const path = require('path');

const serviceFiles = [
  {
    file: 'content/services/de/private-label-kaffee-loesungen.mdx',
    frontmatter: `---
title: "Private Label Kaffee-Lösungen"
description: "Komplette Private Label Kaffee-Services von der Beschaffung bis zur Verpackung. Bauen Sie Ihre Kaffeemarke mit unserer Expertise in vietnamesischem Spezialitätenkaffee auf."
publishedAt: "2024-01-05"
updatedAt: "2024-01-15"
author: "The Great Beans Team"
category: "Services"
serviceType: "PRIVATE_LABEL"
locale: "de"
featured: true
coverImage: "/images/services/private-label-hero.jpg"
gallery:
- "/images/services/private-label-packaging.jpg"
- "/images/services/private-label-roasting.jpg"
- "/images/services/private-label-quality-control.jpg"
- "/images/services/private-label-branding.jpg"
excerpt: >
  Verwandeln Sie Ihre Vision in eine Premium-Kaffeemarke mit unseren umfassenden Private Label Lösungen, von der Bohnenauswahl bis zur finalen Verpackung.
readingTime: 8
seoTitle: "Private Label Kaffee-Lösungen - Individuelle Kaffeemarken-Entwicklung"
seoDescription: >
  Professionelle Private Label Kaffee-Services. Individuelle Röstung, Verpackung und Markenentwicklung für Ihr Kaffeegeschäft. Vietnamesische Spezialitätenkaffee-Expertise.
keywords:
- "private label kaffee"
- "vietnamesischer kaffee private label"
pricing:
  startingPrice: 2500
  currency: "USD"
  unit: "pro Projekt"
  priceRange: "2500-15000"
  deliveryTime: "4-8 Wochen"
  minimumOrder: "500 kg"
certifications:
- "ISO 22000"
- "HACCP"
- "Bio"
- "Fair Trade"
- "Rainforest Alliance"
targetMarkets:
- "Nordamerika"
- "Europa"
- "Asien-Pazifik"
- "Naher Osten"
serviceIncludes:
- "Kaffee-Beschaffung und -Auswahl"
- "Individuelle Röstprofile"
- "Verpackungsdesign und -produktion"
- "Markenentwicklungsberatung"
- "Qualitätskontrolle und -prüfung"
- "Logistik und Versand"
- "Regulatorische Compliance"
- "Marketing-Unterstützungsmaterialien"
---`
  },
  {
    file: 'content/services/en/oem-coffee-manufacturing.mdx',
    frontmatter: `---
title: "OEM Coffee Manufacturing Services"
description: "Professional OEM coffee manufacturing from concept to finished product. State-of-the-art facilities, custom formulations, and scalable production for global brands."
publishedAt: "2024-01-10"
updatedAt: "2024-01-20"
author: "The Great Beans Manufacturing Team"
category: "Services"
serviceType: "OEM_MANUFACTURING"
locale: "en"
featured: true
coverImage: "/images/services/oem-manufacturing-hero.jpg"
gallery:
- "/images/services/oem-production-line.jpg"
- "/images/services/oem-quality-lab.jpg"
- "/images/services/oem-packaging-systems.jpg"
- "/images/services/oem-roasting-facility.jpg"
- "/images/services/oem-finished-products.jpg"
excerpt: >
  Complete OEM coffee manufacturing solutions from concept to finished product. Advanced facilities, custom formulations, and scalable production for global brands.
readingTime: 12
seoTitle: "OEM Coffee Manufacturing Services - Custom Coffee Production Solutions"
seoDescription: >
  Professional OEM coffee manufacturing services. Custom formulations, scalable production, and quality assurance for global coffee brands. ISO certified facilities.
keywords:
- "OEM coffee manufacturing"
- "vietnamese coffee OEM"
pricing:
  startingPrice: 3500
  currency: "USD"
  unit: "per MT"
  priceRange: "3100-4200"
  deliveryTime: "30-60 days"
  minimumOrder: "20 MT"
certifications:
- "ISO 22000"
- "HACCP"
- "BRC"
- "SQF"
- "Organic"
- "Fair Trade"
- "Kosher"
- "Halal"
targetMarkets:
- "Global"
- "North America"
- "Europe"
- "Asia-Pacific"
- "Middle East"
- "Africa"
serviceIncludes:
- "Product development and formulation"
- "Custom roasting and blending"
- "Advanced packaging solutions"
- "Quality control and testing"
- "Regulatory compliance support"
- "Supply chain management"
- "Logistics and distribution"
- "Technical documentation"
- "Ongoing production support"
productionCapacity: "2000 MT/month"
facilitySize: "15000 sqm"
equipmentLines: 8
---`
  },
  {
    file: 'content/services/en/private-label-coffee-solutions.mdx',
    frontmatter: `---
title: "Private Label Coffee Solutions"
description: "Complete private label coffee services from sourcing to packaging. Build your coffee brand with our expertise in Vietnamese specialty coffee."
publishedAt: "2024-01-05"
updatedAt: "2024-01-15"
author: "The Great Beans Team"
category: "Services"
serviceType: "PRIVATE_LABEL"
locale: "en"
featured: true
coverImage: "/images/services/private-label-hero.jpg"
gallery:
- "/images/services/private-label-packaging.jpg"
- "/images/services/private-label-roasting.jpg"
- "/images/services/private-label-quality-control.jpg"
- "/images/services/private-label-branding.jpg"
excerpt: >
  Transform your vision into a premium coffee brand with our comprehensive private label solutions, from bean selection to final packaging.
readingTime: 8
seoTitle: "Private Label Coffee Solutions - Custom Coffee Brand Development"
seoDescription: >
  Professional private label coffee services. Custom roasting, packaging, and branding for your coffee business. Vietnamese specialty coffee expertise.
keywords:
- "private label coffee"
- "vietnamese coffee private label"
pricing:
  startingPrice: 2500
  currency: "USD"
  unit: "per project"
  priceRange: "2500-15000"
  deliveryTime: "4-8 weeks"
  minimumOrder: "500 kg"
certifications:
- "ISO 22000"
- "HACCP"
- "Organic"
- "Fair Trade"
- "Rainforest Alliance"
targetMarkets:
- "North America"
- "Europe"
- "Asia-Pacific"
- "Middle East"
serviceIncludes:
- "Coffee sourcing and selection"
- "Custom roasting profiles"
- "Packaging design and production"
- "Brand development consultation"
- "Quality control and testing"
- "Logistics and shipping"
- "Regulatory compliance"
- "Marketing support materials"
---`
  }
];

let fixedCount = 0;

serviceFiles.forEach(({ file, frontmatter }) => {
  try {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Find where the content starts (after the frontmatter)
      const contentMatch = content.match(/---[\s\S]*?---\n([\s\S]*)/);
      const bodyContent = contentMatch ? contentMatch[1] : '';
      
      // Rebuild the file with proper frontmatter
      const newContent = frontmatter + '\n\n' + bodyContent.trim();
      
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log(`✅ Fixed: ${file}`);
      fixedCount++;
    } else {
      console.log(`❌ File not found: ${file}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n✨ Fixed ${fixedCount} service files`);