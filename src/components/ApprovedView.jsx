import { useState } from 'react'
import Avatar from './Avatar.jsx'
import Tag from './Tag.jsx'
import { CheckIcon, MailIcon, PhoneIcon } from './icons.jsx'
import { contactsFor } from '../data/candidates.js'

/* A contact line with a copy button. */
function CopyField({ icon, value }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      title={`Copy ${value}`}
      onClick={(e) => {
        e.stopPropagation()
        navigator.clipboard?.writeText(value).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="flex w-full items-center gap-2.5 rounded-lg border border-hairline bg-surface px-3 py-2 text-left text-sm text-ink transition-colors hover:border-ink/20"
    >
      {icon}
      <span className="min-w-0 flex-1 truncate">{value}</span>
      {copied ? (
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-strong">
          <CheckIcon className="h-3 w-3" /> Copied
        </span>
      ) : (
        <span className="text-[12px] text-secondary">Copy</span>
      )}
    </button>
  )
}

function ApprovedCard({ candidate, onOpen, label }) {
  const { email, phone } = contactsFor(candidate.name)
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen?.(candidate.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen?.(candidate.id)
        }
      }}
      className="flex cursor-pointer flex-col gap-4 rounded-xl border border-strong/30 bg-strong/[0.04] p-5 text-left shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar src={candidate.avatar} name={candidate.name} size={44} />
          <div className="min-w-0">
            <div className="truncate text-sm font-medium text-ink">{candidate.name}</div>
            <div className="truncate text-[13px] text-secondary">{candidate.role}</div>
          </div>
        </div>
        <span className="font-mono text-lg leading-none text-ink tabular-nums">{candidate.score}</span>
      </div>

      <Tag color="green">
        <CheckIcon className="mr-1 h-3 w-3" /> {label}
      </Tag>

      <div className="flex flex-col gap-2">
        <p className="text-[13px] font-medium text-ink">Contact details</p>
        <CopyField icon={<MailIcon className="h-4 w-4 text-secondary" />} value={email} />
        <CopyField icon={<PhoneIcon className="h-4 w-4 text-secondary" />} value={phone} />
      </div>
    </div>
  )
}

/**
 * ApprovedView (Version B) — a dedicated view of only the taken-forward
 * candidates, with contact details surfaced inline so the recruiter can reach
 * them for offline rounds. No judging controls.
 */
export default function ApprovedView({ candidates = [], onOpen, label = 'Taken forward' }) {
  if (candidates.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-sm text-secondary">
        No candidates {label.toLowerCase()} yet.
      </div>
    )
  }
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-2">
      {candidates.map((c) => (
        <ApprovedCard key={c.id} candidate={c} onOpen={onOpen} label={label} />
      ))}
    </div>
  )
}
