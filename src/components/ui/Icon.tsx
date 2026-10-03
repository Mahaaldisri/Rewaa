import type { SVGProps } from "react";

/**
 * Single inline SVG icon set (no icon dependency, no network requests).
 * Stroke-based, 24px grid, inherits `currentColor`.
 */
const PATHS = {
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2.5 3.5h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L20.5 7H6" /></>,
  heart: <path d="M12 20.3s-7.6-4.5-9.1-9A5.1 5.1 0 0 1 12 6.6a5.1 5.1 0 0 1 9.1 4.7c-1.5 4.5-9.1 9-9.1 9Z" />,
  share: <><circle cx="18" cy="5" r="2.4" /><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="19" r="2.4" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
  compare: <><path d="M12 3v18M6 8H3l3 6 3-6H6ZM18 8h-3l3 6 3-6h-3Z" /></>,
  star: <path d="m12 3.6 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9L12 3.6Z" />,
  chevronDown: <path d="m6 9 6 6 6-6" />,
  chevronUp: <path d="m6 15 6-6 6 6" />,
  chevronLeft: <path d="m15 6-6 6 6 6" />,
  chevronRight: <path d="m9 6 6 6-6 6" />,
  arrowLeft: <><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></>,
  arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  zoomIn: <><circle cx="11" cy="11" r="6.5" /><path d="M11 8.5v5M8.5 11h5M16 16l4.5 4.5" /></>,
  zoomOut: <><circle cx="11" cy="11" r="6.5" /><path d="M8.5 11h5M16 16l4.5 4.5" /></>,
  zoomReset: <><path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" /><path d="M3.5 4.5V10H9" /></>,
  truck: <><path d="M2.5 6.5h11v10h-11z" /><path d="M13.5 10h4l3 3v3.5h-7z" /><circle cx="7" cy="18" r="1.7" /><circle cx="17" cy="18" r="1.7" /></>,
  shield: <><path d="M12 3 5 5.8v5.4c0 4.3 2.9 8 7 9.3 4.1-1.3 7-5 7-9.3V5.8L12 3Z" /><path d="m9.2 12 2 2 3.6-3.8" /></>,
  rotate: <><path d="M3.5 12a8.5 8.5 0 1 1 2.6 6.1" /><path d="M3.5 19.5V14H9" /></>,
  lock: <><rect x="4.5" y="10.5" width="15" height="10" rx="2" /><path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" /><path d="M12 14.5v2.5" /></>,
  headset: <><path d="M4 13.5V12a8 8 0 0 1 16 0v1.5" /><rect x="2.5" y="13" width="4" height="6" rx="1.6" /><rect x="17.5" y="13" width="4" height="6" rx="1.6" /><path d="M20 19v.6a2.4 2.4 0 0 1-2.4 2.4H13" /></>,
  badgeCheck: <><path d="m12 2.8 2.3 1.7 2.8-.2 1 2.7 2.4 1.5-.8 2.7.8 2.7-2.4 1.5-1 2.7-2.8-.2L12 21.2l-2.3-1.7-2.8.2-1-2.7L3.5 15.5l.8-2.7-.8-2.7 2.4-1.5 1-2.7 2.8.2L12 2.8Z" /><path d="m9.2 12.2 2 2 3.6-4" /></>,
  flame: <path d="M12 21c3.6 0 6-2.4 6-5.6 0-4-3.3-5.6-3-9.4-2 .8-3.4 2.4-3.4 4.4 0 1.2.5 2 .5 2.6 0 .9-.7 1.5-1.5 1.5-1 0-1.7-.9-1.7-2.3C7.5 13.5 6 14.7 6 17c0 2.3 2.2 4 6 4Z" />,
  tag: <><path d="M3.5 11.4V4.5a1 1 0 0 1 1-1h6.9a1 1 0 0 1 .7.3l8 8a1 1 0 0 1 0 1.4l-6.9 6.9a1 1 0 0 1-1.4 0l-8-8a1 1 0 0 1-.3-.7Z" /><circle cx="8" cy="8" r="1.4" /></>,
  clock: <><circle cx="12" cy="12" r="8.8" /><path d="M12 7v5.3l3.2 2" /></>,
  gift: <><rect x="3.2" y="8.5" width="17.6" height="4" rx="1" /><path d="M5 12.5V20h14v-7.5M12 8.5V20" /><path d="M12 8.5S10.8 4 8.6 4a2.2 2.2 0 0 0 0 4.5H12Zm0 0s1.2-4.5 3.4-4.5a2.2 2.2 0 0 1 0 4.5H12Z" /></>,
  ticket: <><path d="M3.5 8.5A1.5 1.5 0 0 1 5 7h14a1.5 1.5 0 0 1 1.5 1.5v2a2.5 2.5 0 0 0 0 5v2A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-2a2.5 2.5 0 0 0 0-5v-2Z" /><path d="M14 7v12" strokeDasharray="2 2.4" /></>,
  mapPin: <><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></>,
  store: <><path d="M4 10v9.5h16V10" /><path d="M2.8 10 5 4h14l2.2 6a3 3 0 0 1-5.4 1.8A3 3 0 0 1 12 12a3 3 0 0 1-3.8-.2A3 3 0 0 1 2.8 10Z" /><path d="M10 19.5v-5h4v5" /></>,
  sparkles: <><path d="m12 3 1.7 4.3L18 9l-4.3 1.7L12 15l-1.7-4.3L6 9l4.3-1.7L12 3Z" /><path d="m18.5 15 .9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z" /></>,
  alert: <><path d="M12 4.2 2.8 20h18.4L12 4.2Z" /><path d="M12 10v4.2M12 17.2h.01" /></>,
  info: <><circle cx="12" cy="12" r="8.8" /><path d="M12 11v5.5M12 7.8h.01" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7" />,
  search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></>,
  user: <><circle cx="12" cy="8.2" r="3.7" /><path d="M4.8 20a7.2 7.2 0 0 1 14.4 0" /></>,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  package: <><path d="m12 2.8 8.5 4.4v9.6L12 21.2 3.5 16.8V7.2L12 2.8Z" /><path d="M3.7 7.3 12 11.7l8.3-4.4M12 11.7v9.4" /></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2.4" /><path d="M2.5 9.8h19M6 15h3.5" /></>,
  wallet: <><path d="M3.5 7.5A2 2 0 0 1 5.5 5.5h11a2 2 0 0 1 2 2v1" /><rect x="3.5" y="7.5" width="17" height="11.5" rx="2" /><path d="M16.5 13.2h1.8" /></>,
  message: <path d="M20.5 12.2c0 4-3.8 7.2-8.5 7.2a9.9 9.9 0 0 1-2.6-.3L4.5 21l1.2-3.4A6.8 6.8 0 0 1 3.5 12.2C3.5 8.2 7.3 5 12 5s8.5 3.2 8.5 7.2Z" />,
  refresh: <><path d="M20.5 12a8.5 8.5 0 1 1-2.6-6.1" /><path d="M20.5 4.5V10H15" /></>,
  thumbUp: <><path d="M7 10.5v9H4.5a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1H7Z" /><path d="M7 10.5 11.4 3a2.3 2.3 0 0 1 2.3 2.3V9h4.6a2 2 0 0 1 2 2.4l-1.2 6A2 2 0 0 1 17.1 19H7" /></>,
  filter: <path d="M3.5 5.5h17l-6.6 7.6v5.6l-3.8 2v-7.6L3.5 5.5Z" />,
  sort: <><path d="M7 4.5v15M7 19.5 4 16.5M7 19.5l3-3" /><path d="M17 19.5v-15M17 4.5l-3 3M17 4.5l3 3" /></>,
  eye: <><path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12Z" /><circle cx="12" cy="12" r="3" /></>,
  eyeOff: <><path d="M3.5 3.5 20.5 20.5" /><path d="M9.9 5.1A10.7 10.7 0 0 1 12 4.9c6 0 9.5 7.1 9.5 7.1s-1 1.9-2.9 3.7M6.4 6.4C4 8.1 2.5 11 2.5 12s3.5 7.1 9.5 7.1c1.6 0 3-.4 4.2-1" /><path d="M9.5 9.6a3 3 0 0 0 4.2 4.2" /></>,
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.4" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.4" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.4" /></>,
  move: <><path d="M12 3v18M3 12h18" /><path d="m12 3-2 2.2M12 3l2 2.2M12 21l-2-2.2M12 21l2-2.2M3 12l2.2-2M3 12l2.2 2M21 12l-2.2-2M21 12l-2.2 2" /></>,
  copy: <><rect x="8.5" y="8.5" width="12" height="12" rx="2" /><path d="M15.5 5.5v-1a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1" /></>,
  bolt: <path d="M13.5 2.5 4.8 13.2h5.4L9.9 21.5l8.9-10.9h-5.6l.3-8.1Z" />,
  phone: <><path d="M7.2 3.5H4.8A1.8 1.8 0 0 0 3 5.4c0 8.4 6.9 15.3 15.3 15.3a1.8 1.8 0 0 0 1.9-1.8v-2.4l-4.2-1.6-1.9 2a13.6 13.6 0 0 1-5.4-5.4l2-1.9L7.2 3.5Z" /></>,
  camera: <><path d="M3.5 8.8A1.8 1.8 0 0 1 5.3 7h2l1.3-2.2h6.8L16.7 7h2A1.8 1.8 0 0 1 20.5 8.8v9.4a1.8 1.8 0 0 1-1.8 1.8H5.3a1.8 1.8 0 0 1-1.8-1.8V8.8Z" /><circle cx="12" cy="13" r="3.6" /></>,
  scale: <><path d="M12 4v16M6 20h12" /><path d="M4 9h4l-2 4.5L4 9ZM16 9h4l-2 4.5L16 9Z" /><path d="M4 9 12 6.5 20 9" /></>,
  layers: <><path d="m12 3 8.5 4.4L12 11.8 3.5 7.4 12 3Z" /><path d="m3.5 12.2 8.5 4.4 8.5-4.4M3.5 16.6 12 21l8.5-4.4" /></>,
  droplet: <path d="M12 3.2s5.8 6 5.8 9.6a5.8 5.8 0 1 1-11.6 0C6.2 9.2 12 3.2 12 3.2Z" />,
} as const;

export type IconName = keyof typeof PATHS;

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  filled?: boolean;
  size?: number | string;
}

export function Icon({ name, filled = false, size = 20, className, strokeWidth = 1.6, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={filled ? 0 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PATHS[name]}
    </svg>
  );
}

export default Icon;
