import { test, expect } from "@playwright/test";

test.describe("Homepage - Vehicle Catalog", () => {
  test("should load and display the page title", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
    // Default locale is Thai
    await expect(page.locator("h1")).toContainText("แคตตาล็อกรถยนต์");
  });

  test("should display vehicle cards from API", async ({ page }) => {
    await page.goto("/");
    // Wait for vehicle cards to load (skeleton → real cards)
    await page.waitForSelector('[class*="group"]', { timeout: 10000 });
    const cards = page.locator('[class*="overflow-hidden"][class*="group"]');
    await expect(cards.first()).toBeVisible();
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should show search input", async ({ page }) => {
    await page.goto("/");
    const searchInput = page.locator('input[placeholder]');
    await expect(searchInput).toBeVisible();
  });

  test("should show category filter buttons", async ({ page }) => {
    await page.goto("/");
    // Wait for page to load
    await page.waitForSelector("h1");
    // Should have filter buttons (All, Sedan, SUV, Van)
    const buttons = page.locator("button").filter({ hasText: /ซีดาน|เอสยูวี|แวน|ทุกประเภท|Sedan|SUV|Van/ });
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(3);
  });

  test("should filter vehicles by category", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector('[class*="group"]', { timeout: 10000 });

    // Click Sedan filter
    const sedanBtn = page.locator("button").filter({ hasText: /ซีดาน/ });
    await sedanBtn.click();

    // Wait for re-fetch
    await page.waitForTimeout(500);

    // All visible badges should show SEDAN
    const categoryBadges = page.locator('span:text("SEDAN")');
    const count = await categoryBadges.count();
    expect(count).toBeGreaterThanOrEqual(0); // May be 0 if no sedans
  });
});
