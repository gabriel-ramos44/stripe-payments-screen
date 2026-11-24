# Stripe payments screen assessment

Local-only Next.js and TypeScript project for the Chargeblast front-end assessment.
Tasks 1–4 are complete: requirements, reference analysis, implementation decisions,
and project setup. The payments UI and functionality are not implemented yet.

## Run locally

Use Node.js 22 or newer (validated with Node.js 24) and npm.

```sh
npm ci
npm run dev
```

Open http://127.0.0.1:3000. The development and production servers bind to loopback.
No environment variables, backend, external fonts, or Stripe account are needed.

## Verify

```sh
npm run lint
npm run typecheck
npm run build
```

`npm run check` runs all three sequentially. For a local production preview, run
`npm run build` followed by `npm start`.

## Planning documents

- [Requirements and acceptance checklist](docs/requirements.md)
- [Screenshot measurements and visual inventory](docs/reference-analysis.md)
- [Implementation decisions and assumptions](docs/implementation-decisions.md)

## Structure

- `src/app/`: App Router entry point, metadata and minimal global styles.
- `docs/`: local assessment planning documents.
- `package-lock.json`: reproducible dependency resolutions; use `npm ci`.

CSS Modules and plain CSS are the planned styling approach. Dashboard design
tokens, table libraries, component primitives and test tools belong to later tasks.

ESLint is pinned to 9.39.5 because the React, import and accessibility plugins in
the current Next.js preset declare compatibility through ESLint 9. npm marks this
major as unsupported upstream; upgrade when the preset's plugin peers support 10.

## Local scope

No remote repository, deployment, ChatGPT Page, analytics, or cloud integration is
configured. No real customer data or payment credentials are used. Git commits use
the user's configured identity without co-author trailers.
