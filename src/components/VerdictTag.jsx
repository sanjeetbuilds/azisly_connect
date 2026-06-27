/**
 * VerdictTag — the ONLY coloured element in the entire interface.
 * Colour here carries meaning: a candidate's verdict.
 *
 *   strong       → green  (#2E7D55)
 *   look-closer  → amber  (#B7791F)
 */
const VERDICTS = {
  strong: {
    label: 'Strong',
    text: 'text-strong',
    dot: 'bg-strong',
    border: 'border-strong/30',
  },
  'look-closer': {
    label: 'Look closer',
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
