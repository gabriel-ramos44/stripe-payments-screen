import Link from "next/link";
export default function PaymentNotFound() {
  return (
    <main style={{ padding: "48px", maxWidth: "640px", margin: "auto" }}>
      <h1>Payment not found</h1>
      <p>This payment does not exist in the mock dataset.</p>
      <Link href="/payments">Back to payments</Link>
    </main>
  );
}
