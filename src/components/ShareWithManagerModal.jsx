import { useState } from 'react'
import Button from './Button.jsx'
import Avatar from './Avatar.jsx'
import VerdictTag from './VerdictTag.jsx'
import { CheckIcon, XIcon, LinkIcon, ClockIcon } from './icons.jsx'
import { previousManagers as MANAGERS } from '../data/managers.js'

function reviewToken(email, count) {
  let h = count
  for (let i = 0; i < email.length; i += 1) h = (h * 31 + email.charCodeAt(i)) >>> 0
  return h.toString(36).slice(0, 8)
}

// A real link into this app's manager review route, so the manager can open it.
function reviewLink(email, count) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://app.azisly.com'
  return `${origin}/?review=${reviewToken(email, count)}`
}

/* Compact candidate row reused in both steps — same layout as the table. */
function CandidateRow({ c }) {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <Avatar src={c.avatar} name={c.name} size={32} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium text-ink">{c.name}</div>
        <div className="truncate text-[13px] text-secondary">
          {c.role} · {c.location}
        </div>
      </div>
      <span className="font-mono text-sm text-ink tabular-nums">{c.score}</span>
      <div className="w-[104px] shrink-0">
        <VerdictTag verdict={c.verdict} />
      </div>
    </div>
  )
}

/**
 * ShareWithManagerModal — pick a hiring manager and generate a review magic
 * link for a specific set of candidates. Same pattern as the define-role link:
 * confirm (who + how many) → link with a Copy button.
 */
export default function ShareWithManagerModal({ candidates, roleTitle = 'Senior Product Engineer', onClose }) {
  const [step, setStep] = useState('confirm') // confirm | link
  const [managerId, setManagerId] = useState(null)
  const [copied, setCopied] = useState(false)

  const manager = MANAGERS.find((m) => m.id === managerId) ?? null
  const count = candidates.length
  const link = manager ? reviewLink(manager.email, count) : ''

  const copy = () => {
    navigator.clipboard?.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 z-40 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
      />
      <div className="absolute inset-0 z-50 flex items-center justify-center p-6">
        <div className="flex max-h-full w-full max-w-lg animate-fade-in-up flex-col overflow-hidden rounded-xl border border-hairline bg-surface shadow-overlay">
          {/* Header */}
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-hairline px-6 py-4">
            <h2 className="text-lg text-ink">
              {step === 'confirm' ? 'Send to hiring manager' : 'Review link ready'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-lg border border-hairline p-1.5 text-secondary transition-colors hover:border-ink/30 hover:text-ink"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          </div>

          {step === 'confirm' ? (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <p className="mb-2 text-sm font-medium text-ink">Which hiring manager?</p>
                <div className="flex flex-col gap-2">
                  {MANAGERS.map((m) => {
                    const sel = m.id === managerId
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setManagerId(m.id)}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-colors ${
                          sel ? 'border-accent bg-accent/[0.03] ring-1 ring-accent/20' : 'border-hairline hover:border-ink/20'
                        }`}
                      >
                        <Avatar name={m.name} size={32} />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-ink">{m.name}</span>
                          <span className="block truncate text-[13px] text-secondary">{m.email}</span>
                        </span>
                        <span
                          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                            sel ? 'border-accent bg-accent text-surface' : 'border-hairline'
                          }`}
                        >
                          {sel && <CheckIcon className="h-2.5 w-2.5" />}
                        </span>
                      </button>
                    )
                  })}
                </div>

                <p className="mb-1 mt-6 text-sm font-medium text-ink">
                  Sharing {count} candidate{count === 1 ? '' : 's'}
                </p>
                <div className="divide-y divide-hairline rounded-xl border border-hairline">
                  {candidates.map((c) => (
                    <div key={c.id} className="px-2">
                      <CandidateRow c={c} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-between gap-3 border-t border-hairline px-6 py-4">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button disabled={!manager} onClick={() => setStep('link')}>
                  Generate review link
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
                <div className="flex items-center gap-3 rounded-xl border border-hairline bg-background px-3.5 py-3">
                  <Avatar name={manager.name} size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-ink">{manager.name}</div>
                    <div className="truncate text-[13px] text-secondary">{manager.email}</div>
                  </div>
                </div>

                <p className="mb-2 mt-5 text-sm font-medium text-ink">
                  Review link for {manager.name}, {count} candidate{count === 1 ? '' : 's'}
                </p>
                <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2.5 shadow-card">
                  <LinkIcon className="h-4 w-4 shrink-0 text-secondary" />
                  <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{link}</span>
                  <Button onClick={copy} className="!px-3 !py-1.5 !text-[13px]">
                    {copied ? (
                      <>
                        <CheckIcon className="mr-1 h-3.5 w-3.5" /> Copied
                      </>
                    ) : (
                      'Copy'
                    )}
                  </Button>
                </div>

                <div className="mt-4 flex items-start gap-2 rounded-lg bg-background px-3 py-2.5 text-[13px] leading-relaxed text-secondary">
                  <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>
                    This link opens only these {count} candidate{count === 1 ? '' : 's'} for the{' '}
                    <span className="text-ink">{roleTitle}</span> role and expires in 7 days.
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-end gap-3 border-t border-hairline px-6 py-4">
                <Button variant="secondary" onClick={onClose}>
                  Done
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
