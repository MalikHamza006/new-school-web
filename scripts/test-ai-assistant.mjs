import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const BASE_URL = process.env.TEST_URL || 'http://localhost:5174';
const ARTIFACT_DIR = join(
  'C:',
  'Users',
  'hamza',
  '.gemini',
  'antigravity-ide',
  'brain',
  'bc0eb274-b127-41d6-b116-2ec992dc3ed1'
);

mkdirSync(ARTIFACT_DIR, { recursive: true });

async function run() {
  console.log(`Starting live Playwright tests for Spectral AI Assistant against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const consoleLogs = [];
  const errors = [];

  // --- 1. Desktop Test ---
  console.log('\n--- 1. Desktop Viewport (1280x800) ---');
  const desktopPage = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  desktopPage.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleLogs.push(`[Console Error] ${msg.text()}`);
    }
  });

  desktopPage.on('pageerror', (err) => {
    errors.push(`[Page Error] ${err.message}`);
  });

  await desktopPage.goto(BASE_URL, { waitUntil: 'networkidle' });
  // Wait for the welcome splash (1.6s) to completely dismiss
  await desktopPage.waitForTimeout(2200);

  // Check floating button exists
  const aiButton = desktopPage.locator('button[aria-label="Open Spectral AI Concierge"]');
  const buttonVisible = await aiButton.isVisible();
  console.log(`Desktop: AI Floating trigger button visible: ${buttonVisible}`);

  // Screenshot with floating button
  await desktopPage.screenshot({
    path: join(ARTIFACT_DIR, 'ai-assistant-01-floating-trigger.png'),
    fullPage: false,
  });

  // Open the assistant
  await aiButton.click();
  await desktopPage.waitForTimeout(600);

  // Check panel is open
  const panel = desktopPage.locator('aside[role="dialog"]');
  const panelVisible = await panel.isVisible();
  console.log(`Desktop: Assistant panel open: ${panelVisible}`);

  // Check header text
  const headerText = await desktopPage.locator('aside header').innerText();
  console.log(`Desktop: Header content:\n${headerText.trim()}`);

  // Check welcome message
  const welcomeMsg = desktopPage.locator('text=Welcome to Spectral Model School');
  const welcomeVisible = await welcomeMsg.isVisible();
  console.log(`Desktop: Welcome message visible: ${welcomeVisible}`);

  // Screenshot initial panel open
  await desktopPage.screenshot({
    path: join(ARTIFACT_DIR, 'ai-assistant-02-panel-open.png'),
    fullPage: false,
  });

  // Test typing a question
  console.log('Desktop: Sending a query via text input fallback...');
  const input = desktopPage.locator('input[placeholder="Type your question..."]');
  await input.fill('What is Spectral School LMS and what can I do with it?');
  
  const sendBtn = desktopPage.locator('button[aria-label="Send message"]');
  await sendBtn.click();

  // Wait for processing state or response
  await desktopPage.waitForTimeout(2000);

  // Check messages count (should be at least 2: welcome + user, and possibly AI response)
  const messagesCount = await desktopPage.locator('aside [role="log"] > div').count();
  console.log(`Desktop: Number of message items in log: ${messagesCount}`);

  // Wait for processing state to complete (up to 8 seconds)
  try {
    await desktopPage.waitForFunction(
      () => {
        const text = document.querySelector('aside [role="log"]')?.textContent || '';
        return text.includes('Spectral AI:') || (!text.includes('thinking') && document.querySelectorAll('aside [role="log"] > div').length >= 3);
      },
      { timeout: 8000 }
    );
  } catch {
    // If it took longer or completed, proceed
  }

  await desktopPage.waitForTimeout(1000);

  const lastMessageText = await desktopPage.locator('aside [role="log"] > div:last-child').innerText();
  console.log(`Desktop: Latest message text: ${lastMessageText.trim().slice(0, 120)}...`);

  // Capture screenshot of conversation in progress / completed
  await desktopPage.screenshot({
    path: join(ARTIFACT_DIR, 'ai-assistant-03-conversation.png'),
    fullPage: false,
  });

  // Test Voice mic button interaction
  const micButton = desktopPage.locator('aside button[aria-label="Start voice input"]');
  const micVisible = await micButton.isVisible();
  console.log(`Desktop: Microphone button visible: ${micVisible}`);

  // Test Escape key closes panel
  await desktopPage.keyboard.press('Escape');
  await desktopPage.waitForTimeout(400);
  const panelClosedAfterEsc = !(await panel.isVisible());
  console.log(`Desktop: Panel closed on Escape: ${panelClosedAfterEsc}`);

  await desktopPage.close();

  // --- 2. Mobile Test (390x844 - iPhone 12/13/14) ---
  console.log('\n--- 2. Mobile Viewport (390x844) ---');
  const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  
  await mobilePage.goto(BASE_URL, { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileTrigger = mobilePage.locator('button[aria-label="Open Spectral AI Concierge"]');
  console.log(`Mobile: Floating button visible: ${await mobileTrigger.isVisible()}`);

  await mobileTrigger.click();
  await mobilePage.waitForTimeout(500);

  const mobilePanel = mobilePage.locator('aside[role="dialog"]');
  console.log(`Mobile: Panel visible: ${await mobilePanel.isVisible()}`);

  // Check no horizontal overflow
  const bodyScrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  const bodyClientWidth = await mobilePage.evaluate(() => document.documentElement.clientWidth);
  console.log(`Mobile: Scroll width: ${bodyScrollWidth}, Client width: ${bodyClientWidth}, overflow: ${bodyScrollWidth > bodyClientWidth}`);

  await mobilePage.screenshot({
    path: join(ARTIFACT_DIR, 'ai-assistant-04-mobile-panel.png'),
    fullPage: false,
  });

  // Test Close button on mobile
  const closeBtn = mobilePage.locator('button[aria-label="Close assistant"]');
  await closeBtn.click();
  await mobilePage.waitForTimeout(400);
  console.log(`Mobile: Panel closed on close button: ${!(await mobilePanel.isVisible())}`);

  await mobilePage.close();
  await browser.close();

  console.log('\n--- Summary ---');
  console.log(`Errors encountered: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach((e) => console.error(e));
  }
  console.log(`Console errors: ${consoleLogs.length}`);
  if (consoleLogs.length > 0) {
    consoleLogs.forEach((l) => console.error(l));
  }
  console.log('Playwright live assistant tests complete!\n');
}

run().catch((err) => {
  console.error('Fatal error in Playwright test:', err);
  process.exit(1);
});
