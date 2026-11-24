# Stripe payments screen

A Stripe-inspired payments dashboard built for the Chargeblast front-end assessment
with Next.js, strict TypeScript, React, CSS Modules and Radix primitives.
It uses 500 seeded synthetic payments; no Stripe account or backend is required.

**[Live demo on Vercel](https://stripe-payments-screen.vercel.app/payments)**

![Payments dashboard](tests/visual/payments.spec.ts-snapshots/desktop-win32.png)

## Run locally

Use Node.js 22.18 or newer and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000/payments](http://localhost:3000/payments).
For a production preview, run `npm run build` followed by `npm start`.
No environment variables are required.

## Features

- Search by payment ID, email or last four digits, with combined date, amount,
  currency, status and payment-method filters.
- Six summary views, inline status badges, refund/decline details, row selection
  and payment-action menus.
- Date, amount and status sorting; 25/50/100-row pagination and empty states.
- Payment details with timeline, metadata, full-ID copy and relative-time tooltips.
- Shareable filter, sort and pagination state with browser history support.
- Resizable and reorderable columns with keyboard alternatives.
- CSV export of all filtered and sorted payments across pages.
- Responsive layout, expandable More navigation and a mobile drawer with focus management.

## Verify

```sh
npm run check
npm run test:e2e
```

`check` runs lint, TypeScript, data/query checks and a production build.
Playwright covers functional journeys, automated accessibility checks and visual
regressions. It requires installed Google Chrome and port 3200 to be available.
Open the local report with `npx playwright show-report`.

Visual baselines use Windows/Chrome, fixed viewports and a fixed clock. To update
them after an intentional visual change:

```sh
npm run test:e2e -- --update-snapshots
```

Review changed screenshots before accepting them. Other browser or operating-system
versions may render fonts differently.

## Architecture

- `src/app/payments/`: server-rendered list and payment-detail routes.
- `src/features/payments/`: typed mock data, filtering, sorting, URL state, CSV export
  and table components.
- `src/components/`: dashboard shell, shared Radix controls and extracted Stripe icons.
- `scripts/` and `tests/`: data/query checks, browser tests and visual baselines.

The table uses semantic HTML and a typed reducer. Radix handles layered controls;
extracted Stripe SVGs and Lucide supply the icons.

## Decisions and limits

Some icons are approximations rather than pixel-perfect matches: no Figma or original
design assets were provided, and our accessible Stripe panel does not show every icon
in the reference. Extracted SVGs are used wherever a matching source is available.

- The PDF guides the layout; written requirements determine the four payment statuses
  and 25/50/100 page sizes. The creation timestamp is labeled Date in the table.
- Desktop table scrolling stays within the available viewport; mobile retains natural
  page scrolling. Column layouts reset on reload.
- Cross-currency sorting and amount filters compare numeric amounts without FX conversion.
- Calendar filters and displayed dates use America/Sao_Paulo. CSV timestamps use UTC.
  Shareable URLs preserve the dataset timestamp; `PAYMENTS_MOCK_ANCHOR` can fix it for QA.
- CSV values are escaped and formula-like text is neutralized.
- Unrelated product destinations, payment creation and analytics are outside this demo.
- Automated accessibility checks run in Chrome; a manual screen-reader audit and
  Firefox/Safari testing have not been completed.

## Further documentation

- [Requirements checklist](docs/requirements.md)
- [Reference analysis](docs/reference-analysis.md)
- [Implementation decisions](docs/implementation-decisions.md)
- [Functional and visual QA](docs/qa-report.md)
