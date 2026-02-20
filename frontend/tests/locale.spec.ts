import { test, expect } from "@playwright/test";

test.describe("Locale Switching", () => {
  test("should default to Thai locale", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("แคตตาล็อกรถยนต์");
  });

  test("should switch to English via dropdown", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Open locale dropdown
    await page.locator("button").filter({ hasText: /^TH$/i }).click();

    // Click English option
    await page.getByText("English").click();

    // Title should now be in English
    await expect(page.locator("h1")).toContainText("Vehicle Catalog");
  });

  test("should switch to Japanese via dropdown", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Open locale dropdown
    await page.locator("button").filter({ hasText: /^TH$/i }).click();

    // Click Japanese option
    await page.getByText("日本語").click();

    // Title should now be in Japanese
    await expect(page.locator("h1")).toContainText("車両カタログ");
  });

  test("should persist locale after navigation", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Switch to English
    await page.locator("button").filter({ hasText: /^TH$/i }).click();
    await page.getByText("English").click();
    await expect(page.locator("h1")).toContainText("Vehicle Catalog");

    // Navigate to login
    await page.goto("/login");
    await expect(page.locator("h3")).toContainText("Welcome Back");
  });

  test("should show locale label in navbar button", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Should show TH label
    await expect(
      page.locator("button").filter({ hasText: /^TH$/i }),
    ).toBeVisible();

    // Switch to EN
    await page.locator("button").filter({ hasText: /^TH$/i }).click();
    await page.getByText("English").click();

    // Should now show EN label
    await expect(
      page.locator("button").filter({ hasText: /^EN$/i }),
    ).toBeVisible();
  });
});
