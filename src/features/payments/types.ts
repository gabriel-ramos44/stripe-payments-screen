export const PAYMENT_STATUSES = [
  "succeeded",
  "pending",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];
export const CURRENCY_EXPONENTS = {
  USD: 2,
  GBP: 2,
  EUR: 2,
  BRL: 2,
  JPY: 0,
} as const;
export type Currency = keyof typeof CURRENCY_EXPONENTS;
export type CardBrand = "visa" | "mastercard" | "amex";
export type PaymentMethod =
  | { type: "card"; brand: CardBrand; last4: string }
  | { type: "ach"; bankName: string; last4: string }
  | {
      type: "wallet";
      wallet: "apple_pay" | "google_pay";
      brand: CardBrand;
      last4: string;
    };

export type Payment = {
  id: string;
  customer: { id: string; name: string; email: string };
  /** Integer in the currency's smallest supported unit; JPY has exponent zero. */
  amountMinor: number;
  currency: Currency;
  status: PaymentStatus;
  disputed: boolean;
  captureState: "captured" | "uncaptured" | "not_applicable";
  method: PaymentMethod;
  createdAt: string;
  description: string;
  refundedAt: string | null;
  failureReason: "insufficient_funds" | "card_declined" | "expired_card" | null;
};
