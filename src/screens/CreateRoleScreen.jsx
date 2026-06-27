import { useState } from 'react'
import { Button, Card } from '../components'
import { SearchIcon, CheckIcon, PlusIcon, MinusIcon } from '../components/icons.jsx'

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

const METHODS = [
  {
    key: 'self',
    title: "I'll define this role myself",
    desc: 'Answer a few questions and Azisly builds the role card with you.',
  },
  {
    key: 'invite',
    title: 'Invite a hiring manager to define it',
    desc: 'Send a secure link so they can define the role. You review it after.',
  },
]

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

export default function CreateRoleScreen({ onCancel, onContinue }) {
  const [query, setQuery] = useState('')
  const [chosen, setChosen] = useState(null) // a role is only "chosen" when picked from the list
  const [open, setOpen] = useState(false)
  const [openings, setOpenings] = useState(1)
  const [method, setMethod] = useState('self')

  const q = query.trim().toLowerCase()
  const matches = q.length >= 2 ? ROLE_SUGGESTIONS.filter((r) => r.toLowerCase().includes(q)) : []
  const showSuggestions = open && q.length >= 2 && !chosen

  const valid = Boolean(chosen) && openings >= 1 && Boolean(method)

  const handleType = (v) => {
    setQuery(v)
    setChosen(null) // editing invalidates any prior choice — must re-pick
    setOpen(true)
  }
  const choose = (r) => {
    setChosen(r)
    setQuery(r)
    setOpen(false)
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
        <p className="text-sm text-secondary">Roles · New</p>
        <h1 className="mt-1.5 text-2xl text-ink">Create a role</h1>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-12 pt-6 lg:px-8">
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

            {/* How to define */}
            <div>
              <FieldLabel>How do you want to define it?</FieldLabel>
              <div className="flex flex-col gap-3">
                {METHODS.map((m) => {
                  const selected = method === m.key
                  return (
                    <button
                      key={m.key}
                      type="button"
                      onClick={() => setMethod(m.key)}
                      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? 'border-accent bg-accent/[0.03] ring-1 ring-accent/20'
                          : 'border-hairline hover:border-ink/20'
                      }`}
                    >
                      <RadioDot selected={selected} />
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-ink">{m.title}</div>
                        <p className="mt-0.5 text-[13px] leading-relaxed text-secondary">{m.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              disabled={!valid}
              onClick={() => onContinue({ title: chosen, openings, method })}
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
