const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fathr\\.gemini\\antigravity\\brain\\c81aa0cf-0f1b-453a-9893-d155e03dac4f';

async function run() {
  const browser = await chromium.launch({ channel: 'chrome' });
  
  // 1. Mobile 360 x 800 - Hero
  console.log('Testing 360x800 Mobile Hero...');
  const page360 = await browser.newPage({ viewport: { width: 360, height: 800 } });
  await page360.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page360.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_hero_360x800.png') });

  // 2. Mobile 360 x 800 - Events List
  console.log('Testing 360x800 Mobile Events List...');
  await page360.evaluate(() => {
    const el = document.getElementById('events');
    if (el) el.scrollIntoView({ behavior: 'instant' });
  });
  await page360.waitForTimeout(500);
  await page360.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_events_list_360x800.png') });

  // 3. Mobile 390 x 844 - Hero
  console.log('Testing 390x844 Mobile Hero...');
  const page390 = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page390.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page390.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_hero_390x844.png') });

  // 4. Mobile 430 x 932 - Hero
  console.log('Testing 430x932 Mobile Hero...');
  const page430 = await browser.newPage({ viewport: { width: 430, height: 932 } });
  await page430.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page430.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_hero_430x932.png') });

  // 5. Desktop 1440 x 900
  console.log('Testing 1440x900 Desktop Header & Hero...');
  const pageDesk = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await pageDesk.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await pageDesk.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_header_hero_1440x900.png') });

  // 6. Mobile Detail Page
  console.log('Testing Mobile Detail Page...');
  await page360.goto('http://localhost:3000/acara/keroncong-di-beranda', { waitUntil: 'networkidle' });
  await page360.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_detail_360x800.png') });

  await browser.close();
  console.log('Semua screenshot berhasil diambil!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
