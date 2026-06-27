import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'

/* Selection indicator — a small radio that fills to an ink check when chosen.
   Sits in the corner of a selectable card. */
function SelectIndicator({ selected }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors ${
        selected ? 'border-ink bg-ink text-surface' : 'border-hairline bg-surface'
      }`}
    >
      {selected && (
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-2.5 w-2.5">
          <path d="M3.5 8.5l2.8 2.8L12.5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  )
}

/**
 * CandidateRow — a master-list row.
 *
 *   variant="rich"    — a comfortable, full-length card: avatar, name, role,
 *                       key info (experience · location), mono score, verdict,
 *                       and a corner selection indicator.
 *   variant="compact" — condensed for the narrow column once a detail is open:
 *                       just avatar + name + score.
 */
export default function CandidateRow({ candidate, variant = 'rich', selected = false, onClick }) {
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-current={selected ? 'true' : undefined}
        className={`flex w-full items-center gap-2.5 rounded-card border px-2.5 py-2 text-left transition-colors ${
          selected ? 'border-hairline bg-surface' : 'border-transparent hover:bg-surface'
        }`}
      >
        <Avatar src={candidate.avatar} name={candidate.name} size={30} />
        <span className="min-w-0 flex-1 truncate text-sm text-ink">{candidate.name}</span>
        <span className="font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      className={`relative flex w-full items-center gap-4 rounded-card border bg-surface px-4 py-4 pr-12 text-left transition-colors ${
        selected ? 'border-ink' : 'border-hairline hover:border-ink/30'
      }`}
    >
      <Avatar src={candidate.avatar} name={candidate.name} size={48} />

      <div className="min-w-0 flex-1">
        <span className="block truncate text-[15px] text-ink">{candidate.name}</span>
        <p className="truncate text-sm text-secondary">{candidate.role}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.1em] text-secondary">
          {candidate.experience} · {candidate.location}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="font-mono text-lg leading-none text-ink tabular-nums">{candidate.score}</span>
        <VerdictTag verdict={candidate.verdict} />
      </div>

      <span className="absolute right-4 top-4">
        <SelectIndicator selected={selected} />
      </span>
    </button>
  )
}
