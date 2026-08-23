export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <clipPath id="logoCircleClip">
          <circle cx="50" cy="50" r="48" />
        </clipPath>
      </defs>
      <circle cx="50" cy="50" r="48" fill="#FAF8F5" />
      <circle cx="50" cy="50" r="48" fill="none" stroke="#2F4739" strokeWidth="4" />
      <g clipPath="url(#logoCircleClip)">
        <path
          d="M -5 70 L 20 48 L 33 58 L 42 42 L 50 42 L 58 58 L 67 48 L 80 60 L 105 70 L 105 105 L -5 105 Z"
          fill="#2F4739"
        />
        <rect x="-5" y="86" width="110" height="6" fill="#2A6F7F" />
        <rect x="-5" y="94" width="110" height="8" fill="#1F5158" />
      </g>
    </svg>
  )
}
