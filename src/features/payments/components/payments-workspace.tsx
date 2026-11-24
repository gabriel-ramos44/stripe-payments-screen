"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Input, Button } from "@/components/ui/primitives";
import type { Payment } from "../types";
import {
  filterPayments,
  sortPayments,
  paginatePayments,
  type PaymentFilters,
} from "../query";
import {
  paymentsReducer,
  type PaymentsState,
  type PaymentsAction,
} from "../state";
import { parsePaymentsUrl, serializePaymentsUrl } from "../url-state";
import { PaymentsTable } from "./payments-table";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsPagination } from "./payments-pagination";
import { ColumnSettings } from "./column-settings";
import {
  defaultColumnOrder,
  reorderColumns,
  resizeColumn,
  type ColumnId,
  type ColumnWidths,
} from "../columns";
import styles from "./payments.module.css";

export function PaymentsWorkspace({
  payments,
  referenceTime,
  initialState,
}: {
  payments: Payment[];
  referenceTime: string;
  initialState: PaymentsState;
}) {
  const [state, rawDispatch] = useReducer(paymentsReducer, initialState);
  const { filters, sort, page, pageSize } = state;
  const [columnOrder, setColumnOrder] = useState(defaultColumnOrder);
  const [columnWidths, setColumnWidths] = useState<ColumnWidths>({});
  const [columnNotice, setColumnNotice] = useState("");
  const moveColumn = (source: ColumnId, target: ColumnId) => {
    setColumnOrder((order) => reorderColumns(order, source, target));
    setColumnNotice(`Moved ${source} column to the ${target} position.`);
  };
  const changeColumnWidth = (id: ColumnId, width: number) =>
    setColumnWidths((widths) => ({ ...widths, [id]: resizeColumn(id, width) }));
  const dispatch = (action: PaymentsAction) => {
    const next = paymentsReducer(state, action);
    const url = `/payments?${serializePaymentsUrl(next, referenceTime)}`;
    if (action.type === "filters" && action.filters.search !== filters.search)
      window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
    rawDispatch(action);
  };
  useEffect(() => {
    const restore = () =>
      rawDispatch({
        type: "restore",
        state: parsePaymentsUrl(new URLSearchParams(window.location.search)),
      });
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, []);
  const setFilters = (filters: PaymentFilters) =>
    dispatch({ type: "filters", filters });
  const reset = () => dispatch({ type: "reset" });
  const filtered = useMemo(
    () => filterPayments(payments, filters, referenceTime),
    [payments, filters, referenceTime],
  );
  const sorted = useMemo(() => sortPayments(filtered, sort), [filtered, sort]);
  const pagination = paginatePayments(sorted, page, pageSize);
  return (
    <DashboardShell
      search={
        <Input
          type="search"
          maxLength={200}
          aria-label="Search payments by ID, email or last 4 digits"
          placeholder="Search by ID, email or last 4 digits"
          value={filters.search}
          onChange={(event) =>
            setFilters({ ...filters, search: event.target.value })
          }
        />
      }
    >
      <PaymentsFilters
        filters={filters}
        onChange={setFilters}
        onReset={reset}
        columnControls={
          <ColumnSettings
            order={columnOrder}
            widths={columnWidths}
            onMove={moveColumn}
            onResize={changeColumnWidth}
            onReset={() => {
              setColumnOrder(defaultColumnOrder());
              setColumnWidths({});
              setColumnNotice("Columns reset to the default order and widths.");
            }}
          />
        }
      />
      <p className="sr-only" role="status">
        {columnNotice}
      </p>
      {filtered.length ? (
        <PaymentsTable
          payments={pagination.rows}
          referenceTime={referenceTime}
          sort={sort}
          onSort={(key) => dispatch({ type: "sort", key })}
          returnTo={`/payments?${serializePaymentsUrl(state, referenceTime)}`}
          columnOrder={columnOrder}
          columnWidths={columnWidths}
          onColumnMove={moveColumn}
          onColumnResize={changeColumnWidth}
        />
      ) : (
        <section className={styles.empty}>
          <h2>No payments found</h2>
          <p>Try another search or adjust your filters.</p>
          <Button onClick={reset}>Clear all filters</Button>
        </section>
      )}
      <PaymentsPagination
        page={pagination.currentPage}
        pageCount={pagination.pageCount}
        first={pagination.first}
        last={pagination.last}
        total={filtered.length}
        pageSize={pageSize}
        onPageChange={(page) => dispatch({ type: "page", page })}
        onPageSizeChange={(size) => dispatch({ type: "pageSize", size })}
      />
    </DashboardShell>
  );
}
