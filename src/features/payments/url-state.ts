import { CURRENCY_EXPONENTS, PAYMENT_STATUSES } from "./types.ts";
import {
  validateFilters,
  type DatePreset,
  type PageSize,
  type SortKey,
} from "./query.ts";
import { initialPaymentsState, type PaymentsState } from "./state.ts";

function selected<T extends string>(
  params: URLSearchParams,
  key: string,
  allowed: readonly T[],
): T[] {
  const values = params.getAll(key).flatMap((value) => value.split(","));
  return allowed.filter((value) => values.includes(value));
}
export function parsePaymentsUrl(params: URLSearchParams): PaymentsState {
  const state = initialPaymentsState();
  state.filters.search = (params.get("q") ?? "").slice(0, 200);
  state.filters.statuses = selected(params, "status", PAYMENT_STATUSES);
  state.filters.methods = selected(params, "method", [
    "card",
    "ach",
    "wallet",
  ] as const);
  state.filters.currencies = selected(
    params,
    "currency",
    Object.keys(CURRENCY_EXPONENTS) as (keyof typeof CURRENCY_EXPONENTS)[],
  );
  const preset = params.get("date") ?? "all";
  if (["all", "today", "7days", "30days", "custom"].includes(preset))
    state.filters.datePreset = preset as DatePreset;
  state.filters.startDate = params.get("from") ?? "";
  state.filters.endDate = params.get("to") ?? "";
  if (validateFilters(state.filters)) {
    state.filters.datePreset = "all";
    state.filters.startDate = "";
    state.filters.endDate = "";
  }
  state.filters.minAmount = params.get("min") ?? "";
  state.filters.maxAmount = params.get("max") ?? "";
  if (validateFilters(state.filters)) {
    state.filters.minAmount = "";
    state.filters.maxAmount = "";
  }
  const sort = params.get("sort");
  if (sort && ["createdAt", "amountMinor", "status"].includes(sort))
    state.sort.key = sort as SortKey;
  if (params.get("direction") === "asc" || params.get("direction") === "desc")
    state.sort.direction = params.get("direction") as "asc" | "desc";
  const size = Number(params.get("size"));
  if ([25, 50, 100].includes(size)) state.pageSize = size as PageSize;
  const page = params.get("page") ?? "1";
  if (/^\d{1,5}$/.test(page)) state.page = Math.max(1, Number(page));
  return state;
}
export function serializePaymentsUrl(
  state: PaymentsState,
  referenceTime: string,
) {
  const params = new URLSearchParams();
  const { filters, sort, page, pageSize } = state;
  params.set("at", referenceTime);
  if (filters.search) params.set("q", filters.search);
  if (filters.statuses.length) params.set("status", filters.statuses.join(","));
  if (filters.methods.length) params.set("method", filters.methods.join(","));
  if (filters.currencies.length)
    params.set("currency", filters.currencies.join(","));
  if (filters.datePreset !== "all") params.set("date", filters.datePreset);
  if (filters.datePreset === "custom") {
    params.set("from", filters.startDate);
    params.set("to", filters.endDate);
  }
  if (filters.minAmount) params.set("min", filters.minAmount);
  if (filters.maxAmount) params.set("max", filters.maxAmount);
  if (sort.key !== "createdAt" || sort.direction !== "desc") {
    params.set("sort", sort.key);
    params.set("direction", sort.direction);
  }
  if (pageSize !== 25) params.set("size", String(pageSize));
  if (page > 1) params.set("page", String(page));
  return params.toString();
}
