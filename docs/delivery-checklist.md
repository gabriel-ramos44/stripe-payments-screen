# Delivery checklist

The application and review materials are prepared locally. Publishing, pushing,
adding collaborators and sending the submission email require a later instruction.

## Included

- Required payments table and all specified interactions, 500 synthetic records.
- Responsive dashboard shell, account menu and keyboard navigation.
- Payment details route with timeline, metadata and unknown-ID handling.
- Validated shareable filters, sorting and pagination; refresh/back/forward support.
- Column resizing and drag-to-reorder with keyboard alternatives and reset.
- CSV export of all filtered/sorted results across pages in the selected column order.
- Setup instructions, architecture/assumptions, verification commands and local QA report.
- Synthetic screenshot baselines; original assessment/reference content is not republished.

## Local reviewer walkthrough

1. Run `npm ci`, `npm run check`, then `npm run test:e2e` (installed Chrome required).
2. Run `npm start` and open `http://localhost:3000/payments`.
3. Search by email/ID/last-four; combine status/method/date/currency/amount filters.
4. Sort and paginate; reload the resulting URL or navigate browser back/forward.
5. Open a payment ID; inspect details/timeline/metadata and return to the same view.
6. Open Edit columns; move/resize/reset. Header grips and separators also work.
7. Export a filtered view; verify the file contains the complete filtered set, not
   just the current page. Dates are ISO UTC; amounts include their currency code.
8. Inspect desktop/tablet/mobile, keyboard focus, empty and invalid-range states.

## Before a future submission

- [ ] Confirm the deadline/extension: the supplied PDF lists November 20, 2026.
- [ ] Authorize and select a deployment destination; deploy a production build.
- [ ] Verify the public demo in a fresh browser, including direct details URLs.
- [ ] Push the reviewed commits and verify access to the GitHub repository:
      `https://github.com/gabriel-ramos44/stripe-payments-screen` (URL from this session;
      remote access has not been verified as part of local preparation).
- [ ] If private, add `arthurrios-chargeblast` and `BrunoMestanzaChargeblast`.
- [ ] Replace both placeholders in the draft below and review the final message.

## Submission email draft

Hi Chargeblast team,

Here is my completed payments-screen assessment:

- Demo: [PUBLIC DEMO URL]
- Source: [GITHUB REPOSITORY URL]

The implementation includes the required table, search and filters, sorting,
pagination, responsive layout and keyboard-accessible interactions. It also includes
payment details, shareable views, column controls and CSV export. Setup instructions,
design decisions and verification results are in the repository README.

Thank you for reviewing my work.

Gabriel
