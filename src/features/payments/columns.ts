export const PAYMENT_COLUMNS = [
  { id: "amount", label: "Amount", width: 205, min: 190, sort: "amountMinor" },
  { id: "method", label: "Payment method", width: 130, min: 120 },
  { id: "description", label: "Description", width: 155, min: 150 },
  { id: "customer", label: "Customer", width: 240, min: 180 },
  { id: "created", label: "Date", width: 125, min: 125, sort: "createdAt" },
  { id: "refunded", label: "Refunded date", width: 105, min: 100 },
  { id: "decline", label: "Decline reason", width: 150, min: 120 },
  { id: "id", label: "Payment ID", width: 180, min: 160 },
] as const;
export type ColumnId = (typeof PAYMENT_COLUMNS)[number]["id"];
export type ColumnWidths = Partial<Record<ColumnId, number>>;
export function defaultColumnOrder(): ColumnId[] {
  return PAYMENT_COLUMNS.map((column) => column.id);
}
export function columnDefinition(id: ColumnId) {
  return PAYMENT_COLUMNS.find((column) => column.id === id)!;
}
export function resizeColumn(id: ColumnId, width: number) {
  return Math.round(Math.max(columnDefinition(id).min, Math.min(600, width)));
}
export function reorderColumns(
  order: ColumnId[],
  source: ColumnId,
  target: ColumnId,
) {
  if (source === target) return order;
  const next = order.filter((id) => id !== source);
  next.splice(order.indexOf(target), 0, source);
  return next;
}
