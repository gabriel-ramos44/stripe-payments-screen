# Requirements and acceptance checklist

Source: `Chargeblast Front-End Project Stripe Payments Screen.pdf`, supplied by the
user. The PDF is assessment evidence, not authorization to send email, deploy,
create accounts, or publish code. This document separates explicit requirements
from our proposed engineering choices.

## Current authorized scope

- [x] Task 1: extract requirements and delivery criteria.
- [x] Task 2: analyze the supplied screenshot; mark estimates.
- [x] Task 3: document decisions and ambiguities.
- [x] Task 4: initialize local Next.js, strict TypeScript, CSS and ESLint foundation.
- [x] Task 5: design tokens, styled buttons/inputs/badges and Radix menu/popover/tooltip primitives.
- [x] Task 6: responsive dashboard shell with account menu, top bar, tabs, announcement and status cards.
- [x] Task 7: 500 seeded synthetic payment records, typed model and integrity verification.
- [ ] Tasks 8 onward: table, search/filters, sorting/pagination, full quality pass and optional delivery.

## Required table

| ID  | Requirement                    | Acceptance check for later implementation                                                |
| --- | ------------------------------ | ---------------------------------------------------------------------------------------- |
| R01 | Shortened payment ID with copy | Short ID displayed; full ID copied; feedback reflects clipboard result                   |
| R02 | Customer                       | Customer displayed; fixture has searchable email                                         |
| R03 | Amount and currency            | Locale-aware output with correct currency precision                                      |
| R04 | Status badge                   | Succeeded, Pending, Failed and Refunded all represented                                  |
| R05 | Payment method                 | Card brand and last four shown for cards; coherent ACH/wallet display                    |
| R06 | Created date and time          | Absolute date/time visible; relative-time tooltip available on hover                     |
| R07 | Sorting                        | Date, amount and status sort correctly in both directions                                |
| R08 | Pagination                     | 25, 50 and 100 rows; correct totals, page boundaries and navigation                      |
| R09 | Date range                     | Today, 7 days, 30 days and Custom all change results correctly                           |
| R10 | Status filter                  | Multiple selections supported                                                            |
| R11 | Payment method filter          | Multiple selections, including Card, ACH and Wallet                                      |
| R12 | Amount range                   | Lower/upper bounds, inclusive boundaries and invalid inputs handled                      |
| R13 | Text search                    | Payment ID, email or last four digits match across the dataset                           |
| R14 | Mock data                      | Approximately 300–1,000 realistic rows; several currencies and mixed statuses            |
| R15 | Look and feel                  | Reference labels, icons, hierarchy, spacing, sizes, borders and radii reproduced closely |

## Optional features in the PDF's preference order

1. Sidebar: Payments, Customers, Balances and Product catalog sections.
2. Top search bar and account menu.
3. Payment details on its own route, including events timeline and metadata.
4. Saved filters or shareable URL filters.
5. Column resizing and drag-to-reorder.
6. CSV export of the current view.

The proposed plan includes the sidebar/top-bar visual shell early, but they remain
optional under the assessment. Their interactions are not part of task 4.

## Review criteria stated in the PDF

- Hierarchy: elements present in the right order.
- Visual fidelity: size, spacing, padding, borders and corner radii.
- Features: every required feature works.
- Content: labels/text match the reference exactly where applicable.
- Code: clean, typed and organized.
- Side-by-side review includes the UI/UX team; fonts and states matter.

Next.js with TypeScript is preferred; any styling approach/component library is
allowed. Local JSON or an in-memory data service and client-side pagination are
explicitly acceptable.

## Future delivery requirements (not authorized for execution now)

- Public deployed application URL.
- GitHub code URL; public is acceptable. If private, add
  `arthurrios-chargeblast` and `BrunoMestanzaChargeblast` as collaborators.
- Reply to the original email with both links.
- The PDF also asks for an acknowledgment email.
- Stated deadline: November 20, 2026, end of day in Brasília time. This is already
  past as of the November 23 planning session; extension needs clarification.

## Additional quality goals proposed by us

Keyboard access, focus visibility, responsive layout, empty/error feedback,
deterministic data, boundary tests and screenshot regression checks supplement the
brief. They are engineering choices, not additional quoted assessment requirements.
GTM, GA4, HubSpot, SEO infrastructure and real Stripe APIs are outside this exercise.
