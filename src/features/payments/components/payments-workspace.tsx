"use client";

import { useMemo, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Input, Button } from "@/components/ui/primitives";
import type { Payment } from "../types";
import { emptyFilters, filterPayments } from "../query";
import { PaymentsTable } from "./payments-table";
import { PaymentsFilters } from "./payments-filters";
import styles from "./payments.module.css";

export function PaymentsWorkspace({
  payments,
  referenceTime,
}: {
  payments: Payment[];
  referenceTime: string;
}) {
  const [filters, setFilters] = useState(emptyFilters);
  const filtered = useMemo(
    () => filterPayments(payments, filters, referenceTime),
    [payments, filters, referenceTime],
  );
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
        onReset={() => setFilters(emptyFilters())}
      />
      <p className={styles.results} role="status">
        {filtered.length} matching payments
      </p>
      {filtered.length ? (
        <PaymentsTable
          payments={filtered.slice(0, 25)}
          referenceTime={referenceTime}
        />
      ) : (
        <section className={styles.empty}>
          <h2>No payments found</h2>
          <p>Try another search or adjust your filters.</p>
          <Button onClick={() => setFilters(emptyFilters())}>
            Clear all filters
          </Button>
        </section>
      )}
    </DashboardShell>
  );
}
