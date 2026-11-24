# Stripe dashboard SVG reference assets

Captured from the authenticated Stripe test dashboard on 2026-11-24. Files preserve the original inline markup; generated Stripe CSS classes are not portable. Only SVG sources used by the UI are retained. No account records or credentials are included.

`src/components/ui/stripe-icons.tsx` uses matching geometry as typed React components. It removes dashboard classes and test attributes, converts SVG attributes to React names, and uses `currentColor`. Icons are decorative; surrounding controls retain their accessible names. No runtime network request or raw HTML injection is needed.

## Mapped assets

- `House`: `icon-026.svg`
- `Wallet`: `icon-027.svg`
- `ArrowDownUp`: `icon-028.svg`
- `Users`: `icon-029.svg`
- `Box`: `icon-030.svg`
- `CreditCard`: `icon-038.svg`
- `BookOpen`: `icon-040.svg`
- `ChartNoAxesCombined`: `icon-042.svg`
- `Ellipsis`: `icon-046.svg`
- `ChevronDown`: `icon-055.svg`
- `Search`: `icon-048.svg`
- `CircleHelp`: `icon-049.svg`
- `Bell`: `icon-050.svg`
- `Settings`: `icon-051.svg`
- `Plus`: `icon-052.svg`
- `X`: `icon-054.svg`
- `Code2`: `icon-063.svg`
- `Clock3`: `icon-033.svg`
- `Pin`: `icon-032.svg`

Unmatched icons remain from Lucide. The dashboard did not supply a matching Cramly logo or payment brand marks; these were not substituted. These are Stripe-origin assets, not assets covered by the Lucide license.
