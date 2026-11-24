import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.beforeEach(async ({ page }) => {
  await page.clock.install({ time: new Date("2026-11-24T15:00:00.000Z") });
  await page.goto("/payments");
});

test("reference views, row selection and row actions are functional", async ({
  page,
}) => {
  await expect(page.getByLabel("Payment views").getByRole("button")).toHaveText(
    ["All", "Succeeded", "Refunded", "Disputed", "Failed", "Uncaptured"],
  );
  await page.getByRole("button", { name: "Disputed", exact: true }).click();
  await expect(page.locator("tbody tr").first()).toBeVisible();
  await expect(page).toHaveURL(/view=disputed/);
  await page.getByRole("button", { name: "Uncaptured", exact: true }).click();
  await expect(
    page.locator("tbody tr").first().locator("[data-payment-status]"),
  ).toHaveText("Pending");
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page
    .getByRole("checkbox", {
      name: "Select all payments on this page",
      exact: true,
    })
    .check();
  await expect(page.getByText("25 selected on this page")).toBeVisible();
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  await expect(
    page.getByRole("checkbox", {
      name: "Select all payments on this page",
      exact: true,
    }),
  ).not.toBeChecked();
  await page
    .getByRole("button", { name: /^Actions for payment/ })
    .first()
    .click();
  await page.getByRole("menuitem", { name: "View payment details" }).click();
  await expect(
    page.getByRole("heading", { name: "Payment details", exact: true }),
  ).toBeVisible();
});

test("direct navigation is stable and does not emit browser errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const firstId = await page
    .getByRole("button", { name: /^Copy payment ID/ })
    .first()
    .getAttribute("aria-label");
  await page.goto("/");
  await expect(page).toHaveURL(/\/payments$/);
  await expect(
    page.getByRole("button", { name: /^Copy payment ID/ }).first(),
  ).toHaveAttribute("aria-label", firstId!);
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(25);
  expect(errors).toEqual([]);
});

test("last page and a filter after paging show correct boundaries", async ({
  page,
}) => {
  await page.getByLabel("Rows per page").selectOption("100");
  for (let i = 0; i < 4; i++)
    await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Viewing 401–500 of 500 results")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Status", exact: true }).click();
  await page.getByRole("checkbox", { name: "Pending", exact: true }).check();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Previous", exact: true }),
  ).toBeDisabled();
  await expect(
    page.locator("tbody tr").first().locator("[data-payment-status]"),
  ).toHaveText("Pending");
  await page
    .getByRole("button", { name: "Sort by status", exact: true })
    .click();
  await page
    .getByRole("menuitem", { name: "Sort by status ascending", exact: true })
    .click();
  await expect(page.locator("th[data-column=amount]")).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await page.getByRole("button", { name: "Sort by created ascending" }).click();
  await expect(page.locator("th[aria-sort='ascending']")).toHaveCount(1);
});

test("custom date validation and dismissed drafts preserve applied filters", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Date and time", exact: true })
    .click();
  await page.getByLabel("Date range", { exact: true }).selectOption("custom");
  await page.getByLabel("Start date").fill("2026-11-25");
  await page.getByLabel("End date").fill("2026-11-24");
  await page.getByRole("button", { name: "Apply dates" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Start date" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Viewing 1–25 of 500 results")).toBeVisible();
  await page
    .getByRole("button", { name: "Date and time", exact: true })
    .click();
  await expect(page.getByLabel("Date range", { exact: true })).toHaveValue(
    "all",
  );
  await page.keyboard.press("Escape");
});

test("relative date tooltip refreshes as time passes and keyboard filters restore focus", async ({
  page,
}) => {
  await page.clock.fastForward("02:00:00");
  await page.locator("time").first().focus();
  await expect(page.getByRole("tooltip")).toContainText("2 hours ago");
  await page.keyboard.press("Escape");
  const status = page.getByRole("button", { name: "Status", exact: true });
  await status.focus();
  await page.keyboard.press("Enter");
  await page.getByRole("checkbox", { name: "Pending", exact: true }).focus();
  await page.keyboard.press("Space");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Status (1)", exact: true }),
  ).toBeFocused();
});

