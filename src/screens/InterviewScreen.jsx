import { useState } from 'react'
import { Button, Card } from '../components'
import { ShieldIcon, CameraIcon, CheckIcon } from '../components/icons.jsx'

const QUESTIONS = [
  'To start, walk me through a project you are proud of. What was your role, and what made it work?',
  'Tell me about a time you had to make a technical decision with incomplete information. What did you do, and how did it turn out?',
  'Describe a piece of feedback that changed the way you work.',
  'When you join an unfamiliar codebase, how do you get up to speed and start contributing?',
  'Tell me about a disagreement with a teammate. How did you work through it?',
  'What is something you have learned recently, and what made you want to learn it?',
]

/* A friendly AI face, reused from the define flow. */
function BotFace({ className = 'h-9 w-9' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
      <path d="M8.5 14.5c1.1 1.1 5.9 1.1 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function Header({ recording }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-hairline bg-surface px-6 lg:px-8">
      <span className="font-medium tracking-tight text-ink">
        Azisly <span className="text-secondary">Recruit</span>
      </span>
      {recording ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-error/30 bg-error/[0.06] px-2.5 py-1 text-[13px] font-medium text-error">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
          </span>
          Recording
        </span>
      ) : (
        <span className="hidden items-center gap-1.5 text-[13px] text-secondary sm:flex">
          <ShieldIcon className="h-4 w-4" />
          Secure interview
        </span>
      )}
    </header>
  )
}

/* The candidate self-view. STUB: engineers wire the real camera feed here. */
function SelfViewStub() {
  return (
    <div className="relative aspect-video w-52 overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-ink to-[#24242b] shadow-panel lg:w-60">
      <span className="absolute left-2 top-2 rounded border border-dashed border-surface/40 px-1.5 py-0.5 font-mono text-[10px] text-surface/70">
        STUB feed
      </span>
      <div className="flex h-full items-center justify-center text-surface/50">
        <CameraIcon className="h-5 w-5" />
      </div>
      <span className="absolute bottom-2 left-2 text-[11px] text-surface/80">You</span>
    </div>
  )
}

/**
 * InterviewScreen — the recorded video interview, reached after the warm-up. A
 * calm, uncluttered layout: the AI interviewer presents one question at a time
 * while the session records. The camera self-view and the AI ask/listen
 * behaviour are stubbed; everything else is final-quality.
 */
export default function InterviewScreen({
  role = 'Senior Product Engineer',
  company = 'Acme',
  initialPhase = 'interview',
  initialIndex = 0,
}) {
  const [phase, setPhase] = useState(initialPhase) // interview | complete
  const [index, setIndex] = useState(initialIndex)
  const [confirmEnd, setConfirmEnd] = useState(false)

  const total = QUESTIONS.length
  const last = index === total - 1

  const next = () => {
    if (last) setPhase('complete')
    else setIndex((i) => i + 1)
  }

  if (phase === 'complete') {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Header recording={false} />
        <main className="flex flex-1 items-center justify-center px-6 py-12">
          <Card className="flex max-w-md flex-col items-center gap-5 p-8 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-6 w-6" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-ink">Interview complete</h1>
              <p className="text-sm leading-relaxed text-secondary">
                Thanks for taking the time. {company}'s hiring team will review your interview and get
                back to you through Azisly about next steps.
              </p>
            </div>
            <p className="rounded-lg bg-background px-3.5 py-2 text-[13px] text-secondary">
              This interview is a single take and cannot be retaken.
            </p>
            <p className="text-xs text-secondary">You can close this tab.</p>
          </Card>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Header recording />

      <main className="relative flex-1 px-6 py-10 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-9">
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px] text-secondary">
              <span className="font-medium text-ink">
                Question {index + 1} of {total}
              </span>
              <span>
                {company} · {role}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
              <div
                className="h-full rounded-full bg-ink transition-[width] duration-500 ease-out"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          {/* AI interviewer presence + the current question */}
          <div className="flex flex-col items-center gap-5 pt-2 text-center">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/15" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/15">
                <BotFace />
              </span>
            </span>
            <p className="text-[13px] font-medium uppercase tracking-wide text-accent">
              Azisly interviewer is listening
            </p>
            <h1 className="max-w-xl text-xl leading-relaxed text-ink">{QUESTIONS[index]}</h1>
            <p className="font-mono text-[12px] text-secondary/80">
              STUB: the real AI asks this and listens to your answer
            </p>
          </div>
        </div>

        {/* Self-view, picture-in-picture */}
        <div className="pointer-events-none absolute bottom-6 right-6 hidden sm:block">
          <SelfViewStub />
        </div>
      </main>

      {/* Controls */}
      <footer className="shrink-0 border-t border-hairline bg-surface">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => setConfirmEnd(true)}
            className="text-[13px] font-medium text-secondary transition-colors hover:text-ink"
          >
            End interview
          </button>
          <Button onClick={next} className="!px-6">
            {last ? 'Done, finish interview' : 'Done with this answer'}
          </Button>
        </div>
        <p className="border-t border-dashed border-hairline px-6 py-2 text-center font-mono text-[12px] leading-relaxed text-secondary">
          Prototype note for engineers: the camera self-view and the AI ask-and-listen behaviour are
          stubbed. Wire the real feed and the AI conversation here; the recording indicator must
          reflect real capture state.
        </p>
      </footer>

      {/* End-interview confirmation */}
      {confirmEnd && (
        <>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setConfirmEnd(false)}
            className="fixed inset-0 z-40 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-hairline bg-surface p-6 shadow-overlay">
              <h2 className="text-lg text-ink">End the interview early?</h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                We will submit the answers you have given so far. You will not be able to retake this
                interview, so only end early if you need to.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={() => setConfirmEnd(false)}>
                  Keep going
                </Button>
                <Button
                  onClick={() => {
                    setConfirmEnd(false)
                    setPhase('complete')
                  }}
                >
                  End and submit
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
