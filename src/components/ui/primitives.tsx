"use client";

import * as Dropdown from "@radix-ui/react-dropdown-menu";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { Check, Clock3, RotateCcw, X } from "lucide-react";
import { forwardRef, type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactElement, type ReactNode } from "react";
import styles from "./ui.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "primary" | "ghost"; iconOnly?: boolean };
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = "default", iconOnly = false, className = "", type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={[styles.button, variant !== "default" ? styles[variant] : "", iconOnly ? styles.icon : "", className].join(" ")} {...props} />;
});
export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(function Input({ className = "", ...props }, ref) {
  return <input ref={ref} className={`${styles.input} ${className}`} {...props} />;
});
export type BadgeStatus = "succeeded" | "pending" | "failed" | "refunded";
const statusPresentation = {
  succeeded: { label: "Succeeded", Icon: Check }, pending: { label: "Pending", Icon: Clock3 },
  failed: { label: "Failed", Icon: X }, refunded: { label: "Refunded", Icon: RotateCcw },
} as const;
export function StatusBadge({ status }: { status: BadgeStatus }) {
  const { label, Icon } = statusPresentation[status];
  return <span className={`${styles.badge} ${styles[status]}`}>{label}<Icon aria-hidden="true" /></span>;
}
export function Tooltip({ children, content }: { children: ReactElement; content: ReactNode }) {
  return <TooltipPrimitive.Provider delayDuration={350}><TooltipPrimitive.Root><TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger><TooltipPrimitive.Portal><TooltipPrimitive.Content className={styles.tooltip} sideOffset={6}>{content}</TooltipPrimitive.Content></TooltipPrimitive.Portal></TooltipPrimitive.Root></TooltipPrimitive.Provider>;
}
export function Menu({ trigger, label, children }: { trigger: ReactElement; label: string; children: ReactNode }) {
  return <Dropdown.Root><Dropdown.Trigger asChild>{trigger}</Dropdown.Trigger><Dropdown.Portal><Dropdown.Content aria-label={label} className={styles.overlay} align="start" sideOffset={7}>{children}</Dropdown.Content></Dropdown.Portal></Dropdown.Root>;
}
export function MenuItem({ children, onSelect, disabled = false }: { children: ReactNode; onSelect?: () => void; disabled?: boolean }) {
  return <Dropdown.Item className={styles.item} disabled={disabled} {...(onSelect ? { onSelect } : {})}>{children}</Dropdown.Item>;
}
export function MenuLabel({ children }: { children: ReactNode }) { return <Dropdown.Label className={styles.label}>{children}</Dropdown.Label>; }
export function MenuSeparator() { return <Dropdown.Separator className={styles.separator} />; }
export function Popover({ trigger, label, children }: { trigger: ReactElement; label: string; children: ReactNode }) {
  return <PopoverPrimitive.Root><PopoverPrimitive.Trigger asChild>{trigger}</PopoverPrimitive.Trigger><PopoverPrimitive.Portal><PopoverPrimitive.Content aria-label={label} className={`${styles.overlay} ${styles.popover}`} sideOffset={7} align="start">{children}</PopoverPrimitive.Content></PopoverPrimitive.Portal></PopoverPrimitive.Root>;
}
