import type { SVGProps } from "react";

/**
 * Brand marks. lucide-react v1 dropped third-party logos, so the few we need
 * live here as inline paths sized to match lucide's 24×24 grid.
 */

type IconProps = SVGProps<SVGSVGElement>;

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <rect
        x="2.5"
        y="2.5"
        width="19"
        height="19"
        rx="5.5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M22.2 8.1a3 3 0 0 0-2.1-2.1C18.3 5.5 12 5.5 12 5.5s-6.3 0-8.1.5A3 3 0 0 0 1.8 8.1 31 31 0 0 0 1.3 12a31 31 0 0 0 .5 3.9 3 3 0 0 0 2.1 2.1c1.8.5 8.1.5 8.1.5s6.3 0 8.1-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-3.9 31 31 0 0 0-.5-3.9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M10.2 15.1V8.9l5.2 3.1-5.2 3.1Z" fill="currentColor" />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M21.3 4.3 2.9 11.4c-1 .4-1 1.8.1 2.1l4.5 1.4 1.7 5.2c.3.8 1.3 1 1.9.4l2.5-2.4 4.5 3.3c.7.5 1.7.1 1.9-.7l3-14.4c.2-.9-.7-1.7-1.7-1.3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m7.5 14.9 10.9-8.2-7.6 9.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustpilotIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden {...props}>
      <path
        d="M12 2.6 14.9 9l6.9.7-5.2 4.7 1.5 6.8L12 17.7 5.9 21.2l1.5-6.8L2.2 9.7 9.1 9 12 2.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}
