const STROKE = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const ICONS = {
  mapPin: (
    <g {...STROKE}>
      <path d="M12 21s-7-6.1-7-11.5a7 7 0 0 1 14 0C19 14.9 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </g>
  ),
  copy: (
    <g {...STROKE}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
    </g>
  ),
  check: <path {...STROKE} d="M5 12.5l4.5 4.5L19 7.5" />,
  code: <path {...STROKE} d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />,
  layers: (
    <g {...STROKE}>
      <path d="M12 3 2 8l10 5 10-5-10-5z" />
      <path d="m2 12.5 10 5 10-5M2 17l10 5 10-5" />
    </g>
  ),
  database: (
    <g {...STROKE}>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </g>
  ),
  cpu: (
    <g {...STROKE}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="0.5" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </g>
  ),
  sparkles: (
    <path
      {...STROKE}
      d="M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8L11 3zM18.5 15l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z"
    />
  ),
  target: (
    <g {...STROKE}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </g>
  ),
  sliders: (
    <g {...STROKE}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="18" cy="18" r="2" />
    </g>
  ),
  headset: (
    <g {...STROKE}>
      <path d="M4 15v-3a8 8 0 0 1 16 0v3" />
      <rect x="3" y="14" width="4" height="6" rx="1.5" />
      <rect x="17" y="14" width="4" height="6" rx="1.5" />
      <path d="M19 20a3 3 0 0 1-3 2h-3" />
    </g>
  ),
  users: (
    <g {...STROKE}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14.5a6.5 6.5 0 0 1 3.5 5.5" />
    </g>
  ),
  bolt: <path {...STROKE} d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />,
  chevronRight: <path {...STROKE} d="m9 6 6 6-6 6" />,
  arrowRight: <path {...STROKE} d="M5 12h14M13 6l6 6-6 6" />,
  arrowUpRight: <path {...STROKE} d="M7 17 17 7M8 7h9v9" />,
  arrowUp: <path {...STROKE} d="M12 19V5M6 11l6-6 6 6" />,
  close: <path {...STROKE} d="M6 6l12 12M18 6 6 18" />,
};

export type IconName = keyof typeof ICONS;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 18, className }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
