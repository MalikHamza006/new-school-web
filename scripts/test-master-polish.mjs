import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const ARTIFACT_DIR = 'C:/Users/hamza/.gemini/antigravity-ide/brain/bc0eb274-b127-41d6-b116-2ec992dc3ed1';

mkdirSync(ARTIFACT_DIR, { recursive: true });

const VIEWPORTS = [
  { width: 320, height: 600, label: '320px-mobile-narrow' },
  { width: 360, height: 740, label: '360px-mobile' },
  { width: 375, height: 667, label: '375px-iphone-se' },
  { width: 390, height: 844, label: '390px-iphone-13' },
  { width: 414, height: 896, label: '414px-iphone-plus' },
  { width: 600, height: 960, label: '600px-small-tablet' },
  { width: 768, height: 1024, label: '768px-ipad' },
  { width: 820, height: 1180, label: '820px-ipad-air' },
  { width: 1024, height: 768, label: '1024px-tablet-landscape' },
  { width: 1280, height: 800, label: '1280px-desktop' },
  { width: 1440, height: 900, label: '1440px-macbook' },
  { width: 1920, height: 1080, label: '1920px-full-hd' },
];

async function runMasterAudit() {
  console.log(`Starting Master Audit & Responsiveness Verification against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const errors = [];
  const overflows = [];

  // --- 1. Multi-Viewport Responsiveness & Zero-Overflow Test ---
  console.log('\n=== Testing 12 Viewports for Zero Horizontal Overflow ===');
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });

    page.on('pageerror', (err) => errors.push(`[${vp.label}] Page Error: ${err.message}`));

    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1400); // wait for splash dismiss

    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);

    const hasOverflow = scrollWidth > clientWidth;
    if (hasOverflow) {
      overflows.push({ viewport: vp.label, scrollWidth, clientWidth, diff: scrollWidth - clientWidth });
      console.error(`❌ OVERFLOW on ${vp.label}: scrollWidth=${scrollWidth}, clientWidth=${clientWidth} (overflow: +${scrollWidth - clientWidth}px)`);
    } else {
      console.log(`✓ ${vp.label} (${vp.width}x${vp.height}): perfectly responsive (0px overflow)`);
    }

    if (vp.label === '320px-mobile-narrow' || vp.label === '1280px-desktop') {
      await page.screenshot({
        path: join(ARTIFACT_DIR, `audit-hero-${vp.label}.png`),
        fullPage: false,
      });
    }

    await page.close();
  }

  // --- 2. Interactive Feature Verification on Desktop ---
  console.log('\n=== Testing Welcome Audio Guide & AI Concierge Quick Actions ===');
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await desktopPage.waitForTimeout(1500);

  // Check Welcome Audio Guide in Hero
  const welcomeGuide = desktopPage.locator('[aria-label="Welcome audio guide"]');
  const guideVisible = await welcomeGuide.isVisible();
  console.log(`Hero Welcome Audio Guide visible: ${guideVisible}`);

  const listenBtn = welcomeGuide.locator('button[aria-label="Listen to Welcome"]');
  console.log(`Listen to Welcome button present: ${await listenBtn.isVisible()}`);
  await listenBtn.click();
  await desktopPage.waitForTimeout(800);

  // Check pause/stop appeared
  const pauseBtn = welcomeGuide.locator('button[aria-label="Pause audio"]');
  console.log(`Pause audio button active: ${await pauseBtn.isVisible()}`);
  const stopBtn = welcomeGuide.locator('button[aria-label="Stop audio"]');
  console.log(`Stop audio button active: ${await stopBtn.isVisible()}`);

  // Test stop
  await stopBtn.click();
  await desktopPage.waitForTimeout(400);
  console.log(`Back to Listen button after Stop: ${await listenBtn.isVisible()}`);

  // Screenshot hero with welcome audio guide
  await desktopPage.screenshot({
    path: join(ARTIFACT_DIR, 'audit-hero-welcome-guide.png'),
    fullPage: false,
  });

  // Open Spectral AI Concierge
  const conciergeTrigger = desktopPage.locator('button[aria-label="Open Spectral AI Concierge"]');
  console.log(`AI Concierge trigger button visible: ${await conciergeTrigger.isVisible()}`);
  await conciergeTrigger.click();
  await desktopPage.waitForTimeout(600);

  // Check Quick Suggestions chips in Concierge
  const quickChips = desktopPage.locator('aside button:has-text("How can I apply?")');
  console.log(`Quick Suggestion "How can I apply?" chip visible: ${await quickChips.isVisible()}`);

  // Click quick chip
  await quickChips.click();
  await desktopPage.waitForTimeout(4000);

  const messages = await desktopPage.locator('aside [role="log"] p').allInnerTexts();
  console.log('Concierge conversation after Quick Action:');
  messages.forEach((m, idx) => console.log(`  [${idx + 1}] ${m}`));

  // Screenshot AI Concierge panel with quick actions & response
  await desktopPage.screenshot({
    path: join(ARTIFACT_DIR, 'audit-ai-concierge-quick-actions.png'),
    fullPage: false,
  });

  await desktopPage.close();
  await browser.close();

  console.log('\n=== Master Audit Summary ===');
  console.log(`Total Viewports Tested: ${VIEWPORTS.length}`);
  console.log(`Overflow Violations: ${overflows.length}`);
  console.log(`Runtime / Page Errors: ${errors.length}`);
}

runMasterAudit().catch((err) => {
  console.error('Fatal audit failure:', err);
  process.exit(1);
});
