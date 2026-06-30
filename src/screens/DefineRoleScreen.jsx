import { useState } from 'react'
import { Button, Card, Tag } from '../components'
import {
  SparkleIcon,
  SendIcon,
  PaperclipIcon,
  ArrowLeftIcon,
  CheckIcon,
  MicIcon,
  ChatIcon,
} from '../components/icons.jsx'

const QUESTIONS = [
  'What does success look like for this role in the first six months?',
  'Which three or four competencies matter most, and how should we weigh them?',
  'What is the seniority and scope: who do they work with day to day?',
]

// Canned answers the mocked voice mode "hears" — keyed to each question.
const VOICE_ANSWERS = [
  'Two meaningful launches and a clear lift in activation within the first six months.',
  'System design and ownership weighted high, communication and code quality medium.',
  'Senior individual contributor, working day to day with design, product, and a tech lead.',
]

/* ── chat primitives ─────────────────────────────────────────── */
function AiRow({ children }) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
        <SparkleIcon className="h-3.5 w-3.5" />
      </span>
      <div className="flex-1 pt-0.5 text-[15px] leading-relaxed text-ink">{children}</div>
    </div>
  )
}

function UserRow({ children }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] rounded-2xl rounded-tr-md border border-hairline bg-background px-4 py-2.5 text-[15px] leading-relaxed text-ink">
        {children}
      </div>
    </div>
  )
}

function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`animate-spin ${className}`}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* A friendly assistant face — reused at the centre of the voice stage. */
function BotFace({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="9" cy="10.5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10.5" r="1.2" fill="currentColor" />
      <path d="M8.5 14.5c1.1 1.1 5.9 1.1 7 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

/* The mode switch sits in the header. */
function ModeToggle({ value, onChange }) {
  const opts = [
    { key: 'chat', label: 'Chat', Icon: ChatIcon },
    { key: 'voice', label: 'Voice', Icon: MicIcon },
  ]
  return (
    <div className="inline-flex rounded-lg border border-hairline bg-surface p-0.5 shadow-card">
      {opts.map(({ key, label, Icon }) => {
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              active ? 'bg-ink text-surface' : 'text-secondary hover:text-ink'
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        )
      })}
    </div>
  )
}

function VoiceAvatar({ state }) {
  const active = state === 'speaking' || state === 'listening'
  const ring = state === 'listening' ? 'bg-accent/25' : 'bg-accent/12'
  return (
    <span className="relative flex h-24 w-24 items-center justify-center">
      {active && <span className={`absolute inset-0 rounded-full ${ring} animate-ping`} />}
      <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-accent/10 text-accent ring-1 ring-accent/15">
        <BotFace />
      </span>
    </span>
  )
}

function MicButton({ state, onClick }) {
  const listening = state === 'listening'
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={state === 'thinking'}
      aria-label={listening ? 'Listening' : 'Tap to answer'}
      className={`flex h-14 w-14 items-center justify-center rounded-full shadow-panel transition-colors disabled:opacity-50 ${
        listening ? 'bg-error text-surface' : 'bg-ink text-surface hover:bg-ink-hover'
      }`}
    >
      <MicIcon className="h-6 w-6" />
    </button>
  )
}

/* The role card the AI assembles. Actions live in the screen footer, not here,
   so the Save action is always visible. Identical in both modes. */
