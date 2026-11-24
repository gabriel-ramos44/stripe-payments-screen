# Mock payment data

Task 7 supplies an in-memory service rather than a static JSON file. It is not wired
to the task-6 placeholder; the table is task 8.

## Contract

`createMockPayments({ anchor, count?, seed? })` returns a newest-first `Payment[]`.
Default count is 500 and seed is 20261123. Callers must supply a valid `Date` anchor.
Count is constrained to 1–10,000 and seed to a safe integer. Same inputs produce
deeply identical records; no network, storage or global clock is involved.

- Unique `pi_mock_` payment IDs and stable synthetic customer identities.
- Reserved `example.com` customer emails; no copied real customer information.
- USD/GBP/EUR/BRL (2 decimal places) and JPY (0 decimal places).
- Integer minor-unit amounts; use the currency exponent to display major units.
- Succeeded, Pending, Failed and Refunded with success weighted more heavily.
- Card (Visa/Mastercard/Amex), ACH (bank name) and Apple Pay/Google Pay wallets.
- Four-digit account/card suffixes stored as strings, preserving leading zeros.
- Subscription and purchase descriptions; curated recent rows resemble reference amounts.
- Dates distributed over 120 days; first 25 generated rows are recent.
- Refund dates fall between creation and the anchor. Failure reasons only occur
  on failed payments; no real PANs, credentials or payment tokens are included.

## Integration guidance

Create the dataset once per page data boundary, using one captured current time,
then serialize it to the interactive table. Preserve that dataset during interaction.
Generate fixtures with a fixed anchor in tests to prevent clock-related failures.
The initial data is sorted newest first but the table must later implement its own
filter → sort → paginate pipeline.

`npm run verify:data` checks reproducibility, variation by seed, default count,
unique IDs, full status/currency/method coverage, integer positive amounts, valid
last-four strings, synthetic email domains, timestamp ordering, recent/older data,
refund/failure consistency and invalid argument rejection.
