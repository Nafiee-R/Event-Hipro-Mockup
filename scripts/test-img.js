const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE:', msg.text()));
  await page.setContent(`<!DOCTYPE html><html><body><img id="testimg" src="http://localhost:3000/images/events/keroncong.svg" /></body></html>`);
  await page.waitForTimeout(1000);
  const info = await page.evaluate(() => {
    const img = document.getElementById('testimg');
    return { complete: img.complete, naturalWidth: img.naturalWidth, naturalHeight: img.naturalHeight };
  });
  console.log('IMG INFO:', info);
  await browser.close();
})();
