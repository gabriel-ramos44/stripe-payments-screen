# Visual assets

- Card-brand SVGs: `react-payment-logos` 1.1.0, MIT, by iamgutz.
  Source: https://github.com/iamgutz/react-payment-logos. Only the flat Visa,
  Mastercard and Amex components are imported. Marks belong to their respective owners.
- Font: self-hosted Inter through `@fontsource/inter`, OFL-1.1.
  Sources: https://fontsource.org/fonts/inter and https://rsms.me/inter/.
  Latin weights 400/500/600/700 are bundled; no runtime font service is called.
  This is a visual match choice, not a verified identification of the screenshot font.
- UI icons: existing Lucide React, ISC license, https://lucide.dev/.
- Layered controls: existing Radix primitives; custom CSS matches the reference.
- Account mark: only the 33px square Cramly mark was extracted from the user-supplied
  assessment image and displayed at 22px. No customer data or whole reference image
  is republished. Cramly's branding belongs to its owner.

Stripe's published UI components target Stripe Apps rather than a supported,
drop-in Dashboard clone for this standalone Next.js project:
https://docs.stripe.com/stripe-apps/components.
The exact internal Dashboard icon set and font have not been verified.
