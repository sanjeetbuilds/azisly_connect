import { useEffect, useState } from 'react'
import Card from './Card.jsx'
import Button from './Button.jsx'
import { CheckIcon } from './icons.jsx'

// The ABI matching engine as short reassuring step titles only. No sub-text:
// the animation shows work is happening, it is not a document to read.
const STEPS = [
  'Reading profiles',
  'Mapping to competencies',
  'Scoring against the rubric',
  'Weighing experience',
  'Ranking candidates',
]

const STEP_MS = 1000

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
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-strong">
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
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-hairline text-[12px] text-secondary tabular-nums">
      {n}
    </span>
  )
}

function ProcessingStep({ title, status, fill, n }) {
  const width = status === 'done' ? 100 : status === 'active' ? fill : 0
  return (
    <div className={`flex items-center gap-3.5 transition-opacity ${status === 'pending' ? 'opacity-55' : 'opacity-100'}`}>
      <StepMarker status={status} n={n} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className={`text-sm font-medium ${status === 'pending' ? 'text-secondary' : 'text-ink'}`}>
            {title}
          </span>
          {status === 'done' && <span className="text-[12px] font-medium text-strong">Done</span>}
        </div>
        <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-ink/[0.06]">
          <div
            className="h-full rounded-full bg-accent transition-[width] ease-out"
            style={{ width: `${width}%`, transitionDuration: status === 'active' ? `${STEP_MS}ms` : '300ms' }}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * MatchingProgress — the reassuring matching animation. Short step titles, a
 * small "N of 5" counter, and, once the steps finish, a single Show candidates
 * button at the bottom (under the last step) where the eye ends up.
 */
export default function MatchingProgress({ count = 0, onShow }) {
  const [active, setActive] = useState(-1)
  const [doneCount, setDoneCount] = useState(0)
  const [fill, setFill] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
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
          setFinished(true)
        }
      }, STEP_MS + 200)
      timers.push(() => clearTimeout(t))
    }
    run()
    return () => {
      cancelled = true
      timers.forEach((fn) => fn())
    }
  }, [])

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-4 py-8">
      <div className="flex justify-end">
        <span className="text-[13px] text-secondary tabular-nums">
          {doneCount} of {STEPS.length}
        </span>
      </div>

      <Card className="flex flex-col gap-5 p-6">
        {STEPS.map((title, i) => (
          <ProcessingStep
            key={title}
            title={title}
            n={i + 1}
            status={i < doneCount ? 'done' : i === active ? 'active' : 'pending'}
            fill={fill}
          />
        ))}
      </Card>

      {finished ? (
        <div className="flex flex-col items-center gap-3 pt-1 text-center">
          <p className="max-w-sm text-[13px] leading-relaxed text-secondary">
            Sourcing is under way. We will notify you the moment strong candidates are ready to review.
          </p>
          <Button onClick={onShow}>See candidates</Button>
        </div>
      ) : (
        <p className="text-center text-[13px] text-secondary">
          Scoring every candidate against your role card, its gates, and competencies.
        </p>
      )}
    </div>
  )
}
