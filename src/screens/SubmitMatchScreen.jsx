import { useEffect, useRef, useState } from 'react'
import { Button, Card, Avatar, VerdictTag } from '../components'
import { CheckIcon, SparkleIcon, ArrowLeftIcon } from '../components/icons.jsx'

/**
 * The ABI matching engine, narrated step by step. These are the real engine
 * steps, kept accurate so this doubles as a spec for the backend team. The
 * progress and timing shown here are a prototype simulation, not measured work.
 */
const STEPS = [
  {
    title: 'Reading candidate profiles and the role definition',
    detail: 'Load each candidate profile and the role definition, including its competency weights.',
  },
  {
    title: 'Mapping evidence to the 7 competencies',
    detail:
      'Attribute interview and resume evidence to Communication, Problem Solving, Ownership, Learning Agility, Execution, Collaboration, and the role Domain.',
  },
  {
    title: 'Scoring each against the rubric',
    detail:
      'Score every assessed competency from 0 to 100 against the rubric. Competencies that were not asked stay Not assessed.',
  },
  {
    title: 'Applying role weights and gate checks',
    detail: 'Weight the competencies for this role, then check gated competencies against the 50 threshold.',
  },
  {
    title: 'Ranking candidates by match',
    detail: 'Order candidates by weighted match and flag any gate failure as Needs human.',
  },
]

const STEP_MS = 1150

function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`animate-spin ${className}`}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function StepMarker({ status, n }) {
  if (status === 'done') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
        <CheckIcon className="h-4 w-4" />
      </span>
    )
  }
  if (status === 'active') {
    return (
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-ink">
        <Spinner className="h-3.5 w-3.5" />
      </span>
    )
  }
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline font-mono text-[12px] text-secondary">
      {n}
    </span>
  )
}

