import { PaymentsWorkspace } from "@/features/payments/components/payments-workspace";
import { createMockPayments } from "@/features/payments/mock-data";

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  const anchor = new Date();
  return (
    <PaymentsWorkspace
      payments={createMockPayments({ anchor })}
      referenceTime={anchor.toISOString()}
    />
  );
}
