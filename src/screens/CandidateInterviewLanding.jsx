import { useState } from 'react'
import { Button, Card } from '../components'
import {
  ShieldIcon,
  ClockIcon,
  ChatIcon,
  CameraIcon,
  SparkleIcon,
  SmileIcon,
  ChevronRightIcon,
  CheckIcon,
  XIcon,
} from '../components/icons.jsx'

/* The Azisly host header. Azisly is the trusted host; the company is context. */
function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-surface px-6 lg:px-8">
      <span className="font-medium tracking-tight text-ink">
        Azisly <span className="text-secondary">Recruit</span>
      </span>
      <span className="hidden items-center gap-1.5 text-[13px] text-secondary sm:flex">
        <ShieldIcon className="h-4 w-4" />
        Secure interview
      </span>
    </header>
  )
}

/* A small, guest-element company mark. Not the page owner. */
function CompanyLogo({ company, size = 44 }) {
  const initial = company?.trim()?.[0]?.toUpperCase() ?? '?'
  return (
    <span
      style={{ width: size, height: size }}
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-xl border border-hairline bg-surface text-base font-semibold text-ink shadow-card"
    >
      {initial}
    </span>
  )
}

/* One scannable fact: icon plus two or three words. */
function StatChip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[13px] font-medium text-ink shadow-card">
      <Icon className="h-3.5 w-3.5 text-secondary" />
      {children}
    </span>
  )
}

/* A quiet, closed-by-default disclosure for the nice-to-have detail. */
function Expander({ label, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 self-start text-[13px] font-medium text-secondary transition-colors hover:text-ink"
      >
        <ChevronRightIcon className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-90' : ''}`} />
        {label}
      </button>
      {open && <div className="mt-3 pl-5">{children}</div>}
    </div>
  )
}

