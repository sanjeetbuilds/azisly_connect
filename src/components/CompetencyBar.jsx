/**
 * CompetencyBar — how a single competency is shown. (No radar charts.)
 * Name on the left, mono score on the right, an ink fill on a light track.
 */
export default function CompetencyBar({ name, score, max = 100, className = '' }) {
  const pct = Math.max(0, Math.min(100, (score / max) * 100))

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-ink">{name}</span>
        <span className="font-mono text-sm text-ink tabular-nums">{score}</span>
      </div>
      <div
        className="h-1 w-full rounded-full bg-track overflow-hidden"
        role="meter"
        aria-valuenow={score}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={name}
      >
        <div
          className="h-full rounded-full bg-bar transition-[width] duration-700 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
