import { useEffect, useState } from 'react'
import { Button } from '../components'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'
import {
  SparkleIcon,
  PaperclipIcon,
  ArrowLeftIcon,
  MicIcon,
  XIcon,
  ChevronRightIcon,
  ChevronDownIcon,
} from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { classifyProbeStub } from '../lib/probeStub.js'
import { DEMO_JD_FILENAME, DEMO_PASTED_JD, DEMO_VOICE_PARTIAL, DEMO_VOICE_ANSWERS } from '../data/fixtures.js'

/*
 * DefineRoleScreen — the recruiter (or manager) defines the role by reacting to
 * the card and talking to the AI.
 *
 * The card is on screen on arrival. The card and the conversation share one
 * scroll region (the page scrolls); the composer is pinned. The AI has already
 * asked its first question — no start CTA, no greeting, no empty state. Voice and
 * chat are one conversation; there is no mode toggle. The mic is the larger
 * control and is the only colour on the screen, and only when it is live.
 *
 * Each answer becomes a probe { phrase, competency, promise } via a STUB
 * (lib/probeStub.js). The competency is internal and never shown; the promise is.
 * Every probe row is tagged FIXTURE.
 */

// Authored copy.
const OPENING =
  "Tell me about this person. How they'll work, who they'll deal with, what they'll be up against. Whatever you're picturing."
const JD_OPENING = "I've read the JD. Tell me what it doesn't say."
const FOLLOWUPS = [
  "What's going to make this role hard? That's usually the thing worth testing.",
  'Who will they work with day to day?',
  'Is this something consumers use directly, or something a business buys?',
]
const MAX_FOLLOWUPS = 2

