import { useEffect, useRef, useState } from 'react'
import { Button } from '../components'
import Shell from '../components/Shell.jsx'
import RoleCard from '../components/RoleCard.jsx'
import { SparkleIcon, PaperclipIcon, MicIcon, ChatIcon, CheckIcon, XIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { classifyProbeStub } from '../lib/probeStub.js'
import { DEMO_VOICE_ANSWERS, DEMO_VOICE_PARTIAL, DEMO_JD_PHRASES, DEMO_JD_FILENAME } from '../data/fixtures.js'

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
const CLOSING = "That's everything I need for now. Review the card whenever you're ready."

const BEAT_FOUND =
  'From this JD, this role is mostly about growth experiments and working closely with a small engineering team.'
const BEAT_LEFTOUT = "I've left out the experience and degree requirements, since this is a freshers role."
const JD_ERROR = 'I could not read that file. Try another file or paste the text instead.'

// jdStage timing, all relative to the upload starting.
const JD_TIMING = { uploaded: 600, reading: 1400, found: 2300, probe0: 3100, probe1: 3250, leftout: 3900, done: 4600 }

export default function DefineRoleScreen({
  roleTitle = '',
  onBack,
  onComplete,
  onAskManager,
  reviewLabel = null,
  initialAnswers = [],
  initialJdStage = null, // null | 'uploading' | 'uploaded' | 'reading' | 'landed' | 'error'
  chrome = true,
}) {
  const scorecard = roleScorecard({ title: roleTitle })
  const jdProbe = (i) => ({ ...classifyProbeStub(DEMO_JD_PHRASES[i], i, scorecard.domainCompetency), source: 'jd' })

  const jdInit = (() => {
    switch (initialJdStage) {
      case 'uploading':
        return { stage: 'uploading', beats: [], probes: [] }
      case 'uploaded':
        return { stage: 'uploaded', beats: [], probes: [] }
      case 'reading':
        return { stage: 'reading', beats: [{ text: 'Reading the JD...' }], probes: [] }
      case 'landed':
        return {
          stage: 'done',
          beats: [{ text: 'Reading the JD...' }, { text: BEAT_FOUND }, { text: BEAT_LEFTOUT }, { text: JD_OPENING }],
          probes: [jdProbe(0), jdProbe(1)],
        }
      case 'error':
        return { stage: 'error', beats: [], probes: [] }
      default:
        return { stage: 'idle', beats: [], probes: [] }
    }
  })()

  const [answers, setAnswers] = useState(initialAnswers)
  const [input, setInput] = useState('')
  const [mode, setMode] = useState('chat') // chat | voice — one conversation, two ways in
  const [voiceStatus, setVoiceStatus] = useState('idle') // idle | listening | thinking
  const [liveTranscript, setLiveTranscript] = useState('')
  const [jdStage, setJdStage] = useState(jdInit.stage) // idle | uploading | uploaded | reading | done | error
  const [jdBeats, setJdBeats] = useState(jdInit.beats)
  const [jdProbes, setJdProbes] = useState(jdInit.probes)
  const [pulse, setPulse] = useState(false)
  const talkTimeouts = useRef([])
  const jdTimeouts = useRef([])

  const bumpPulse = () => {
    setPulse(true)
    setTimeout(() => setPulse(false), 420)
  }

  const clearTalkTimeouts = () => {
    talkTimeouts.current.forEach(clearTimeout)
    talkTimeouts.current = []
  }
  const clearJdTimeouts = () => {
    jdTimeouts.current.forEach(clearTimeout)
    jdTimeouts.current = []
  }

  useEffect(() => () => {
    clearTalkTimeouts()
    clearJdTimeouts()
  }, [])

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
  }))
  const probes = [...jdProbes, ...talkProbes]
  const complete = answers.length > MAX_FOLLOWUPS

  // The conversation stream: the opening, each answer + its follow-up, then any
  // JD beats, then the closing line once nothing is left to ask.
  const stream = [{ from: 'ai', text: OPENING, sub: answers.length === 0 && jdBeats.length === 0 }]
  answers.forEach((a, i) => {
    stream.push({ from: 'user', text: a.text })
    if (i < MAX_FOLLOWUPS) stream.push({ from: 'ai', text: FOLLOWUPS[i] })
  })
  jdBeats.forEach((b) => stream.push({ from: 'ai', text: b.text }))
  if (complete) stream.push({ from: 'ai', text: CLOSING })

  const submitType = () => {
    const text = input.trim()
    if (!text) return
    setAnswers((prev) => [...prev, { text }])
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
        setAnswers((prev) => [...prev, { text: DEMO_VOICE_ANSWERS[prev.length] }])
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

  // The JD pipeline: upload, land, read, then the same four beats as before.
  // Every stage is visible in the chip, not just the end state.
  const runJdPipeline = () => {
    clearJdTimeouts()
    setJdStage('uploading')
    setJdBeats([])
    setJdProbes([])
    jdTimeouts.current.push(setTimeout(() => setJdStage('uploaded'), JD_TIMING.uploaded))
    jdTimeouts.current.push(
      setTimeout(() => {
        setJdStage('reading')
        setJdBeats([{ text: 'Reading the JD...' }])
      }, JD_TIMING.reading),
    )
    jdTimeouts.current.push(setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_FOUND }]), JD_TIMING.found))
    jdTimeouts.current.push(
      setTimeout(() => {
        setJdProbes([jdProbe(0)])
        bumpPulse()
      }, JD_TIMING.probe0),
    )
    jdTimeouts.current.push(
      setTimeout(() => {
        setJdProbes((p) => [...p, jdProbe(1)])
        bumpPulse()
      }, JD_TIMING.probe1),
    )
    jdTimeouts.current.push(setTimeout(() => setJdBeats((b) => [...b, { text: BEAT_LEFTOUT }]), JD_TIMING.leftout))
    jdTimeouts.current.push(
      setTimeout(() => {
        setJdBeats((b) => [...b, { text: JD_OPENING }])
        setJdStage('done')
      }, JD_TIMING.done),
    )
  }

  const startJd = () => {
    if (jdStage !== 'idle' && jdStage !== 'error') return
    runJdPipeline()
  }
  const removeJd = () => {
    clearJdTimeouts()
    setJdStage('idle')
    setJdBeats([])
    setJdProbes([])
  }
  const replaceJd = () => runJdPipeline()

  // Shared between Chat and Voice — one CTA, and the probes it carries forward
  // to Review are whatever is in state right now, not a snapshot from earlier.
  const reviewButton = onComplete && (
    <Button
      variant="secondary"
      onClick={() => onComplete(probes)}
      className={`shrink-0 !py-2.5 !text-[13px] ${complete ? '!border-ink !bg-ink !text-white' : ''}`}
    >
      {reviewLabel ?? 'Review role'}
    </Button>
  )

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
          {/* The toggle is a mode switch, not another action pill — the active
              segment reads as a track selection (solid ink), never a faint tint. */}
          <div className="inline-flex shrink-0 items-center gap-0.5 rounded-lg border-[0.5px] border-hairline bg-background p-0.5">
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
                  mode === key ? 'bg-ink text-white shadow-card' : 'text-secondary hover:text-ink'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>

          <div className="min-w-0">
            {jdStage === 'idle' && (
              <button
                type="button"
                onClick={startJd}
                className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-hairline px-3 py-1.5 text-[13px] font-medium text-ink transition-colors hover:bg-ink/[0.04]"
              >
                <PaperclipIcon className="h-3.5 w-3.5" />
                Add a JD
              </button>
            )}

            {jdStage === 'uploading' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-hairline px-3 py-1.5 text-[13px] font-medium text-secondary">
                <span className="h-1.5 w-1.5 animate-think rounded-full bg-secondary" aria-hidden="true" />
                Uploading...
              </span>
            )}

            {jdStage === 'uploaded' && (
              <div className="inline-flex items-center gap-2 rounded-full border-[0.5px] border-hairline px-3 py-1.5 text-[13px] font-medium text-ink">
                <PaperclipIcon className="h-3.5 w-3.5 shrink-0 text-secondary" />
                <span className="max-w-[130px] truncate">{DEMO_JD_FILENAME}</span>
                <span className="h-3 w-px shrink-0 bg-hairline" aria-hidden="true" />
                <button type="button" onClick={replaceJd} className="shrink-0 text-secondary transition-colors hover:text-ink">
                  Replace
                </button>
                <button
                  type="button"
                  onClick={removeJd}
                  aria-label="Remove JD"
                  className="shrink-0 text-secondary transition-colors hover:text-ink"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </div>
            )}

            {jdStage === 'reading' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-hairline px-3 py-1.5 text-[13px] font-medium text-secondary">
                <span className="h-1.5 w-1.5 animate-think rounded-full bg-secondary" aria-hidden="true" />
                Reading the JD...
              </span>
            )}

            {jdStage === 'done' && (
              <span className="inline-flex items-center gap-1.5 rounded-full border-[0.5px] border-hairline px-3 py-1.5 text-[13px] font-medium text-secondary">
                <CheckIcon className="h-3.5 w-3.5" />
                JD added
              </span>
            )}

            {jdStage === 'error' && (
              <div className="flex max-w-[260px] items-center gap-2 rounded-lg border-[0.5px] border-danger/40 bg-danger-soft px-3 py-1.5 text-[12px] font-medium leading-snug text-danger">
                <span className="flex-1">{JD_ERROR}</span>
                <button
                  type="button"
                  onClick={startJd}
                  className="shrink-0 whitespace-nowrap underline decoration-danger/40 underline-offset-2 hover:decoration-danger"
                >
                  Try again
                </button>
              </div>
            )}
          </div>
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
                      <p className="text-[15px] leading-snug text-ink">{t.text}</p>
                      {t.sub && <p className="mt-1 text-[13px] text-secondary">No wrong answers. Say as much as you like.</p>}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex justify-end">
                    <div className="rounded-lg bg-ink/[0.04] px-3 py-1.5 text-sm text-ink">{t.text}</div>
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
                {reviewButton}
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
                <p className="text-xl leading-snug text-ink">{currentQuestion?.text}</p>
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
                </p>
              )}
            </div>

            <div className="shrink-0 border-t-[0.5px] border-hairline p-3">
              <div className="flex items-center justify-end">{reviewButton}</div>
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
