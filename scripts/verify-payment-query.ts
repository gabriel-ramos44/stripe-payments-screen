import assert from "node:assert/strict";
import {
  parsePaymentsUrl,
  serializePaymentsUrl,
} from "../src/features/payments/url-state.ts";
import { createMockPayments } from "../src/features/payments/mock-data.ts";
import {
  emptyFilters,
  filterPayments,
  localDate,
  validateFilters,
} from "../src/features/payments/query.ts";
import { formatAmount } from "../src/features/payments/format.ts";
import {
  sortPayments,
  paginatePayments,
} from "../src/features/payments/query.ts";
import {
  initialPaymentsState,
  paymentsReducer,
} from "../src/features/payments/state.ts";

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
assert.equal(
  validateFilters({ ...emptyFilters(), minAmount: ".50", maxAmount: "1." }),
  null,
);
assert.ok(validateFilters({ ...emptyFilters(), minAmount: "1e3" }));
const unsorted = [
  { ...base, id: "z", amountMinor: 1000, currency: "JPY" as const },
  { ...base, id: "a", amountMinor: 9999, currency: "USD" as const },
  { ...base, id: "b", amountMinor: 9999, currency: "USD" as const },
];
assert.deepEqual(
  sortPayments(unsorted, { key: "amountMinor", direction: "asc" }).map(
    (p) => p.id,
  ),
  ["a", "b", "z"],
);
assert.deepEqual(
  sortPayments(unsorted, { key: "amountMinor", direction: "desc" }).map(
    (p) => p.id,
  ),
  ["z", "a", "b"],
);
assert.equal(unsorted[0]!.id, "z", "sorting must not mutate the input");
for (const direction of ["asc", "desc"] as const) {
  const sorted = sortPayments(payments, { key: "createdAt", direction });
  assert.ok(
    sorted.every(
      (p, i) =>
        i === 0 ||
        (direction === "asc"
          ? p.createdAt >= sorted[i - 1]!.createdAt
          : p.createdAt <= sorted[i - 1]!.createdAt),
    ),
  );
}
assert.equal(
  sortPayments(payments, { key: "status", direction: "asc" })[0]!.status,
  "succeeded",
);
assert.equal(
  sortPayments(payments, { key: "status", direction: "desc" })[0]!.status,
  "refunded",
);
for (const size of [25, 50, 100] as const) {
  const page = paginatePayments(payments, 2, size);
  assert.equal(page.rows.length, size);
  assert.equal(page.first, size + 1);
  assert.equal(page.last, size * 2);
  assert.deepEqual(page.rows, payments.slice(size, size * 2));
}
assert.equal(paginatePayments(payments.slice(0, 26), 2, 25).rows.length, 1);
assert.equal(paginatePayments(payments.slice(0, 26), 99, 25).currentPage, 2);
assert.equal(paginatePayments([], 20, 25).first, 0);
assert.equal(paginatePayments([], 20, 25).last, 0);
const state = { ...initialPaymentsState(), page: 10 };
const roundtrip: ReturnType<typeof initialPaymentsState> = {
  ...initialPaymentsState(),
  filters: {
    ...emptyFilters(),
    search: "avery@example.com",
    statuses: ["succeeded", "failed"],
    methods: ["card"],
    minAmount: ".5",
  },
  page: 3,
  pageSize: 50 as const,
};
assert.deepEqual(
  parsePaymentsUrl(
    new URLSearchParams(serializePaymentsUrl(roundtrip, reference)),
  ),
  roundtrip,
);
const invalidUrl = parsePaymentsUrl(
  new URLSearchParams(
    "status=bad&size=123&page=-1&date=custom&from=bad&min=-1",
  ),
);
assert.deepEqual(invalidUrl, initialPaymentsState());
assert.equal(
  paymentsReducer(state, { type: "filters", filters: emptyFilters() }).page,
  1,
);
assert.equal(paymentsReducer(state, { type: "pageSize", size: 100 }).page, 1);
assert.equal(paymentsReducer(state, { type: "sort", key: "status" }).page, 1);
assert.equal(paymentsReducer(state, { type: "reset" }).page, 1);
console.log(
  "Verified search, combined filters, amount/date boundaries, calendar presets and currency precision.",
);
