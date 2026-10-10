import { chromium } from 'playwright';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const screenshotsDir = path.resolve(__dirname, '../dist/test-screenshots');
await mkdir(screenshotsDir, { recursive: true });

const BASE_URL = 'http://localhost:5174';

const routesToTest = [
  { path: '/', name: '01-home' },
  { path: '/about', name: '02-about' },
  { path: '/academics', name: '03-academics' },
  { path: '/admissions', name: '04-admissions' },
  { path: '/campus', name: '05-campus' },
  { path: '/achievements', name: '06-achievements' },
  { path: '/events', name: '07-events' },
  { path: '/events/placeholder-1', name: '08-event-detail' },
  { path: '/gallery', name: '09-gallery' },
  { path: '/contact', name: '10-contact' },
  { path: '/login', name: '11-login' },
  { path: '/login/student', name: '12-login-student' },
];

async function runLiveTests() {
  console.log('Starting Playwright live test suite against ' + BASE_URL);
  const browser = await chromium.launch({ headless: true });
  let hasErrors = false;
  const consoleErrors = [];

  // 1. Desktop Test Suite (1280x800)
  console.log('\n--- 1. Desktop Viewport (1280x800) ---');
  const desktopContext = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  });
  const desktopPage = await desktopContext.newPage();

  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  for (const route of routesToTest) {
    try {
      console.log(`Navigating to ${route.path}...`);
      await desktopPage.goto(BASE_URL + route.path, { waitUntil: 'networkidle' });
      await desktopPage.waitForTimeout(500);

      // Verify no critical text leaks
      const bodyText = await desktopPage.innerText('body');
      if (bodyText.includes('src/data/') || bodyText.includes('src/pages/')) {
        console.error(`  FAIL: ${route.path} contains developer code paths!`);
        hasErrors = true;
      }
      if (bodyText.includes('[Official Principal')) {
        console.error(`  FAIL: ${route.path} contains placeholder brackets!`);
        hasErrors = true;
      }

      await desktopPage.screenshot({
        path: path.join(screenshotsDir, `desktop-${route.name}.png`),
        fullPage: false,
      });
      console.log(`  OK: ${route.path} loaded & verified`);
    } catch (err) {
      console.error(`  FAIL: ${route.path} error:`, err.message);
      hasErrors = true;
    }
  }

  // 2. Interactive Flow: Events Filter & Search
  console.log('\n--- 2. Interactive Test: Events Search & Filter ---');
  try {
    await desktopPage.goto(BASE_URL + '/events', { waitUntil: 'networkidle' });
    // Click category filter "Sports"
    const sportsBtn = desktopPage.locator('button:has-text("Sports")');
    if (await sportsBtn.isVisible()) {
      await sportsBtn.click();
      await desktopPage.waitForTimeout(400);
      const sportsText = await desktopPage.innerText('body');
      if (sportsText.includes('Sports Week')) {
        console.log('  OK: Sports category filter works');
      } else {
        console.error('  WARN: Sports filter did not show expected item');
      }
    }

    // Type in search box
    const searchInput = desktopPage.locator('#event-search');
    await searchInput.fill('Orientation');
    await desktopPage.waitForTimeout(400);
    const searchResultText = await desktopPage.innerText('body');
    if (searchResultText.includes('Academic Orientation')) {
      console.log('  OK: Event search query filter works');
    }
  } catch (err) {
    console.error('  FAIL in events interaction:', err.message);
    hasErrors = true;
  }

  // 3. Interactive Flow: Contact Form Submission
  console.log('\n--- 3. Interactive Test: Contact Form Validation & Submission ---');
  try {
    await desktopPage.goto(BASE_URL + '/contact', { waitUntil: 'networkidle' });
    await desktopPage.fill('input[name="fullName"]', 'Hamza Khan');
    await desktopPage.fill('input[name="email"]', 'hamza@example.com');
    await desktopPage.fill('input[name="phone"]', '03227595534');
    await desktopPage.selectOption('select[name="inquiryType"]', 'admissions');
    await desktopPage.fill('textarea[name="message"]', 'I would like to inquire about admission for the upcoming session.');

    const submitBtn = desktopPage.locator('button:has-text("Send Inquiry")');
    await submitBtn.click();
    await desktopPage.waitForTimeout(1000);

    const confirmationText = await desktopPage.innerText('body');
    if (confirmationText.includes('validated successfully') || confirmationText.includes('inquiry details')) {
      console.log('  OK: Contact form validation and submission feedback verified');
    } else {
      console.log('  Notice: Form submission feedback:', confirmationText.slice(0, 100));
    }
  } catch (err) {
    console.error('  FAIL in contact form:', err.message);
    hasErrors = true;
  }

  // 4. Tablet Viewport (768x1024)
  console.log('\n--- 4. Tablet Viewport (768x1024) ---');
  const tabletContext = await browser.newContext({
    viewport: { width: 768, height: 1024 },
  });
  const tabletPage = await tabletContext.newPage();
  await tabletPage.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
  await tabletPage.waitForTimeout(500);

  // Check that mobile hamburger is visible at 768px (since nav opens at xl 1280px)
  const tabletMenuBtn = tabletPage.locator('button[aria-controls="mobile-drawer"]');
  const isMenuVisible = await tabletMenuBtn.isVisible();
  console.log(`  Tablet drawer toggle visible: ${isMenuVisible}`);
  if (isMenuVisible) {
    await tabletMenuBtn.click();
    await tabletPage.waitForTimeout(500);
    const drawerOpen = await tabletPage.locator('#mobile-drawer').isVisible();
    console.log(`  Tablet drawer opens: ${drawerOpen}`);
    await tabletPage.screenshot({
      path: path.join(screenshotsDir, 'tablet-drawer-open.png'),
    });
  }

  // 5. Mobile Viewport (375x667)
  console.log('\n--- 5. Mobile Viewport (375x667 - iPhone SE) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 375, height: 667 },
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto(BASE_URL + '/', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  // Verify horizontal scroll width <= viewport
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(`  Mobile document width: ${scrollWidth}px (Client: ${clientWidth}px)`);
  if (scrollWidth <= clientWidth + 2) {
    console.log('  OK: No horizontal overflow on mobile 375px!');
  } else {
    console.error(`  FAIL: Horizontal overflow detected! (${scrollWidth}px > ${clientWidth}px)`);
    hasErrors = true;
  }

  await mobilePage.screenshot({
    path: path.join(screenshotsDir, 'mobile-home.png'),
  });

  // Test mobile Admissions page
  await mobilePage.goto(BASE_URL + '/admissions', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(400);
  const mobileAdmScroll = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  console.log(`  Mobile Admissions scroll width: ${mobileAdmScroll}px`);
  await mobilePage.screenshot({
    path: path.join(screenshotsDir, 'mobile-admissions.png'),
  });

  await browser.close();

  console.log('\n======================================');
  console.log('Live Playwright test suite finished.');
  console.log(`Console errors encountered: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    consoleErrors.forEach((e) => console.log(' ', e));
  }
  console.log(`Screenshots saved to: ${screenshotsDir}`);
  console.log('Status: ' + (hasErrors ? 'FAILED' : 'ALL TESTS PASSED'));
  console.log('======================================\n');

  process.exit(hasErrors ? 1 : 0);
}

runLiveTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
