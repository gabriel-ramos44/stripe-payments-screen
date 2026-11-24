import { PaymentsWorkspace } from "@/features/payments/components/payments-workspace";
import { createMockPayments } from "@/features/payments/mock-data";

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  // A server-only anchor makes local QA reproducible without exposing a public switch.
  const anchor = process.env.PAYMENTS_MOCK_ANCHOR
    ? new Date(process.env.PAYMENTS_MOCK_ANCHOR)
    : new Date();
  if (!Number.isFinite(anchor.getTime()))
    throw new Error("PAYMENTS_MOCK_ANCHOR must be a valid ISO timestamp");
  return (
    <PaymentsWorkspace
      payments={createMockPayments({ anchor })}
      referenceTime={anchor.toISOString()}
    />
  );
}
