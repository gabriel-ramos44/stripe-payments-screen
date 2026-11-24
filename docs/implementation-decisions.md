# Implementation decisions

Status: planning baseline for later tasks. Only the project foundation is built.

## Scope and stack

- Next.js App Router and strict TypeScript, as preferred in the brief.
- Plain global CSS for reset/base rules; CSS Modules planned for component styles.
- Keep shell rendering simple; put interactive state in client components when built.
- Use local mock data and browser-side processing; no backend, auth or Stripe API.
- Evaluate a headless table library in the table task; do not install unused tools now.
- Keep feature types, query functions, formatters and UI separate. Avoid a global
  state library for this single-screen scope.
- Root route currently contains only a setup placeholder. Planned payments route:
  `/payments`, with `/payments/[paymentId]` if the optional detail task is approved.
- No remote fonts, analytics, cloud pages, deployment or Git remote in current scope.

## Reference conflicts

| Issue                                         | Proposed decision                                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Pagination differs                            | Default 25; offer 25/50/100; show actual local record counts                                                                  |
| Required columns absent from screenshot       | Show Payment ID and Created alongside Customer, Amount, Status and Payment method; use reference styling and preserve density |
| Screenshot uses Date                          | Required-field label defaults to Created; document this intentional difference; seek reviewer clarification if available      |
| Extra statuses                                | Required four first; do not expose decorative status controls that cannot work                                                |
| Screenshot summary cards include extra states | Add a coherent extended status model only in a later refinement; avoid mapping Pending to Uncaptured without evidence         |
| Extra table fields                            | Add only after required fields pass; horizontal scrolling is acceptable                                                       |
| Extra visible actions                         | Implement later if included; avoid dead controls or misleading actions                                                        |
| Sidebar optional                              | Include shell early for proportions; full unrelated destination pages are outside scope                                       |

Written functional requirements take precedence when incompatible with the image.
Preserve exact reference labels elsewhere. This is our resolution, not a statement
that Chargeblast has approved these interpretations.

## Data contract and processing

- Plan approximately 500 stable synthetic payments with unique full IDs and curated
  initial rows. Include all required statuses, Card/ACH/Wallet and several currencies.
- Store amounts as integer minor units with a supported currency exponent mapping;
  do not assume every currency has two decimals. Store timestamps as ISO instants.
- Use a discriminated payment-method model so card brand/last-four fields are only
  required on appropriate records. Never use real customer/payment information.
- Process the complete dataset in this order: filter, stable sort, paginate.
- AND across filter categories; OR within a status/payment-method selection.
- Search trims input and matches full ID, email or last four case-insensitively.
- Empty multi-select means unrestricted. Reset filters also resets pagination.
- Date presets use America/Sao_Paulo calendar boundaries: Today; last 7 calendar
  days including today; last 30 calendar days including today. Custom end dates
  use the next local midnight as an exclusive upper boundary.
- Generate dates relative to a single runtime anchor so recent presets stay useful;
  keep random generation seeded and freeze the anchor in tests. Avoid rendering
  different server/client datasets or reading the clock independently per row.
- Amount filtering/sorting uses numeric major-unit values without FX conversion.
  Currency remains visible. This limitation must be stated in the final README;
  a currency filter is a possible refinement, not a current requirement.
- Amount bounds inclusive; blank means unbounded; reject negative, non-finite or
  reversed bounds without applying an invalid range.
- Status order proposed: Succeeded, Pending, Failed, Refunded; descending reverses.
  Numeric/date sorting uses raw values, with ID as a stable tie-breaker.
- Default sort: newest first. Default page size: 25. Filter/sort/page-size changes
  return to the first page; data changes clamp out-of-range pages.

## Interaction and accessibility

- Copy full IDs with accurate success/failure feedback; copy button must not trigger
  row navigation. Accessible name includes the action and payment context.
- Date tooltips available on hover and keyboard focus; include a clear time zone.
- Native table semantics, header sort buttons/aria-sort, labeled controls, visible
  focus and keyboard-operable popovers with Escape and focus restoration.
- Keep status understandable through text/symbols, not color alone.
- Empty results retain filters and provide a clear reset action.
- Mobile: collapsed sidebar, wrapping/adapted toolbar and contained table overflow.
  Desktop remains the primary screenshot-fidelity target.
- If URL state is added later, validate query parameters and support refresh and
  browser navigation. If CSV is added, define export scope and escape unsafe cells.

## Verification plan for later tasks

- Pure behavior checks: date boundaries, currency precision, combined filters,
  numeric sorting, stable ties and pagination after result reduction.
- Browser journeys: search/filter/sort together; empty/reset; clipboard feedback;
  keyboard operation; optional details and URL restoration.
- Visual comparisons at fixed viewport and clock, with manual comparison against
  the PDF before accepting regression snapshots.
- Lint, strict typecheck and production build required before each handoff.
- No UI behavior tests in task 4: no payment behavior has been implemented yet.

## Deferred confirmations

- Whether the November 20 deadline has been extended.
- Original screenshot viewport, font and exact visual values.
- Live menu contents, filter apply semantics and payment-details hierarchy.
- Whether a walkthrough video exists outside the supplied PDF.

None of these blocks local foundation work. Submission/publication remains deferred.
