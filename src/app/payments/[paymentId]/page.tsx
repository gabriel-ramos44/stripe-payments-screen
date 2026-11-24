import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  CircleCheck,
  Clock3,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { StatusBadge } from "@/components/ui/primitives";
import { getPaymentsData } from "@/features/payments/data";
import { formatAmount, formatCreated } from "@/features/payments/format";
import styles from "@/features/payments/components/details.module.css";
export const metadata: Metadata = { title: "Payment details" };

export default async function PaymentDetailsPage({
  params,
  searchParams,
}: PageProps<"/payments/[paymentId]">) {
  const { paymentId } = await params;
  const query = await searchParams;
  const { payments } = getPaymentsData(
    typeof query.at === "string" ? query.at : undefined,
  );
  const payment = payments.find((record) => record.id === paymentId);
  if (!payment) notFound();
  const back =
    typeof query.returnTo === "string" &&
    (query.returnTo === "/payments" || query.returnTo.startsWith("/payments?"))
      ? query.returnTo
      : "/payments";
  const method = payment.method;
  const methodLabel =
    method.type === "ach"
      ? `ACH · ${method.bankName}`
      : `${method.type === "wallet" ? `${method.wallet === "apple_pay" ? "Apple Pay" : "Google Pay"} · ` : ""}${method.brand}`;
  const Icon =
    payment.status === "failed"
      ? XCircle
      : payment.status === "pending"
        ? Clock3
        : payment.status === "refunded"
          ? RotateCcw
          : CircleCheck;
  return (
    <DashboardShell>
      <section className={styles.details} aria-labelledby="payment-title">
        <Link href={back} className={styles.back}>
          <ArrowLeft size={14} />
          Back to payments
        </Link>
        <div className={styles.title}>
          <span className={styles.symbol}>
            <CreditCard />
          </span>
          <div>
            <p>Payment</p>
            <h2 id="payment-title">
              {formatAmount(payment.amountMinor, payment.currency)}{" "}
              <span>{payment.currency}</span>
            </h2>
          </div>
          <StatusBadge status={payment.status} />
        </div>
        <p className={styles.id}>{payment.id}</p>
        <div className={styles.grid}>
          <section className={styles.panel}>
            <h3>Payment details</h3>
            <dl>
              {[
                ["Customer", payment.customer.name],
                ["Email", payment.customer.email],
                [
                  "Created",
                  `${formatCreated(payment.createdAt)} · Brasília time`,
                ],
                ["Payment method", `${methodLabel} ending in ${method.last4}`],
                ["Description", payment.description],
                [
                  "Failure reason",
                  payment.failureReason?.replaceAll("_", " ") ?? "—",
                ],
                [
                  "Refunded",
                  payment.refundedAt ? formatCreated(payment.refundedAt) : "—",
                ],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className={styles.panel}>
            <h3>Timeline</h3>
            <ol className={styles.timeline}>
              <li>
                <CreditCard size={16} />
                <div>
                  <strong>Payment created</strong>
                  <time dateTime={payment.createdAt}>
                    {formatCreated(payment.createdAt)}
                  </time>
                </div>
              </li>
              <li>
                <Icon size={16} />
                <div>
                  <strong>
                    {payment.status === "pending"
                      ? "Payment processing"
                      : payment.status === "failed"
                        ? "Payment failed"
                        : "Payment succeeded"}
                  </strong>
                  <time dateTime={payment.createdAt}>
                    {formatCreated(payment.createdAt)}
                  </time>
                  <p>
                    {payment.status === "pending"
                      ? "Awaiting confirmation from the payment provider."
                      : payment.status === "failed"
                        ? payment.failureReason?.replaceAll("_", " ")
                        : "Payment was successfully processed."}
                  </p>
                </div>
              </li>
              {payment.refundedAt && (
                <li>
                  <RotateCcw size={16} />
                  <div>
                    <strong>Payment refunded</strong>
                    <time dateTime={payment.refundedAt}>
                      {formatCreated(payment.refundedAt)}
                    </time>
                  </div>
                </li>
              )}
            </ol>
          </section>
        </div>
        <section className={styles.panel}>
          <h3>Metadata</h3>
          <dl>
            <div>
              <dt>Payment ID</dt>
              <dd>{payment.id}</dd>
            </div>
            <div>
              <dt>Customer ID</dt>
              <dd>{payment.customer.id}</dd>
            </div>
            <div>
              <dt>Environment</dt>
              <dd>Test · Synthetic data</dd>
            </div>
            <div>
              <dt>Currency</dt>
              <dd>{payment.currency}</dd>
            </div>
            <div>
              <dt>Dispute</dt>
              <dd>{payment.disputed ? "Open" : "None"}</dd>
            </div>
            <div>
              <dt>Capture status</dt>
              <dd>{payment.captureState.replaceAll("_", " ")}</dd>
            </div>
          </dl>
        </section>
      </section>
    </DashboardShell>
  );
}
