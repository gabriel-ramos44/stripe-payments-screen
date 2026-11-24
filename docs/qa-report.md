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

Completed refinements:

- Aligned the main content inset and reduced excess space above the heading.
- Adjusted sidebar group spacing, table/header typography and financial amount weight.
- Matched compact badge height and dashed filter controls more closely.
- Replaced generic card icons with compact Visa/Mastercard/Amex marks, retaining
  accessible brand/method names and ACH/wallet distinctions.
- Kept the table within available desktop height with sticky headers and internal
  scrolling. At 1365 × 1045, the pagination footer is asserted to remain in view.
- Fixed a masking-glyph encoding artifact found during screenshot inspection.
- Darkened the Amex background after the new mark failed contrast checks.

Committed synthetic-data baselines cover desktop default, row hover, filtered,
status popover, empty results, date tooltip/focus, mobile, mobile pagination, mobile
navigation, tablet (768px) and narrow mobile (320px). The primary desktop capture
is 1365 × 1045; mobile uses 390 × 844. All were inspected for clipping, overflow,
alignment, focus and readable states. Screenshots are Windows/Chrome baselines;
different operating systems or browser/font versions may require reviewed baselines.

The screenshot tests compare subsequent runs to these manually reviewed app
baselines. They are regression tests, not an automatic pixel-perfect match score
against the PDF. A clean non-update run is required after generating baselines.

Deliberate remaining differences: required statuses/columns and 25/50/100 page
sizes take precedence over screenshot conflicts; counts and customer content are
synthetic. Unrelated product shortcuts use representative icons. The original font,
hover/menu behavior and exact original viewport remain unverified without live
Stripe access. No claim of exact pixel equality or guaranteed assessment approval
is made.

## Task 13 verification result

- `npm run check`: lint, strict types, data/query verification and production build passed.
- Production browser suite: 12 tests passed (9 functional/accessibility, 3 visual).
- All 11 screenshots passed comparison against unchanged baselines in the final run;
  no screenshot tolerance was loosened to obtain a pass.
- Final visual clock uses `setFixedTime`, leaving timers operational while keeping
  relative tooltip wording deterministic. Time-advancement behavior is independently
  exercised by the functional suite.
- Local preview refreshed on port 3001. No deployment, upload or Git push performed.

## Task 14 optional features and local delivery preparation

Implemented and reviewed locally:

- A separate details route with customer/method information, timeline, metadata,
  unknown-ID handling and the original dataset timestamp carried through navigation.
- Validated URL state for filters, sorting and pagination. Browser back/forward,
  refresh and return from details preserve the view. Search updates replace the
  current history entry; discrete filter/sort/page actions create history entries.
- Native column drag handles, pointer resizing and keyboard alternatives. Widths
  are constrained, layouts reset explicitly and required columns cannot be hidden.
  The settings popover scrolls within short/mobile viewports.
- CSV export of the full filtered/sorted set across pages, in the selected column
  order, with full IDs, labeled UTC timestamps, quoted fields, escaped quotes and
  formula-prefix neutralization. The browser test inspects an actual downloaded file.
- Reviewer README, delivery checklist and email draft prepared without publication.

The extended suite contains 17 tests: 13 functional/accessibility journeys and four
visual tests with 13 screenshot baselines. New coverage includes actual drag and
pointer resize, keyboard/range resizing, history/reload, malformed URLs, details
accessibility/mobile overflow and CSV row count/order. New screenshots cover details
and the column settings popover. All synthetic baselines were visually reviewed.

Column layouts intentionally reset on refresh and are not part of shareable URLs.
Real Stripe interactions, non-Chrome browsers, hosting and remote repository access
remain unverified. The delivery checklist records the remaining external steps.

Final task-14 verification: `npm run check` passed, followed by all 17 production
tests against unchanged screenshot baselines (13 functional/accessibility tests,
four visual tests, 13 reviewed images). Pointer resizing and short-screen column
panel scrolling passed as well. The refreshed port-3001 preview returned HTTP 200.
All changes remain local; no push, deployment, collaborator change or email send occurred.
