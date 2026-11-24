import assert from "node:assert/strict";
import { createMockPayments } from "../src/features/payments/mock-data.ts";
import {
  emptyFilters,
  filterPayments,
  localDate,
  validateFilters,
} from "../src/features/payments/query.ts";
import { formatAmount } from "../src/features/payments/format.ts";

const reference = "2026-11-24T15:00:00Z";
const payments = createMockPayments({ anchor: new Date(reference) });
const base = payments[0]!;
assert.equal(localDate("2026-11-24T02:59:59Z"), "2026-11-23");
assert.equal(localDate("2026-11-24T03:00:00Z"), "2026-11-24");
assert.equal(filterPayments(payments, emptyFilters(), reference).length, 500);
assert.deepEqual(
  filterPayments(
    payments,
    { ...emptyFilters(), search: `  ${base.id.toUpperCase()}  ` },
    reference,
  ),
  [base],
);
assert.ok(
  filterPayments(
    payments,
    { ...emptyFilters(), search: base.customer.email },
    reference,
  ).every((p) => p.customer.email === base.customer.email),
);
assert.ok(
  filterPayments(
    payments,
    { ...emptyFilters(), search: base.method.last4 },
    reference,
  ).some((p) => p.id === base.id),
);
const combined = filterPayments(
  payments,
  {
    ...emptyFilters(),
    statuses: ["succeeded", "failed"],
    methods: ["card", "ach"],
    currencies: ["USD"],
  },
  reference,
);
assert.ok(combined.length > 0);
assert.ok(
  combined.every(
    (p) =>
      ["succeeded", "failed"].includes(p.status) &&
      ["card", "ach"].includes(p.method.type) &&
      p.currency === "USD",
  ),
);
const boundaries = [
  "2026-11-23T02:59:59Z",
  "2026-11-23T03:00:00Z",
  "2026-11-24T02:59:59Z",
  "2026-11-24T03:00:00Z",
].map((createdAt, i) => ({ ...base, id: String(i), createdAt }));
assert.deepEqual(
  filterPayments(
    boundaries,
    {
      ...emptyFilters(),
      datePreset: "custom",
      startDate: "2026-11-23",
      endDate: "2026-11-23",
    },
    reference,
  ).map((p) => p.id),
  ["1", "2"],
);
assert.deepEqual(
  filterPayments(
    boundaries,
    { ...emptyFilters(), datePreset: "today" },
    reference,
  ).map((p) => p.id),
  ["3"],
);
for (const [datePreset, start] of [
  ["7days", "2026-11-18"],
  ["30days", "2026-10-26"],
] as const) {
  const results = filterPayments(
    payments,
    { ...emptyFilters(), datePreset },
    reference,
  );
  assert.ok(results.length > 0 && results.length < payments.length);
  assert.ok(
    results.every(
      (p) =>
        localDate(p.createdAt) >= start &&
        localDate(p.createdAt) <= "2026-11-24",
    ),
  );
}
assert.equal(
  filterPayments(
    [{ ...base, amountMinor: 988, currency: "USD" }],
    { ...emptyFilters(), minAmount: "9.88", maxAmount: "9.88" },
    reference,
  ).length,
  1,
);
assert.equal(
  filterPayments(
    payments,
    { ...emptyFilters(), search: "nothing-matches" },
    reference,
  ).length,
  0,
);
assert.ok(
  validateFilters({ ...emptyFilters(), minAmount: "20", maxAmount: "10" }),
);
assert.ok(validateFilters({ ...emptyFilters(), minAmount: "-1" }));
assert.ok(
  validateFilters({
    ...emptyFilters(),
    datePreset: "custom",
    startDate: "2026-02-30",
    endDate: "2026-03-01",
  }),
);
assert.equal(formatAmount(2500, "JPY"), "¥2,500");
assert.equal(formatAmount(988, "USD"), "$9.88");
console.log(
  "Verified search, combined filters, amount/date boundaries, calendar presets and currency precision.",
);
