import { useState } from 'react'
import { Button } from '../components'
import Shell from '../components/Shell.jsx'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'
import { SparkleIcon, PaperclipIcon, MicIcon, ChevronRightIcon, ChevronDownIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { classifyProbeStub } from '../lib/probeStub.js'
import { DEMO_VOICE_PARTIAL, DEMO_VOICE_ANSWERS, DEMO_JD_PHRASES } from '../data/fixtures.js'

/*
 * DefineRoleScreen — the recruiter defines the role inside the app shell.
 *
 * The card is ordered by who spoke last (see RoleCard). A JD is four beats in the
 * conversation strip, not a mode: the composer never disappears. Motion carries
 * the screen — probes fade/slide in, the card border pulses, the mic rings while
 * recording. All of it respects prefers-reduced-motion (handled globally).
 */

const OPENING =
  "Tell me about this person. How they'll work, who they'll deal with, what they'll be up against. Whatever you're picturing."
const JD_OPENING = "I've read the JD. Tell me what it doesn't say."
const FOLLOWUPS = [
  "What's going to make this role hard? That's usually the thing worth testing.",
  'Who will they work with day to day?',
  'Is this something consumers use directly, or something a business buys?',
]
const MAX_FOLLOWUPS = 2

// The four JD beats.
const BEAT_READING = 'Reading the JD...'
const BEAT_FOUND =
  'From this JD, this role is mostly about growth experiments and working closely with a small engineering team.'
const BEAT_LEFTOUT = "I've left out the experience and degree requirements, since this is a freshers role."

const CARD = 'rounded-[10px] border-[0.5px] border-hairline bg-surface'

// The thinking indicator. It appears only while a REAL request is in flight —
// which this stubbed build never has, so it is defined but dormant. Never a fake
// delay, never a spinner.
function Thinking() {
  return (
    <p className="flex items-center gap-1.5 pl-[34px] text-[13px] text-secondary">
      Working out what to test
      <span className="flex gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="h-1 w-1 animate-think rounded-full bg-secondary"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </span>
    </p>
  )
}

export default function DefineRoleScreen({
  roleTitle = '',
  onBack,
  onComplete,
  onAskManager,
  reviewLabel = null,
  titleIsFixture = false,
  initialAnswers = [],
  initialJdStage = null, // null | 'beat3' | 'landed' (demo states)
  chrome = true,
}) {
  const scorecard = roleScorecard({ title: roleTitle })
  const jdProbe = (phrase, i) => ({
    ...classifyProbeStub(phrase, i, scorecard.domainCompetency),
    source: 'jd',
    fixture: true,
  })

  const jdInit =
    {
      landed: {
        beats: [{ text: BEAT_READING }, { text: BEAT_FOUND, fixture: true }, { text: BEAT_LEFTOUT }],
        probes: DEMO_JD_PHRASES.map(jdProbe),
        read: true,
      },
      beat3: {
        beats: [{ text: BEAT_READING }, { text: BEAT_FOUND, fixture: true }],
        probes: DEMO_JD_PHRASES.map(jdProbe),
        read: false,
      },
    }[initialJdStage] ?? { beats: [], probes: [], read: false }

  const [answers, setAnswers] = useState(initialAnswers)
  const [input, setInput] = useState('')
  const [voice, setVoice] = useState('off')
  const [jdBeats, setJdBeats] = useState(jdInit.beats)
  const [jdProbes, setJdProbes] = useState(jdInit.probes)
  const [jdRead, setJdRead] = useState(jdInit.read)
  const [jdRunning, setJdRunning] = useState(initialJdStage === 'beat3')
  const [earlierOpen, setEarlierOpen] = useState(false)
  const [pulse, setPulse] = useState(false)

  const bumpPulse = () => {
    setPulse(true)
    setTimeout(() => setPulse(false), 420)
  }

  const questions = [jdRead ? JD_OPENING : OPENING, ...FOLLOWUPS.slice(0, MAX_FOLLOWUPS)]
  const step = answers.length
  const currentQuestion = step < questions.length ? questions[step] : null
  const complete = currentQuestion === null && !jdRunning
  const onOpening = step === 0 && !jdRead

  const talkProbes = answers.map((a, i) => ({
    ...classifyProbeStub(a.text, i, scorecard.domainCompetency),
    source: 'said',
    fixture: a.fixture,
  }))
  const probes = [...jdProbes, ...talkProbes]

  // Conversation transcript for "Earlier".
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
    bumpPulse()
    setInput('')
  }

  const micTap = () => {
    if (voice === 'listening' || answers.length >= DEMO_VOICE_ANSWERS.length) return
    setVoice('listening')
    setTimeout(() => {
      setVoice('off')
      setAnswers((prev) => [...prev, { text: DEMO_VOICE_ANSWERS[prev.length], fixture: true }])
      bumpPulse()
    }, 1200)
  }

  // A JD: four beats, one after the other, each appearing as it is ready. The
  // composer stays put throughout. (Timers stand in for real processing steps.)
  const runJd = () => {
    if (jdRunning || jdRead) return
    setJdRunning(true)
    setJdBeats([{ text: BEAT_READING }])
    setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_FOUND, fixture: true }]), 900)
    setTimeout(() => {
      setJdProbes([jdProbe(DEMO_JD_PHRASES[0], 0)])
      bumpPulse()
    }, 1700)
    setTimeout(() => {
      setJdProbes((p) => [...p, jdProbe(DEMO_JD_PHRASES[1], 1)])
      bumpPulse()
    }, 1850)
    setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_LEFTOUT }]), 2500)
    setTimeout(() => {
      setJdRead(true)
      setJdRunning(false)
    }, 3200)
  }

  const body = (
    <div className="flex h-full w-full flex-col gap-4">
      <RoleCard scorecard={scorecard} probes={probes} pulse={pulse} className="max-w-[720px]" />

      {/* Conversation + composer, pinned to the bottom of the content area. */}
      <div className="mt-auto flex w-full max-w-[720px] flex-col gap-4">
        <div className={`${CARD} flex flex-col gap-2 px-6 py-4`}>
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
                <div className="mt-2 flex flex-col gap-1.5 border-l-[0.5px] border-hairline pl-3">
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

          {/* JD beats — AI lines, each appearing as it is ready. */}
          {jdBeats.map((b, i) => (
            <div key={i} className="flex animate-fade-in gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-secondary">
                <SparkleIcon className="h-3 w-3" />
              </span>
              <p className="flex-1 text-[15px] leading-snug text-ink">
                {b.text}
                {b.fixture && <FixtureTag className="ml-2" />}
              </p>
            </div>
          ))}

          {lastAnswer && (
            <div className="flex justify-end">
              <div className="flex items-center gap-2 rounded-lg bg-ink/[0.04] px-3 py-1.5 text-sm text-ink">
                <span>{lastAnswer.text}</span>
                {lastAnswer.fixture && <FixtureTag />}
              </div>
            </div>
          )}

          {/* The pending question. Suppressed while the JD is still running. */}
          {currentQuestion && !jdRunning && (
            <div className="flex gap-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-secondary">
                <SparkleIcon className="h-3 w-3" />
              </span>
              <div className="flex-1">
                <p className="text-[15px] leading-snug text-ink">{currentQuestion}</p>
                {onOpening && !jdBeats.length && (
                  <p className="mt-1 text-[13px] text-secondary">No wrong answers. Say as much as you like.</p>
                )}
              </div>
            </div>
          )}

          {voice === 'listening' && (
            <p className="pl-[34px] text-[13px] text-secondary">Listening</p>
          )}
          {voice === 'transcribing' && (
            <p className="pl-[34px] text-[13px] text-secondary">
              <span className="text-ink">{DEMO_VOICE_PARTIAL}</span> <FixtureTag className="ml-1" />
            </p>
          )}
        </div>

        {/* Composer — always present. The mic and text field never move. */}
        <div className={`${CARD} px-4 py-3`}>
          <div className="flex items-end gap-3">
            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center">
              {voice === 'listening' && (
                <span className="absolute inset-0 animate-mic-ring rounded-full bg-accent/30" aria-hidden="true" />
              )}
              {/* The mic is the only coloured element. Recording is a ring scale,
                  not a colour change. */}
              <button
                type="button"
                onClick={micTap}
                aria-label="Speak"
                className="relative flex h-11 w-11 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-hover"
              >
                <MicIcon className="h-5 w-5" />
              </button>
            </span>
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
                className="w-full resize-none rounded-lg border-[0.5px] border-hairline bg-background py-2.5 pl-3 pr-11 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-ink/25 focus:outline-none"
              />
              <button
                type="button"
                onClick={runJd}
                aria-label="Add a JD"
                className="absolute bottom-1.5 right-2 flex h-8 w-8 items-center justify-center rounded-md text-secondary transition-colors hover:text-ink"
              >
                <PaperclipIcon className="h-4 w-4" />
              </button>
            </div>
            {onComplete && (
              <Button
                variant="secondary"
                onClick={onComplete}
                className={`shrink-0 !py-2.5 !text-[13px] ${complete ? '!border-ink !bg-ink !text-white' : ''}`}
              >
                {reviewLabel ?? 'Review role'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  if (!chrome) {
    return <div className="min-h-0 flex-1 overflow-y-auto bg-background p-6">{body}</div>
  }

  return (
    <Shell
      active="Roles"
      breadcrumb="Roles · New"
      title={roleTitle}
      onNavigate={() => onBack?.()}
      action={
        onAskManager && (
          <Button variant="secondary" onClick={onAskManager} className="shrink-0 !px-3.5 !py-2 !text-[13px]">
            Ask a hiring manager to define
          </Button>
        )
      }
    >
      {body}
    </Shell>
  )
}