function ProcessingStep({ step, status, fill }) {
  const width = status === 'done' ? 100 : status === 'active' ? fill : 0
  return (
    <div className={`flex gap-3.5 transition-opacity ${status === 'pending' ? 'opacity-55' : 'opacity-100'}`}>
      <StepMarker status={status} n={step.n} />
      <div className="min-w-0 flex-1 pb-1">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-sm font-medium ${status === 'pending' ? 'text-secondary' : 'text-ink'}`}>
            {step.title}
          </span>
          {status === 'done' && <span className="text-[12px] font-medium text-strong">Done</span>}
        </div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-secondary">{step.detail}</p>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full bg-ink/70 transition-[width] ease-out"
            style={{ width: `${width}%`, transitionDuration: status === 'active' ? `${STEP_MS}ms` : '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

/* A ranked match row in the finished list. */
function MatchRow({ candidate, rank }) {
  return (
    <div className="flex items-center gap-4 border-b border-hairline px-5 py-3 last:border-b-0">
      <span className="w-6 shrink-0 text-center font-mono text-sm text-secondary tabular-nums">{rank}</span>
      <Avatar src={candidate.avatar} name={candidate.name} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
        <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
      </div>
      {candidate.stage === 'Needs human' && (
        <span className="hidden items-center gap-1.5 text-[13px] font-medium text-attention sm:inline-flex">
          <span className="h-1.5 w-1.5 rounded-full bg-attention" />
          Needs human
        </span>
      )}
      <span className="w-12 shrink-0 text-right font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
      <div className="w-[110px] shrink-0">{candidate.verdict && <VerdictTag verdict={candidate.verdict} />}</div>
    </div>
  )
}

/**
 * SubmitMatchScreen — the moment a defined role is submitted and the ABI engine
 * matches candidates. idle (the Submit action) -> processing (the engine steps,
 * narrated and animated) -> done (the role is Ready to review and the ranked
 * match list appears).
 */
export default function SubmitMatchScreen({ role, candidates = [], onBack, onComplete, onReviewCandidates }) {
  const [phase, setPhase] = useState('idle') // idle | processing | done
  const [active, setActive] = useState(-1)
  const [doneCount, setDoneCount] = useState(0)
  const [fill, setFill] = useState(0)
  const completed = useRef(false)

  const ranked = [...candidates].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))

  useEffect(() => {
    if (phase !== 'processing') return
    let cancelled = false
    const timers = []
    let i = 0
    const run = () => {
      if (cancelled) return
      setActive(i)
      setFill(0)
      const raf = requestAnimationFrame(() => !cancelled && setFill(100))
      timers.push(() => cancelAnimationFrame(raf))
      const t = setTimeout(() => {
        if (cancelled) return
        setDoneCount(i + 1)
        i += 1
        if (i < STEPS.length) run()
        else {
          setActive(-1)
          setPhase('done')
        }
      }, STEP_MS + 250)
      timers.push(() => clearTimeout(t))
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((fn) => fn())
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'done' && !completed.current) {
      completed.current = true
      onComplete?.()
    }
  }, [phase, onComplete])

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 px-6 pt-8 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back to roles"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div>
          <p className="text-sm text-secondary">Roles · {role?.title}</p>
          <h1 className="mt-1.5 text-2xl text-ink">
            {phase === 'done' ? 'Ready to review' : 'Submit for matching'}
          </h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {/* ── Idle: the primary Submit action ─────────────────── */}
          {phase === 'idle' && (
            <Card className="flex flex-col gap-6 p-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <SparkleIcon className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg text-ink">{role?.title}</h2>
                  <p className="text-[13px] text-secondary">
                    {role?.definedBy ? `Defined by ${role.definedBy}, ready to submit` : 'Defined, ready to submit'}
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-secondary">
                Submitting runs the ABI matching engine across your candidate pool. It maps each
                candidate to the seven competencies, scores them against the rubric, applies this
                role&rsquo;s weights and gate checks, and ranks the best matches.
              </p>

              <div className="rounded-lg border border-hairline bg-background px-4 py-3 text-[13px] leading-relaxed text-secondary">
                Prototype note: this view narrates the real engine steps as a faithful spec. The
                progress and timing shown are illustrative, not measured.
              </div>

              <div className="flex border-t border-hairline pt-5">
                <Button onClick={() => setPhase('processing')}>Submit role for matching</Button>
              </div>
            </Card>
          )}

          {/* ── Processing: the engine steps, narrated ──────────── */}
          {phase === 'processing' && (
            <div className="flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-secondary">
                  Matching <span className="text-ink">{role?.title}</span> against{' '}
                  <span className="text-ink">{candidates.length}</span> candidates
                </p>
                <span className="font-mono text-[13px] text-secondary tabular-nums">
                  {doneCount} / {STEPS.length}
                </span>
              </div>

              <Card className="flex flex-col gap-6 p-7">
                {STEPS.map((s, i) => (
                  <ProcessingStep
                    key={i}
                    step={{ ...s, n: i + 1 }}
                    status={i < doneCount ? 'done' : i === active ? 'active' : 'pending'}
                    fill={fill}
                  />
                ))}
              </Card>

              <p className="text-center text-[13px] text-secondary">
                ABI matching engine · prototype simulation of the real backend steps
              </p>
            </div>
          )}

          {/* ── Done: Ready to review, ranked matches ───────────── */}
          {phase === 'done' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-4 rounded-xl border border-strong/25 bg-strong/[0.05] px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
                  <CheckIcon className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink">
                    Matching complete. <span className="font-medium">{ranked.length}</span> candidates
                    matched and ranked.
                  </p>
                  <p className="text-[13px] text-secondary">
                    {role?.title} moved to Ready to review · just now
                  </p>
                </div>
                {onReviewCandidates && <Button onClick={onReviewCandidates}>Review candidates</Button>}
              </div>

              <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
                <div className="flex items-center gap-4 border-b border-hairline bg-background/60 px-5 py-2.5 text-xs text-secondary">
                  <span className="w-6 shrink-0 text-center">#</span>
                  <span className="flex-1">Candidate</span>
                  <span className="hidden w-[96px] sm:block" />
                  <span className="w-12 shrink-0 text-right">Match</span>
                  <span className="w-[110px] shrink-0">Verdict</span>
                </div>
                {ranked.map((c, i) => (
                  <MatchRow key={c.id} candidate={c} rank={i + 1} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
