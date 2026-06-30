import { useState } from 'react'
import { Button, Card, Avatar } from '../components'
import { SearchIcon, CheckIcon, PlusIcon, MinusIcon } from '../components/icons.jsx'
import { previousManagers as SEED_MANAGERS } from '../data/managers.js'

const ROLE_SUGGESTIONS = [
  'Senior Product Engineer',
  'Product Engineer',
  'Staff Software Engineer',
  'Frontend Engineer',
  'Backend Engineer',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Engineering Manager',
  'Product Designer',
  'Product Manager',
  'Data Engineer',
  'Designer',
]

// Switch 1 — who writes the definition.
const DEFINE_OPTIONS = [
  {
    key: 'recruiter',
    title: "I'll define it now",
    desc: 'Build the competency profile with AI by chat or voice.',
  },
  {
    key: 'hiring_manager',
    title: 'Invite a hiring manager',
    desc: 'Send a magic link so they can define it. You review it after.',
  },
]

// Switch 2 — who approves candidates. Independent of who defines.
const APPROVE_OPTIONS = [
  {
    key: 'hiring_manager',
    title: 'A hiring manager approves',
    desc: 'Share the scored candidates so they take people forward.',
  },
  {
    key: 'recruiter_alone',
    title: "I'll approve alone",
    desc: 'You decide who moves to offline rounds, no second sign-off.',
  },
]

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function FieldLabel({ children, hint }) {
  return (
    <div className="mb-2 flex items-baseline justify-between gap-3">
      <span className="text-sm font-medium text-ink">{children}</span>
      {hint && <span className="text-xs text-secondary">{hint}</span>}
    </div>
  )
}

function RadioDot({ selected }) {
  return (
    <span
      className={`mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition-colors ${
        selected ? 'border-accent' : 'border-hairline'
      }`}
    >
      {selected && <span className="h-2 w-2 rounded-full bg-accent" />}
    </span>
  )
}

