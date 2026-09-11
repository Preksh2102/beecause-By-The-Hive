/**
 * Small hand-drawn marks that echo the imperfect character of the logo.
 * Used sparingly — never as decoration for its own sake.
 */

export function ScribbleUnderline({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 300 18"
      fill="none"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M3 12.5c48-7 96-9.5 143-7.5 45 2 90 6.5 151 3"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ImperfectCircle({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 140" fill="none" className={className}>
      <path
        d="M126 6C64 3 8 30 6 71c-2 41 61 65 121 63 57-2 108-24 107-63C233 30 181 8 126 6Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="0.1 0"
        opacity="0.75"
      />
    </svg>
  );
}

export function HandArrow({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 60 26" fill="none" className={className}>
      <path
        d="M2 14c14-2 34-3 54-2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M45 5c4.5 3.6 8 6.2 11 7-3.4 1.6-6.6 4.2-9.6 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function OrganicLine({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 60"
      fill="none"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M2 40C120 8 210 52 330 30 450 8 520 50 640 34c60-8 110-20 158-26"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Asterisk({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 4v32M7 11l26 18M33 11 7 29"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
