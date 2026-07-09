import { useMemo } from 'react'
import { Button, Card } from '../components'
import { CheckIcon, ArrowRightIcon } from '../components/icons.jsx'
import { buildInterview, estimatedMinutes } from '../data/scorecard.js'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
function formatToday() {
  const d = new Date()
  return `${MONTHS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}

/* A finished piece of work: a substantial card with a green check, what was made,
   and its own action. Done, and it reads done. */
function CreatedCard({ title, detail, actionLabel, onAction }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
        <CheckIcon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        {detail && <p className="mt-0.5 text-[13px] text-secondary">{detail}</p>}
      </div>
      <Button variant="secondary" onClick={onAction} className="!px-4 !py-2 !text-[13px]">
        {actionLabel}
      </Button>
    </Card>
  )
}

/**
 * RoleCompleteScreen — the moment the recruiter's role is submitted. It separates
 * what is DONE (the card and interview, real checkmarks) from what is RUNNING
 * (matching, a live pulse, never a tick), so nothing that is still working wears a
 * completed mark. The reassurance sits with the running item, where it answers the
 * question the recruiter is actually asking.
 */
export default function RoleCompleteScreen({
  roleTitle = 'Senior Product Engineer',
  onWatchSourcing,
  onBackToRoles,
  onViewCard,
  onPreviewInterview,
}) {
  const questions = useMemo(() => buildInterview({ title: roleTitle }), [roleTitle])
  const minutes = estimatedMinutes(questions.length)

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-9 px-6 py-14 lg:py-20">
        {/* Headline — a confident, earned moment */}
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
            <CheckIcon className="h-8 w-8" />
          </span>
          <div className="flex flex-col gap-2">
            <h1 className="text-[26px] font-bold leading-tight text-ink">Your role is ready.</h1>
            <p className="text-sm text-secondary">
              {roleTitle} · {formatToday()}
            </p>
          </div>
        </div>

        {/* CREATED — finished work, as substantial cards */}
        <div className="flex flex-col gap-3">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">Created</p>
          <CreatedCard title="Role card ready" actionLabel="View" onAction={onViewCard} />
          <CreatedCard
            title="Interview ready"
            detail={`Adaptive, about ${minutes} minutes`}
            actionLabel="See how"
            onAction={onPreviewInterview}
          />
        </div>

        {/* IN PROGRESS — running now, a live pulse, never a checkmark */}
        <div className="flex flex-col gap-3">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wide text-muted">In progress</p>
          <div className="rounded-card border border-accent/30 bg-accent-soft/40 p-5">
            <div className="flex items-center gap-4">
              <span className="relative flex h-10 w-10 shrink-0 items-center justify-center" aria-hidden="true">
                <span className="absolute inset-0 animate-ping rounded-full bg-accent/20" />
                <span className="relative h-3.5 w-3.5 rounded-full bg-accent" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-ink">Finding candidates</p>
                <p className="mt-0.5 text-[13px] text-secondary">Matching is running now.</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-strong">
                Running
              </span>
            </div>

            {/* Indeterminate progress: motion that says "this is happening" */}
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-accent/15">
              <div className="h-full w-1/4 rounded-full bg-accent animate-indeterminate" />
            </div>

            {/* The reassurance, raised to hero weight, right where it is asked */}
            <p className="mt-4 text-[15px] font-medium leading-relaxed text-ink">
              You do not need to wait here. We will notify you the moment candidates are ready to review.
            </p>
          </div>
        </div>

        {/* Actions — the primary names where it goes */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={onWatchSourcing}>
            Watch sourcing
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
          <Button variant="secondary" onClick={onBackToRoles}>
            Back to roles
          </Button>
        </div>
      </div>
    </div>
  )
}
