import { test, expect } from "@playwright/test";

test("payment details support direct access, metadata, return navigation and unknown IDs", async ({ page }) => {
  await page.goto("/payments");
  const link = page.getByRole("link", { name: /^View payment/ }).first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(page.getByRole("heading", { name: "Payment details", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Metadata" })).toBeVisible();
  await page.reload();
  await expect(page.getByText("Payment created", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Back to payments" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(25);
  await page.goto(href!);
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await page.goto("/payments/nonexistent");
  await expect(page.getByRole("heading", { name: "Payment not found" })).toBeVisible();
});
