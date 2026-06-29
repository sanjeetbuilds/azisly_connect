import { STAGE_TRACK } from '../data/candidates.js'

/**
 * StageTracker — a hiring-progress tracker for the top of a detail view.
 * A row of pill chips along the lifecycle milestones: Sourced, Invited,
 * Interviewing, Scored, Shared, Decision. Pass `current` as a milestone index
 * (see stageTrackIndex) so branch states map onto the right step.
 *
 *   done     subtle filled chip with a check
 *   current  highlighted in ink
 *   upcoming muted, hairline outline
 *
 * Strictly ink/greyscale, no verdict colours here.
 */
const Check = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-3 w-3">
    <path d="M3.5 8.5l2.8 2.8L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function StageTracker({ stages = STAGE_TRACK, current, className = '' }) {
  const currentIndex = typeof current === 'number' ? current : stages.indexOf(current)

  const chip = {
    done: 'bg-ink/[0.06] text-ink',
    current: 'bg-ink text-surface',
    upcoming: 'bg-transparent text-secondary border border-hairline',
  }

  return (
    <ol className={`flex items-center gap-1.5 overflow-x-auto ${className}`} aria-label="Hiring stage">
      {stages.map((stage, i) => {
        const status = i < currentIndex ? 'done' : i === currentIndex ? 'current' : 'upcoming'
        const isLast = i === stages.length - 1
        return (
          <li key={stage} className="flex shrink-0 items-center gap-1.5">
            <span
              aria-current={status === 'current' ? 'step' : undefined}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${chip[status]}`}
            >
              {status === 'done' && <Check />}
              {stage}
            </span>
            {!isLast && (
              <span
                aria-hidden="true"
                className={`h-px w-5 ${i < currentIndex ? 'bg-ink/25' : 'bg-hairline'}`}
              />
            )}
          </li>
        )
      })}
    </ol>
  )
}
