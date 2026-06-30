import { useState } from 'react'
import { Button, Card } from '../components'
import {
  ShieldIcon,
  ClockIcon,
  ChatIcon,
  CameraIcon,
  SparkleIcon,
  EyeIcon,
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

function Section({ label, children }) {
  return (
    <div className="flex flex-col gap-2.5 px-6 py-5 lg:px-7">
      <p className="text-sm font-medium text-secondary">{label}</p>
      {children}
    </div>
  )
}

function Fact({ icon: Icon, children }) {
  return (
    <li className="flex gap-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
      <span className="text-[15px] leading-relaxed text-ink">{children}</span>
    </li>
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
 * link. Azisly is the trusted host; the company is context. Trust first, then
 * context, then the ask, then consent. States: valid, expired, filled, completed.
 */
export default function CandidateInterviewLanding({
  status = 'valid',
  role = 'Senior Product Engineer',
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

  // Valid landing
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Header />

      <main className="flex-1 px-6 py-10 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-7">
          {/* 1 + 2: the clear line, the company as guest context, the warm intro */}
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

          {/* 3 + 4 + 5: about the role, the company, the interview */}
          <Card className="flex flex-col divide-y divide-hairline p-0">
            <Section label="About the role">
              <p className="text-[15px] leading-relaxed text-secondary">
                As a {role} at {company}, you would own product-facing features end to end, from
                shaping the problem with design and product to shipping and measuring the result. You
                would work across two squads and help set the technical direction for your area.
              </p>
            </Section>

            <Section label={`About ${company}`}>
              <p className="text-[15px] leading-relaxed text-secondary">
                {company} builds tools that help teams plan and ship their work. It is a remote-first
                company across Europe, around 200 people, behind a product used by thousands of teams
                every day.
              </p>
            </Section>

            <Section label="About this interview">
              <ul className="flex flex-col gap-3">
                <Fact icon={ClockIcon}>It takes about 20 to 30 minutes.</Fact>
                <Fact icon={ChatIcon}>
                  A short set of questions, asked one at a time. You answer in your own words.
                </Fact>
                <Fact icon={CameraIcon}>
                  It is a video interview, so you will use your camera and microphone.
                </Fact>
                <Fact icon={SparkleIcon}>
                  An AI interviewer runs it. You are judged on what you say, not your CV or your
                  accent.
                </Fact>
                <Fact icon={EyeIcon}>
                  After you finish, {company}'s hiring team reviews your interview.
                </Fact>
              </ul>
            </Section>
          </Card>

          {/* 6: recording and privacy, made prominent, not buried */}
          <Card className="flex flex-col gap-3.5 border-ink/10 bg-ink/[0.02] p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <ShieldIcon className="h-4 w-4 text-secondary" />
              Recording and privacy
            </div>
            <ul className="flex flex-col gap-3">
              <Fact icon={CameraIcon}>This session is recorded, both video and audio.</Fact>
              <Fact icon={SparkleIcon}>
                An AI interviewer asks the questions and assesses your answers.
              </Fact>
              <Fact icon={EyeIcon}>{company}'s hiring team can view your recorded interview.</Fact>
              <Fact icon={ShieldIcon}>
                Your recording is stored securely, used only for this role, and is never sold or used
                to train public models.
              </Fact>
            </ul>
          </Card>

          {/* 7: two actions of equal weight, or the gentle decline flow */}
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
              <div className="flex flex-wrap items-center justify-end gap-3 border-t border-hairline pt-5">
                <Button variant="secondary" onClick={() => setPhase('landing')}>
                  Back
                </Button>
                <Button onClick={() => setPhase('declined')}>Send and close</Button>
              </div>
            </Card>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button className="flex-1 justify-center" onClick={onContinue}>
                  Continue to set up
                </Button>
                <Button variant="secondary" className="flex-1 justify-center" onClick={() => setPhase('declining')}>
                  Not right now
                </Button>
              </div>
              {/* 8: housekeeping */}
              <p className="text-center text-[13px] text-secondary">
                This link is private to you and expires on {expiresOn}.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
