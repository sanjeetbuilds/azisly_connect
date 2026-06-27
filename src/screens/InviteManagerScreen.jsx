import { useState } from 'react'
import { Button, Card, Avatar } from '../components'
import { CheckIcon, XIcon, MailIcon } from '../components/icons.jsx'
import { previousManagers as SEED } from '../data/managers.js'

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function linkFor(email) {
  let h = 0
  for (let i = 0; i < email.length; i += 1) h = (h * 31 + email.charCodeAt(i)) >>> 0
  return `app.azisly.com/invite/${h.toString(36).slice(0, 8)}`
}

export default function InviteManagerScreen({ roleTitle = 'Senior Product Engineer', onCancel, onDone }) {
  const [managers, setManagers] = useState(SEED)
  const [selectedId, setSelectedId] = useState(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(null) // { name, email }

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

  const send = () => {
    if (!recipient) return
    if (!picked) {
      setManagers((prev) => [{ id: `m-${prev.length + 1}`, ...recipient }, ...prev])
    }
    setSent(recipient)
  }

  /* ── Confirmation: link sent ─────────────────────────────────── */
  if (sent) {
    const first = sent.name.split(' ')[0]
    const link = linkFor(sent.email)
    return (
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-12">
          <Card className="flex w-full max-w-md flex-col items-center gap-5 p-8 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-strong/10 text-strong">
              <CheckIcon className="h-7 w-7" />
            </span>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl text-ink">Magic link sent</h1>
              <p className="text-sm leading-relaxed text-secondary">
                A magic link to define <span className="text-ink">{roleTitle}</span> has been sent to{' '}
                <span className="text-ink">{sent.email}</span>.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 rounded-lg border border-hairline bg-background px-3 py-2.5 text-left">
              <MailIcon className="h-4 w-4 shrink-0 text-secondary" />
              <span className="min-w-0 flex-1 truncate font-mono text-[13px] text-ink">{link}</span>
              <button
                type="button"
                onClick={() => navigator.clipboard?.writeText(link).catch(() => {})}
                className="shrink-0 rounded-md border border-hairline bg-surface px-2 py-1 text-xs text-secondary transition-colors hover:text-ink"
              >
                Copy link
              </button>
            </div>

            <p className="text-xs leading-relaxed text-secondary">
              That link is all {first} needs — there&rsquo;s no account to create. You&rsquo;ll see
              the role card here once they finish.
            </p>

            <Button variant="secondary" className="mt-1" onClick={onDone}>
              Back to roles
            </Button>
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
            We&rsquo;ll email a magic link so they can define the role — no account needed. Pick
            someone you&rsquo;ve worked with, or add a new contact.
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
            <Button disabled={!recipient} onClick={send}>
              Send magic link
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
