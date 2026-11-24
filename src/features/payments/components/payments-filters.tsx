"use client";

import { useId, useState, type ReactNode } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  CreditCard,
  Download,
  PlusCircle,
  X,
} from "lucide-react";
import { Button, Input, Popover } from "@/components/ui/primitives";
import {
  CURRENCY_EXPONENTS,
  PAYMENT_STATUSES,
  type Currency,
  type Payment,
} from "../types";
import {
  validateFilters,
  type DatePreset,
  type PaymentFilters,
} from "../query";
import styles from "./payments.module.css";

const labels = {
  succeeded: "Succeeded",
  pending: "Pending",
  failed: "Failed",
  refunded: "Refunded",
  card: "Card",
  ach: "ACH",
  wallet: "Wallet",
};
export function PaymentsFilters({
  filters,
  onChange,
  onReset,
  columnControls,
  onExport,
  exportCount,
}: {
  filters: PaymentFilters;
  onChange: (filters: PaymentFilters) => void;
  onReset: () => void;
  columnControls: ReactNode;
  onExport: () => void;
  exportCount: number;
}) {
  return (
    <>
      <div className={styles.summaries} aria-label="Payment views">
        {["all", ...PAYMENT_STATUSES].map((status) => {
          const active =
            status === "all"
              ? !filters.statuses.length
              : filters.statuses.length === 1 && filters.statuses[0] === status;
          return (
            <button
              key={status}
              aria-pressed={active}
              className={active ? styles.activeSummary : ""}
              onClick={() =>
                onChange({
                  ...filters,
                  statuses:
                    status === "all" ? [] : [status as Payment["status"]],
                })
              }
            >
              {status === "all" ? "All" : labels[status as Payment["status"]]}
            </button>
          );
        })}
      </div>
      <div className={styles.toolbar}>
        <div className={styles.filterButtons}>
          <Popover
            label="Date and time filter"
            trigger={
              <Button
                className={
                  filters.datePreset !== "all" ? styles.activeFilter : ""
                }
              >
                <CalendarDays />
                Date and time{filters.datePreset !== "all" && " •"}
              </Button>
            }
          >
            <DateFilter filters={filters} onChange={onChange} />
          </Popover>
          <Popover
            label="Amount filter"
            trigger={
              <Button
                className={
                  filters.minAmount || filters.maxAmount
                    ? styles.activeFilter
                    : ""
                }
              >
                <CircleDollarSign />
                Amount{(filters.minAmount || filters.maxAmount) && " •"}
              </Button>
            }
          >
            <AmountFilter filters={filters} onChange={onChange} />
          </Popover>
          <Popover
            label="Currency filter"
            trigger={
              <Button
                className={filters.currencies.length ? styles.activeFilter : ""}
              >
                <PlusCircle />
                Currency
                {filters.currencies.length
                  ? ` (${filters.currencies.length})`
                  : ""}
              </Button>
            }
          >
            <MultiSelect
              legend="Currency"
              options={Object.keys(CURRENCY_EXPONENTS) as Currency[]}
              selected={filters.currencies}
              label={(value) => value}
              onChange={(currencies) => onChange({ ...filters, currencies })}
            />
          </Popover>
          <Popover
            label="Status filter"
            trigger={
              <Button
                className={filters.statuses.length ? styles.activeFilter : ""}
              >
                <PlusCircle />
                Status
                {filters.statuses.length ? ` (${filters.statuses.length})` : ""}
              </Button>
            }
          >
            <MultiSelect
              legend="Status"
              options={PAYMENT_STATUSES}
              selected={filters.statuses}
              label={(value) => labels[value]}
              onChange={(statuses) => onChange({ ...filters, statuses })}
            />
          </Popover>
          <Popover
            label="Payment method filter"
            trigger={
              <Button
                className={filters.methods.length ? styles.activeFilter : ""}
              >
                <CreditCard />
                Payment method
                {filters.methods.length ? ` (${filters.methods.length})` : ""}
              </Button>
            }
          >
            <MultiSelect
              legend="Payment method"
              options={["card", "ach", "wallet"] as const}
              selected={filters.methods}
              label={(value) => labels[value]}
              onChange={(methods) => onChange({ ...filters, methods })}
            />
          </Popover>
          <Button variant="ghost" onClick={onReset}>
            <X />
            Reset
          </Button>
        </div>
        <div className={styles.tableActions}>
          <Button
            disabled={exportCount === 0}
            onClick={onExport}
            title={`Export all ${exportCount} filtered results across pages`}
          >
            <Download />
            Export
          </Button>
          {columnControls}
        </div>
      </div>
    </>
  );
}

