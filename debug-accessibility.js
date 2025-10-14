const { chromium } = require('playwright');
const { injectAxe } = require('axe-playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    await injectAxe(page);

    // Run accessibility check
    const results = await page.evaluate(async () => {
      return await window.axe.run();
    });

    // Process accessibility violations
    if (results.violations.length > 0) {
      const violationSummary = results.violations.map((violation, index) => ({
        id: violation.id,
        impact: violation.impact,
        description: violation.description,
        help: violation.help,
        nodesAffected: violation.nodes.length,
        nodes: violation.nodes.map((node, nodeIndex) => ({
          target: node.target,
          html: node.html.substring(0, 100) + '...',
        })),
      }));

      // Write results to file instead of console
      const fs = require('fs');
      fs.writeFileSync(
        'accessibility-report.json',
        JSON.stringify(violationSummary, null, 2)
      );
    }
  } catch (error) {
    // Handle error silently or write to file
    const fs = require('fs');
    fs.writeFileSync('accessibility-error.log', error.message);
  } finally {
    await browser.close();
  }
})();
