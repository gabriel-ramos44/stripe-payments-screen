import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PaymentsTable } from "@/features/payments/components/payments-table";
import { createMockPayments } from "@/features/payments/mock-data";

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  const anchor = new Date();
  const payments = createMockPayments({ anchor });
  return (
    <DashboardShell>
      <PaymentsTable
        payments={payments.slice(0, 25)}
        referenceTime={anchor.toISOString()}
      />
    </DashboardShell>
  );
}
