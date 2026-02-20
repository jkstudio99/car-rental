import { test, expect } from "@playwright/test";

test.describe("Dark / Light Mode", () => {
  test("should toggle dark mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Click theme toggle (moon icon button)
    const themeBtn = page.locator('button[title="Dark mode"], button[title="Light mode"]');
    await themeBtn.click();

    // HTML element should have 'dark' class
    const htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");
  });

  test("should toggle back to light mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    const themeBtn = page.locator('button[title="Dark mode"], button[title="Light mode"]');

    // Toggle to dark
    await themeBtn.click();
    let htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("dark");

    // Toggle back to light
    await themeBtn.click();
    htmlClass = await page.locator("html").getAttribute("class");
    expect(htmlClass).toContain("light");
  });

  test("should change background color in dark mode", async ({ page }) => {
    await page.goto("/");
    await page.waitForSelector("h1");

    // Get initial bg color
    const lightBg = await page.locator("body").evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Toggle to dark
    const themeBtn = page.locator('button[title="Dark mode"], button[title="Light mode"]');
    await themeBtn.click();
    await page.waitForTimeout(300);

    // Get dark bg color
    const darkBg = await page.locator("body").evaluate(
      (el) => getComputedStyle(el).backgroundColor
    );

    // Colors should be different
    expect(lightBg).not.toEqual(darkBg);
  });
});
