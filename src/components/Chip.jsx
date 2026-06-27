/**
 * Chip — a small toggleable category pill. Unselected: hairline outline, grey
 * text. Selected: a deliberate dark (ink) outline with ink text. Stays in the
 * greyscale palette — no fill, no colour.
 */
export default function Chip({ selected = false, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors ' +
        (selected
          ? 'border-ink text-ink'
          : 'border-hairline text-secondary hover:border-ink/30 hover:text-ink') +
        ' ' +
        className
      }
    >
      {children}
    </button>
  )
}
