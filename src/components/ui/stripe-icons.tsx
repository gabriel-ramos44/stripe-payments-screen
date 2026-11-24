import type { SVGProps } from "react";

export type StripeIconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  size?: number;
};

// Paths captured from Stripe’s rendered test dashboard. See reference-assets/stripe-dashboard/README.md.

export function House({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M3 16a2.5 2.5 0 0 1-2.5-2.5V5.548a2 2 0 0 1 .862-1.644L6.486.356A2 2 0 0 1 7.625 0h.75a2 2 0 0 1 1.139.356l5.124 3.548a2 2 0 0 1 .862 1.644V13.5A2.5 2.5 0 0 1 13 16H3Zm2-1.5H3a1 1 0 0 1-1-1V5.548a.5.5 0 0 1 .215-.411L7.34 1.589a.5.5 0 0 1 .285-.089h.75a.5.5 0 0 1 .285.089l5.125 3.548a.5.5 0 0 1 .215.41V13.5a1 1 0 0 1-1 1h-2V8a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v6.5Zm1.5 0h3v-6h-3v6Z"></path>
    </svg>
  );
}

export function Wallet({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M1 2a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 1 2Zm0 8a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5A.75.75 0 0 1 1 10Zm2.25-4.75a.75.75 0 0 0 0 1.5h7.5a.75.75 0 0 0 0-1.5h-7.5ZM2.5 14a.75.75 0 0 1 .75-.75h4a.75.75 0 0 1 0 1.5h-4A.75.75 0 0 1 2.5 14Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M16 11.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-1.5 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"></path>
    </svg>
  );
}

export function ArrowDownUp({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M9.714 6.693a.75.75 0 1 0 1.106 1.014l2.933-3.2a.75.75 0 0 0 0-1.013L10.82.294a.75.75 0 1 0-1.106 1.013l1.781 1.943H4.6A3.75 3.75 0 0 0 .85 7v.067a.75.75 0 1 0 1.5 0V7A2.25 2.25 0 0 1 4.6 4.75h6.895l-1.78 1.943ZM6.286 9.307A.75.75 0 0 0 5.18 8.293l-2.932 3.2a.75.75 0 0 0 0 1.014l2.932 3.2a.75.75 0 1 0 1.106-1.014l-1.78-1.942H11.4A3.75 3.75 0 0 0 15.15 9v-.067a.75.75 0 0 0-1.5 0V9a2.25 2.25 0 0 1-2.25 2.25H4.505l1.78-1.944Z"></path>
    </svg>
  );
}

export function Users({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M2.5 14.4h11a.4.4 0 0 0 .4-.4 3.4 3.4 0 0 0-3.4-3.4h-5A3.4 3.4 0 0 0 2.1 14c0 .22.18.4.4.4Zm0 1.6h11a2 2 0 0 0 2-2 5 5 0 0 0-5-5h-5a5 5 0 0 0-5 5 2 2 0 0 0 2 2ZM8 6.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8ZM8 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
    </svg>
  );
}

export function Box({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M7.973 0a2 2 0 0 0-.894.211L1.607 2.947A2 2 0 0 0 .5 4.737v6.568a2 2 0 0 0 1.052 1.761l4.782 2.575A3 3 0 0 0 7.757 16h.488a3 3 0 0 0 1.422-.359l4.781-2.575a2 2 0 0 0 1.052-1.76v-6.57a2 2 0 0 0-1.105-1.789L8.922.211A2 2 0 0 0 8.03 0h-.056ZM14 11.306V5.62L8.75 8.448v5.964c.07-.025.14-.056.206-.091l4.781-2.575a.5.5 0 0 0 .263-.44ZM8.252 1.553l5.257 2.629-2.06 1.109-5.38-2.898 1.68-.84a.5.5 0 0 1 .224-.053h.056a.5.5 0 0 1 .223.053ZM4.756 3.05 2.491 4.182 8 7.148l2.184-1.176L4.756 3.05ZM7.25 8.448 2 5.622v5.683a.5.5 0 0 0 .263.44l4.782 2.576c.066.035.134.066.204.09V8.449Z"></path>
    </svg>
  );
}

