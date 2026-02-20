import { test, expect } from "@playwright/test";

test.describe("Authentication", () => {
  test("should navigate to login page", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h3")).toContainText("ยินดีต้อนรับกลับ");
  });

  test("should show customer/employee toggle", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByText("ลูกค้า")).toBeVisible();
    await expect(page.getByText("พนักงาน")).toBeVisible();
  });

  test("should login as admin and redirect to dashboard", async ({ page }) => {
    await page.goto("/login");

    // Switch to employee tab
    await page.getByText("พนักงาน").click();

    // Fill credentials
    await page.locator('input[type="email"]').fill("admin@carrental.com");
    await page.locator('input[type="password"]').fill("admin123");

    // Submit
    await page.locator('button[type="submit"]').click();

    // Should redirect to /admin
    await page.waitForURL("**/admin", { timeout: 5000 });
    await expect(page.locator("h1")).toContainText("แดชบอร์ด");
  });

  test("should login as customer and redirect to home", async ({ page }) => {
    await page.goto("/login");

    // Fill credentials
    await page.locator('input[type="email"]').fill("wichai@email.com");
    await page.locator('input[type="password"]').fill("customer123");

    // Submit
    await page.locator('button[type="submit"]').click();

    // Should redirect to /
    await page.waitForURL("**/", { timeout: 5000 });
    // Should show user name in navbar
    await expect(page.getByText("Wichai Thongkham")).toBeVisible();
  });

  test("should show error on invalid credentials", async ({ page }) => {
    await page.goto("/login");

    await page.locator('input[type="email"]').fill("wrong@email.com");
    await page.locator('input[type="password"]').fill("wrongpass");
    await page.locator('button[type="submit"]').click();

    // Should show error message
    await expect(page.getByText("อีเมลหรือรหัสผ่านไม่ถูกต้อง")).toBeVisible({
      timeout: 5000,
    });
  });

  test("should fill demo credentials when clicking demo button", async ({
    page,
  }) => {
    await page.goto("/login");

    // Click admin demo button
    await page.locator("button").filter({ hasText: "Admin" }).click();

    // Email should be filled
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toHaveValue("admin@carrental.com");
  });

  test("should navigate to register page", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("สมัครสมาชิก").click();
    await page.waitForURL("**/register");
    await expect(page.locator("h3")).toContainText("สร้างบัญชี");
  });

  test("should logout after login", async ({ page }) => {
    await page.goto("/login");
    await page.getByText("พนักงาน").click();
    await page.locator('input[type="email"]').fill("admin@carrental.com");
    await page.locator('input[type="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/admin", { timeout: 5000 });

    // Click logout
    await page.getByRole("button", { name: "ออกจากระบบ" }).click();

    // Should show login button again (use role to avoid strict mode with mobile nav)
    await expect(
      page.getByRole("button", { name: "เข้าสู่ระบบ" }),
    ).toBeVisible();
  });
});
