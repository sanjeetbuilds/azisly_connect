import { useEffect, useRef, useState } from 'react'
import { Button } from '../components'
import Shell from '../components/Shell.jsx'
import RoleCard from '../components/RoleCard.jsx'
import { FixtureTag } from '../components/Spec.jsx'
import { SparkleIcon, PaperclipIcon, MicIcon, ChatIcon, CheckIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { classifyProbeStub } from '../lib/probeStub.js'
import { DEMO_VOICE_ANSWERS, DEMO_VOICE_PARTIAL, DEMO_JD_PHRASES } from '../data/fixtures.js'

/*
 * DefineRoleScreen — two columns inside the app shell.
 *
 *   Left (58%):  the role card. Flatter than the conversation; scrolls on its own.
 *   Right (42%): the conversation, with the composer pinned to the bottom of the
 *                column — it never scrolls out of view.
 *
 * A JD streams four beats down the right while the card reorders on the left. The
 * two happen in two columns; nothing stacks. The mic is the only colour.
 */

const OPENING =
  "Tell me about this person. How they'll work, who they'll deal with, what they'll be up against. Whatever you're picturing."
const JD_OPENING = "I've read the JD. Tell me what it doesn't say."
const FOLLOWUPS = [
  "What's going to make this role hard? That's usually the thing worth testing.",
  'Who will they work with day to day?',
]
const MAX_FOLLOWUPS = 2

const BEAT_FOUND =
  'From this JD, this role is mostly about growth experiments and working closely with a small engineering team.'
const BEAT_LEFTOUT = "I've left out the experience and degree requirements, since this is a freshers role."

export default function DefineRoleScreen({
  roleTitle = '',
  onBack,
  onComplete,
  onAskManager,
  reviewLabel = null,
  initialAnswers = [],
  initialJdStage = null, // null | 'landed'
  chrome = true,
}) {
  const scorecard = roleScorecard({ title: roleTitle })
  const jdProbe = (i) => ({ ...classifyProbeStub(DEMO_JD_PHRASES[i], i, scorecard.domainCompetency), source: 'jd', fixture: true })

  const jdInit =
    initialJdStage === 'landed'
      ? {
          beats: [{ text: 'Reading the JD...' }, { text: BEAT_FOUND, fixture: true }, { text: BEAT_LEFTOUT }, { text: JD_OPENING }],
          probes: [jdProbe(0), jdProbe(1)],
          read: true,
        }
      : { beats: [], probes: [], read: false }

  const [answers, setAnswers] = useState(initialAnswers)
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('chat') // chat | voice — one conversation, two ways in
  const [voiceStatus, setVoiceStatus] = useState('idle') // idle | listening | thinking
  const [liveTranscript, setLiveTranscript] = useState('')
  const [jdBeats, setJdBeats] = useState(jdInit.beats)
  const [jdProbes, setJdProbes] = useState(jdInit.probes)
  const [jdRead, setJdRead] = useState(jdInit.read)
  const [jdRunning, setJdRunning] = useState(false)
  const [pulse, setPulse] = useState(false)
  const talkTimeouts = useRef([])

  const bumpPulse = () => {
    setPulse(true)
    setTimeout(() => setPulse(false), 420)
  }

  const clearTalkTimeouts = () => {
    talkTimeouts.current.forEach(clearTimeout)
    talkTimeouts.current = []
  }

  useEffect(() => clearTalkTimeouts, [])

  // Leaving Voice mid-turn cancels the in-progress capture; nothing said is kept
  // as an answer until the recruiter actually stops talking.
  useEffect(() => {
    if (mode !== 'voice' && voiceStatus !== 'idle') {
      clearTalkTimeouts()
      setVoiceStatus('idle')
      setLiveTranscript('')
    }
  }, [mode])

  const talkProbes = answers.map((a, i) => ({
    ...classifyProbeStub(a.text, i, scorecard.domainCompetency),
    source: 'said',
    fixture: a.fixture,
  }))
  const probes = [...jdProbes, ...talkProbes]
  const complete = answers.length > MAX_FOLLOWUPS

  // The conversation stream: the opening, each answer + its follow-up, then any
  // JD beats.
  const stream = [{ from: 'ai', text: OPENING, sub: answers.length === 0 && jdBeats.length === 0 }]
  answers.forEach((a, i) => {
    stream.push({ from: 'user', text: a.text, fixture: a.fixture })
    if (i < MAX_FOLLOWUPS) stream.push({ from: 'ai', text: FOLLOWUPS[i] })
  })
  jdBeats.forEach((b) => stream.push({ from: 'ai', text: b.text, fixture: b.fixture }))

  const submitType = () => {
    const text = input.trim()
    if (!text) return
    setAnswers((prev) => [...prev, { text, fixture: false }])
    bumpPulse()
    setInput('')
  }

  // Stopping (early tap, or the transcript running out) always finalises with
  // the real answer, never the in-progress partial — the partial is only ever
  // a preview of capture-in-progress, same as any live transcript would be.
  const finishTalk = () => {
    clearTalkTimeouts()
    setVoiceStatus('thinking')
    setLiveTranscript('')
    talkTimeouts.current.push(
      setTimeout(() => {
        setAnswers((prev) => [...prev, { text: DEMO_VOICE_ANSWERS[prev.length], fixture: true }])
        bumpPulse()
        setVoiceStatus('idle')
      }, 550),
    )
  }

  const talkTap = () => {
    if (voiceStatus === 'listening') {
      finishTalk() // tap again to stop early
      return
    }
    if (voiceStatus !== 'idle' || answers.length >= DEMO_VOICE_ANSWERS.length) return
    setVoiceStatus('listening')
    setLiveTranscript('')
    const words = DEMO_VOICE_PARTIAL.split(' ')
    words.forEach((_, i) => {
      talkTimeouts.current.push(
        setTimeout(() => setLiveTranscript(words.slice(0, i + 1).join(' ')), 130 * (i + 1)),
      )
    })
    talkTimeouts.current.push(setTimeout(finishTalk, 130 * words.length + 350))
  }

  // The question currently being answered, shown large in Voice mode.
  const currentQuestion = [...stream].reverse().find((m) => m.from === 'ai') ?? stream[0]
  const voiceDone = answers.length >= DEMO_VOICE_ANSWERS.length

  // A JD streams four beats down the right; probes land on the left card.
  const runJd = () => {
    if (jdRunning || jdRead) return
    setJdRunning(true)
    setJdBeats([{ text: 'Reading the JD...' }])
    setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_FOUND, fixture: true }]), 900)
    setTimeout(() => {
      setJdProbes([jdProbe(0)])
      bumpPulse()
    }, 1700)
    setTimeout(() => {
      setJdProbes((p) => [...p, jdProbe(1)])
      bumpPulse()
    }, 1850)
    setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_LEFTOUT }]), 2500)
    setTimeout(() => {
      setJdBeats((b) => [...b, { text: JD_OPENING }])
      setJdRead(true)
      setJdRunning(false)
    }, 3200)
  }

  const body = (
    <div className="flex h-full w-full gap-6">
      {/* Left: the role card. Scrolls independently if tall. */}
      <div className="min-w-0 flex-[58] overflow-y-auto">
        <RoleCard scorecard={scorecard} probes={probes} pulse={pulse} />
      </div>

      {/* Right: the conversation — white, lifted. One conversation, Chat or Voice. */}
      <div className="flex min-w-0 flex-[42] flex-col overflow-hidden rounded-[10px] border-[0.5px] border-hairline bg-surface shadow-panel">
        {/* Header — mode toggle and Add a JD, always visible regardless of mode. */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b-[0.5px] border-hairline p-3">
          <div className="inline-flex items-center gap-0.5 rounded-lg bg-ink/[0.04] p-0.5">
            {[
              { key: 'chat', label: 'Chat', Icon: ChatIcon },
              { key: 'voice', label: 'Voice', Icon: MicIcon },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMode(key)}
                aria-pressed={mode === key}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  mode === key ? 'bg-surface text-ink shadow-card' : 'text-secondary hover:text-ink'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={runJd}
            disabled={jdRunning || jdRead}
            aria-label="Add a JD"
            className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border-[0.5px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
              jdRead ? 'border-hairline text-secondary' : 'border-hairline text-ink hover:bg-ink/[0.04]'
            } disabled:cursor-default`}
          >
            {jdRead ? <CheckIcon className="h-3.5 w-3.5" /> : <PaperclipIcon className="h-3.5 w-3.5" />}
            {jdRead ? 'JD added' : jdRunning ? 'Reading the JD...' : 'Add a JD'}
          </button>
        </div>

        {mode === 'chat' ? (
          <>
            <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
              {stream.map((t, i) =>
                t.from === 'ai' ? (
                  <div key={i} className="flex gap-2.5">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-secondary">
                      <SparkleIcon className="h-3 w-3" />
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] leading-snug text-ink">
                        {t.text}
                        {t.fixture && <FixtureTag className="ml-1.5" />}
                      </p>
                      {t.sub && <p className="mt-1 text-[13px] text-secondary">No wrong answers. Say as much as you like.</p>}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="rounded-lg bg-ink/[0.04] px-3 py-1.5 text-sm text-ink">
                      {t.text}
                      {t.fixture && <FixtureTag className="ml-1.5" />}
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Composer — type field and Review, no mic here; talk lives in Voice. */}
            <div className="shrink-0 border-t-[0.5px] border-hairline p-3">
              <div className="flex items-end gap-2.5">
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
                  placeholder="Type a reply"
                  className="min-w-0 flex-1 resize-none rounded-lg border-[0.5px] border-hairline bg-background px-3 py-2.5 text-sm leading-relaxed text-ink placeholder:text-muted focus:border-ink/25 focus:outline-none"
                />
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
          </>
        ) : (
          <>
            {/* Voice — the question, a talk control, and a live transcript. No text input. */}
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 overflow-y-auto p-6 text-center">
              <div className="flex max-w-sm flex-col items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-secondary">
                  <SparkleIcon className="h-3 w-3" />
                </span>
                <p className="text-xl leading-snug text-ink">
                  {currentQuestion?.text}
                  {currentQuestion?.fixture && <FixtureTag className="ml-1.5" />}
                </p>
                {currentQuestion?.sub && <p className="text-[13px] text-secondary">No wrong answers. Say as much as you like.</p>}
              </div>

              <span className="relative flex h-20 w-20 shrink-0 items-center justify-center">
                {voiceStatus === 'listening' && (
                  <span className="absolute inset-0 animate-mic-ring rounded-full bg-error/30" aria-hidden="true" />
                )}
                <button
                  type="button"
                  onClick={talkTap}
                  disabled={voiceStatus === 'thinking' || (voiceDone && voiceStatus === 'idle')}
                  aria-label={voiceStatus === 'listening' ? 'Stop talking' : 'Talk'}
                  className={`relative flex h-20 w-20 items-center justify-center rounded-full shadow-panel transition-colors disabled:cursor-default disabled:opacity-40 ${
                    voiceStatus === 'listening' ? 'bg-error text-surface' : 'bg-ink text-surface hover:bg-ink-hover'
                  }`}
                >
                  <MicIcon className="h-7 w-7" />
                </button>
              </span>

              <p className="text-[13px] text-secondary">
                {voiceStatus === 'listening'
                  ? 'Listening, tap to stop'
                  : voiceStatus === 'thinking'
                    ? 'Thinking...'
                    : voiceDone
                      ? 'Nothing more to answer here'
                      : 'Tap to talk'}
              </p>

              {voiceStatus === 'listening' && (
                <p className="max-w-sm rounded-lg border-[0.5px] border-hairline bg-background px-3.5 py-2.5 text-[13px] leading-relaxed text-secondary">
                  {liveTranscript}
                  <FixtureTag className="ml-1.5" />
                </p>
              )}
            </div>

            <div className="shrink-0 border-t-[0.5px] border-hairline p-3">
              <div className="flex items-center justify-end">
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
          </>
        )}
      </div>
    </div>
  )

  if (!chrome) {
    return <div className="min-h-0 flex-1 overflow-hidden bg-background p-6">{body}</div>
  }

  return (
    <Shell
      active="Roles"
      breadcrumb="Roles · New"
      title={roleTitle}
      onNavigate={() => onBack?.()}
      onNewRole={() => onBack?.()}
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
