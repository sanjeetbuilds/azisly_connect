/**
 * Tooltip — a small designed tooltip on hover/focus: a rounded card with a soft
 * shadow, our fonts, and a little pointer. Pure CSS reveal, so it stays cheap
 * per row. Positioned above the trigger and centered.
 */
export default function Tooltip({ label, children, className = '' }) {
  return (
    <span className={`group/tt relative inline-flex ${className}`} tabIndex={0}>
      {children}
      <span className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity duration-150 group-hover/tt:opacity-100 group-focus/tt:opacity-100">
        <span className="relative block w-max max-w-[230px] rounded-lg border border-hairline bg-surface px-3 py-2 text-left text-[12px] font-medium leading-snug text-secondary shadow-dropdown">
          {label}
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-full h-2.5 w-2.5 -translate-x-1/2 -translate-y-[6px] rotate-45 border-b border-r border-hairline bg-surface"
          />
        </span>
      </span>
    </span>
  )
}
