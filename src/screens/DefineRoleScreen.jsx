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
 * DefineRoleScreen — the recruiter (or manager) defines the role by reacting to a
 * drafted card and talking to the AI.
 *
 * The card is on screen on arrival, complete. Between the card and the composer
 * sits a one-band conversation strip: the AI's current question and the
 * recruiter's last answer, with earlier turns collapsed behind "Earlier". The AI
 * has already asked its first question — no start CTA, no greeting, no empty
 * state. Voice and chat are not modes; the same conversation accepts either.
 *
 * Each answer becomes a probe { phrase, competency }. The phrase is the exact
 * words. The competency is assigned by a STUB (lib/probeStub.js) that ignores the
 * phrase, so every probe row is tagged FIXTURE. A probe carries no score, no
 * tier, no weight.
 */

// Authored copy — treat as verbatim.
const OPENING = "Tell me anything about this role I wouldn't get from the title."
const JD_OPENING = "I've read the JD. Tell me what it doesn't say."
// The AI asks at most two of these, only about context the family cannot know.
// It never asks about the criteria on the card, and never asks a third.
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

  // The card briefly highlights when a probe lands, so the recruiter can see —
  // without being told — that talking changed something.
  useEffect(() => {
    if (landed === 0) return
    setHighlight(true)
    const t = setTimeout(() => setHighlight(false), 900)
    return () => clearTimeout(t)
  }, [landed])

  // The AI's questions: the opening (or its JD variant), then up to two follow-ups.
  const questions = [jdRead ? JD_OPENING : OPENING, ...FOLLOWUPS.slice(0, MAX_FOLLOWUPS)]
  const step = answers.length
  const currentQuestion = step < questions.length ? questions[step] : null
  const complete = currentQuestion === null // the AI has nothing left to ask

  // Each answer is a probe. The competency is stubbed, so every row is FIXTURE.
  const probes = answers.map((a, i) => ({
    phrase: a.text,
    competency: classifyProbeStub(i, scorecard.domainCompetency),
  }))

  // The transcript, and what the strip shows: the current question + last answer.
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
  // answer (tagged FIXTURE), which becomes a probe like any typed turn.
  const micTap = () => {
    if (voice === 'listening' || answers.length >= DEMO_VOICE_ANSWERS.length) return
    setVoice('listening')
    setTimeout(() => {
      setVoice('off')
      setAnswers((prev) => [...prev, { text: DEMO_VOICE_ANSWERS[prev.length], fixture: true }])
      setLanded((n) => n + 1)
    }, 1200)
  }

  // JD — the real state sequence, extracts nothing. After a read, the opening
  // question is replaced by its JD variant; no card field is written from a JD.
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
      {/* Header — no step counter, no progress bar. */}
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
          // "Ask a hiring manager to define" is PRD §E copy (the CTA in the header).
          <Button variant="secondary" onClick={onAskManager} className="shrink-0 !px-3.5 !py-2 !text-[13px]">
            Ask a hiring manager to define
          </Button>
        )}
      </div>

      {/* Body — the single scroll region. The card is here from the first frame. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 py-4">
          <div className={`rounded-card transition-shadow duration-300 ${highlight ? 'ring-2 ring-accent' : 'ring-0'}`}>
            <RoleCard scorecard={scorecard} roleTitle={roleTitle} probes={probes} showOrientation />
          </div>

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
        </div>
      </div>

      {/* Conversation strip — one band, never a pane, never a second scroll. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-3 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
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
                      <span className={t.from === 'ai' ? 'text-strong' : 'text-secondary'}>
                        {t.from === 'ai' ? 'Azzy' : 'You'}
                      </span>{' '}
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
              <div className="flex items-center gap-2 rounded-2xl rounded-tr-md border border-hairline bg-background px-3 py-1.5 text-sm text-ink">
                <span>{lastAnswer.text}</span>
                {lastAnswer.fixture && <FixtureTag />}
              </div>
            </div>
          )}

          {currentQuestion && (
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-strong">
                <SparkleIcon className="h-3 w-3" />
              </span>
              <p className="flex-1 text-[15px] leading-snug text-ink">{currentQuestion}</p>
            </div>
          )}

          {voice === 'listening' && (
            <p className="flex items-center gap-2 pl-[34px] text-[13px] text-secondary">
              <span className="h-2 w-2 animate-ping rounded-full bg-danger" />
              <CopyNeeded note="listening label" />
            </p>
          )}
          {voice === 'notcaught' && (
            // Verbatim PRD.
            <p className="pl-[34px] text-[13px] text-ink">Sorry, I did not catch that, could you say it again?</p>
          )}
          {voice === 'transcribing' && (
            <p className="pl-[34px] text-[13px] text-secondary">
              <span className="text-ink">{DEMO_VOICE_PARTIAL}</span> <FixtureTag className="ml-1" />
            </p>
          )}
        </div>
      </div>

      {/* Composer — mic is the primary control; typing is always available. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {jd !== 'closed' && jd !== 'panel' ? (
            <JdState jd={jd} onClose={closeJd} onRead={readJd} onReplace={doUpload} />
          ) : jd === 'panel' ? (
            <JdPanel jdText={jdText} setJdText={setJdText} onUpload={doUpload} onRead={readJd} onCancel={closeJd} />
          ) : (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-end gap-3">
                {/* Microphone — large, circular, accent fill, left of the input. */}
                <button
                  type="button"
                  onClick={micTap}
                  aria-label="Speak"
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-panel transition-colors ${
                    voice === 'listening' ? 'bg-danger' : 'bg-accent hover:bg-accent-hover'
                  }`}
                >
                  <MicIcon className="h-5 w-5" />
                </button>
                {/* Input — typing never blocked; paperclip for the JD sits inside. */}
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
                    className="w-full resize-none rounded-lg border border-hairline bg-surface py-2.5 pl-3 pr-11 text-sm leading-relaxed text-ink shadow-card placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
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
                  {/* Review becomes the primary action once the AI has nothing left
                      to ask. Submit works whether or not the recruiter spoke. */}
                  <Button
                    variant={complete ? 'primary' : 'secondary'}
                    onClick={onComplete}
                    className="!py-1.5 !text-[13px]"
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
        className="w-full resize-none rounded-md border border-hairline bg-surface p-3 text-sm leading-relaxed text-ink shadow-card focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
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
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-strong">
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
        <button type="button" onClick={onReplace} className="text-[13px] font-medium text-strong hover:underline">
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
