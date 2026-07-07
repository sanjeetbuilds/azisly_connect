import Avatar from './Avatar.jsx'
import StatusPill from './StatusPill.jsx'
import JudgeControls from './JudgeControls.jsx'
import Scores from './Scores.jsx'
import { GATE, interviewStatus } from '../data/candidates.js'

/* The candidate's strongest assessed competencies, as compact bars. */
function TopCompetencies({ competencies = [] }) {
  const top = competencies
    .filter((c) => c.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  if (top.length === 0) {
    return <p className="text-[13px] text-secondary">Competencies appear once the interview is scored.</p>
  }
  return (
    <div className="flex flex-col gap-1.5">
      {top.map((c) => (
        <div key={c.name} className="flex items-center gap-2 text-[13px]">
          <span className="w-28 shrink-0 truncate text-secondary">{c.name}</span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-track">
            <span
              className={`absolute inset-y-0 left-0 rounded-full ${c.score < GATE ? 'bg-attention' : 'bg-strong'}`}
              style={{ width: `${c.score}%` }}
            />
          </span>
          <span className="w-6 shrink-0 text-right font-mono text-ink tabular-nums">{c.score}</span>
        </div>
      ))}
    </div>
  )
}

/**
 * CandidateCard — the grid-view tile. Shows identity, the top competencies, the
 * three labelled scores, and the same tick/cross controls as the list.
 */
export default function CandidateCard({
  candidate,
  selected = false,
  onSelect,
  picked,
  skipped,
  disabled,
  reason,
  onTick,
  onCross,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(candidate.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(candidate.id)
        }
      }}
      aria-current={selected ? 'true' : undefined}
      className={`group flex cursor-pointer flex-col gap-4 rounded-card border bg-surface p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel ${
        selected ? 'border-accent/40 ring-1 ring-accent/20' : 'border-hairline'
      } ${skipped ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar name={candidate.name} size={44} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
            <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
          </div>
        </div>
        <StatusPill label={interviewStatus(candidate)} />
      </div>

      <TopCompetencies competencies={candidate.competencies} />

      <div className="flex items-center justify-between gap-3 border-t border-hairline pt-4">
        <Scores candidate={candidate} variant="inline" />
        {!disabled ? (
          <JudgeControls picked={picked} skipped={skipped} onTick={onTick} onCross={onCross} />
        ) : (
          reason && <span className="shrink-0 text-[12px] text-secondary">{reason}</span>
        )}
      </div>
    </div>
  )
}