/* A shared centered message used by the expired / filled / completed states. */
function MessageView({ icon, tone = 'neutral', title, body, footnote }) {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-12">
      <Card className="flex max-w-md flex-col items-center gap-5 p-8 text-center">
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            tone === 'strong'
              ? 'bg-strong/10 text-strong'
              : 'border border-hairline bg-background text-secondary'
          }`}
        >
          {icon}
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-xl text-ink">{title}</h1>
          <p className="text-sm leading-relaxed text-secondary">{body}</p>
        </div>
        {footnote && <p className="text-xs text-secondary">{footnote}</p>}
      </Card>
    </main>
  )
}

const DECLINE_REASONS = ['Too busy right now', 'Not interested in the role', 'Compensation', 'Something else']

/**
 * CandidateInterviewLanding — the page a candidate reaches from a private magic
 * link. Built so a candidate can decide in about ten seconds of scanning: the
 * title, a compact facts row, and Continue carry the eye; everything else is
 * secondary or tucked behind a disclosure. States: valid, expired, filled,
 * completed.
 */
export default function CandidateInterviewLanding({
  status = 'valid',
  role = 'Product Engineer',
  company = 'Acme',
  expiresOn = 'Jul 12, 2026',
  onContinue,
}) {
  const [phase, setPhase] = useState('landing') // landing | declining | declined
  const [reason, setReason] = useState(null)

  if (status === 'expired') {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Header />
        <MessageView
          icon={<ClockIcon className="h-6 w-6" />}
          title="This link has expired or has already been used"
          body="Interview links are private and time-limited. Ask the recruiter who sent it for a fresh link and you will be right back here."
          footnote="You can close this tab."
        />
      </div>
    )
  }

  if (status === 'filled') {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Header />
        <MessageView
          icon={<XIcon className="h-5 w-5" />}
          title="This position is no longer open"
          body={`Thank you for your interest in the ${role} role at ${company}. It has been filled or withdrawn, so there is no interview to take right now. We appreciate you taking the time.`}
          footnote="You can close this tab."
        />
      </div>
    )
  }

  if (status === 'completed') {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Header />
        <MessageView
          tone="strong"
          icon={<CheckIcon className="h-6 w-6" />}
          title="You have completed this interview"
          body={`Thanks for taking the time. ${company}'s hiring team is reviewing your interview and will be in touch about next steps. There is nothing more to do here.`}
          footnote="You can close this tab."
        />
      </div>
    )
  }

  // Valid landing — scannable hierarchy, mostly white space.
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Header />

      <main className="flex-1 px-6 py-12 lg:px-8 lg:py-16">
        <div className="mx-auto flex w-full max-w-xl flex-col gap-8">
          {/* The clear line + company as guest context + warm one-line intro */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <CompanyLogo company={company} />
              <span className="text-[13px] font-medium uppercase tracking-wide text-secondary">
                {company}
              </span>
            </div>
            <div>
              <h1 className="text-2xl leading-snug text-ink">
                Interview for {role} at {company}
              </h1>
              <p className="mt-2 text-[15px] leading-relaxed text-secondary">
                {company} invited you to a video interview for this role, conducted on Azisly.
              </p>
            </div>
          </div>

          {/* The facts row — scannable at a glance, not paragraphs */}
          <div className="flex flex-wrap gap-2">
            <StatChip icon={ClockIcon}>20 to 30 min</StatChip>
            <StatChip icon={ChatIcon}>a few questions</StatChip>
            <StatChip icon={CameraIcon}>video</StatChip>
            <StatChip icon={SparkleIcon}>AI-led</StatChip>
            <StatChip icon={SmileIcon}>take your time</StatChip>
          </div>

          {/* The ask + consent in one calm block */}
          {phase === 'declined' ? (
            <Card className="flex flex-col items-center gap-3 p-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-hairline bg-background text-secondary">
                <CheckIcon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg text-ink">Thanks for letting us know</h2>
                <p className="text-sm leading-relaxed text-secondary">
                  We have passed this along to the team. You can close this tab. If you change your
                  mind before the link expires, you are welcome back.
                </p>
              </div>
            </Card>
          ) : phase === 'declining' ? (
            <Card className="flex flex-col gap-4 p-6">
              <div>
                <h2 className="text-lg text-ink">No problem at all</h2>
                <p className="mt-1 text-sm leading-relaxed text-secondary">
                  If you are open to it, what is the main reason? This is optional and helps the team.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {DECLINE_REASONS.map((r) => {
                  const sel = reason === r
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setReason(sel ? null : r)}
                      className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        sel
                          ? 'border-accent bg-accent/[0.06] text-accent'
                          : 'border-hairline bg-surface text-secondary hover:border-ink/20 hover:text-ink'
                      }`}
                    >
                      {r}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center justify-end gap-3 border-t border-hairline pt-5">
                <Button variant="secondary" onClick={() => setPhase('landing')}>
                  Back
                </Button>
                <Button onClick={() => setPhase('declined')}>Send and close</Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <Button onClick={onContinue} className="!px-6">
                  Continue to set up
                </Button>
                <button
                  type="button"
                  onClick={() => setPhase('declining')}
                  className="px-1 py-1 text-sm font-medium text-secondary transition-colors hover:text-ink"
                >
                  Not right now
                </button>
              </div>

              {/* Recording and privacy, collapsed to one plain line + a disclosure */}
              <div className="flex flex-col gap-2 pt-1">
                <p className="flex items-start gap-2 text-[13px] leading-relaxed text-secondary">
                  <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  Recorded and assessed by AI, reviewed by {company}.
                </p>
                <Expander label="What we record and why">
                  <p className="text-[13px] leading-relaxed text-secondary">
                    Your video and audio are recorded so {company}'s hiring team can review your
                    answers. The recording is stored securely, used only for this role, and is never
                    sold or used to train public models.
                  </p>
                </Expander>
              </div>
            </div>
          )}

          {/* Nice-to-have context, tucked away so it does not slow the decision */}
          <Expander label="More about the role and company">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary">About the role</p>
                <p className="text-[14px] leading-relaxed text-secondary">
                  Own product-facing features end to end at {company}, from shaping the problem to
                  shipping and measuring. Work across two squads and help set the technical direction.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium text-secondary">About {company}</p>
                <p className="text-[14px] leading-relaxed text-secondary">
                  {company} builds tools that help teams plan and ship their work. Remote-first across
                  Europe, around 200 people, used by thousands of teams every day.
                </p>
              </div>
            </div>
          </Expander>

          {/* Housekeeping */}
          <p className="text-[13px] text-secondary">
            This link is private to you and expires on {expiresOn}.
          </p>
        </div>
      </main>
    </div>
  )
}
