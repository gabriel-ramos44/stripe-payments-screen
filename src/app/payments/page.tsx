import { PaymentsWorkspace } from "@/features/payments/components/payments-workspace";
import { getPaymentsData } from "@/features/payments/data";
import { parsePaymentsUrl } from "@/features/payments/url-state";

export const dynamic = "force-dynamic";

export default async function PaymentsPage({
  searchParams,
}: PageProps<"/payments">) {
  const query = await searchParams;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query))
    for (const item of Array.isArray(value) ? value : value ? [value] : [])
      params.append(key, item);
  const { payments, referenceTime } = getPaymentsData(
    params.get("at") ?? undefined,
  );
  return (
    <PaymentsWorkspace
      payments={payments}
      referenceTime={referenceTime}
      initialState={parsePaymentsUrl(params)}
    />
  );
}