export function CreditCard({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M0 3.884c0-.8.545-1.476 1.306-1.68l.018-.004L10.552.213c.15-.038.3-.055.448-.055.927.006 1.75.733 1.75 1.74V4.5h.75A2.5 2.5 0 0 1 16 7v6.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 13.5V3.884ZM10.913 1.67c.199-.052.337.09.337.23v2.6H2.5c-.356 0-.694.074-1 .208v-.824c0-.092.059-.189.181-.227l9.216-1.984.016-.004ZM1.5 7v6.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-11a1 1 0 0 0-1 1Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M10.897 1.673 1.681 3.657c-.122.038-.181.135-.181.227v.824a2.492 2.492 0 0 1 1-.208h8.75V1.898c0-.14-.138-.281-.337-.23m0 0-.016.005Zm-9.59.532 9.23-1.987c.15-.038.3-.055.448-.055.927.006 1.75.733 1.75 1.74V4.5h.75A2.5 2.5 0 0 1 16 7v6.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 13.5V3.884c0-.8.545-1.476 1.306-1.68l.018-.004ZM1.5 13.5V7a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1v6.5a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1ZM13 10.25c0 .688-.563 1.25-1.25 1.25-.688 0-1.25-.55-1.25-1.25 0-.688.563-1.25 1.25-1.25.688 0 1.25.562 1.25 1.25Z"></path>
    </svg>
  );
}

export function BookOpen({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 2.25A2.25 2.25 0 0 1 2.25 0h7.5A2.25 2.25 0 0 1 12 2.25v6a.75.75 0 0 1-1.5 0v-6a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0-.75.75v10.851a.192.192 0 0 0 .277.172l.888-.444a.75.75 0 1 1 .67 1.342l-.887.443A1.69 1.69 0 0 1 0 13.101V2.25Z"></path>
      <path d="M5 10.7a.7.7 0 0 1 .7-.7h4.6a.7.7 0 1 1 0 1.4H7.36l.136.237c.098.17.193.336.284.491.283.483.554.907.855 1.263.572.675 1.249 1.109 2.365 1.109 1.18 0 2.038-.423 2.604-1.039.576-.626.896-1.5.896-2.461 0-.99-.42-1.567-.807-1.998a.75.75 0 1 1 1.115-1.004C15.319 8.568 16 9.49 16 11c0 1.288-.43 2.54-1.292 3.476C13.838 15.423 12.57 16 11 16c-1.634 0-2.706-.691-3.51-1.64-.386-.457-.71-.971-1.004-1.472L6.4 12.74v2.56a.7.7 0 1 1-1.4 0v-4.6ZM2.95 4.25a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75ZM3.7 6.5a.75.75 0 0 0 0 1.5h4.6a.75.75 0 0 0 0-1.5H3.7Z"></path>
    </svg>
  );
}

export function ChartNoAxesCombined({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M14 1.875a.875.875 0 0 0-1.75 0v8.75a.875.875 0 0 0 1.75 0v-8.75Z"></path>
      <path d="M2.6 1.875a.8.8 0 1 0-1.6 0V13.2A1.8 1.8 0 0 0 2.8 15h11.827a.8.8 0 0 0 0-1.6H2.8a.2.2 0 0 1-.2-.2V1.875Z"></path>
      <path d="M9.125 3.5c.483 0 .875.392.875.875v6.25a.875.875 0 0 1-1.75 0v-6.25c0-.483.392-.875.875-.875ZM6 6.875a.875.875 0 1 0-1.75 0v3.75a.875.875 0 0 0 1.75 0v-3.75Z"></path>
    </svg>
  );
}

export function Ellipsis({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm5.5 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"></path>
    </svg>
  );
}

export function ChevronDown({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 8 8"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M.606 2.334a.75.75 0 0 0-.022 1.06l2.875 3a.75.75 0 0 0 1.082 0L7.416 3.4a.75.75 0 0 0-1.082-1.038L4 4.79 1.667 2.357a.75.75 0 0 0-1.06-.022Z"></path>
    </svg>
  );
}

export function Search({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M7.883 9.085a5 5 0 1 1 1.202-1.202l2.666 2.666a.847.847 0 0 1 0 1.202.847.847 0 0 1-1.202 0L7.883 9.085ZM8.3 5a3.3 3.3 0 1 1-6.6 0 3.3 3.3 0 0 1 6.6 0Z"></path>
    </svg>
  );
}

