/**
 * VerdictTag — the engine's verdict, the one place colour carries meaning.
 *
 *   clears        (clears the bar)              → green
 *   clears-light  (clears, lighter on a craft)  → green, softened (still a pass)
 *   below         (below the bar)               → failure colour, the only red
 *
 * The full label ("Clears the bar, lighter on Product craft" / "Below the bar,
 * Communication") is passed in as children; the map carries the default word and
 * the colour.
 */
const VERDICTS = {
  clears: {
    label: 'Clears the bar',
    text: 'text-strong',
    dot: 'bg-strong',
    border: 'border-strong/30',
  },
  'clears-light': {
    label: 'Clears the bar',
    text: 'text-strong',
    dot: 'bg-strong/40',
    border: 'border-strong/20',
  },
  below: {
    label: 'Below the bar',
    text: 'text-danger',
    dot: 'bg-danger',
    border: 'border-danger/30',
  },
}

export default function VerdictTag({ verdict = 'clears', children, className = '' }) {
  const v = VERDICTS[verdict] ?? VERDICTS.clears

  return (
    <span
      className={
        `inline-flex items-center gap-1.5 rounded-full border ${v.border} ` +
        `px-2.5 py-1 text-xs font-medium ${v.text} ${className}`
      }
    >
      <span className={`h-1.5 w-1.5 rounded-full ${v.dot}`} aria-hidden="true" />
      {children ?? v.label}
    </span>
  )
}
