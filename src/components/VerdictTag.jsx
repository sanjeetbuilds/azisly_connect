/**
 * VerdictTag — the engine's verdict, the one place colour carries meaning.
 *
 *   strong     (recommend) → green
 *   promising             → neutral grey (NOT green, NOT amber)
 *   not-yet               → amber
 */
const VERDICTS = {
  strong: {
    label: 'Strong',
    text: 'text-strong',
    dot: 'bg-strong',
    border: 'border-strong/30',
  },
  promising: {
    label: 'Promising',
    text: 'text-secondary',
    dot: 'bg-secondary',
    border: 'border-hairline',
  },
  'not-yet': {
    label: 'Not yet',
    text: 'text-attention',
    dot: 'bg-attention',
    border: 'border-attention/30',
  },
}

export default function VerdictTag({ verdict = 'strong', children, className = '' }) {
  const v = VERDICTS[verdict] ?? VERDICTS.strong

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
