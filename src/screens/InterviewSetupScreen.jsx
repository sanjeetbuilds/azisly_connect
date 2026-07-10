import { useState } from 'react'
import { Button, Card } from '../components'
import {
  ShieldIcon,
  CameraIcon,
  MicIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
} from '../components/icons.jsx'

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

/* The candidate's self-view. STUB: engineers wire the real camera feed here. */
function CameraStub({ ready }) {
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-hairline bg-gradient-to-br from-ink to-[#24242b] shadow-card">
      <span className="absolute left-3 top-3 inline-flex items-center rounded-md border border-dashed border-surface/40 px-2 py-1 font-mono text-[11px] text-surface/75">
        STUB · live camera feed wired here
      </span>
      <div className="flex h-full flex-col items-center justify-center gap-2 text-surface/70">
        <CameraIcon className="h-8 w-8" />
        <p className="text-sm">Your camera, live self-view</p>
        <p className="text-[12px] text-surface/45">The real feed appears here once connected</p>
      </div>
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[12px] text-surface/80">
        <span>You</span>
        {ready && (
          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-strong" />
            Camera ready
          </span>
        )}
      </div>
    </div>
  )
}

/* Stubbed live mic level: an animated equaliser placeholder. */
function MicLevel({ active }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-hairline bg-surface px-4 py-3 shadow-card">
      <MicIcon className="h-4 w-4 shrink-0 text-secondary" />
      <div className="flex h-6 flex-1 items-end gap-1">
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            className={`h-full flex-1 origin-bottom rounded-full ${
              active ? 'animate-mic-bar bg-strong/70' : 'bg-ink/15'
            }`}
            style={active ? { animationDelay: `${(i % 8) * 80}ms` } : { transform: 'scaleY(0.2)' }}
          />
        ))}
      </div>
      <span className="shrink-0 text-[12px] text-secondary">
        {active ? 'Mic ready' : 'No signal'} <span className="font-mono text-secondary/70">(stub)</span>
      </span>
    </div>
  )
}

/* The "you are about to be recorded" notice, never a surprise. */
function RecordingNotice() {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-hairline bg-ink/[0.02] px-3.5 py-3">
      <ShieldIcon className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
      <p className="text-[13px] leading-relaxed text-ink">
        Heads up: once the real interview starts, your video and audio are recorded so the hiring team
        can review your answers. The check and warm-up here are not recorded.
      </p>
    </div>
  )
}

