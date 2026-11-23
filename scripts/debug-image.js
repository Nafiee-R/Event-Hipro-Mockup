const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage();
  
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('HTTP ERROR:', res.status(), res.url());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  
  const imgStatus = await page.evaluate(async () => {
    const list = [];
    for (const img of document.querySelectorAll('img')) {
      list.push({ src: img.src, complete: img.complete, naturalWidth: img.naturalWidth });
    }
    return list;
  });
  console.log('IMG STATUS:', imgStatus);

  await browser.close();
})();
