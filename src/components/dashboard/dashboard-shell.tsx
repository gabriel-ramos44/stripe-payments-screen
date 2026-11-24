"use client";

import { useState, type ReactNode } from "react";
import {
  Activity,
  ArrowDownUp,
  Bell,
  BookOpen,
  Box,
  ChartNoAxesCombined,
  ChartPie,
  Check,
  ChevronDown,
  CircleDollarSign,
  CircleHelp,
  Code2,
  CreditCard,
  Download,
  Ellipsis,
  ExternalLink,
  House,
  Layers,
  Menu as MenuIcon,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
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

type NavigationItem = { label: string; icon: LucideIcon; expandable?: boolean };
const mainNavigation: NavigationItem[] = [
  { label: "Home", icon: House },
  { label: "Balances", icon: Wallet },
  { label: "Transactions", icon: ArrowDownUp },
  { label: "Customers", icon: Users },
  { label: "Product catalog", icon: Box },
];
const shortcuts: NavigationItem[] = [
  { label: "Payments analytics", icon: ChartPie },
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
const summaries = [
  "All",
  "Succeeded",
  "Refunded",
  "Disputed",
  "Failed",
  "Uncaptured",
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
          <a
            key={label}
            href="/payments"
            aria-current="page"
            onClick={onNavigate}
            className={`${styles.navItem} ${styles.navActive}`}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{label}</span>
          </a>
        ) : (
          <Tooltip
            key={label}
            content="Outside the scope of this payments assessment"
          >
            <button disabled className={styles.navItem}>
              <Icon size={15} aria-hidden="true" />
              <span>{label}</span>
              {expandable && <ChevronDown size={12} aria-hidden="true" />}
            </button>
          </Tooltip>
        ),
      )}
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  return (
    <div className={styles.dashboard}>
      <a className={styles.skipLink} href="#payments-content">
        Skip to payments
      </a>
      {sidebarOpen && (
        <button
          className={styles.scrim}
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        id="dashboard-navigation"
        aria-label="Dashboard navigation"
        className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") setSidebarOpen(false);
        }}
      >
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
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </Button>
        </div>
        <nav aria-label="Main">
          <NavigationGroup
            items={mainNavigation}
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavigationGroup
            title="Shortcuts"
            items={shortcuts}
            onNavigate={() => setSidebarOpen(false)}
          />
          <NavigationGroup
            title="Products"
            items={products}
            onNavigate={() => setSidebarOpen(false)}
          />
        </nav>
        <div className={styles.developers}>
          <Code2 size={15} aria-hidden="true" />
          <span>Developers</span>
          <span className={styles.localBadge}>Local</span>
        </div>
      </aside>
      <div className={styles.workspace}>
        <header className={styles.topbar}>
          <Button
            variant="ghost"
            iconOnly
            className={styles.mobileMenu}
            aria-label="Open navigation"
            aria-expanded={sidebarOpen}
            aria-controls="dashboard-navigation"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <MenuIcon />
          </Button>
          <div className={styles.search}>
            <Search size={14} aria-hidden="true" />
            <Input
              aria-label="Search dashboard (available in a later task)"
              placeholder="Search"
              disabled
            />
          </div>
          <div className={styles.modeNotice}>
            <span>Test mode has moved.</span>
            <Popover
              label="Test mode information"
              trigger={<button className={styles.textButton}>Show me</button>}
            >
              <strong>Local preview</strong>
              <p>
                This assessment uses synthetic payments. No live Stripe account
                is connected.
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
                The dashboard shell is ready. Payment search, filters and table
                interactions are planned for the next implementation stage.
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
                <a
                  key={tab}
                  href="/payments"
                  aria-current="page"
                  className={styles.activeTab}
                >
                  {tab}
                </a>
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
          <div className={styles.summaries} aria-label="Payment views">
            {summaries.map((summary) => (
              <button
                key={summary}
                className={summary === "All" ? styles.activeSummary : ""}
                aria-pressed={summary === "All"}
                disabled
                title="Status filtering will be implemented with the payments table"
              >
                {summary}
              </button>
            ))}
          </div>
          <div className={styles.toolbar}>
            <div className={styles.filters}>
              {[
                { label: "Date and time", icon: CircleDollarSign },
                { label: "Amount", icon: CircleDollarSign },
                { label: "Currency", icon: CircleDollarSign },
                { label: "Status", icon: CircleDollarSign },
                { label: "Payment method", icon: CreditCard },
                { label: "More filters", icon: SlidersHorizontal },
              ].map(({ label, icon: Icon }) => (
                <Button
                  key={label}
                  disabled
                  title="Filters will be implemented in the next stage"
                >
                  <Icon />
                  {label}
                </Button>
              ))}
            </div>
            <div className={styles.actions}>
              <Button disabled title="Optional export is not implemented yet">
                <Download />
                Export
              </Button>
              <Button
                disabled
                title="Column customization is not implemented yet"
              >
                <Settings />
                Edit columns
              </Button>
            </div>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