function RoleCardPreview({ title, openings }) {
  const competencies = [
    { name: 'Problem Solving', weight: 'High' },
    { name: 'Ownership', weight: 'High' },
    { name: 'Communication', weight: 'Medium' },
    { name: 'Execution', weight: 'Medium' },
  ]
  return (
    <Card className="flex w-full flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-ink">{title}</h3>
          <p className="mt-0.5 text-[13px] text-secondary">
            {openings} opening{openings === 1 ? '' : 's'} · Remote · Europe · Full-time
          </p>
        </div>
        <Tag color="purple">Draft</Tag>
      </div>

      <p className="text-sm leading-relaxed text-secondary">
        Owns product-facing features end to end, from shaping the problem to shipping and
        measuring. Success in six months: two significant launches and a measurable lift in
        activation.
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-ink">Competencies &amp; weighting</p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          {competencies.map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between border-b border-hairline py-1.5 text-sm last:border-b-0 sm:[&:nth-last-child(2)]:border-b-0"
            >
              <span className="text-ink">{c.name}</span>
              <span className="text-[13px] text-secondary">{c.weight}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/**
 * DefineRoleScreen (Screen 2) — define the competency profile with AI. The user
 * picks HOW: Chat (text, one question at a time) or Voice (a mocked voice call
 * with a live transcript). Both modes share the same conversation state and
 * produce the same role card. Reused by the recruiter and, via magic link, by a
 * hiring manager.
 */
export default function DefineRoleScreen({
  roleTitle = 'New role',
  openings = 1,
  onBack,
  onComplete,
  reviewLabel = 'Review role',
}) {
  const [mode, setMode] = useState('chat') // chat | voice
  const [messages, setMessages] = useState([{ from: 'ai', text: QUESTIONS[0] }])
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('asking') // asking | building | ready
  const [jdOpen, setJdOpen] = useState(false)
  const [jdText, setJdText] = useState('')
  const [voiceState, setVoiceState] = useState('speaking') // speaking | listening | thinking | idle

  const currentQuestion = [...messages].reverse().find((m) => m.from === 'ai')?.text

  // Shared: record an answer and either ask the next question or build the card.
  const advance = (text) => {
    const next = step + 1
    if (next < QUESTIONS.length) {
      setMessages((m) => [...m, { from: 'user', text }, { from: 'ai', text: QUESTIONS[next] }])
      setStep(next)
      setVoiceState('speaking')
    } else {
      setMessages((m) => [...m, { from: 'user', text }])
      setPhase('building')
      setVoiceState('thinking')
      setTimeout(() => {
        setPhase('ready')
        setVoiceState('idle')
      }, 1400)
    }
  }

  const submitAnswer = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    advance(text)
  }

  const submitJd = () => {
    if (!jdText.trim()) return
    setJdOpen(false)
    setMessages((m) => [...m, { from: 'user', text: 'Pasted a job description to work from.' }])
    setPhase('building')
    setTimeout(() => setPhase('ready'), 1400)
  }

  // Mocked voice turn: tap the mic, "speak", and the transcript fills in.
  const micTap = () => {
    if (voiceState === 'listening' || voiceState === 'thinking') return
    setVoiceState('listening')
    setTimeout(() => advance(VOICE_ANSWERS[step] ?? 'Sounds good.'), 1500)
  }

  const progress =
    phase === 'ready' ? (
      <Tag color="green">
        <CheckIcon className="mr-1 h-3 w-3" /> Ready
      </Tag>
    ) : phase === 'building' ? (
      <Tag color="gray">Building…</Tag>
    ) : (
      <span className="hidden text-sm text-secondary sm:inline">
        Question {step + 1} of {QUESTIONS.length}
      </span>
    )

  const voiceStatus =
    phase === 'building' || voiceState === 'thinking'
      ? 'Thinking…'
      : voiceState === 'listening'
        ? 'Listening…'
        : 'Azzy is asking'

  const keepEditing = () => setPhase('asking')

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header — mode switch always visible */}
      <div className="flex shrink-0 items-center gap-3 border-b border-hairline px-6 py-4 lg:px-8">
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
        <div className="min-w-0 flex-1">
          <p className="text-sm text-secondary">Define the role</p>
          <h1 className="truncate text-xl text-ink">{roleTitle}</h1>
        </div>
        {progress}
        <ModeToggle value={mode} onChange={setMode} />
      </div>

      {/* ── Body ──────────────────────────────────────────────── */}
      {mode === 'chat' ? (
        <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 py-6">
            <div className="rounded-xl border border-hairline bg-accent/[0.04] p-5">
              <div className="flex items-center gap-2 text-sm font-medium text-ink">
                <SparkleIcon className="h-4 w-4 text-accent" />
                How this works
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-secondary">
                I&rsquo;ll ask a few short questions to build a clear, scoreable role card. Answer in
                your own words, or paste an existing job description and I&rsquo;ll work from that.
              </p>
            </div>

            {messages.map((m, i) =>
              m.from === 'ai' ? <AiRow key={i}>{m.text}</AiRow> : <UserRow key={i}>{m.text}</UserRow>,
            )}

            {phase === 'building' && (
              <AiRow>
                <span className="flex items-center gap-2.5 text-secondary">
                  <Spinner /> Building your role card…
                </span>
              </AiRow>
            )}

            {phase === 'ready' && (
              <>
                <AiRow>Here&rsquo;s the role card I put together. Review it and adjust anything.</AiRow>
                <RoleCardPreview title={roleTitle} openings={openings} />
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          {phase === 'ready' ? (
            <div className="min-h-0 flex-1 overflow-y-auto px-6 py-8 lg:px-8">
              <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6">
                <VoiceAvatar state="idle" />
                <p className="text-[15px] text-ink">
                  All set. Here&rsquo;s the role card from our conversation.
                </p>
                <RoleCardPreview title={roleTitle} openings={openings} />
              </div>
            </div>
          ) : (
            <>
              {/* Stage — question front and centre */}
              <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-6 text-center">
                <VoiceAvatar state={phase === 'building' ? 'thinking' : voiceState} />
                <div className="flex flex-col gap-2">
                  <p className="text-[13px] font-medium uppercase tracking-wide text-accent">
                    {voiceStatus}
                  </p>
                  <p className="mx-auto max-w-md text-lg leading-relaxed text-ink">{currentQuestion}</p>
                  <p className="text-[13px] text-secondary">
                    Question {step + 1} of {QUESTIONS.length}
                  </p>
                </div>
              </div>

              {/* Live transcript */}
              <div className="shrink-0 border-t border-hairline bg-surface px-6 py-3 lg:px-8">
                <div className="mx-auto w-full max-w-2xl">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-secondary">
                    Live transcript
                  </p>
                  <div className="flex max-h-24 flex-col gap-2 overflow-y-auto">
                    {messages.map((m, i) => (
                      <p key={i} className="text-sm leading-relaxed">
                        <span className={m.from === 'ai' ? 'text-accent' : 'text-secondary'}>
                          {m.from === 'ai' ? 'Azzy' : 'You'}
                        </span>{' '}
                        <span className="text-ink">{m.text}</span>
                      </p>
                    ))}
                    {voiceState === 'listening' && (
                      <p className="text-sm text-secondary">
                        <span className="text-secondary">You</span>{' '}
                        <span className="italic">listening…</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Footer — the input, the build status, or the Save action ── */}
      <div className="shrink-0 border-t border-hairline bg-background px-6 py-4 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {phase === 'ready' ? (
            <div className="flex items-center justify-end gap-3">
              <Button variant="secondary" onClick={keepEditing}>
                Keep editing
              </Button>
              <Button onClick={onComplete}>{reviewLabel}</Button>
            </div>
          ) : phase === 'building' ? (
            <div className="flex items-center justify-center gap-2.5 py-1 text-sm text-secondary">
              <Spinner /> Building your role card…
            </div>
          ) : mode === 'voice' ? (
            <div className="flex flex-col items-center gap-2">
              <MicButton state={voiceState} onClick={micTap} />
              <p className="text-[13px] text-secondary">
                {voiceState === 'listening'
                  ? 'Listening… tap to stop'
                  : voiceState === 'thinking'
                    ? 'One moment…'
                    : 'Tap the mic to answer'}
              </p>
            </div>
          ) : jdOpen ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink">Paste or upload a job description</span>
                <button
                  type="button"
                  onClick={() => setJdOpen(false)}
                  className="text-[13px] text-secondary transition-colors hover:text-ink"
                >
                  Cancel
                </button>
              </div>
              <textarea
                value={jdText}
                onChange={(e) => setJdText(e.target.value)}
                rows={4}
                placeholder="Paste the job description here…"
                className="w-full resize-none rounded-lg border border-hairline bg-surface p-3 text-sm leading-relaxed text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2 text-sm text-secondary shadow-card transition-colors hover:text-ink"
                >
                  <PaperclipIcon className="h-4 w-4" /> Upload file
                </button>
                <Button onClick={submitJd} disabled={!jdText.trim()}>
                  Use this JD
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-end gap-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      submitAnswer()
                    }
                  }}
                  rows={1}
                  placeholder="Type your answer…"
                  className="flex-1 resize-none rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
                <Button onClick={submitAnswer} disabled={!input.trim()} aria-label="Send" className="!px-3.5">
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setJdOpen(true)}
                className="flex items-center gap-1.5 self-start text-[13px] text-secondary transition-colors hover:text-ink"
              >
                <PaperclipIcon className="h-3.5 w-3.5" />
                Paste or upload a job description instead
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
