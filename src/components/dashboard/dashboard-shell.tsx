"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Activity,
  Check,
  ExternalLink,
  Layers,
  Menu as MenuIcon,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  ArrowDownUp,
  Bell,
  BookOpen,
  Box,
  ChartNoAxesCombined,
  ChevronDown,
  Clock3,
  CircleHelp,
  Code2,
  CreditCard,
  Ellipsis,
  House,
  Plus,
  Search,
  Settings,
  Users,
  Wallet,
  X,
  type StripeIconProps,
} from "@/components/ui/stripe-icons";
import {
  Button,
  Input,
  Menu,
  MenuItem,
  MenuLabel,
  MenuSeparator,
  Popover,
  Tooltip,
} from "@/components/ui/primitives";
import styles from "./dashboard.module.css";

type NavigationItem = {
  label: string;
  icon: ComponentType<StripeIconProps>;
  expandable?: boolean;
};
const mainNavigation: NavigationItem[] = [
  { label: "Home", icon: House },
  { label: "Balances", icon: Wallet },
  { label: "Transactions", icon: ArrowDownUp },
  { label: "Customers", icon: Users },
  { label: "Product catalog", icon: Box },
];
const shortcuts: NavigationItem[] = [
  { label: "Payments analytics", icon: Clock3 },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Sigma", icon: Activity },
  { label: "Radar", icon: ShieldCheck },
];
const products: NavigationItem[] = [
  { label: "Connect", icon: Layers, expandable: true },
  { label: "Payments", icon: CreditCard, expandable: true },
  { label: "Billing", icon: BookOpen, expandable: true },
  { label: "Reporting", icon: ChartNoAxesCombined, expandable: true },
  { label: "More", icon: Ellipsis, expandable: true },
];
const tabs = [
  "Payments",
  "Payouts",
  "Top-ups",
  "Collected fees",
  "Transfers",
  "All activity",
];

function NavigationGroup({
  title,
  items,
  onNavigate,
}: {
  title?: string;
  items: NavigationItem[];
  onNavigate: () => void;
}) {
  return (
    <div className={styles.navGroup}>
      {title && <p className={styles.navLabel}>{title}</p>}
      {items.map(({ label, icon: Icon, expandable }) =>
        label === "Transactions" ? (
          <Link
            key={label}
            href="/payments"
            aria-current="page"
            onClick={onNavigate}
            className={`${styles.navItem} ${styles.navActive}`}
          >
            <Icon size={16} aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ) : (
          <Tooltip
            key={label}
            content="Outside the scope of this payments assessment"
          >
            <button disabled className={styles.navItem}>
              <Icon size={16} aria-hidden="true" />
              <span>{label}</span>
              {expandable && <ChevronDown size={8} aria-hidden="true" />}
            </button>
          </Tooltip>
        ),
      )}
    </div>
  );
}

