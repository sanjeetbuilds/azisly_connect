import Avatar from './Avatar.jsx'
import JudgeControls from './JudgeControls.jsx'
import { ScoreValue } from './CandidateTable.jsx'
import { GATE, interviewStatus } from '../data/candidates.js'

/* The candidate's strongest assessed competencies, as compact bars. */
function TopCompetencies({ competencies = [] }) {
  const top = competencies
    .filter((c) => c.score != null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
  if (top.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      {top.map((c) => (
        <div key={c.name} className="flex items-center gap-2 text-[13px]">
          <span className="w-28 shrink-0 truncate text-secondary">{c.name}</span>
          <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-ink/[0.06]">
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
 * CandidateCard — the card-view tile. Shows avatar, score, verdict, and the top
 * competencies, and carries the same tick and cross controls as the list.
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
      className={`group flex cursor-pointer flex-col gap-4 rounded-xl border bg-surface p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel ${
        selected ? 'border-accent/40 ring-1 ring-accent/20' : 'border-hairline'
      } ${skipped ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={candidate.avatar} name={candidate.name} size={44} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
            <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-md bg-ink/[0.05] px-1.5 py-0.5 text-[12px] font-medium text-secondary">
          {interviewStatus(candidate)}
        </span>
      </div>

      <TopCompetencies competencies={candidate.competencies} />

      <div className="flex items-center justify-between border-t border-hairline pt-3.5">
        <ScoreValue candidate={candidate} size="lg" />
        {!disabled && (
          <JudgeControls picked={picked} skipped={skipped} onTick={onTick} onCross={onCross} />
        )}
      </div>
    </div>
  )
}