export function CircleHelp({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M6.886 4.923c-.232.25-.386.63-.386 1.122a.75.75 0 1 1-1.5 0c0-.803.254-1.57.788-2.144C6.33 3.32 7.1 3 8 3c.9 0 1.67.32 2.212.901.534.574.788 1.341.788 2.144 0 1.234-.869 1.922-1.436 2.332-.094.068-.178.127-.255.181-.19.134-.33.233-.449.343a.64.64 0 0 0-.11.121V9.5a.75.75 0 0 1-1.5 0V9c0-.563.326-.956.593-1.202.198-.183.457-.364.672-.516l.17-.121c.559-.404.815-.693.815-1.116 0-.492-.154-.872-.386-1.122C8.888 4.68 8.533 4.5 8 4.5c-.533 0-.888.18-1.114.423Z"></path>
      <path d="M9 12a1.001 1.001 0 0 1-2 0 1.001 1.001 0 0 1 2 0Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M8 14.5A6.5 6.5 0 1 0 1.5 8c0 1.022.179 1.608.603 2.399.316.59.407 1.313.178 2.003l-.66 1.976 1.977-.659a2.541 2.541 0 0 1 2.004.178c.79.424 1.376.603 2.398.603ZM8 16a8 8 0 1 0-8-8c0 1.29.25 2.117.78 3.107.136.252.168.549.078.82l-.807 2.42a1 1 0 0 0-.051.315V15a1 1 0 0 0 1 1h.338a1 1 0 0 0 .316-.051l2.419-.807c.271-.09.568-.057.82.078.99.53 1.817.78 3.107.78Z"></path>
    </svg>
  );
}

export function Bell({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M5.005 13H2.79a1.792 1.792 0 0 1-1.628-2.532l.477-1.051a11.583 11.583 0 0 0 1.01-4.018l.027-.41A5.34 5.34 0 0 1 8 0a5.34 5.34 0 0 1 5.324 4.989l.027.41a11.6 11.6 0 0 0 1.01 4.018l.477 1.05A1.787 1.787 0 0 1 13.21 13h-2.215c0 1.657-1.34 3-2.995 3a2.997 2.997 0 0 1-2.995-3Zm-2.48-1.912.478-1.05a13.086 13.086 0 0 0 1.14-4.539l.027-.41A3.84 3.84 0 0 1 8 1.5a3.84 3.84 0 0 1 3.83 3.589l.027.41c.104 1.57.49 3.107 1.14 4.538l.477 1.051a.291.291 0 0 1-.264.412H2.79a.291.291 0 0 1-.264-.412ZM6.504 13a1.499 1.499 0 1 0 2.995 0H6.503Z"></path>
    </svg>
  );
}

