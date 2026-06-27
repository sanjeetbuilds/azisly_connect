import { useState } from 'react'
import { Button, Card, Avatar } from '../components'
import { SparkleIcon, ClockIcon } from '../components/icons.jsx'

function Wordmark() {
  return (
    <span className="font-medium tracking-tight text-ink">
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
 * ManagerEntryScreen (Screen 11) — the hiring manager's magic-link landing.
 * No login, no sidebar: a clean, focused welcome. States: valid link (welcome),
 * expired/invalid link, and the get-started transition.
 */
export default function ManagerEntryScreen({
  roleTitle = 'Senior Product Engineer',
  recruiter = 'Aryan Mehta',
  recruiterAvatar,
  company = 'Acme',
  linkStatus = 'valid',
  onStart,
}) {
  const [starting, setStarting] = useState(false)
  const first = recruiter.split(' ')[0]
  const expired = linkStatus === 'expired'

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
                <h1 className="text-xl text-ink">This link has expired</h1>
                <p className="text-sm leading-relaxed text-secondary">
                  Magic links are only valid for a short time. Ask {first} for a fresh invite link
                  and you&rsquo;ll be right back here.
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
                <h1 className="text-xl leading-snug text-ink">
                  You&rsquo;ve been invited to define the {roleTitle} role
                </h1>
                <p className="text-sm leading-relaxed text-secondary">
                  {first} asked you to help shape this role. Answer a few short questions in your own
                  words — about five minutes, and no account needed.
                </p>
              </div>
              <Button className="w-full" onClick={begin}>
                Get started
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
