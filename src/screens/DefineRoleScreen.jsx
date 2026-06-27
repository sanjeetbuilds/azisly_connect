import { useState } from 'react'
import { Button, Card, Tag } from '../components'
import {
  SparkleIcon,
  SendIcon,
  PaperclipIcon,
  ArrowLeftIcon,
  CheckIcon,
} from '../components/icons.jsx'

const QUESTIONS = [
  'What does success look like for this role in the first six months?',
  'Which three or four competencies matter most — and how should we weigh them?',
  'What is the seniority and scope: who do they work with day to day?',
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

/* The card the AI assembles, shown in the "ready" state. */
function RoleCardPreview({ title, openings, onReview, onKeepEditing, reviewLabel = 'Review role' }) {
  const competencies = [
    { name: 'System design', weight: 'High' },
    { name: 'Ownership', weight: 'High' },
    { name: 'Communication', weight: 'Medium' },
    { name: 'Code quality', weight: 'Medium' },
  ]
  return (
    <Card className="flex flex-col gap-5 p-6">
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

      <div className="flex flex-wrap items-center gap-3 border-t border-hairline pt-5">
        <Button onClick={onReview}>{reviewLabel}</Button>
        <Button variant="secondary" onClick={onKeepEditing}>
          Keep editing
        </Button>
      </div>
    </Card>
  )
}

/**
 * DefineRoleScreen — the AI role-definition conversation. Self-contained so it
 * can later be reused by a hiring manager via a magic link. Drives the states:
 * intro → asking (input always visible) → answer captured → optional JD
 * paste/upload → building → card ready.
 */
export default function DefineRoleScreen({
  roleTitle = 'New role',
  openings = 1,
  onBack,
  onComplete,
  reviewLabel = 'Review role',
}) {
  const [messages, setMessages] = useState([{ from: 'ai', text: QUESTIONS[0] }])
  const [step, setStep] = useState(0)
  const [input, setInput] = useState('')
  const [phase, setPhase] = useState('chat') // chat | building | ready
  const [jdOpen, setJdOpen] = useState(false)
  const [jdText, setJdText] = useState('')

  const build = (extra) => {
    setMessages((m) => [...m, ...extra])
    setPhase('building')
    setTimeout(() => setPhase('ready'), 1400)
  }

  const submitAnswer = () => {
    const text = input.trim()
    if (!text) return
    setInput('')
    const next = step + 1
    if (next < QUESTIONS.length) {
      setMessages((m) => [...m, { from: 'user', text }, { from: 'ai', text: QUESTIONS[next] }])
      setStep(next)
    } else {
      build([{ from: 'user', text }])
    }
  }

  const submitJd = () => {
    if (!jdText.trim()) return
    setJdOpen(false)
    build([{ from: 'user', text: 'Pasted a job description for you to work from.' }])
  }

  const progress =
    phase === 'ready' ? (
      <Tag color="green">
        <CheckIcon className="mr-1 h-3 w-3" /> Ready
      </Tag>
    ) : phase === 'building' ? (
      <Tag color="gray">Building…</Tag>
    ) : (
      <span className="text-sm text-secondary">
        Step {step + 1} of {QUESTIONS.length}
      </span>
    )

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
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
          <p className="text-sm text-secondary">Defining role</p>
          <h1 className="truncate text-xl text-ink">{roleTitle}</h1>
        </div>
        {progress}
      </div>

      {/* Conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-8 py-8">
          {/* Intro / how it works */}
          <div className="rounded-xl border border-hairline bg-accent/[0.04] p-5">
            <div className="flex items-center gap-2 text-sm font-medium text-ink">
              <SparkleIcon className="h-4 w-4 text-accent" />
              How this works
            </div>
            <p className="mt-1.5 text-sm leading-relaxed text-secondary">
              I&rsquo;ll ask a few short questions to build a clear, scoreable role card. Answer in
              your own words — or paste an existing job description and I&rsquo;ll work from that.
            </p>
          </div>

          {/* Messages */}
          {messages.map((m, i) =>
            m.from === 'ai' ? <AiRow key={i}>{m.text}</AiRow> : <UserRow key={i}>{m.text}</UserRow>,
          )}

          {/* Building */}
          {phase === 'building' && (
            <AiRow>
              <span className="flex items-center gap-2.5 text-secondary">
                <Spinner /> Building your role card…
              </span>
            </AiRow>
          )}

          {/* Ready */}
          {phase === 'ready' && (
            <>
              <AiRow>Here&rsquo;s the role card I put together — review it and adjust anything.</AiRow>
              <RoleCardPreview
                title={roleTitle}
                openings={openings}
                reviewLabel={reviewLabel}
                onReview={onComplete}
                onKeepEditing={() => setPhase('chat')}
              />
            </>
          )}
        </div>
      </div>

      {/* Composer — answer input is always visible while the AI is asking */}
      {phase === 'chat' && (
        <div className="shrink-0 border-t border-hairline bg-background px-6 py-4 lg:px-8">
          <div className="mx-auto w-full max-w-2xl">
            {jdOpen ? (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">
                    Paste or upload a job description
                  </span>
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
                  rows={5}
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
                  <Button
                    onClick={submitAnswer}
                    disabled={!input.trim()}
                    aria-label="Send"
                    className="!px-3.5"
                  >
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
      )}
    </div>
  )
}
