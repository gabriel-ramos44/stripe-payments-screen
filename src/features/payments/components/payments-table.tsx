"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Copy, Landmark, Wallet } from "lucide-react";
import { Ellipsis, X } from "@/components/ui/stripe-icons";
import {
  Button,
  Menu,
  MenuItem,
  StatusBadge,
  Tooltip,
} from "@/components/ui/primitives";
import type { Payment } from "../types";
import {
  formatAmount,
  formatCreated,
  formatRelative,
  formatShortDate,
} from "../format";
import type { PaymentSort, SortKey } from "../query";
import { columnDefinition, type ColumnId, type ColumnWidths } from "../columns";
import { ColumnHeader } from "./column-header";
import styles from "./payments.module.css";

export function PaymentsTable({
  payments,
  referenceTime,
  sort,
  onSort,
  returnTo = "/payments",
  columnOrder,
  columnWidths,
  onColumnMove,
  onColumnResize,
}: {
  payments: readonly Payment[];
  referenceTime: string;
  sort: PaymentSort;
  onSort: (key: SortKey, direction?: PaymentSort["direction"]) => void;
  returnTo?: string;
  columnOrder: ColumnId[];
  columnWidths: ColumnWidths;
  onColumnMove: (source: ColumnId, target: ColumnId) => void;
  onColumnResize: (id: ColumnId, width: number) => void;
}) {
  const router = useRouter();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [copyFailed, setCopyFailed] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const selectAll = useRef<HTMLInputElement>(null);
  const selectedCount = payments.filter((payment) =>
    selected.has(payment.id),
  ).length;
  const tableWidth = 66 + columnOrder.reduce(
    (sum, id) => sum + (columnWidths[id] ?? columnDefinition(id).width),
    0,
  );
  useEffect(() => {
    if (selectAll.current)
      selectAll.current.indeterminate =
        selectedCount > 0 && selectedCount < payments.length;
  }, [selectedCount, payments.length]);
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
  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
      {selectedCount > 0 && (
        <div className={styles.selectionBar}>
          <span role="status">{selectedCount} selected on this page</span>
          <Button variant="ghost" onClick={() => setSelected(new Set())}>
            Clear selection
          </Button>
        </div>
      )}
      <div
        className={styles.tableScroll}
        role="region"
        aria-label="Payments table, scroll horizontally for more columns"
        tabIndex={0}
      >
        <table
          className={styles.table}
          style={{
            // Keep compact columns stable; only Customer absorbs spare space.
            width: columnWidths.customer ? tableWidth : `max(100%, ${tableWidth}px)`,
          }}
        >
          <caption className="sr-only">
            Payments. Date is the creation time in Brasilia time. Sorted by{" "}
            {sort.key === "amountMinor"
              ? "amount"
              : sort.key === "createdAt"
                ? "date"
                : "status"}
            , {sort.direction === "asc" ? "ascending" : "descending"}.
          </caption>
          <colgroup>
            <col style={{ width: 34 }} />
            {columnOrder.map((id) => (
              <col
                key={id}
                style={{
                  width: id === "customer" && !columnWidths.customer
                    ? undefined
                    : columnWidths[id] ?? columnDefinition(id).width,
                }}
              />
            ))}
            <col style={{ width: 32 }} />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className={styles.selectCell}>
                <input
                  ref={selectAll}
                  type="checkbox"
                  aria-label="Select all payments on this page"
                  checked={
                    payments.length > 0 && selectedCount === payments.length
                  }
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setSelected((current) => {
                      const next = new Set(current);
                      for (const payment of payments)
                        if (checked) next.add(payment.id);
                        else next.delete(payment.id);
                      return next;
                    });
                  }}
                />
              </th>
              {columnOrder.map((id) => (
                <ColumnHeader
                  key={id}
                  id={id}
                  order={columnOrder}
                  sort={sort}
                  onSort={onSort}
                  onMove={onColumnMove}
                  onResize={onColumnResize}
                  width={columnWidths[id] ?? columnDefinition(id).width}
                />
              ))}
              <th scope="col" className={styles.rowActions}>
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => {
              const href = `/payments/${encodeURIComponent(payment.id)}?at=${encodeURIComponent(referenceTime)}&returnTo=${encodeURIComponent(returnTo)}`;
              const decline =
                payment.failureReason === "insufficient_funds"
                  ? "Insufficient funds"
                  : payment.failureReason === "expired_card"
                    ? "Expired card"
                    : payment.failureReason
                      ? "Transaction declined"
                      : "\u2014";
              const cells = {
                amount: (
                  <div className={styles.amountGroup}>
                    <span className={styles.money}>
                      {formatAmount(payment.amountMinor, payment.currency)}
                    </span>
                    <span className={styles.currency}>{payment.currency}</span>
                    <span data-payment-status={payment.status}>
                      <StatusBadge status={payment.status} />
                    </span>
                  </div>
                ),
                method: <PaymentMethodCell method={payment.method} />,
                description: payment.description,
                customer: (
                  <span className={styles.email} title={payment.customer.email}>
                    {payment.customer.email}
                  </span>
                ),
                created: (
                  <CreatedDate
                    value={payment.createdAt}
                    referenceTime={referenceTime}
                  />
                ),
                refunded: payment.refundedAt ? (
                  <time
                    dateTime={payment.refundedAt}
                    title={formatCreated(payment.refundedAt)}
                  >
                    {formatShortDate(payment.refundedAt)}
                  </time>
                ) : (
                  "\u2014"
                ),
                decline: <span title={decline}>{decline}</span>,
                id: (
                  <div className={styles.paymentId}>
                    <Link
                      href={href}
                      title={payment.id}
                      aria-label={`View payment ${payment.id}`}
                      className={styles.idText}
                    >
                      {payment.id.slice(0, 12)}
                      {"\u2026"}
                      {payment.id.slice(-4)}
                    </Link>
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
                ),
              };
              return (
                <tr
                  key={payment.id}
                  className={
                    selected.has(payment.id) ? styles.selectedRow : undefined
                  }
                >
                  <td className={styles.selectCell}>
                    <input
                      type="checkbox"
                      aria-label={`Select payment ${payment.id}`}
                      checked={selected.has(payment.id)}
                      onChange={() => toggle(payment.id)}
                    />
                  </td>
                  {columnOrder.map((id) => (
                    <td
                      data-column={id}
                      key={id}
                      className={id === "amount" ? styles.amount : styles.muted}
                    >
                      {cells[id]}
                    </td>
                  ))}
                  <td className={styles.rowActions}>
                    <Menu
                      label={`Payment actions ${payment.id}`}
                      trigger={
                        <Button
                          variant="ghost"
                          iconOnly
                          aria-label={`Actions for payment ${payment.id}`}
                        >
                          <Ellipsis aria-hidden="true" />
                        </Button>
                      }
                    >
                      <MenuItem onSelect={() => router.push(href)}>
                        View payment details
                      </MenuItem>
                      <MenuItem onSelect={() => void copyId(payment.id)}>
                        Copy payment ID
                      </MenuItem>
                      <MenuItem onSelect={() => toggle(payment.id)}>
                        {selected.has(payment.id)
                          ? "Deselect payment"
                          : "Select payment"}
                      </MenuItem>
                    </Menu>
                  </td>
                </tr>
              );
            })}
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
    <span className={styles.method} title={`${accessibleName} ending in ${method.last4}`}>
      <span className="sr-only">
        {accessibleName} ending in {method.last4}
      </span>
      {method.type === "wallet" && (
        <span className={styles.walletLogo} aria-hidden="true">
          <Wallet size={11} />
        </span>
      )}
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

    </span>
  );
}
