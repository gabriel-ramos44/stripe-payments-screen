import { CURRENCY_EXPONENTS, type Payment } from "./types.ts";
import { columnDefinition, type ColumnId } from "./columns.ts";

export function escapeCsvCell(value: string) {
  const safe =
    /^[\s]*[=+@-]/.test(value) || /^[\t\r\n]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}
export function paymentsToCsv(
  payments: readonly Payment[],
  columns: readonly ColumnId[],
) {
  const header = columns
    .map((id) =>
      escapeCsvCell(
        id === "created" ? "Created (UTC)" : columnDefinition(id).label,
      ),
    )
    .join(",");
  const rows = payments.map((payment) => {
    const method = payment.method;
    const methodName =
      method.type === "ach"
        ? `ACH ${method.bankName}`
        : `${method.type === "wallet" ? `${method.wallet === "apple_pay" ? "Apple Pay" : "Google Pay"} ` : ""}${method.brand}`;
    const values: Record<ColumnId, string> = {
      amount: `${(payment.amountMinor / 10 ** CURRENCY_EXPONENTS[payment.currency]).toFixed(CURRENCY_EXPONENTS[payment.currency])} ${payment.currency}`,
      status: payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
      method: `${methodName} ending in ${method.last4}`,
      description: payment.description,
      customer: payment.customer.email,
      created: payment.createdAt,
      id: payment.id,
    };
    return columns.map((id) => escapeCsvCell(values[id])).join(",");
  });
  return `\uFEFF${[header, ...rows].join("\r\n")}\r\n`;
}
