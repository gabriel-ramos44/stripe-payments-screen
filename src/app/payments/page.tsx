import { PaymentsWorkspace } from "@/features/payments/components/payments-workspace";
import { getPaymentsData } from "@/features/payments/data";

export const dynamic = "force-dynamic";

export default function PaymentsPage() {
  const { payments, referenceTime } = getPaymentsData();
  return (
    <PaymentsWorkspace payments={payments} referenceTime={referenceTime} />
  );
}
