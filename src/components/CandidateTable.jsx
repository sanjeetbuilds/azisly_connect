import { useState } from 'react'
import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import Tag, { skillColor } from './Tag.jsx'
import JudgeControls from './JudgeControls.jsx'
import { SortIcon, CheckIcon, MailIcon, ClockIcon } from './icons.jsx'
import { contactsFor } from '../data/candidates.js'

/* The header select-all tick. */
function SelectAll({ checked, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      aria-label="Select all eligible"
      title="Select all"
      className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border transition-colors ${
        disabled
          ? 'cursor-not-allowed border-hairline bg-background text-secondary/40'
          : checked
            ? 'border-accent bg-accent text-surface'
            : 'border-hairline bg-surface text-secondary hover:border-accent hover:text-accent'
      }`}
    >
      <CheckIcon className="h-3 w-3" />
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

/* A quick-copy of the candidate's email, shown on taken-forward rows. */
export function ContactCopy({ candidate }) {
  const [copied, setCopied] = useState(false)
  const { email } = contactsFor(candidate.name)
  return (
    <button
      type="button"
      aria-label="Copy email"
      title={copied ? 'Copied' : `Copy ${email}`}
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard?.writeText(email).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex h-[22px] items-center gap-1 rounded-full border border-hairline bg-surface pl-1.5 pr-2 text-[11px] font-medium text-secondary transition-colors hover:border-strong/40 hover:text-strong"
    >
      {copied ? <CheckIcon className="h-3 w-3 text-strong" /> : <MailIcon className="h-3 w-3" />}
      {copied ? 'Copied' : 'Email'}
    </button>
  )
}

/* Status — one neutral grey style for every state, except the amber Needs human
   flag and the pending "With hiring manager" marker. */
function StatusCell({ candidate }) {
  if (candidate.stage === 'Needs human') {
    return (
      <div className="flex flex-col gap-0.5">
        <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-attention">
          <span className="h-1.5 w-1.5 rounded-full bg-attention" />
          Needs human
        </span>
        {candidate.gate && (
          <span className="text-[11px] text-secondary">
            Gate: {candidate.gate.competency} {candidate.gate.score}
          </span>
        )}
      </div>
    )
  }
  if (candidate.stage === 'Shared') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] text-secondary">
        <ClockIcon className="h-3.5 w-3.5" />
        With hiring manager
      </span>
    )
  }
  if (candidate.stage === 'Moving forward') {
    return (
      <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-strong">
        <CheckIcon className="h-3.5 w-3.5" />
        Moving forward
      </span>
    )
  }
  return <span className="text-[13px] text-secondary">{candidate.stage}</span>
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
 * CandidateTable — a dense table that follows the workflow. Checkboxes are only
 * enabled for rows eligible for the active action; ineligible ones show a quiet
 * reason on hover. Verdict carries colour (green/grey/amber); status is one
 * neutral grey, except the amber Needs human flag.
 */
export default function CandidateTable({
  candidates,
  selectedId,
  onSelect,
  sort,
  onSort,
  picked,
  skipped,
  onTick,
  onCross,
  onToggleAll,
  eligibility = () => ({ ok: true }),
  isNew = () => false,
}) {
  const eligible = candidates.filter((c) => eligibility(c).ok)
  const allChecked = eligible.length > 0 && eligible.every((c) => picked.has(c.id))

  return (
    <div className="min-w-[780px]">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-hairline bg-background/60 px-5 py-2">
        <div className="w-[58px] shrink-0">
          <SelectAll checked={allChecked} disabled={eligible.length === 0} onClick={onToggleAll} />
        </div>
        <HeaderCell className="min-w-0 flex-1" sortable sortKey="name" sort={sort} onSort={onSort}>
          Candidate
        </HeaderCell>
        <div className="hidden w-[190px] shrink-0 text-xs text-secondary xl:block">Skills</div>
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
        <div className="w-[110px] shrink-0 text-xs text-secondary">Verdict</div>
        <div className="w-[124px] shrink-0 text-xs text-secondary">Status</div>
      </div>

      {/* Rows */}
      <div>
        {candidates.map((c, index) => {
          const elig = eligibility(c)
          const isPicked = picked.has(c.id)
          const isSkipped = skipped.has(c.id)
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
              className={`flex w-full cursor-pointer items-center gap-4 border-b border-hairline px-5 py-2 text-left transition-colors last:border-b-0 ${
                open
                  ? 'bg-accent/[0.05]'
                  : isPicked
                    ? 'bg-accent/[0.03]'
                    : isSkipped
                      ? 'bg-background opacity-55'
                      : c.stage === 'Taken forward' || c.stage === 'Moving forward'
                        ? 'bg-strong/[0.07] hover:bg-strong/[0.1]'
                        : 'hover:bg-background'
              }`}
            >
              <div className="flex w-[58px] shrink-0 items-center">
                {elig.ok ? (
                  <JudgeControls
                    picked={isPicked}
                    skipped={isSkipped}
                    onTick={(e) => onTick(c.id, index, e.shiftKey)}
                    onCross={() => onCross(c.id)}
                  />
                ) : c.stage === 'Taken forward' || c.stage === 'Moving forward' ? (
                  <ContactCopy candidate={c} />
                ) : null}
              </div>

              <div className="flex min-w-0 flex-1 items-center gap-3">
                <Avatar src={c.avatar} name={c.name} size={32} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm font-medium text-ink">{c.name}</span>
                    {isNew(c) && (
                      <span className="shrink-0 rounded-full bg-info/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-info">
                        New
                      </span>
                    )}
                  </div>
                  <div className="truncate text-[13px] text-secondary">{c.role}</div>
                </div>
              </div>

              {/* Skills — muted grey, quiet */}
              <div className="hidden w-[190px] shrink-0 truncate text-[13px] text-secondary xl:block">
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

              {/* Verdict — the only coloured status signal */}
              <div className="w-[110px] shrink-0">{c.verdict && <VerdictTag verdict={c.verdict} />}</div>

              {/* Status — neutral grey, or the amber Needs human flag */}
              <div className="w-[124px] shrink-0">
                <StatusCell candidate={c} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