function Spinner({ className = 'h-4 w-4' }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" className={`animate-spin ${className}`}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
      <path d="M8 2a6 6 0 0 1 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function DefineRoleScreen({
  roleTitle = '',
  onBack,
  onComplete,
  onAskManager,
  reviewLabel = null,
  titleIsFixture = false,
  initialAnswers = [], // [{ text, fixture }]
  initialJd = 'closed', // closed | panel | uploading | uploaded | reading | unreadable
  initialVoice = 'off', // off | listening | notcaught | transcribing
}) {
  const scorecard = roleScorecard({ title: roleTitle })
  const [answers, setAnswers] = useState(initialAnswers)
  const [input, setInput] = useState('')
  const [jd, setJd] = useState(initialJd)
  const [jdText, setJdText] = useState('')
  const [voice, setVoice] = useState(initialVoice)
  const [jdEchoed, setJdEchoed] = useState(false)
  const [jdRead, setJdRead] = useState(false)
  const [earlierOpen, setEarlierOpen] = useState(false)
  const [landed, setLanded] = useState(0)
  const [highlight, setHighlight] = useState(false)

  // The card briefly highlights when a probe lands — a colourless flash.
  useEffect(() => {
    if (landed === 0) return
    setHighlight(true)
    const t = setTimeout(() => setHighlight(false), 900)
    return () => clearTimeout(t)
  }, [landed])

  const questions = [jdRead ? JD_OPENING : OPENING, ...FOLLOWUPS.slice(0, MAX_FOLLOWUPS)]
  const step = answers.length
  const currentQuestion = step < questions.length ? questions[step] : null
  const complete = currentQuestion === null
  const onOpening = step === 0 && !jdRead

  // Each answer is a probe. The stub returns { phrase, competency, promise }.
  const probes = answers.map((a, i) => classifyProbeStub(a.text, i, scorecard.domainCompetency))

  const transcript = []
  answers.forEach((a, i) => {
    if (questions[i]) transcript.push({ from: 'ai', text: questions[i] })
    transcript.push({ from: 'user', text: a.text, fixture: a.fixture })
  })
  if (currentQuestion) transcript.push({ from: 'ai', text: currentQuestion })
  const visibleCount = (currentQuestion ? 1 : 0) + (answers.length ? 1 : 0)
  const earlier = transcript.slice(0, transcript.length - visibleCount)
  const lastAnswer = answers.length ? answers[answers.length - 1] : null

  const submitType = () => {
    const text = input.trim()
    if (!text) return
    setAnswers((prev) => [...prev, { text, fixture: false }])
    setLanded((n) => n + 1)
    setInput('')
  }

  // Voice — no speech-to-text exists, so a spoken turn plays back a fixture
  // answer (tagged FIXTURE), which becomes a probe like a typed turn.
  const micTap = () => {
    if (voice === 'listening' || answers.length >= DEMO_VOICE_ANSWERS.length) return
    setVoice('listening')
    setTimeout(() => {
      setVoice('off')
      setAnswers((prev) => [...prev, { text: DEMO_VOICE_ANSWERS[prev.length], fixture: true }])
      setLanded((n) => n + 1)
    }, 1200)
  }

  const openJd = () => setJd('panel')
  const closeJd = () => setJd('closed')
  const doUpload = () => {
    setJd('uploading')
    setTimeout(() => setJd('uploaded'), 1000)
  }
  const readJd = () => {
    setJd('reading')
    setTimeout(() => {
      setJd('closed')
      setJdEchoed(true)
      setJdRead(true)
    }, 1000)
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background">
      {/* Header — pinned. */}
      <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 border-b border-hairline bg-surface px-6 py-4 lg:px-8">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            aria-label="Back"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-md border border-hairline text-secondary transition-colors hover:border-ink/20 hover:text-ink"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-secondary">Define the role</p>
          <h1 className="flex items-center gap-2 truncate text-xl font-bold text-ink">
            {roleTitle}
            {titleIsFixture && <FixtureTag />}
          </h1>
        </div>
        {onAskManager && (
          <Button variant="secondary" onClick={onAskManager} className="shrink-0 !px-3.5 !py-2 !text-[13px]">
            Ask a hiring manager to define
          </Button>
        )}
      </div>

      {/* One scroll region: the card and the conversation. The card is not a
          scroll container; the page scrolls, the composer is pinned. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
        <div className="flex w-full max-w-2xl flex-col gap-8 py-6">
          <RoleCard scorecard={scorecard} probes={probes} highlight={highlight} />

          {jdEchoed && (
            <div className="rounded-card border border-hairline bg-surface p-4 text-sm text-secondary">
              <div className="mb-1 flex items-center gap-2">
                <span className="font-medium text-ink">{DEMO_JD_FILENAME}</span>
                <FixtureTag />
              </div>
              <p className="whitespace-pre-line">{DEMO_PASTED_JD}</p>
              <p className="mt-2">
                <CopyNeeded note="post-JD read-back — PRD string asserts extracted content this build does not produce" />
              </p>
            </div>
          )}

          {/* Conversation. */}
          <div className="flex flex-col gap-2">
            {earlier.length > 0 && (
              <div>
                <button
                  type="button"
                  onClick={() => setEarlierOpen((o) => !o)}
                  className="flex items-center gap-1 text-[12px] font-medium text-secondary transition-colors hover:text-ink"
                >
                  {earlierOpen ? <ChevronDownIcon className="h-3.5 w-3.5" /> : <ChevronRightIcon className="h-3.5 w-3.5" />}
                  Earlier
                </button>
                {earlierOpen && (
                  <div className="mt-2 flex flex-col gap-1.5 border-l border-hairline pl-3">
                    {earlier.map((t, i) => (
                      <p key={i} className="text-[13px] leading-snug">
                        <span className="text-secondary">{t.from === 'ai' ? 'Azzy' : 'You'}</span>{' '}
                        <span className="text-ink">{t.text}</span>
                        {t.fixture && <FixtureTag className="ml-1" />}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {lastAnswer && (
              <div className="flex justify-end">
                <div className="flex items-center gap-2 rounded-2xl rounded-tr-md border border-hairline bg-surface px-3 py-1.5 text-sm text-ink">
                  <span>{lastAnswer.text}</span>
                  {lastAnswer.fixture && <FixtureTag />}
                </div>
              </div>
            )}

            {currentQuestion && (
              <div className="flex gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-secondary">
                  <SparkleIcon className="h-3 w-3" />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] leading-snug text-ink">{currentQuestion}</p>
                  {onOpening && <p className="mt-1 text-[13px] text-secondary">No wrong answers. Say as much as you like.</p>}
                </div>
              </div>
            )}

            {voice === 'listening' && (
              <p className="flex items-center gap-2 pl-[34px] text-[13px] text-secondary">
                <span className="h-2 w-2 animate-ping rounded-full bg-danger" /> Listening
              </p>
            )}
            {voice === 'notcaught' && (
              // The "not caught" line is not in the new PRD.
              <p className="pl-[34px] text-[13px]">
                <CopyNeeded note="voice not-caught line" />
              </p>
            )}
            {voice === 'transcribing' && (
              <p className="pl-[34px] text-[13px] text-secondary">
                <span className="text-ink">{DEMO_VOICE_PARTIAL}</span> <FixtureTag className="ml-1" />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Composer — pinned. Mic is the larger control; typing never blocked. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {jd !== 'closed' && jd !== 'panel' ? (
            <JdState jd={jd} onClose={closeJd} onRead={readJd} onReplace={doUpload} />
          ) : jd === 'panel' ? (
            <JdPanel jdText={jdText} setJdText={setJdText} onUpload={doUpload} onRead={readJd} onCancel={closeJd} />
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-end gap-3">
                {/* Mic — larger control. The only colour on the screen, and only
                    when live. Neutral (ink) otherwise. */}
                <button
                  type="button"
                  onClick={micTap}
                  aria-label="Speak"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-panel transition-colors ${
                    voice === 'listening' ? 'bg-danger' : 'bg-ink hover:bg-ink-hover'
                  }`}
                >
                  <MicIcon className="h-5 w-5" />
                </button>
                <div className="relative flex-1">
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        submitType()
                      }
                    }}
                    rows={1}
                    placeholder="or type, or drop a JD"
                    className="w-full resize-none rounded-lg border border-hairline bg-surface py-2.5 pl-3 pr-11 text-sm leading-relaxed text-ink shadow-card placeholder:text-muted focus:border-ink/25 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={openJd}
                    aria-label="Add a JD"
                    className="absolute bottom-1.5 right-2 flex h-8 w-8 items-center justify-center rounded-md text-secondary transition-colors hover:text-ink"
                  >
                    <PaperclipIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {onComplete && (
                <div className="flex justify-end">
                  {/* Review is the loudest thing once the AI stops — by weight, not
                      colour. */}
                  <Button
                    variant="secondary"
                    onClick={onComplete}
                    className={`!py-1.5 !text-[13px] ${complete ? '!border-ink !bg-ink !text-white' : ''}`}
                  >
                    {reviewLabel ?? 'Review role'}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function JdPanel({ jdText, setJdText, onUpload, onRead, onCancel }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {/* "Add a JD" is verbatim PRD. */}
        <span className="text-sm font-medium text-ink">Add a JD</span>
        <button type="button" onClick={onCancel} aria-label="Cancel" className="text-secondary hover:text-ink">
          <XIcon className="h-4 w-4" />
        </button>
      </div>
      <textarea
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
        rows={4}
        placeholder=""
        className="w-full resize-none rounded-md border border-hairline bg-surface p-3 text-sm leading-relaxed text-ink shadow-card focus:border-ink/25 focus:outline-none"
      />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onUpload}
          className="flex items-center gap-2 rounded-md border border-hairline bg-surface px-3 py-2 text-sm text-secondary shadow-card hover:text-ink"
        >
          <PaperclipIcon className="h-4 w-4" /> <CopyNeeded note="upload button" />
        </button>
        <Button onClick={onRead} disabled={!jdText.trim()}>
          <CopyNeeded note="use-JD CTA" />
        </Button>
      </div>
    </div>
  )
}

function JdState({ jd, onClose, onRead, onReplace }) {
  if (jd === 'uploading') {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-hairline bg-surface px-3.5 py-3 text-sm text-secondary shadow-card">
        {/* Verbatim PRD. */}
        <Spinner /> Uploading...
      </div>
    )
  }
  if (jd === 'uploaded') {
    return (
      <div className="flex items-center gap-3 rounded-md border border-hairline bg-surface px-3.5 py-3 shadow-card">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-ink/[0.06] text-secondary">
          <PaperclipIcon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 truncate text-sm font-medium text-ink">
            {DEMO_JD_FILENAME} <FixtureTag />
          </div>
          {/* Verbatim PRD. */}
          <div className="text-[12px] text-secondary">Uploaded</div>
        </div>
        {/* "Replace" is verbatim PRD. */}
        <button type="button" onClick={onReplace} className="text-[13px] font-medium text-ink hover:underline">
          Replace
        </button>
        <button type="button" onClick={onClose} aria-label="Remove" className="text-secondary hover:text-ink">
          <XIcon className="h-3.5 w-3.5" />
        </button>
        <Button onClick={onRead} className="!py-1.5 !text-[13px]">
          <CopyNeeded note="use-JD CTA" />
        </Button>
      </div>
    )
  }
  if (jd === 'reading') {
    return (
      <div className="flex items-center gap-2.5 rounded-md border border-hairline bg-surface px-3.5 py-3 text-sm text-secondary shadow-card">
        {/* Verbatim PRD. */}
        <Spinner /> Reading the JD...
      </div>
    )
  }
  // unreadable — verbatim PRD.
  return (
    <div className="flex items-center justify-between gap-3 rounded-md border border-danger/30 bg-danger-soft px-3.5 py-3 text-sm text-danger shadow-card">
      <span>I could not read that file. Try another file or paste the text instead.</span>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="text-danger/70 hover:text-danger">
        <XIcon className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
