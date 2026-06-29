import { GATE } from '../data/candidates.js'

/**
 * CompetencyBar — one competency as a horizontal bar on a light neutral track.
 * The filled portion carries the verdict colour: green for a healthy score,
 * amber when it falls below the gate threshold. A competency that was not asked
 * shows "Not assessed" with no fill, and is never rendered as 0.
 */
export default function CompetencyBar({ name, score, gate = GATE, max = 100, className = '' }) {
  const assessed = score != null
  const pct = assessed ? Math.max(3, Math.min(100, (score / max) * 100)) : 0
  const weak = assessed && score < gate
  const fill = weak ? 'bg-attention' : 'bg-strong'

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-ink">{name}</span>
        {assessed ? (
          <span className="font-mono text-sm text-ink tabular-nums">{score}</span>
        ) : (
          <span className="text-[13px] text-secondary">Not assessed</span>
        )}
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-ink/[0.06]"
        role="meter"
        aria-valuenow={assessed ? score : undefined}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={name}
      >
        {assessed && (
          <div
            className={`h-full rounded-full ${fill} transition-[width] duration-700 ease-out`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
    </div>
  )
}
