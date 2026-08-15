export default function Logo({ className = 'h-8 w-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-label="Flipscale">
      <defs>
        <linearGradient id="fs-teal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2DD4BF" />
          <stop offset="100%" stopColor="#0F3D3E" />
        </linearGradient>
        <linearGradient id="fs-amber" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
      <path d="M14 27v-5c0-3.9 3.1-7 7-7h15" stroke="url(#fs-teal)" strokeWidth="7" strokeLinecap="round" />
      <path d="M14 47v-9c0-3.9 3.1-7 7-7h11" stroke="url(#fs-teal)" strokeWidth="7" strokeLinecap="round" />
      <path d="M22 47c9 3 17 0 23-7" stroke="url(#fs-teal)" strokeWidth="6" strokeLinecap="round" />
      <path d="M35 45c9-6 15-14 19-24" stroke="url(#fs-amber)" strokeWidth="7" strokeLinecap="round" />
      <path d="M46 20l10-6-1 12z" fill="url(#fs-amber)" />
      <rect x="36" y="27" width="6.5" height="6.5" rx="1.5" fill="url(#fs-teal)" />
      <rect x="42" y="17" width="6.5" height="6.5" rx="1.5" fill="url(#fs-amber)" />
    </svg>
  );
}