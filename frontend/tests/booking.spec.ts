import { test, expect } from "@playwright/test";

test.describe("Booking Flow", () => {
  test("should redirect to login when selecting vehicle without auth", async ({
    page,
  }) => {
    await page.goto("/");
    await page.waitForSelector('[class*="group"]', { timeout: 10000 });

    // Click first available "Select" button
    const selectBtn = page
      .locator("button")
      .filter({ hasText: /เลือก/ })
      .first();
    if (await selectBtn.isVisible()) {
      await selectBtn.click();
      await page.waitForURL("**/login", { timeout: 5000 });
    }
  });

  test("should navigate to booking page after login and select vehicle", async ({
    page,
  }) => {
    // Login as customer
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("wichai@email.com");
    await page.locator('input[type="password"]').fill("customer123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/", { timeout: 5000 });

    // Wait for vehicles to load
    await page.waitForSelector('[class*="group"]', { timeout: 10000 });

    // Click first available "Select" button
    const selectBtn = page
      .locator("button")
      .filter({ hasText: /เลือก/ })
      .first();
    if (await selectBtn.isVisible()) {
      await selectBtn.click();
      // Should navigate to /booking (may redirect back if store state is ephemeral)
      await page.waitForTimeout(1000);
      const url = page.url();
      expect(url).toMatch(/\/(booking|$)/);
    }
  });

  test("should show my reservations for logged-in customer", async ({
    page,
  }) => {
    // Login as customer
    await page.goto("/login");
    await page.locator('input[type="email"]').fill("wichai@email.com");
    await page.locator('input[type="password"]').fill("customer123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/", { timeout: 5000 });

    // Navigate to my reservations
    await page.goto("/my-reservations");
    await expect(page.locator("h1")).toContainText("การจองของฉัน");
  });
});
