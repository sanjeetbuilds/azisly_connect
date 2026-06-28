import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import Tag, { skillColor } from './Tag.jsx'
import { SortIcon, CheckIcon } from './icons.jsx'
import { SOURCES } from '../data/candidates.js'

/* A square checkbox used in select mode. */
function CheckBox({ checked }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-md border transition-colors ${
        checked ? 'border-accent bg-accent text-surface' : 'border-hairline bg-surface'
      }`}
    >
      {checked && <CheckIcon className="h-3 w-3" />}
    </span>
  )
}

/* A row of skill tags with a "+N" overflow chip. */
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
 * CandidateTable — a dense, aligned data table: candidate, skills, source,
 * stage, applied, score, verdict, with a sortable header row.
 */
export default function CandidateTable({
  candidates,
  selectedId,
  onSelect,
  sort,
  onSort,
  selectable = false,
  picked,
  onToggle,
  onToggleAll,
}) {
  const allChecked = selectable && candidates.length > 0 && candidates.every((c) => picked.has(c.id))
  return (
    <div className="min-w-[860px]">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-hairline bg-background/60 px-5 py-2.5">
        {selectable && (
          <button type="button" onClick={onToggleAll} aria-label="Select all" className="shrink-0">
            <CheckBox checked={allChecked} />
          </button>
        )}
        <HeaderCell className="min-w-0 flex-1" sortable sortKey="name" sort={sort} onSort={onSort}>
          Candidate
        </HeaderCell>
        <div className="hidden w-[180px] shrink-0 text-xs text-secondary xl:block">Skills</div>
        <div className="hidden w-[112px] shrink-0 text-xs text-secondary lg:block">Source</div>
        <div className="hidden w-[110px] shrink-0 text-xs text-secondary md:block">Stage</div>
        <HeaderCell
          className="hidden w-[78px] shrink-0 lg:flex"
          sortable
          sortKey="applied"
          sort={sort}
          onSort={onSort}
        >
          Applied
        </HeaderCell>
        <HeaderCell
          className="w-[60px] shrink-0"
          align="right"
          sortable
          sortKey="score"
          sort={sort}
          onSort={onSort}
        >
          Score
        </HeaderCell>
        <div className="w-[116px] shrink-0 text-xs text-secondary">Verdict</div>
      </div>

      {/* Rows */}
      <div>
        {candidates.map((c) => {
          const isPicked = selectable && picked.has(c.id)
          const selected = selectable ? isPicked : c.id === selectedId
          const src = SOURCES[c.source]
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => (selectable ? onToggle(c.id) : onSelect(c.id))}
              aria-current={selected ? 'true' : undefined}
              className={`flex w-full items-center gap-4 border-b border-hairline px-5 py-3 text-left transition-colors last:border-b-0 ${
                selected ? 'bg-accent/[0.05]' : 'hover:bg-background'
              }`}
            >
              {selectable && <CheckBox checked={isPicked} />}
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar src={c.avatar} name={c.name} size={36} />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">{c.name}</div>
                  <div className="truncate text-[13px] text-secondary">
                    {c.role} · {c.location}
                  </div>
                </div>
              </div>

              <div className="hidden w-[180px] shrink-0 xl:block">
                <SkillTags skills={c.skills} max={2} />
              </div>
              <div className="hidden w-[112px] shrink-0 lg:block">
                {src && <Tag color={src.color}>{src.label}</Tag>}
              </div>
              <div className="hidden w-[110px] shrink-0 text-[13px] text-secondary md:block">{c.stage}</div>
              <div className="hidden w-[78px] shrink-0 text-[13px] text-secondary lg:block">{c.applied}</div>
              <div className="w-[60px] shrink-0 text-right font-mono text-sm text-ink tabular-nums">
                {c.score}
              </div>
              <div className="w-[116px] shrink-0">
                <VerdictTag verdict={c.verdict} />
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
