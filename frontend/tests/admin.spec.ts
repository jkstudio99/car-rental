import { test, expect } from "@playwright/test";

async function loginAsAdmin(page: import("@playwright/test").Page) {
  await page.goto("/login");
  await page.getByText("พนักงาน").click();
  await page.locator('input[type="email"]').fill("admin@carrental.com");
  await page.locator('input[type="password"]').fill("admin123");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/admin", { timeout: 5000 });
}

test.describe("Admin Dashboard", () => {
  test("should display KPI cards after login", async ({ page }) => {
    await loginAsAdmin(page);

    // Should show dashboard title
    await expect(page.locator("h1")).toContainText("แดชบอร์ด");

    // Should show KPI cards (Total Fleet, Revenue, Pending, Total Bookings)
    await expect(page.getByText("รถทั้งหมด")).toBeVisible();
    await expect(page.getByText("รายได้วันนี้")).toBeVisible();
    await expect(page.getByText("รอดำเนินการ")).toBeVisible();
    await expect(page.getByText("การจองทั้งหมด")).toBeVisible();
  });

  test("should display charts", async ({ page }) => {
    await loginAsAdmin(page);

    // Should show chart titles
    await expect(page.getByText("การใช้งานรถ")).toBeVisible();
    await expect(page.getByText("แนวโน้มรายได้")).toBeVisible();
  });

  test("should navigate to manage vehicles", async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByText("จัดการรถยนต์").click();
    await page.waitForURL("**/admin/vehicles");
    await expect(page.locator("h1")).toContainText("จัดการรถยนต์");
  });

  test("should navigate to manage reservations", async ({ page }) => {
    await loginAsAdmin(page);

    await page.getByText("การจอง").first().click();
    await page.waitForURL("**/admin/reservations");
    await expect(page.locator("h1")).toContainText("จัดการการจอง");
  });
});

test.describe("Admin Vehicles", () => {
  test("should show vehicle list", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/vehicles");

    // Should show title
    await expect(page.locator("h1")).toContainText("จัดการรถยนต์");

    // Should show vehicle cards
    await page.waitForSelector('[class*="overflow-hidden"]', { timeout: 10000 });
    const cards = page.locator('[class*="overflow-hidden"]');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("should open add vehicle form", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/vehicles");

    await page.getByText("เพิ่มรถ").click();

    // Form should be visible
    await expect(page.getByText("เพิ่มรถใหม่")).toBeVisible();
  });
});

test.describe("Admin Reservations", () => {
  test("should show reservation list", async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto("/admin/reservations");

    await expect(page.locator("h1")).toContainText("จัดการการจอง");

    // Should show reservation cards
    await page.waitForSelector('[class*="CardContent"], [class*="p-4"]', { timeout: 10000 });
  });
});
