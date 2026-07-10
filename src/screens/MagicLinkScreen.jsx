import { Button, Card } from '../components'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'
import { LockIcon } from '../components/icons.jsx'

/*
 * MagicLinkScreen — the hiring manager opening a define link (no account).
 *
 *   valid          they land, see which role it is for, and start defining
 *   expired        the link is expired on open
 *   expiredPaused  the link expired while they were paused mid-definition
 *
 * The expired copy is verbatim PRD, including the PRD's own [recruiter_name]
 * placeholder — we do not invent a name.
 */
export default function MagicLinkScreen({ variant = 'valid', roleTitle = '', titleIsFixture = false, onStart }) {
  if (variant === 'valid') {
    return (
      <Shell>
        <Card className="flex max-w-md flex-col items-center gap-5 p-8 text-center">
          {/* PRD: "They see which role it is for." No exact string is given for the
              surrounding copy, so it is COPY NEEDED. The role title is shown. */}
          <p className="text-[13px] font-medium uppercase tracking-wide text-muted">
            <CopyNeeded note="magic-link intro" />
          </p>
          <h1 className="flex items-center gap-2 text-xl font-semibold text-ink">
            {roleTitle}
            {titleIsFixture && <FixtureTag />}
          </h1>
          {/* Recruiter-facing invite promise, shown here as context. Verbatim PRD. */}
          <p className="text-sm text-secondary">This link works for one week and opens only this role.</p>
          <Button onClick={onStart}>
            <CopyNeeded note="start-defining CTA" />
          </Button>
        </Card>
      </Shell>
    )
  }

  // expired on open, or expired while paused — same expired message (PRD §E, §F).
  return (
    <Shell>
      <Card className="flex max-w-md flex-col items-center gap-5 p-8 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <LockIcon className="h-6 w-6" />
        </span>
        {variant === 'expiredPaused' && (
          <p className="text-[13px] text-secondary">
            <CopyNeeded note="context: link expired while paused mid-definition" />
          </p>
        )}
        {/* Verbatim PRD, including the PRD's own [recruiter_name] placeholder. */}
        <p className="text-[15px] leading-relaxed text-ink">
          This link has expired. Please ask [recruiter_name] to send a new one.
        </p>
      </Card>
    </Shell>
  )
}

function Shell({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-6">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-12">{children}</main>
    </div>
  )
}
