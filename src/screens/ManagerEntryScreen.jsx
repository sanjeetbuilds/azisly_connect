import { useState } from 'react'
import { Button, Card, Avatar } from '../components'
import { SparkleIcon, ClockIcon } from '../components/icons.jsx'

function Wordmark() {
  return (
    <span className="font-semibold tracking-tight text-ink">
      Azisly <span className="text-secondary">Recruit</span>
    </span>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 16 16" fill="none" className="h-5 w-5 animate-spin text-secondary">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/**
 * ManagerEntryScreen — the hiring manager's magic-link landing. No login, no
 * sidebar: a clean, focused welcome. The copy adapts to the link type ('define'
 * the role, or 'review' candidates). States: valid (welcome), expired/invalid,
 * and the get-started transition.
 */
export default function ManagerEntryScreen({
  kind = 'define', // 'define' | 'review'
  roleTitle = 'Product Engineer',
  recruiter = 'Aryan Mehta',
  recruiterAvatar,
  company = 'Acme',
  candidateCount = 0,
  linkStatus = 'valid',
  onStart,
}) {
  const [starting, setStarting] = useState(false)
  const first = recruiter.split(' ')[0]
  const expired = linkStatus !== 'valid'

  const copy =
    kind === 'review'
      ? {
          title: `Review candidates for the ${roleTitle} role`,
          body: `${first} at ${company} shortlisted ${candidateCount} candidate${
            candidateCount === 1 ? '' : 's'
          } for your call. Open each to see the score, evidence, and interview, then take them forward or pass.`,
          cta: 'Review candidates',
        }
      : {
          title: `${company} invited you to define the ${roleTitle} role`,
          body: "You'll shape the competencies this role is scored on.",
          cta: 'Start',
        }

  const begin = () => {
    setStarting(true)
    setTimeout(() => onStart?.(), 1000)
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <header className="flex h-16 shrink-0 items-center justify-center border-b border-hairline px-6">
        <Wordmark />
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {expired ? (
            <Card className="flex flex-col items-center gap-5 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-background text-secondary">
                <ClockIcon className="h-6 w-6" />
              </span>
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold text-ink">This link has expired or isn&rsquo;t valid</h1>
                <p className="text-sm leading-relaxed text-secondary">
                  Magic links are only valid for a short time. Ask {first} for a fresh link and
                  you&rsquo;ll be right back here.
                </p>
              </div>
            </Card>
          ) : starting ? (
            <Card className="flex flex-col items-center gap-4 p-10 text-center">
              <Spinner />
              <p className="text-sm text-secondary">Getting things ready…</p>
            </Card>
          ) : (
            <Card className="flex flex-col items-center gap-6 p-8 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <SparkleIcon className="h-5 w-5" />
              </span>
              <div className="flex flex-col gap-2.5">
                {kind === 'review' && (
                  <p className="text-[13px] font-medium uppercase tracking-wide text-accent">
                    {company}
                  </p>
                )}
                <h1 className="text-xl font-bold leading-snug text-ink">{copy.title}</h1>
                <p className="text-sm leading-relaxed text-secondary">{copy.body}</p>
              </div>
              <Button className="w-full" onClick={begin}>
                {copy.cta}
              </Button>
              <div className="flex items-center gap-2 text-[13px] text-secondary">
                <Avatar src={recruiterAvatar} name={recruiter} size={20} />
                Invited by {recruiter} · {company}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
