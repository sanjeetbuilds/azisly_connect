import { useState } from 'react'
import { Button, Card, Avatar } from '../components'
import { CheckIcon, XIcon, LinkIcon, ClockIcon } from '../components/icons.jsx'
import { previousManagers as SEED } from '../data/managers.js'
import { buildDefineLink } from '../lib/magicLink.js'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

export default function InviteManagerScreen({
  roleId,
  roleTitle = 'Senior Product Engineer',
  preset = null, // a manager chosen inline on the create-role step; skip the picker
  onCancel,
  onDone,
}) {
  const [managers, setManagers] = useState(SEED)
  const [selectedId, setSelectedId] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(preset) // the generated recipient { name, email }
  const [link, setLink] = useState(preset ? buildDefineLink(roleId) : '')
  const [expiredLink, setExpiredLink] = useState(preset ? buildDefineLink(roleId, { days: -1 }) : '')
  const [copied, setCopied] = useState(false)

  const picked = managers.find((m) => m.id === selectedId) ?? null
  const newValid = isEmail(email)
  const recipient = picked ?? (newValid ? { name: name.trim() || email.trim(), email: email.trim() } : null)

  const pick = (id) => {
    setSelectedId(id)
    setName('')
    setEmail('')
  }
  const removeManager = (id) => {
    setManagers((prev) => prev.filter((m) => m.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const generate = () => {
    if (!recipient) return
    if (!picked) {
      setManagers((prev) => [{ id: `m-${prev.length + 1}`, ...recipient }, ...prev])
    }
    setLink(buildDefineLink(roleId))
    setExpiredLink(buildDefineLink(roleId, { days: -1 }))
    setSent(recipient)
  }

  const copy = (link) => {
    navigator.clipboard?.writeText(link).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  /* ── Generated link ──────────────────────────────────────────── */
  if (sent) {
    const first = sent.name.split(' ')[0]
    return (
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-12">
          <Card className="flex w-full max-w-lg flex-col gap-6 p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-strong/10 text-strong">
                <CheckIcon className="h-6 w-6" />
              </span>
              <div>
                <h1 className="text-xl text-ink">Magic link ready</h1>
                <p className="text-sm text-secondary">Share it with {first}. They don&rsquo;t need an account.</p>
              </div>
            </div>

            {/* Who it's for */}
            <div className="flex items-center gap-3 rounded-xl border border-hairline bg-background px-3.5 py-3">
              <Avatar name={sent.name} size={36} />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium text-ink">{sent.name}</div>
                <div className="truncate text-[13px] text-secondary">{sent.email}</div>
              </div>
            </div>

            {/* The link */}
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-ink">
                Magic link to define {roleTitle} for {sent.name}
              </p>
              <div className="flex items-center gap-2 rounded-lg border border-hairline bg-surface px-3 py-2.5 shadow-card">
                <LinkIcon className="h-4 w-4 shrink-0 text-secondary" />
                <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{link}</span>
                <Button onClick={() => copy(link)} className="!px-3 !py-1.5 !text-[13px]">
                  {copied ? (
                    <>
                      <CheckIcon className="mr-1 h-3.5 w-3.5" /> Copied
                    </>
                  ) : (
                    'Copy'
                  )}
                </Button>
              </div>
            </div>

            {/* Scope + expiry */}
            <div className="flex items-start gap-2 rounded-lg bg-background px-3 py-2.5 text-[13px] leading-relaxed text-secondary">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                This link opens only the <span className="text-ink">{roleTitle}</span> role and
                expires in 7 days. You&rsquo;ll review the card here once {first} is done.
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-hairline pt-5">
              <a
                href={expiredLink}
                target="_blank"
                rel="noreferrer"
                className="text-[13px] text-secondary underline decoration-hairline underline-offset-2 transition-colors hover:text-ink"
              >
                Preview expired link
              </a>
              <Button variant="secondary" onClick={onDone}>
                Back to roles
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  /* ── Pick / add a manager ────────────────────────────────────── */
  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="shrink-0 px-6 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Roles · New · {roleTitle}</p>
        <h1 className="mt-1.5 text-2xl text-ink">Invite a hiring manager</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <p className="mb-5 text-sm leading-relaxed text-secondary">
            You&rsquo;ll get a magic link to share so they can define the role. No account needed.
            Pick someone you&rsquo;ve worked with, or add a new contact.
          </p>

          <Card className="flex flex-col gap-7 p-7">
            {managers.length > 0 && (
              <div className="flex flex-col gap-2.5">
                <p className="text-sm font-medium text-ink">Previously added</p>
                <div className="flex flex-col gap-2">
                  {managers.map((m) => {
                    const selected = m.id === selectedId
                    return (
                      <div
                        key={m.id}
                        className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                          selected ? 'border-accent bg-accent/[0.03] ring-1 ring-accent/20' : 'border-hairline'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => pick(m.id)}
                          className="flex min-w-0 flex-1 items-center gap-3 text-left"
                        >
                          <Avatar name={m.name} size={32} />
                          <span className="min-w-0">
                            <span className="block truncate text-sm font-medium text-ink">{m.name}</span>
                            <span className="block truncate text-[13px] text-secondary">{m.email}</span>
                          </span>
                          <span
                            className={`ml-auto flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border ${
                              selected ? 'border-accent bg-accent text-surface' : 'border-hairline'
                            }`}
                          >
                            {selected && <CheckIcon className="h-2.5 w-2.5" />}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => removeManager(m.id)}
                          aria-label={`Remove ${m.name}`}
                          className="shrink-0 rounded-md p-1 text-secondary transition-colors hover:text-ink"
                        >
                          <XIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <p className="text-sm font-medium text-ink">
                {managers.length > 0 ? 'Or add someone new' : 'Add the hiring manager'}
              </p>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  setSelectedId(null)
                }}
                placeholder="Full name"
                className="w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setSelectedId(null)
                }}
                type="email"
                placeholder="name@company.com"
                className="w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
              />
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Back
            </Button>
            <Button disabled={!recipient} onClick={generate}>
              Generate magic link
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
