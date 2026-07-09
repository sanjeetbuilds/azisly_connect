import { useMemo, useState } from 'react'
import { Button } from '../components'
import { ArrowLeftIcon, XIcon, PlusIcon, MinusIcon } from '../components/icons.jsx'
import { roleCriteria, approachFor } from '../data/scorecard.js'

const IMP_LABEL = { essential: 'Essential', veryImportant: 'Very important', nice: 'Nice to have' }

/**
 * InterviewReviewScreen — the recruiter never sees or edits questions (our AI
 * adapts them live). This is a composition map: each box is one criterion, its
 * area is that criterion's share of the interview. It answers the only real
 * question, visually and with a guarantee: will this test what I said matters?
 */
export default function InterviewReviewScreen({
  roleTitle = 'Senior Product Engineer',
  onBack,
  onConfirm,
  confirmLabel = 'Start sourcing',
}) {
  const criteria = useMemo(() => roleCriteria(roleTitle), [roleTitle])

  // Universals read from how they answer anything: no question time, no box.
  const readBand = criteria.filter((c) => approachFor(c.name).mode === 'read')
  // Not assessable in a conversation: a footnote, not a box.
  const profile = criteria.filter((c) => approachFor(c.name).mode === 'profile')

  // The map: Essential and Very important criteria that take real interview time.
  const [boxes, setBoxes] = useState(() => {
    let viSeen = 0
    return criteria
      .filter(
        (c) =>
          (c.importance === 'essential' || c.importance === 'veryImportant') &&
          approachFor(c.name).mode !== 'read' &&
          approachFor(c.name).mode !== 'profile',
      )
      .map((c) => {
        let weight = c.importance === 'essential' ? 3 : 2
        if (c.importance === 'veryImportant') {
          viSeen += 1
          if (viSeen > 2) weight = 0 // a short interview cannot cover everything
        }
        return { ...c, weight, ...approachFor(c.name) }
      })
  })

  const [selectedId, setSelectedId] = useState(null)
  const [note, setNote] = useState(null)

  const totalWeight = boxes.reduce((s, b) => s + Math.max(0, b.weight), 0) || 1
  const shareOf = (b) => (b.weight > 0 ? Math.round((b.weight / totalWeight) * 100) : 0)
  const layoutOf = (b) => (b.weight > 0 ? b.weight : 1.3)

  const essentialBoxes = boxes.filter((b) => b.importance === 'essential')
  const viBoxes = boxes.filter((b) => b.importance === 'veryImportant')
  const topGrow = essentialBoxes.reduce((s, b) => s + layoutOf(b), 0) || 1
  const botGrow = viBoxes.reduce((s, b) => s + layoutOf(b), 0) || 1

  const step = (id, delta) => {
    setBoxes((prev) => prev.map((b) => (b.id === id ? { ...b, weight: Math.max(0, b.weight + delta) } : b)))
    if (delta > 0) {
      const b = boxes.find((x) => x.id === id)
      if (b) {
        setNote(`Raising ${b.name} also raises it on your role card.`)
        setTimeout(() => setNote(null), 2600)
      }
    }
  }

  const selected = boxes.find((b) => b.id === selectedId && b.weight > 0)

  const tone = (imp) => (imp === 'essential' ? 'bg-ink text-white' : 'bg-ink/[0.62] text-white')

  const Box = ({ b }) => {
    if (b.weight <= 0) {
      return (
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          style={{ flexGrow: layoutOf(b), flexBasis: 0 }}
          className="flex min-w-0 flex-col items-start justify-end gap-0.5 rounded-lg border border-dashed border-hairline bg-transparent px-3 py-2.5 text-left"
        >
          <span className="truncate text-[13px] font-semibold text-ink">{b.name}</span>
          <span className="text-[11px] text-secondary">Not yet covered</span>
          <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-strong" onClick={(e) => { e.stopPropagation(); step(b.id, 1) }}>
            <PlusIcon className="h-3 w-3" /> Add time
          </span>
        </button>
      )
    }
    return (
      <button
        type="button"
        onClick={() => setSelectedId(b.id)}
        style={{ flexGrow: layoutOf(b), flexBasis: 0 }}
        className={`group relative flex min-w-0 flex-col items-start justify-end gap-0.5 overflow-hidden rounded-lg px-3 py-2.5 text-left transition-shadow ${tone(
          b.importance,
        )} ${selectedId === b.id ? 'ring-2 ring-ink/40 ring-offset-1 ring-offset-background' : ''}`}
      >
        <span className="truncate text-[13px] font-semibold">{b.name}</span>
        <span className="text-[11px] opacity-80">
          {IMP_LABEL[b.importance]}, {shareOf(b)}%
        </span>
        {/* Stepper on hover: shift emphasis, writes back to the role card */}
        <span className="absolute right-1.5 top-1.5 flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <span
            role="button"
            aria-label="Less time"
            onClick={(e) => {
              e.stopPropagation()
              step(b.id, -1)
            }}
            className="flex h-5 w-5 items-center justify-center rounded bg-white/20 hover:bg-white/30"
          >
            <MinusIcon className="h-3 w-3" />
          </span>
          <span
            role="button"
            aria-label="More time"
            onClick={(e) => {
              e.stopPropagation()
              step(b.id, 1)
            }}
            className="flex h-5 w-5 items-center justify-center rounded bg-white/20 hover:bg-white/30"
          >
            <PlusIcon className="h-3 w-3" />
          </span>
        </span>
      </button>
    )
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-secondary">{roleTitle}</p>
          <h1 className="truncate text-lg font-bold text-ink">How we will interview</h1>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-6 lg:px-8">
        {/* Map + on-demand panel */}
        <div className="flex min-h-0 flex-1 gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-2.5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">Where the 25 minutes go</span>
              <span className="text-[13px] text-muted">adapts live to their answers</span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col gap-2">
              <div className="flex gap-2" style={{ flexGrow: topGrow, flexBasis: 0 }}>
                {essentialBoxes.map((b) => (
                  <Box key={b.id} b={b} />
                ))}
              </div>
              <div className="flex gap-2" style={{ flexGrow: botGrow, flexBasis: 0 }}>
                {viBoxes.map((b) => (
                  <Box key={b.id} b={b} />
                ))}
              </div>
            </div>

            <p className="h-4 text-[12px] text-strong">{note ?? ''}</p>
          </div>

          {/* Listen-fors, on demand, in the right-hand space */}
          {selected && (
            <div className="flex w-72 shrink-0 flex-col gap-3 rounded-card border border-hairline bg-surface p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  {selected.name} · {IMP_LABEL[selected.importance]} · {shareOf(selected)}% of the interview
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close"
                  className="shrink-0 text-muted transition-colors hover:text-ink"
                >
                  <XIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="text-sm leading-relaxed text-secondary">{selected.approach}</p>
              <p className="text-sm leading-relaxed text-secondary">
                <span className="text-ink">We listen for:</span> {selected.listen}
              </p>
            </div>
          )}
        </div>

        {/* Foundation band, separated by a dashed hairline */}
        <div className="shrink-0 border-t border-dashed border-hairline pt-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">Read from every answer</p>
          <p className="mt-1 text-[13px] leading-relaxed text-secondary">
            {readBand.map((c) => `${c.name} (${IMP_LABEL[c.importance].toLowerCase()})`).join(', ')}
            {readBand.length ? ', structure, clarity of thinking. ' : 'Structure and clarity of thinking. '}
            No separate questions needed, which is why this stays short.
          </p>
          {profile.length > 0 && (
            <p className="mt-1.5 text-[12px] text-muted">
              Checked from their profile, not the interview: {profile.map((c) => c.name).join(', ')}.
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="mx-auto flex w-full items-center justify-between gap-3">
          <div className="flex flex-col">
            <Button variant="secondary" onClick={onBack} className="self-start">
              <ArrowLeftIcon className="h-4 w-4" />
              Back to criteria
            </Button>
            <span className="mt-1 text-[12px] text-muted">To change the interview, change what matters.</span>
          </div>
          <Button onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  )
}
