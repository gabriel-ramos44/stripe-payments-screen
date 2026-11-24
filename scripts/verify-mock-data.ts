import assert from "node:assert/strict";
import { createMockPayments } from "../src/features/payments/mock-data.ts";
import {
  CURRENCY_EXPONENTS,
  PAYMENT_STATUSES,
} from "../src/features/payments/types.ts";

const anchor = new Date("2026-11-23T15:00:00.000Z");
const payments = createMockPayments({ anchor });
assert.equal(payments.length, 500);
assert.deepEqual(payments, createMockPayments({ anchor }));
assert.notDeepEqual(payments, createMockPayments({ anchor, seed: 123 }));
assert.equal(
  new Set(payments.map((payment) => payment.id)).size,
  payments.length,
);
assert.deepEqual(
  new Set(payments.map((payment) => payment.status)),
  new Set(PAYMENT_STATUSES),
);
assert.deepEqual(
  new Set(payments.map((payment) => payment.currency)),
  new Set(Object.keys(CURRENCY_EXPONENTS)),
);
assert.deepEqual(
  new Set(payments.map((payment) => payment.method.type)),
  new Set(["card", "ach", "wallet"]),
);
for (const [index, payment] of payments.entries()) {
  assert.ok(
    Number.isSafeInteger(payment.amountMinor) && payment.amountMinor > 0,
  );
  assert.match(payment.customer.email, /@example\.com$/);
  assert.match(payment.method.last4, /^\d{4}$/);
  assert.ok(Date.parse(payment.createdAt) <= anchor.getTime());
  if (index > 0) assert.ok(payment.createdAt <= payments[index - 1]!.createdAt);
  if (payment.status === "refunded") {
    assert.ok(payment.refundedAt && payment.refundedAt >= payment.createdAt);
    assert.ok(Date.parse(payment.refundedAt) <= anchor.getTime());
  } else assert.equal(payment.refundedAt, null);
  assert.equal(payment.failureReason !== null, payment.status === "failed");
}
for (const days of [1, 7, 30])
  assert.ok(
    payments.some(
      (payment) =>
        Date.parse(payment.createdAt) >= anchor.getTime() - days * 86_400_000,
    ),
  );
assert.ok(
  payments.some(
    (payment) =>
      Date.parse(payment.createdAt) < anchor.getTime() - 30 * 86_400_000,
  ),
);
assert.throws(
  () => createMockPayments({ anchor: new Date("invalid") }),
  RangeError,
);
assert.throws(() => createMockPayments({ anchor, count: 0 }), RangeError);
console.log(
  "Verified 500 deterministic payments: IDs, methods, currencies, statuses, dates and metadata.",
);
