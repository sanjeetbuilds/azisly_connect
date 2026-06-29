import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import Tag from './Tag.jsx'
import { SkillTags } from './CandidateTable.jsx'
import { SOURCES } from '../data/candidates.js'

/**
 * CandidateCard — the grid-view tile. Lifts on hover (elevation) to read as a
 * surface that floats above the canvas.
 */
export default function CandidateCard({ candidate, selected = false, onSelect }) {
  const src = SOURCES[candidate.source]
  return (
    <button
      type="button"
      onClick={() => onSelect(candidate.id)}
      aria-current={selected ? 'true' : undefined}
      className={`group flex flex-col gap-4 rounded-xl border bg-surface p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel ${
        selected ? 'border-accent/40 ring-1 ring-accent/20' : 'border-hairline'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={candidate.avatar} name={candidate.name} size={44} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
            <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
          </div>
        </div>
        {candidate.verdict ? (
          <VerdictTag verdict={candidate.verdict} />
        ) : (
          <Tag color="gray">{candidate.stage}</Tag>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <SkillTags skills={candidate.skills} max={3} />
      </div>

      <div className="flex items-center justify-between border-t border-hairline pt-3.5">
        <div className="flex items-center gap-2 text-[13px] text-secondary">
          {src && <Tag color={src.color}>{src.label}</Tag>}
          <span>{candidate.location}</span>
        </div>
        <span className="font-mono text-lg leading-none text-ink tabular-nums">
          {candidate.score ?? <span className="text-base text-secondary">·</span>}
        </span>
      </div>
    </button>
  )
}
