import "server-only";
import { createMockPayments } from "./mock-data";

export function getPaymentsData(requestedAnchor?: string) {
  const requested =
    requestedAnchor && /^\d{4}-\d{2}-\d{2}T/.test(requestedAnchor)
      ? new Date(requestedAnchor)
      : null;
  const configured = process.env.PAYMENTS_MOCK_ANCHOR;
  const anchor =
    requested &&
    Number.isFinite(requested.getTime()) &&
    requested.getUTCFullYear() >= 2000 &&
    requested.getUTCFullYear() <= 2100
      ? requested
      : configured
        ? new Date(configured)
        : new Date();
  if (!Number.isFinite(anchor.getTime()))
    throw new Error("PAYMENTS_MOCK_ANCHOR must be a valid ISO timestamp");
  return {
    payments: createMockPayments({ anchor }),
    referenceTime: anchor.toISOString(),
  };
}