function OptionButton({ selected, title, desc, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
        selected ? 'border-accent bg-accent/[0.03] ring-1 ring-accent/20' : 'border-hairline hover:border-ink/20'
      }`}
    >
      <RadioDot selected={selected} />
      <div className="min-w-0">
        <div className="text-sm font-medium text-ink">{title}</div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-secondary">{desc}</p>
      </div>
    </button>
  )
}

const inputClass =
  'w-full rounded-lg border border-hairline bg-surface px-3 py-2.5 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15'

export default function CreateRoleScreen({ onCancel, onContinue }) {
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState(null) // a role is only "chosen" when picked from the list
  const [open, setOpen] = useState(false)
  const [openings, setOpenings] = useState(1)

  // The two independent involvement switches.
  const [defineBy, setDefineBy] = useState('recruiter')
  const [approveBy, setApproveBy] = useState('hiring_manager')

  // Inline hiring-manager pick (only used when defineBy === 'hiring_manager').
  const [managers, setManagers] = useState(SEED_MANAGERS)
  const [managerId, setManagerId] = useState(null)
  const [mName, setMName] = useState('')
  const [mEmail, setMEmail] = useState('')

  const q = query.trim().toLowerCase()
  const matches = q.length >= 2 ? ROLE_SUGGESTIONS.filter((r) => r.toLowerCase().includes(q)) : []
  const showSuggestions = open && q.length >= 2 && !chosen

  const pickedManager = managers.find((m) => m.id === managerId) ?? null
  const newManager = isEmail(mEmail) ? { name: mName.trim() || mEmail.trim(), email: mEmail.trim() } : null
  const manager = pickedManager ?? newManager
  const needsManager = defineBy === 'hiring_manager'

  const valid = Boolean(chosen) && openings >= 1 && (!needsManager || Boolean(manager))

  const handleType = (v) => {
    setQuery(v)
    setChosen(null) // editing invalidates any prior choice, must re-pick
    setOpen(true)
  }
  const choose = (r) => {
    setChosen(r)
    setQuery(r)
    setOpen(false)
  }
  const pickManager = (id) => {
    setManagerId(id)
    setMName('')
    setMEmail('')
  }

  const submit = () => {
    if (!valid) return
    onContinue({
      title: chosen,
      openings,
      define_by: defineBy,
      approve_by: approveBy,
      manager: needsManager ? manager : null,
    })
  }

  return (
    <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
      {/* Mobile-only header */}
      <header className="flex h-14 shrink-0 items-center border-b border-hairline px-5 lg:hidden">
        <span className="font-medium tracking-tight text-ink">
          Azisly <span className="text-secondary">Recruit</span>
        </span>
      </header>

      {/* Page header */}
      <div className="shrink-0 px-6 pt-8 lg:px-8">
        <p className="text-sm text-secondary">Roles · New · Step 1 of 2</p>
        <h1 className="mt-1.5 text-2xl text-ink">Create a role</h1>
        <p className="mt-1.5 text-sm text-secondary">
          Basic setup and who is involved. You can change these later.
        </p>
      </div>

      {/* Scrollable form */}
      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-8 pt-6 lg:px-8">
        <div className="mx-auto w-full max-w-xl">
          <Card className="flex flex-col gap-7 p-7">
            {/* Role title */}
            <div>
              <FieldLabel hint="Start typing to see suggestions">Role title</FieldLabel>
              <div className="relative">
                <div className="relative flex items-center">
                  <span className="pointer-events-none absolute left-3 text-secondary">
                    <SearchIcon className="h-4 w-4" />
                  </span>
                  <input
                    value={query}
                    onChange={(e) => handleType(e.target.value)}
                    onFocus={() => setOpen(true)}
                    placeholder="e.g. Senior Product Engineer"
                    className={`w-full rounded-lg border bg-surface py-2.5 pl-9 pr-9 text-sm text-ink shadow-card transition-colors placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-accent/15 ${
                      chosen ? 'border-accent' : 'border-hairline focus:border-accent'
                    }`}
                  />
                  {chosen && (
                    <span className="absolute right-3 text-accent">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>

                {showSuggestions && (
                  <>
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-hidden="true"
                      onClick={() => setOpen(false)}
                      className="fixed inset-0 z-30 cursor-default"
                    />
                    <div className="absolute left-0 right-0 z-40 mt-1.5 overflow-hidden rounded-lg border border-hairline bg-surface p-1 shadow-dropdown">
                      {matches.length > 0 ? (
                        matches.map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => choose(m)}
                            className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                          >
                            <SearchIcon className="h-3.5 w-3.5 text-secondary" />
                            {m}
                          </button>
                        ))
                      ) : (
                        <button
                          type="button"
                          onClick={() => choose(query.trim())}
                          className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm text-ink transition-colors hover:bg-background"
                        >
                          Use “<span className="font-medium">{query.trim()}</span>”
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
              {query && !chosen && (
                <p className="mt-2 text-xs text-secondary">Choose a role from the list to continue.</p>
              )}
            </div>

            {/* Openings */}
            <div>
              <FieldLabel>Number of openings</FieldLabel>
              <div className="inline-flex items-center overflow-hidden rounded-lg border border-hairline shadow-card">
                <button
                  type="button"
                  onClick={() => setOpenings((n) => Math.max(1, n - 1))}
                  disabled={openings <= 1}
                  aria-label="Decrease"
                  className="flex h-9 w-10 items-center justify-center text-secondary transition-colors hover:text-ink disabled:opacity-40"
                >
                  <MinusIcon className="h-4 w-4" />
                </button>
                <span className="w-12 border-x border-hairline py-2 text-center font-mono text-sm text-ink tabular-nums">
                  {openings}
                </span>
                <button
                  type="button"
                  onClick={() => setOpenings((n) => Math.min(99, n + 1))}
                  aria-label="Increase"
                  className="flex h-9 w-10 items-center justify-center text-secondary transition-colors hover:text-ink"
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Switch 1 — who defines the role */}
            <div>
              <FieldLabel>Who will define this role?</FieldLabel>
              <div className="flex flex-col gap-3">
                {DEFINE_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.key}
                    selected={defineBy === o.key}
                    title={o.title}
                    desc={o.desc}
                    onClick={() => setDefineBy(o.key)}
                  />
                ))}
              </div>

              {/* Inline hiring-manager pick — revealed right under the invite option */}
              {needsManager && (
                <div className="mt-3 flex flex-col gap-4 rounded-xl border border-hairline bg-background/60 p-4">
                  {managers.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-[13px] font-medium text-ink">Previously added</p>
                      {managers.map((m) => {
                        const sel = m.id === managerId
                        return (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => pickManager(m.id)}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                              sel
                                ? 'border-accent bg-accent/[0.04] ring-1 ring-accent/20'
                                : 'border-hairline bg-surface hover:border-ink/20'
                            }`}
                          >
                            <Avatar name={m.name} size={28} />
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
                  )}

                  <div className="flex flex-col gap-2">
                    <p className="text-[13px] font-medium text-ink">
                      {managers.length > 0 ? 'Or add someone new' : 'Add the hiring manager'}
                    </p>
                    <input
                      value={mName}
                      onChange={(e) => {
                        setMName(e.target.value)
                        setManagerId(null)
                      }}
                      placeholder="Full name"
                      className={inputClass}
                    />
                    <input
                      value={mEmail}
                      onChange={(e) => {
                        setMEmail(e.target.value)
                        setManagerId(null)
                      }}
                      type="email"
                      placeholder="name@company.com"
                      className={inputClass}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Switch 2 — who approves candidates */}
            <div>
              <FieldLabel>Who approves candidates?</FieldLabel>
              <div className="flex flex-col gap-3">
                {APPROVE_OPTIONS.map((o) => (
                  <OptionButton
                    key={o.key}
                    selected={approveBy === o.key}
                    title={o.title}
                    desc={o.desc}
                    onClick={() => setApproveBy(o.key)}
                  />
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Sticky action bar — Cancel and Continue always visible */}
      <div className="shrink-0 border-t border-hairline bg-background px-6 py-4 lg:px-8">
        <div className="mx-auto flex w-full max-w-xl items-center justify-end gap-3">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button disabled={!valid} onClick={submit}>
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}
