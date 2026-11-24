# Reference analysis

## Evidence and limits

The clean dashboard screenshot is on PDF page 3. Page 4 is a lower-quality browser
capture introducing a walkthrough; no clickable walkthrough annotation was found.
The supplied PDF is the visual authority. Live Stripe access is unavailable.

Measurements below are estimates from the page-3 render at 1,082 × 1,400 pixels.
The dashboard image occupies approximately x=130–936, y=129–763: about 806 × 634.
Coordinates are only for locating evidence in that render, not browser CSS pixels.
Do not copy these dimensions literally into CSS. Use ratios and calibrate at a
chosen desktop viewport. The screenshot does not establish device pixel ratio,
browser zoom, original viewport, font family or exact CSS values.

## Hierarchy and visible content

1. Left sidebar: account selector (`cramly.ai`), Home, Balances, selected
   Transactions, Customers, Product catalog; Shortcuts and Products groups;
   Developers at the bottom.
2. Top bar: Search, test-mode notice and compact utility controls.
3. Main heading: `Transactions`, with `Create payment` and `Analyze` actions.
4. Tabs: Payments (active), Payouts, Top-ups, Collected fees, Transfers, All activity.
5. Announcement: `New`, Sigma/Data Pipeline notice, `Get started`, dismiss control.
6. Summary/filter cards: All (active), Succeeded, Refunded, Disputed, Failed,
   Uncaptured.
7. Compact toolbar: Date and time, Amount, Currency, Status, Payment method,
   More filters; Export and Edit columns aligned right.
8. Table: checkbox, Amount, status badges alongside amounts, Payment method,
   Description, Customer, Date, Refunded date, truncated Decline reason, row menu.
9. Bottom horizontal scrollbar and pagination/count footer.

## Measurement inventory

| Element         | Render-space estimate                 | Initial CSS hypothesis / confidence                 |
| --------------- | ------------------------------------- | --------------------------------------------------- |
| Sidebar         | x=130–259; width ~129 (~16% of image) | 200–216px at a wider desktop viewport; medium       |
| Main content    | x=282–936; left inset ~23             | 32px content inset; medium                          |
| Top bar         | y=137–156                             | Compact controls; ~40–48px overall region; low      |
| Heading         | y=174–187                             | ~24px, semibold; medium                             |
| Tab baseline    | y~212                                 | ~13–14px labels, fine active underline; medium      |
| Announcement    | y=226–246                             | ~30–32px height; medium                             |
| Summary cards   | y=255–280                             | ~38–40px height, ~6px radius; medium                |
| Filter toolbar  | y=289–305                             | Small pill/button controls; low                     |
| Table header    | y=311–331                             | ~28–32px height; medium                             |
| Data row        | ~20–21px rendered                     | ~30–32px CSS starting point; medium                 |
| Body typography | ~7–8px rendered                       | ~12–13px CSS starting point; low                    |
| Separators      | Thin pale gray lines                  | 1px borders; high for appearance, not sampled color |

These CSS hypotheses assume roughly 1.5× enlargement of the dashboard image.
They are starting points to validate visually, not measured original values.

## Visual language

- White canvas; very pale gray navigation selection, search and notice surfaces.
- Dark slate text, muted secondary text and purple active/action accents.
- Compact mostly outlined controls; modest rounding and minimal shadows.
- Amounts right-aligned; currency muted; tight consistent cell padding.
- Small green success and red failure badges with both labels and symbols.
- Compact payment-brand marks and masked account/card digits.
- Dense table retains horizontal scrolling rather than squeezing every column.

Exact hex colors, font, icon source, hover colors, tooltip styling and menu geometry
are unverified. Arial/system sans is only the task-4 placeholder; choose the final
font by comparison later. Prefer consistent SVG icons; no image generation needed.

## Differences that must remain visible in planning

- Reference footer shows 20 rows and 10,000 results; the brief requires 25/50/100
  rows with approximately 300–1,000 mock records.
- Screenshot includes Canceled/Blocked and Disputed/Uncaptured controls; required
  badges are Succeeded/Pending/Failed/Refunded.
- Required Payment ID and Created fields are not labeled that way in the screenshot.
- Screenshot includes additional columns and controls outside the required list.

See implementation-decisions.md for the proposed resolution. Do not silently drop
required behavior to reproduce the screenshot.

## Later visual QA tasks

1. Crop the clean dashboard reference locally; exclude PDF margins/browser chrome.
2. Choose and record a desktop viewport; normalize reference and app scale.
3. Compare geometry first, then type/density, then borders/icons/colors.
4. Capture default, filtered, empty, open-popover, tooltip and keyboard-focus states.
5. Check tablet/mobile separately; no mobile reference is supplied.
6. If live access becomes available, verify uncertain states without replacing the
   supplied screenshot with a newer Stripe design.
