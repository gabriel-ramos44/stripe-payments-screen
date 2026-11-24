import {
  CURRENCY_EXPONENTS,
  type Currency,
  type Payment,
  type PaymentStatus,
} from "./types.ts";
import { PAYMENT_TIME_ZONE } from "./format.ts";

export type DatePreset = "all" | "today" | "7days" | "30days" | "custom";
export type SortKey = "createdAt" | "amountMinor" | "status";
export type PaymentSort = { key: SortKey; direction: "asc" | "desc" };
export const PAGE_SIZES = [25, 50, 100] as const;
export type PageSize = (typeof PAGE_SIZES)[number];
const statusOrder = { succeeded: 0, pending: 1, failed: 2, refunded: 3 };
export function sortPayments(
  payments: readonly Payment[],
  sort: PaymentSort,
): Payment[] {
  const value = (payment: Payment) =>
    sort.key === "status"
      ? statusOrder[payment.status]
      : sort.key === "createdAt"
        ? Date.parse(payment.createdAt)
        : payment.amountMinor / 10 ** CURRENCY_EXPONENTS[payment.currency];
  return [...payments].sort(
    (a, b) =>
      (value(a) - value(b)) * (sort.direction === "asc" ? 1 : -1) ||
      a.id.localeCompare(b.id),
  );
}
export function paginatePayments(
  payments: readonly Payment[],
  page: number,
  pageSize: PageSize,
) {
  const pageCount = Math.max(1, Math.ceil(payments.length / pageSize));
  const currentPage = Math.min(Math.max(1, page), pageCount);
  const offset = (currentPage - 1) * pageSize;
  return {
    rows: payments.slice(offset, offset + pageSize),
    currentPage,
    pageCount,
    first: payments.length ? offset + 1 : 0,
    last: Math.min(offset + pageSize, payments.length),
  };
}
export type PaymentFilters = {
  view: "all" | "disputed" | "uncaptured";
  search: string;
  statuses: PaymentStatus[];
  methods: Payment["method"]["type"][];
  currencies: Currency[];
  datePreset: DatePreset;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
};
export function emptyFilters(): PaymentFilters {
  return {
    view: "all",
    search: "",
    statuses: [],
    methods: [],
    currencies: [],
    datePreset: "all",
    startDate: "",
    endDate: "",
    minAmount: "",
    maxAmount: "",
  };
}
const calendarFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: PAYMENT_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export function localDate(value: string) {
  const parts = calendarFormat.formatToParts(new Date(value));
  const part = (type: string) => parts.find((p) => p.type === type)?.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}
function shiftDate(date: string, days: number) {
  const value = new Date(`${date}T12:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}
export function validateFilters(filters: PaymentFilters): string | null {
  const { minAmount, maxAmount, startDate, endDate } = filters;
  const validAmount = (value: string) =>
    value === "" ||
    (/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(value) &&
      Number.isFinite(Number(value)) &&
      Number(value) >= 0);
  if (!validAmount(minAmount) || !validAmount(maxAmount))
    return "Enter a valid, non-negative amount.";
  if (
    minAmount !== "" &&
    maxAmount !== "" &&
    Number(minAmount) > Number(maxAmount)
  )
    return "Minimum amount must not exceed maximum amount.";
  if (filters.datePreset === "custom") {
    const validDate = (value: string) =>
      /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      Number.isFinite(Date.parse(`${value}T12:00:00Z`)) &&
      new Date(`${value}T12:00:00Z`).toISOString().startsWith(value);
    if (!validDate(startDate) || !validDate(endDate))
      return "Choose valid start and end dates.";
    if (startDate > endDate) return "Start date must be on or before end date.";
  }
  return null;
}
export function filterPayments(
  payments: readonly Payment[],
  filters: PaymentFilters,
  referenceTime: string,
): Payment[] {
  const today = localDate(referenceTime);
  const days =
    filters.datePreset === "today"
      ? 1
      : filters.datePreset === "7days"
        ? 7
        : 30;
  const from =
    filters.datePreset === "custom"
      ? filters.startDate
      : shiftDate(today, -(days - 1));
  const to = filters.datePreset === "custom" ? filters.endDate : today;
  const search = filters.search.trim().toLowerCase();
  return payments.filter((payment) => {
    if (filters.view === "disputed" && !payment.disputed) return false;
    if (filters.view === "uncaptured" && payment.captureState !== "uncaptured")
      return false;
    if (
      search &&
      ![payment.id, payment.customer.email, payment.method.last4].some(
        (value) => value.toLowerCase().includes(search),
      )
    )
      return false;
    if (filters.statuses.length && !filters.statuses.includes(payment.status))
      return false;
    if (
      filters.methods.length &&
      !filters.methods.includes(payment.method.type)
    )
      return false;
    if (
      filters.currencies.length &&
      !filters.currencies.includes(payment.currency)
    )
      return false;
    const amount =
      payment.amountMinor / 10 ** CURRENCY_EXPONENTS[payment.currency];
    if (filters.minAmount !== "" && amount < Number(filters.minAmount))
      return false;
    if (filters.maxAmount !== "" && amount > Number(filters.maxAmount))
      return false;
    if (filters.datePreset !== "all") {
      const date = localDate(payment.createdAt);
      if (date < from || date > to) return false;
    }
    return true;
  });
}
