"use client";

import { useMemo, useReducer } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Input, Button } from "@/components/ui/primitives";
import type { Payment } from "../types";
import {
  filterPayments,
  sortPayments,
  paginatePayments,
  type PaymentFilters,
} from "../query";
import { initialPaymentsState, paymentsReducer } from "../state";
import { PaymentsTable } from "./payments-table";
import { PaymentsFilters } from "./payments-filters";
import { PaymentsPagination } from "./payments-pagination";
import styles from "./payments.module.css";

export function PaymentsWorkspace({
  payments,
  referenceTime,
}: {
  payments: Payment[];
  referenceTime: string;
}) {
  const [{ filters, sort, page, pageSize }, dispatch] = useReducer(
    paymentsReducer,
    undefined,
    initialPaymentsState,
  );
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
      />
      {filtered.length ? (
        <PaymentsTable
          payments={pagination.rows}
          referenceTime={referenceTime}
          sort={sort}
          onSort={(key) => dispatch({ type: "sort", key })}
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
