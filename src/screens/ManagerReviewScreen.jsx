import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Avatar,
  ScoreDisplay,
  CompetencyBar,
  VerdictTag,
  EvidenceQuote,
  Tag,
} from '../components'
import { CheckIcon, XIcon } from '../components/icons.jsx'

function Wordmark() {
  return (
    <span className="font-medium tracking-tight text-ink">
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

const TopBar = () => (
  <header className="flex h-14 shrink-0 items-center border-b border-hairline px-6">
    <Wordmark />
  </header>
)

const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

function DecisionTag({ decision }) {
  if (decision === 'forward') return <Tag color="green">Take forward</Tag>
  if (decision === 'pass') return <Tag color="gray">Passed</Tag>
  return null
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 rounded-card border border-hairline bg-surface px-4 py-4 shadow-card">
      <div className="h-11 w-11 rounded-full bg-hairline" />
      <div className="min-w-0 flex-1">
        <div className="h-3.5 w-36 rounded bg-hairline" />
        <div className="mt-2 h-3 w-44 rounded bg-hairline/70" />
      </div>
      <div className="h-5 w-20 rounded-full bg-hairline" />
    </div>
  )
}

function RichRow({ candidate, decision, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-card border border-hairline bg-surface px-4 py-4 text-left shadow-card transition-colors hover:border-ink/20"
    >
      <Avatar src={candidate.avatar} name={candidate.name} size={44} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-ink">{candidate.name}</div>
        <div className="truncate text-[13px] text-secondary">
          {candidate.role} · {candidate.location}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
        {decision ? <DecisionTag decision={decision} /> : <VerdictTag verdict={candidate.verdict} />}
      </div>
    </button>
  )
}

function CompactRow({ candidate, decision, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      className={`flex w-full items-center gap-2.5 rounded-card px-2.5 py-2 text-left transition-colors ${
        selected ? 'bg-accent/[0.06]' : 'hover:bg-background'
      }`}
    >
      <Avatar src={candidate.avatar} name={candidate.name} size={30} />
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{candidate.name}</span>
      {decision && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${decision === 'forward' ? 'bg-strong' : 'bg-secondary'}`}
        />
      )}
      <span className="font-mono text-sm text-ink tabular-nums">{candidate.score}</span>
    </button>
  )
}

/* The detail panel — score, competency bars, evidence, interview, and the
   take-forward / pass decision. Evidence is only shown here (never in the list). */
function DetailPanel({ candidate, interview, decision, first, onClose, onDecide }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-hairline px-6 py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={candidate.avatar} name={candidate.name} size={40} />
          <div className="min-w-0">
            <h2 className="truncate text-lg text-ink">{candidate.name}</h2>
            <p className="truncate text-[13px] text-secondary">
              {candidate.role} · {candidate.location}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close detail"
          className="shrink-0 rounded-lg border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 py-7 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-9">
          <div className="flex items-center justify-between gap-6">
            <VerdictTag verdict={candidate.verdict} />
            <ScoreDisplay score={candidate.score} label="Overall" />
          </div>

          <section className="flex flex-col gap-4">
            <SectionLabel>Competencies</SectionLabel>
            <Card className="flex flex-col gap-6 p-6">
              {candidate.competencies.map((c) => (
                <CompetencyBar key={c.name} name={c.name} score={c.score} />
              ))}
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <SectionLabel>Evidence</SectionLabel>
            <div className="flex flex-col gap-4">
              {candidate.evidence.map((e, i) => (
                <Card key={i} className="p-6">
                  <EvidenceQuote quote={e.quote} competency={e.competency} source={e.source} />
                </Card>
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <SectionLabel>Interview</SectionLabel>
            <Card className="p-6">
              <p className="text-sm leading-relaxed text-secondary">{interview}</p>
            </Card>
          </section>
        </div>
      </div>

      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <span className="text-[13px] text-secondary">
            {decision
              ? `Marked: ${decision === 'forward' ? 'Take forward' : 'Pass'}`
              : `Your call for ${first}`}
          </span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => onDecide(candidate.id, 'pass')}>
              Pass
            </Button>
            <Button onClick={() => onDecide(candidate.id, 'forward')}>Take forward</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * ManagerReviewScreen (Screen 13) — reached via a second magic link. The manager
 * reviews the recruiter's shortlist (list compacts to a detail panel), sees the
 * full evidence per candidate, and marks each take-forward or pass. On finishing,
 * the decisions are saved back to the recruiter.
 */
export default function ManagerReviewScreen({
  roleTitle = 'Senior Product Engineer',
  recruiter = 'Aryan Mehta',
  candidates,
  interviews,
}) {
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [decisions, setDecisions] = useState({})
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850)
    return () => clearTimeout(t)
  }, [])

  const first = recruiter.split(' ')[0]
  const selected = candidates.find((c) => c.id === selectedId) ?? null
  const decidedCount = Object.keys(decisions).length
  const allDecided = decidedCount === candidates.length
  const forwardCount = Object.values(decisions).filter((d) => d === 'forward').length

  const decide = (id, value) => {
    setDecisions((prev) => ({ ...prev, [id]: value }))
    setSelectedId(null)
  }

  if (confirmed) {
    return (
      <div className="flex h-screen flex-col bg-background text-ink">
        <TopBar />
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <Card className="flex max-w-md flex-col items-center gap-5 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-7 w-7" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-ink">Decisions sent</h1>
              <p className="text-sm leading-relaxed text-secondary">
                {first} has your picks — {forwardCount} to take forward and{' '}
                {candidates.length - forwardCount} passed. Thanks for the quick turnaround.
              </p>
            </div>
            <p className="text-xs text-secondary">You can close this tab.</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background text-ink">
      <TopBar />

      {/* Header */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <p className="text-sm text-secondary">{roleTitle}</p>
        <h1 className="mt-1.5 text-2xl text-ink">Review shortlist</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-secondary">
          {first} shortlisted {candidates.length} candidates for your call. Open each to see the
          score, evidence, and interview — then take them forward or pass.
        </p>
      </div>

      {/* List + detail */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden border-t border-hairline">
        <div
          className={`flex min-h-0 flex-col overflow-y-auto transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            selected
              ? 'hidden border-r border-hairline lg:flex lg:w-[320px] lg:shrink-0'
              : 'flex w-full'
          }`}
        >
          {loading ? (
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : (
            <div
              className={
                selected
                  ? 'flex flex-col gap-1 p-3'
                  : 'mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-8'
              }
            >
              {candidates.map((c) =>
                selected ? (
                  <CompactRow
                    key={c.id}
                    candidate={c}
                    decision={decisions[c.id]}
                    selected={c.id === selectedId}
                    onClick={() => setSelectedId(c.id)}
                  />
                ) : (
                  <RichRow
                    key={c.id}
                    candidate={c}
                    decision={decisions[c.id]}
                    onClick={() => setSelectedId(c.id)}
                  />
                ),
              )}
            </div>
          )}
        </div>

        {selected && (
          <div className="absolute inset-0 z-10 flex flex-col overflow-hidden bg-background lg:static lg:flex-1">
            <DetailPanel
              candidate={selected}
              interview={interviews[selected.id]}
              decision={decisions[selected.id]}
              first={first}
              onClose={() => setSelectedId(null)}
              onDecide={decide}
            />
          </div>
        )}
      </div>

      {/* Finish bar — list mode only */}
      {!selected && !loading && (
        <div className="shrink-0 border-t border-hairline bg-background/90 px-6 py-4 backdrop-blur lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
            <span className="text-sm text-secondary">
              <span className="font-medium text-ink">{decidedCount}</span> of {candidates.length}{' '}
              decided
            </span>
            <Button disabled={!allDecided} onClick={() => setConfirmed(true)}>
              Send decisions to {first}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