export function Settings({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 1.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M7.41 14.5h1.18l.053-.832a1.753 1.753 0 0 1 1.08-1.509 1.752 1.752 0 0 1 1.83.303l.625.552.836-.835-.552-.626a1.752 1.752 0 0 1-.303-1.83 1.753 1.753 0 0 1 1.509-1.08l.832-.052V7.409l-.832-.052a1.753 1.753 0 0 1-1.509-1.08 1.752 1.752 0 0 1 .303-1.83l.552-.625-.836-.836-.625.552a1.752 1.752 0 0 1-1.83.303 1.753 1.753 0 0 1-1.08-1.509L8.59 1.5H7.409l-.052.832a1.753 1.753 0 0 1-1.08 1.509 1.752 1.752 0 0 1-1.83-.303l-.625-.552-.836.836.552.625a1.753 1.753 0 0 1-1.205 2.91L1.5 7.41v1.182l.832.052a1.753 1.753 0 0 1 1.509 1.08 1.752 1.752 0 0 1-.303 1.83l-.552.625.836.836.625-.552a1.752 1.752 0 0 1 1.83-.303 1.753 1.753 0 0 1 1.08 1.509l.052.832Zm-2.896-.122c.064-.04.125-.085.183-.136l.742-.655a.252.252 0 0 1 .264-.042.25.25 0 0 1 .157.216l.062.989a1.34 1.34 0 0 0 .07.35c.18.526.679.9 1.26.9h1.495a1.334 1.334 0 0 0 1.331-1.25l.062-.989a.253.253 0 0 1 .157-.216.252.252 0 0 1 .263.042l.743.655a1.338 1.338 0 0 0 .297.199c.5.244 1.117.156 1.528-.256l1.057-1.057a1.334 1.334 0 0 0 .057-1.825l-.655-.742a.252.252 0 0 1-.042-.264.253.253 0 0 1 .216-.157l.989-.062a1.341 1.341 0 0 0 .35-.07c.526-.18.9-.679.9-1.26V7.252a1.334 1.334 0 0 0-1.25-1.331l-.989-.062a.253.253 0 0 1-.216-.157.252.252 0 0 1 .042-.264l.655-.742a1.34 1.34 0 0 0 .199-.297c.244-.5.156-1.117-.256-1.528l-1.057-1.057a1.334 1.334 0 0 0-1.825-.057l-.742.655a.252.252 0 0 1-.264.042.253.253 0 0 1-.157-.216l-.062-.989a1.34 1.34 0 0 0-.07-.35A1.33 1.33 0 0 0 8.749 0H7.252a1.334 1.334 0 0 0-1.331 1.25l-.062.989a.253.253 0 0 1-.157.216.252.252 0 0 1-.264-.042l-.742-.655a1.34 1.34 0 0 0-.297-.199 1.334 1.334 0 0 0-1.528.256L1.815 2.872a1.334 1.334 0 0 0-.057 1.825l.655.743c.064.072.08.174.042.263a.253.253 0 0 1-.216.157l-.989.062a1.34 1.34 0 0 0-.35.07c-.526.18-.9.679-.9 1.26v1.495a1.334 1.334 0 0 0 1.25 1.331l.989.062c.096.006.18.068.216.157a.252.252 0 0 1-.042.264l-.655.742a1.344 1.344 0 0 0-.199.297c-.244.5-.156 1.117.256 1.528l1.057 1.057a1.334 1.334 0 0 0 1.642.193Z"></path>
    </svg>
  );
}

export function Plus({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M6.85 1a.85.85 0 1 0-1.7 0v4.15H1a.85.85 0 0 0 0 1.7h4.15V11a.85.85 0 1 0 1.7 0V6.85H11a.85.85 0 1 0 0-1.7H6.85V1Z"></path>
    </svg>
  );
}

export function X({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M1.249 1.249a.85.85 0 0 1 1.202 0L6 4.798l3.549-3.549a.85.85 0 1 1 1.202 1.202L7.202 6l3.549 3.549a.85.85 0 1 1-1.202 1.202L6 7.202l-3.549 3.549a.85.85 0 1 1-1.202-1.202L4.798 6l-3.55-3.549a.85.85 0 0 1 0-1.202Z"></path>
    </svg>
  );
}

export function Code2({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path fillRule="evenodd" clipRule="evenodd" d="M13 2.5H3A1.5 1.5 0 0 0 1.5 4v8A1.5 1.5 0 0 0 3 13.5h10a1.5 1.5 0 0 0 1.5-1.5V4A1.5 1.5 0 0 0 13 2.5ZM3 1a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V4a3 3 0 0 0-3-3H3Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M3.43 4.512a.75.75 0 0 1 1.058-.081l3.5 3a.75.75 0 0 1 0 1.138l-3.5 3a.75.75 0 1 1-.976-1.138L6.348 8 3.512 5.57a.75.75 0 0 1-.081-1.058ZM8 10.75a.75.75 0 0 1 .75-.75h3.5a.75.75 0 0 1 0 1.5h-3.5a.75.75 0 0 1-.75-.75Z"></path>
    </svg>
  );
}

export function Clock3({ size = 16, ...props }: StripeIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.75 4.75a.75.75 0 0 0-1.5 0V9c0 .3.179.571.455.69l1.75.75a.75.75 0 0 0 .59-1.38L8.75 8.506V4.75Z"></path>
      <path fillRule="evenodd" clipRule="evenodd" d="M15 8a7 7 0 0 1-7 7 7 7 0 0 1-7-7 7 7 0 0 1 7-7c3.876 0 7 3.134 7 7Zm-1.5 0a5.5 5.5 0 1 1-11 0A5.5 5.5 0 0 1 8 2.5c3.046 0 5.5 2.46 5.5 5.5Z"></path>
    </svg>
  );
}
