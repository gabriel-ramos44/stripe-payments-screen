export const PAYMENT_COLUMNS = [
  { id: "amount", label: "Amount", width: 140, min: 115, sort: "amountMinor" },
  { id: "status", label: "Status", width: 115, min: 100, sort: "status" },
  { id: "method", label: "Payment method", width: 180, min: 150 },
  { id: "description", label: "Description", width: 170, min: 150 },
  { id: "customer", label: "Customer", width: 215, min: 180 },
  { id: "created", label: "Created", width: 170, min: 155, sort: "createdAt" },
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
