import { useState } from 'react'
import { Button } from '../components'
import RoleCard from '../components/RoleCard.jsx'
import { CopyNeeded, FixtureTag } from '../components/Spec.jsx'
import { SendIcon, PaperclipIcon, ArrowLeftIcon, MicIcon, XIcon } from '../components/icons.jsx'
import { roleScorecard } from '../data/scorecard.js'
import { classifyProbeStub } from '../lib/probeStub.js'
import { DEMO_JD_FILENAME, DEMO_PASTED_JD, DEMO_VOICE_PARTIAL } from '../data/fixtures.js'

/*
 * DefineRoleScreen — the recruiter (or manager) defines the role.
 *
 * The Role card is on screen the moment they arrive: the family is already
 * matched from the title, so the domain and the gates are known before a word is
 * said. There is no step counter, no "Question 1 of N", no progress bar. One
 * composer is pinned at the bottom: type, speak, or drop a JD.
 *
 * Whatever the recruiter types or says becomes a probe { phrase, competency }.
 * The phrase is their exact words. The competency is assigned by a stub (see
 * lib/probeStub.js). A probe carries no score, no tier, no weight. Nothing else
 * the recruiter says changes the card.
 */
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
  reviewLabel = null, // no PRD string ⇒ CopyNeeded on the CTA
  titleIsFixture = false,
  initialProbes = [],
  probesAreFixture = false,
  initialJd = 'closed', // closed | panel | uploading | uploaded | reading | unreadable
  initialVoice = 'off', // off | listening | notcaught | transcribing
}) {
  const scorecard = roleScorecard({ title: roleTitle })
  const [probes, setProbes] = useState(initialProbes)
  const [input, setInput] = useState('')
  const [jd, setJd] = useState(initialJd)
  const [jdText, setJdText] = useState(initialJd === 'uploaded' || initialJd === 'reading' ? '' : '')
  const [voice, setVoice] = useState(initialVoice)
  const [jdEchoed, setJdEchoed] = useState(false)

  const addProbe = (phrase) => {
    const text = phrase.trim()
    if (!text) return
    setProbes((prev) => [...prev, { phrase: text, competency: classifyProbeStub(prev.length) }])
  }

  const submitType = () => {
    if (!input.trim()) return
    addProbe(input)
    setInput('')
  }

  // Voice — the real state sequence, faked timing only. It never invents words:
  // in this build the mic captures nothing, so a spoken turn adds no probe.
  const startListening = () => setVoice('listening')
  const stopListening = () => setVoice('transcribing')

  // JD — the real state sequence, extracts nothing. Filename and pasted text are
  // shown back unchanged; no card field is written from a JD in this build.
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
          {/* No PRD string for this eyebrow. */}
          <p className="text-[13px] font-medium text-secondary">
            <CopyNeeded note="define eyebrow" />
          </p>
          <h1 className="flex items-center gap-2 truncate text-xl font-bold text-ink">
            {roleTitle}
            {titleIsFixture && <FixtureTag />}
          </h1>
        </div>
        {onAskManager && (
          // "Ask a hiring manager to define" is PRD §E copy (the CTA in the header).
          <Button variant="secondary" onClick={onAskManager} className="!px-3.5 !py-2 !text-[13px]">
            Ask a hiring manager to define
          </Button>
        )}
      </div>

      {/* Body — the card is here from the first frame. */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 py-6">
          <RoleCard
            scorecard={scorecard}
            roleTitle={roleTitle}
            probes={probes}
            probesAreFixture={probesAreFixture}
          />

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

      {/* Voice overlay states */}
      {voice !== 'off' && (
        <div className="shrink-0 border-t border-hairline bg-surface px-6 py-3 lg:px-8">
          <div className="mx-auto w-full max-w-2xl">
            {voice === 'notcaught' ? (
              // Verbatim PRD.
              <p className="text-sm text-ink">Sorry, I did not catch that, could you say it again?</p>
            ) : voice === 'transcribing' ? (
              <p className="text-sm text-secondary">
                <span className="text-ink">{DEMO_VOICE_PARTIAL}</span> <FixtureTag className="ml-1" />
              </p>
            ) : (
              <p className="flex items-center gap-2 text-sm text-secondary">
                <span className="h-2 w-2 animate-ping rounded-full bg-danger" />
                <CopyNeeded note="listening label" />
              </p>
            )}
          </div>
        </div>
      )}

      {/* Composer — one, pinned. Type, speak, or drop a JD. */}
      <div className="shrink-0 border-t border-hairline bg-surface px-6 py-4 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          {jd !== 'closed' && jd !== 'panel' ? (
            <JdState jd={jd} onClose={closeJd} onRead={readJd} onReplace={doUpload} />
          ) : jd === 'panel' ? (
            <JdPanel jdText={jdText} setJdText={setJdText} onUpload={doUpload} onRead={readJd} onCancel={closeJd} />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <CopyNeeded note="composer prompt: type, speak, or drop a JD" />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="button"
                  onClick={openJd}
                  aria-label="Add a JD"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-hairline text-secondary transition-colors hover:text-ink"
                >
                  <PaperclipIcon className="h-4 w-4" />
                </button>
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
                  placeholder=""
                  className="flex-1 resize-none rounded-md border border-hairline bg-surface px-3 py-2.5 text-sm leading-relaxed text-ink shadow-card focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
                />
                <button
                  type="button"
                  onClick={voice === 'listening' ? stopListening : startListening}
                  aria-label="Speak"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md transition-colors ${
                    voice === 'listening' ? 'bg-danger text-white' : 'border border-hairline text-secondary hover:text-ink'
                  }`}
                >
                  <MicIcon className="h-4 w-4" />
                </button>
                <Button onClick={submitType} disabled={!input.trim()} aria-label="Send" className="!px-3.5">
                  <SendIcon className="h-4 w-4" />
                </Button>
              </div>
              {onComplete && (
                <div className="flex justify-end pt-1">
                  <Button variant="secondary" onClick={onComplete} className="!py-1.5 !text-[13px]">
                    {reviewLabel ?? <CopyNeeded note="review CTA" />}
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
