# Stripe payments screen assessment

Local-only Next.js and TypeScript project for the Chargeblast front-end assessment.
Tasks 1–7 are complete: planning, project setup, reusable UI primitives, the responsive
dashboard shell and typed mock payment data. The table and filtering/sorting/
pagination functionality are not implemented yet. Disabled controls mark that scope.

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
npm run build
```

`npm run check` runs all four sequentially. For a local production preview, run
`npm run build` followed by `npm start`.

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
- `src/features/payments/`: discriminated payment types and deterministic mock data.
- `scripts/verify-mock-data.ts`: data integrity and reproducibility checks.
- `docs/`: local assessment planning documents.
- `package-lock.json`: reproducible dependency resolutions; use `npm ci`.

CSS Modules and plain CSS style the dashboard and shared design tokens. Radix
primitives provide focus/keyboard behavior for menus, popovers and tooltips; Lucide
provides icons. A table library can be evaluated in task 8.

## Mock data

`createMockPayments({ anchor: new Date(), count: 500, seed: 20261123 })` creates
realistic synthetic payments. Call it once at the data boundary and pass the same
records to the client; do not generate independently during server/client rendering.
The function never reads the clock itself. Use a fixed anchor in tests.

Records cover USD, GBP, EUR, BRL and JPY; amounts are integer minor units. Customer
emails use reserved `example.com` addresses, and IDs carry a `mock` prefix. Card,
ACH and wallet methods are discriminated types. Dates span 120 days with recent
records; refunded and failed records have matching metadata. No table consumes
the data yet. Future cross-currency comparisons use numeric amounts without FX
normalization, as documented in the implementation decisions.

## Verification performed

Lint, strict typecheck, mock-data verification and production build. Browser smoke
checks at 1440px and 390px covered menus/popovers, Escape dismissal, announcement
dismissal and mobile navigation, with no page errors or mobile horizontal overflow.
Screenshots were visually reviewed. Precise table fidelity awaits task 8.

ESLint is pinned to 9.39.5 because the React, import and accessibility plugins in
the current Next.js preset declare compatibility through ESLint 9. npm marks this
major as unsupported upstream; upgrade when the preset's plugin peers support 10.

## Local scope

No remote repository, deployment, ChatGPT Page, analytics, or cloud integration is
configured. No real customer data or payment credentials are used. Git commits use
the user's configured identity without co-author trailers.
