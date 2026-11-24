# Stripe payments screen assessment

Local-only Next.js and TypeScript project for the Chargeblast front-end assessment.
Tasks 1–11 are complete: planning, project setup, reusable UI primitives, responsive
dashboard shell, typed data, payments table, search/filters, sorting/pagination and
accessibility refinements. Optional export, column customization, payment details
and unrelated dashboard destinations remain outside this implementation.

## Run locally

Use Node.js 22.18 or newer (validated with Node.js 24) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000 (redirects to `/payments`). The development and production servers bind to loopback.
No environment variables, backend, external fonts, or Stripe account are needed.

## Verify

```sh
npm run lint
npm run typecheck
npm run verify:data
npm run verify:query
npm run build
```

`npm run check` runs all five sequentially. Browser checks use installed Google Chrome:

```sh
npm run test:e2e
```

Playwright starts a local development server on port 3100 and uses one worker.
Axe checks the default screen, open status filter, mobile screen and mobile drawer.
Failure traces and reports are ignored by Git. This is targeted verification;
automated accessibility checks do not replace manual keyboard/screen-reader review.

For a local production preview, run `npm run build` followed by `npm start`.

## Planning documents

- [Requirements and acceptance checklist](docs/requirements.md)
- [Screenshot measurements and visual inventory](docs/reference-analysis.md)
- [Implementation decisions and assumptions](docs/implementation-decisions.md)

## Structure

- `src/app/`: App Router entry point, metadata and minimal global styles.
- `src/components/ui/`: styled Radix menus, popovers and tooltips; buttons, inputs
  and status badges; Lucide icons.
- `src/components/dashboard/`: responsive sidebar, account menu, top bar and
  Payments screen shell. The announcement can be dismissed; utility popovers work.
- `src/features/payments/`: domain types, seeded data, formatters, pure query functions,
  reducer, filters, table and pagination components.
- `scripts/`: data integrity, query boundary and state-transition verification.
- `tests/e2e/`: reproducible browser journeys and automated accessibility checks.
- `docs/`: local assessment planning documents.
- `package-lock.json`: reproducible dependency resolutions; use `npm ci`.

CSS Modules and plain CSS style the dashboard and shared design tokens. Radix
primitives provide focus/keyboard behavior for menus, popovers and tooltips; Lucide
provides icons. Native table semantics and a small typed reducer cover the current
requirements without another table/state dependency. Filtering, sorting and pagination
are pure functions tested separately from the UI.

## Mock data

`createMockPayments({ anchor: new Date(), count: 500, seed: 20261123 })` creates
realistic synthetic payments. Call it once at the data boundary and pass the same
records to the client; do not generate independently during server/client rendering.
The function never reads the clock itself. Use a fixed anchor in tests.

Records cover USD, GBP, EUR, BRL and JPY; amounts are integer minor units. Customer
emails use reserved `example.com` addresses, and IDs carry a `mock` prefix. Card,
ACH and wallet methods are discriminated types. Dates span 120 days with recent
records; refunded and failed records have matching metadata. The dynamic server
page captures one anchor and serializes one dataset to the client. Data remains
stable while searching, sorting and paging; refreshing generates dates relative
to the new anchor.

## Behavior and deliberate reference differences

- Search full payment IDs, customer emails or last four digits, case-insensitively.
- Combine categories with AND; multiple selections within a category use OR.
- Date presets include today and use Bras�lia calendar boundaries; custom dates
  include both endpoints. Invalid ranges do not replace applied filters.
- Amount bounds are inclusive numeric major units without FX normalization. Use
  the Currency filter to compare one currency; JPY has no fractional minor units.
- Date, amount and status sorting support both directions. Status order is
  Succeeded, Pending, Failed, Refunded; ID breaks ties consistently.
- Page sizes 25/50/100; filter, sort and size changes reset to page one. Empty and
  last-page states show correct counts and disabled navigation.
- Full-ID copy has visible and screen-reader feedback, including clipboard errors.
  Created dates have keyboard-accessible relative-time tooltips in Bras�lia time.
- Required Payment ID/Created columns and the four required statuses take priority
  over conflicting screenshot content. The default page size is 25, not 20.
- Table overflow stays inside a keyboard-focusable region. Mobile navigation uses
  a Radix dialog with focus trapping, Escape dismissal and focus restoration.
- Filters/sort/page state are in memory; shareable URLs are a future optional task.

## Verification performed

Lint, strict typecheck, deterministic-data verification, query/state boundary checks
and production build. Playwright covers search/empty reset, combined multi-select
filters, invalid ranges, date presets/custom dates, sorting, all page sizes,
clipboard success/failure, focusable tooltips and mobile navigation. Screenshots
at 1440, 768, 390 and 320px were checked for contained overflow and page errors.
Final side-by-side visual polishing remains a separate review stage.

ESLint is pinned to 9.39.5 because the React, import and accessibility plugins in
the current Next.js preset declare compatibility through ESLint 9. npm marks this
major as unsupported upstream; upgrade when the preset's plugin peers support 10.

## Local scope

No deployment, ChatGPT Page, analytics or cloud integration is configured. This
implementation work creates local commits only and does not push to GitHub. No real customer data or payment credentials are used. Git commits use
the user's configured identity without co-author trailers.
