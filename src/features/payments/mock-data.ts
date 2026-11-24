import {
  CURRENCY_EXPONENTS,
  type CardBrand,
  type Currency,
  type Payment,
  type PaymentMethod,
  type PaymentStatus,
} from "./types.ts";

export const DEFAULT_PAYMENT_COUNT = 500;
export const DEFAULT_PAYMENT_SEED = 20261123;
const DAY_MS = 86_400_000;
const currencies: Currency[] = [
  "USD",
  "USD",
  "USD",
  "GBP",
  "EUR",
  "BRL",
  "JPY",
];
const brands: CardBrand[] = ["visa", "mastercard", "amex"];
const customers = [
  ["Avery Morgan", "avery.morgan"],
  ["Jordan Lee", "jordan.lee"],
  ["Sofia Martins", "sofia.martins"],
  ["Noah Wilson", "noah.wilson"],
  ["Amelia Chen", "amelia.chen"],
  ["Lucas Santos", "lucas.santos"],
  ["Isabella Rossi", "isabella.rossi"],
  ["Ethan Patel", "ethan.patel"],
  ["Mia Thompson", "mia.thompson"],
  ["Oliver Garcia", "oliver.garcia"],
  ["Emma Anderson", "emma.anderson"],
  ["Gabriel Silva", "gabriel.silva"],
] as const;
const descriptions = [
  "Subscription update",
  "Monthly subscription",
  "Annual subscription",
  "One-time purchase",
  "Usage-based invoice",
];

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4_294_967_296;
  };
}

function choose<T>(values: readonly T[], random: () => number): T {
  const value = values[Math.floor(random() * values.length)];
  if (value === undefined)
    throw new Error("Cannot choose from an empty collection");
  return value;
}

/** Same anchor/count/seed always produces the same records. Does not read the clock. */
export function createMockPayments({
  anchor,
  count = DEFAULT_PAYMENT_COUNT,
  seed = DEFAULT_PAYMENT_SEED,
}: {
  anchor: Date;
  count?: number;
  seed?: number;
}): Payment[] {
  if (!Number.isFinite(anchor.getTime()))
    throw new RangeError("A valid anchor date is required");
  if (!Number.isInteger(count) || count < 1 || count > 10_000)
    throw new RangeError("Count must be an integer between 1 and 10,000");
  if (!Number.isSafeInteger(seed))
    throw new RangeError("Seed must be a safe integer");
  const random = seededRandom(seed);
  const anchorMs = anchor.getTime();
  return Array.from({ length: count }, (_, index): Payment => {
    const [name, handle] = choose(customers, random);
    const currency =
      index < 5
        ? (["USD", "GBP", "BRL", "EUR", "JPY"] as const)[index]!
        : choose(currencies, random);
    const status: PaymentStatus =
      index < 4
        ? (["failed", "succeeded", "pending", "refunded"] as const)[index]!
        : choose(
            [
              "succeeded",
              "succeeded",
              "succeeded",
              "succeeded",
              "pending",
              "failed",
              "refunded",
            ] as const,
            random,
          );
    const brand = choose(brands, random);
    const last4 =
      index === 0
        ? "4149"
        : String(Math.floor(random() * 10_000)).padStart(4, "0");
    const methodRoll =
      index === 2 ? 0.85 : index === 3 ? 0.98 : index < 5 ? 0.1 : random();
    const method: PaymentMethod =
      methodRoll < 0.78
        ? { type: "card", brand, last4 }
        : methodRoll < 0.9
          ? {
              type: "ach",
              bankName: choose(
                ["Chase", "Bank of America", "Wells Fargo"],
                random,
              ),
              last4,
            }
          : {
              type: "wallet",
              wallet: choose(["apple_pay", "google_pay"] as const, random),
              brand,
              last4,
            };
    // Curated newest rows support visual work; the remaining rows span 120 days.
    const age =
      index < 25 ? index * 27 * 60_000 : Math.floor(random() * 120 * DAY_MS);
    const createdMs = anchorMs - age;
    const exponent = CURRENCY_EXPONENTS[currency];
    const majorAmount =
      index === 0
        ? 9.88
        : index === 1
          ? 21.98
          : index === 2
            ? 99.99
            : index === 3
              ? 15.99
              : index === 4
                ? 2500
                : choose(
                    [
                      4.07, 8.99, 10.98, 15.99, 19.99, 21.98, 34.99, 49, 99,
                      189.99, 299, 1299,
                    ],
                    random,
                  );
    const amountMinor = Math.round(majorAmount * 10 ** exponent);
    const suffix = `${index.toString(36).padStart(5, "0")}${Math.floor(
      random() * 0xffffff,
    )
      .toString(16)
      .padStart(6, "0")}`;
    return {
      id: `pi_mock_${suffix}`,
      customer: {
        id: `cus_mock_${handle.replaceAll(".", "_")}`,
        name,
        email: `${handle}@example.com`,
      },
      amountMinor,
      currency,
      status,
      disputed:
        status === "succeeded" && method.type !== "ach" && index % 23 === 0,
      captureState:
        status === "pending" && method.type === "card" && index % 2 === 0
          ? "uncaptured"
          : status === "pending" || status === "failed"
            ? "not_applicable"
            : "captured",
      method,
      createdAt: new Date(createdMs).toISOString(),
      description:
        index < 25 ? "Subscription update" : choose(descriptions, random),
      refundedAt:
        status === "refunded"
          ? new Date(
              Math.min(anchorMs, createdMs + 3 * 60 * 60_000),
            ).toISOString()
          : null,
      failureReason:
        status === "failed"
          ? choose(
              ["insufficient_funds", "card_declined", "expired_card"] as const,
              random,
            )
          : null,
    };
  }).sort(
    (a, b) =>
      b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
  );
}