export function DashboardShell({
  children,
  search,
}: {
  children: ReactNode;
  search?: ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setSidebarOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);
  return (
    <Dialog.Root open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <div className={styles.dashboard}>
        <a className={styles.skipLink} href="#payments-content">
          Skip to payments
        </a>
        <aside
          id="dashboard-navigation"
          aria-label="Dashboard navigation"
          className={`${styles.sidebar} ${styles.desktopSidebar}`}
        >
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </aside>
        <div className={styles.workspace}>
          <header className={styles.topbar}>
            <Dialog.Trigger asChild>
              <Button
                variant="ghost"
                iconOnly
                className={styles.mobileMenu}
                aria-label="Open navigation"
                aria-expanded={sidebarOpen}
              >
                <MenuIcon />
              </Button>
            </Dialog.Trigger>
            <div className={styles.search}>
              <Search size={14} aria-hidden="true" />
              {search ?? (
                <Input aria-label="Search" placeholder="Search" disabled />
              )}
            </div>
            <div className={styles.modeNotice}>
              <span>Test mode has moved.</span>
              <Popover
                label="Test mode information"
                trigger={<button className={styles.textButton}>Show me</button>}
              >
                <strong>Local preview</strong>
                <p>
                  This assessment uses synthetic payments. No live Stripe
                  account is connected.
                </p>
              </Popover>
            </div>
            <div className={styles.utilities}>
              <span className={styles.appIcons} aria-label="Product shortcuts">
                <span>D</span>
                <span>S</span>
                <span>▣</span>
                <Layers size={14} />
              </span>
              <Popover
                label="Help"
                trigger={
                  <Button variant="ghost" iconOnly aria-label="Help">
                    <CircleHelp />
                  </Button>
                }
              >
                <strong>Payments assessment</strong>
                <p>
                  Search payments by ID, customer email or last four digits.
                  Combine date, status, payment method and amount filters to
                  narrow the results.
                </p>
              </Popover>
              <Popover
                label="Notifications"
                trigger={
                  <Button variant="ghost" iconOnly aria-label="Notifications">
                    <Bell />
                    <span className={styles.notificationDot} />
                  </Button>
                }
              >
                <strong>You’re all caught up</strong>
                <p>There are no notifications in this local preview.</p>
              </Popover>
              <Popover
                label="Settings"
                trigger={
                  <Button variant="ghost" iconOnly aria-label="Settings">
                    <Settings />
                  </Button>
                }
              >
                <strong>Preview settings</strong>
                <p>
                  Dates will use Brasília time. All records are synthetic; no
                  account settings are changed.
                </p>
              </Popover>
              <span className={styles.addCircle} aria-hidden="true">
                <Plus size={13} />
              </span>
            </div>
          </header>
          <main id="payments-content" tabIndex={-1} className={styles.main}>
            <div className={styles.headingRow}>
              <h1>Transactions</h1>
              <div className={styles.actions}>
                <Button
                  variant="primary"
                  disabled
                  title="Payment creation is outside this assessment"
                >
                  <Plus />
                  Create payment
                </Button>
                <Button disabled title="Analytics is outside this assessment">
                  <ChartNoAxesCombined />
                  Analyze
                </Button>
              </div>
            </div>
            <nav className={styles.tabs} aria-label="Transaction types">
              {tabs.map((tab) =>
                tab === "Payments" ? (
                  <Link
                    key={tab}
                    href="/payments"
                    aria-current="page"
                    className={styles.activeTab}
                  >
                    {tab}
                  </Link>
                ) : (
                  <button
                    key={tab}
                    disabled
                    title="Outside this payments assessment"
                  >
                    {tab}
                  </button>
                ),
              )}
            </nav>
            {announcementVisible && (
              <div className={styles.announcement}>
                <span className={styles.newLabel}>
                  <Sparkles size={11} />
                  New
                </span>
                <span>
                  Rule Attributes are now in Sigma and Data Pipeline for better
                  fraud insights.
                </span>
                <a
                  href="https://docs.stripe.com/stripe-data/access-data-in-dashboard"
                  target="_blank"
                  rel="noreferrer"
                >
                  Get started
                  <ExternalLink size={10} className={styles.externalIcon} />
                </a>
                <span className={styles.announcementDivider} />
                <Button
                  variant="ghost"
                  iconOnly
                  aria-label="Dismiss announcement"
                  onClick={() => setAnnouncementVisible(false)}
                >
                  <X />
                </Button>
              </div>
            )}
            {children}
          </main>
        </div>
      </div>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.scrim} />
        <Dialog.Content className={`${styles.sidebar} ${styles.sidebarOpen}`}>
          <Dialog.Title className="sr-only">Dashboard navigation</Dialog.Title>
          <Dialog.Description className="sr-only">
            Navigate the payments dashboard.
          </Dialog.Description>
          <SidebarContent onNavigate={() => setSidebarOpen(false)} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SidebarContent({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <div className={styles.accountRow}>
        <Menu
          label="Account menu"
          trigger={
            <Button variant="ghost" className={styles.accountTrigger}>
              <span className={styles.accountLogo} aria-hidden="true">
                ↔
              </span>
              <strong>cramly.ai</strong>
              <ChevronDown />
            </Button>
          }
        >
          <MenuLabel>Account</MenuLabel>
          <MenuItem disabled>
            <span className={styles.accountLogo}>↔</span>cramly.ai
            <Check size={14} />
          </MenuItem>
          <MenuSeparator />
          <MenuLabel>Local assessment · synthetic data</MenuLabel>
        </Menu>
        <Button
          variant="ghost"
          iconOnly
          className={styles.mobileClose}
          aria-label="Close navigation"
          onClick={() => onNavigate()}
        >
          <X />
        </Button>
      </div>
      <nav aria-label="Main">
        <NavigationGroup
          items={mainNavigation}
          onNavigate={() => onNavigate()}
        />
        <NavigationGroup
          title="Shortcuts"
          items={shortcuts}
          onNavigate={() => onNavigate()}
        />
        <NavigationGroup
          title="Products"
          items={products}
          onNavigate={() => onNavigate()}
        />
      </nav>
      <div className={styles.developers}>
        <Code2 size={15} aria-hidden="true" />
        <span>Developers</span>
        <span className={styles.localBadge}>Local</span>
      </div>
    </>
  );
}
