import Avatar from './Avatar.jsx'
import Tag, { skillColor } from './Tag.jsx'
import Tooltip from './Tooltip.jsx'
import VerdictTag from './VerdictTag.jsx'
import { ScoreValue, InterviewScoreValue } from './Scores.jsx'
import { CheckIcon } from './icons.jsx'
import { topExperienceOf } from '../data/candidates.js'

const MATCH_EXPLAINER = 'Match score: how well this candidate fits the role on paper, before the interview.'

// Pick whole skill chips that fit the budget; the rest become "+N". Never crop a
// chip mid-word.
function fitSkills(skills, budget) {
  const est = (s) => s.length * 6.6 + 18
  const shown = []
  let used = 0
  for (const s of skills) {
    const w = est(s) + (shown.length ? 4 : 0)
    if (used + w > budget) break
    used += w
    shown.push(s)
  }
  let extra = skills.length - shown.length
  // Leave room for the "+N" pill.
  while (extra > 0 && shown.length > 1 && used + 34 > budget) {
    used -= est(shown[shown.length - 1]) + 4
    shown.pop()
    extra = skills.length - shown.length
  }
  return { shown, extra }
}

function SelectAll({ checked, disabled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={checked}
      aria-label="Select all"
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
        disabled
          ? 'cursor-not-allowed border-hairline bg-background'
          : checked
            ? 'border-accent bg-accent text-white'
            : 'border-hairline bg-surface text-transparent hover:border-accent'
      }`}
    >
      <CheckIcon className="h-3 w-3" />
    </button>
  )
}

function RowCheck({ checked, onClick }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      aria-pressed={checked}
      aria-label="Select candidate"
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
        checked ? 'border-accent bg-accent text-white' : 'border-hairline bg-surface text-transparent hover:border-accent'
      }`}
    >
      <CheckIcon className="h-3 w-3" />
    </button>
  )
}

const HEAD = 'text-[11px] font-semibold uppercase tracking-wide text-muted'

/**
 * CandidateTable — one table for every stage tab. The row end is two FIXED slots:
 * an action slot, and, at the far right, a reserved menu slot that never shifts
 * between rows. Match carries a designed tooltip; skill chips never crop.
 */
export default function CandidateTable({
  candidates,
  selectedId,
  onSelect,
  selectable = false,
  picked,
  onToggle,
  onToggleAll,
  showInterview = false,
  newIds,
  rowAction,
  rowMenu,
}) {
  const allChecked = selectable && candidates.length > 0 && candidates.every((c) => picked.has(c.id))

  return (
    <div className="w-full">
      {/* Header row */}
      <div className="flex items-center gap-4 border-b border-hairline px-5 py-2.5">
        {selectable && (
          <div className="w-[20px] shrink-0">
            <SelectAll checked={allChecked} disabled={candidates.length === 0} onClick={onToggleAll} />
          </div>
        )}
        <div className={`min-w-[160px] flex-1 ${HEAD}`}>Candidate</div>
        <div className={`hidden w-[220px] shrink-0 md:block ${HEAD}`}>Experience</div>
        {showInterview ? (
          <div className={`w-[150px] shrink-0 ${HEAD}`}>Interview</div>
        ) : (
          <div className={`hidden w-[170px] shrink-0 xl:block ${HEAD}`}>Skills</div>
        )}
        {!showInterview && <div className={`w-[60px] shrink-0 text-right ${HEAD}`}>Match</div>}
        <div className="w-[156px] shrink-0" />
        <div className="w-[34px] shrink-0" />
      </div>

      {/* Rows */}
      <div>
        {candidates.map((c) => {
          const open = c.id === selectedId
          const top = topExperienceOf(c)
          const { shown, extra } = fitSkills(c.skills, 160)
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
              className={`group relative flex h-[56px] w-full cursor-pointer items-center gap-4 border-b border-hairline px-5 text-left transition-colors last:border-b-0 ${
                open ? 'bg-accent-soft/60' : picked?.has(c.id) ? 'bg-accent-soft/40' : 'hover:bg-background'
              }`}
            >
              {selectable && (
                <div className="w-[20px] shrink-0">
                  <RowCheck checked={picked.has(c.id)} onClick={() => onToggle(c.id)} />
                </div>
              )}

              {/* Candidate — avatar + full name, never truncates */}
              <div className="flex min-w-[160px] flex-1 items-center gap-3">
                <Avatar name={c.name} size={34} className="shrink-0" />
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                  <span className="text-sm font-semibold leading-snug text-ink">{c.name}</span>
                  {(c.isNew || newIds?.has(c.id)) && (
                    <span className="rounded-full bg-accent-soft px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-strong">
                      New
                    </span>
                  )}
                </div>
              </div>

              {/* Experience — one compact item, or a dash */}
              <div className="hidden w-[220px] shrink-0 whitespace-nowrap text-[13px] text-ink md:block">
                {top ?? <span className="text-muted">Fresher</span>}
              </div>

              {/* Skills (pre-interview) or Interview score (post-interview) */}
              {showInterview ? (
                <div className="flex w-[150px] shrink-0 items-center gap-2">
                  <InterviewScoreValue candidate={c} size="lg" showGate={false} />
                  {c.verdict && <VerdictTag verdict={c.verdict} />}
                </div>
              ) : (
                <div className="hidden w-[170px] shrink-0 items-center gap-1 whitespace-nowrap xl:flex">
                  {shown.map((s) => (
                    <Tag key={s} color={skillColor(s)} className="shrink-0">
                      {s}
                    </Tag>
                  ))}
                  {extra > 0 && (
                    <Tag color="gray" className="shrink-0">
                      +{extra}
                    </Tag>
                  )}
                </div>
              )}

              {/* Match — hero pre-interview, with a designed tooltip */}
              {!showInterview && (
                <div className="flex w-[60px] shrink-0 justify-end">
                  <Tooltip label={MATCH_EXPLAINER}>
                    <span className="flex flex-col items-end gap-1">
                      <ScoreValue value={c.match} size="md" />
                      <span className="h-1 w-12 overflow-hidden rounded-full bg-track">
                        <span className="block h-full rounded-full bg-accent-dot" style={{ width: `${c.match}%` }} />
                      </span>
                    </span>
                  </Tooltip>
                </div>
              )}

              {/* Action slot (fixed) */}
              <div className="flex w-[156px] shrink-0 items-center justify-end">{rowAction?.(c)}</div>
              {/* Menu slot (fixed, far right, always reserved) */}
              <div className="flex w-[34px] shrink-0 items-center justify-end">{rowMenu?.(c)}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
