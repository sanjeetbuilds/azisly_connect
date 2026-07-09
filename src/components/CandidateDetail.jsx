import { useState } from 'react'
import Button from './Button.jsx'
import Card from './Card.jsx'
import Avatar from './Avatar.jsx'
import { ScoreValue } from './Scores.jsx'
import StatusPill from './StatusPill.jsx'
import VerdictTag from './VerdictTag.jsx'
import Tag, { skillColor } from './Tag.jsx'
import Kbd from './Kbd.jsx'
import {
  XIcon,
  PlayIcon,
  CheckIcon,
  MailIcon,
  PhoneIcon,
  SendIcon,
  LinkIcon,
  ArrowRightIcon,
  LockIcon,
  DownloadIcon,
  ChevronDownIcon,
  FileTextIcon,
} from './icons.jsx'
import {
  GATE,
  UNIVERSAL_FLOOR,
  DOMAIN_LABEL,
  contactsFor,
  GATED_COMPETENCIES,
  ROLE_TARGETS,
  ROLE_PROBES,
  interviewStatus,
} from '../data/candidates.js'
import { roleScorecard } from '../data/scorecard.js'
import { gapFinding } from '../lib/reportData.js'

const SectionLabel = ({ children }) => (
  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">{children}</p>
)

const RECO = {
  strong: 'Recommend advancing.',
  promising: 'Promising, worth a closer look.',
  'not-yet': 'Not yet, needs a human review.',
}

/* Forward actions drawn from the scored competencies: what to DO next, not just
   the numbers. Failures first (they decide the outcome), then reads worth
   probing, then strengths worth confirming. */
function recommendations(sortedComps) {
  const fails = []
  const probes = []
  const goods = []
  for (const c of sortedComps) {
    const isDomain = c.name === DOMAIN_LABEL
    const gated = GATED_COMPETENCIES.includes(c.name)
    if (gated && c.score < GATE) {
      fails.push({
        tone: 'fail',
        text: `Fails the ${c.name} gate, a hard requirement for this role. Do not advance on the strength of other scores.`,
      })
    } else if (!isDomain && c.score < UNIVERSAL_FLOOR) {
      probes.push({
        tone: 'fail',
        text: `Below the floor on ${c.name}, the baseline of a strong candidate. Probe whether it was nerves before ruling them out.`,
      })
    } else if (isDomain && ROLE_TARGETS[c.name] != null && c.score < ROLE_TARGETS[c.name]) {
      probes.push({
        tone: 'warn',
        text: `The interview did not get a clean read on ${c.name}. Probe it next round.`,
      })
    }
  }
  const top = sortedComps[0]
  if (top && top.score >= UNIVERSAL_FLOOR) {
    goods.push({ tone: 'good', text: `Strong on ${top.name}. Worth confirming with a reference.` })
  }
  const out = [...fails, ...probes, ...goods]
  if (!fails.length && !probes.length) {
    out.push({ tone: 'good', text: 'No gaps flagged. Ready to share with the hiring manager.' })
  }
  return out.slice(0, 4)
}

/* A recommendation's marker, coloured by tone. Failures read red, the same
   loudness as the failed-gate pills, so a no is never quiet. */
function RecMarker({ tone }) {
  if (tone === 'fail') {
    return (
      <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger-soft text-danger">
        <XIcon className="h-2.5 w-2.5" />
      </span>
    )
  }
  if (tone === 'warn') {
    return (
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-attention" aria-hidden="true" />
    )
  }
  return (
    <span className="mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
      <CheckIcon className="h-2.5 w-2.5" />
    </span>
  )
}