function Tips() {
  const tips = [
    'Find a quiet spot where you will not be interrupted.',
    'Sit somewhere well lit, with the light in front of you.',
    'Use a stable internet connection if you can.',
  ]
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-sm font-medium text-secondary">For the best result</p>
      <ul className="flex flex-col gap-2">
        {tips.map((t) => (
          <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-secondary">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink/20" />
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

/* The camera and mic permission state: prompt, ready, or denied. */
function PermissionPanel({ permission, onAllow, onRetry }) {
  if (permission === 'denied') {
    return (
      <Card className="flex flex-col gap-3 border-attention/25 bg-attention/[0.05] p-5">
        <div className="flex items-center gap-2 text-sm font-medium text-attention">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-attention/15">
            <XIcon className="h-3 w-3" />
          </span>
          Camera and microphone are blocked
        </div>
        <p className="text-[13px] leading-relaxed text-secondary">
          Your browser is blocking access, so the interview cannot run yet. To fix it:
        </p>
        <ol className="flex flex-col gap-1.5 text-[13px] leading-relaxed text-ink">
          <li>1. Click the camera icon in your browser address bar.</li>
          <li>2. Set camera and microphone to Allow.</li>
          <li>3. Refresh this page.</li>
        </ol>
        <div className="pt-1">
          <Button variant="secondary" onClick={onRetry}>
            Try again
          </Button>
        </div>
      </Card>
    )
  }

  if (permission === 'ready') {
    return (
      <Card className="flex flex-col gap-3 p-5">
        <p className="text-sm font-medium text-ink">Camera and microphone</p>
        {['Camera connected', 'Microphone connected'].map((label) => (
          <div key={label} className="flex items-center gap-2.5 text-sm text-ink">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-3 w-3" />
            </span>
            {label}
          </div>
        ))}
      </Card>
    )
  }

  // prompt
  return (
    <Card className="flex flex-col gap-3 p-5">
      <p className="text-sm font-medium text-ink">Camera and microphone</p>
      <p className="text-[13px] leading-relaxed text-secondary">
        The interview is on video, so we need your camera and microphone. Your browser will ask you to
        allow access.
      </p>
      <div className="pt-1">
        <Button onClick={onAllow}>Allow camera and microphone</Button>
      </div>
    </Card>
  )
}

function EngineerNote() {
  return (
    <p className="mt-6 rounded-lg border border-dashed border-hairline px-4 py-2.5 text-center font-mono text-[12px] leading-relaxed text-secondary">
      Prototype note for engineers: the camera self-view, mic level, and recording are stubbed. Wire
      the real feed and capture into the camera frame, and gate the primary action on real device
      readiness.
    </p>
  )
}

/**
 * InterviewSetupScreen — the pre-interview setup reached from the landing. Two
 * stages: a camera and mic check that gates on device readiness, then a warm-up
 * question that is explicitly not scored, so the first answer on camera is not
 * the one that counts. The camera feed, mic level, and recording are stubbed.
 */
export default function InterviewSetupScreen({
  role = 'Product Engineer',
  company = 'Acme',
  initialStage = 'check',
  initialPermission = 'prompt',
  onBack,
  onStartInterview,
}) {
  const [stage, setStage] = useState(initialStage) // check | warmup
  const [permission, setPermission] = useState(initialPermission) // prompt | ready | denied
  const ready = permission === 'ready'

  const backTo = () => (stage === 'warmup' ? setStage('check') : onBack?.())

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Header />

      <main className="flex-1 px-6 py-8 lg:px-8">
        <div className="mx-auto w-full max-w-4xl">
          {/* Page header */}
          <div className="mb-6 flex items-start gap-3">
            {(onBack || stage === 'warmup') && (
              <button
                type="button"
                onClick={backTo}
                aria-label="Back"
                className="-ml-1 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
              >
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
            )}
            <div>
              <p className="text-sm text-secondary">
                {company} · {role} · {stage === 'warmup' ? 'Warm-up' : 'Set up'}
              </p>
              <h1 className="mt-1.5 text-2xl text-ink">
                {stage === 'warmup' ? 'A quick practice question' : 'Camera and microphone check'}
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                {stage === 'warmup'
                  ? 'A practice run so the first time you answer on camera is not the one that counts.'
                  : 'A quick check so you are seen and heard clearly. Nothing here is recorded or scored.'}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Self-view and mic, shared by both stages */}
            <div className="flex flex-col gap-4">
              <CameraStub ready={ready} />
              <MicLevel active={ready} />
            </div>

            {/* Right column changes per stage */}
            {stage === 'check' ? (
              <div className="flex flex-col gap-5">
                <PermissionPanel
                  permission={permission}
                  onAllow={() => setPermission('ready')}
                  onRetry={() => setPermission('ready')}
                />
                <RecordingNotice />
                <Tips />
              </div>
            ) : (
              <WarmUpPanel role={role} />
            )}
          </div>

          {/* Primary action */}
          {stage === 'check' ? (
            <div className="mt-8 flex flex-col items-center gap-2">
              <Button
                disabled={!ready}
                onClick={() => setStage('warmup')}
                className="!px-6"
              >
                I&rsquo;m ready, start warm-up
              </Button>
              {!ready && (
                <p className="text-[13px] text-secondary">
                  Allow camera and microphone to continue.
                </p>
              )}
            </div>
          ) : (
            <div className="mt-8 flex justify-center">
              <Button onClick={onStartInterview} className="!px-6">
                Start the real interview
              </Button>
            </div>
          )}

          <EngineerNote />
        </div>
      </main>
    </div>
  )
}

/* Stage B right column: the warm-up question and a stubbed answer control. */
function WarmUpPanel({ role }) {
  const [recording, setRecording] = useState(false)
  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3.5 p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-ink/[0.05] px-2.5 py-1 text-[12px] font-medium text-secondary">
          Warm-up, this is not scored
        </span>
        <p className="text-lg leading-relaxed text-ink">
          To warm up, tell us about a project you enjoyed working on recently and what your part in it
          was.
        </p>
        <p className="text-[13px] leading-relaxed text-secondary">
          Take your time, think out loud, and remember there are no trick questions. This one is just
          practice for the {role} interview, so nothing here counts.
        </p>
      </Card>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-hairline bg-surface p-5 shadow-card">
        <button
          type="button"
          onClick={() => setRecording((r) => !r)}
          aria-label={recording ? 'Stop recording' : 'Record your practice answer'}
          className={`flex h-14 w-14 items-center justify-center rounded-full shadow-panel transition-colors ${
            recording ? 'bg-error text-surface' : 'bg-ink text-surface hover:bg-ink-hover'
          }`}
        >
          <MicIcon className="h-6 w-6" />
        </button>
        <p className="text-[13px] text-secondary">
          {recording ? 'Listening to your practice answer' : 'Tap to answer out loud'}{' '}
          <span className="font-mono text-secondary/70">(stub)</span>
        </p>
      </div>
    </div>
  )
}
