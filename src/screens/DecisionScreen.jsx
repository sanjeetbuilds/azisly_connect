import { useState } from 'react'
import { Button, Card, Avatar, VerdictTag } from '../components'
import { ArrowLeftIcon, CheckIcon, MailIcon, PhoneIcon, LinkIcon } from '../components/icons.jsx'

const FALLBACK = {
  name: 'Maya Okonkwo',
  role: 'Senior Product Engineer',
  location: 'Lisbon',
  score: 86,
  verdict: 'strong',
  avatar: 'https://i.pravatar.cc/160?img=47',
}

function contactsFor(name) {
  const slug = name.toLowerCase().replace(/[^a-z]+/g, '.')
  const handle = name.toLowerCase().replace(/[^a-z]+/g, '-')
  return {
    email: `${slug}@gmail.com`,
    phone: '+351 912 345 678',
    linkedin: `linkedin.com/in/${handle}`,
  }
}

const SectionLabel = ({ children }) => (
  <p className="text-sm font-medium tracking-normal text-secondary">{children}</p>
)

export default function DecisionScreen({ candidate = FALLBACK, onBack, onDone }) {
  const [phase, setPhase] = useState('pending') // pending | confirm-reject | shortlisted | rejected
  const [note, setNote] = useState('')
  const contacts = contactsFor(candidate.name)

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
          <p className="text-[13px] font-medium text-secondary">Decision</p>
          <h1 className="mt-1 text-2xl font-bold text-ink">Shortlist or pass</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          {/* Candidate summary */}
          <Card className="flex items-center justify-between gap-6 p-6">
            <div className="flex items-center gap-4">
              <Avatar src={candidate.avatar} name={candidate.name} size={56} />
              <div className="flex flex-col gap-2">
                <div>
                  <h2 className="text-xl font-bold text-ink">{candidate.name}</h2>
                  <p className="text-sm text-secondary">
                    {candidate.role}
                  </p>
                </div>
                <VerdictTag verdict={candidate.verdict} />
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end">
              <span className="text-3xl font-bold text-ink tabular-nums">{candidate.score}</span>
              <span className="text-[13px] text-secondary">Interview</span>
            </div>
          </Card>

          {/* Pending — choose */}
          {phase === 'pending' && (
            <Card className="flex flex-col gap-5 p-6">
              <div>
                <SectionLabel>Your decision</SectionLabel>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                  Shortlisting unlocks {candidate.name.split(' ')[0]}&rsquo;s contact details so you
                  can reach out personally. Passing goes to a person for a considerate response.
                  Nothing is sent automatically.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => setPhase('shortlisted')}>Shortlist</Button>
                <Button variant="secondary" onClick={() => setPhase('confirm-reject')}>
                  Not a fit
                </Button>
              </div>
            </Card>
          )}

          {/* Shortlisted — contact details revealed */}
          {phase === 'shortlisted' && (
            <>
              <div className="flex items-start gap-2.5 rounded-card border border-accent/25 bg-accent/[0.04] px-4 py-3 text-sm text-ink">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <CheckIcon className="h-2.5 w-2.5" />
                </span>
                <span>
                  Shortlisted. {candidate.name.split(' ')[0]}&rsquo;s contact details are unlocked
                  below. Reach out personally; a short note goes a long way.
                </span>
              </div>

              <Card className="flex flex-col gap-4 p-6">
                <SectionLabel>Contact details</SectionLabel>
                <div className="flex flex-col gap-3">
                  <a
                    href={`mailto:${contacts.email}`}
                    className="flex items-center gap-3 text-sm text-ink transition-colors hover:text-accent"
                  >
                    <MailIcon className="h-4 w-4 text-secondary" />
                    {contacts.email}
                  </a>
                  <div className="flex items-center gap-3 text-sm text-ink">
                    <PhoneIcon className="h-4 w-4 text-secondary" />
                    {contacts.phone}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-ink">
                    <LinkIcon className="h-4 w-4 text-secondary" />
                    {contacts.linkedin}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
                  <Button onClick={onDone}>Done</Button>
                  <Button variant="secondary" onClick={() => setPhase('pending')}>
                    Undo
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* Confirm reject — human-in-the-loop tone */}
          {phase === 'confirm-reject' && (
            <Card className="flex flex-col gap-5 p-6">
              <div>
                <SectionLabel>Pass on {candidate.name.split(' ')[0]}</SectionLabel>
                <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                  A person reviews every pass before the candidate hears anything. No automated
                  rejection goes out. Add an optional note for the reviewer and the personal reply.
                </p>
              </div>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                placeholder="Optional: what stood out, or guidance for the reply…"
                className="w-full resize-none rounded-lg border border-hairline bg-surface p-3 text-sm leading-relaxed text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <div className="flex flex-wrap items-center gap-3">
                <Button onClick={() => setPhase('rejected')}>Send for human review</Button>
                <Button variant="secondary" onClick={() => setPhase('pending')}>
                  Cancel
                </Button>
              </div>
            </Card>
          )}

          {/* Rejected — confirmation */}
          {phase === 'rejected' && (
            <Card className="flex flex-col items-center gap-4 px-6 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-background text-secondary">
                <CheckIcon className="h-6 w-6" />
              </div>
              <div className="flex flex-col gap-1.5">
                <h2 className="text-lg text-ink">Sent for review</h2>
                <p className="max-w-sm text-sm leading-relaxed text-secondary">
                  A recruiter will read your note and send {candidate.name.split(' ')[0]} a
                  considerate, personal response. Nothing goes out automatically.
                </p>
              </div>
              <Button variant="secondary" onClick={onDone}>
                Back to candidates
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
