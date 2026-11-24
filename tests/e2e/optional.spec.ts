import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("columns reorder by keyboard and drag, resize and reset accessibly", async ({
  page,
}) => {
  await page.goto("/payments");
  await page.getByRole("button", { name: "Edit columns", exact: true }).click();
  await page
    .getByRole("button", { name: "Move Customer left", exact: true })
    .click();
  await expect(page.locator("th").nth(3)).toContainText("Customer");
  const slider = page.getByRole("slider", { name: /Amount width/ });
  await slider.press("Home");
  await slider.press("ArrowRight");
  await expect(page.locator("th[data-column='amount']")).toHaveCSS(
    "width",
    "120px",
  );
  expect(
    (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze()
    ).violations,
  ).toEqual([]);
  await page.getByRole("button", { name: "Reset columns" }).click();
  await page.keyboard.press("Escape");
  const grip = page.getByRole("button", {
    name: "Reorder Amount column. Use Alt and arrow keys.",
    exact: true,
  });
  await grip.focus();
  await page.keyboard.press("Alt+ArrowRight");
  await expect(page.locator("th").first()).toContainText("Status");
  await page
    .getByRole("button", {
      name: "Reorder Customer column. Use Alt and arrow keys.",
      exact: true,
    })
    .dragTo(page.locator("th").first());
  await expect(page.locator("th").first()).toContainText("Customer");
  const separator = page.getByRole("separator", {
    name: "Resize Amount column",
  });
  await separator.focus();
  await page.keyboard.press("ArrowRight");
  await expect(separator).toHaveAttribute("aria-valuenow", /\d+/);
});

test("shareable filters survive refresh, history and payment detail navigation", async ({
  page,
}) => {
  await page.goto("/payments");
  await page.getByRole("button", { name: "Succeeded", exact: true }).click();
  await expect(page).toHaveURL(/status=succeeded/);
  await page.getByLabel("Rows per page").selectOption("50");
  await page.getByRole("button", { name: "Next", exact: true }).click();
  const view = page.url();
  await page.reload();
  await expect(page.getByLabel("Rows per page")).toHaveValue("50");
  await expect(page.getByText("Page 2 of 6")).toBeVisible();
  await page
    .getByRole("link", { name: /^View payment/ })
    .first()
    .click();
  await page.getByRole("link", { name: "Back to payments" }).click();
  await expect(page).toHaveURL(view);
  await expect(page.getByText("Page 2 of 6")).toBeVisible();
  await page.getByRole("button", { name: "Failed", exact: true }).click();
  await expect(page).toHaveURL(/status=failed/);
  await page.goBack();
  await expect(
    page.getByRole("button", { name: "Succeeded", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goForward();
  await expect(
    page.getByRole("button", { name: "Failed", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.goto(
    "/payments?status=invalid&size=999&page=-3&min=-1&date=custom&from=bad&to=bad",
  );
  await expect(page.locator("tbody tr")).toHaveCount(25);
  await expect(page.getByText("Viewing 1–25 of 500 results")).toBeVisible();
});

test("payment details support direct access, metadata, return navigation and unknown IDs", async ({
  page,
}) => {
  await page.goto("/payments");
  const link = page.getByRole("link", { name: /^View payment/ }).first();
  const href = await link.getAttribute("href");
  await link.click();
  await expect(
    page.getByRole("heading", { name: "Payment details", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Metadata" })).toBeVisible();
  await page.reload();
  await expect(
    page.getByText("Payment created", { exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to payments" }).click();
  await expect(page.locator("tbody tr")).toHaveCount(25);
  await page.goto(href!);
  await expect(page.getByRole("heading", { name: "Timeline" })).toBeVisible();
  await page.goto("/payments/nonexistent");
  await expect(
    page.getByRole("heading", { name: "Payment not found" }),
  ).toBeVisible();
});
