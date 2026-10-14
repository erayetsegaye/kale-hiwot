import { cn } from '@/lib/utils';

/**
 * Lightweight illustrated "photography" panels.
 *
 * The reference design leans on large warm nature photography. Rather than
 * shipping stock images we render layered SVG scenes built from the brand
 * palette — same visual weight, zero image payload, fully themeable.
 */
export function Scene({
  variant = 'sanctuary',
  className,
  children,
}: {
  variant?: 'sanctuary' | 'classroom' | 'camp' | 'family';
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-brand-900', className)}>
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 size-full"
        aria-hidden
      >
        <defs>
          <linearGradient id={`sky-${variant}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f6f0dd" />
            <stop offset="45%" stopColor="#dfe9cd" />
            <stop offset="100%" stopColor="#a8c686" />
          </linearGradient>
          <radialGradient id={`sun-${variant}`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#fff5d6" />
            <stop offset="60%" stopColor="#ffe9ad" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#ffe9ad" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="800" height="500" fill={`url(#sky-${variant})`} />
        <circle cx="560" cy="130" r="150" fill={`url(#sun-${variant})`} />
        <circle cx="560" cy="130" r="42" fill="#fff6dc" />

        {/* distant hills */}
        <path d="M0 250 Q 150 170 300 240 T 620 215 T 800 260 V500 H0Z" fill="#7faa5b" opacity="0.55" />
        <path d="M0 300 Q 180 230 360 295 T 800 290 V500 H0Z" fill="#5c8f3f" opacity="0.75" />

        {variant === 'sanctuary' ? (
          <g>
            {/* church silhouette */}
            <rect x="330" y="300" width="150" height="110" rx="8" fill="#2f5d2a" />
            <path d="M330 300 L405 240 L480 300 Z" fill="#244722" />
            <rect x="398" y="186" width="14" height="60" rx="4" fill="#244722" />
            <rect x="384" y="204" width="42" height="13" rx="5" fill="#244722" />
            <rect x="372" y="345" width="30" height="65" rx="14" fill="#f3f8ec" opacity="0.85" />
            <rect x="420" y="340" width="26" height="36" rx="12" fill="#f3f8ec" opacity="0.6" />
          </g>
        ) : null}

        {variant === 'classroom' ? (
          <g>
            <rect x="300" y="286" width="210" height="130" rx="16" fill="#2f5d2a" />
            <rect x="322" y="306" width="166" height="74" rx="10" fill="#f3f8ec" opacity="0.9" />
            <circle cx="360" cy="343" r="13" fill="#5c8f3f" />
            <rect x="386" y="330" width="80" height="9" rx="4" fill="#a8c686" />
            <rect x="386" y="348" width="56" height="9" rx="4" fill="#c9e1ad" />
          </g>
        ) : null}

        {variant === 'camp' ? (
          <g>
            <path d="M300 410 L370 290 L440 410 Z" fill="#2f5d2a" />
            <path d="M370 290 L440 410 L408 410 Z" fill="#244722" />
            <path d="M450 410 L510 310 L570 410 Z" fill="#3f7330" opacity="0.9" />
            <circle cx="250" cy="395" r="18" fill="#d98b2b" opacity="0.8" />
          </g>
        ) : null}

        {variant === 'family' ? (
          <g>
            <circle cx="360" cy="330" r="30" fill="#2f5d2a" />
            <path d="M310 410 q50 -60 100 0 Z" fill="#2f5d2a" />
            <circle cx="446" cy="352" r="22" fill="#3f7330" />
            <path d="M408 410 q38 -45 76 0 Z" fill="#3f7330" />
            <circle cx="506" cy="366" r="16" fill="#5c8f3f" />
            <path d="M478 410 q28 -32 56 0 Z" fill="#5c8f3f" />
          </g>
        ) : null}

        {/* foreground trees */}
        <g fill="#1a331a">
          <path d="M60 420 q18 -120 46 -150 q28 30 46 150 Z" opacity="0.85" />
          <path d="M700 430 q16 -110 42 -138 q26 28 42 138 Z" opacity="0.8" />
        </g>
        <path d="M0 400 Q 200 360 420 400 T 800 395 V500 H0Z" fill="#274a20" />
      </svg>
      {children ? <div className="relative">{children}</div> : null}
    </div>
  );
}