function MultiSelect<T extends string>({
  legend,
  options,
  selected,
  label,
  onChange,
}: {
  legend: string;
  options: readonly T[];
  selected: T[];
  label: (value: T) => string;
  onChange: (selected: T[]) => void;
}) {
  return (
    <fieldset className={styles.fieldset}>
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option} className={styles.checkLabel}>
          <input
            type="checkbox"
            checked={selected.includes(option)}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? [...selected, option]
                  : selected.filter((value) => value !== option),
              )
            }
          />
          {label(option)}
        </label>
      ))}
      <Button variant="ghost" onClick={() => onChange([])}>
        Clear selection
      </Button>
    </fieldset>
  );
}
function DateFilter({
  filters,
  onChange,
}: {
  filters: PaymentFilters;
  onChange: (filters: PaymentFilters) => void;
}) {
  const [preset, setPreset] = useState(filters.datePreset);
  const [startDate, setStartDate] = useState(filters.startDate);
  const [endDate, setEndDate] = useState(filters.endDate);
  const [error, setError] = useState<string | null>(null);
  const id = useId();
  return (
    <form
      className={styles.filterForm}
      onSubmit={(event) => {
        event.preventDefault();
        const next = { ...filters, datePreset: preset, startDate, endDate };
        const error = validateFilters(next);
        setError(error);
        if (!error) onChange(next);
      }}
    >
      <strong>Date and time</strong>
      <label htmlFor={`${id}-preset`}>Date range</label>
      <select
        id={`${id}-preset`}
        value={preset}
        onChange={(event) => setPreset(event.target.value as DatePreset)}
      >
        {[
          ["all", "All time"],
          ["today", "Today"],
          ["7days", "7 days"],
          ["30days", "30 days"],
          ["custom", "Custom"],
        ].map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {preset === "custom" && (
        <>
          <label>
            Start date
            <Input
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </label>
          <label>
            End date
            <Input
              aria-invalid={Boolean(error)}
              aria-describedby={error ? `${id}-error` : undefined}
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              required
            />
          </label>
        </>
      )}
      <p className={styles.hint}>
        Calendar dates in Brasília time. Presets include today.
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <Button type="submit" variant="primary">
        Apply dates
      </Button>
    </form>
  );
}
function AmountFilter({
  filters,
  onChange,
}: {
  filters: PaymentFilters;
  onChange: (filters: PaymentFilters) => void;
}) {
  const [minAmount, setMinAmount] = useState(filters.minAmount);
  const [maxAmount, setMaxAmount] = useState(filters.maxAmount);
  const id = useId();
  const [error, setError] = useState<string | null>(null);
  return (
    <form
      className={styles.filterForm}
      onSubmit={(event) => {
        event.preventDefault();
        const next = { ...filters, minAmount, maxAmount };
        const error = validateFilters(next);
        setError(error);
        if (!error) onChange(next);
      }}
    >
      <strong>Amount range</strong>
      <label>
        Minimum amount
        <Input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          inputMode="decimal"
          value={minAmount}
          onChange={(event) => setMinAmount(event.target.value)}
          placeholder="No minimum"
        />
      </label>
      <label>
        Maximum amount
        <Input
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          inputMode="decimal"
          value={maxAmount}
          onChange={(event) => setMaxAmount(event.target.value)}
          placeholder="No maximum"
        />
      </label>
      <p className={styles.hint}>
        Inclusive amounts in each currency. No exchange-rate conversion. Use
        Currency to compare one currency.
      </p>
      {error && (
        <p id={`${id}-error`} role="alert" className={styles.error}>
          {error}
        </p>
      )}
      <Button variant="primary" type="submit">
        Apply amount
      </Button>
    </form>
  );
}
