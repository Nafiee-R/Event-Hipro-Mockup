const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fathr\\.gemini\\antigravity\\brain\\c81aa0cf-0f1b-453a-9893-d155e03dac4f';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });

  // 1. Mobile 360x800 - Carousel
  console.log('Capturing Mobile Carousel...');
  const pageMobile = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await pageMobile.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageMobile.evaluate(() => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'instant' });
  });
  await pageMobile.waitForTimeout(600);
  await pageMobile.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_carousel_360x800.png') });

  // 2. Desktop 1440x900 - Carousel (5 cards per row)
  console.log('Capturing Desktop Carousel...');
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageDesk.evaluate(() => {
    document.getElementById('events')?.scrollIntoView({ behavior: 'instant' });
  });
  await pageDesk.waitForTimeout(600);
  await pageDesk.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_carousel_1440x900.png') });

  await browser.close();
  console.log('Selesai!');
}

main().catch(console.error);
