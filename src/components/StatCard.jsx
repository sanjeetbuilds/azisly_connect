import Card from './Card.jsx'

/**
 * StatCard — the reference's summary tile: a small tinted icon square with a
 * label, a large bold number, and an optional delta pill plus context line.
 *
 * tone tints the icon square: accent (green), amber, danger, neutral.
 */
const TONES = {
  accent: 'bg-accent-soft text-strong',
  amber: 'bg-warning-soft text-attention',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-ink/[0.04] text-secondary',
}

export default function StatCard({ icon, label, value, delta, deltaTone = 'accent', context, tone = 'accent' }) {
  const deltaClass =
    deltaTone === 'danger'
      ? 'bg-danger-soft text-danger'
      : deltaTone === 'amber'
        ? 'bg-warning-soft text-attention'
        : 'bg-accent-soft text-strong'
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center gap-2.5">
        {icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone] ?? TONES.accent}`}>
            {icon}
          </span>
        )}
        <span className="text-sm font-medium text-secondary">{label}</span>
      </div>
      <div className="flex items-end justify-between gap-3">
        <span className="text-[32px] font-bold leading-none text-ink tabular-nums">{value}</span>
      </div>
      <div className="flex items-center gap-2">
        {delta != null && (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${deltaClass}`}>
            {delta}
          </span>
        )}
        {context && <span className="text-[13px] text-secondary">{context}</span>}
      </div>
    </Card>
  )
}
