import {
  emptyFilters,
  type PaymentFilters,
  type PaymentSort,
  type PageSize,
  type SortKey,
} from "./query.ts";

export type PaymentsState = {
  filters: PaymentFilters;
  sort: PaymentSort;
  page: number;
  pageSize: PageSize;
};
export type PaymentsAction =
  | { type: "restore"; state: PaymentsState }
  | { type: "filters"; filters: PaymentFilters }
  | { type: "reset" }
  | { type: "sort"; key: SortKey }
  | { type: "page"; page: number }
  | { type: "pageSize"; size: PageSize };
export function initialPaymentsState(): PaymentsState {
  return {
    filters: emptyFilters(),
    sort: { key: "createdAt", direction: "desc" },
    page: 1,
    pageSize: 25,
  };
}
export function paymentsReducer(
  state: PaymentsState,
  action: PaymentsAction,
): PaymentsState {
  switch (action.type) {
    case "restore":
      return action.state;
    case "filters":
      return { ...state, filters: action.filters, page: 1 };
    case "reset":
      return { ...state, filters: emptyFilters(), page: 1 };
    case "sort":
      return {
        ...state,
        page: 1,
        sort: {
          key: action.key,
          direction:
            state.sort.key === action.key && state.sort.direction === "asc"
              ? "desc"
              : "asc",
        },
      };
    case "page":
      return { ...state, page: Math.max(1, action.page) };
    case "pageSize":
      return { ...state, pageSize: action.size, page: 1 };
  }
}
