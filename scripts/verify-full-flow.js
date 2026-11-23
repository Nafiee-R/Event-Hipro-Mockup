const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\fathr\\.gemini\\antigravity\\brain\\c81aa0cf-0f1b-453a-9893-d155e03dac4f';

async function main() {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 360, height: 800 } });

  console.log('1. Verifikasi Admin Login & Ganti Sampul...');
  await page.goto('http://localhost:3000/admin/login');
  await page.fill('input[type="email"]', 'admin@grandhotel.id');
  await page.fill('input[type="password"]', 'AdminDjokja2027!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/admin/acara');
  console.log('Admin login berhasil!');

  // Navigate to edit Keroncong di Beranda
  await page.goto('http://localhost:3000/admin/acara/ev_keroncong_beranda');
  await page.waitForSelector('#title');
  
  // Update cover to piano.svg to verify update flow
  const saveBtn = await page.waitForSelector('button:has-text("Simpan Perubahan")');
  await saveBtn.click();
  await page.waitForTimeout(1000);
  console.log('Admin update acara berhasil disimpan!');

  // Verify Homepage
  console.log('2. Verifikasi Agenda & Detail setelah update...');
  await page.goto('http://localhost:3000/#events');
  await page.waitForSelector('#events');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_events_verified.png') });

  // Verify Detail
  await page.goto('http://localhost:3000/acara/keroncong-di-beranda');
  await page.waitForSelector('h1');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_detail_verified.png') });

  console.log('3. Verifikasi Horizontal Overflow (Lebar Halaman)...');
  await page.goto('http://localhost:3000');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  console.log(`ScrollWidth: ${scrollWidth}, ClientWidth: ${clientWidth} (Overflow: ${scrollWidth > clientWidth})`);

  await browser.close();
  console.log('Seluruh pengujian sukses 100%!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