function InterviewVideo({ candidate, summary }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionLabel>Interview recording</SectionLabel>
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-video w-full bg-gradient-to-br from-ink to-[#2c2c34]">
          <span className="absolute left-3 top-3 flex items-center gap-2 text-xs text-white/90">
            <Avatar name={candidate.name} size={22} />
            {candidate.name}
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-ink shadow-panel transition-transform hover:scale-105">
              <PlayIcon className="ml-1 h-6 w-6" />
            </span>
          </div>
          <span className="absolute bottom-3 right-3 rounded-md bg-ink/70 px-2 py-0.5 font-mono text-xs text-white">
            42:18
          </span>
        </div>
        {summary && <p className="px-6 py-5 text-sm leading-relaxed text-secondary">{summary}</p>}
      </Card>
    </section>
  )
}

/* One compact, sorted competency row. The bar carries a marker whose MEANING
   depends on the row: on a universal it is the flat floor every candidate must
   clear (same across roles); on the domain it is this role's own target. The two
   markers are styled apart so the recruiter reads them as different questions.
   A failed gate and a below-floor universal are the loudest things here. */
function CompetencyRow({ comp, ev, open, onToggle, emphasised }) {
  const isDomain = comp.name === DOMAIN_LABEL
  const gated = GATED_COMPETENCIES.includes(comp.name)
  const domainTarget = isDomain ? ROLE_TARGETS[comp.name] : null

  const gateFail = gated && comp.score < GATE
  const belowFloor = !isDomain && comp.score < UNIVERSAL_FLOOR // disqualifying-level
  const belowTarget = isDomain && domainTarget != null && comp.score < domainTarget // soft shortfall
  const loud = gateFail || belowFloor

  const fill = loud ? 'bg-danger' : belowTarget ? 'bg-attention' : 'bg-strong'
  const scoreColor = loud ? 'text-danger' : belowTarget ? 'text-attention' : 'text-ink'
  const probe = ROLE_PROBES[comp.name] // the recruiter's words, if they asked for this
  // Lead with the finding, in our words. The verbatim quote is support, one tap
  // away. A weak competency gets the same treatment, never silence.
  const finding = ev?.finding ?? gapFinding(comp.name, { gateFail, belowFloor, belowTarget })
  const quote = ev?.quote
  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center gap-3 border-l-2 px-4 py-2.5 ${
          loud ? 'border-danger bg-danger-soft/50' : 'border-transparent'
        }`}
      >
        <div className="w-[126px] shrink-0">
          <span className="block truncate text-[13px] text-ink">{comp.name}</span>
          {isDomain ? (
            <span className="mt-0.5 inline-flex items-center rounded-full border border-ink/25 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-ink">
              Domain
            </span>
          ) : (
            emphasised && (
              <span className="mt-0.5 inline-flex items-center rounded-full bg-warning-soft px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-attention">
                Very Important
              </span>
            )
          )}
        </div>

        <span className="relative h-2 flex-1">
          <span className="absolute inset-0 rounded-full bg-track" />

          {/* Loud gap shading: red under a below-floor universal, amber under a
              domain that fell short of its target. */}
          {belowFloor && (
            <span
              className="absolute inset-y-0 bg-danger/25"
              style={{ left: `${comp.score}%`, width: `${UNIVERSAL_FLOOR - comp.score}%` }}
            />
          )}
          {belowTarget && (
            <span
              className="absolute inset-y-0 bg-attention/50"
              style={{ left: `${comp.score}%`, width: `${domainTarget - comp.score}%` }}
            />
          )}

          <span className={`absolute inset-y-0 left-0 rounded-full ${fill}`} style={{ width: `${Math.max(3, comp.score)}%` }} />

          {isDomain ? (
            /* Domain target — a solid ink line capped with a diamond: "what THIS
               role needs on its domain". */
            <>
              <span
                aria-hidden="true"
                className="absolute top-1/2 z-10 h-[16px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface"
                style={{ left: `${domainTarget}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 z-10 h-[16px] w-[2.5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink"
                style={{ left: `${domainTarget}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute top-0 z-10 h-[7px] w-[7px] -translate-x-1/2 -translate-y-[5px] rotate-45 rounded-[1px] bg-ink"
                style={{ left: `${domainTarget}%` }}
              />
            </>
          ) : (
            /* Universal floor — a quiet, thin baseline tick, identical on every
               universal row so it reads as the shared floor. */
            <>
              <span
                aria-hidden="true"
                className="absolute top-1/2 z-10 h-[14px] w-[4px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-surface"
                style={{ left: `${UNIVERSAL_FLOOR}%` }}
              />
              <span
                aria-hidden="true"
                className="absolute top-1/2 z-10 h-[10px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/60"
                style={{ left: `${UNIVERSAL_FLOOR}%` }}
              />
            </>
          )}
        </span>

        <span className={`w-6 shrink-0 text-right text-sm font-semibold tabular-nums ${scoreColor}`}>{comp.score}</span>

        <span className="flex w-[104px] shrink-0 items-center justify-end gap-1.5">
          {gateFail ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger px-2 py-0.5 text-[11px] font-bold text-white">
              <XIcon className="h-2.5 w-2.5" />
              Gate NOT met
            </span>
          ) : belowFloor ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-danger-soft px-2 py-0.5 text-[11px] font-bold text-danger ring-1 ring-danger/30">
              <XIcon className="h-2.5 w-2.5" />
              Below floor
            </span>
          ) : (
            gated && (
              <span className="inline-flex items-center rounded-full bg-success-soft px-2 py-0.5 text-[11px] font-medium text-strong">
                Gate met
              </span>
            )
          )}
        </span>
      </div>

      {probe && (
        <p className="px-4 pb-1.5 text-[11px] leading-relaxed text-muted">
          <span className="text-secondary">You asked us to test</span> &ldquo;{probe}&rdquo;, scored
          under {comp.name}.
        </p>
      )}

      {/* The finding, in our words. Provenance small underneath; the verbatim
          exchange one tap away for a recruiter who wants to verify. */}
      {finding && (
        <div className="px-4 pb-3.5">
          <p className={`text-[13px] leading-relaxed ${ev?.finding ? 'text-ink' : 'text-secondary'}`}>
            {finding}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            {ev?.source && <span className="text-[12px] text-muted">{ev.source}</span>}
            {quote && (
              <button
                type="button"
                onClick={onToggle}
                aria-expanded={open}
                className="inline-flex items-center gap-1 text-[12px] font-medium text-strong transition-colors hover:underline"
              >
                {open ? 'Hide the exchange' : 'Expand'}
                <ChevronDownIcon className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
          {quote && open && (
            <div className="mt-2 rounded-lg border border-hairline bg-background px-3 py-2.5">
              <p className="text-[13px] italic leading-relaxed text-ink">&ldquo;{quote}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * CandidateDetail — stage-aware overlay. Pre-interview it justifies the match.
 * Post-interview it reads like the reference: a score-and-decision card at the
 * top, a one-line read, the competency radar in our palette, and the detailed
 * sorted list beneath where lows stay honest and evidence is one tap away.
 */
export default function CandidateDetail({ candidate, onBack, interview, decided, onTakeForward, onUndo, recruiter }) {
  const managerMode = Boolean(onTakeForward)
  const status = recruiter?.status
  const managerName = recruiter?.managerName
  const scored = candidate.score != null
  const decidedForward = status === 'taken_forward'
  const contacts = decidedForward ? contactsFor(candidate.name) : null

  // Pre-interview: why they matched.
  const reasons = candidate.matchReasons?.length
    ? candidate.matchReasons
    : (candidate.strengths ?? []).slice(0, 3).map((s) => ({ competency: s, note: '' }))
  const matchSummary =
    candidate.matchSummary || `Strong on ${(candidate.strengths ?? []).slice(0, 2).join(' and ')} for this role.`

  // Post-interview: assessed competencies, evidence, strengths and gaps.
  const assessed = (candidate.competencies ?? []).filter((c) => c.score != null)
  const evByComp = {}
  ;(candidate.evidence ?? []).forEach((e) => {
    if (!evByComp[e.competency]) evByComp[e.competency] = e
  })
  const sortedComps = [...assessed].sort((a, b) => b.score - a.score)
  // Which universals this role leaned on when it was defined, so the panel can
  // mark them apart from the ones simply held at the floor. A competency the
  // recruiter's own phrase drove counts too: it was turned up on purpose.
  const emphasisNames = new Set(roleScorecard({ title: candidate.role }).emphasis.map((e) => e.name))
  Object.keys(ROLE_PROBES).forEach((name) => emphasisNames.add(name))
  const strengths = sortedComps.slice(0, 2).map((c) => c.name)
  const gapComps = sortedComps.filter((c) => GATED_COMPETENCIES.includes(c.name) && c.score < GATE)
  const gaps = (gapComps.length ? gapComps : sortedComps.slice(-1)).map((c) => c.name)

  // Findings are always visible; the verbatim quotes start collapsed, one tap away.
  const [openRows, setOpenRows] = useState(() => new Set())
  const toggleRow = (name) =>
    setOpenRows((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })

  const fresher = !candidate.work?.length

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-hairline bg-surface px-5 py-4">
        <StatusPill label={interviewStatus(candidate)} />
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Close detail"
            className="shrink-0 rounded-md border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
          >
            <XIcon className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 bg-background px-5 py-5">
        {scored ? (
          /* ── POST-INTERVIEW: card-stacked ──────────────────────── */
          <>
            {/* Identity + score only; the decision lives in the sticky bottom bar */}
            <Card className="flex items-start justify-between gap-4 p-5">
              <div className="flex items-center gap-3.5">
                <Avatar name={candidate.name} size={52} />
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-ink">{candidate.name}</h2>
                  <p className="text-sm text-secondary">{candidate.role}</p>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Interview</span>
                <div className="flex items-center gap-2">
                  <ScoreValue value={candidate.score} size="xl" />
                  {candidate.verdict && <VerdictTag verdict={candidate.verdict} />}
                </div>
                <span className="text-[12px] text-muted">Match {candidate.match}</span>
              </div>
            </Card>

            {/* One-line read */}
            <div className="flex flex-col gap-1 px-1">
              <p className="text-sm font-medium text-ink">{RECO[candidate.verdict]}</p>
              {strengths.length > 0 && (
                <p className="text-[13px] leading-relaxed text-secondary">
                  Strongest on <span className="text-ink">{strengths.join(' and ')}</span>.
                  {gaps.length > 0 && (
                    <>
                      {' '}
                      Keep an eye on <span className="text-ink">{gaps.join(' and ')}</span>.
                    </>
                  )}
                </p>
              )}
            </div>

            {/* What to do next: forward actions drawn from the evidence */}
            <Card className="flex flex-col gap-3 p-5">
              <SectionLabel>What to do next</SectionLabel>
              <ul className="flex flex-col gap-2.5">
                {recommendations(sortedComps).map((r, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] leading-relaxed text-ink">
                    <RecMarker tone={r.tone} />
                    {r.text}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Competency detail (sorted; the list carries the shape) */}
            <Card className="flex flex-col divide-y divide-hairline p-0 py-1">
              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1.5 px-4 py-2.5">
                <SectionLabel>Competencies</SectionLabel>
                <div className="flex items-center gap-3 text-[11px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <span className="h-[10px] w-[2px] rounded-full bg-secondary/60" /> floor (baseline)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-[7px] w-[7px] rotate-45 rounded-[1px] bg-ink" /> role target (domain)
                  </span>
                </div>
              </div>
              {sortedComps.map((c) => (
                <CompetencyRow
                  key={c.name}
                  comp={c}
                  ev={evByComp[c.name]}
                  open={openRows.has(c.name)}
                  onToggle={() => toggleRow(c.name)}
                  emphasised={emphasisNames.has(c.name)}
                />
              ))}
            </Card>

            <InterviewVideo candidate={candidate} summary={interview} />

            <Card className="flex flex-col gap-3 p-5">
              <SectionLabel>Background</SectionLabel>
              <div className="flex flex-col gap-1">
                {candidate.work?.length > 0 ? (
                  candidate.work.map((w) => (
                    <p key={w} className="text-sm text-ink">
                      {w}
                    </p>
                  ))
                ) : (
                  <p className="text-sm text-secondary">No formal experience yet.</p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {candidate.skills.map((s) => (
                  <Tag key={s} color={skillColor(s)}>
                    {s}
                  </Tag>
                ))}
              </div>
            </Card>

            {/* Contact */}
            {decidedForward && contacts ? (
              <Card className="flex flex-col gap-3 p-5">
                <SectionLabel>Contact details</SectionLabel>
                <a
                  href={`mailto:${contacts.email}`}
                  className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-strong"
                >
                  <MailIcon className="h-4 w-4 text-secondary" />
                  {contacts.email}
                </a>
                <div className="flex items-center gap-3 text-sm text-ink">
                  <PhoneIcon className="h-4 w-4 text-secondary" />
                  {contacts.phone}
                </div>
              </Card>
            ) : (
              <p className="flex items-center gap-1.5 px-1 text-[13px] text-muted">
                <LockIcon className="h-3.5 w-3.5 shrink-0" />
                Contact unlocks once this candidate is taken forward.
              </p>
            )}
          </>
        ) : (
          /* ── PRE-INTERVIEW: unchanged ──────────────────────────── */
          <>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar name={candidate.name} size={56} />
                  <div className="min-w-0">
                    <h2 className="text-xl font-bold text-ink">{candidate.name}</h2>
                    <p className="text-sm text-secondary">{candidate.role}</p>
                  </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">Match</span>
                  <ScoreValue value={candidate.match} size="xl" />
                </div>
              </div>
              <p className="text-sm leading-relaxed text-ink">{matchSummary}</p>
            </div>

            <section className="flex flex-col gap-3">
              <SectionLabel>Why they matched</SectionLabel>
              <div className="flex flex-col gap-3.5">
                {reasons.map((r) => (
                  <div key={r.competency} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent-soft text-strong">
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{r.competency}</p>
                      {r.note && <p className="text-[13px] leading-relaxed text-secondary">{r.note}</p>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[13px] text-muted">Other competencies will be assessed in the interview.</p>
            </section>

            <section className="flex flex-col gap-2">
              <SectionLabel>Skills</SectionLabel>
              <div className="flex flex-wrap items-center gap-1.5">
                {candidate.skills.map((s) => (
                  <Tag key={s} color={skillColor(s)}>
                    {s}
                  </Tag>
                ))}
              </div>
            </section>

            {!fresher && (
              <section className="flex flex-col gap-2">
                <SectionLabel>Experience</SectionLabel>
                <div className="flex flex-col divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
                  {candidate.work.map((w) => (
                    <p key={w} className="px-3.5 py-2.5 text-sm text-ink">
                      {w}
                    </p>
                  ))}
                </div>
              </section>
            )}

            {candidate.projects?.length > 0 ? (
              <section className="flex flex-col gap-2">
                <SectionLabel>Projects</SectionLabel>
                {fresher && <p className="text-[13px] text-secondary">No formal experience yet. Recent projects:</p>}
                <div className="flex flex-col divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
                  {candidate.projects.map((p) => (
                    <p key={p} className="px-3.5 py-2.5 text-sm text-ink">
                      {p}
                    </p>
                  ))}
                </div>
              </section>
            ) : (
              fresher && <p className="text-sm text-secondary">No formal experience yet.</p>
            )}

            <p className="flex items-center gap-1.5 text-[13px] text-muted">
              <LockIcon className="h-3.5 w-3.5 shrink-0" />
              Contact unlocks once this candidate is taken forward.
            </p>
          </>
        )}
      </div>

      {/* Bottom action bar */}
      <div className="sticky bottom-0 flex flex-wrap items-center gap-2 border-t border-hairline bg-surface px-5 py-4">
        {managerMode ? (
          decided ? (
            <>
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-strong">
                  <CheckIcon className="h-3.5 w-3.5" />
                </span>
                Marked to take forward
              </span>
              <Button variant="secondary" className="ml-auto" onClick={() => onUndo?.(candidate)}>
                Undo
              </Button>
            </>
          ) : (
            <>
              <Button variant="primary" onClick={() => onTakeForward?.(candidate)}>
                Take forward
              </Button>
              <Kbd className="ml-auto">⌘↵</Kbd>
            </>
          )
        ) : status === 'taken_forward' ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            <span className="flex items-center gap-2 text-sm font-medium text-ink">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-soft text-strong">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              Taken forward
            </span>
            <div className="ml-auto flex items-center gap-2">
              {recruiter?.onOpenReport && (
                <Button variant="secondary" onClick={recruiter.onOpenReport}>
                  <FileTextIcon className="h-4 w-4" />
                  Report
                </Button>
              )}
              {recruiter?.onDownloadCv && (
                <Button variant="secondary" onClick={recruiter.onDownloadCv}>
                  <DownloadIcon className="h-4 w-4" />
                  Download CV
                </Button>
              )}
              {recruiter?.onReachOut && (
                <Button onClick={recruiter.onReachOut}>
                  <MailIcon className="h-4 w-4" />
                  Reach out
                </Button>
              )}
            </div>
          </div>
        ) : status === 'declined' ? (
          <span className="text-sm text-secondary">Declined. Not moving ahead for this role.</span>
        ) : status === 'matched' ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            <Button onClick={recruiter.onInvite}>
              <SendIcon className="h-4 w-4" />
              Invite to interview
            </Button>
            <Button variant="secondary" className="ml-auto" onClick={recruiter.onDecline}>
              <XIcon className="h-4 w-4" />
              Decline
            </Button>
          </div>
        ) : status === 'pending' ? (
          <div className="flex w-full items-center gap-2.5">
            <StatusPill label="Awaiting response" tone="neutral" />
            <span className="text-sm text-secondary">Invited 3 days ago. Waiting on the interview.</span>
          </div>
        ) : status === 'lapsed' ? (
          <div className="flex w-full flex-wrap items-center gap-2.5">
            <StatusPill label="Invite expired" tone="warning" />
            <span className="text-sm text-secondary">The invite expired before the interview. Credit returned.</span>
            <Button variant="secondary" className="ml-auto" onClick={recruiter.onInvite}>
              <SendIcon className="h-4 w-4" />
              Re-invite
            </Button>
          </div>
        ) : status === 'declined_interview' ? (
          <div className="flex w-full items-center gap-2.5">
            <StatusPill label="Declined" tone="danger" />
            <span className="text-sm text-secondary">The candidate turned down the interview. Credit returned.</span>
          </div>
        ) : status === 'interviewed' || status === 'shared' ? (
          <div className="flex w-full flex-wrap items-center gap-2">
            {status === 'shared' && (
              <StatusPill
                label={managerName ? `With ${managerName} to review` : 'Sent to manager for review'}
                tone="accent"
              />
            )}
            <div className="ml-auto flex items-center gap-2">
              <Button variant="secondary" onClick={recruiter.onReject}>
                <XIcon className="h-4 w-4" />
                Reject
              </Button>
              {status !== 'shared' && (
                <Button variant="secondary" onClick={recruiter.onShare}>
                  <LinkIcon className="h-4 w-4" />
                  Share with manager
                </Button>
              )}
              <Button onClick={recruiter.onTakeForward}>
                <ArrowRightIcon className="h-4 w-4" />
                Take forward
              </Button>
            </div>
          </div>
        ) : (
          <span className="text-sm text-secondary">{interviewStatus(candidate)}</span>
        )}
      </div>
    </div>
  )
}
