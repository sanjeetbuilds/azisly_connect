import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'

/**
 * CandidateRow — one row in the master list: avatar, name, role, then the
 * mono ink score with its verdict tag. Selecting it opens the detail pane.
 */
export default function CandidateRow({ candidate, selected = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      className={`flex w-full items-center gap-3 rounded-card border px-3 py-3 text-left transition-colors ${
        selected
          ? 'border-hairline bg-surface'
          : 'border-transparent hover:bg-surface'
      }`}
    >
      <Avatar src={candidate.avatar} name={candidate.name} size={40} />

      <div className="min-w-0 flex-1">
        <span className="block truncate text-[15px] text-ink">{candidate.name}</span>
        <span className="block truncate text-sm text-secondary">{candidate.role}</span>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
        <VerdictTag verdict={candidate.verdict} />
      </div>
    </button>
  )
}
