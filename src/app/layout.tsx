import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/inter/latin-700.css";

export const metadata: Metadata = {
  title: {
    default: "Payments | Chargeblast assessment",
    template: "%s | Chargeblast assessment",
  },
  description:
    "Search, filter and review synthetic payments in the Chargeblast front-end assessment.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
