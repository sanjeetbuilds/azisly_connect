import { useEffect, useState } from 'react'
import { Button, Card, Avatar, VerdictTag, CandidateDetail } from '../components'
import { CheckIcon } from '../components/icons.jsx'

function Wordmark() {
  return (
    <span className="font-semibold tracking-tight text-ink">
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

const TopBar = () => (
  <header className="flex h-14 shrink-0 items-center border-b border-hairline px-6">
    <Wordmark />
  </header>
)

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

/* The shared candidate row — avatar, score in ink, verdict colour (or the
   take-forward tag once marked). */
function RichRow({ candidate, forwarded, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={selected ? 'true' : undefined}
      className={`flex w-full items-center gap-4 rounded-card border bg-surface px-4 py-4 text-left shadow-card transition-colors ${
        selected ? 'border-accent ring-1 ring-accent/20' : 'border-hairline hover:border-ink/20'
      }`}
    >
      <Avatar src={candidate.avatar} name={candidate.name} size={44} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-medium text-ink">{candidate.name}</div>
        <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
      </div>
      <div className="flex shrink-0 items-center gap-4">
        <span className="text-sm font-semibold text-ink tabular-nums">{candidate.score}</span>
        {forwarded ? (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-accent/25 bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
            <CheckIcon className="h-3 w-3" /> Taken forward
          </span>
        ) : (
          <VerdictTag verdict={candidate.verdict} />
        )}
      </div>
    </button>
  )
}

/**
 * ManagerReviewScreen — reached via a valid review magic link. The manager sees
 * the candidates the recruiter shared, opens each in the right-side overlay
 * (interview video, hero score, competency bars, evidence), marks who to take
 * forward, and sends the decision back. States: loading, list, detail-open,
 * marked, submitted.
 */
export default function ManagerReviewScreen({
  roleTitle = 'Senior Product Engineer',
  recruiter = 'Aryan Mehta',
  candidates,
  interviews,
}) {
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [forwarded, setForwarded] = useState(() => new Set())
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850)
    return () => clearTimeout(t)
  }, [])

  const first = recruiter.split(' ')[0]
  const selected = candidates.find((c) => c.id === selectedId) ?? null
  const count = forwarded.size

  const takeForward = (c) => setForwarded((prev) => new Set(prev).add(c.id))
  const undo = (c) =>
    setForwarded((prev) => {
      const next = new Set(prev)
      next.delete(c.id)
      return next
    })

  if (confirmed) {
    return (
      <div className="flex h-screen flex-col bg-background text-ink">
        <TopBar />
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <Card className="flex max-w-md flex-col items-center gap-5 p-10 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-strong">
              <CheckIcon className="h-7 w-7" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-ink">Decision sent</h1>
              <p className="text-sm leading-relaxed text-secondary">
                {first} has your {count} pick{count === 1 ? '' : 's'} to take forward. Thanks for the
                quick turnaround.
              </p>
            </div>
            <p className="text-xs text-secondary">You can close this tab.</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-background text-ink">
      <TopBar />

      {/* Header */}
      <div className="shrink-0 px-6 pb-5 pt-8 lg:px-8">
        <p className="text-[13px] font-medium text-secondary">{roleTitle}</p>
        <h1 className="mt-1 text-2xl font-bold text-ink">Candidates to review</h1>
        <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-secondary">
          {first} shared {candidates.length} candidate{candidates.length === 1 ? '' : 's'} for your
          call. Open each to watch the interview and see the evidence, then mark who to take forward.
        </p>
      </div>

      {/* List */}
      <div className="min-h-0 flex-1 overflow-y-auto border-t border-hairline">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 px-6 py-6 lg:px-8">
          {loading
            ? Array.from({ length: candidates.length || 4 }).map((_, i) => <SkeletonRow key={i} />)
            : candidates.map((c) => (
                <RichRow
                  key={c.id}
                  candidate={c}
                  forwarded={forwarded.has(c.id)}
                  selected={c.id === selectedId}
                  onClick={() => setSelectedId(c.id)}
                />
              ))}
        </div>
      </div>

      {/* Finish bar — running count + submit */}
      {!loading && (
        <div className="shrink-0 border-t border-hairline bg-background/90 px-6 py-4 backdrop-blur lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
            <span className="text-sm text-secondary">
              <span className="font-medium text-ink">{count}</span> marked to take forward
            </span>
            <Button disabled={count === 0} onClick={() => setConfirmed(true)}>
              Send {count > 0 ? `${count} ` : ''}to {first}
            </Button>
          </div>
        </div>
      )}

      {/* Right-side detail overlay — the existing CandidateDetail */}
      {selected && (
        <>
          <button
            type="button"
            aria-label="Close detail"
            onClick={() => setSelectedId(null)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div
            key={selected.id}
            className="absolute inset-y-0 right-0 z-30 flex w-full max-w-lg animate-slide-in-right flex-col overflow-y-auto border-l border-hairline bg-surface shadow-overlay"
          >
            <CandidateDetail
              candidate={selected}
              onBack={() => setSelectedId(null)}
              interview={interviews[selected.id]}
              decided={forwarded.has(selected.id)}
              onTakeForward={takeForward}
              onUndo={undo}
            />
          </div>
        </>
      )}
    </div>
  )
}