test("search, empty recovery, sorting and pagination work together", async ({
  page,
}) => {
  const rows = page.locator("tbody tr");
  await expect(rows).toHaveCount(25);
  await expect(page.getByText("Viewing 1–25 of 500 results")).toBeVisible();
  await page.getByRole("button", { name: "Next", exact: true }).click();
  await expect(page.getByText("Viewing 26–50 of 500 results")).toBeVisible();
  await page.getByRole("button", { name: "Sort by amount ascending" }).click();
  await expect(page.getByText("Page 1 of 20")).toBeVisible();
  await expect(page.locator("th[data-column=amount]")).toHaveAttribute(
    "aria-sort",
    "ascending",
  );
  await page.getByRole("button", { name: "Sort by amount descending" }).click();
  await expect(page.locator("th[data-column=amount]")).toHaveAttribute(
    "aria-sort",
    "descending",
  );
  await page.getByLabel("Rows per page").selectOption("100");
  await expect(rows).toHaveCount(100);
  await page.getByLabel("Rows per page").selectOption("50");
  await expect(rows).toHaveCount(50);
  const search = page.getByRole("searchbox");
  await search.fill("not-a-real-payment");
  await expect(
    page.getByRole("heading", { name: "No payments found" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Next", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(rows).toHaveCount(50);
  const id = await rows
    .first()
    .locator("button[aria-label^='Copy payment ID']")
    .getAttribute("aria-label");
  await search.fill(id!.replace("Copy payment ID ", ""));
  await expect(rows).toHaveCount(1);
  await expect(page.getByText("Viewing 1–1 of 1 results")).toBeVisible();
});

test("multi-select filters combine and invalid ranges do not apply", async ({
  page,
}) => {
  await page.getByRole("button", { name: "Status", exact: true }).click();
  await page.getByRole("checkbox", { name: "Succeeded", exact: true }).check();
  await page.getByRole("checkbox", { name: "Failed", exact: true }).check();
  await page.keyboard.press("Escape");
  await page
    .getByRole("button", { name: "Payment method", exact: true })
    .click();
  await page.getByRole("checkbox", { name: "Card", exact: true }).check();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Currency", exact: true }).click();
  await page.getByRole("checkbox", { name: "USD", exact: true }).check();
  await page.keyboard.press("Escape");
  for (const row of await page.locator("tbody tr").all()) {
    await expect(row.locator("[data-payment-status]")).toHaveText(
      /Succeeded|Failed/,
    );
    await expect(row.locator("td[data-column=amount]")).toContainText("USD");
    await expect(row.locator("td[data-column=method]")).not.toContainText(
      /ACH|Apple Pay|Google Pay/,
    );
  }
  const before = await page
    .locator("nav[aria-label='Payments pagination']")
    .textContent();
  await page.getByRole("button", { name: "Amount", exact: true }).click();
  await page.getByLabel("Minimum amount").fill("100");
  await page.getByLabel("Maximum amount").fill("10");
  await page.getByRole("button", { name: "Apply amount" }).click();
  await expect(
    page.getByRole("alert").filter({ hasText: "Minimum amount" }),
  ).toHaveText("Minimum amount must not exceed maximum amount.");
  await expect(
    page.locator("nav[aria-label='Payments pagination']"),
  ).toHaveText(before!);
  await page.getByLabel("Minimum amount").fill("0");
  await page.getByLabel("Maximum amount").fill("50");
  await page.getByRole("button", { name: "Apply amount" }).click();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "More filters", exact: true }).click();
  await page.getByRole("button", { name: "Reset", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(page.getByText("Viewing 1–25 of 500 results")).toBeVisible();
});

test("date presets, custom dates, tooltip and clipboard feedback", async ({
  page,
}) => {
  await page
    .getByRole("button", { name: "Date and time", exact: true })
    .click();
  await page.getByLabel("Date range", { exact: true }).selectOption("today");
  await page.getByRole("button", { name: "Apply dates" }).click();
  await page.keyboard.press("Escape");
  await expect(page.locator("tbody tr").first()).toBeVisible();
  for (const preset of ["7days", "30days"]) {
    await page.getByRole("button", { name: /Date and time/ }).click();
    await page.getByLabel("Date range", { exact: true }).selectOption(preset);
    await page.getByRole("button", { name: "Apply dates" }).click();
    await page.keyboard.press("Escape");
    await expect(page.locator("tbody tr")).toHaveCount(25);
  }
  await page.getByRole("button", { name: /Date and time/ }).click();
  await page.getByLabel("Date range", { exact: true }).selectOption("custom");
  await page.getByLabel("Start date").fill("2020-01-01");
  await page.getByLabel("End date").fill("2020-01-02");
  await page.getByRole("button", { name: "Apply dates" }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("heading", { name: "No payments found" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await page.locator("time").first().focus();
  await expect(page.getByRole("tooltip")).toContainText("Brasília time");
  await page.keyboard.press("Escape");
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (id: string) => {
          (window as Window & { copiedPayment?: string }).copiedPayment = id;
        },
      },
    });
  });
  const copy = page.getByRole("button", { name: /^Copy payment ID/ }).first();
  const id = (await copy.getAttribute("aria-label"))!.replace(
    "Copy payment ID ",
    "",
  );
  await copy.click();
  await expect(
    page.getByRole("status").filter({ hasText: "Copied payment ID" }),
  ).toContainText(id);
  expect(
    await page.evaluate(
      () => (window as Window & { copiedPayment?: string }).copiedPayment,
    ),
  ).toBe(id);
  await page.evaluate(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          throw new Error("denied");
        },
      },
    });
  });
  await copy.click();
  await expect(
    page.getByRole("status").filter({ hasText: "Could not copy" }),
  ).toContainText(id);
  await page.clock.fastForward(10_000);
  await expect(
    page.getByRole("status").filter({ hasText: "Could not copy" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Dismiss copy error" }).click();
  await expect(
    page.getByRole("status").filter({ hasText: "Could not copy" }),
  ).toHaveCount(0);
});

test("mobile navigation traps focus, restores focus and keeps table overflow contained", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const trigger = page.getByRole("button", { name: "Open navigation" });
  await trigger.click();
  const drawer = page.getByRole("dialog", { name: "Dashboard navigation" });
  await expect(drawer).toBeVisible();
  for (let i = 0; i < 8; i++) {
    await page.keyboard.press("Tab");
    expect(
      await drawer.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator("[aria-label^='Payments table,']")
      .evaluate((element) => element.scrollWidth > element.clientWidth),
  ).toBe(true);
});

test("default screen and open filters pass automated accessibility checks", async ({
  page,
}) => {
  const scan = () =>
    new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
  expect((await scan()).violations).toEqual([]);
  await page.getByRole("button", { name: "Status", exact: true }).click();
  expect((await scan()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 390, height: 844 });
  expect((await scan()).violations).toEqual([]);
  await page.getByRole("button", { name: "Open navigation" }).click();
  expect((await scan()).violations).toEqual([]);
});
