# Assessment QA report

Review date: November 24, 2026 (America/Sao_Paulo).

## Task 12: functional verification

The browser suite runs against a production build on loopback port 3200. It owns
that server instead of reusing an unknown development process. A server-only
`PAYMENTS_MOCK_ANCHOR=2026-11-24T15:00:00.000Z` and matching browser clock keep
payment dates, IDs and calendar expectations reproducible. Normal local use still
captures the current time; no public query parameter enables test behavior.

Coverage includes:

- Direct root redirect, direct payments navigation and reload with stable fixtures.
- Full-ID search, combined multi-select status/method/currency filters, empty/reset.
- Today/7-day/30-day/custom date ranges; invalid/reversed dates and dismissed drafts.
- Inclusive amount ranges, invalid bounds and decimal input such as `.50` and `1.`.
- Both sorting directions; numeric currencies, status ordering and stable ties.
- 25/50/100 page sizes, last page, disabled navigation and filtering after paging.
- Full-ID clipboard success/failure, persistent dismissible error recovery.
- Focusable date tooltips; relative time refresh after two hours without reload.
- Keyboard filter selection and focus restoration, mobile focus trapping/Escape.
- Axe WCAG A/AA scans of default, filter, mobile and drawer states.

Fixes found during review:

1. Relative tooltips previously stayed anchored to page load. They now capture the
   current browser time when opened while preserving stable initial rendering.
2. Ordinary decimal inputs with omitted leading/trailing digits are now accepted;
   negative numbers, exponent notation, non-finite and reversed bounds remain invalid.
3. Clipboard failures now remain visible until dismissed, giving users enough time
   to manually select the full ID. Success feedback still expires automatically.

Verification commands: `npm run check` and `npm run test:e2e`.
Tests use installed Google Chrome. Firefox, Safari and live Stripe behavior have
not been verified. Automated accessibility scans supplement keyboard checks; they
do not certify screen-reader compatibility or full WCAG compliance.

## Task 13: visual comparison

The supplied PDF contains a 2048 × 1568 dashboard image. Reference comparison uses
a 2/3 normalization to approximately 1365 × 1045 browser pixels. This is a stated
comparison convention, not a claim about the original browser's zoom or viewport.
The original screenshot remains outside Git; it contains customer-like content.
Only the app's synthetic fixtures are eligible for committed screenshot baselines.

Visual refinements, reproducible captures and regression results are recorded below
after the comparison pass.
