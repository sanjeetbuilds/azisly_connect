import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import Tag, { skillColor } from './Tag.jsx'
import { SortIcon, CheckIcon } from './icons.jsx'
import { STAGE_META } from '../data/candidates.js'

/* A square checkbox. As a button so it can sit inside a clickable row. */
function CheckBox({ checked, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={checked}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked ? 'border-accent bg-accent text-surface' : 'border-hairline bg-surface hover:border-ink/30'
      }`}
    >
      {checked && <CheckIcon className="h-3 w-3" />}
    </button>
  )
}

/* A row of skill tags with a "+N" overflow chip — kept for the grid card. */
export function SkillTags({ skills, max = 2 }) {
  const shown = skills.slice(0, max)
  const extra = skills.length - shown.length
  return (
    <div className="flex flex-wrap items-center gap-1">
      {shown.map((s) => (
        <Tag key={s} color={skillColor(s)}>
          {s}
        </Tag>
      ))}
      {extra > 0 && <Tag color="gray">+{extra}</Tag>}
    </div>
  )
}

/* A small grey confidence meter that sits beside the score. */
function ConfidenceMeter({ value }) {
  if (value == null) return <span className="text-[13px] text-secondary">·</span>
  return (
    <span className="inline-flex items-center" title={`${value}% confidence`}>
      <span className="relative h-1.5 w-9 overflow-hidden rounded-full bg-ink/[0.08]">
        <span
          className="absolute inset-y-0 left-0 rounded-full bg-ink/35"
          style={{ width: `${value}%` }}
        />
      </span>
    </span>
  )
}

function HeaderCell({ children, className = '', sortable, sortKey, sort, onSort, align = 'left' }) {
  const isActive = sort?.key === sortKey
  const justify = align === 'right' ? 'justify-end' : 'justify-start'
  if (!sortable) {
    return <div className={`${className} text-xs text-secondary`}>{children}</div>
  }
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={`${className} flex items-center gap-1 ${justify} text-xs transition-colors ${
        isActive ? 'text-ink' : 'text-secondary hover:text-ink'
      }`}
    >
      {children}
      <SortIcon dir={isActive ? sort.dir : null} className={`h-3 w-3 ${isActive ? 'text-accent' : ''}`} />
    </button>
  )
}

/**
 * CandidateTable — a dense, aligned data table that follows the workflow:
 * candidate, quiet skills, confidence meter, score, verdict (fixed-width so
 * pills align), and the lifecycle status. Source and applied date live in the
 * detail overlay, not on the row. Every row carries a selection checkbox.
 */
export default function CandidateTable({
  candidates,
  selectedId,
  onSelect,
  sort,
  onSort,
  picked,
  onToggle,
  onToggleAll,
}) {
  const allChecked = candidates.length > 0 && candidates.every((c) => picked.has(c.id))
  return (
    <div className="min-w-[760px]">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-hairline bg-background/60 px-5 py-2.5">
        <CheckBox checked={allChecked} onClick={onToggleAll} label="Select all" />
        <HeaderCell className="min-w-0 flex-1" sortable sortKey="name" sort={sort} onSort={onSort}>
          Candidate
        </HeaderCell>
        <div className="hidden w-[200px] shrink-0 text-xs text-secondary xl:block">Skills</div>
        <div className="hidden w-[56px] shrink-0 text-xs text-secondary lg:block">Confidence</div>
        <HeaderCell
          className="w-[48px] shrink-0"
          align="right"
          sortable
          sortKey="score"
          sort={sort}
          onSort={onSort}
        >
          Score
        </HeaderCell>
        <div className="w-[116px] shrink-0 text-xs text-secondary">Verdict</div>
        <div className="w-[112px] shrink-0 text-xs text-secondary">Status</div>
      </div>

      {/* Rows */}
      <div>
        {candidates.map((c) => {
          const isPicked = picked.has(c.id)
          const open = c.id === selectedId
          const extra = c.skills.length - 2
          return (
            <div
              key={c.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(c.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelect(c.id)
                }
              }}
              aria-current={open ? 'true' : undefined}
              className={`flex w-full cursor-pointer items-center gap-4 border-b border-hairline px-5 py-3 text-left transition-colors last:border-b-0 ${
                open ? 'bg-accent/[0.05]' : isPicked ? 'bg-accent/[0.03]' : 'hover:bg-background'
              }`}
            >
              <CheckBox
                checked={isPicked}
                onClick={(e) => {
                  e.stopPropagation()
                  onToggle(c.id)
                }}
                label={`Select ${c.name}`}
              />

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar src={c.avatar} name={c.name} size={36} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">{c.name}</div>
                  <div className="truncate text-[13px] text-secondary">{c.role}</div>
                </div>
              </div>

              {/* Skills — muted grey, quiet */}
              <div className="hidden w-[200px] shrink-0 truncate text-[13px] text-secondary xl:block">
                {c.skills.slice(0, 2).join(', ')}
                {extra > 0 ? `, +${extra}` : ''}
              </div>

              {/* Confidence — small grey meter beside the score */}
              <div className="hidden w-[56px] shrink-0 lg:block">
                <ConfidenceMeter value={c.confidence} />
              </div>

              {/* Score — ink, right-aligned */}
              <div className="w-[48px] shrink-0 text-right font-mono text-sm text-ink tabular-nums">
                {c.score ?? <span className="text-secondary">·</span>}
              </div>

              {/* Verdict — fixed-width so pills align */}
              <div className="w-[116px] shrink-0">{c.verdict && <VerdictTag verdict={c.verdict} />}</div>

              {/* Status — the lifecycle state */}
              <div className="w-[112px] shrink-0">
                <Tag color={STAGE_META[c.stage]?.color ?? 'gray'}>{c.stage}</Tag>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
