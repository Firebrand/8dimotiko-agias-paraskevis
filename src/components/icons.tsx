import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

export const ArrowRight = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" />
  </svg>
);

export const ArrowLeft = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5" />
  </svg>
);

export const ChevronDown = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="m6 9.5 6 6 6-6" />
  </svg>
);

export const Search = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const Menu = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Close = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const Calendar = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="3" />
    <path d="M3.5 10h17M8.5 3v3.5M15.5 3v3.5" />
  </svg>
);

export const Document = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M14 3.5H7.5A2.5 2.5 0 0 0 5 6v12a2.5 2.5 0 0 0 2.5 2.5h9A2.5 2.5 0 0 0 19 18V8.5z" />
    <path d="M14 3.5V8a.5.5 0 0 0 .5.5H19M8.5 13h7M8.5 16.5h4.5" />
  </svg>
);

export const People = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="9" cy="8.5" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16.5 5.2a3.5 3.5 0 0 1 0 6.6M18 20a6.6 6.6 0 0 0-1.6-4.3" />
  </svg>
);

export const MapPin = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
);

export const Clock = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Info = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 8h.01" />
  </svg>
);

export const Phone = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M6.2 3.5h2.4l1.6 4-2 1.2a10.4 10.4 0 0 0 4.9 4.9l1.2-2 4 1.6v2.4a2.4 2.4 0 0 1-2.6 2.4A14.4 14.4 0 0 1 3.8 6.1 2.4 2.4 0 0 1 6.2 3.5Z" />
  </svg>
);

export const Mail = (props: IconProps) => (
  <svg {...base} {...props}>
    <rect x="3" y="5.5" width="18" height="13" rx="3" />
    <path d="m4 8 7.1 4.6a1.6 1.6 0 0 0 1.8 0L20 8" />
  </svg>
);

export const Download = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3.5v11m0 0 4-4m-4 4-4-4M4.5 17v1.5a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V17" />
  </svg>
);

export const Play = (props: IconProps) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="12" r="9" />
    <path d="M10 8.7v6.6l5.2-3.3z" fill="currentColor" stroke="none" />
  </svg>
);

export const Expand = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M9 4.5H4.5V9M15 4.5h4.5V9M9 19.5H4.5V15M15 19.5h4.5V15" />
  </svg>
);

export const External = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M14 4.5h5.5V10M19 5l-7.5 7.5M17 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-10A1.5 1.5 0 0 1 4 18.5v-10A1.5 1.5 0 0 1 5.5 7H10" />
  </svg>
);

export const Sparkle = (props: IconProps) => (
  <svg {...base} {...props}>
    <path d="M12 3.5 13.8 9l5.5 1.8-5.5 1.8L12 18l-1.8-5.4L4.7 10.8 10.2 9z" />
  </svg>
);

export const Facebook = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.6c-.8-.1-1.7-.15-2.5-.15-2.5 0-4.2 1.5-4.2 4.3v2.15H7.3V13h2.15v8z" />
  </svg>
);

export const Instagram = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M12 2.2c-2.7 0-3 0-4.05.06-1.05.05-1.75.22-2.37.46a4.8 4.8 0 0 0-1.73 1.13A4.8 4.8 0 0 0 2.72 5.6c-.24.62-.4 1.32-.46 2.36C2.2 9 2.2 9.3 2.2 12s0 3 .06 4.05c.05 1.04.22 1.74.46 2.36a4.8 4.8 0 0 0 1.13 1.74 4.8 4.8 0 0 0 1.73 1.13c.62.24 1.32.4 2.37.46 1.04.05 1.35.06 4.05.06s3 0 4.05-.06c1.04-.06 1.74-.22 2.36-.46a5.1 5.1 0 0 0 2.87-2.87c.24-.62.4-1.32.46-2.36.05-1.05.06-1.35.06-4.05s0-3-.06-4.05c-.06-1.04-.22-1.74-.46-2.36a4.8 4.8 0 0 0-1.13-1.74 4.8 4.8 0 0 0-1.74-1.13c-.62-.24-1.32-.4-2.36-.46C15 2.2 14.7 2.2 12 2.2m0 1.8c2.67 0 2.98.01 4 .06.79.03 1.2.16 1.48.27.37.14.63.31.9.59.29.28.46.54.6.9.1.29.24.7.27 1.49.05 1.01.06 1.32.06 3.99s-.01 2.98-.06 4c-.03.78-.17 1.2-.28 1.48-.14.36-.3.62-.59.9-.28.28-.54.45-.9.59-.29.11-.7.24-1.49.28-1.01.04-1.32.05-3.99.05s-2.98 0-4-.05c-.78-.04-1.2-.17-1.48-.28a2.4 2.4 0 0 1-.9-.59 2.4 2.4 0 0 1-.6-.9c-.1-.29-.24-.7-.27-1.49-.05-1.01-.06-1.32-.06-3.99s.01-2.98.06-4c.03-.78.16-1.2.27-1.48.14-.36.31-.62.6-.9.28-.28.54-.45.9-.59.28-.11.7-.24 1.48-.27 1.02-.05 1.33-.06 4-.06m0 3.06a4.94 4.94 0 1 0 0 9.88 4.94 4.94 0 0 0 0-9.88m0 8.14a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4m6.28-8.34a1.15 1.15 0 1 1-2.3 0 1.15 1.15 0 0 1 2.3 0" />
  </svg>
);

export const YouTube = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.77-1.77C18.25 5 12 5 12 5s-6.25 0-7.83.43A2.5 2.5 0 0 0 2.4 7.2C2 8.78 2 12 2 12s0 3.22.4 4.8a2.5 2.5 0 0 0 1.77 1.77C5.75 19 12 19 12 19s6.25 0 7.83-.43a2.5 2.5 0 0 0 1.77-1.77C22 15.22 22 12 22 12s0-3.22-.4-4.8M10 15.1V8.9l5.2 3.1z" />
  </svg>
);

export const QUICK_LINK_ICONS = {
  info: Info,
  calendar: Calendar,
  document: Document,
  people: People,
  map: MapPin,
  clock: Clock,
} as const;

export const SOCIAL_ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: YouTube,
} as const;
