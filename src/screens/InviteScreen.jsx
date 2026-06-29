import { useState } from 'react'
import { Button, Avatar, Tag } from '../components'
import { ArrowLeftIcon, CheckIcon, ClockIcon } from '../components/icons.jsx'
import { candidates, SOURCES } from '../data/candidates.js'

// Sourced candidates: added, not yet invited. These are the ones to invite.
const POOL = candidates.filter((c) => c.stage === 'Sourced')

function Checkbox({ checked, disabled }) {
  return (
    <span
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors ${
        disabled
          ? 'border-hairline bg-background'
          : checked
            ? 'border-accent bg-accent text-surface'
            : 'border-hairline bg-surface'
      }`}
    >
      {checked && !disabled && <CheckIcon className="h-3 w-3" />}
    </span>
  )
}

export default function InviteScreen({ roleTitle = 'Senior Product Engineer', onBack }) {
  // Pre-invited candidate to show the "already invited" disabled state.
  const [invited, setInvited] = useState({ 'omar-haddad': 18 })
  const [selected, setSelected] = useState(new Set())
  const [confirming, setConfirming] = useState(false)
  const [justSent, setJustSent] = useState(0)

  const toggle = (id) => {
    if (invited[id]) return
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const send = () => {
    const count = selected.size
    setInvited((prev) => {
      const next = { ...prev }
      selected.forEach((id) => {
        next[id] = 24
      })
      return next
    })
    setSelected(new Set())
    setConfirming(false)
    setJustSent(count)
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex shrink-0 items-center gap-3 px-6 pt-8 lg:px-8">
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
        <div>
          <p className="text-sm text-secondary">{roleTitle}</p>
          <h1 className="mt-1.5 text-2xl text-ink">Invite to interview</h1>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-28 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-2xl">
          <p className="mb-4 text-sm leading-relaxed text-secondary">
            Select candidates to invite. Each gets a scheduling link and a 24-hour window to book a
            time.
          </p>

          {/* Sent banner */}
          {justSent > 0 && (
            <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-strong/20 bg-strong/[0.06] px-4 py-3 text-sm text-ink">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-strong/15 text-strong">
                <CheckIcon className="h-2.5 w-2.5" />
              </span>
              <span>
                {justSent} invite{justSent === 1 ? '' : 's'} sent. The 24-hour scheduling window has
                started.
              </span>
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-hairline bg-surface shadow-card">
            {POOL.map((c) => {
              const isInvited = Boolean(invited[c.id])
              const isSelected = selected.has(c.id)
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggle(c.id)}
                  disabled={isInvited}
                  className={`flex w-full items-center gap-3 border-b border-hairline px-4 py-3 text-left transition-colors last:border-b-0 ${
                    isInvited
                      ? 'cursor-default opacity-60'
                      : isSelected
                        ? 'bg-accent/[0.05]'
                        : 'hover:bg-background'
                  }`}
                >
                  <Checkbox checked={isSelected || isInvited} disabled={isInvited} />
                  <Avatar src={c.avatar} name={c.name} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{c.name}</div>
                    <div className="truncate text-[13px] text-secondary">{c.role}</div>
                  </div>
                  {isInvited ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] text-secondary">
                      <ClockIcon className="h-3.5 w-3.5" />
                      Invited · {invited[c.id]}h left
                    </span>
                  ) : (
                    SOURCES[c.source] && (
                      <Tag color={SOURCES[c.source].color}>{SOURCES[c.source].label}</Tag>
                    )
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-hairline bg-background/90 px-6 py-4 backdrop-blur lg:px-8">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3">
          <span className="text-sm text-secondary">
            {selected.size > 0 ? (
              <>
                <span className="font-medium text-ink">{selected.size}</span> selected
              </>
            ) : (
              'No candidates selected'
            )}
          </span>
          <Button disabled={selected.size === 0} onClick={() => setConfirming(true)}>
            Invite to interview
          </Button>
        </div>
      </div>

      {/* Confirm modal */}
      {confirming && (
        <>
          <button
            type="button"
            aria-label="Cancel"
            onClick={() => setConfirming(false)}
            className="absolute inset-0 z-20 animate-fade-in cursor-default bg-ink/20 backdrop-blur-[1px]"
          />
          <div className="absolute inset-0 z-30 flex items-center justify-center p-6">
            <div className="w-full max-w-md animate-fade-in-up rounded-2xl border border-hairline bg-surface p-6 shadow-overlay">
              <h2 className="text-lg text-ink">
                Invite {selected.size} candidate{selected.size === 1 ? '' : 's'} to interview?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-secondary">
                Each candidate gets a personal scheduling link and a 24-hour window to book. You can
                follow up if they don&rsquo;t respond in time.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <Button variant="secondary" onClick={() => setConfirming(false)}>
                  Cancel
                </Button>
                <Button onClick={send}>Send invites</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
