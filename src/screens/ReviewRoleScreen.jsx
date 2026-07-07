import { useState } from 'react'
import { Button, Card, Tag } from '../components'
import { CheckIcon, PlusIcon, MinusIcon, XIcon, ArrowLeftIcon } from '../components/icons.jsx'

const INITIAL_COMPETENCIES = [
  { name: 'System design', weight: 30 },
  { name: 'Ownership', weight: 30 },
  { name: 'Communication', weight: 20 },
  { name: 'Code quality', weight: 20 },
]

const INITIAL_MUST_HAVES = [
  '5+ years building production web applications',
  'Strong system-design fundamentals',
  'Has owned a feature end to end, from shaping to shipping',
  'Clear, structured written communication',
]

const INITIAL_JD = `We're hiring a Senior Product Engineer to own product-facing features end to end, from shaping the problem with PM and design to shipping, measuring, and iterating.

You'll work across two squads, set the technical direction for your area, and raise the bar on how we design and review systems.

In your first six months you'll lead two significant launches and drive a measurable lift in activation.`

/* A competency weight shown as a horizontal bar (ink fill on a light track),
   like the competency bars elsewhere — editable in place when editing. */
function WeightRow({ name, weight, editing, onChange }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-ink">{name}</span>
        {editing ? (
          <span className="inline-flex items-center overflow-hidden rounded-lg border border-hairline">
            <button
              type="button"
              onClick={() => onChange(Math.max(0, weight - 5))}
              aria-label={`Decrease ${name}`}
              className="flex h-7 w-8 items-center justify-center text-secondary transition-colors hover:text-ink"
            >
              <MinusIcon className="h-3.5 w-3.5" />
            </button>
            <span className="w-12 border-x border-hairline py-1 text-center text-sm font-semibold text-ink tabular-nums">
              {weight}%
            </span>
            <button
              type="button"
              onClick={() => onChange(Math.min(100, weight + 5))}
              aria-label={`Increase ${name}`}
              className="flex h-7 w-8 items-center justify-center text-secondary transition-colors hover:text-ink"
            >
              <PlusIcon className="h-3.5 w-3.5" />
            </button>
          </span>
        ) : (
          <span className="text-sm font-semibold text-ink tabular-nums">{weight}%</span>
        )}
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-track">
        <div
          className="h-full rounded-full bg-bar transition-[width] duration-300 ease-out"
          style={{ width: `${weight}%` }}
        />
      </div>
    </div>
  )
}

const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

export default function ReviewRoleScreen({
  roleTitle = 'Senior Product Engineer',
  openings = 1,
  onBack,
  onApprove,
  onStartSourcing,
  onBackToRoles,
}) {
  const [editing, setEditing] = useState(false)
  const [approved, setApproved] = useState(false)
  const [competencies, setCompetencies] = useState(INITIAL_COMPETENCIES)
  const [mustHaves, setMustHaves] = useState(INITIAL_MUST_HAVES)
  const [jd, setJd] = useState(INITIAL_JD)

  const total = competencies.reduce((sum, c) => sum + c.weight, 0)
  const balanced = total === 100

  const setWeight = (i, value) =>
    setCompetencies((prev) => prev.map((c, idx) => (idx === i ? { ...c, weight: value } : c)))

  const setMustHave = (i, value) =>
    setMustHaves((prev) => prev.map((m, idx) => (idx === i ? value : m)))
  const removeMustHave = (i) => setMustHaves((prev) => prev.filter((_, idx) => idx !== i))
  const addMustHave = () => setMustHaves((prev) => [...prev, ''])

  const approve = () => {
    onApprove?.()
    setApproved(true)
  }

  /* ── Approved / confirmation state ───────────────────────────── */
  if (approved) {
    return (
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 pb-16">
          <div className="flex max-w-md flex-col items-center gap-5 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckIcon className="h-7 w-7" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h2 className="text-xl text-ink">Role approved</h2>
              <p className="text-sm leading-relaxed text-secondary">
                The scorecard for <span className="text-ink">{roleTitle}</span> is locked in.
                Azisly will start sourcing candidates. They&rsquo;ll appear as they come in.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button onClick={onStartSourcing}>Go to candidates</Button>
              <Button variant="secondary" onClick={onBackToRoles}>
                Back to roles
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  /* ── Card ready / editing states ─────────────────────────────── */
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 px-6 pt-8 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div>
          <p className="text-[13px] font-medium text-secondary">Roles · Review</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Role card</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <Card className="flex flex-col gap-8 p-7">
            {/* Summary */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-ink">{roleTitle}</h2>
                <p className="mt-0.5 text-[13px] text-secondary">
                  {openings} opening{openings === 1 ? '' : 's'} · Remote · Europe · Full-time
                </p>
              </div>
              <Tag color="purple">Draft</Tag>
            </div>

            {/* Competencies & weighting */}
            <section className="flex flex-col gap-4">
              <div className="flex items-baseline justify-between">
                <SectionLabel>Competencies &amp; weighting</SectionLabel>
                <span
                  className={`text-xs font-semibold tabular-nums ${
                    balanced ? 'text-secondary' : 'text-attention'
                  }`}
                >
                  Total {total}%
                </span>
              </div>
              <div className="flex flex-col gap-5">
                {competencies.map((c, i) => (
                  <WeightRow
                    key={c.name}
                    name={c.name}
                    weight={c.weight}
                    editing={editing}
                    onChange={(v) => setWeight(i, v)}
                  />
                ))}
              </div>
              {editing && !balanced && (
                <p className="text-xs text-attention">Weights must add up to 100% to approve.</p>
              )}
            </section>

            {/* Must-haves */}
            <section className="flex flex-col gap-4">
              <SectionLabel>Must-haves</SectionLabel>
              {editing ? (
                <div className="flex flex-col gap-2">
                  {mustHaves.map((m, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        value={m}
                        onChange={(e) => setMustHave(i, e.target.value)}
                        placeholder="Add a requirement…"
                        className="flex-1 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                      />
                      <button
                        type="button"
                        onClick={() => removeMustHave(i)}
                        aria-label="Remove must-have"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
                      >
                        <XIcon className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addMustHave}
                    className="flex items-center gap-1.5 self-start pt-1 text-[13px] text-accent transition-colors hover:text-ink"
                  >
                    <PlusIcon className="h-3.5 w-3.5" /> Add must-have
                  </button>
                </div>
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {mustHaves.map((m, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ink">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                        <CheckIcon className="h-2.5 w-2.5" />
                      </span>
                      {m}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Job description */}
            <section className="flex flex-col gap-4">
              <SectionLabel>Job description</SectionLabel>
              {editing ? (
                <textarea
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  rows={9}
                  className="w-full resize-none rounded-lg border border-hairline bg-surface p-3 text-sm leading-relaxed text-ink shadow-card transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
              ) : (
                <p className="whitespace-pre-line text-sm leading-relaxed text-secondary">{jd}</p>
              )}
            </section>
          </Card>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-hairline bg-background/90 px-6 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <span className="text-[13px] text-secondary">
            {editing ? 'Editing. Changes save as you go.' : 'Review the scorecard before sourcing.'}
          </span>
          <div className="flex items-center gap-3">
            <Button variant="secondary" onClick={() => setEditing((e) => !e)}>
              {editing ? 'Done' : 'Edit'}
            </Button>
            <Button disabled={!balanced} onClick={approve}>
              Approve and start sourcing
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
