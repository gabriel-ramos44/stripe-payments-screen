import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 1365, height: 1045 } });
test("column settings and payment details", async ({ page }) => {
  await page.getByRole("button", { name: "Edit columns", exact: true }).click();
  await expect(page).toHaveScreenshot("column-settings.png", {
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page
    .getByRole("link", { name: /^View payment/ })
    .first()
    .click();
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await expect(page).toHaveScreenshot("payment-details.png", {
    animations: "disabled",
  });
});
test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(new Date("2026-11-24T15:00:00.000Z"));
  await page.goto("/payments");
  await expect(page.locator("tbody tr")).toHaveCount(25);
});

test("desktop reference geometry and interaction states", async ({ page }) => {
  const geometry = await page.evaluate(() => {
    const rect = (selector: string) => {
      const r = document.querySelector(selector)!.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    };
    return {
      viewport: { width: innerWidth, height: innerHeight },
      heading: rect("h1"),
      table: rect("table"),
      firstRow: rect("tbody tr"),
      pagination: rect("nav[aria-label='Payments pagination']"),
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  await test.info().attach("layout-geometry", {
    body: JSON.stringify(geometry, null, 2),
    contentType: "application/json",
  });
  expect(geometry.pageOverflow).toBe(false);
  expect(
    geometry.pagination.y + geometry.pagination.height,
  ).toBeLessThanOrEqual(1045);
  await expect(page).toHaveScreenshot("desktop.png", {
    animations: "disabled",
  });
  await page.locator("tbody tr").first().hover();
  await expect(page).toHaveScreenshot("row-hover.png", {
    animations: "disabled",
  });
  await page
    .getByRole("checkbox", { name: /^Select payment / })
    .first()
    .check();
  await expect(page).toHaveScreenshot("row-selection.png", {
    animations: "disabled",
  });
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await page
    .getByRole("button", { name: /^Actions for payment/ })
    .first()
    .click();
  await expect(page).toHaveScreenshot("row-menu.png", {
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Succeeded", exact: true }).click();
  await expect(page).toHaveScreenshot("filtered.png", {
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Status (1)", exact: true }).click();
  await expect(page).toHaveScreenshot("status-popover.png", {
    animations: "disabled",
  });
  await page.keyboard.press("Escape");
  await page.getByRole("searchbox").fill("no-payment-matches");
  await expect(
    page.getByRole("heading", { name: "No payments found" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("empty.png", { animations: "disabled" });
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await page.locator("time").first().focus();
  await expect(page.getByRole("tooltip")).toBeVisible();
  await expect(page).toHaveScreenshot("date-focus.png", {
    animations: "disabled",
  });
});

test("mobile layout and accessible navigation", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page).toHaveScreenshot("mobile.png", {
    animations: "disabled",
  });
  await page
    .getByRole("navigation", { name: "Payments pagination" })
    .scrollIntoViewIfNeeded();
  await expect(page).toHaveScreenshot("mobile-pagination.png", {
    animations: "disabled",
  });
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("dialog", { name: "Dashboard navigation" }),
  ).toBeVisible();
  await expect(page).toHaveScreenshot("mobile-navigation.png", {
    animations: "disabled",
  });
});

test("tablet and narrow screens contain table overflow", async ({ page }) => {
  for (const width of [768, 320]) {
    await page.setViewportSize({ width, height: 900 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await expect(page).toHaveScreenshot(`width-${width}.png`, {
      animations: "disabled",
    });
  }
});
