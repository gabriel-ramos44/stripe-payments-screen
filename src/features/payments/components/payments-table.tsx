"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Check,
  Copy,
  Landmark,
  Wallet,
  X,
} from "lucide-react";
import { Button, StatusBadge, Tooltip } from "@/components/ui/primitives";
import type { Payment } from "../types";
import { formatAmount, formatCreated, formatRelative } from "../format";
import type { PaymentSort, SortKey } from "../query";
import styles from "./payments.module.css";

export function PaymentsTable({
  payments,
  referenceTime,
  sort,
  onSort,
}: {
  payments: readonly Payment[];
  referenceTime: string;
  sort: PaymentSort;
  onSort: (key: SortKey) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  useEffect(() => {
    if (!notice || copyFailed) return;
    const timer = window.setTimeout(() => {
      setNotice("");
      setCopiedId(null);
    }, 6000);
    return () => window.clearTimeout(timer);
  }, [notice, copyFailed]);
  async function copyId(id: string) {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setCopyFailed(false);
      setNotice(`Copied payment ID ${id}`);
    } catch {
      setCopiedId(null);
      setCopyFailed(true);
      setNotice(`Could not copy. Select this payment ID manually: ${id}`);
    }
  }
  return (
    <>
      <p role="status" className={notice ? styles.copyNotice : "sr-only"}>
        {notice}
        {copyFailed && notice && (
          <Button
            variant="ghost"
            iconOnly
            aria-label="Dismiss copy error"
            onClick={() => setNotice("")}
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </p>
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Payments table, scroll horizontally for more columns"
        tabIndex={0}
      >
        <table className={styles.table}>
          <caption className="sr-only">
            Payments. Created dates are displayed in Brasília time.
          </caption>
          <thead>
            <tr>
              <SortHeader
                label="Amount"
                column="amountMinor"
                sort={sort}
                onSort={onSort}
              />
              <SortHeader
                label="Status"
                column="status"
                sort={sort}
                onSort={onSort}
              />
              <th scope="col">Payment method</th>
              <th scope="col">Description</th>
              <th scope="col">Customer</th>
              <SortHeader
                label="Created"
                column="createdAt"
                sort={sort}
                onSort={onSort}
              />
              <th scope="col">Payment ID</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className={styles.amount}>
                  {formatAmount(payment.amountMinor, payment.currency)}
                  <span className={styles.currency}>{payment.currency}</span>
                </td>
                <td>
                  <StatusBadge status={payment.status} />
                </td>
                <td>
                  <PaymentMethodCell method={payment.method} />
                </td>
                <td className={styles.muted}>{payment.description}</td>
                <td>
                  <span className={styles.customerName}>
                    {payment.customer.name}
                  </span>
                  <span className={styles.email}>{payment.customer.email}</span>
                </td>
                <td>
                  <CreatedDate
                    value={payment.createdAt}
                    referenceTime={referenceTime}
                  />
                </td>
                <td>
                  <div className={styles.paymentId}>
                    <span
                      title={payment.id}
                      aria-label={payment.id}
                      className={styles.idText}
                    >
                      {payment.id.slice(0, 12)}…{payment.id.slice(-4)}
                    </span>
                    <Button
                      variant="ghost"
                      iconOnly
                      aria-label={`Copy payment ID ${payment.id}`}
                      onClick={() => void copyId(payment.id)}
                    >
                      {copiedId === payment.id ? (
                        <Check aria-hidden="true" />
                      ) : (
                        <Copy aria-hidden="true" />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function CreatedDate({
  value,
  referenceTime,
}: {
  value: string;
  referenceTime: string;
}) {
  const [now, setNow] = useState(referenceTime);
  return (
    <Tooltip
      content={`${formatRelative(value, now)} · Brasília time (America/Sao_Paulo)`}
      onOpenChange={(open) => {
        if (open) setNow(new Date().toISOString());
      }}
    >
      <time tabIndex={0} dateTime={value} className={styles.date}>
        {formatCreated(value)}
      </time>
    </Tooltip>
  );
}

function SortHeader({
  label,
  column,
  sort,
  onSort,
}: {
  label: string;
  column: SortKey;
  sort: PaymentSort;
  onSort: (key: SortKey) => void;
}) {
  const active = sort.key === column;
  const Icon = active
    ? sort.direction === "asc"
      ? ArrowUp
      : ArrowDown
    : ArrowUpDown;
  return (
    <th
      scope="col"
      aria-sort={
        active
          ? sort.direction === "asc"
            ? "ascending"
            : "descending"
          : "none"
      }
    >
      <button
        className={styles.sortButton}
        onClick={() => onSort(column)}
        aria-label={`Sort by ${label.toLowerCase()} ${active && sort.direction === "asc" ? "descending" : "ascending"}`}
      >
        {label}
        <Icon size={12} aria-hidden="true" />
      </button>
    </th>
  );
}

function PaymentMethodCell({ method }: { method: Payment["method"] }) {
  const brand = method.type === "ach" ? null : method.brand;
  const provider =
    method.type === "ach"
      ? "ACH"
      : method.type === "wallet"
        ? method.wallet === "apple_pay"
          ? "Apple Pay"
          : "Google Pay"
        : null;
  const accessibleName =
    method.type === "ach"
      ? `ACH, ${method.bankName}`
      : [provider, brand].filter(Boolean).join(", ");
  return (
    <span className={styles.method}>
      <span className="sr-only">
        {accessibleName} ending in {method.last4}
      </span>
      <span
        aria-hidden="true"
        className={`${styles.brand} ${brand ? styles[brand] : ""}`}
      >
        {brand === "visa" ? (
          <span className={styles.visaMark}>VISA</span>
        ) : brand === "mastercard" ? (
          <svg viewBox="0 0 24 16" width="20" height="14">
            <circle cx="9" cy="8" r="6" fill="#eb3b2f" />
            <circle cx="15" cy="8" r="6" fill="#f8a41c" fillOpacity=".9" />
          </svg>
        ) : brand === "amex" ? (
          <span className={styles.amexMark}>AMEX</span>
        ) : (
          <Landmark size={12} />
        )}
      </span>
      <span aria-hidden="true">
        {"\u2022".repeat(4)} {method.last4}
      </span>
      {provider && (
        <span className={styles.methodName} aria-hidden="true">
          {method.type === "wallet" && <Wallet size={11} />}
          {provider}
        </span>
      )}
    </span>
  );
}
