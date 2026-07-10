import { useState } from 'react'
import { Button, Card } from '../components'
import {
  ShieldIcon,
  CameraIcon,
  CameraOffIcon,
  MicIcon,
  MicOffIcon,
  CheckIcon,
} from '../components/icons.jsx'

const QUESTIONS = [
  'To start, walk me through a project you are proud of. What was your role, and what made it work?',
  'Tell me about a time you had to make a technical decision with incomplete information. What did you do, and how did it turn out?',
  'Describe a piece of feedback that changed the way you work.',
  'When you join an unfamiliar codebase, how do you get up to speed and start contributing?',
  'Tell me about a disagreement with a teammate. How did you work through it?',
  'What is something you have learned recently, and what made you want to learn it?',
]

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

/* The candidate's own self-view, the one large video. STUB: engineers wire the
   real camera feed here. No stock person, no second participant. */
function SelfView({ cameraOn, micOn }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-ink to-[#24242b] shadow-panel">
      <span className="absolute left-3 top-3 z-10 inline-flex items-center rounded-md border border-dashed border-surface/40 px-2 py-1 font-mono text-[11px] text-surface/75">
        STUB · live camera feed wired here
      </span>

      {cameraOn ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-surface/65">
          <CameraIcon className="h-8 w-8" />
          <p className="text-sm">Your camera, live self-view</p>
          <p className="text-[12px] text-surface/40">The real feed appears here once connected</p>
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-2 text-surface/55">
          <CameraOffIcon className="h-8 w-8" />
          <p className="text-sm">Camera off</p>
        </div>
      )}

      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[12px] text-surface/80">
        <span>You</span>
        {!micOn && (
          <span className="inline-flex items-center gap-1.5">
            <MicOffIcon className="h-3.5 w-3.5" />
            Muted
          </span>
        )}
      </div>
    </div>
  )
}

/* The AI as a calm presence: a quiet animated audio mark, never a face. */
function AiPresence() {
  return (
    <div className="flex flex-col gap-2">
      <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-hairline bg-surface px-3 py-1.5 shadow-card">
        <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className="h-full w-[3px] origin-bottom animate-mic-bar rounded-full bg-accent"
              style={{ animationDelay: `${i * 130}ms` }}
            />
          ))}
        </span>
        <span className="text-[13px] font-medium text-ink">AI interviewer</span>
      </span>
      <p className="pl-1 font-mono text-[12px] text-secondary/80">
        STUB: the real AI asks this and listens to your answer
      </p>
    </div>
  )
}

/* A round device toggle: on is quiet and neutral, off reads clearly muted. */
function DeviceToggle({ on, onIcon: OnIcon, offIcon: OffIcon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!on}
      aria-label={on ? `Turn ${label} off` : `Turn ${label} on`}
      title={on ? `Turn ${label} off` : `Turn ${label} on`}
      className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
        on
          ? 'border-hairline bg-surface text-ink hover:border-ink/25'
          : 'border-error/30 bg-error/[0.06] text-error hover:border-error/50'
      }`}
    >
      {on ? <OnIcon className="h-4 w-4" /> : <OffIcon className="h-4 w-4" />}
    </button>
  )
}

/**
 * InterviewScreen — the recorded video interview, reached after the warm-up. The
 * candidate is alone with an AI: one large self-view, the AI shown only as a
 * quiet audio mark, one question at a time, and no scores or assessment anywhere.
 * The camera feed and the AI ask/listen behaviour are stubbed; everything else is
 * final quality.
 */
export default function InterviewScreen({
  role = 'Product Engineer',
  company = 'Acme',
  initialPhase = 'interview',
  initialIndex = 0,
}) {
  const [phase, setPhase] = useState(initialPhase) // interview | complete
  const [index, setIndex] = useState(initialIndex)
  const [cameraOn, setCameraOn] = useState(true)
  const [micOn, setMicOn] = useState(true)
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

      <main className="flex-1 px-6 py-8 lg:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
          {/* Progress */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[13px]">
              <span className="font-medium text-ink">
                Question {index + 1} of {total}
              </span>
              <span className="text-secondary">
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

          {/* One large self-view, with the question beside it */}
          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <SelfView cameraOn={cameraOn} micOn={micOn} />
            <div className="flex flex-col gap-5 lg:pt-1.5">
              <AiPresence />
              <h1 className="text-2xl leading-relaxed text-ink">{QUESTIONS[index]}</h1>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal controls */}
      <footer className="shrink-0 border-t border-hairline bg-surface">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
          <button
            type="button"
            onClick={() => setConfirmEnd(true)}
            className="text-[13px] font-medium text-secondary transition-colors hover:text-ink"
          >
            End interview
          </button>

          <div className="flex items-center gap-2">
            <DeviceToggle
              on={cameraOn}
              onIcon={CameraIcon}
              offIcon={CameraOffIcon}
              label="camera"
              onClick={() => setCameraOn((v) => !v)}
            />
            <DeviceToggle
              on={micOn}
              onIcon={MicIcon}
              offIcon={MicOffIcon}
              label="microphone"
              onClick={() => setMicOn((v) => !v)}
            />
          </div>

          <Button onClick={next} className="!px-6">
            {last ? 'Finish interview' : 'Done with this answer, next'}
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
