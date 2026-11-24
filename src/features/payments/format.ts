import { CURRENCY_EXPONENTS, type Currency } from "./types.ts";

export const PAYMENT_TIME_ZONE = "America/Sao_Paulo";
const dateFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: PAYMENT_TIME_ZONE,
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
});
const currencyFormats = new Map<Currency, Intl.NumberFormat>();
export function formatAmount(amountMinor: number, currency: Currency) {
  let formatter = currencyFormats.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat("en-US", { style: "currency", currency });
    currencyFormats.set(currency, formatter);
  }
  return formatter.format(amountMinor / 10 ** CURRENCY_EXPONENTS[currency]);
}
export function formatCreated(value: string) {
  return dateFormat.format(new Date(value));
}
export function formatRelative(value: string, reference: string) {
  const seconds = (Date.parse(value) - Date.parse(reference)) / 1000;
  const format = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  for (const [unit, size] of [
    ["year", 31536000],
    ["month", 2592000],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ] as const) {
    if (Math.abs(seconds) >= size)
      return format.format(Math.round(seconds / size), unit);
  }
  return format.format(Math.round(seconds), "second");
}
